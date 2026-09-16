# Tasks: Medición, marcado y visibilidad de testigosdelamemoria.com

**Input**: Design documents from `specs/002-seo-medicion-visibilidad/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ (measurement-events, pretix-attribution, jsonld, pages-seo), quickstart.md, docs/revision-legal-2026-09-15-medicion.md

**Tests**: no se pidieron tests automatizados. El gate mecánico es `npm run build` + `npm run check` (que ejecutan las aserciones de datos en el build); la validación funcional es `quickstart.md`. Las tareas de verificación manual llevan el prefijo "Verificar" y citan la sección del quickstart.

**Organization**: por historia de usuario (US1 a US6 de la spec). US1 se puede publicar sola (MVP). US2 y US3 comparten la fase fundacional (rutas, agenda con horas, ofertas) y deben estar publicadas antes del 2026-09-29; todo lo demás antes del 2026-10-15.

**Reglas transversales** (aplican a toda tarea): copy visible sin guiones de pausa " — " (usar punto seguido o "·"); fórmula visual de bloques (`brand/formula-visual.md`); ningún dato de sesión, sede o ponente inventado; cada cambio de texto legal en un commit propio; ningún push a `main` sin visto bueno del usuario para ese cambio; `npm run build && npm run check` en verde antes de cada commit.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizable (archivos distintos, sin dependencia de tareas incompletas)
- **[Story]**: historia de usuario (US1 a US6)
- **[EXT]** en la descripción: entregable fuera del repositorio (Eventalist: Pretix o backend) o acción manual del usuario; la tarea consiste en entregar la instrucción o confirmar el hecho, y bloquea lo que dependa de ella

## Path Conventions

Proyecto Astro en la raíz: `src/`, `public/`, `brand/`, `docs/`, `.github/workflows/`. Sin `tests/`.

---

## Phase 1: Setup

**Purpose**: línea base de rendimiento y preparación de las cuentas, antes de tocar código

- [ ] T001 Medir la línea base de la portada en `dev`: `npm run build && npm run preview`, cinco corridas de Lighthouse móvil (`npx lighthouse http://localhost:4321/ --preset=perf --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate --output=json --output-path=./lh-base-$i.json` en el scratchpad) y anotar la mediana de LCP y peso total en `specs/002-seo-medicion-visibilidad/perf.md` (quickstart §5)
- [ ] T002 [P] [EXT] Entregar al usuario la lista de setup manual de `specs/002-seo-medicion-visibilidad/quickstart.md` §1 (GA4 con Signals apagado y api_secret; dataset de Meta con token CAPI y verificación de dominio; acceso admin a pretix.eventalist.co y versión ≥ 2024.7; Bing Webmaster Tools) y registrar en `specs/002-seo-medicion-visibilidad/perf.md` una sección "Cuentas" con qué identificadores ya existen
- [ ] T003 [P] [EXT] Entregar a Eventalist los tres contratos de backend y Pretix (`contracts/pretix-attribution.md` §2 y §3, `contracts/measurement-events.md` sección "Endpoint de consentimiento") como un solo documento `docs/eventalist-integracion-medicion.md` que resuma qué construir, en qué orden y cómo probarlo (quickstart §4)

---

## Phase 2: Foundational

**Purpose**: fuente única de rutas, datos con horas y ofertas, módulos `seo/` y `measurement/` vacíos pero tipados, layout con slots. Bloquea US2, US3, US5 y US6; US1 solo depende de T004 y T009.

