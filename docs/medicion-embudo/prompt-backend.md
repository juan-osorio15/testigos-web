# Prompt · pedidos de Pretix en la base de marketing (repo `eventalist-backend`)

> Copiar este documento completo como instrucción al agente que trabaja en `eventalist-backend`. Es autocontenido. **Versión 2, 2026-10-06**: incorpora la revisión del agente de este repo contra el código de `apps/marketing`. La fuente de verdad es `docs/medicion-embudo/` del repo del sitio testigosdelamemoria.com; si algo aquí contradice el código, avisar antes de desviarse. Sigue el flujo de specs del repo (`specs/016-...`); este documento es la entrada de la especificación.

## Contexto

`apps/marketing` (feature 014) ya guarda contactos de marketing: `MarketingContact` (correo y/o teléfono únicos, consentimiento por canal según Ley 1581 y Ley 2300), `Campaign` (slug estable, ej. `testigos-memoria`) y `CampaignMembership`. Hoy los alimentan el formulario público "avísame" de los sitios de evento (`POST /api/v1/marketing/contacts/submit/`), la importación por comando y el admin.

Ahora se suma una fuente nueva: **los pedidos de Pretix**. Un plugin de Pretix de Eventalist (`pretix-eventalist-tracking`, repo `pretix-wompi`) envía al backend una **foto del estado actual** de cada pedido cada vez que cambia (confirmado sin pagar, pagado, vencido, cancelado, y también reactivaciones, extensiones de plazo y cambios de total). El backend guarda el pedido, crea o completa el contacto, guarda la autorización que dio en la tienda y lo marca según su etapa de compra en la campaña.

Para qué: el equipo exporta desde el admin listas para contacto directo por correo y WhatsApp, separadas por etapa:

- **Confirmó y no pagó**: recordarle que complete la compra.
- **Compró**: no pedirle que compre; otros mensajes del mismo encuentro (por ejemplo, invitar a alguien más).
- **Interesado** (formulario, sin pedido): avisos de apertura de venta, como hoy.

Y ve un informe simple de ventas por campaña UTM.

El backend **no** envía nada a Meta ni a Google (eso lo hace el plugin) y **no** envía mensajes (los envía el equipo con las listas exportadas). Este trabajo es recibir, guardar, exportar e informar, y llevar las autorizaciones a un modelo que sirva para las dos fuentes.

## Restricciones legales

Vienen del dictamen del abogado interno del 2026-10-06 (`docs/revision-legal-2026-10-06-embudo.md` en el repo del sitio):

- Cada autorización se conserva por separado y no se sobrescribe: si la persona estaba por el formulario y luego compra, quedan las dos. Si vuelve a comprar con otra versión del texto, quedan ambas versiones.
- Una baja no se revierte con una compra posterior.
- WhatsApp de la tienda: solo para la campaña del pedido (recordatorio de pago y novedades de ese encuentro) y solo hasta su vencimiento.
- Solo el comprador entra a la base; los asistentes nunca llegan.
- Solo llegan pedidos creados después de que se publicó la casilla nueva (el plugin filtra; el backend no lo valida).

**Decisión del titular (2026-10-06)**: el teléfono es obligatorio en el checkout de Pretix, así que casi todo pedido trae `whatsapp` en `consent.channels`. No cambia nada del código.

## Endpoint

`POST /api/v1/marketing/ticket-orders/`

- **Autenticación de servicio**: cabecera `Authorization: Bearer <token>`. El token vive en `PRETIX_SERVICE_TOKEN` (varios separados por comas, para rotar sin cortar). Comparar con `hmac.compare_digest`. Sin token válido: `401`.
- La vista lleva `@authentication_classes([])` y un permiso propio que valida el token: la autenticación por defecto de `REST_FRAMEWORK` es `JWTAuthentication` y, sin esto, simplejwt rechaza el token de Pretix con `401` antes de llegar a la vista. No usa el chequeo de `Origin` del formulario público. Sin throttling (lo llama un servidor; no hay utilidad de límite por token en el repo y no hace falta crearla).
- Cabecera `X-Eventalist-Contract: 1`. Si llega otro valor: `400`.
- Documentado en drf-spectacular como los demás.

