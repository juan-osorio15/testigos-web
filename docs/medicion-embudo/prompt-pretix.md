# Prompt · plugin `pretix-eventalist-tracking` (repo `pretix-wompi`)

> Copiar este documento completo como instrucción al agente que trabaja en el repo `pretix-wompi`. Es autocontenido. **Versión 2, 2026-10-06**: incorpora la revisión del agente de este repo contra el código de pretix 2026.5.4. La fuente de verdad es `docs/medicion-embudo/` del repo del sitio testigosdelamemoria.com; si algo aquí contradice el código, avisar antes de desviarse. Reemplaza el plan archivado `pretix-tdm-attribution` (queda una carpeta `pretix-tdm-attribution/` con solo cachés: bórrala).

## Antes de este plugin: dos PR propios

Salieron en la revisión y son riesgos de producción que existen hoy, sin el plugin. Cada uno en su PR, con visto bueno del titular, **antes** del PR del plugin:

1. **Subir pretix a 2026.5.4.** El `Dockerfile` y `docs/RAILWAY-DEPLOY.md` fijan 2026.5.1, afectada por la CVE-2026-13602 (crítica); `CLAUDE.md` prohíbe bajar de 2026.5.3. El plugin se desarrolla y prueba sobre 2026.5.4.
2. **Recuperar el barrido de respaldo de Wompi.** Hoy, si un webhook de Wompi se pierde o falla, el pago puede no confirmarse nunca: el dinero entra y el pedido queda sin pagar. Dos causas (diagnóstico del 2026-10-06): (a) el barrido y la vista de retorno consultaban a Wompi con la llave pública y Wompi responde 404; ya corregido para usar la llave privada (rama `fix/wompi-sweep-private-key`); (b) el barrido solo revisa pagos cuyo id de transacción ya conoce, que llega por el webhook o cuando el comprador vuelve a la tienda; si el webhook falla y el comprador cierra la pestaña, nadie lo ve. Hace falta buscar en Wompi por `reference`. La documentación oficial de Wompi no menciona esa búsqueda: **comprobarla primero en el ambiente de pruebas de Wompi** y, si no existe, avisar antes de buscar otro camino. Demostración en el evento `testigos-sandbox`: pago aprobado con el webhook bloqueado y **sin volver a la tienda** (si el comprador vuelve, quien confirma es la vista de retorno, no el barrido); el barrido lo confirma.

## Contexto

Eventalist vende boletas con su Pretix propio (`pretix.eventalist.co`, imagen de este repo: `pretix/standalone` + `pretix-wompi` + `pretixcron` + dos workers de celery, en Railway). Los sitios de cada evento (el primero: testigosdelamemoria.com, Astro estático) embeben el widget de Pretix con `disable-iframe`, así que el checkout ocurre en una pestaña de `pretix.eventalist.co` y el pago en Wompi. El Google Analytics 4 y el píxel de Meta del sitio no ven lo que pasa en Pretix.

Queremos un embudo por campaña UTM: visita, clic, "Comprar", **pedido confirmado sin pagar**, **pedido pagado**. Los dos últimos pasos solo existen en Pretix. Este plugin:

1. Guarda en cada pedido la campaña y los identificadores de la visita que el sitio pasa al widget.
2. Avisa a GA4 (Measurement Protocol) y a Meta (Conversions API) cuando un pedido se confirma y cuando se paga.
3. Envía al backend de Eventalist el contacto y el estado actual del pedido cada vez que cambia, para la base de contactos de marketing (retargeting por correo y WhatsApp).

Es reutilizable: se activa por evento y se configura desde el panel. No hay nada de "Testigos" en el código.

Valores del stack que no se negocian (ver `CLAUDE.md` de este repo): cero fricción en la compra, nada que sorprenda al comprador. **Este plugin no cambia el checkout**: ni pasos, ni campos, ni textos, ni tiempos. Si un envío falla, la compra sigue igual; se reintenta en segundo plano. Nunca se llama a un servicio externo dentro de la petición del comprador ni dentro de la transacción de un pago.

## Seguridad de las señales (lo más importante de este documento)

