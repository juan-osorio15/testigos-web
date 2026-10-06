# Prompt · pedidos de Pretix en la base de marketing (repo `eventalist-backend`)

> Copiar este documento completo como instrucción al agente que trabaja en `eventalist-backend`. Es autocontenido. Fecha: 2026-10-06. Origen: `docs/medicion-embudo/` del repo del sitio testigosdelamemoria.com. Sigue el flujo de specs del repo (siguiente número libre después de `015-recurring-events`); este documento es la entrada de la especificación.

## Contexto

`apps/marketing` (feature 014) ya guarda contactos de marketing: `MarketingContact` (correo y/o teléfono únicos, consentimiento por canal según Ley 1581 y Ley 2300), `Campaign` (slug estable, ej. `testigos-memoria`) y `CampaignMembership`. Hoy los alimenta el formulario público "avísame" de los sitios de evento (`POST /api/v1/marketing/contacts/submit/`) y la importación por comando.

Ahora se suma una segunda fuente: **los pedidos de Pretix**. Un plugin de Pretix de Eventalist (`pretix-eventalist-tracking`, repo `pretix-wompi`) avisa al backend cada vez que un pedido cambia de etapa: confirmado sin pagar, pagado, vencido o cancelado. El backend guarda el pedido, crea o actualiza el contacto y lo marca según su etapa de compra en la campaña.

Para qué: el equipo exporta desde el admin listas para contacto directo por correo y WhatsApp, separadas por etapa:

- **Confirmó y no pagó**: recordarle que complete la compra.
- **Compró**: no pedirle que compre; otros mensajes (por ejemplo, invitar a alguien más).
- **Interesado** (formulario, sin pedido): avisos de apertura de venta, como hoy.

Y ve un informe simple de ventas por campaña UTM.

El backend **no** envía nada a Meta ni a Google (eso lo hace el plugin de Pretix). Este trabajo es solo recibir, guardar, exportar e informar.

## Endpoint

`POST /api/v1/marketing/ticket-orders/`

- **Autenticación de servicio**: cabecera `Authorization: Bearer <token>`. El token vive en la variable de entorno `PRETIX_SERVICE_TOKEN` (puede haber más de uno separados por comas, para rotarlo sin cortar). Comparar con `hmac.compare_digest`. Sin token válido: `401`. No usa JWT ni el chequeo de `Origin` del formulario público. Solo HTTPS en producción.
- **Sin throttling por IP** (lo llama un servidor), pero con límite alto por token si el repo ya tiene la utilidad.
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
  "stage": "pending",
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

- `stage`: `pending`, `paid`, `expired`, `canceled`.
- `contact.email` y `contact.phone` pueden ser `null`, pero no los dos. Normalizar con las utilidades existentes (`normalize_email_address`, `normalize_phone_number`).
- `campaign` debe existir y estar activa; si no: `409`.
- `contact` es siempre el comprador (los asistentes nunca llegan).
- `consent.channels[].scope`: `event_series_and_local_events` (correo: este encuentro, sus próximas ediciones y otros eventos culturales de Eventalist en Villa de Leyva) o `this_event` (WhatsApp: recordatorio de pago y novedades de este encuentro). `expires_at` puede ser `null`.
- Todas las claves de `attribution` llegan; `null` donde no hay dato. Recortar cada valor a 200 caracteres.

### Respuestas

- `200` `{"status": "ok"}` siempre que se aceptó, incluidas las repeticiones y los eventos viejos ignorados.
- `400` cuerpo inválido (con los errores), `401` token, `409` campaña.
- Nunca `5xx` por datos: solo por fallos reales (el plugin reintenta los `5xx`).
- Responder en menos de 5 s.

## Modelos

### `TicketOrder` (nuevo)

Un pedido de una tienda externa.

- `source` (`pretix`), `instance`, `organizer`, `event_slug`, `order_code`. Única la combinación `(source, instance, organizer, event_slug, order_code)`.
- `campaign` (FK `Campaign`), `contact` (FK `MarketingContact`, `null=True`, `on_delete=SET_NULL`)
- `status` (`pending`, `paid`, `expired`, `canceled`), `status_changed_at` (el `occurred_at` aplicado)
- `testmode`
- `total` (Decimal), `currency`, `items` (JSON)
- `order_created_at`, `paid_at`, `expired_at`, `canceled_at`
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `landing`, `gclid`, `has_ga_session`
- `consent_version`, `consent_accepted_at`
- `created_at`, `updated_at`
- Índices por `campaign`, `status`, `utm_campaign`, `order_created_at`.

### `CampaignMembership` (cambia)

