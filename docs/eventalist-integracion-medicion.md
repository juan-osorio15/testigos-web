# Integración de medición · lo que necesita el sitio testigosdelamemoria.com del backend de Eventalist y de Pretix

Documento de entrega para el agente que desarrolla el backend de Eventalist (Django en Railway) y para quien administra la instancia de Pretix (`pretix.eventalist.co`, versión 2026.5.1). Es autocontenido: no hace falta leer el repositorio del sitio. Al terminar, el agente devuelve (1) cómo se usan los endpoints (URL, autenticación, ejemplos de petición y respuesta) y (2) cualquier cambio respecto a este contrato.

Fecha de este contrato: 2026-09-16. Origen: `specs/002-seo-medicion-visibilidad/contracts/` del repositorio del sitio.

## Contexto en cinco líneas

El sitio (Astro estático en GitHub Pages) embebe el widget de Pretix. El checkout ocurre en `pretix.eventalist.co`, en un iframe de otro dominio, así que el Google Analytics y el píxel de Meta del sitio no ven la compra. Solución: el sitio pasa los identificadores de la visita como atributos `data-tracking-*` al widget (Pretix los conserva en el carrito como `widget_data`); un mini plugin de Pretix los copia al campo `api_meta` del pedido; cuando el pedido queda pagado, Pretix avisa por webhook al backend; el backend consulta el pedido por la API de Pretix y envía la compra a Meta (Conversions API) y a Google Analytics 4 (Measurement Protocol). Además, el backend registra las aceptaciones del aviso de cookies del sitio, que sirven como prueba de autorización.

Tres entregables: **A** endpoint de consentimiento (backend), **B** receptor del webhook y envío a Meta y GA4 (backend), **C** mini plugin de Pretix. **C no es de este repositorio**: vive en el repositorio de la instancia de Pretix y tiene su propio documento (`docs/pretix-plugin-tdm-attribution.md` en el repo del sitio). Este documento lo conserva como referencia de qué datos aparecerán en `api_meta.tracking`; el receptor B debe funcionar aunque el plugin llegue después (pedidos sin `api_meta.tracking`: Meta con correo hasheado, GA4 omitido).

**Modelo de procesamiento (respuesta del 2026-09-17 a la pregunta del agente del backend)**: opción A. El webhook responde 200 de inmediato y solo persiste el trabajo pendiente en `pretix_conversion`; un comando de gestión (`process_pretix_conversions`) corre cada minuto como servicio cron de Railway y procesa los pedidos nuevos y los reintentos vencidos (`next_attempt_at` en la tabla; backoff 1 min, 5 min, 30 min, 2 h, 12 h; máximo 5 intentos). Los reintentos sobreviven reinicios y escalado; el retraso máximo hasta el primer envío es de un minuto, aceptable (Meta admite hasta 7 días; GA4 hasta 72 h).

## Restricciones legales (no negociables)

Vienen del dictamen legal del 2026-09-15 (Ley 1581 de 2012, Decreto 1377 de 2013).

1. Solo se envían a Meta y GA4 pedidos **pagados** cuya fecha de creación sea **posterior** a `ATTRIBUTION_CONSENT_SINCE` (la fecha en que la casilla de compra de Pretix pasó a autorizar este envío). Los anteriores se registran como "no enviado: anterior al consentimiento" y no se tocan.
2. Solo se envían los datos enumerados en la sección "Qué se envía" de cada plataforma. Ningún otro campo del pedido. Si en el futuro se quiere añadir un dato, primero se cambia la política de datos del sitio.
3. El registro de consentimiento no guarda IP ni datos de identidad: solo el identificador aleatorio, versión, alcance y fechas.
4. `data_processing_options` de Meta va vacío (`[]`): la opción LDU solo aplica a EE. UU.
5. Correo, teléfono, nombre y apellido van a Meta **hasheados con SHA-256** tras normalizar. Nunca en claro.

## A · Endpoint de registro de consentimiento

Recibe la aceptación (o revocación) del aviso de cookies del sitio.

- **Ruta**: `POST /api/v1/marketing/consent/`
- **CORS**: permitir origen `https://testigosdelamemoria.com` (y `http://localhost:4321` en desarrollo), método POST, cabecera `Content-Type`. Sin credenciales.
- **Autenticación**: ninguna (es público, como el formulario de interesados que ya existe). Limitar tasa por IP (p. ej. 30 por minuto) para evitar abuso.
- **Cuerpo** (JSON):