- [ ] T004 Añadir `measurement` a `src/config.ts` según `contracts/measurement-events.md` (`ga4Id: ''`, `metaPixelId: ''`, `consentVersion: '2026-09'`, `consentEndpoint` derivado de `EVENTALIST_BACKEND`, `metaDomainVerification: ''`) con comentario que explique que vacíos no cargan nada
- [ ] T005 [P] Reemplazar `ticketOffer` por `ticketOffers: TicketOffer[]` en `src/data/event.ts` (cinco ofertas con `id`, `name`, `price`, `currency`, `validFrom`, `validThrough`, `soldOut: false`, `covers`) según data-model §1, y añadir `geo` con `@id` estable a las dos `venues` (data-model §2; coordenadas del pin de Google Maps de cada sede, anotadas como "por confirmar con el organizador" en el comentario hasta T087)
- [ ] T006 [P] Añadir `slug`, `start` y `end` a cada `AgendaSlot` de `src/data/agenda.ts` (data-model §3) con valores derivados del `time` visible (zona de Bogotá) y `end: null` donde no hay hora de fin confirmada; exportar `assertAgenda()` que falle en build por `time` sin `start`, `start` sin `end` cuando `time` tiene rango, o `slug` repetido
- [ ] T007 [P] Crear `src/routes.ts` con la interfaz `Route` de data-model §5 y la lista de rutas indexables de `contracts/pages-seo.md` (portada, `/panelistas/`, 12 fichas generadas desde `speakers`, `/programacion/`, `/charlas-abiertas/`, `/como-llegar/`; `/donde-dormir/` comentada hasta US6), con `crumb`, `parent`, `ogImage`, `lastmod` y `priority`
- [ ] T008 Crear `src/seo/meta.ts` con `pageMeta(route)` que devuelva título, descripción, canonical, robots y OG, y aserciones de longitud (título ≤ 60, descripción ≤ 155) que fallen en build; `src/seo/offers.ts` con `availabilityOf(offer, today)` según la tabla de data-model §1; `src/seo/jsonld.ts` con los builders vacíos tipados (`organizationLd`, `placeLd`, `eventLd`, `subEventLd`, `offersLd`, `personLd`, `profilePageLd`, `breadcrumbLd`, `webPageLd`) y `assertJsonLd(graph)` (depende de T005, T006, T007)
- [ ] T009 [P] Crear `src/measurement/consent.ts` (lectura y escritura de `ConsentState` en `localStorage['tdm.consent']` con `try/catch`, `isAccepted(version)`, `accept()`, `revoke()`, eventos `tdm:consent` y `tdm:revoke`), `src/measurement/attribution.ts` (captura de `utm_*`, `fbclid`, `gclid`, construcción de `fbc`, lectura de `_fbp`/`_fbc`, `gtag('get')` con tope de 2 s, `Attribution` en `localStorage['tdm.attribution']`) y `src/measurement/tags.ts` (Consent Mode, carga de gtag y del píxel, `trackBeginCheckout(value?)` con `eventId` compartido) según `contracts/measurement-events.md` y `contracts/pretix-attribution.md` §1; todo con degradación silenciosa (FR-006)
- [ ] T010 Refactorizar `src/layouts/EventLayout.astro` para recibir `route?: Route` (o `title`/`description` como hoy) y un slot `head-jsonld`; mover el JSON-LD actual a `src/seo/jsonld.ts` sin cambiar la salida; emitir `noindex, follow` cuando `noindex` sea true; dejar un punto único donde irán las etiquetas de medición (depende de T008)
- [ ] T011 [P] Crear `src/components/Breadcrumbs.astro` (migas visibles desde `routes.ts` + `BreadcrumbList` vía `breadcrumbLd`) y `src/layouts/InnerLayout.astro` (cabecera de página interior en bloque de color con antetítulo, h1 y migas; header `solid`; bloque fijo de hechos del evento al pie: nombre, "Villa de Leyva, Boyacá, Colombia", "5 al 8 de noviembre de 2026", sedes con dirección, estado de boletería y precios desde `ticketOffers` y `salesStages`) según `contracts/pages-seo.md` (depende de T007, T010)
- [ ] T012 Reescribir `src/pages/sitemap.xml.ts` para leer `routes` y emitir `<lastmod>` = `route.lastmod`; sin legales ni 404 (depende de T007)
- [ ] T013 Añadir a `src/ui.ts` las claves nuevas de texto: aviso de consentimiento (texto exacto del dictamen §3a), gestor de preferencias, migas ("Inicio", "Panelistas", "Programación", "Charlas abiertas", "Cómo llegar", "Dónde dormir"), etiquetas de fichas ("En el encuentro", "Obras y enlaces"), programación ("Actualizado el", "Entrada libre", "Con boleta"), bloque de hechos y enlaces del pie ("Cookies y preferencias")
- [ ] T014 Ejecutar `npm run build && npm run check` y confirmar que la salida HTML de la portada y las legales es idéntica a la de `dev` salvo por el `noindex, follow` (diff de `dist/index.html` antes y después); commit "Base de la feature 002"

**Checkpoint**: rutas, datos y módulos listos; el sitio publicado no cambia de aspecto.

---

## Phase 3: User Story 1 · Medir visitas y compras y construir audiencia (Priority: P1) 🎯 MVP

**Goal**: GA4 y píxel de Meta con aviso de consentimiento conforme al dictamen, intención de compra con `eventId` compartido, origen conservado hasta el widget, textos legales publicados, y el lado servidor (Eventalist) enviando la compra a Meta y GA4 una sola vez.

**Independent Test**: quickstart §2, §3, §4 y §9. En 24 h de producción: visitas en tiempo real en ambas consolas, un `begin_checkout`/`InitiateCheckout` con el mismo identificador, y una compra de prueba atribuida en ambas plataformas contada una vez.

### Textos legales (commits propios, antes de activar etiquetas)

- [ ] T015 [US1] Añadir a `src/pages/tratamiento-de-datos.astro` la sección 10 "Cookies, medición de audiencia y publicidad" con `id="cookies"` (texto del dictamen §3b, variante A si `measurement.consentEndpoint` no está vacío, B si lo está), renumerar Vigencia a 11 y aplicar los siete ajustes consecuenciales de la tabla del dictamen (párrafo inicial, sección 2, sección 3 literal g y frase de mensajes, sección 4, sección 5, cabecera del archivo); subir `DATA_POLICY_EFFECTIVE` en `src/config.ts` a la fecha prevista de publicación; commit propio
- [ ] T016 [US1] Reemplazar el primer párrafo de la sección 12 de `src/pages/terminos-y-condiciones.astro` y añadir la frase final según el dictamen §4; subir `TERMS_EFFECTIVE`; actualizar el comentario de cabecera; commit propio (depende de T015 para la referencia a la sección 10)
- [ ] T017 [P] [US1] Reescribir la casilla obligatoria de Pretix en `docs/pretix-tienda-textos.md` (línea del "Confirmation text") con el texto del dictamen §4 y anotar que la fecha de aplicación en el panel es `ATTRIBUTION_CONSENT_SINCE`; commit propio
- [ ] T018 [US1] Verificar que ninguna frase de la política ni de los términos afirme algo que el sitio no hará (quickstart §9.1 y §9.2): grep de "no se comparten, ceden ni venden" y "no comparte, cede, transfiere" en `src/pages/*.astro` debe devolver solo las versiones con salvedad