- `stage` nuevo: `interested` (por defecto; formularios e importaciones), `order_pending` (tiene al menos un pedido confirmado sin pagar, vencido o cancelado, y ninguno pagado), `purchased` (tiene al menos un pedido pagado y no cancelado).
- `stage_changed_at`.
- Migración: las filas existentes quedan en `interested`.
- La etapa se **recalcula** desde los `TicketOrder` del contacto en esa campaña cada vez que uno cambia. Así una persona con un pedido vencido y otro pagado queda en `purchased`, y alguien que pagó y luego le cancelaron baja a `order_pending`.

### `ContactConsent` (nuevo)

El dictamen legal exige conservar cada autorización por separado: si la persona ya estaba en la base por el formulario de interesados, la autorización de la tienda se guarda aparte, sin fusionarla ni ampliar una con la otra.

- `contact` (FK), `channel` (`email`, `whatsapp`), `scope` (`event_series_and_local_events`, `this_event`, `form`), `campaign` (FK)
- `source` (`ticket_shop`, `website_form`, `import`, …), `order_code` (si viene de un pedido), `text_version`, `policy_effective`
- `granted_at`, `expires_at` (nulo = sin vencimiento)
- Única `(contact, channel, scope, campaign, source)`; una autorización repetida actualiza `granted_at` solo si es posterior.
- Migración de datos: por cada contacto existente con `email_consent` o `whatsapp_consent`, crear el `ContactConsent` equivalente con `scope=form` (o el `consent_method` que tenga), para que haya una sola forma de consultar.

### `MarketingContact` (cambia poco)

- Nueva opción de `source`: `ticket_shop` ("Ticket shop").
- Nueva opción de `consent_method`: `checkout` ("Checkout checkbox").
- `email_consent` y `whatsapp_consent` pasan a ser derivados: verdadero si el contacto tiene al menos un `ContactConsent` de ese canal vigente (sin vencer) y no hay baja del canal (`*_opted_out_at` nulo). Se recalculan al guardar un `ContactConsent` y con un comando diario `refresh_contact_consents` (cron de Railway) que apaga los vencidos; así el 9 de noviembre de 2026 WhatsApp se apaga solo para los compradores de Testigos. El código que ya lee esos dos campos (filtro `ReachableByListFilter`, exportaciones) sigue funcionando.

## Reglas de proceso

Todo en una transacción, en un servicio (`apps/marketing/services/ticket_order_service.py`), no en la vista.

1. **Idempotencia y orden.** Buscar el `TicketOrder` por la clave única. Si existe y su `status_changed_at` es posterior al `occurred_at` recibido, no cambiar el estado (evento fuera de orden) y responder `200`. Transiciones válidas: `pending` → `paid`, `expired`, `canceled`; `expired` → `paid` (Pretix deja pagar pedidos vencidos), `canceled`; `paid` → `canceled`. Cualquier otra: ignorar con `200` y registrar en el log.
2. **Datos del pedido.** Crear o actualizar `TicketOrder` con lo recibido. La atribución se guarda la primera vez y no se sobrescribe.
3. **Pedidos de prueba.** Si `testmode` es `true`: guardar el `TicketOrder` y crear contactos **solo** si la campaña está en `PRETIX_TESTMODE_CAMPAIGNS` (variable de entorno, slugs separados por comas; en producción, `testigos-sandbox`, una campaña de ensayo que se crea en el admin). En cualquier otra campaña, un pedido de prueba no crea ni toca contactos. Así el ensayo del evento sandbox de Pretix se ve completo en el admin sin mezclar al equipo con los contactos reales.
4. **Contacto.** Buscar con `find_contact_by_email_or_phone`.
   - No existe: crear con `source=ticket_shop`, `source_detail` = nombre de la campaña, `consent_given=True`, `consent_method=checkout`, `consent_at` = `consent.accepted_at`, `preferred_language` de `contact.language`.
   - Existe: completar solo campos vacíos (nombre, apellido, correo o teléfono que falte, si no choca con otro contacto). No sobrescribir nada más.
   - En ambos casos: un `ContactConsent` por cada elemento de `consent.channels`, con `order_code`, `text_version`, `policy_effective`, `granted_at` y `expires_at` del cuerpo; luego recalcular `email_consent` y `whatsapp_consent`.
   - **Una baja no se revierte con una compra posterior**: si el canal tiene `*_opted_out_at`, el `ContactConsent` se guarda (es la prueba de lo que aceptó) pero el canal sigue apagado. Un contacto `do_not_contact` no se toca: se enlaza el pedido y nada más.
   - Si correo y teléfono apuntan a dos contactos distintos: usar el del correo y registrar el conflicto en el log (no fusionar automáticamente).
5. **Membresía.** `get_or_create` de `CampaignMembership` y recálculo de `stage`.

## Admin

