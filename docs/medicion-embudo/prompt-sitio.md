# Prompt · parte del sitio del embudo de medición (repo `testigos-web`)

Eres el agente que implementa la parte del sitio del embudo de venta por campaña. Trabajas en este repo (`testigos-web`, Astro estático publicado en GitHub Pages). Además de implementar, eres un **segundo par de ojos**: si al leer el diseño o el código encuentras algo que no cuadra, dilo antes de construir encima.

## Proceso: Spec Kit completo

Este repo usa Spec Kit (`.specify/`, `specs/001`, `specs/002`). Haz la feature **`specs/003-embudo-sitio/`** desde `/speckit.specify`: specify, clarify, plan, tasks y analyze. **Detente después de analyze** y entrega al titular un resumen para que lo revise. La implementación arranca solo con su visto bueno.

- El diseño ya está aprobado y revisado por los agentes de `pretix-wompi` y `eventalist-backend`. El `spec.md` describe la parte del sitio y sus criterios de aceptación, y **remite** a `docs/medicion-embudo/diseno.md` para el contexto en vez de copiarlo: no debe haber dos fuentes de verdad.
- En clarify, pregunta solo lo que los documentos no resuelven. La lista de "Puntos abiertos" de abajo es el punto de partida.
- Si algo del diseño cambia, se cambia primero en `docs/medicion-embudo/diseno.md` y después en la spec.

## Qué leer, en este orden

1. `docs/medicion-embudo/diseno.md`: objetivos, flujo de datos y la sección "Parte del sitio (este repo)". Es la fuente de verdad de los tres repos.
2. `docs/medicion-embudo/estado.md`: en qué va cada repo, la guía de producción de los otros dos y las preguntas abiertas. Cada repo edita solo su sección; las preguntas para otros van en "Preguntas abiertas".
3. `docs/revision-legal-2026-10-06-embudo.md`: el dictamen legal. La sección C trae el texto exacto de los cambios a la política y a los términos. La nota inicial registra la decisión del titular sobre el teléfono.
4. `docs/medicion-embudo/prompt-pretix.md`: el contrato del lado de Pretix. Lo que importa aquí: cómo el plugin lee `widget_data` (le quita `tracking-` y cambia guiones por guion bajo) y qué espera de cada atributo.
5. `specs/002-seo-medicion-visibilidad/`, sobre todo `contracts/measurement-events.md`. Esta feature **cambia ese contrato**: hoy `begin_checkout` se dispara al hacer clic en un enlace a `#boletas`, y pasa a dispararse al enviar el formulario del widget. Actualizar el contrato de 002 (o dejar en él una nota que remita a 003) es parte del trabajo.
6. El código actual:
   - `src/measurement/tags.ts`: eventos de navegador y píxel; el clic en CTA hoy dispara `begin_checkout`.
   - `src/measurement/consent.ts`: estado del aviso de cookies, y los eventos `tdm:consent` y `tdm:revoke`.
   - `src/components/TicketSection.astro`: el `<pretix-widget disable-iframe>` y el script que adapta la lista.
   - `src/layouts/EventLayout.astro`: carga GA4 y el script del widget (async, en `<head>`), y llama a `initMeasurement()`.
   - `src/config.ts`: `PRETIX_EVENT_URL`, `measurement`, `DATA_POLICY_EFFECTIVE`, `TERMS_EFFECTIVE`, `EVENTALIST_CAMPAIGN`.
   - `src/pages/tratamiento-de-datos.astro` y `src/pages/terminos-y-condiciones.astro`.
   - `docs/pretix-tienda-textos.md`: los textos de la tienda, incluida la casilla.
7. `docs/medicion-embudo/titular/`: las guías para el titular (evento sandbox y reportes del informe). Contexto, no se tocan.

## Alcance