### Medición en el navegador

- [ ] T019 [US1] Crear `src/components/ConsentNotice.astro` según `contracts/measurement-events.md` (barra fija inferior persistente, tinta sobre crema, texto de `ui.ts`, "Más información" a `/tratamiento-de-datos/#cookies`, "Aceptar", cerrar ×; solo Aceptar acepta; `sessionStorage` para el cierre; `<template>` materializado por script; sin superponerse al CTA del hero en móvil) usando `src/measurement/consent.ts`
- [ ] T020 [US1] Añadir a `src/components/Footer.astro` el enlace "Cookies y preferencias" que abre el `<dialog>` del gestor de preferencias (estado, texto del aviso, Aceptar o Retirar la aceptación, enlace a la sección 10; sin JS lleva a la sección) según `contracts/measurement-events.md`, y los enlaces a Panelistas, Programación y Charlas abiertas (estos últimos condicionados a que la ruta exista en `routes.ts`)
- [ ] T021 [US1] Integrar en `src/layouts/EventLayout.astro` el orden de `<head>` del contrato: bloque inline de Consent Mode (`default` denied y `update` granted si hay aceptación vigente), `preconnect` a googletagmanager.com, `gtag.js` async con `config`, meta de verificación de Meta si `metaDomainVerification` no está vacío; en el `<script>` del layout, inicializar `measurement/tags.ts` (píxel solo tras aceptación, en idle) y `measurement/attribution.ts`; renderizar `<ConsentNotice />` antes del `<Footer />`; nada de esto se emite con identificadores vacíos (depende de T009, T010, T019)
- [ ] T022 [US1] Añadir el registro de aceptaciones en `src/measurement/consent.ts`: `POST` a `measurement.consentEndpoint` con `{ id, version, scope, accepted_at, site }` al aceptar y `{ id, revoked_at }` al revocar, reintento en la siguiente carga hasta `recorded`, sin IP ni identidad; no hacer nada si el endpoint está vacío
- [ ] T023 [US1] Instrumentar la intención de compra: en `src/measurement/tags.ts` exponer `trackBeginCheckout`; en `src/components/CtaButton.astro` (o por delegación en `EventLayout`) disparar en el primer clic a `#boletas`; en `src/components/TicketSection.astro` capturar el `submit` del formulario del widget dentro de `.tickets-widget` y calcular `value` desde `ticketOffers` por nombre de producto normalizado (omitir `value` si no se reconoce); un solo disparo por página; `eventId` idéntico en GA4 y Meta
- [ ] T024 [US1] Inyectar los atributos `data-tracking-*` en `<pretix-widget>` en `src/components/TicketSection.astro` y `src/layouts/EventLayout.astro` según `contracts/pretix-attribution.md` §1: `window.PretixWidget.build_widgets = false` antes del script del widget, `PretixWidget.buildWidgets()` cuando `attribution.ts` tenga los datos o venza el tope de 2 s; sin atributo si el valor es vacío; comprobar que el `MutationObserver` existente del componente no interfiere
- [ ] T025 [US1] Verificar en local (quickstart §2 y §3, con identificadores de prueba en `config.ts` sin commitear): sin cookies antes de Aceptar y `gcs=G100`; cerrar no acepta; Aceptar crea `_ga`, carga `fbevents.js` tras `load`, envía `consent_granted` y el `POST` de consentimiento; Retirar borra cookies y vuelve a `denied`; `begin_checkout` e `InitiateCheckout` con el mismo `eventId`; atributos `data-tracking-*` presentes tras aterrizar con `?utm_source=prueba&fbclid=TEST123` y persistentes al navegar; con bloqueador y sin JS el sitio funciona sin errores; anotar resultados en `specs/002-seo-medicion-visibilidad/perf.md`
- [ ] T026 [US1] Medir rendimiento con etiquetas activas (quickstart §5, estados b y c: cinco corridas cada uno) y registrar medianas en `perf.md`; si LCP ≥ 2,5 s o peso > 560 KB, ajustar el orden de carga antes de seguir (depende de T021, y de T056 si ya está hecha)

### Lado servidor (Eventalist) y setup del usuario