```json
{
  "id": "3f2a9c1e-7b4d-4e8a-9c2f-1a2b3c4d5e6f",
  "site": "testigosdelamemoria.com",
  "version": "2026-09",
  "scope": ["analytics", "advertising"],
  "accepted_at": "2026-09-21T15:04:05-05:00",
  "revoked_at": null
}
```

- **Semántica**: upsert por `id` (UUID que genera el navegador). Una revocación llega con el mismo `id` y `revoked_at` con fecha; se conserva `accepted_at`. `site` y `version` son texto libre de hasta 64 caracteres; `scope` es lista de cadenas.
- **Respuesta**: `204 No Content` en éxito; `400` con JSON `{"error": "..."}` si falta `id`, `version`, `accepted_at` o el `id` no es UUID.
- **Almacenamiento**: tabla `marketing_consent` con `id` (PK), `site`, `version`, `scope` (JSON), `accepted_at`, `revoked_at`, `created_at`, `updated_at`. Sin IP, sin user-agent, sin relación con contactos.
- **Uso posterior**: entregar copia al titular que la pida (el sitio le muestra su `id` en el gestor de preferencias). Basta una consulta en el admin de Django por `id`.

## B · Receptor del webhook de Pretix y envío a Meta y GA4

### B.1 Webhook

- **Ruta**: `POST /api/v1/marketing/pretix/webhook/`
- **Autenticación**: HTTP Basic Auth. Pretix no firma los webhooks; la URL que se registra en Pretix lleva usuario y contraseña (`https://usuario:clave@backend/api/v1/marketing/pretix/webhook/`). Rechazar con 401 si no coincide. Solo HTTPS.
- **Cuerpo que envía Pretix** (mínimo; puede traer más campos):

```json
{"notification_id": 123, "organizer": "eventalist", "event": "testigos-memoria", "code": "ABC12", "action": "pretix.event.order.paid"}
```

- **Comportamiento**: responder `200` de inmediato tras persistir la fila (modelo A: el cron de cada minuto procesa; ver B.5). Pretix reintenta hasta tres días con backoff, así que el mismo `code` puede llegar varias veces: el proceso debe ser **idempotente por `code`**. Ignorar (con 200) acciones distintas de `pretix.event.order.paid`. Un `410` desactiva el webhook en Pretix: no devolverlo nunca por error.
- **Registro**: tabla `pretix_conversion` con `code` (único), `event_slug`, `order_datetime`, `payment_date`, `total`, `currency`, `skipped_reason` (nulo o texto), `capi_sent_at`, `capi_response` (JSON), `mp_sent_at`, `mp_response` (JSON), `attempts`, `last_error`, `created_at`, `updated_at`.

### B.2 Consulta del pedido en Pretix

`GET https://pretix.eventalist.co/api/v1/organizers/eventalist/events/testigos-memoria/orders/{code}/` con cabecera `Authorization: Token <PRETIX_API_TOKEN>` (token de equipo con permiso de solo lectura sobre pedidos; se crea en Pretix: Organizador → Teams → API tokens).

Campos que se usan de la respuesta:

| Campo | Uso |
|---|---|
| `status` | Solo se procesa `"p"` (pagado). Otro estado: registrar `skipped_reason = "status <x>"`. |
| `datetime` | Fecha de creación del pedido. Si es anterior a `ATTRIBUTION_CONSENT_SINCE`: `skipped_reason = "anterior al consentimiento"`. |
| `payments[]` con `state == "confirmed"` → `payment_date` | `event_time` de Meta y `timestamp_micros` de GA4. Si no hay, usar `datetime`. |
| `total` (string decimal) | `value` |
| `email`, `phone` | Datos del comprador, hasheados |
| `invoice_address.name_parts` (`given_name`, `family_name`) o, si faltan, `positions[0].attendee_name_parts` | Nombre y apellido, hasheados |
| `positions[]` → `item` (id numérico), `price`, `attendee_name_parts` | `contents` / `items` |
| `api_meta.tracking` | Identificadores que puso el plugin C (puede faltar si la compra no vino del sitio) |
| `sales_channel` | Informativo |

Para traducir `item` (id) a nombre, una sola vez: `GET .../events/testigos-memoria/items/` y cachear `{id: name}`. Nombres esperados: "Pase completo", "Viernes tarde", "Sábado mañana", "Sábado tarde", "Domingo mañana".

`api_meta.tracking` tiene esta forma (todo opcional; las claves salen de los atributos `data-tracking-*` del widget quitando el prefijo y cambiando guiones por guion bajo, por eso `ga_id` y `ga_sessid`):