- **Captura de campaña** (`src/measurement/attribution.ts`, nuevo), tal como dice el diseño: UTM, `gclid` y `fbclid` en `sessionStorage['tdm.attribution']`, con la página de llegada.
- **Atributos `data-tracking-*` en el widget**, con la lista exacta del diseño. Ningún atributo vacío. Los identificadores de la visita (`ga-id`, `ga-sessid`, `fbp`, `fbc`, `consent`) solo con el aviso de cookies aceptado.
- **Eventos de navegador**: el clic en un CTA a `#boletas` pasa a `view_item_list` (GA4, `item_list_name: 'boletas'`) y `ViewContent` (Meta). `begin_checkout` e `InitiateCheckout` quedan solo para el envío del formulario del widget, una vez por página.
- **Textos legales**: los cambios de la sección C del dictamen, incluida la nota de implementación (IP y navegador en la enumeración de la sección 10), con `DATA_POLICY_EFFECTIVE` y `TERMS_EFFECTIVE` nuevas y los comentarios de cabecera que hoy dicen que el envío a Google y Meta "se retiró". `docs/pretix-tienda-textos.md` con la casilla A del dictamen y el texto de ayuda del teléfono de la nota inicial.
- **Probar contra el sandbox sin tocar `config.ts`**: que `PRETIX_EVENT_URL` pueda tomarse de una variable `PUBLIC_PRETIX_EVENT_URL` en local, con el evento real como valor por defecto. Así el sitio local apunta a `https://pretix.eventalist.co/eventalist/testigos-sandbox/`.

## Hechos verificados que el diseño no dice

Comprobados el 2026-10-08 en el sitio publicado y en el script público del widget (`https://pretix.eventalist.co/widget/v2.es.js`). Confírmalos si dudas, pero no los des por falsos sin probar.

- **Después de construirse, el widget ya no tiene `<pretix-widget>` en el DOM.** Vue lo reemplaza por `div.pretix-widget-wrapper`, que conserva los atributos originales (`event`, `disable-iframe`, `data-*`).
- **El widget sí lee los atributos que se agregan después de construirse**, pero solo en ese `div.pretix-widget-wrapper`: lo vigila con un `MutationObserver` y hace `Vue.set(widget_data, nombre_sin_data-, valor)`. Antes de construirse, los lee del `<pretix-widget>` original. La función que pone los atributos debe escribir en el que exista en ese momento.
- **Quitar un atributo no borra la clave**: queda con valor `null` en `widget_data`. Hay una pregunta abierta para `pretix-wompi` sobre si el plugin trata `null` como ausente (en `estado.md`).
- **Cómo comprobar lo que viaja**: el formulario del widget tiene `<input type="hidden" name="widget_data">` con el JSON actual. En la consola: `JSON.parse(document.querySelector('.tickets-widget input[name=widget_data]').value)`.
- **La clave `consent` está reservada por Pretix**: el widget la saca de `widget_data` y la manda como parámetro de su propio aviso de cookies. No usar nunca `data-consent`. El nuestro es `data-tracking-consent`, que no choca.
- **Con `disable-iframe`, "Comprar" hace un envío nativo del formulario** con `target="_blank"`: el método `buy` del widget retorna sin `preventDefault`. Un listener de `submit` en fase de captura lo ve. Ojo: el formulario de interesados (`WaitlistForm`) también vive dentro de `.tickets-widget` cuando la tienda no está activa, y el modal "avísame" tiene otro. Solo cuenta un formulario dentro de `.pretix-widget-wrapper`.
- **El script del widget carga `async`**: puede construirse antes o después de que corra el script del sitio.
- **`_fbp` aparece segundos después**: el píxel se carga en idle tras aceptar las cookies, y `gtag('get', …)` responde de forma asíncrona. Vue actualiza el input oculto en microtareas. Volver a sincronizar los atributos en `pointerdown` o `focusin` dentro del widget alcanza a reflejarse antes del envío.

## Restricciones