- [ ] T027 [P] [US1] [EXT] Confirmar con Eventalist la instalación del mini plugin `pretix_tdm_attribution` en pretix.eventalist.co (`contracts/pretix-attribution.md` §2), el webhook `pretix.event.order.paid` hacia el backend con Basic Auth, la opción "Ask search engines not to index the ticket shop" activada, y la casilla nueva aplicada en el panel; registrar `ATTRIBUTION_CONSENT_SINCE` en `docs/eventalist-integracion-medicion.md`
- [ ] T028 [P] [US1] [EXT] Confirmar con Eventalist el receptor del webhook y el endpoint de consentimiento en el backend (`contracts/pretix-attribution.md` §3, `contracts/measurement-events.md`): idempotencia por código, descarte de pedidos anteriores a `ATTRIBUTION_CONSENT_SINCE`, CAPI `Purchase` con `event_id` = código, MP `purchase` con `client_id` y `session_id`, CORS del endpoint de consentimiento para https://testigosdelamemoria.com
- [ ] T029 [P] [US1] [EXT] Confirmar con el usuario los identificadores reales y volcarlos en `src/config.ts` (`ga4Id`, `metaPixelId`, `metaDomainVerification` si aplica, `consentEndpoint` vacío si el backend no está listo → volver a T015 para la variante B); confirmar Google Signals y personalización de anuncios apagados en GA4 y `purchase` y `begin_checkout` marcados como eventos clave
- [ ] T030 [US1] Verificar la atribución de compra end-to-end (quickstart §4): compra de prueba con parámetros, `api_meta.tracking` en el pedido, `Purchase` en Meta Test Events con `event_id` = código y EMQ ≥ 6, `purchase` en GA4 DebugView atribuido a `prueba / qa`, reenvío del webhook sin duplicado, compra por enlace directo solo en Meta; anotar en `perf.md` (depende de T027, T028, T029)
- [ ] T031 [US1] Commit de la medición ("Medición: GA4 con Consent Mode, píxel de Meta tras Aceptar, origen al widget") y solicitar al usuario el visto bueno para publicar a `main` este cambio junto con los commits legales; tras el deploy, verificar quickstart §2.9 y §9.6 en producción

**Checkpoint**: US1 publicable sola. La audiencia de retargeting y la atribución empiezan a acumularse.

---

## Phase 4: User Story 2 · Módulo de eventos de Google (Priority: P1)

**Goal**: marcado del evento completo: sedes con coordenadas, ofertas por etapa con disponibilidad derivada, subeventos por sesión confirmada, ponentes enlazados a su ficha, sin errores en el Rich Results Test.

**Independent Test**: quickstart §6. Rich Results Test de la portada sin errores con evento, sede georreferenciada, ofertas (1 InStock + 4 PreOrder antes del 5 de octubre) y subeventos; Search Console sin errores a los 7 días.

- [ ] T032 [P] [US2] Implementar en `src/seo/jsonld.ts` `placeLd(venue)` (Place con `@id`, `address`, `geo`, `hasMap`) y `offersLd(today)` (arreglo de Offer desde `ticketOffers` con `availabilityOf`, `validFrom`/`validThrough` con hora y desfase de Bogotá, `url` = `PRETIX_EVENT_URL`, `price` como string) según `contracts/jsonld.md`
- [ ] T033 [P] [US2] Implementar en `src/seo/jsonld.ts` `subEventLd(slot)` (solo con `start` y `venueId`; `endDate` si `end`; `location` por `@id`; `superEvent`; `performer` con `@id` de ficha para `speakerSlugs` y `Person` con solo `name` para `guests`; `isAccessibleForFree` en charlas; `eventStatus`) y `performerLd(speaker)` (Person con `name`, `description`, `url` de ficha, `sameAs`)
- [ ] T034 [US2] Reescribir `eventLd()` en `src/seo/jsonld.ts` según `contracts/jsonld.md`: `location` = `{ "@id": sede-duruelo }`, `image` arreglo, `offers` = `offersLd`, `performer` = `performerLd` ×12, `subEvent` = `subEventLd` por slot elegible, sin `eventAttendanceMode`; el grafo de la portada incluye Organization, WebSite, los dos Place, Event (depende de T032, T033)
- [ ] T035 [US2] Implementar `assertJsonLd(graph)` en `src/seo/jsonld.ts`: todo `@id` referenciado existe en el grafo; ningún subevento sin `startDate` y `location`; ningún Offer con `availability` fuera de InStock, SoldOut, PreOrder; llamarla desde `EventLayout` en cada build (depende de T034)
- [ ] T036 [US2] Documentar en `src/data/event.ts` (comentario junto a `ticketOffers`) el procedimiento operativo: publicación el 2026-10-05 para el cambio de etapa y `soldOut: true` por boleta al agotarse; añadir la nota al apartado "Hitos" de `specs/002-seo-medicion-visibilidad/quickstart.md` §6
- [ ] T037 [US2] Verificar con `npm run build` que `dist/index.html` contiene un solo `application/ld+json` con Event, dos Place, cinco Offer y todos los subeventos con datos confirmados (contar con `jq` sobre el JSON extraído); commit "Marcado del evento: sedes con geo, ofertas por etapa, subeventos"
- [ ] T038 [US2] Verificar tras el deploy (quickstart §6.2 a §6.5): Rich Results Test y Schema Markup Validator sobre la portada sin errores; si el test avisa por `location`, mantener un solo Place; Search Console → Mejoras → Eventos a los 7 días; anotar en `perf.md`

**Checkpoint**: el evento principal es elegible para el módulo de eventos.

---

