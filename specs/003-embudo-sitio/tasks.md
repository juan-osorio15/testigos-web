# Tasks: Embudo de venta por campaña · parte del sitio

**Input**: `specs/003-embudo-sitio/` (spec, plan, research, data-model, contracts/widget-tracking.md, quickstart)

**Pruebas**: sin pruebas automáticas (decisión del titular, plan "Testing"). Cada historia cierra con su comprobación en el navegador según `quickstart.md`, con capturas en `specs/003-embudo-sitio/capturas/`.

**Reglas para quien implemente**:
- Arrancar solo con el visto bueno del titular sobre esta feature.
- Commits locales; ningún push. Un archivo por `git add` (el hook bloquea varios a la vez y los ocultos). Cada cambio de texto legal en su propio commit.
- TypeScript estricto, sin `any`. Todo acceso a `window.gtag`, `window.fbq`, `sessionStorage`, `localStorage`, `document.cookie` y al DOM del widget va en `try/catch`, sin escribir en la consola.
- Textos visibles en español, sin " — ".

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Comprobar la línea base: `npm run check` y `npm run build` pasan en `main` antes de tocar nada; anotar cualquier aviso que ya exista para no confundirlo después.

---

## Phase 2: Foundational (bloquea las pruebas de todas las historias)

Cubre también la historia 5 (P2), porque sin ella no se puede probar ninguna otra contra el sandbox.

- [X] T002 En `src/config.ts`, `PRETIX_EVENT_URL` toma `import.meta.env.PUBLIC_PRETIX_EVENT_URL` si existe y empieza por `https://pretix.eventalist.co/`; si no, `https://pretix.eventalist.co/eventalist/testigos-memoria/`. Ajustar el comentario: la variable es solo para pruebas locales y se pasa en la línea de comandos, nunca en un archivo `.env` (research R-08). `PRETIX_WIDGET_CSS` sigue derivándose de `PRETIX_EVENT_URL`.
- [X] T003 Crear `src/env.d.ts` con `/// <reference types="astro/client" />` y la interfaz `ImportMetaEnv` con `readonly PUBLIC_PRETIX_EVENT_URL?: string`, para que `npm run check` tipe la variable.

**Checkpoint**: `PUBLIC_PRETIX_EVENT_URL=https://pretix.eventalist.co/eventalist/testigos-sandbox/ npm run dev` muestra el widget del sandbox (quickstart §1).

---

## Phase 3: User Story 1 · Cada pedido llega con la campaña (P1) 🎯 MVP

**Goal**: UTM y página de llegada en `widget_data`, sin depender de las cookies.

**Independent Test**: quickstart §2, §3 y §4.

- [X] T004 [US1] Crear `src/measurement/attribution.ts` con cabecera que remita a `specs/003-embudo-sitio/` y `docs/medicion-embudo/diseno.md`. Tipo `Attribution` según `data-model.md` y `captureAttribution(): Attribution` que aplica las cuatro reglas de data-model (reemplazar si la URL trae algún parámetro con valor; conservar si no trae y hay guardado; guardar solo `landing` y `capturedAt` si no hay nada; trabajar en memoria si `sessionStorage` falla o el JSON está dañado). `landing` = `location.pathname`. Cada valor recortado a 200 caracteres. Clave `tdm.attribution`.
- [X] T005 [US1] En `src/measurement/attribution.ts`, `desiredAttributes(a: Attribution, ids: VisitIds | null): Map<string, string>` que devuelve los `data-tracking-*` del contrato `contracts/widget-tracking.md`, Un atributo entra solo si su valor es de tipo `string` y no queda vacío tras `trim()`; nunca `String(x)` ni plantillas sobre un valor que pueda faltar, para que jamás salgan las cadenas "null" ni "undefined" (research R-05b; el plugin las enviaría como datos reales). En esta historia `ids` llega siempre `null` (sin `gclid` ni identificadores).
- [X] T006 [US1] En `src/measurement/attribution.ts`, `syncWidgetAttributes()`: elemento destino `.tickets-widget .pretix-widget-wrapper` o, si no existe, `.tickets-widget pretix-widget` (research R-01); escribe cada atributo deseado solo si su valor cambió y quita los `data-tracking-*` que ya no están en el conjunto deseado. Nunca escribe `data-consent`. Sin widget en la página, no hace nada.
- [X] T007 [US1] En `src/measurement/attribution.ts`, `initAttribution()`: llama a `captureAttribution()` y `syncWidgetAttributes()`; un `MutationObserver` sobre `.tickets-widget` (`childList`, `subtree`) que sincroniza al aparecer `.pretix-widget-wrapper` y se desconecta; listeners en captura sobre `.tickets-widget` para `pointerdown` y `focusin`, y sobre `document` para `submit`, que llaman a `syncWidgetAttributes()` (research R-02). Ninguno llama a `preventDefault`.
- [X] T008 [US1] En `src/measurement/tags.ts`, llamar a `initAttribution()` al principio de `initMeasurement()`, fuera de la condición `enabled` (las UTM viajan aunque GA4 y el píxel estén apagados). Corregir la cabecera: quitar "Nada viaja al widget de Pretix ni a ningún servidor propio" y explicar qué viaja ahora y dónde está el contrato.
- [X] T009 [P] [US1] En `src/layouts/EventLayout.astro`, cambiar el comentario "Nada viaja al widget de Pretix" del paso 4 del script por uno que remita a `src/measurement/attribution.ts`.
- [ ] T010 [US1] Comprobar quickstart §2, §3 y §4 contra el sandbox, con capturas en `specs/003-embudo-sitio/capturas/` (`us1-sin-cookies.png`, `us1-navegar.png`, `us1-organica.png`). Confirmar en la consola que no hay errores. Commit local. **Parcial (2026-10-08)**: comprobado contra la tienda real sin comprar (`capturas/comprobaciones-2026-10-08.md`); falta repetir en el sandbox, cuya tienda está desactivada.