```json
{
  "ga_id": "1234567890.1700000000",
  "ga_sessid": "1700000000",
  "fbp": "fb.1.1700000000000.1234567890",
  "fbc": "fb.1.1700000000000.AbCdEfGh",
  "gclid": "…",
  "utm_source": "instagram", "utm_medium": "social", "utm_campaign": "lanzamiento",
  "landing": "/",
  "event_id_checkout": "…",
  "client_ip": "181.55.1.2",
  "client_user_agent": "Mozilla/5.0 …",
  "captured_at": "2026-09-21T15:04:05-05:00"
}
```

### B.3 Envío a Meta (Conversions API)

- **Endpoint**: `POST https://graph.facebook.com/v21.0/{META_DATASET_ID}/events?access_token={META_CAPI_TOKEN}` (usar la versión vigente de la Graph API al implementar; v21.0 o posterior).
- **Cuerpo**:

```json
{
  "data": [{
    "event_name": "Purchase",
    "event_time": 1732000000,
    "event_id": "ABC12",
    "action_source": "website",
    "event_source_url": "https://pretix.eventalist.co/eventalist/testigos-memoria/",
    "user_data": {
      "em": ["<sha256>"], "ph": ["<sha256>"], "fn": ["<sha256>"], "ln": ["<sha256>"],
      "country": ["<sha256 de 'co'>"],
      "external_id": ["<sha256 del code>"],
      "fbp": "fb.1.1700000000000.1234567890",
      "fbc": "fb.1.1700000000000.AbCdEfGh",
      "client_ip_address": "181.55.1.2",
      "client_user_agent": "Mozilla/5.0 …"
    },
    "custom_data": {
      "currency": "COP",
      "value": 310000,
      "order_id": "ABC12",
      "content_type": "product",
      "contents": [{"id": "12", "quantity": 1, "item_price": 310000}]
    },
    "data_processing_options": []
  }],
  "test_event_code": "TEST12345"
}
```

- **Reglas**:
  - `event_id` = código del pedido (permite desduplicar si algún día se dispara `Purchase` también en el navegador).
  - `event_time` en segundos Unix; no puede tener más de 7 días de antigüedad (Meta rechaza el lote entero). Enviar en cuanto llega el webhook.
  - Normalización antes de hashear: correo en minúsculas sin espacios; teléfono solo dígitos con indicativo de país (un número colombiano `300 123 4567` → `573001234567`; si ya empieza por 57 y tiene 12 dígitos, dejarlo); nombre y apellido en minúsculas sin espacios ni tildes (Meta recomienda quitar signos de puntuación); país `co`. SHA-256 en hexadecimal minúsculas.
  - `fbp`, `fbc`, `client_ip_address`, `client_user_agent` **sin hash**. `client_user_agent` es obligatorio: si `api_meta.tracking` no lo trae, usar el `client_user_agent` que guardó el plugin (siempre está si el plugin corrió); si tampoco está, enviar igual con el resto (Meta acepta, con peor calidad de coincidencia).
  - No inventar `fbc` si no hay dato. Omitir campos vacíos en lugar de enviar cadenas vacías.
  - `test_event_code` solo en pruebas (se obtiene en Events Manager → Test Events); quitarlo en producción.
  - Respuesta esperada: `{"events_received": 1, "fbtrace_id": "..."}`. Guardar en `capi_response`.

### B.4 Envío a Google Analytics 4 (Measurement Protocol)

- **Endpoint**: `POST https://www.google-analytics.com/mp/collect?measurement_id={GA4_MEASUREMENT_ID}&api_secret={GA4_API_SECRET}`. Para validar en desarrollo: `https://www.google-analytics.com/debug/mp/collect` (misma query), que sí devuelve errores de validación.
- **Cuerpo**:

```json
{
  "client_id": "1234567890.1700000000",
  "timestamp_micros": 1732000000000000,
  "non_personalized_ads": true,
  "events": [{
    "name": "purchase",
    "params": {
      "transaction_id": "ABC12",
      "currency": "COP",
      "value": 310000,
      "session_id": "1700000000",
      "engagement_time_msec": 1,
      "items": [{"item_id": "12", "item_name": "Pase completo", "price": 310000, "quantity": 1}]
    }
  }]
}
```