Pretix no atrapa los errores de los receptores de señales (`base/signals.py`), y `order_paid` se dispara dentro de la transacción que confirma el pago (`models/orders.py`). Si el plugin falla ahí, se revierte la confirmación del pago de Wompi; el webhook de Wompi ya respondió 200 y no reintenta. Por eso, **en todos los receptores** (`order_api_meta_from_request`, `order_placed`, `order_paid`, `order_expired`, `order_canceled`, cualquier otro):

- Todo el cuerpo dentro de `try/except Exception`, que registra el error en el log (sin datos personales) y sigue.
- Toda escritura en la base dentro de un `transaction.atomic()` anidado (punto de guardado), para que un error de base de datos atrapado no deje inservible la transacción del pago.
- El receptor solo crea filas de `Dispatch` y encola con `transaction.on_commit`. Nada de HTTP, nada de cálculos pesados, nada que pueda tardar.

Es la primera prueba automática que se escribe (ver Pruebas).

## Restricciones legales (no negociables)

Vienen del dictamen del abogado interno del 2026-10-06 (`docs/revision-legal-2026-10-06-embudo.md` en el repo del sitio). La autorización es una sola casilla obligatoria del checkout, reescrita; el plugin no añade casillas.

1. Solo pedidos creados en o después de `consent_since` van a cualquier destino. Los anteriores no se tocan, aunque se paguen después. Si `consent_since` está vacío, ningún pedido tiene consentimiento y no se envía nada.
2. Solo datos del comprador. Nunca nombres de asistentes.
3. A GA4 nada personal: ni correo, ni teléfono, ni nombre, ni sus hashes, ni `user_id`.
4. A Meta, correo, teléfono y nombre solo en SHA-256, normalizados en el servidor. Nunca en claro en logs.
5. `_ga`, `_fbp` y `_fbc` solo existen en el pedido si la persona aceptó cookies en el sitio (el sitio no los pasa en otro caso).
6. Quien pida no estar en publicidad entra en la lista de exclusiones **del organizador** y deja de ir a Meta **y a GA4**, en todos los eventos.

**Decisión del titular (2026-10-06)**: el teléfono sigue siendo obligatorio en el checkout (lo necesita Wompi para llegar con los datos llenos). Por tanto todo comprador autoriza WhatsApp en los términos de la casilla. El dictamen contaba con el teléfono opcional como atenuante; el titular asume ese riesgo. No cambia nada del código.

## Lo que llega del sitio

El sitio pone atributos `data-tracking-*` en `<pretix-widget>`. Con `disable-iframe`, el widget manda todos los `data-*` sin el prefijo en el campo oculto `widget_data`, y `cart.py` lo guarda en `cart_session(request)['widget_data']` (verificado en 2026.5.4). Claves posibles, todas opcionales:

- `tracking-utm-source`, `tracking-utm-medium`, `tracking-utm-campaign`, `tracking-utm-content`, `tracking-utm-term`
- `tracking-gclid`, `tracking-landing` (ruta de llegada, ej. `/`)
- `tracking-ga-id` (client_id de GA4, ej. `1234567890.1700000000`), `tracking-ga-sessid` (session_id, ej. `1700000000`)
- `tracking-fbp` (ej. `fb.1.1700000000000.1234567890`), `tracking-fbc` (ej. `fb.1.1700000000000.AbCdEf`)
- `tracking-consent` = `1` si la persona aceptó el aviso de cookies del sitio

Las UTM pueden venir sin `ga-id`, `fbp` ni `fbc` (persona que no aceptó cookies). Un pedido hecho entrando directo a la tienda no trae nada.

## 1. Captura en el pedido

Receptor de `pretix.presale.signals.order_api_meta_from_request` (recibe solo `request`; se llama justo antes de crear el pedido y lo devuelto se fusiona con `api_meta.update(...)` en `presale/checkoutflow.py`). Devuelve:

```python
{"tracking": {
    # claves de widget_data que empiezan por "tracking-": sin el prefijo, guiones -> "_"
    "utm_source": "meta", "utm_medium": "paid", "utm_campaign": "preventa", "utm_content": "afiche",
    "ga_id": "...", "ga_sessid": "...", "fbp": "...", "fbc": "...", "gclid": "...",
    "landing": "/", "consent": "1",
    # siempre, aunque no haya widget_data:
    "client_ip": "181.55.1.2",
    "client_user_agent": "Mozilla/5.0 ...",
    "captured_at": "2026-10-10T15:04:05-05:00",
}}
```