**Checkpoint**: la campaña viaja sin cookies. Es el MVP: con esto el informe "Ventas por campaña" deja de decir "sin campaña".

---

## Phase 4: User Story 2 · Identificadores con cookies aceptadas (P1)

**Goal**: con aceptación vigente, `gclid`, `ga-id`, `ga-sessid`, `fbp`, `fbc` y `consent=1` en `widget_data`; al revocar, se van.

**Independent Test**: quickstart §5, §6 y §8.

- [X] T011 [US2] En `src/measurement/attribution.ts`, `VisitIds` y su lectura solo si `isAccepted(measurement.consentVersion)` (de `./consent`): `gaId` y `gaSessId` con `window.gtag('get', measurement.ga4Id, 'client_id' | 'session_id', cb)`, tope de 2 s cada uno; validar el tipo de la respuesta antes de guardarla (texto no vacío se acepta; número finito se acepta con conversión explícita; `undefined`, `null` u otro tipo se descartan), guardar en variables del módulo y llamar a `syncWidgetAttributes()` al llegar (research R-03, R-05b); `fbp` y `fbc` leídos de `document.cookie` en cada sincronización (cookie ausente o vacía = sin valor, nunca "undefined"); si no hay `_fbc` y la campaña tiene `fbclid`, `fbc = fb.1.<capturedAt>.<fbclid>` (research R-04). Si `measurement.ga4Id` está vacío o `gtag` no existe, no se consulta.
- [X] T012 [US2] En `src/measurement/attribution.ts`, `desiredAttributes` incluye con aceptación `tracking-gclid`, los identificadores que existan y `tracking-consent="1"`; `syncWidgetAttributes()` calcula `ids` en cada llamada según la aceptación vigente.
- [X] T013 [US2] En `initAttribution()`, escuchar `CONSENT_EVENT` (pedir de nuevo los identificadores de GA4 y sincronizar) y `REVOKE_EVENT` (olvidar `gaId` y `gaSessId` y sincronizar, lo que quita los atributos). Importar los nombres de evento de `./consent`.
- [ ] T014 [US2] Comprobar quickstart §5, §6 y §8 con capturas (`us2-aceptado.png`, `us2-aceptacion-anterior.png`, `us2-revocado.png`, `us2-bloqueado.png`), incluido el filtro de §5 y §6 que debe dar `[]` (ningún valor "null" ni "undefined"). Anotar también si la sincronización del `submit` alcanzó sola, sin interacción previa (research R-02). Commit local. **Parcial (2026-10-08)**: aceptación previa, revocación y filtro de "null"/"undefined" comprobados contra la tienda real; faltan §8 con bloqueador y el envío real en el sandbox.

**Checkpoint**: el pedido se puede ligar a la sesión de GA4 y al navegador en Meta.

---

## Phase 5: User Story 3 · "Vio las boletas" separado de "Comprar" (P1)

**Goal**: `view_item_list`/`ViewContent` en el clic a `#boletas`; `begin_checkout`/`InitiateCheckout` solo en el envío del widget.

**Independent Test**: quickstart §7.