- **`TicketOrder`**: lista con código, campaña, estado, total, `utm_campaign`, `utm_content`, contacto y fecha; filtros por campaña, estado, `utm_source`, `utm_campaign`, `utm_content`, `testmode` y rango de fechas; solo lectura (los datos vienen de Pretix).
- **Resumen de ventas por campaña**: una vista de admin (o encabezado de la lista de `TicketOrder`) que, para el filtro actual, muestre por `utm_source` / `utm_campaign` / `utm_content` (con una fila "sin campaña"): pedidos confirmados, pagados, vencidos, cancelados, total pagado y tasa de pago (pagados sobre confirmados). Excluye `testmode`.
- **Contactos**: filtro nuevo por etapa en una campaña (interesado, confirmó y no pagó, compró) y la etapa visible en el inline de membresías; inline de solo lectura con sus `ContactConsent`. Las acciones de exportación CSV existentes funcionan con ese filtro; añadir a la exportación las columnas `campaign_stage`, `stage_changed_at`, `email_scope` y `whatsapp_scope` (alcances vigentes) y `whatsapp_consent_expires_at` (actualizar `contracts/csv-formats.md` de 014).
- **Reglas de las exportaciones** (dictamen legal): solo contactos con el canal vigente y sin baja; WhatsApp solo para la campaña cuyo `ContactConsent` tiene `scope=this_event` en esa campaña (nunca para otros eventos); la lista "confirmó y no pagó" se arma en el momento de exportar, con el estado actual de los pedidos, y excluye a quien ya pagó o tiene el pedido cancelado.

## Lo que este trabajo no hace

El backend no envía mensajes. Los envía el equipo con las listas exportadas, y las reglas de la Ley 2300 (horarios, un mensaje comercial al día, no mezclar canales en la misma semana, baja en cada mensaje) quedan en la guía del equipo del repo del sitio. Si más adelante se automatizan los envíos desde el backend, esas reglas pasan a ser código: ver §D del dictamen (`docs/revision-legal-2026-10-06-embudo.md` en el repo del sitio).

## Pruebas

Criterio del titular: nada de pruebas que se sabe que van a pasar o que solo repiten lo que el código acaba de escribir. Pocas pruebas automáticas, solo de lo que haría daño sin que nadie lo note: mandar un recordatorio de pago a quien ya pagó, escribirle a quien se dio de baja, o perder la prueba de lo que la persona autorizó. La prueba de que todo funciona junto es el ensayo con Pretix.

### Pruebas automáticas (pocas)

1. **Avisos fuera de orden.** Pretix reintenta y los avisos pueden llegar desordenados. Un `pending` que llega después de `paid` no baja a nadie de `purchased`. Una persona con un pedido vencido y otro pagado queda en `purchased`. Un pedido vencido que se paga después pasa a `purchased`.
2. **Lista "confirmó y no pagó".** La exportación no incluye a nadie con un pedido pagado en esa campaña, aunque tenga otro vencido.
3. **Bajas.** Un contacto con baja de WhatsApp que vuelve a comprar sigue sin WhatsApp. Un `do_not_contact` no cambia.
4. **Autorizaciones separadas.** Un interesado del formulario que luego compra conserva las dos autorizaciones por separado. El WhatsApp de la tienda queda apagado después de su `expires_at` al correr `refresh_contact_consents`.
5. **Migración de datos.** Sobre una copia de la base de producción (o un volcado anonimizado), la migración crea un `ContactConsent` por cada canal autorizado y `email_consent` y `whatsapp_consent` quedan con los mismos valores que antes.

No escribir pruebas de: cada variante del token, la cabecera de contrato, cada código de error, campos del serializer ni el admin.

### Ensayo con Pretix (la prueba principal)

Lo dirige el ensayo del plugin de Pretix en el evento sandbox (su prompt lo describe). Del lado del backend, comprobar con capturas del admin, contra el backend de producción y la campaña `testigos-sandbox`: el pedido pagado y su contacto en `purchased`; el pedido sin pagar en `order_pending`; el vencido en `expired`; el resumen de ventas cuenta lo correcto; la exportación "confirmó y no pagó" trae solo al segundo correo. Al terminar, borrar los contactos y pedidos de `testigos-sandbox`.

## Despliegue

- Variables nuevas en Railway: `PRETIX_SERVICE_TOKEN` (aleatorio, 32+ bytes) y `PRETIX_TESTMODE_CAMPAIGNS` (`testigos-sandbox`).
- Crear en el admin la campaña `testigos-sandbox` ("Ensayo Testigos").
- Cron diario en Railway para `refresh_contact_consents`.
- La campaña `testigos-memoria` ya existe (la usa el formulario de interesados).
- Ningún despliegue a producción sin visto bueno del titular.

## Qué devolver al terminar

Un `.md` corto: URL final del endpoint, cómo se genera y rota el token, migraciones creadas y el resultado de la migración de datos (cuántos `ContactConsent` creó), las capturas del admin durante el ensayo con Pretix, y cualquier diferencia con este documento marcada como **CAMBIO**. Se guarda en el repo del sitio como `docs/medicion-embudo/resultado-backend.md`.