### Cuerpo

```json
{
  "source": "pretix",
  "instance": "pretix.eventalist.co",
  "organizer": "eventalist",
  "event": "testigos-memoria",
  "campaign": "testigos-memoria",
  "order_code": "ABC12",
  "status": "pending",
  "sequence": 48213,
  "occurred_at": "2026-10-10T15:04:05-05:00",
  "order_created_at": "2026-10-10T15:04:05-05:00",
  "testmode": false,
  "total": "310000.00",
  "currency": "COP",
  "items": [{"name": "Pase completo", "quantity": 1, "price": "310000.00"}],
  "contact": {
    "email": "persona@correo.com",
    "phone": "+573001234567",
    "first_name": "Ana",
    "last_name": "Pérez",
    "language": "es"
  },
  "consent": {
    "version": "tienda-2026-10-12",
    "policy_effective": "2026-10-12",
    "accepted_at": "2026-10-10T15:04:05-05:00",
    "channels": [
      {"channel": "email", "scope": "event_series_and_local_events", "expires_at": null},
      {"channel": "whatsapp", "scope": "this_event", "expires_at": "2026-11-08T23:59:59-05:00"}
    ]
  },
  "attribution": {
    "utm_source": "meta", "utm_medium": "paid", "utm_campaign": "preventa",
    "utm_content": "afiche", "utm_term": null,
    "landing": "/", "gclid": null, "has_ga_session": true
  }
}
```

- `status`: estado **actual** del pedido (`pending`, `paid`, `expired`, `canceled`). No es una transición: es una foto.
- `sequence`: entero que crece con cada cambio del pedido en Pretix. Gana la foto con el `sequence` mayor; las menores o iguales a la guardada se descartan con `200`. `occurred_at` es informativo.
- `total` e `items`: los actuales (un pedido pendiente puede cambiar de total).
- `contact` es siempre el comprador. `email` y `phone` pueden ser `null`, pero no los dos. Nombre y apellido pueden ser `null`.
- `consent` siempre llega (el plugin solo envía pedidos con consentimiento). Si faltara o trajera `channels: []`, se guarda el pedido sin crear ni tocar el contacto, y se registra en el log.
- `consent.channels[].scope`: `event_series_and_local_events` (correo: este encuentro, sus próximas ediciones y otros eventos culturales de Eventalist en Villa de Leyva) o `this_event` (WhatsApp: recordatorio de pago y novedades de este encuentro). `expires_at` puede ser `null`.
- Todas las claves de `attribution` llegan; `null` donde no hay dato. Recortar cada valor a 200 caracteres.

### Respuestas

- `200` `{"status": "ok"}` siempre que se aceptó, incluidas repeticiones y fotos viejas descartadas.
- `400` solo para cuerpos que no se pueden interpretar (JSON inválido, faltan `order_code`, `status` o `sequence`, contrato distinto). **Datos raros no son `400`**: un teléfono que no normaliza se descarta (el contacto queda solo con correo; si tampoco hay correo válido, se guarda el pedido sin contacto), se registra en el log y se responde `200`. Perder un pedido por un teléfono mal escrito es peor que guardarlo incompleto.
- `401` token.
- `409` solo si el slug de campaña **no existe**. Una campaña existente pero inactiva se acepta: `is_active` cierra el formulario público, no la tienda. Si se rechazaran, un pedido pagado después de desactivar la campaña se perdería (el plugin no reintenta `4xx`).
- `5xx` solo por fallos reales (el plugin los reintenta). Responder en menos de 5 s.

## Modelos

### `TicketOrder` (nuevo)

Un pedido de una tienda externa. Guarda la última foto.