- [X] T015 [US3] En `src/measurement/tags.ts`, `trackViewItemList()` una vez por página: `gtag('event', 'view_item_list', { item_list_name: 'boletas' })` y `fbq('track', 'ViewContent', { content_name: 'boletas' })`. El listener de clic existente sobre `a[href$="#boletas"]` llama a esta función en lugar de `trackBeginCheckout()`.
- [X] T016 [US3] En `src/measurement/tags.ts`, `trackBeginCheckout()` sin parámetro `value` (research R-06; `ConsentNotice.astro` no la usa) y un listener nuevo de `submit` en `document`, fase de captura, que la llama solo si `e.target` es un formulario dentro de `.tickets-widget .pretix-widget-wrapper`. Sin `preventDefault`. Revisar que `src/components/ConsentNotice.astro` siga compilando con lo que importa de `tags.ts`.
- [X] T017 [P] [US3] En `specs/002-seo-medicion-visibilidad/contracts/measurement-events.md`, nota al principio que remita a `specs/003-embudo-sitio/contracts/widget-tracking.md` para eventos y atributos del widget; marcar como reemplazados la fila "Intención de compra", los "Disparadores de intención de compra" y la línea "El widget de Pretix no se toca" de "Degradación", sin borrar el texto (registro histórico).
- [X] T018 [P] [US3] En `specs/001-event-landing/contracts/pretix-embed.md`, debajo del párrafo que dice que 002 retiró los `data-tracking-*`, una nota: desde 003 el widget sí recibe esos atributos, con el contrato en `specs/003-embudo-sitio/contracts/widget-tracking.md`; `disable-iframe` se mantiene.
- [ ] T019 [US3] Comprobar quickstart §7, incluido el paso 1b de los cinco CTA, con capturas (`us3-view-item-list.png`, `us3-begin-checkout.png`, `us3-url-tienda.png`) y confirmar que el formulario del modal "avísame" no dispara `begin_checkout`. Comparar con el sitio publicado (SC-005): el widget aparece igual de rápido y "Comprar" abre la tienda sin espera; anotar el resultado. Commit local. **Parcial (2026-10-08)**: `view_item_list` único y `begin_checkout` único comprobados con `submit` sintético; falta "Comprar" real en el sandbox y la comparación de tiempos.

**Checkpoint**: el embudo de GA4 tiene los pasos 2 y 3 bien separados.

---

## Phase 6: User Story 4 · Política y términos (P1)

**Goal**: los textos publicados dicen lo que hace el embudo, antes de la casilla y `consent_since`.

**Independent Test**: quickstart §9.

- [X] T020 [US4] Pedir al agente `abogado-eventalist` que revise, contra `docs/revision-legal-2026-10-06-embudo.md`: (a) "y el teléfono" en el primer párrafo de la sección 12 de los términos; (b) la sección 3, párrafo final, de la política con WhatsApp para b) y h) sin "solo si el comprador suministra su número"; (c) la casilla A y el texto de ayuda del teléfono en inglés, si la tienda se ofrece en inglés (comprobarlo antes en la tienda de `testigos-memoria`: selector de idioma o `/en/` en la URL); (d) si la frase de la sección 10 "intención de compra (el paso a la sección de boletas)" debe cambiar ahora que la intención de compra es pulsar "Comprar" en la tienda, y con qué texto. Anotar su respuesta en `specs/003-embudo-sitio/research.md` (R-10). Lo que no apruebe, no se publica.
- [X] T021 [US4] Preguntar al titular el día D de publicación (research R-11). Sin D no se cierran T024 ni T025; el resto de la fase puede avanzar con el texto final. **Hecho: D = 2026-10-09.**
- [X] T022 [US4] En `src/pages/tratamiento-de-datos.astro`, aplicar todos los cambios de la política de la sección C del dictamen, en orden: párrafo inicial, sección 2, sección 3 (g, h nuevo, párrafo final con el ajuste aprobado en T020), sección 4, sección 5, sección 6, sección 10 (borrar la frase, insertar el párrafo con IP y tipo de navegador, añadir la frase de exclusión con `{DATA_CONTACT_EMAIL}`, y el ajuste de T020 d si se aprobó), sección 11. La "[fecha de publicación]" se escribe con la misma fecha formateada que muestra la vigencia (`DATA_POLICY_EFFECTIVE`), no a mano. Actualizar el comentario de cabecera del archivo si dice que el envío a Google y Meta se retiró. Commit propio.
- [X] T023 [US4] En `src/pages/terminos-y-condiciones.astro`, sección 12, reemplazar los dos primeros párrafos por los del dictamen, con "y el teléfono" (ajuste de T020 a). Actualizar el comentario de cabecera si menciona el retiro. Commit propio.
- [X] T024 [US4] En `src/config.ts`, `DATA_POLICY_EFFECTIVE` y `TERMS_EFFECTIVE` = D, y sus comentarios con una línea por el cambio de D (embudo de venta, dictamen del 2026-10-06); quitar "Sin cambios desde el 14 de septiembre". Commit propio. **Hecho: D = 2026-10-09.**
- [X] T025 [P] [US4] En `docs/pretix-tienda-textos.md`: "Confirmation text" con la casilla A del dictamen (y su versión en inglés aprobada en T020 c, si la tienda se ofrece en inglés), fechada en D y con la nota de versión (`tienda-<D>`) que el plugin guarda en el pedido; "Help text of the phone number field" con "Se usa para avisos sobre esta compra y para los mensajes por WhatsApp que se autorizan al final del pedido."; reemplazar la nota "Sin cambios: la ampliación de la casilla…" por el registro del cambio y su fecha. Commit propio.
- [X] T026 [US4] Comprobar quickstart §9 sobre `dist/` y guardar el resultado (frases buscadas y no encontradas) en `specs/003-embudo-sitio/capturas/us4-legales.txt`.