## Phase 5: User Story 3 · Fichas de panelistas, programación y charlas abiertas (Priority: P1)

**Goal**: 12 fichas con URL propia, imagen para compartir y marcado de persona; índice; programación completa con anclas; charlas abiertas con evento propio; migas en todo lo interior; sitemap nuevo; portada enlazando todo. Publicado antes del 2026-09-29.

**Independent Test**: quickstart §7. `dist/` con las 16 páginas nuevas; sitemap con ≥ 15 URL sin legales; cada ficha con título ≤ 60, migas, sesiones enlazadas y OG propio; Rich Results Test de `/charlas-abiertas/` con Event y de una ficha con Breadcrumb.

### Imágenes para compartir

- [ ] T039 [P] [US3] Crear `brand/og/og-panelista.html` (plantilla 1200×630: foto del panelista en b/n con grano, nombre, credencial, "Testigos de la Memoria · Villa de Leyva, 5 al 8 de noviembre de 2026", bloques de color de la fórmula visual) y `brand/og/og-pagina.html` (título de página); extender `brand/og/make.sh` con los modos `panelista <slug>` y `pagina <ruta>` que escriban en `public/og/panelistas/<slug>-v1.png` y `public/og/paginas/<ruta>-v1.png`; extender `brand/og/inline-logo.mjs` si la plantilla lo necesita
- [ ] T040 [US3] Generar las 12 imágenes de panelistas y las de `programacion` y `charlas-abiertas` con `brand/og/make.sh`; comprobar peso (< 300 KB cada una) y dimensiones; commit "OG por panelista y por página" (depende de T039)

### Páginas

- [ ] T041 [P] [US3] Implementar `personLd`, `profilePageLd` y `webPageLd` en `src/seo/jsonld.ts` según `contracts/jsonld.md` (Person con `@id` `#persona`, `performerIn` al evento y a sus sesiones; ProfilePage con `dateModified`; WebPage con `isPartOf` y `about`)
- [ ] T042 [P] [US3] Crear `src/pages/panelistas/[slug].astro` con `getStaticPaths` desde `speakers`: `InnerLayout` con migas, h1 nombre, credencial, foto (`astro:assets`, `alt` = nombre), biografía completa, obras y enlaces si existen (`works`, `links`), sección "En el encuentro" con las sesiones del panelista (día, hora, sede, enlace a `/programacion/#slug`), CTA a `/#boletas`; `@graph` con Breadcrumb y ProfilePage; título y descripción desde `routes.ts` (depende de T011, T041)
- [ ] T043 [P] [US3] Crear `src/pages/panelistas/index.astro`: `InnerLayout`, los 12 con foto, nombre, credencial y enlace a la ficha (reutilizar `SpeakerCard` en modo enlace o una tarjeta compacta nueva `SpeakerTile.astro`), CTA; `@graph` con Breadcrumb y WebPage (depende de T011, T041)
- [ ] T044 [P] [US3] Crear `src/pages/programacion.astro`: `InnerLayout`, "Actualizado el <lastmod>", una sección por día con `id` (`jueves-5`, `viernes-6`, `sabado-7`, `domingo-8`) y una fila por sesión con `id` = `slot.slug`, hora, título, sede con enlace al mapa, tipo (Entrada libre o Con boleta), panelistas enlazados a su ficha, nota, CtaButton en las de boleta; precios y etapas en texto plano desde `ticketOffers` y `salesStages`; `@graph` con Breadcrumb y WebPage (depende de T011, T041)
- [ ] T045 [P] [US3] Crear `src/pages/charlas-abiertas.astro`: `InnerLayout`, qué son, cuándo, dónde (Casa Museo con dirección, coordenadas y mapa), condiciones de ingreso desde `faqs`, lista de charlas con hora y presentador enlazado, enlace a los conversatorios con boleta y CTA; `@graph` con Breadcrumb y el Event propio de `contracts/jsonld.md` (entrada libre, `superEvent`, `offers` precio 0, `subEvent` de las charlas, `endDate` solo con dato confirmado) (depende de T011, T033, T041)
- [ ] T046 [US3] Enlazar desde la portada: en `src/components/SpeakerCard.astro` nombre y foto enlazan a `/panelistas/<slug>/` (conservando "Leer más" y el carrusel); en `src/components/Schedule.astro` cada fila gana el `id` del slot, los nombres enlazan a la ficha y la sección cierra con "Ver la programación completa" a `/programacion/` y las charlas con enlace a `/charlas-abiertas/`; en `src/components/FAQ.astro` las respuestas de cómo llegar y hospedaje enlazan a las páginas nuevas solo cuando existan en `routes.ts`
- [ ] T047 [US3] Añadir a `astro.config.mjs` la sección `redirects` vacía con comentario del procedimiento de retiro de un panelista (FR-028: quitar del array, redirigir su ruta a `/`) y documentarlo en `src/data/speakers.ts`
- [ ] T048 [US3] Añadir la aserción de rutas en `src/routes.ts` (todo `.astro` público bajo `src/pages/` salvo legales y 404 debe estar en `routes`, vía `import.meta.glob`) y ejecutarla en `sitemap.xml.ts`
- [ ] T049 [US3] Verificar con `npm run build` (quickstart §7.1 a §7.4): las 16 páginas en `dist/`, sitemap con ≥ 15 URL sin legales, legales con `noindex, follow`, títulos y descripciones dentro de límite (aserción), `grep -c 'id="'` ≥ 17 en la programación, migas en todas las interiores; revisión visual en `npm run preview` de una ficha, el índice, la programación y las charlas en móvil y escritorio contra la fórmula visual; commit "Fichas de panelistas, programación y charlas abiertas"
- [ ] T050 [US3] Solicitar al usuario el visto bueno para publicar a `main` (fecha objetivo ≤ 2026-09-29); tras el deploy: Search Console → reenviar sitemap y solicitar indexación de portada, programación, charlas y las 12 fichas (o las prioritarias); Rich Results Test de `/charlas-abiertas/` y de una ficha; vista previa de una ficha en el depurador de Facebook, Post Inspector de LinkedIn y WhatsApp (quickstart §7.2 y §7.5); anotar en `perf.md`