- Valores vacíos no se copian; cada valor recortado a 512 caracteres (IP a 64).
- **IP**: con `pretix.helpers.http.get_client_ip`, que solo lee `X-Forwarded-For` si `TRUST_X_FORWARDED_FOR` está activo. Comprobar en Railway que lo está y que la IP guardada es la del comprador, no la del proxy. Si no se puede activar, no enviar la IP a Meta (mejor nada que la del proxy) y anotarlo como **CAMBIO**.

**Prueba del consentimiento**: si `consent_since` tiene valor y la hora actual es igual o posterior, el receptor añade también:

```python
{"consent": {
    "version": "tienda-2026-10-12",          # ajuste consent_version
    "policy_effective": "2026-10-12",         # ajuste policy_effective
    "accepted_at": "2026-10-12T15:04:05-05:00",  # momento de confirmación del pedido
}}
```

La prueba de lo que aceptó cada comprador son **los dos registros juntos**: la entrada `pretix.event.order.consent` que Pretix ya guarda en el log del pedido con el texto mostrado (`services/orders.py`) y `api_meta.consent`. `api_meta` se puede modificar por la API REST; el log no.

Un pedido sin `api_meta.consent` es anterior a la casilla nueva y **no se envía a ningún destino**. Si algo falla en este receptor, devolver solo `client_ip`, `client_user_agent` y `captured_at` (ver "Seguridad de las señales").

## 2. Envíos

### Cuándo

Receptores de señales de pretix, solo en eventos con el plugin activo (`EventPluginSignal`):

- `order_placed` → etapa **placed**. Todos los pedidos nacen pendientes (`services/orders.py`); **si `order.total == 0`, no se crea la etapa placed** (un pedido gratis no tiene pago pendiente).
- `order_paid` → etapa **paid**.
- `order_expired` → etapa **expired**.
- `order_canceled` → etapa **canceled**.

Matriz de destinos:

- placed → `ga4` (`add_payment_info`), `meta` (`AddPaymentInfo`), `backend`
- paid → `ga4` (`purchase`), `meta` (`Purchase`), `backend`
- expired → `backend`
- canceled → `backend`

**Estado del pedido hacia el backend.** Pretix también cambia pedidos sin las señales anteriores: un pagado que vuelve a pendiente, un cancelado que se reactiva, un vencido al que se le extiende el plazo, un pendiente al que se le cambia el total. Para el backend no se envían "etapas" sino **una foto del estado actual del pedido** cada vez que cambia: en cada señal de arriba y, además, en el barrido periódico, que revisa los pedidos de eventos con el plugin activo cuyo `last_modified` es posterior a la última revisión y cuyo estado o total difiere de la última foto enviada. Si existe una señal específica para reactivación o extensión en 2026.5.4, usarla también.

### Modelo `Dispatch`

- `order` (FK a `Order`, `on_delete=CASCADE`), `destination` (`ga4`, `meta`, `backend`), `stage` (`placed`, `paid`, `expired`, `canceled`, `snapshot`)
- `status` (`pending`, `retry`, `sent`, `skipped`, `failed`), `attempts`, `next_attempt_at`, `sent_at`, `last_error` (texto corto, sin datos personales), `response` (JSON, recortado), `created_at`
- Para `ga4` y `meta`: restricción única `(order, destination, stage)`; las señales repetidas no duplican. Limitación conocida y aceptada: un pedido pagado, cancelado y reactivado no vuelve a enviar `purchase` ni `Purchase`.
- Para `backend`: una fila por foto, sin restricción única. Su `pk` es el `sequence` del contrato (crece en el orden en que ocurrieron los cambios). El cuerpo de la foto se arma al enviar, con el estado del pedido en ese momento, para que un reintento nunca mande datos viejos.

### Reintentos y cola

- Una tarea de celery por fila, con **`queue='background'`** explícito. La cola por defecto la atiende el worker del comprador, donde vive `tickets.generate` (ya causó el incidente de descargas atascadas); este plugin nunca debe ocuparla.
- Ante timeout, error de red o `5xx`: `retry` con `next_attempt_at` en 5 min, 15 min, 1 h, 6 h, 24 h; después `failed`. Ante `4xx`: `failed` de inmediato con el motivo en `last_error`.
- Receptor de `periodic_task` (lo dispara `pretixcron` cada 5 min con `runperiodic`): encola las filas `pending` o `retry` vencidas y hace el barrido de fotos del backend. Debe ser rápido: solo consultas y encolar.
- Timeout de cada petición HTTP: 10 s. Biblioteca `requests` (ya es dependencia).