**Checkpoint**: textos listos para publicar el día D.

---

## Phase 7: User Story 5 · Probar contra el sandbox (P2)

**Goal e Independent Test**: quickstart §1. La implementación está en T002 y T003.

- [X] T027 [US5] Sin la variable, `npm run build` y `grep -r "testigos-sandbox" dist/` sin resultados; con la variable, el widget local muestra el sandbox. Anotar el resultado en `specs/003-embudo-sitio/capturas/us5-sandbox.txt`.

---

## Phase 8: Polish y entrega

- [X] T028 `npm run check` y `npm run build` sin errores ni avisos nuevos frente a T001. Medir el tamaño comprimido del bundle que contiene `attribution.ts` en `dist/_astro/` (gzip) y anotarlo: el plan pone un tope de 3 KB para el módulo.
- [X] T029 Revisar que ningún texto visible nuevo tenga " — " y que los comentarios de `src/measurement/` y `src/config.ts` no digan que el envío a Google y Meta se retiró (`grep -rn "retir" src/`).
- [X] T030 Actualizar la sección `testigos-web` de `docs/medicion-embudo/estado.md` con fecha: qué quedó hecho, commits, resultado de las comprobaciones y el resultado del filtro de "null"/"undefined". Preguntas para otros repos en "Preguntas abiertas".
- [ ] T031 Resumen para el titular con las capturas y la lista de commits. Esperar su visto bueno antes de cualquier push.

## Phase 9: Con el visto bueno del titular (fuera de la implementación local)

- [ ] T032 Ensayo conjunto: quickstart §10 (paso 3 de la guía de `pretix-wompi` en `docs/medicion-embudo/estado.md`), con el plugin desplegado y el sitio local apuntando al sandbox.
- [ ] T033 Publicación el día D en el orden de research R-11: push a `main` con el visto bueno de ese cambio; `curl` de `/tratamiento-de-datos/` y `/terminos-y-condiciones/` publicados para confirmar los textos; avisar al titular para que cambie la casilla y fije `consent_since`.
- [ ] T034 Quickstart §11: verificación en producción sin pagar, con la campaña `verificacion`, y cancelación del pedido. Capturas y resultado en `docs/medicion-embudo/estado.md`.

---

## Dependencies

- T001 → T002, T003 → todas las historias.
- US1 (T004 a T010) → US2 (T011 a T014): US2 extiende `desiredAttributes` y `syncWidgetAttributes`.
- US3 (T015 a T019) depende solo de la fase 2; toca `tags.ts`, igual que T008, así que va después de T008 para no pisar el mismo archivo.
- US4 (T020 a T026) es independiente del código; T020 antes de T022 y T023; T021 antes de T024 y T025.
- US5 (T027) después de la fase 2.
- Fase 8 después de todas las historias; fase 9 solo con visto bueno.

## Parallel Opportunities

- La historia 4 completa puede avanzar en paralelo con las historias 1 a 3 (otros archivos).
- T009, T017, T018 y T025 son documentos o comentarios en archivos que nadie más toca.
- Dentro de US1 a US3 casi todo es `attribution.ts` o `tags.ts`: secuencial.

Ejemplo:

```text
Agente A: T004 → T005 → T006 → T007 → T008 (attribution.ts y tags.ts)
Agente B: T020 → T022 → T023 (textos legales, esperando D para T024)
Agente C: T017, T018, T025 (documentos)
```

## Implementation Strategy

1. **MVP**: fases 1 a 3. Solo con la campaña en el pedido, el informe por campaña ya funciona.
2. Historias 2 y 3: identificadores y separación de eventos; completan el embudo de GA4 y los públicos de Meta.
3. Historia 4 en paralelo; no se publica nada sin ella.
4. Todo sale en un solo push el día D (research R-11), no por incrementos: los atributos sin los textos legales publicados dejarían a la política diciendo algo que el sitio no hace.