- `source` (`pretix`), `instance`, `organizer`, `event_slug`, `order_code`. Única la combinación `(source, instance, organizer, event_slug, order_code)`.
- `campaign` (FK `Campaign`), `contact` (FK `MarketingContact`, `null=True`, `on_delete=SET_NULL`)
- `status` (`pending`, `paid`, `expired`, `canceled`), `last_sequence`, `status_changed_at` (el `occurred_at` de la foto aplicada)
- `testmode`
- `total` (Decimal), `currency`, `items` (JSON)
- `order_created_at`, `first_paid_at` (la primera vez que llegó `paid`; no se borra)
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `landing`, `gclid`, `has_ga_session` (se guardan con la primera foto y no se sobrescriben)
- `consent_version`, `consent_accepted_at`
- `created_at`, `updated_at`
- Índices por `campaign`, `status`, `utm_campaign`, `order_created_at`.

### `ContactConsent` (nuevo): la fuente de verdad de las autorizaciones

Historial de solo inserción: cada autorización es una fila nueva; nunca se actualiza ni se borra (salvo por petición del titular del dato, por el procedimiento de la política).

- `contact` (FK), `channel` (`email`, `whatsapp`)
- `scope` (`event_series_and_local_events`, `this_event`, `general`)
- `campaign` (FK `Campaign`, **nulo permitido**: nulo = autorización no ligada a una campaña, como las de importaciones generales)
- `source` (`ticket_shop`, `website_form`, `import`, `manual`), `method` (el `consent_method` que corresponda: `checkout`, `website_form`, `imported_list`, …)
- `order_code` (si viene de un pedido), `text_version`, `policy_effective`
- `granted_at`, `expires_at` (nulo = sin vencimiento)
- Sin restricción única (es un historial; así no hace falta `nulls_distinct` ni depender de la versión de PostgreSQL de Neon).

**Vigencia, calculada en el momento**: un contacto puede recibir por un canal en una campaña si existe un `ContactConsent` de ese canal con `expires_at` nulo o futuro, cuya `campaign` es esa campaña o nula, y el canal no tiene baja (`*_opted_out_at` nulo). Se implementa como selector con `Exists(...)`. **Sin cron**: el WhatsApp de la tienda deja de valer solo, en el instante exacto en que vence.

Alcances y WhatsApp:

- `this_event` (tienda): vale solo para su campaña.
- `general` con campaña (formulario de esa campaña): vale para esa campaña, por correo y por WhatsApp, como hoy ("avisos de apertura de venta").
- `general` sin campaña (importaciones): vale para cualquier campaña, como hoy.
- `event_series_and_local_events` (correo de la tienda): vale para cualquier campaña de Eventalist; el equipo es responsable de usarlo solo para eventos culturales en Villa de Leyva (la regla queda escrita en la guía del equipo; el backend no clasifica campañas por tema).

### `MarketingContact` (cambia)

- Nueva opción de `source`: `ticket_shop`. Nueva opción de `consent_method`: `checkout`.
- `email_consent` y `whatsapp_consent` **dejan de ser la verdad**. Migración de datos: por cada contacto con alguno en verdadero, crear el `ContactConsent` equivalente (`scope=general`, `campaign` = la campaña si el contacto tiene exactamente una membresía de formulario, nula en otro caso, `source` y `method` según su `source` y `consent_method`, `granted_at` = `consent_at` o `created_at`). Después, esos dos campos se eliminan o quedan como valores calculados de solo lectura (decidir en la spec lo que menos rompa). Ningún código los vuelve a escribir.
- Hay que actualizar todo lo que hoy los escribe:
  - el formulario público (`contact_submission_serializers.py`): crea un `ContactConsent` por canal (`general`, campaña del formulario, `website_form`);
  - la importación (`contact_import_service.py`): crea `ContactConsent` (`general`, sin campaña, `import`);
  - el admin: los campos pasan a solo lectura y se agrega un inline para registrar una autorización manual (`source=manual`, con fecha y nota obligatorias).
- `consent_given`, `consent_at` y `consent_method` se conservan como datos de la primera captación, sin cambios.
- Las bajas (`email_opted_out_at`, `whatsapp_opted_out_at`, `status=do_not_contact`) siguen en el contacto y mandan sobre cualquier `ContactConsent`.

### `CampaignMembership` (cambia)