### Cuándo se omite (fila `skipped` con el motivo)

- Plugin sin configurar para ese destino (faltan ID o secreto).
- Todos los destinos: pedido sin `api_meta.consent`. Motivo `anterior al consentimiento`. Se decide por la fecha de creación, nunca por la de pago.
- `ga4` y `meta`: correo o teléfono del pedido en las exclusiones del organizador. Motivo `excluido a pedido`.
- `meta` y `backend`: pedido sin correo ni teléfono.
- Pedidos de prueba (`order.testmode`, solo existen en el evento `testigos-sandbox`): `ga4` va al endpoint de depuración (valida el cuerpo sin ensuciar los informes), salvo que el ajuste `ga4_send_testmode` esté activo, que lo manda al endpoint normal con el parámetro `entorno: "prueba"` (solo durante el ensayo, para ver la atribución en Tiempo real; se apaga después); `meta` solo si hay `meta_test_event_code` (y lo incluye); `backend` con `"testmode": true`.
- `meta` etapa paid: si pasaron más de 7 días desde el pago (Meta rechaza el lote).

### GA4 (Measurement Protocol)

`POST https://www.google-analytics.com/mp/collect?measurement_id={ga4_measurement_id}&api_secret={ga4_api_secret}` (validación: `/debug/mp/collect`, que sí devuelve errores; producción responde 2xx aunque el cuerpo esté mal).

```json
{
  "client_id": "1234567890.1700000000",
  "timestamp_micros": 1760126645000000,
  "consent": {"ad_user_data": "DENIED", "ad_personalization": "DENIED"},
  "events": [{
    "name": "purchase",
    "params": {
      "transaction_id": "ABC12",
      "currency": "COP",
      "value": 310000,
      "session_id": "1700000000",
      "engagement_time_msec": 1,
      "atribucion": "sesion",
      "items": [{"item_id": "12", "item_name": "Pase completo", "price": 310000, "quantity": 1}]
    }
  }]
}
```

- `add_payment_info` lleva lo mismo sin `transaction_id` y con `"payment_type": "<proveedor de pago del pedido>"`.
- `client_id` = `tracking.ga_id`. **Si no hay `ga_id`** (no aceptó cookies o compró directo en la tienda), se envía igual con `client_id` = `pretix.<primeros 16 hex del sha256 del código del pedido>`, sin `session_id`, y `"atribucion": "sin_sesion"`. Así los ingresos de GA4 cuadran con Pretix aunque esa compra salga sin campaña.
- `session_id` y `engagement_time_msec` hacen que el evento herede fuente, medio y campaña de la sesión del sitio. Se verifica en el ensayo.
- `timestamp_micros`: momento de la etapa. Si tiene más de 72 h, omitirlo.
- `value`: `order.total` como número; `items` de las posiciones del pedido (id y nombre del producto, precio, cantidad agrupada por producto).

### Meta (Conversions API)

`POST https://graph.facebook.com/{version}/{meta_dataset_id}/events?access_token={meta_capi_token}`. Versión vigente de la Graph API al implementar, en una constante.

```json
{
  "data": [{
    "event_name": "Purchase",
    "event_time": 1760126645,
    "event_id": "ABC12-paid",
    "action_source": "website",
    "event_source_url": "https://pretix.eventalist.co/eventalist/testigos-memoria/",
    "user_data": {
      "em": ["<sha256>"], "ph": ["<sha256>"], "fn": ["<sha256>"], "ln": ["<sha256>"],
      "country": ["<sha256 de 'co'>"],
      "external_id": ["<sha256 del correo normalizado, o del teléfono si no hay correo>"],
      "fbp": "fb.1....", "fbc": "fb.1....",
      "client_ip_address": "181.55.1.2",
      "client_user_agent": "Mozilla/5.0 ..."
    },
    "custom_data": {
      "currency": "COP", "value": 310000, "order_id": "ABC12",
      "content_type": "product",
      "contents": [{"id": "12", "quantity": 1, "item_price": 310000}],
      "utm_campaign": "preventa", "utm_content": "afiche"
    }
  }],
  "test_event_code": "TEST12345"
}
```

