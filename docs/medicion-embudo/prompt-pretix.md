# Prompt · plugin `pretix-eventalist-tracking` (repo `pretix-wompi`)

> Copiar este documento completo como instrucción al agente que trabaja en el repo `pretix-wompi`. Es autocontenido. Fecha: 2026-10-06. Origen: `docs/medicion-embudo/` del repo del sitio testigosdelamemoria.com. Reemplaza el plan archivado `pretix-tdm-attribution` (retirado el 2026-09-17; queda una carpeta vacía `pretix-tdm-attribution/` en este repo con solo cachés: bórrala).

## Contexto

Eventalist vende boletas con su Pretix propio (`pretix.eventalist.co`, imagen de este repo: `pretix/standalone` + `pretix-wompi` + `pretixcron` + dos workers de celery, en Railway). Los sitios de cada evento (el primero: testigosdelamemoria.com, Astro estático) embeben el widget de Pretix con `disable-iframe`, así que el checkout ocurre en una pestaña de `pretix.eventalist.co` y el pago en Wompi. El Google Analytics 4 y el píxel de Meta del sitio no ven lo que pasa en Pretix.

Queremos un embudo por campaña UTM: visita, clic, "Comprar", **pedido confirmado sin pagar**, **pedido pagado**. Los dos últimos pasos solo existen en Pretix. Este plugin:

1. Guarda en cada pedido la campaña y los identificadores de la visita que el sitio pasa al widget.
2. Avisa a GA4 (Measurement Protocol) y a Meta (Conversions API) cuando un pedido se confirma y cuando se paga.
3. Envía el contacto y el estado del pedido al backend de Eventalist, que mantiene la base de contactos de marketing (retargeting por correo y WhatsApp).

Es reutilizable: se activa por evento y se configura desde el panel. No hay nada de "Testigos" en el código.

Valores del stack que no se negocian (ver `CLAUDE.md` de este repo): cero fricción en la compra, nada que sorprenda al comprador. **Este plugin no cambia el checkout**: ni pasos, ni campos, ni textos, ni tiempos. Si un envío falla, la compra sigue igual; se reintenta en segundo plano. Nunca se llama a un servicio externo dentro de la petición del comprador.

## Restricciones legales (no negociables)

Vienen del dictamen del abogado interno del 2026-10-06 (`docs/revision-legal-2026-10-06-embudo.md` en el repo del sitio). La autorización es una sola casilla obligatoria del checkout, reescrita; el plugin no añade casillas.

1. Solo pedidos creados en o después de `consent_since` van a cualquier destino. Los anteriores no se tocan, aunque se paguen después.
2. Solo datos del comprador. Nunca nombres de asistentes.
3. A GA4 nada personal: ni correo, ni teléfono, ni nombre, ni sus hashes, ni `user_id`.
4. A Meta, correo, teléfono y nombre solo en SHA-256, normalizados en el servidor. Nunca en claro en logs.
5. `_ga`, `_fbp` y `_fbc` solo existen en el pedido si la persona aceptó cookies en el sitio (el sitio no los pasa en otro caso).
6. Quien pida no estar en publicidad entra en `ad_exclusions` y deja de ir a Meta.

## Lo que llega del sitio

El sitio pone atributos `data-tracking-*` en `<pretix-widget>`. Pretix guarda todos los `data-*` del widget como `widget_data` en la sesión del carrito (`cart_session(request)['widget_data']`, verificado en `pretix/presale/views/cart.py` y en el JS del widget; funciona también con `disable-iframe`). Claves posibles, todas opcionales, ya sin el prefijo `data-`:

- `tracking-utm-source`, `tracking-utm-medium`, `tracking-utm-campaign`, `tracking-utm-content`, `tracking-utm-term`
- `tracking-gclid`, `tracking-landing` (ruta de llegada, ej. `/`)
- `tracking-ga-id` (client_id de GA4, ej. `1234567890.1700000000`), `tracking-ga-sessid` (session_id, ej. `1700000000`)
- `tracking-fbp` (ej. `fb.1.1700000000000.1234567890`), `tracking-fbc` (ej. `fb.1.1700000000000.AbCdEf`)
- `tracking-event-id-checkout` (id del `InitiateCheckout` del navegador)
- `tracking-consent` = `1` si la persona aceptó el aviso de cookies del sitio