- `stage` nuevo, calculado desde los `TicketOrder` del contacto en esa campaña cada vez que uno cambia:
  - `purchased`: tiene al menos un pedido `paid`.
  - `order_pending`: no tiene pagados y tiene al menos uno `pending` o `expired`.
  - `order_canceled`: solo tiene pedidos `canceled`.
  - `interested`: no tiene pedidos (formularios e importaciones). Por defecto.
- `stage_changed_at`.
- Migración: las filas existentes quedan en `interested`.

## Reglas de proceso

Todo en una transacción, en un servicio (`apps/marketing/services/ticket_order_service.py`), no en la vista.

1. **Bloqueo y orden.** `select_for_update` sobre el `TicketOrder` (o crearlo dentro de la transacción manejando la carrera de inserción). Si `sequence` ≤ `last_sequence`, no cambiar nada y responder `200`. Si es mayor, aplicar la foto completa: `status`, `total`, `items`, `status_changed_at`, `last_sequence`; `first_paid_at` si es el primer `paid`.
2. **Pedidos de prueba.** Si `testmode` es `true`: guardar el `TicketOrder`, y tocar contactos **solo** si la campaña está en `PRETIX_TESTMODE_CAMPAIGNS` (en producción, `testigos-sandbox`). El resumen de ventas y las exportaciones excluyen `testmode`.
3. **Contacto.** Buscar con `find_contact_by_email_or_phone` (con lo que haya normalizado bien).
   - No existe: crear con `source=ticket_shop`, `source_detail` = nombre de la campaña, `consent_given=True`, `consent_method=checkout`, `consent_at` = `consent.accepted_at`, `preferred_language` de `contact.language`.
   - Existe: completar solo campos vacíos (nombre, apellido, correo o teléfono que falte, si no choca con otro contacto). No sobrescribir nada más.
   - Si correo y teléfono apuntan a dos contactos distintos: usar el del correo y registrar el conflicto en el log (no fusionar).
   - `do_not_contact`: se enlaza el pedido y nada más.
4. **Autorizaciones.** Un `ContactConsent` nuevo por cada elemento de `consent.channels` (`source=ticket_shop`, `method=checkout`, campaña del pedido, `order_code`, versión, vigencia), **solo la primera vez** que se procesa ese pedido (las fotos siguientes del mismo pedido no duplican filas). Una baja existente no se toca: la fila se guarda como prueba, pero el canal sigue apagado.
5. **Membresía.** `get_or_create` de `CampaignMembership` y recálculo de `stage`.

## Admin

- **`TicketOrder`**: lista con código, campaña, estado, total, `utm_campaign`, `utm_content`, contacto y fecha; filtros por campaña, estado, `utm_source`, `utm_campaign`, `utm_content`, `testmode` y rango de fechas; solo lectura.
- **Resumen de ventas por campaña**: vista de admin que, para el filtro actual, muestre por `utm_source` / `utm_campaign` / `utm_content` (con una fila "sin campaña"): pedidos confirmados, pagados, vencidos, cancelados, total pagado y tasa de pago (pagados sobre confirmados). Excluye `testmode`.
- **Contactos**:
  - Filtro "etapa en la campaña" implementado como subconsulta sobre `CampaignMembership` (misma fila de campaña y etapa). Encadenarlo con el filtro `campaigns` existente haría que Django una membresías distintas y dé resultados equivocados.
  - Inline de membresías con la etapa; inline de solo lectura con el historial de `ContactConsent` más el alta manual.
- **Exportaciones**:
  - Las de WhatsApp exigen que haya **una campaña filtrada** (si no, la acción se niega con un mensaje). Solo incluyen contactos con autorización de WhatsApp vigente para esa campaña según la regla de vigencia.
  - Las de correo también usan la vigencia por campaña cuando hay una campaña filtrada.
  - La lista "confirmó y no pagó" es exactamente `stage=order_pending` en la campaña filtrada, armada en el momento de exportar.
  - Columnas nuevas al final del CSV: `campaign_stage`, `stage_changed_at`, `email_scope`, `whatsapp_scope`, `whatsapp_consent_expires_at`. Antes, revisar en `specs/014-marketing-contacts/contracts/csv-formats.md` quién consume esos archivos (subidas a Meta, herramientas de envío) y confirmar que agregar columnas al final no rompe nada; actualizar ese contrato.