- `event_name`: `AddPaymentInfo` (placed) o `Purchase` (paid). `event_id`: `<código>-placed` o `<código>-paid`.
- `external_id` por persona (no por pedido): Meta junta los eventos de la misma persona en varios pedidos.
- Normalización antes del hash: correo en minúsculas sin espacios; teléfono solo dígitos con indicativo (`+57 300 123 4567` → `573001234567`; Pretix guarda el teléfono en E.164); nombre y apellido en minúsculas, sin tildes, sin espacios ni signos; país `co` (o el del pedido si existe). SHA-256 en hex minúsculas.
- **Solo datos del comprador**: correo y teléfono del pedido; nombre de `order.invoice_address.name_parts` (lo llena "Require customer name", ver `docs/CHECKOUT-TUNING.md`). Solo si trae nombre y apellido por separado (`given_name` y `family_name`); con el esquema `full` (un solo campo) se omiten `fn` y `ln`: dividir por espacios sale mal con dos apellidos, y correo y teléfono bastan para la coincidencia. **Nunca** `attendee_name_parts`.
- Nada personal en los logs: ni en claro ni en hash. `response` y `last_error` se guardan sin el cuerpo enviado.
- `fbp`, `fbc`, IP y user-agent sin hash. Campos vacíos se omiten (nunca cadenas vacías). No inventar `fbc`.
- `test_event_code` solo si el ajuste existe.

### Backend de Eventalist

Contrato completo en "Contrato con el backend".

## 3. Ajustes

**Del evento** (Configuración del evento; seguir cómo `pretix_wompi` registra su navegación y formulario; `event.settings` con prefijo `eventalist_tracking_`; secretos enmascarados y fuera de los logs):

- `ga4_measurement_id` (ej. `G-XJES5Z5EC9`), `ga4_api_secret`, `ga4_send_testmode` (casilla, apagada por defecto)
- `meta_dataset_id`, `meta_capi_token`, `meta_test_event_code` (opcional)
- `backend_campaign_slug` (ej. `testigos-de-la-memoria-2026`, la campaña del formulario del sitio; el slug del evento de Pretix es otro)
- `consent_since` (fecha y hora en que se guardó la casilla nueva; vacío = sin consentimiento), `consent_version` (ej. `tienda-2026-10-12`) y `policy_effective` (vigencia de la política publicada)
- `whatsapp_consent_until` (vence la autorización de WhatsApp; para Testigos, `2026-11-08T23:59:59-05:00`)
- `event_source_url` (opcional; por defecto la URL pública de la tienda del evento)

**Del organizador** (Configuración del organizador; `organizer.settings`; sirven para todos los eventos):

- `backend_url` (ej. `https://<backend>/api/v1/marketing/ticket-orders/`) y `backend_token`
- `ad_exclusions` (texto, un correo o teléfono por línea): personas que pidieron no ser incluidas en publicidad. Se normalizan igual que para el hash antes de comparar.

Si faltan los datos de un destino, ese destino se omite sin error.

## 4. Lo que ve el equipo en Pretix

- En el detalle del pedido (señal `order_info` del panel): una caja "Origen" con fuente, medio, campaña, contenido y el estado de cada envío (enviado, reintentando, falló con el motivo).
- Una página en el evento, "Ventas por campaña": para un rango de fechas, por `utm_source` / `utm_campaign` / `utm_content` (y una fila "sin campaña"), cuántos pedidos confirmados, pagados, vencidos y cancelados, y el total pagado. Consulta directa sobre `Order` y `api_meta` (JSONField). Sin gráficos. Incluye todos los pedidos, también los anteriores a `consent_since` (es un informe interno, no un envío).
- En esa página: el número de envíos fallidos y un botón "Reintentar envíos fallidos". Los `409` del backend (campaña inexistente) se muestran aparte, porque indican un ajuste mal puesto.

## Contrato con el backend

**Petición**: `POST {backend_url}` con cabeceras `Authorization: Bearer {backend_token}`, `Content-Type: application/json`, `X-Eventalist-Contract: 1`.

