# Research · 003 embudo del sitio

Cada punto: decisión, por qué y qué más se consideró. Los hechos sobre el widget vienen de `docs/medicion-embudo/prompt-sitio.md` ("Hechos verificados", 2026-10-08) y se vuelven a comprobar en el navegador durante la implementación (quickstart §2).

## R-01 · Dónde escribir los atributos

- **Decisión**: una función `syncWidgetAttributes()` busca primero `.tickets-widget .pretix-widget-wrapper` y, si no existe, `.tickets-widget pretix-widget`, y escribe ahí. Un `MutationObserver` sobre `.tickets-widget` (hijos, con subárbol) detecta cuando aparece el wrapper, sincroniza una vez y se desconecta.
- **Por qué**: el script del widget carga `async`. Antes de construirse, Vue lee el `<pretix-widget>`; después, el elemento original ya no existe y solo vigila los `data-*` del wrapper.
- **Alternativas**: poner los atributos en el HTML compilado (no sirve: la campaña y los identificadores se conocen en el navegador); esperar a que el widget se construya antes de escribir (atrasaría los datos si el widget tarda, sin ganar nada).

## R-02 · Cuándo volver a sincronizar

- **Decisión**: al iniciar, al aparecer el wrapper, en `tdm:consent` y `tdm:revoke`, cuando responde `gtag('get', …)` y en `pointerdown` y `focusin` dentro de `.tickets-widget` (fase de captura). También en el `submit` de captura, como último intento sin costo.
- **Por qué**: `_fbp` aparece segundos después de aceptar (el píxel carga en idle). La interacción con el widget siempre precede a "Comprar", y el `MutationObserver` del widget más la actualización de Vue se resuelven en microtareas, antes del envío nativo.
- **Alternativas**: sondeo con temporizador (gasta y no garantiza el momento); `preventDefault` en el envío para esperar los identificadores (prohibido: cambia el comportamiento del widget y puede romper el `target="_blank"`).

## R-03 · Identificadores de GA4

- **Decisión**: `gtag('get', ga4Id, 'client_id', cb)` y `gtag('get', ga4Id, 'session_id', cb)`, cada uno con tope de 2 s; el resultado se guarda en memoria del módulo (no en almacenamiento) y se vuelve a pedir al aceptar. Sin aceptación no se consulta.
- **Por qué**: es la API documentada de gtag para esos dos campos; el plugin los usa como `client_id` y `session_id` del Measurement Protocol.
- **Alternativas**: leer y descomponer la cookie `_ga` / `_ga_<id>` (formato interno, cambia sin aviso).

## R-04 · `fbc` construido

- **Decisión**: si hay `fbclid` en la campaña de la pestaña y no hay cookie `_fbc`, `fbc = fb.1.<captura en ms>.<fbclid>`, usando la hora en que se capturó el `fbclid`. Solo con aceptación.
- **Por qué**: es el formato que documenta Meta para el parámetro `fbc` cuando no existe la cookie; la hora de captura es la hora real del clic.
- **Alternativas**: escribir nosotros la cookie `_fbc` (crearía una cookie de publicidad propia; no hace falta).

## R-05 · Revocación y claves `null`

- **Decisión**: al revocar se quitan los atributos (`removeAttribute`). En `widget_data` quedan con `null` si el widget ya estaba construido.
- **Por qué**: no existe forma de borrar una clave desde fuera del widget. Escribir un valor vacío viola "ningún atributo vacío" y un valor ficticio sería peor.
- **Dependencia**: `pretix-wompi` debe tratar `null` como ausente (pregunta abierta en `estado.md`). Si responde que no, el ajuste es del plugin, no del sitio.

## R-06 · Disparador de `begin_checkout`

