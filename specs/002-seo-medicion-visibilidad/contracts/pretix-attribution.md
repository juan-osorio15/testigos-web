# Contrato: atribución de compras (sitio → Pretix → backend → Meta y GA4)

Cubre FR-003, FR-004, FR-005 y R-01, R-02. Tres partes: el sitio (este repo), la instancia de Pretix de Eventalist (mini plugin) y el backend de Eventalist en Railway (receptor del webhook). Las dos últimas son entregables de Eventalist; aquí se fija lo que deben cumplir para que el sitio funcione.

## 1. Sitio: captura e inyección (`src/measurement/attribution.ts`)

**Captura en cada carga** (antes de construir el widget):
- De la URL: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `gclid`. Si hay alguno, se guarda `Attribution` en `localStorage['tdm.attribution']` con `landing` y `firstSeen` (sobrescribe la anterior). Si no hay ninguno y existe una guardada de menos de 90 días, se conserva.
- Cookies propias que crean las etiquetas: `_fbp`, `_fbc` (solo si el píxel cargó). Si hay `fbclid` y no hay `_fbc`, se construye `fbc = fb.1.<Date.now()>.<fbclid>` (formato oficial de Meta).
- GA4: `gtag('get', G-…, 'client_id', cb)` y `gtag('get', G-…, 'session_id', cb)` con tope de 2 s.

**Inyección al widget** (patrón oficial de Pretix: `window.PretixWidget.build_widgets = false` en `<head>` antes del script del widget; el layout llama `PretixWidget.buildWidgets()` cuando tiene los datos o vence el tope):

```html
<pretix-widget
  event="https://pretix.eventalist.co/eventalist/testigos-memoria/"
  data-tracking-ga-id="…"          <!-- client_id GA4 -->
  data-tracking-ga-sessid="…"      <!-- session_id GA4 -->
  data-tracking-fbp="fb.1.…"
  data-tracking-fbc="fb.1.…"
  data-tracking-gclid="…"
  data-tracking-utm-source="…" data-tracking-utm-medium="…" data-tracking-utm-campaign="…"
  data-tracking-landing="/"
  data-tracking-event-id-checkout="…"   <!-- eventId del begin_checkout de esta página -->
></pretix-widget>
```

Regla verificada: todo atributo `data-*` del `<pretix-widget>` viaja como `widget_data` en el POST `/w/<id>/cart/add` (también en modo pestaña nueva) y queda en `cart_session(request)['widget_data']` durante el checkout. Los nombres `data-tracking-ga-id` y `data-tracking-ga-sessid` coinciden con los que usa el plugin oficial "Tracking codes", por si Eventalist lo adquiere después. Ningún atributo se pone si su valor es vacío.

## 2. Pretix: mini plugin `pretix_tdm_attribution` (Eventalist)

- Requisito: pretix ≥ 2024.7 (campo `api_meta`). Se verifica en Admin → Global settings → versión.
- Receptor de la señal `pretix.presale.signals.order_api_meta_from_request` (se dispara en `ConfirmStep.post()` con `request`):

```python
@receiver(order_api_meta_from_request, dispatch_uid="tdm_attribution")
def attach_tracking(sender, request, **kwargs):
    widget = cart_session(request).get('widget_data') or {}
    tracking = {k[len('tracking-'):].replace('-', '_'): v
                for k, v in widget.items() if k.startswith('tracking-') and v}
    tracking['client_ip'] = get_client_ip(request)      # X-Forwarded-For consciente
    tracking['client_user_agent'] = request.META.get('HTTP_USER_AGENT', '')[:512]
    tracking['captured_at'] = now().isoformat()
    return {'tracking': tracking}
```

- Resultado: `order.api_meta == {"tracking": {...}}` visible en `GET /api/v1/organizers/eventalist/events/testigos-memoria/orders/<code>/` como `api_meta`.
- Sin datos del widget (compra por enlace directo a la tienda): `tracking` solo lleva IP, user-agent y `captured_at`.
- Configuración de la tienda además: **"Ask search engines not to index the ticket shop"** activado (Settings → General; FR-031); un webhook (Settings → Webhooks, a nivel de organizador) a la URL del backend con la acción `pretix.event.order.paid` (y opcionalmente `pretix.event.order.placed`); y la **casilla obligatoria de confirmación** con el texto del dictamen legal (`docs/revision-legal-2026-09-15-medicion.md` §4), que autoriza el envío hasheado a Google y Meta. La fecha de ese cambio es `ATTRIBUTION_CONSENT_SINCE`.

## 3. Backend de Eventalist: receptor del webhook

**Endpoint**: `POST /api/v1/marketing/pretix/webhook/` con Basic Auth (Pretix no firma; la URL lleva usuario y contraseña) y solo desde HTTPS.