- **Reglas**:
  - Sin `ga_id` en `api_meta.tracking` **no se envía** a GA4 (quedaría sin sesión y sin origen): `mp_response = {"skipped": "sin client_id"}`. Meta sí se envía igual (con correo hasheado).
  - `timestamp_micros` como máximo 72 horas atrás; si el pedido es más viejo, enviar sin `timestamp_micros` (GA4 lo fecha en la recepción).
  - `session_id` y `engagement_time_msec` hacen que la compra herede fuente, medio y campaña de la sesión.
  - El endpoint de producción responde `2xx` vacío aunque el cuerpo esté mal: validar primero contra `/debug/mp/collect` en las pruebas.

### B.5 Reintentos e idempotencia

- El webhook solo inserta o actualiza la fila de `pretix_conversion` (`code`, `event_slug`, `status = pending`, `next_attempt_at = now`) y responde 200. No llama a Pretix ni a Meta ni a Google dentro de la petición.
- Un comando de gestión `process_pretix_conversions`, ejecutado cada minuto por un servicio cron de Railway, toma las filas con `status in (pending, retry)` y `next_attempt_at <= now`, consulta el pedido y envía. Campos añadidos a la tabla: `status` (pending, retry, sent, skipped, failed), `next_attempt_at`, `attempts`.
- Antes de enviar, comprobar por `code`: si `capi_sent_at` ya existe, no reenviar a Meta; lo mismo con `mp_sent_at`. Así los reintentos de Pretix no duplican.
- Ante `5xx` o timeout de Meta o Google: `status = retry`, `attempts + 1`, `next_attempt_at` según el backoff (1 min, 5 min, 30 min, 2 h, 12 h); a partir del sexto intento `status = failed` y `last_error`. Ante `4xx`: `failed` de inmediato (es un problema de datos o de token).
- Tiempo de respuesta del webhook: menos de 5 s (Pretix corta a los 30).

### B.6 Variables de entorno

| Variable | Ejemplo | Quién la da |
|---|---|---|
| `PRETIX_API_TOKEN` | `abcd1234…` | Pretix → Organizador → Teams → API tokens (solo lectura de pedidos e ítems) |
| `PRETIX_WEBHOOK_USER` / `PRETIX_WEBHOOK_PASSWORD` | `tdm` / aleatoria larga | Se generan al implementar; se ponen en la URL del webhook en Pretix |
| `META_DATASET_ID` | `1234567890123456` | Events Manager (ver `docs/pendientes-002.md` §2 paso 2) |
| `META_CAPI_TOKEN` | `EAAG…` (muy largo) | Events Manager → dataset → Settings → Conversions API → Generate access token |
| `META_TEST_EVENT_CODE` | `TEST12345` | Solo en desarrollo |
| `GA4_MEASUREMENT_ID` | `G-AB12CD34EF` | GA4 → Admin → Data streams → el flujo web |
| `GA4_API_SECRET` | `aBcDeFgHiJkLmNoPqRsT` | GA4 → Admin → Data streams → flujo → Measurement Protocol API secrets |
| `ATTRIBUTION_CONSENT_SINCE` | `2026-09-21T00:00:00-05:00` | Fecha en que se aplicó la casilla nueva en Pretix (la fija Juan) |
| `CONSENT_ALLOWED_ORIGINS` | `https://testigosdelamemoria.com` | Fija |

## C · Mini plugin de Pretix `pretix_tdm_attribution` (referencia; se entrega por separado al repo de Pretix)

Va en la **instancia de Pretix** (paquete Python instalado en el mismo entorno que pretix, registrado en `INSTALLED_APPS` vía entry point, como cualquier plugin de pretix), no en el backend de Django. Pretix 2026.5.1 cumple el requisito (`api_meta` existe desde 2024.7).

Qué hace: cuando el comprador confirma el pedido, copia al `api_meta` del pedido los atributos `data-tracking-*` que el sitio puso en el widget (Pretix los guarda en la sesión del carrito como `widget_data`), más la IP y el user-agent del comprador.

Estructura mínima del paquete:

```
pretix_tdm_attribution/
├── pyproject.toml          # name = "pretix-tdm-attribution"; entry point [pretix.plugin] pretix_tdm_attribution=pretix_tdm_attribution:PretixPluginMeta
├── pretix_tdm_attribution/
│   ├── __init__.py         # PretixPluginMeta con name, author, version, visible=True, restricted=False
│   ├── apps.py             # AppConfig + PluginConfig con default_auto_field
│   └── signals.py          # el receptor de abajo
```

`signals.py`:

```python
from django.dispatch import receiver
from django.utils.timezone import now
from pretix.presale.signals import order_api_meta_from_request
from pretix.presale.views.cart import cart_session

PREFIX = "tracking-"
MAX_LEN = 512

def _client_ip(request):
    xff = request.META.get("HTTP_X_FORWARDED_FOR", "")
    return (xff.split(",")[0].strip() if xff else request.META.get("REMOTE_ADDR", "")) or ""

@receiver(order_api_meta_from_request, dispatch_uid="tdm_attribution_api_meta")
def attach_tracking(sender, request, **kwargs):
    widget = cart_session(request).get("widget_data") or {}
    tracking = {
        k[len(PREFIX):].replace("-", "_"): str(v)[:MAX_LEN]
        for k, v in widget.items()
        if k.startswith(PREFIX) and v
    }
    tracking["client_ip"] = _client_ip(request)
    tracking["client_user_agent"] = request.META.get("HTTP_USER_AGENT", "")[:MAX_LEN]
    tracking["captured_at"] = now().isoformat()
    return {"tracking": tracking}
```

Notas:
- La señal `order_api_meta_from_request` se emite en el paso de confirmación del checkout con el `request`; lo que devuelve el receptor se fusiona en `order.api_meta`. Verificar la firma en la versión instalada (`pretix/presale/signals.py`).
- `widget_data` viaja desde el widget en el POST de "añadir al carrito" y se guarda en la sesión del carrito; funciona con el checkout en iframe y en pestaña nueva.
- Instalación: `pip install .` en el entorno de pretix, `python -m pretix migrate` no hace falta (sin modelos), reiniciar pretix, activar el plugin en el evento (Configuración → Plugins).
- Prueba: hacer un pedido de prueba desde el sitio y consultar `GET .../orders/{code}/` → `api_meta.tracking` con datos.

## D · Configuración en el panel de Pretix (la hace Juan)

1. Evento → Configuración → General: activar "Pedir a los buscadores que no indexen la tienda" (Ask search engines not to index the ticket shop).
2. Organizador → Webhooks → nuevo: URL del endpoint B.1 con usuario y clave en la URL; acción `pretix.event.order.paid`; todos los eventos del organizador o solo `testigos-memoria`.
3. Organizador → Teams → API tokens: token de solo lectura para el backend.
4. Evento → Configuración → Plugins: activar `pretix_tdm_attribution` una vez instalado.
5. Evento → Configuración → General → Textos de confirmación: reemplazar el texto de la casilla por el que aprobó el dictamen (está en `docs/pretix-tienda-textos.md`, sección "Confirmation text") **el mismo día** que se publica la política nueva del sitio, y anotar esa fecha como `ATTRIBUTION_CONSENT_SINCE`.

## E · Pruebas de aceptación

1. Con `test_event_code` de Meta y el endpoint de depuración de GA4, hacer una compra de prueba en el evento de test de Pretix desde el sitio (una URL con `?utm_source=prueba&utm_medium=qa&fbclid=TEST123`).
2. El pedido muestra `api_meta.tracking` con `ga_id`, `ga_sessid`, `fbc` que termina en `TEST123`, `utm_source = prueba`, `client_user_agent`.
3. Meta → Events Manager → Test Events: un `Purchase` de servidor con `event_id` = código del pedido y calidad de coincidencia (EMQ) ≥ 6.
4. GA4 → DebugView o Realtime: `purchase` con `transaction_id` = código, fuente `prueba`, medio `qa`.
5. Reenviar el mismo webhook desde Pretix (Webhooks → historial → reenviar): ningún evento nuevo en Meta ni en GA4; `attempts` sube, `*_sent_at` no cambia.
6. Un pedido con `datetime` anterior a `ATTRIBUTION_CONSENT_SINCE`: `skipped_reason` rellenado, nada enviado.
7. Un pedido sin `api_meta.tracking` (compra por enlace directo a la tienda): Meta recibe `Purchase` con correo hasheado; GA4 no recibe nada y `mp_response` dice "sin client_id".
8. `POST /api/v1/marketing/consent/` desde `https://testigosdelamemoria.com` (o `localhost:4321`): 204 y fila en `marketing_consent`; el mismo `id` con `revoked_at`: la fila se actualiza.

## F · Qué devuelve el agente al terminar

Un `.md` corto con: URL final de cada endpoint; cómo se autentica el webhook (usuario y dónde vive la clave); el comando de gestión y cómo quedó programado el cron en Railway; qué variables de entorno quedaron definidas en Railway; el nombre exacto de las tablas; cualquier diferencia respecto a este contrato (campos, rutas, códigos de respuesta) marcada como "CAMBIO"; y el resultado de las ocho pruebas de la sección E. Ese documento se guarda en el repositorio del sitio como `docs/eventalist-integracion-medicion-resultado.md`.