- **Decisión**: listener de `submit` en `document`, fase de captura; cuenta solo si el formulario está dentro de `.tickets-widget .pretix-widget-wrapper`. Una vez por página. Sin `value`.
- **Por qué**: con `disable-iframe` el "Comprar" es un envío nativo sin `preventDefault`. El formulario de interesados y el modal "avísame" no están dentro del wrapper. Sobre `value`: el valor de compra lo manda el plugin desde el pedido real; leer cantidades y precios del DOM del widget es frágil y no le suma nada al informe, así que por la regla del diseño se omite (anotado en `diseno.md`).
- **Alternativas**: clic en el botón "Comprar" (no cubre el envío con Enter y depende de clases internas).

## R-07 · `view_item_list` y `ViewContent`

- **Decisión**: el clic en `a[href$="#boletas"]` envía `view_item_list` con `item_list_name: 'boletas'` y `ViewContent` con `content_name: 'boletas'`, una vez por página (clarify).
- **Por qué**: son los eventos estándar de "vio la lista" en GA4 y Meta, y no tienen el significado de intención de compra.

## R-08 · URL del evento desde una variable

- **Decisión**: `PRETIX_EVENT_URL = import.meta.env.PUBLIC_PRETIX_EVENT_URL || '<testigos-memoria>'`, aceptada solo si empieza por `https://pretix.eventalist.co/`. Se pasa en la línea de comandos (`PUBLIC_PRETIX_EVENT_URL=… npm run dev`), no en un archivo `.env`.
- **Por qué**: Astro sustituye `import.meta.env.PUBLIC_*` al compilar. El workflow de GitHub Pages no la define, así que lo publicado siempre usa `testigos-memoria`. Sin archivo `.env` no hay riesgo de que quede uno olvidado (de todos modos está en `.gitignore`).
- **Alternativas**: editar `config.ts` para el ensayo (el prompt lo prohíbe; riesgo de publicarlo).

## R-09 · Largo de los valores

- **Decisión**: cada valor se recorta a 200 caracteres (decisión de detalle anotada en `diseno.md`).
- **Por qué**: un enlace mal armado o malicioso no debe meter kilobytes en `widget_data` ni en la URL de la tienda, que lo lleva como parámetro.

## R-10 · Textos legales fuera del dictamen

- **Decisión**: los dos ajustes del teléfono (clarify) se pasan al abogado interno (`abogado-eventalist`) antes del commit. También se le pregunta por una frase que el dictamen no tocó: la sección 10 dice que GA4 mide la "intención de compra (el paso a la sección de boletas)"; desde esta feature, la intención de compra es pulsar "Comprar" en la tienda. Solo se cambia si él lo aprueba.
- **Por qué**: el dictamen es la fuente del texto. Cualquier frase que no salga de él necesita su visto bueno.

## R-11 · Orden de publicación

- **Decisión propuesta** (sin fechas, las fija el titular):
  1. Ensayo en `testigos-sandbox` con el sitio local y el plugin desplegado (paso 3 de la guía de `pretix-wompi`).
  2. El titular escoge el día D. Un solo push a `main` ese día con el código y los textos legales, con `DATA_POLICY_EFFECTIVE`, `TERMS_EFFECTIVE` y la "[fecha de publicación]" de la política iguales a D. Los commits legales van separados dentro del mismo push.
  3. Comprobación de que lo publicado tiene los textos nuevos (`curl` de las dos páginas).
  4. Ese mismo día D, el titular cambia la casilla y el texto de ayuda del teléfono en `testigos-memoria` y fija `consent_since` a esa hora.
  5. Alguien del equipo llega a la pantalla de pago de Wompi en producción sin pagar y revisa `widget_data`.
- **Por qué**: el código es inofensivo sin el plugin (Pretix guarda `widget_data` solo para prellenar y no usa claves `tracking-*`). Publicar el código antes que los textos haría que el sitio entregue identificadores a Pretix mientras la política vigente dice que no se transmiten; por eso van juntos. Si la casilla cambia otro día, la política cubre desde D y el plugin desde T0; entre ambos no se envía nada, que es lo conservador.
- **Alternativa**: publicar los textos antes y el código después (dos despliegues, sin ganancia).