**Payload de Pretix** (mínimo): `{"notification_id", "organizer", "event", "code", "action"}`. Puede llegar repetido (reintentos hasta 3 días). Responder 200 rápido; procesar en tarea.

**Proceso por `code`** (idempotente: tabla `pretix_conversion` con `code` único, `capi_sent_at`, `mp_sent_at`, `payload`):
1. `GET /api/v1/organizers/{organizer}/events/{event}/orders/{code}/` con token de API de solo lectura. Tomar `status == 'p'`, `total`, `email`, `phone`, `invoice_address.name_parts`, `positions[]` (`item`, `price`, `attendee_name_parts`, `attendee_email`), `payment_date` (o `datetime`), `api_meta.tracking`, `sales_channel`. **Descartar** (registrar sin enviar) los pedidos con `datetime` anterior a `ATTRIBUTION_CONSENT_SINCE` (fecha en que entró en vigor la casilla nueva de Pretix): sus compradores autorizaron otra cosa (dictamen legal, obligación 6). Enviar solo los datos enumerados en la sección 10 de la política.
2. **Meta Conversions API** `POST https://graph.facebook.com/v21.0/{dataset_id}/events` (versión vigente en el momento de implementar):

```json
{"data":[{
  "event_name":"Purchase",
  "event_time": <epoch de payment_date>,
  "event_id": "<code>",
  "action_source":"website",
  "event_source_url":"https://pretix.eventalist.co/eventalist/testigos-memoria/",
  "user_data":{
    "em":["<sha256(email normalizado)>"], "ph":["<sha256(57…)>"],
    "fn":["<sha256>"], "ln":["<sha256>"], "country":["<sha256('co')>"],
    "external_id":["<sha256(code)>"],
    "fbp":"<tracking.fbp>", "fbc":"<tracking.fbc>",
    "client_ip_address":"<tracking.client_ip>", "client_user_agent":"<tracking.client_user_agent>"
  },
  "custom_data":{
    "currency":"COP", "value": <total>, "order_id":"<code>",
    "content_type":"product",
    "contents":[{"id":"<item id>","quantity":1,"item_price":<price>}]
  },
  "data_processing_options":[]
}],"test_event_code":"<solo en pruebas>"}
```

   Reglas: hash SHA-256 en minúsculas y sin espacios; teléfono solo dígitos con indicativo 57; `fbp`, `fbc`, IP y user-agent sin hash; `client_user_agent` es obligatorio (si no vino del widget, usar el del checkout que guardó el plugin); `event_time` ≤ 7 días; no inventar `fbc` sin `fbclid`. `event_id` = `code` deja lista la desduplicación si algún día se dispara `Purchase` en navegador.
3. **GA4 Measurement Protocol** `POST https://www.google-analytics.com/mp/collect?measurement_id=G-…&api_secret=…`:

```json
{"client_id":"<tracking.ga_client_id>",
 "timestamp_micros": <payment_date en µs, ≤ 72 h>,
 "events":[{"name":"purchase","params":{
   "transaction_id":"<code>","currency":"COP","value":<total>,
   "session_id":"<tracking.ga_session_id>","engagement_time_msec":1,
   "items":[{"item_id":"<item id>","item_name":"<nombre>","price":<price>,"quantity":1}]
 }}]}
```

   Reglas: sin `ga_client_id` no se envía a GA4 (quedaría sin sesión y en "(not set)"; se registra el motivo). Validar primero contra `/debug/mp/collect`.
4. Registrar resultado; reintentar con backoff ante 5xx; ante 4xx guardar el error y no reintentar.

**Google Ads**: no se sube nada por separado; se enlaza GA4 con Google Ads y se importa el evento clave `purchase` (evita doble conteo con gclid).

## 4. Pruebas de aceptación (quickstart §4)

1. Compra de prueba en modo test de Pretix desde la portada con `?utm_source=prueba&utm_medium=qa&fbclid=TEST123`.
2. En el pedido: `api_meta.tracking` con `ga_client_id`, `ga_session_id`, `fbc = fb.1.<ts>.TEST123`, `utm_source = prueba`, `client_user_agent`.
3. Meta Events Manager → Test Events: un `Purchase` con `event_id` = código, EMQ ≥ 6.
4. GA4 DebugView / Realtime: un `purchase` con `transaction_id` = código, atribuido a `prueba / qa`.
5. Reenviar el mismo webhook: no se crea un segundo evento (idempotencia).

## 5. Lo que este contrato no cubre

- `Purchase` en navegador dentro de la tienda (iframe de tercero: `_fbp` distinto en Safari y Firefox). Si Eventalist activa el plugin "Tracking codes", **no** activar su evento de compra hacia Meta salvo que use `event_id` = código de pedido.
- Reembolsos y cancelaciones (no hay reembolsos por política del evento).