**Checkpoint**: el sitio pasa de 3 a ~19 URL indexables; cada ponente tiene una URL que compartir.

---

## Phase 6: User Story 4 · Bing, ChatGPT y otros asistentes (Priority: P2)

**Goal**: sitio en el índice de Bing, bots de respuesta permitidos explícitamente, hechos del evento en texto plano en toda página, IndexNow tras cada deploy.

**Independent Test**: quickstart §8. Bing Webmaster Tools con propiedad verificada, sitemap procesado y portada indexada; `robots.txt` con los ocho agentes; cada página interior contiene las fechas, la ciudad y "Boyacá" en texto plano; el paso IndexNow devuelve 200 o 202.

- [ ] T051 [P] [US4] Reescribir `public/robots.txt` con el bloque de `contracts/pages-seo.md` (grupo `*` Allow, grupo explícito para OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User, bingbot, Googlebot; sin bloquear entrenamiento; `Sitemap`)
- [ ] T052 [P] [US4] Añadir al job `deploy` de `.github/workflows/deploy.yml` el paso final "IndexNow" del contrato (lee las URL del sitemap publicado con `curl` y `jq`, `POST` a `https://api.indexnow.org/IndexNow` con la clave `1b880322af30410c8832c1e6748dc455`, imprime el código HTTP; `continue-on-error: true` para no romper el deploy)
- [ ] T053 [P] [US4] Confirmar en `src/layouts/InnerLayout.astro` y en `src/components/Hero.astro` o `Opportunity.astro` de la portada que el texto plano incluye nombre del evento, "Villa de Leyva, Boyacá, Colombia", "5 al 8 de noviembre de 2026", las dos sedes con dirección y el estado de la boletería con precios en COP desde `ticketOffers` (FR-034); ajustar el bloque de hechos si falta algo
- [ ] T054 [P] [US4] [EXT] Confirmar con el usuario la importación en Bing Webmaster Tools desde Search Console, el sitemap enviado, la solicitud de indexación de la portada y el informe AI Performance activado (quickstart §1.6 y §8.1); anotar fecha en `perf.md`
- [ ] T055 [US4] Verificar (quickstart §8.2 y §8.3): `curl` de `robots.txt` publicado con los ocho agentes; `grep` de los hechos en texto plano en una ficha y en la programación; el log del workflow muestra el código de IndexNow; commit "Bing, IndexNow y rastreadores de asistentes"

**Checkpoint**: Bing y los asistentes pueden encontrar y citar el sitio.

---

## Phase 7: User Story 5 · Ajustes on-page y técnicos (Priority: P2)

**Goal**: título y descripción dentro de límite con texto aprobado, imagen principal precargada con variante móvil, legales fuera del índice y del sitemap, tienda de Pretix sin indexar, vista previa validada en Facebook y LinkedIn.

**Independent Test**: quickstart §5 y §7.1. HTML publicado con título ≤ 60 y descripción ≤ 155; `<link rel="preload" as="image">` con el mismo `srcset` que la `<img>`; LCP móvil < 2,5 s; legales con `noindex, follow`; Pretix con noindex.