- Nada retrasa ni cambia el comportamiento del widget. Todo en `try/catch`, sin errores en la consola. El widget sigue con `disable-iframe` (arreglo del pago "cargando", commit `8087686`).
- `sessionStorage` solo para `tdm.attribution`. Nada de `localStorage` ni cookies para la campaña.
- TypeScript estricto, sin `any`. Comprobación: `npm run check` y `npm run build` (este repo no tiene `lint` ni `typecheck`).
- **Pruebas**: el titular no quiere pruebas que se sabe que van a pasar ni las que ya garantiza TypeScript. Este repo no tiene corredor de pruebas y no se agrega uno sin una razón concreta de algo que falle en silencio. La prueba de verdad es en el navegador, con capturas:
  - El sitio local apuntando a `testigos-sandbox`, entrando con `?utm_source=prueba&utm_campaign=ensayo&fbclid=TEST123`. Revisar el input `widget_data`: sin aceptar cookies, solo UTM, `gclid` y `landing`. Después de aceptar, además los identificadores y `tracking-consent: "1"`.
  - Navegar a otra página y volver: la campaña se mantiene. Revocar las cookies: los identificadores se van.
  - En la pestaña Red, `view_item_list` al hacer clic en un CTA y `begin_checkout` una sola vez al pulsar "Comprar" en el widget.
  - La compra completa con la tarjeta de prueba 4242 se hace en el ensayo conjunto con el plugin desplegado (paso 3 de la guía de `pretix-wompi` en `estado.md`).
- **Nunca** poner en modo prueba el evento de producción `testigos-memoria`. Los ensayos van en `testigos-sandbox`.
- **Textos visibles**: en español, sin " — " (usar punto seguido o "·"). Las páginas legales son documentos sobrios.
- **Documentos**: sin tablas de Markdown; listas y encabezados.
- **Git**:
  - Commits locales sí. **Ningún push ni despliegue sin el visto bueno del titular para ese cambio**: un push a `main` publica el sitio.
  - El hook del repo bloquea `git add` de archivos ocultos (`.npmrc`, `.github/...`) y de varios archivos en una misma llamada: agrega un archivo por llamada.
  - Termina los mensajes de commit con la línea de coautoría que te indique el entorno.

## Publicación (para el plan)

Los textos legales tienen que estar publicados **antes** de que el titular cambie la casilla en Pretix y fije `consent_since` en el plugin. La fecha "[fecha de publicación]" de la política es ese día: puede ser la misma `DATA_POLICY_EFFECTIVE`. El código de atribución puede ir en el mismo despliegue. El plan debe proponer el orden y no fijar fechas sin preguntarle al titular.

Después de publicar, alguien del equipo llega hasta la pantalla de pago de Wompi en producción **sin pagar**, y revisa el input `widget_data`.

## Puntos abiertos para clarify

- **Teléfono**: los términos del dictamen dicen "y, si lo indica, el teléfono", pero el teléfono es obligatorio por decisión del titular. ¿Se ajusta a "y el teléfono"?
- **`landing` sin campaña**: el diseño guarda la página de llegada solo cuando la URL trae parámetros. ¿También para visitas orgánicas?
- **`view_item_list`**: ¿una vez por página, como `begin_checkout`, o en cada clic?
- **`gclid` sin cookies**: el diseño lo trata como parámetro de campaña y lo manda aunque no se acepten cookies, y la política nueva lo cubre como "parámetros de campaña de la dirección web". Confirmarlo o proponer lo contrario.
- **Cambio histórico en GA4**: desde la publicación, `begin_checkout` deja de contar clics en el CTA. Los informes antes y después no son comparables. Anotarlo para la guía de informes (`docs/medicion-embudo/guia-informes-y-publicos.md`, entregable posterior).

## Qué entregar

- La feature `specs/003-embudo-sitio/` hasta analyze, y un resumen para el titular: qué se construye, qué cambia en 002, las dudas de clarify con su respuesta y cualquier cosa del diseño que te parezca mal.
- Tu sección `testigos-web` de `estado.md` actualizada con fecha, y tus preguntas para otros repos en "Preguntas abiertas".
- Después de implementar, con el visto bueno: capturas de las comprobaciones en el navegador, en `specs/003-embudo-sitio/` o en `estado.md`.
