# Contrato: atributos del widget y eventos de navegador

Reemplaza, para estos dos temas, lo que dicen `specs/002-seo-medicion-visibilidad/contracts/measurement-events.md` ("Eventos", "Degradación") y `specs/001-event-landing/contracts/pretix-embed.md` ("el widget no se toca"). Del lado de Pretix, el contrato es `docs/medicion-embudo/prompt-pretix.md` ("widget_data").

## Atributos `data-tracking-*`

Lista exacta de `diseno.md`. Nunca con valor vacío; un dato que falta no se escribe.

Siempre que exista el dato:

- `data-tracking-utm-source`, `data-tracking-utm-medium`, `data-tracking-utm-campaign`, `data-tracking-utm-content`, `data-tracking-utm-term`
- `data-tracking-landing`

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
  "tracking-ga-id": "1234567890.1700000000",
  "tracking-ga-sessid": "1700000000",
  "tracking-fbp": "fb.1.1700000000000.1234567890",
  "tracking-fbc": "fb.1.1700000000000.TEST123",
  "tracking-consent": "1"
}
```

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