```json
{
  "source": "pretix",
  "instance": "pretix.eventalist.co",
  "organizer": "eventalist",
  "event": "testigos-memoria",
  "campaign": "testigos-de-la-memoria-2026",
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

- `status`: estado **actual** del pedido al armar el envío: `pending`, `paid`, `expired` o `canceled`.
- `sequence`: `pk` de la fila `Dispatch`; crece con cada cambio del pedido. El backend aplica la foto con el `sequence` mayor y descarta las menores. `occurred_at` es informativo (momento del cambio).
- `total` e `items`: los actuales del pedido.
- `consent`: copia de `api_meta.consent` más `channels` según el texto de la casilla: `email` si hay correo (alcance `event_series_and_local_events`: este encuentro, sus próximas ediciones y otros eventos culturales de Eventalist en Villa de Leyva; sin vencimiento); `whatsapp` si hay teléfono (alcance `this_event`: recordatorio de pago y novedades de este encuentro; vence en `whatsapp_consent_until`). Como solo se envían pedidos con consentimiento, `consent` siempre va.
- `contact` es siempre el comprador. Los asistentes no se envían. `phone` en E.164 o `null`; igual `email`; al menos uno (si no, la fila se omite). Nombre solo si viene separado (ver Meta); si no, `null`.
- `attribution` con todas las claves; `null` donde no hay dato.

**Respuestas**: `200` `{"status": "ok"}` (también repeticiones y fotos viejas descartadas); `400` cuerpo que no se puede interpretar (`failed`); `401` token malo (`failed`); `409` slug de campaña que no existe (`failed`, visible aparte en "Ventas por campaña"); `5xx` o timeout: reintentar. Un teléfono raro no produce `400`: el backend guarda el pedido igual.

## Pruebas

Criterio del titular: nada de pruebas que se sabe que van a pasar o que solo repiten lo que el código acaba de escribir. Lo que demuestra que esto funciona es una compra de verdad en el sandbox, con capturas. Las pruebas automáticas se limitan a lo que **falla en silencio** o **tiene costo legal**.

### Pruebas automáticas (pytest, pocas)

1. **Un error del plugin no deshace un pago.** Forzar una excepción (y aparte un error de base de datos) dentro del receptor de `order_paid` y comprobar que el pago queda confirmado y el pedido pagado. Es la prueba más importante.
2. **Cifrado para Meta.** Si la normalización está mal, Meta responde "ok" y nunca encuentra a nadie. Comparar contra hashes calculados a mano de casos reales colombianos: correo con mayúsculas y espacios; teléfono `+57 300 123 4567`, `3001234567` y `573001234567` (los tres dan el mismo hash); nombre con tildes y eñe (`Peña`, `José María`).
3. **Cortes legales.** Un pedido creado antes de `consent_since` y pagado después no genera ningún envío; con `consent_since` vacío, ninguno. El nombre de un asistente distinto al de facturación no aparece en ningún cuerpo. Un correo excluido no va a Meta ni a GA4. Nada de correo, teléfono ni hashes en el cuerpo de GA4.
4. **El checkout no depende de nadie.** Con Meta, GA4 y el backend respondiendo con error o sin responder, la confirmación del pedido termina normal y en el mismo tiempo, y los envíos quedan pendientes en `Dispatch`.

No escribir pruebas de: tiempos exactos de los reintentos, cada código de error HTTP, forma del JSON (lo cubren el endpoint de depuración de GA4 y "Test events" de Meta en el ensayo), formularios de ajustes ni plantillas.

### Ensayo completo en el evento sandbox (la prueba principal)

Requiere las tres piezas desplegadas: este plugin, el endpoint del backend y el sitio con los atributos del widget. Mientras falte el backend, el plugin se desarrolla contra un servidor falso local; el ensayo se hace cuando estén las tres.

En la instancia real, en el evento **`testigos-sandbox`**: clon de `testigos-memoria` en modo prueba, con sus propios cupos, sin enlazar desde ningún sitio, con el ambiente de pruebas de Wompi y sus cuatro llaves de prueba, y con `https://pretix.eventalist.co/_wompi/webhook/` registrado como URL de eventos en el ambiente de pruebas de Wompi. **No existía a 2026-10-06** (la instancia solo tenía el evento de producción); lo crea el titular como paso 0 del diseño. Corregir también `docs/LOGISTICA-EVENTO.md` y `docs/CHECKOUT-TUNING.md` de este repo, que lo daban por existente. **Nunca poner en modo prueba el evento de producción**: los compradores reales harían pedidos de prueba.

