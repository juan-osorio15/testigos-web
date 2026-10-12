# Contrato: atributos del widget y eventos de navegador

Reemplaza, para estos dos temas, lo que dicen `specs/002-seo-medicion-visibilidad/contracts/measurement-events.md` ("Eventos", "Degradación") y `specs/001-event-landing/contracts/pretix-embed.md` ("el widget no se toca"). Del lado de Pretix, el contrato es `docs/medicion-embudo/prompt-pretix.md` ("widget_data").

## Atributos `data-tracking-*`

Lista exacta de `diseno.md`. Un atributo se escribe solo si su valor es texto no vacío tras `trim()`; un dato que falta no se escribe. Nunca con las cadenas "null" ni "undefined", que el plugin enviaría como datos reales (research R-05b). Una clave quitada queda `null` en `widget_data` y el plugin la ignora.

Siempre que exista el dato:

- `data-tracking-utm-source`, `data-tracking-utm-medium`, `data-tracking-utm-campaign`, `data-tracking-utm-content`, `data-tracking-utm-term`
- `data-tracking-landing`
- `data-tracking-referrer`: dominio desde el que se llegó (enmienda del 2026-10-12, abajo)

Solo con el aviso de cookies aceptado (versión vigente):

- `data-tracking-gclid`
- `data-tracking-ga-id` (client_id de GA4), `data-tracking-ga-sessid` (session_id de GA4)
- `data-tracking-fbp` (cookie `_fbp`), `data-tracking-fbc` (cookie `_fbc` o construido: `fb.1.<ms>.<fbclid>`)
- `data-tracking-consent="1"`

Nunca: `data-consent` (clave reservada por Pretix), ni ningún otro `data-tracking-*`.

Dónde se escriben: en `.tickets-widget .pretix-widget-wrapper` si existe; si no, en `.tickets-widget pretix-widget`.

Cuándo se sincronizan: al iniciar, al aparecer el wrapper, en `tdm:consent` y `tdm:revoke`, al responder `gtag('get')`, en `pointerdown` y `focusin` dentro de `.tickets-widget` y en el `submit` de captura.

Lo que recibe Pretix (ejemplo con aceptación):

```json
{
  "tracking-utm-source": "prueba",
  "tracking-utm-campaign": "ensayo",
  "tracking-landing": "/",
  "tracking-referrer": "instagram.com",
  "tracking-ga-id": "1234567890.1700000000",
  "tracking-ga-sessid": "1700000000",
  "tracking-fbp": "fb.1.1700000000000.1234567890",
  "tracking-fbc": "fb.1.1700000000000.TEST123",
  "tracking-consent": "1"
}
```

## Enmienda 2026-10-12 · dominio de referencia

Para la v2 del plugin (`pretix-wompi`, `docs/propuestas/2026-10-09-tracking-v2.md` punto 3), que clasifica los pedidos sin UTM en directo, orgánico, social o referido. Dentro del widget el referrer es la página del sitio, así que solo el sitio puede verlo.

- `data-tracking-referrer`: el `hostname` de `document.referrer`, en minúsculas y sin `www.`; sin ruta ni consulta; recortado a 200 caracteres. Va siempre que exista, con o sin UTM y sin depender del aviso de cookies, como las UTM.
- No se guarda si es el propio dominio del sitio (con o sin `www`), `pretix.eventalist.co` o `checkout.wompi.co`: volver de la tienda o de la pasarela no es una fuente.
- Gana la última llegada con campaña; una llegada desde otro sitio sin campaña solo reemplaza una visita que tampoco la tenía (reglas en `data-model.md`). El plugin no repite esta lógica: toma lo que trae el carrito.
- Compatibilidad confirmada por `pretix-wompi`: el plugin v1 guarda cualquier `tracking-*` en el pedido (recortado a 512) y no lo envía a GA4, Meta ni al backend, porque esos envíos usan campos explícitos. Se puede publicar antes que la v2.
- Política: la sección 2 dice ahora "el sitio desde el que se llegó".

## Eventos de navegador

Clic en un enlace a `#boletas` (cabecera, hero, panelistas, agenda, cierre), primer clic de la página:

- GA4: `view_item_list` con `{ item_list_name: 'boletas' }`
- Meta: `ViewContent` con `{ content_name: 'boletas' }` (solo si el píxel cargó)

Envío del formulario dentro de `.tickets-widget .pretix-widget-wrapper` ("Comprar"), primera vez en la página:

- GA4: `begin_checkout` con `{ currency: 'COP', event_id }`
- Meta: `InitiateCheckout` con `{ currency: 'COP' }` y `{ eventID }`, el mismo identificador
- Sin `value` (research R-06).

No disparan nada: el formulario de interesados, el modal "avísame" ni ningún otro formulario.

## Degradación

- Todo en `try/catch`, sin escribir en la consola.
- Nada se espera ni se cancela: ni `preventDefault`, ni temporizadores antes del envío.
- El widget sigue con `disable-iframe`.