## Lo que este trabajo no hace

El backend no envía mensajes. Los envía el equipo con las listas exportadas, y las reglas de la Ley 2300 (horarios, un mensaje comercial al día, no mezclar canales en la misma semana, baja en cada mensaje, máximo dos recordatorios por pedido) quedan en la guía del equipo del repo del sitio. Si más adelante se automatizan los envíos, esas reglas pasan a ser código: ver §D del dictamen.

## Pruebas

Criterio del titular: nada de pruebas que se sabe que van a pasar o que solo repiten lo que el código acaba de escribir. Pocas pruebas automáticas, solo de lo que haría daño sin que nadie lo note: mandar un recordatorio de pago a quien ya pagó, escribirle a quien se dio de baja o sin autorización vigente, o perder la prueba de lo que la persona autorizó. La prueba de que todo funciona junto es el ensayo con Pretix.

### Pruebas automáticas (pocas)

1. **Fotos fuera de orden.** Una foto `pending` con `sequence` menor que la `paid` guardada no cambia nada. Un pedido pagado que vuelve a `pending` (con `sequence` mayor) deja el contacto en `order_pending`; un cancelado reactivado vuelve a `pending`. Una persona con un pedido vencido y otro pagado queda en `purchased`.
2. **Lista "confirmó y no pagó".** No incluye a nadie con un pedido pagado en esa campaña, aunque tenga otro vencido, ni a quien solo tiene cancelados.
3. **Autorizaciones y bajas.** Un contacto con baja de WhatsApp que vuelve a comprar sigue sin WhatsApp. Un `do_not_contact` no cambia. El WhatsApp de la tienda deja de ser vigente al pasar su `expires_at`, sin correr nada. El WhatsApp de la tienda de Testigos no aparece en la exportación de WhatsApp de otra campaña. Un interesado del formulario que luego compra conserva las dos autorizaciones.
4. **Las otras fuentes siguen dando permiso.** Un contacto nuevo del formulario y uno importado quedan con autorización vigente tras el cambio (es lo que más fácil se rompe al mover la verdad a `ContactConsent`).
5. **Migración de datos.** Sobre una copia de la base de producción (o un volcado anonimizado): cada contacto que antes tenía `email_consent` o `whatsapp_consent` sigue pudiendo recibir por el mismo canal en las mismas campañas.

No escribir pruebas de: cada variante del token, la cabecera de contrato, cada código de error, campos del serializer ni el admin.

### Ensayo con Pretix (la prueba principal)

Lo dirige el ensayo del plugin de Pretix en el evento sandbox. Del lado del backend, comprobar con capturas del admin, contra el backend de producción y la campaña `testigos-sandbox`: el pedido pagado y su contacto en `purchased`; el pedido sin pagar en `order_pending`; el vencido que pasa a `expired` y vuelve a `pending` al extenderle el plazo; el resumen de ventas cuenta lo correcto; la exportación "confirmó y no pagó" trae solo al segundo correo. Al terminar, borrar los contactos y pedidos de `testigos-sandbox`.

## Despliegue

- Variables nuevas en Railway: `PRETIX_SERVICE_TOKEN` (aleatorio, 32+ bytes) y `PRETIX_TESTMODE_CAMPAIGNS` (`testigos-sandbox`).
- Crear en el admin la campaña `testigos-sandbox` ("Ensayo Testigos").
- La campaña `testigos-memoria` ya existe (la usa el formulario de interesados).
- Ningún despliegue a producción sin visto bueno del titular.

## Qué devolver al terminar

Un `.md` corto: URL final del endpoint, cómo se genera y rota el token, migraciones creadas y el resultado de la migración de datos (cuántos `ContactConsent` creó y la comprobación de que nadie perdió permisos), qué se decidió sobre los campos `email_consent` y `whatsapp_consent`, lo que se encontró sobre los consumidores del CSV, las capturas del admin durante el ensayo con Pretix, y cualquier diferencia con este documento marcada como **CAMBIO**. Se guarda en el repo del sitio como `docs/medicion-embudo/resultado-backend.md`.