- [ ] T056 [P] [US5] Convertir la imagen principal de `src/components/Hero.astro` a `<Image priority widths={[480, 768, 1080, 1280]} sizes="(max-width: 63.9rem) 100vw, 42vw">` y fijar `widths` y `sizes` en una constante `HERO_IMAGE` exportada desde `src/data/event.ts`; en `src/layouts/EventLayout.astro` (solo con `hero`) emitir `<link rel="preload" as="image" href imagesrcset imagesizes fetchpriority="high">` construido con `getImage()` desde la misma constante (`contracts/pages-seo.md`)
- [ ] T057 [P] [US5] Aplicar en `src/pages/index.astro` el título aprobado por el usuario (opción de 60 o de 53 caracteres de `research.md`) y la descripción de 144 caracteres; mover ambos a la entrada `/` de `src/routes.ts` para que la portada también pase por `pageMeta`
- [ ] T058 [P] [US5] Confirmar que `src/layouts/LegalLayout.astro` pasa `noindex` a `EventLayout` (emite `noindex, follow`) y que `sitemap.xml.ts` ya no lista las legales (hecho en T012); comprobar que la 404 conserva `noindex`
- [ ] T059 [P] [US5] [EXT] Confirmar con el usuario o Eventalist la opción "Ask search engines not to index the ticket shop" en Pretix (ya pedida en T027) con `curl -sI https://pretix.eventalist.co/eventalist/testigos-memoria/ | grep -i x-robots-tag` o `grep 'name="robots"'` en el HTML; anotar en `perf.md`
- [ ] T060 [P] [US5] [EXT] Confirmar con el usuario o Carolina la vista previa de la portada en el depurador de Facebook y el Post Inspector de LinkedIn (WhatsApp ya validado); si la caché muestra la imagen antigua, forzar "Scrape again"; anotar en `perf.md`
- [ ] T061 [US5] Verificar (quickstart §5): en Network, el `href` del preload coincide con el `currentSrc` de la `<img>` en móvil y escritorio; cinco corridas de Lighthouse móvil del estado final; LCP < 2,5 s y peso ≤ 560 KB; registrar en `perf.md` y, si falla, ajustar `widths` o el orden de `<head>` antes de commitear; commit "Portada: título y descripción, precarga de la imagen principal, legales noindex"

**Checkpoint**: on-page cerrado; el módulo de rendimiento no empeora con la medición.

---

## Phase 8: User Story 6 · Páginas prácticas (Priority: P3)

**Goal**: cómo llegar publicada antes del 2026-10-15; dónde dormir solo si Carolina entrega la lista antes de esa fecha.

**Independent Test**: quickstart §7. Páginas en `dist/`, en `routes.ts` y en el sitemap, con migas y hechos en texto plano; contenido verificable con fuentes públicas.

- [ ] T062 [P] [US6] Investigar y documentar en `docs/como-llegar.md` las rutas desde Bogotá (Autopista Norte, Tunja, tiempos aproximados; buses desde la Terminal Salitre con empresas y frecuencia general sin horarios exactos) y desde Tunja, parqueaderos en Villa de Leyva y la distancia a pie entre las dos sedes, con URL de cada fuente pública
- [ ] T063 [US6] Crear `src/pages/como-llegar.astro` con `InnerLayout`, las rutas de `docs/como-llegar.md`, las dos sedes con dirección, coordenadas (`venues[].geo`) y enlace a mapa, y `@graph` con Breadcrumb y WebPage; activar la ruta en `src/routes.ts`; enlazar desde la FAQ "¿Cómo llego a Villa de Leyva?" (T046) y desde el bloque de hechos; commit "Cómo llegar" (depende de T062)
- [ ] T064 [P] [US6] [EXT] Pedir a Carolina la lista de alojamientos (≥ 6, con nombre, URL, distancia aproximada a las sedes y confirmación de enlace recíproco donde exista) con fecha límite 2026-10-10 y guardarla en `docs/donde-dormir.md` cuando llegue
- [ ] T065 [US6] Si la lista llegó a tiempo: crear `src/pages/donde-dormir.astro` (`InnerLayout`, alojamientos con enlace y distancia, recomendación de reservar con anticipación, `@graph` con Breadcrumb y WebPage), activar la ruta en `src/routes.ts`, generar OG de página si se quiere una propia, enlazar desde la FAQ "¿Dónde me hospedo?"; si no llegó, dejar la ruta comentada y anotar en `perf.md` que se pospone (depende de T064)
- [ ] T066 [US6] Verificar `npm run build` (aserciones de rutas y metadatos), revisión visual en móvil, y solicitar al usuario el visto bueno para publicar antes del 2026-10-15; tras el deploy, reenviar sitemap y pedir indexación de las páginas nuevas

**Checkpoint**: todo el contenido de la feature está publicado dentro del plazo.

---

## Phase 9: Polish, operación y cierre

**Purpose**: hitos de operación hasta el evento y limpieza