Las UTM pueden venir sin `ga-id`, `fbp` ni `fbc` (persona que no aceptó cookies). Un pedido hecho entrando directo a la tienda no trae nada.

## 1. Captura en el pedido

Receptor de `pretix.presale.signals.order_api_meta_from_request` (existe desde 2024.7; la instancia está en 2026.5.x). **Comprobar en la versión instalada** la firma exacta y cómo se fusiona lo que devuelve en `order.api_meta` (`pretix/presale/checkoutflow.py`, paso de confirmación). Devuelve:

```python
{"tracking": {
    # claves de widget_data que empiezan por "tracking-": sin el prefijo, guiones -> "_"
    "utm_source": "meta", "utm_medium": "paid", "utm_campaign": "preventa", "utm_content": "afiche",
    "ga_id": "...", "ga_sessid": "...", "fbp": "...", "fbc": "...", "gclid": "...",
    "landing": "/", "event_id_checkout": "...", "consent": "1",
    # siempre, aunque no haya widget_data:
    "client_ip": "181.55.1.2",          # primer valor de X-Forwarded-For, o REMOTE_ADDR
    "client_user_agent": "Mozilla/5.0 ...",
    "captured_at": "2026-10-10T15:04:05-05:00",
}}
```

Reglas: valores vacíos no se copian; cada valor recortado a 512 caracteres (IP a 64); se conservan otras claves que ya tenga `api_meta`.

**Prueba del consentimiento** (obligación legal, no depender de que Pretix guarde el texto mostrado): si el pedido se crea en o después de `consent_since`, el receptor añade también:

```python
{"consent": {
    "version": "tienda-2026-10-12",          # ajuste consent_version
    "policy_effective": "2026-10-12",         # ajuste policy_effective
    "accepted_at": "2026-10-12T15:04:05-05:00",  # momento de confirmación del pedido
}}
```

Un pedido sin `api_meta.consent` es anterior a la casilla nueva y **no se envía a ningún destino** (ni GA4, ni Meta, ni backend). Envolver todo en `try/except`: si algo falla, devolver solo `client_ip`, `client_user_agent` y `captured_at` y registrar el error en el log; nunca romper la confirmación.

Si la señal no existiera o no se fusionara así, avisar antes de cambiar de camino (alternativa: `order_meta_from_request` más copia a un modelo propio en `order_placed`).

## 2. Envíos

### Cuándo

Receptores de señales de pretix, solo en eventos con el plugin activo (son `EventPluginSignal`):

- `order_placed`: si `order.status == 'n'` (pendiente) → etapa **placed**. Si el pedido nace pagado (gratis o pago inmediato) → etapa **paid** directamente.
- `order_paid` → etapa **paid**.
- `order_expired` → etapa **expired** (solo backend).
- `order_canceled` → etapa **canceled** (solo backend).

Por cada etapa se crean filas en un modelo propio `Dispatch` (una por destino) y se encola una tarea de celery con `transaction.on_commit`. Matriz:

- placed → `ga4` (`add_payment_info`), `meta` (`AddPaymentInfo`), `backend` (`pending`)
- paid → `ga4` (`purchase`), `meta` (`Purchase`), `backend` (`paid`)
- expired → `backend` (`expired`)
- canceled → `backend` (`canceled`)

### Modelo `Dispatch`

- `order` (FK a `Order`, `on_delete=CASCADE`), `destination` (`ga4`, `meta`, `backend`), `stage` (`placed`, `paid`, `expired`, `canceled`)
- `status` (`pending`, `retry`, `sent`, `skipped`, `failed`), `attempts`, `next_attempt_at`, `sent_at`, `last_error` (texto corto), `response` (JSON, recortado), `created_at`
- Restricción única `(order, destination, stage)`: crear con `get_or_create`; las señales repetidas no duplican.

### Reintentos

- La tarea procesa una fila. Ante timeout, error de red o `5xx`: `retry` con `next_attempt_at` en 5 min, 15 min, 1 h, 6 h, 24 h; después `failed`. Ante `4xx`: `failed` de inmediato con el cuerpo de la respuesta en `last_error`.
- Receptor de `periodic_task` (lo dispara `pretixcron` cada 5 min) que encola las filas `pending` o `retry` vencidas. Seguir el patrón de `pretix_wompi/signals.py` y `tasks.py`, incluida la cola del worker de fondo (no la del comprador).
- Timeout de cada petición HTTP: 10 s. Biblioteca `requests` (ya es dependencia).

