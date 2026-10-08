# Comprobaciones en el navegador · 2026-10-08

Sitio local (`npm run dev`), Chrome. Resultados leídos con la consola del navegador sobre el input
`widget_data` del widget y sobre `dataLayer`. Sin pulsar "Comprar" en la tienda real: no se creó
ningún carrito ni pedido.

## Contra `testigos-sandbox` (PUBLIC_PRETIX_EVENT_URL)

- El widget toma el evento del sandbox (`event` = `.../testigos-sandbox/`).
- Atributos en `div.pretix-widget-wrapper`, sin aceptar cookies: `data-tracking-utm-source=prueba`,
  `data-tracking-utm-campaign=ensayo`, `data-tracking-landing=/`. Ningún identificador.
- **Bloqueo**: la tienda del sandbox está desactivada ("La taquilla virtual está actualmente
  desactivada"). El widget no pinta productos ni formulario, y su propio script lanza
  `TypeError ... formAction` en consola (error del widget con la tienda apagada, no del sitio).
  Falta activar la tienda del sandbox para probar "Comprar" y el ensayo con el plugin.

## Contra `testigos-memoria` (sin variable), solo lectura

- Con aceptación previa guardada en el navegador (pestaña nueva, sin volver a aceptar), entrada con
  `?utm_source=prueba&utm_campaign=ensayo&fbclid=TEST123`:
  `tracking-utm-source: prueba`, `tracking-utm-campaign: ensayo`, `tracking-landing: /`,
  `tracking-ga-id`, `tracking-ga-sessid`, `tracking-fbc: fb.1.<ms>.TEST123`, `tracking-consent: "1"`.
  Filtro de "null"/"undefined": `[]`.
- Retirar la aceptación desde "Cookies y preferencias": `tracking-ga-id`, `tracking-ga-sessid`,
  `tracking-fbc` y `tracking-consent` pasan a `null` de JSON (el plugin los ignora); UTM y `landing`
  intactas. Filtro de "null"/"undefined": `[]`.
- Navegar a `/panelistas/` y volver: la campaña se mantiene.
- Visita orgánica que entra por `/panelistas/` y va a la portada: solo `tracking-landing: /panelistas/`.
  (`/programacion/` redirige a `/#agenda`, por eso su llegada cuenta como `/`.)
- Cuatro clics en CTA distintos (cabecera, hero, panelistas, agenda): un solo `view_item_list` y
  ningún `begin_checkout`. Los CTA hacia `#boletas` de la portada están en cabecera, hero, panelistas,
  agenda (9) y preguntas frecuentes.
- `submit` sintético (no envía nada) sobre el formulario de la tienda, dos veces: un solo
  `begin_checkout` con `currency: COP` y `event_id`. Un formulario ajeno dentro de `.tickets-widget`
  pero fuera del wrapper: ningún evento.
- Consola sin errores en todas estas páginas.

## Build

- `npm run check`: 0 errores, 0 avisos, 2 pistas (las mismas de la línea base).
- `npm run build`: 36 páginas. `grep testigos-sandbox dist/`: ninguno.
- Bundle con `tags.ts` y `attribution.ts`: 2784 bytes gzip en total.
- Páginas legales: presentes las frases nuevas del §C (incluida "la dirección IP y el tipo de
  navegador desde los que se hizo el pedido"); ausentes "no se transmiten a estos proveedores",
  "lo autorice por separado", "si lo indica, el teléfono", "si este lo indica",
  "[fecha de publicación]" y " — ". La fecha de vigencia sigue en 17 de septiembre hasta fijar D.

## Pendiente

- Con la tienda del sandbox activa: "Comprar" real (§7.2 y §7.3), §2 en pestaña privada, §8 con
  bloqueador y el caso sin almacenamiento.
- Ensayo conjunto con el plugin (§10) y verificación en producción (§11).