- [ ] T067 [P] Actualizar `specs/001-event-landing/contracts/pretix-embed.md` con una nota que remita a `specs/002-seo-medicion-visibilidad/contracts/pretix-attribution.md` para los atributos `data-tracking-*` (el contrato de embed sigue vigente en todo lo demás)
- [ ] T068 [P] Actualizar la memoria del proyecto (`/Users/juandev/.claude/projects/-Users-juandev-Documents-eventalist-testigos-testigos-web/memory/testigos-web-site.md`): cuentas de medición, rutas nuevas, hitos del 5 de octubre y de agotados, Bing verificado
- [ ] T069 Hito 2026-10-05: publicar ese día (con visto bueno) para que el build cambie las franjas a InStock y retire el pase; verificar en el Rich Results Test y en la tienda (quickstart §6.6); anotar en `perf.md`
- [ ] T070 Hito "agotado": cuando Pretix reporte una boleta agotada, `soldOut: true` en `src/data/event.ts`, publicar con visto bueno y verificar `SoldOut` (quickstart §6.6)
- [ ] T071 Seguimiento semanal hasta el 4 de noviembre (registrar en `perf.md`): pedidos pagados en Pretix vs. `Purchase` en Meta y `purchase` en GA4 (desviación ≤ 10 %, SC-003); Search Console → Páginas indexadas (≥ 80 % el 20 de octubre, SC-005); Search Console → Eventos sin errores; Bing → AI Performance; el 1 de noviembre búsquedas por nombre de 8 de 12 panelistas y búsqueda de marca (SC-006, SC-009)
- [ ] T072 Ejecutar la lista completa de `specs/002-seo-medicion-visibilidad/quickstart.md` una vez publicado todo y marcar en `specs/002-seo-medicion-visibilidad/checklists/requirements.md` una nota de cierre con fecha y resultados

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias; T002 y T003 son entregas a terceros que empiezan el día 1 porque el lado servidor tarda.
- **Foundational (Phase 2)**: T004 a T014. Bloquea US2, US3, US5 y US6. US1 solo necesita T004, T009, T010 y T013.
- **US1 (Phase 3)**: textos legales (T015 a T018) → medición (T019 a T026) → externos (T027 a T029) → verificación end-to-end (T030) → publicación (T031). Publicable sola.
- **US2 (Phase 4)**: depende de T005, T006, T008. Independiente de US1 y US3, aunque `performer.url` apunta a fichas que aún pueden no existir (URL estable, se resuelve en US3).
- **US3 (Phase 5)**: depende de T007, T011, T012, T033 (subeventos para las charlas). Se publica junto con US2 antes del 2026-09-29.
- **US4 (Phase 6)**: depende de T011 (bloque de hechos) y T012 (sitemap). El resto es independiente.
- **US5 (Phase 7)**: T056 y T057 pueden ir con US1 (mismo despliegue de la semana 1); T058 depende de T010 y T012.
- **US6 (Phase 8)**: depende de T011 y T046; T065 condicionada a T064.
- **Polish (Phase 9)**: T069 a T072 son hitos con fecha; T067 y T068 en cualquier momento tras US1 y US3.

### Parallel Opportunities

- Phase 2: T005, T006, T007, T009 en paralelo (archivos distintos); T011 y T012 tras T007 y T010.
- US1: T015, T016, T017 en paralelo con T019, T020 (archivos distintos); T027, T028, T029 son externos y corren desde el día 1 en paralelo con todo.
- US2 y US3: T032, T033 en paralelo; T039 en paralelo con T041 a T045; T042 a T045 en paralelo entre sí.
- US4: T051, T052, T053, T054 en paralelo.
- US5: T056 a T060 en paralelo.

## Parallel Example: Phase 2

```bash
Task: "Reemplazar ticketOffer por ticketOffers y añadir geo en src/data/event.ts"
Task: "Añadir slug, start y end a AgendaSlot en src/data/agenda.ts"
Task: "Crear src/routes.ts con las rutas indexables"
Task: "Crear src/measurement/consent.ts, attribution.ts y tags.ts"
```

## Parallel Example: User Story 3

```bash
Task: "Crear src/pages/panelistas/[slug].astro"
Task: "Crear src/pages/panelistas/index.astro"
Task: "Crear src/pages/programacion.astro"
Task: "Crear src/pages/charlas-abiertas.astro"
Task: "Plantillas OG en brand/og/ y modos nuevos de make.sh"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 (línea base y entregas a Eventalist el día 1).
2. Phase 2 mínima para US1: T004, T009, T010, T013.
3. Phase 3 completa: textos legales, aviso, GA4 con Consent Mode, píxel tras Aceptar, intención de compra, origen al widget; T056 y T057 de US5 caben en el mismo despliegue.
4. Publicar con visto bueno en la semana 1 (2026-09-21 como máximo). La atribución en servidor (T027 a T030) puede llegar unos días después sin bloquear el deploy: las audiencias y la intención de compra ya cuentan.

### Incremental Delivery

1. Semana 1: US1 (+ T056, T057) → deploy 1.
2. Semana 2 (≤ 2026-09-29): resto de Phase 2 + US2 + US3 + US4 → deploy 2. Reenviar sitemap, pedir indexación, IndexNow automático.
3. Semana 3 (≤ 2026-10-15): US6 → deploy 3.
4. 2026-10-05: deploy del cambio de etapa (T069). Semana 7: agotados (T070).
5. Cada deploy exige el visto bueno del usuario para ese cambio.

### Parallel Team Strategy

- Desarrollador del sitio: Phases 2 a 8 en el orden anterior.
- Eventalist (backend y Pretix): T027, T028 desde el día 1 con `docs/eventalist-integracion-medicion.md`.
- Usuario: T002, T029, T054, T060 (cuentas, Bing, vistas previas) y los vistos bueno de publicación.
- Carolina: T064 (hoteles), T060 (vistas previas) y las tareas off-site del Excel (T25 a T30), fuera de este repositorio.

---

## Notes

- Ninguna tarea inventa datos: coordenadas, horas de fin y hoteles se confirman o se omiten.
- Las tareas [EXT] no se marcan hechas hasta confirmar el hecho (captura, respuesta o comprobación por `curl`).
- `perf.md` es el cuaderno de la feature: medianas de Lighthouse, fechas de verificación y resultados de cada quickstart.
- Commit después de cada tarea o grupo lógico; los textos legales siempre en commit propio.