### Cuándo se omite (fila `skipped` con el motivo)

- Plugin sin configurar para ese destino (faltan ID o secreto).
- Todos los destinos: pedido sin `api_meta.consent`, es decir, creado antes de `consent_since`, aunque se pague después. Motivo `anterior al consentimiento`. Se decide por la fecha de creación, nunca por la de pago.
- `meta`: correo o teléfono del pedido en la lista `ad_exclusions` (personas que pidieron no ser incluidas en publicidad). Motivo `excluido a pedido`.
- `meta` y `backend`: pedido sin correo ni teléfono.
- Pedidos de prueba (`order.testmode`, solo existen en el evento sandbox): `ga4` va al endpoint de depuración (valida el cuerpo sin ensuciar los informes), salvo que el ajuste `ga4_send_testmode` esté activo, que lo manda al endpoint normal con el parámetro `entorno: "prueba"` (se activa solo durante el ensayo para ver la atribución en Tiempo real, y se apaga después), `meta` solo si hay `meta_test_event_code` (y lo incluye), `backend` con `"testmode": true` (el backend decide qué hacer).
- `meta` etapa paid: si pasaron más de 7 días desde el pago (Meta rechaza el lote).

### GA4 (Measurement Protocol)

`POST https://www.google-analytics.com/mp/collect?measurement_id={ga4_measurement_id}&api_secret={ga4_api_secret}` (en pruebas, `/debug/mp/collect`, que sí devuelve errores; producción responde 2xx aunque el cuerpo esté mal).

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
- `client_id` = `tracking.ga_id`. **Si no hay `ga_id`** (la persona no aceptó cookies o compró directo en la tienda), se envía igual con `client_id` = `pretix.<primeros 16 hex del sha256 del código del pedido>`, sin `session_id`, y `"atribucion": "sin_sesion"`. Así los ingresos de GA4 cuadran con Pretix aunque esa compra salga sin campaña. Nada personal va a GA4.
- `session_id` y `engagement_time_msec` hacen que el evento herede fuente, medio y campaña de la sesión del sitio. Verificar con el informe de Tiempo real y la exploración por "Campaña de la sesión" en la prueba de aceptación.
- `timestamp_micros`: momento de la etapa (confirmación o pago). Si tiene más de 72 h, omitirlo.
- `value`: `order.total` como número; `items` de las posiciones del pedido (id y nombre del producto, precio, cantidad agrupada por producto).

### Meta (Conversions API)

`POST https://graph.facebook.com/{version}/{meta_dataset_id}/events?access_token={meta_capi_token}`. Usar la versión vigente de la Graph API al implementar y dejarla en una constante.

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
- `external_id` por persona (no por pedido): así Meta junta los eventos de la misma persona en varios pedidos.
- Normalización antes del hash: correo en minúsculas sin espacios; teléfono solo dígitos con indicativo (`+57 300 123 4567` → `573001234567`; Pretix guarda el teléfono en E.164); nombre y apellido en minúsculas, sin tildes, sin espacios ni signos; país `co` (o el del pedido si existe). SHA-256 en hex minúsculas.
- **Solo datos del comprador** (obligación legal): correo y teléfono del pedido; nombre solo de `order.invoice_address.name_parts`. **Nunca** los nombres de asistentes (`attendee_name_parts`): ellos no marcaron la casilla. Sin dirección de facturación, se omiten `fn` y `ln`.
- Nada personal en los logs: ni en claro ni en hash. `response` y `last_error` se guardan sin el cuerpo enviado.
- `fbp`, `fbc`, IP y user-agent sin hash. Campos vacíos se omiten (nunca cadenas vacías). No inventar `fbc`.
- `test_event_code` solo si el ajuste existe.
- Respuesta esperada: `{"events_received": 1, ...}`; guardarla en `response`.

### Backend de Eventalist

Contrato completo en la sección "Contrato con el backend" más abajo. Una petición por etapa.

## 3. Ajustes por evento

Formulario en Configuración del evento (seguir cómo `pretix_wompi` registra su navegación y formulario; guardar en `event.settings` con prefijo `eventalist_tracking_`). Los secretos se muestran enmascarados y no se registran en logs.