Ojo con los nombres: `testigos-sandbox` es a la vez el slug de este evento en Pretix y el slug de la campaña de ensayo en el backend (`backend_campaign_slug`). Es a propósito, pero son dos cosas distintas: un evento de Pretix y una campaña de `apps/marketing`.

Preparación: plugin activo en el sandbox con `consent_since` en el pasado, `meta_test_event_code` puesto, `ga4_send_testmode` activo solo durante el ensayo y `backend_campaign_slug` = `testigos-sandbox` (el backend acepta contactos de prueba solo para esa campaña). Una página HTML local con el widget del sandbox y los atributos `data-tracking-*` (`utm-campaign="ensayo"`, `ga-id` y `ga-sessid` reales tomados del navegador con GA4 cargado, `fbc="fb.1.1.TEST123"`), abierta con una URL con UTM.

1. **Pedido pagado.** Comprar con la tarjeta de prueba de Wompi. Captura: GA4 Tiempo real muestra `add_payment_info` y `purchase` con la campaña `ensayo`; Meta "Test events" muestra `AddPaymentInfo` y `Purchase` con calidad de coincidencia alta; el admin del backend muestra el pedido pagado y el contacto como comprador; la página "Ventas por campaña" lo cuenta.
2. **Pedido sin pagar.** Confirmar otro con un correo distinto y no pagar. Captura: backend con el pedido pendiente; Meta tiene `AddPaymentInfo` y no `Purchase`.
3. **Pedido vencido y luego extendido.** Dejar vencer el anterior (o acortar el plazo) y después extenderle el plazo desde el panel. Captura: el backend pasa a `expired` y luego vuelve a `pending` con el barrido; nada nuevo en Meta ni GA4.
4. **Backend caído.** Poner una `backend_url` que no responde, hacer un pedido y medir que el checkout tarda lo mismo. Restaurar la URL y ver que el envío pendiente sale solo en el siguiente ciclo de `pretixcron`.
5. **Checkout igual.** Recorrer la compra con y sin el plugin activo: mismos pasos, mismos textos, mismos correos.

### En producción, después del despliegue

1. Activar el plugin en el evento real, con los ajustes reales.
2. Una persona del equipo abre la tienda desde el sitio con una URL con UTM, elige una boleta, llena sus datos y llega a la pantalla de pago de Wompi **sin pagar**. Eso demuestra que la compra sigue funcionando sin gastar plata. Su correo va antes a las exclusiones del organizador para no ensuciar los públicos.
3. Revisar que ese pedido muestra la caja "Origen" con la campaña y que el backend lo recibió.
4. Si alguien del equipo necesita una boleta de verdad, esa compra real es la prueba final del pago.

## Despliegue

- Paquete propio en este repo: carpeta `pretix-eventalist-tracking/` con su `pyproject.toml` (entry point `pretix.plugin`), con migración para `Dispatch`. Añadir al `Dockerfile` un `RUN pip3 install /tmp/pretix-wompi/pretix-eventalist-tracking` junto al de Wompi.
- Tras desplegar: activar el plugin en el evento y llenar los ajustes del evento y del organizador.
- El día de la publicación coordinada (política y términos nuevos ya publicados en el sitio), en el panel del evento: reemplazar el texto de la casilla (Confirmation text) y el texto de ayuda del teléfono por los del dictamen, y poner en `consent_since` la hora exacta en que se guardó la casilla. Lo hace el titular o con él.
- Ningún despliegue a producción sin visto bueno del titular.

## Qué devolver al terminar

Un `.md` corto: versión de pretix comprobada; nombre del plugin en el panel; estado de `TRUST_X_FORWARDED_FOR` en Railway; si existe una señal de reactivación o extensión y cuál se usó; las capturas de cada paso del ensayo en el sandbox (GA4 Tiempo real, Meta Test events, admin del backend, Ventas por campaña) con el JSON de `api_meta` de un pedido; el tiempo del checkout con el backend caído; y cualquier diferencia con este documento marcada como **CAMBIO**. Sin listados de pruebas pasadas: solo qué se probó y qué se vio. Se guarda en el repo del sitio como `docs/medicion-embudo/resultado-pretix.md`.