- `ga4_measurement_id` (ej. `G-XJES5Z5EC9`), `ga4_api_secret`
- `ga4_send_testmode` (casilla, apagada por defecto; ver pedidos de prueba)
- `meta_dataset_id`, `meta_capi_token`, `meta_test_event_code` (opcional)
- `backend_url` (ej. `https://<backend>/api/v1/marketing/ticket-orders/`), `backend_token`, `backend_campaign_slug` (ej. `testigos-memoria`)
- `consent_since` (fecha y hora en que se guardó la casilla nueva; pedidos creados antes no se envían a ningún destino), `consent_version` (ej. `tienda-2026-10-12`) y `policy_effective` (fecha de vigencia de la política publicada)
- `whatsapp_consent_until` (fecha y hora en que vence la autorización de WhatsApp; para Testigos, `2026-11-08T23:59:59-05:00`, fin del encuentro)
- `ad_exclusions` (texto, un correo o teléfono por línea): personas que pidieron no ser incluidas en publicidad; no van a Meta
- `event_source_url` (opcional; por defecto la URL pública de la tienda del evento)

Si faltan los datos de un destino, ese destino se omite sin error.

## 4. Lo que ve el equipo en Pretix

- En el detalle del pedido (señal `order_info` del panel de control): una caja "Origen" con fuente, medio, campaña, contenido y el estado de cada envío (enviado, reintentando, falló con el motivo).
- Una página en el evento, "Ventas por campaña": para un rango de fechas, por `utm_source` / `utm_campaign` / `utm_content` (y una fila "sin campaña"), cuántos pedidos confirmados, pagados, vencidos y cancelados, y el total pagado. Consulta directa sobre `Order` y `api_meta`. Sin gráficos.
- Un botón "Reintentar envíos fallidos" en esa página.

## Contrato con el backend

**Petición**: `POST {backend_url}` con cabeceras `Authorization: Bearer {backend_token}`, `Content-Type: application/json`, `X-Eventalist-Contract: 1`.

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

- `stage`: `pending`, `paid`, `expired` o `canceled`.
- `occurred_at`: momento de la etapa (confirmación, pago, vencimiento o cancelación). El backend lo usa para ignorar eventos que llegan fuera de orden.
- `consent`: copia de `api_meta.consent` del pedido. `channels` según el texto de la casilla: `email` si hay correo (alcance `event_series_and_local_events`: este encuentro, sus próximas ediciones y otros eventos culturales de Eventalist en Villa de Leyva; sin vencimiento); `whatsapp` solo si hay teléfono (alcance `this_event`: recordatorio de pago y novedades de este encuentro; vence en `whatsapp_consent_until`).
- `contact` es siempre el comprador. Los asistentes no se envían.
- `contact.phone` en E.164; `null` si no hay. Igual con `email`. Al menos uno de los dos (si no, la fila se omite).
- `attribution` con todas las claves; `null` donde no hay dato.

**Respuestas**: `200` `{"status": "ok"}` (también si ya lo tenía: idempotente por `instance + organizer + event + order_code + stage`); `400` cuerpo inválido (no reintentar, `failed`); `401` token malo (`failed`); `409` campaña desconocida o inactiva (`failed`); `5xx` o timeout: reintentar.

## Pruebas

Criterio del titular: nada de pruebas que se sabe que van a pasar o que solo repiten lo que el código acaba de escribir. Lo que demuestra que esto funciona es una compra de verdad en el sandbox, con capturas. Las pruebas automáticas se limitan a lo que **falla en silencio** (nadie se entera hasta semanas después) o **tiene costo legal**.

### Pruebas automáticas (pytest, pocas)

1. **Cifrado para Meta.** Si la normalización está mal, Meta responde "ok" y nunca encuentra a nadie. Comparar contra hashes calculados a mano de casos reales colombianos: correo con mayúsculas y espacios; teléfono `+57 300 123 4567`, `3001234567` y `573001234567` (los tres dan el mismo hash); nombre con tildes y eñe (`Peña`, `José María`).
2. **Cortes legales.** Un pedido creado antes de `consent_since` y pagado después no genera ningún envío. El nombre de un asistente distinto al de facturación no aparece en ningún cuerpo. Un correo en `ad_exclusions` no va a Meta. Nada de correo, teléfono ni hashes en el cuerpo de GA4.
3. **El checkout no depende de nadie.** Con Meta, GA4 y el backend respondiendo con error o sin responder, la confirmación del pedido termina normal y en el mismo tiempo, y los envíos quedan pendientes en `Dispatch`.

No escribir pruebas de: tiempos exactos de los reintentos, cada código de error HTTP, forma del JSON (lo cubren el endpoint de depuración de GA4 y "Test events" de Meta en el ensayo), formularios de ajustes ni plantillas.

### Ensayo completo en el evento sandbox (la prueba principal)

En la instancia real, en el **evento sandbox** que ya existe (clon de Testigos en modo prueba con llaves de prueba de Wompi; ver `docs/LOGISTICA-EVENTO.md` y `docs/CHECKOUT-TUNING.md` de este repo). **Nunca poner en modo prueba el evento de producción**: los compradores reales harían pedidos de prueba.

Preparación: plugin activo en el sandbox con `consent_since` en el pasado, `meta_test_event_code` puesto, `ga4_send_testmode` activo solo durante el ensayo y `backend_campaign_slug` = `testigos-sandbox` (el backend acepta contactos de prueba solo para esa campaña). Una página HTML local con el widget del sandbox y los atributos `data-tracking-*` (`utm-campaign="ensayo"`, `ga-id` y `ga-sessid` reales tomados del navegador con GA4 cargado, `fbc="fb.1.1.TEST123"`), abierta con una URL con UTM.

1. **Pedido pagado.** Comprar con la tarjeta de prueba de Wompi. Comprobar con captura: GA4 Tiempo real muestra `add_payment_info` y `purchase` con la campaña `ensayo`; Meta "Test events" muestra `AddPaymentInfo` y `Purchase` con calidad de coincidencia alta; el admin del backend muestra el pedido pagado y el contacto en `purchased`; la página "Ventas por campaña" de Pretix lo cuenta.
2. **Pedido sin pagar.** Confirmar otro con un correo distinto y no pagar. Captura: backend en `order_pending`; Meta tiene `AddPaymentInfo` y no `Purchase`.
3. **Pedido vencido.** Dejar vencer el anterior (o acortar el plazo en el sandbox). Captura: backend `expired`; nada nuevo en Meta ni GA4.
4. **Backend caído.** Poner una `backend_url` que no responde, hacer un pedido y medir que el checkout tarda lo mismo. Restaurar la URL y ver que el envío pendiente sale solo en el siguiente ciclo de `pretixcron`.
5. **Checkout igual.** Recorrer la compra con y sin el plugin activo: mismos pasos, mismos textos, mismos correos.

### En producción, después del despliegue

1. Activar el plugin en el evento real, con los ajustes reales.
2. Una persona del equipo abre la tienda desde el sitio con una URL con UTM, elige una boleta, llena sus datos y llega a la pantalla de pago de Wompi **sin pagar**. Eso demuestra que la compra sigue funcionando sin gastar plata. Su correo va antes a `ad_exclusions` para no ensuciar los públicos.
3. Revisar que ese pedido muestra la caja "Origen" con la campaña y que el backend lo recibió.
4. Si alguien del equipo necesita una boleta de verdad, esa compra real es la prueba final del pago.

## Despliegue

- Paquete propio en este repo: carpeta `pretix-eventalist-tracking/` con su `pyproject.toml` (entry point `pretix.plugin`), con migración para `Dispatch`. Añadir al `Dockerfile` un `RUN pip3 install /tmp/pretix-wompi/pretix-eventalist-tracking` junto al de Wompi.
- Tras desplegar: activar el plugin en el evento y llenar los ajustes.
- El día de la publicación coordinada (política y términos nuevos ya publicados en el sitio), en el panel del evento: reemplazar el texto de la casilla (Confirmation text) y el texto de ayuda del teléfono por los del dictamen, y poner en `consent_since` la hora exacta en que se guardó la casilla. Lo hace el titular o con él.
- Ningún despliegue a producción sin visto bueno del titular.

## Qué devolver al terminar

Un `.md` corto: versión de pretix comprobada; nombre del plugin en el panel; firma real de `order_api_meta_from_request`; las capturas de cada paso del ensayo en el sandbox (GA4 Tiempo real, Meta Test events, admin del backend, Ventas por campaña) con el JSON de `api_meta` de un pedido; el tiempo del checkout con el backend caído; y cualquier diferencia con este documento marcada como **CAMBIO**. Sin listados de pruebas pasadas: solo qué se probó y qué se vio. Se guarda en el repo del sitio como `docs/medicion-embudo/resultado-pretix.md`.
