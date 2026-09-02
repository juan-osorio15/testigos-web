# Tasks: Landing page del evento Testigos de la Memoria

**Input**: Design documents from `specs/001-event-landing/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No solicitados — la validación es `astro check` + `astro build` + checklist de `quickstart.md` (decisión R11). Cada fase cierra con una tarea de validación manual reproducible.

**Organization**: Fases por user story en orden de prioridad del spec: US1 (P1), US4 (P1), US2 (P2), US5 (P2), US3 (P3). Todo el trabajo ocurre en la rama `dev`; jamás en `main` (FR-019).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizable (archivos distintos, sin dependencias pendientes)
- **[Story]**: US1/US2/US3/US4/US5 según spec.md

## Path Conventions

Proyecto Astro único en la raíz del repo (ver plan.md · Project Structure).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: proyecto Astro funcional en `dev`, sistema visual base, assets de marca listos.

- [X] T001 Inicializar proyecto Astro 5 en la raíz del repo: `package.json` (dependencia única `astro`, scripts `dev`/`build`/`preview`/`check`), `astro.config.mjs` (`site: 'https://testigosdelamemoria.com'`, i18n `defaultLocale: 'es'`, `locales: ['es','en']`, `prefixDefaultLocale: false`), `tsconfig.json` (strict, preset `astro/tsconfigs/strict`), `.gitignore` (node_modules, dist). Verificar `npm run dev` arranca.
- [X] T002 Reorganizar archivos del placeholder en `dev` (siguen intactos en `main`): mover `CNAME`, `1b880322af30410c8832c1e6748dc455.txt`, `robots.txt` a `public/`; mover `assets/og-image.png` a `public/og/og-image.png`; mover `assets/logo.svg` a `src/assets/logo/logo-full-terracota.svg`; borrar en `dev` `index.html`, `404.html`, `sitemap.xml` y las fotos del placeholder (`assets/franja.jpg`, `assets/pexels-*.jpg`) — el contrato [seo-i18n.md](contracts/seo-i18n.md) documenta cada destino.
- [X] T003 [P] Crear `src/styles/tokens.css`: custom properties de la paleta Propuesta 1 (`--ink:#210804`, `--cream:#efe8df`, `--brick:#7d290d`, `--terracotta:#d45b30`, `--sky:#74b3d6`, `--olive:#757522`), escala tipográfica (48-72px titulares desktop, cuerpo 1.5-1.6), espaciados y radios. Sin gradientes (FR-013).
- [X] T004 [P] Crear `src/styles/global.css`: reset mínimo, `@font-face`, clases `.reveal` (estado inicial visible; JS aplica la clase animable — R7), utilidades de duotono (`.duotone` con grayscale + mix-blend-mode y variantes de tinte — R6), `scroll-behavior: smooth` en `html`, y bloque `@media (prefers-reduced-motion: reduce)` que anula toda transición/animación/smooth (FR-016).
- [X] T005 [P] Self-hostear tipografías en `public/fonts/`: descargar woff2 subset latin de Archivo (400/700/900) y Fraunces (400/600 + italic), declararlas en `tokens.css` con `font-display: swap` y fallbacks con `size-adjust`. Contrastar visualmente contra `brand/Testigos-Brand-01.pdf` págs. 4-7 antes de fijar (R4).
- [X] T006 [P] Derivar variantes del logo en `src/assets/logo/` desde `logo-full-terracota.svg`: `logo-lockup.svg` (transparente, tinta `#210804`), `logo-lockup-light.svg` (tinta `#efe8df`), `logo-symbol.svg` (solo comillas) y `public/favicon.svg` (símbolo sobre terracota). No alterar formas (R3).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: tipos, datos compartidos, layout con SEO y header — sin esto ninguna sección se puede montar.

**⚠️ CRITICAL**: ninguna user story empieza sin cerrar esta fase.

- [X] T007 [P] Crear `src/config.ts`: `SITE_URL`, `PRETIX_EVENT_URL = 'TODO-PRETIX-URL'`, `pretixReady = false` (contrato [pretix-embed.md](contracts/pretix-embed.md)).
- [X] T008 [P] Crear `src/i18n/ui.ts` (tipo `LocalizedString {es,en}` obligatorios, tipo `Locale`, diccionario UI completo con `cta.buy` como única key del texto de compra, helper `t(key, locale)`) y `src/i18n/routes.ts` (URL equivalente entre idiomas preservando ancla) — ver [data-schemas.md](contracts/data-schemas.md).
- [X] T009 [P] Crear `src/data/event.ts`: entidad Event (fechas ISO 2026-11-05/08, `dateDisplay` "5 al 8 de noviembre de 2026"/"November 5-8, 2026", tagline "Periodistas en la Historia") y las 2 Venues con dirección en texto plano, rol por idioma y `mapsUrl` (data-model.md).
- [X] T010 Crear `src/layouts/EventLayout.astro`: `<html lang>` por locale, `<head>` completo según [seo-i18n.md](contracts/seo-i18n.md) (title/description por idioma, canonical, hreflang ×3, OG con `/og/og-image.png`, JSON-LD Event generado desde `event.ts`, `offers` solo si `pretixReady`), skip-link, slot, footer con organizadores, y los dos `<script>` de `IntersectionObserver` (header 2 estados + reveal único compartido — R7). Depende de T003-T009.
- [X] T011 Crear `src/components/CtaButton.astro` (props `{locale, variant}`, texto SIEMPRE `ui['cta.buy']`, `href="#boletas"`) y `src/components/Header.astro` (logo lockup, nav de anclas, selector ES/EN vía `routes.ts`, CTA persistente; estados translúcido-claro/sólido-oscuro por clase alternada desde el layout; sin JS queda en estado sólido legible). Depende de T006, T008.
- [X] T012 [P] Escribir `public/sitemap.xml` estático: 2 URLs (`/`, `/en/`) con `xhtml:link` hreflang es/en/x-default y `lastmod`; verificar que `public/robots.txt` lo referencia (contrato seo-i18n).

**Checkpoint**: `npm run check` y `npm run build` en verde con layout vacío montable.

---

## Phase 3: User Story 1 — Entender el evento y comprar boleta (Priority: P1) 🎯 MVP

**Goal**: hero con la información esencial (5-8 nov 2026, Villa de Leyva) + sección de compra con Pretix embebido y fallback.

**Independent Test**: con solo hero + compra publicados, un visitante entiende el evento sin scroll y puede iniciar compra (o ver "venta próximamente" si `pretixReady: false`).

- [X] T014 [P] [US1] Crear `src/components/Hero.astro`: hero fijo con cortina (fixed + spacer `100svh` + main opaco encima — R7), nombre, `dateDisplay` completo 5-8 nov (FR-001), lugar, tagline, CTA principal (`CtaButton`), fondo en bloques de color de marca sin imagen bloqueante (R10).
- [X] T015 [P] [US1] Crear `src/components/TicketSection.astro` con id `#boletas`: dos columnas (párrafo de contexto / widget), estados `pretixReady` false→aviso "venta abre pronto" y true→widget oficial por idioma con fallback de enlace directo dentro de `<pretix-widget>` — implementar exactamente [pretix-embed.md](contracts/pretix-embed.md) (FR-008/011).
- [X] T016 [US1] Escribir copy ES de hero y descripción corta en `ui.ts`/`event.ts`: tagline principal, un slogan del banco aprobado, párrafo de contexto con framing "historia de Colombia" (FR-002/003; campos EN quedan con traducción de trabajo para que compile — la revisión editorial EN es T031).
- [X] T017 [US1] Ensamblar `src/pages/index.astro`: `EventLayout` + `Header` + `Hero` + `TicketSection` (orden FR-004 parcial), anclas estables del contrato data-schemas.
- [X] T018 [US1] Validar US1 con quickstart: info visible sin scroll, CTA header persistente y scroll suave a `#boletas`, sin JS todo legible y fallback visible, `grep` de precios limpio, `check`+`build` verdes.

**Checkpoint**: MVP funcional en `/`.

---

## Phase 4: User Story 4 — Producción intacta durante el desarrollo (Priority: P1)

**Goal**: workflow de deploy preparado pero inerte; placeholder en línea sin cambios; activos heredados garantizados en el build.

**Independent Test**: `curl -sI https://testigosdelamemoria.com` sirve el placeholder; el workflow solo dispara en `push: main`; `dist/` contiene CNAME, IndexNow, robots, sitemap, og-image.

- [X] T019 [P] [US4] Crear `.github/workflows/deploy.yml`: `on: push: branches: [main]` + `workflow_dispatch`; jobs build (checkout → setup-node 22 → `npm ci` → `npm run build` → `upload-pages-artifact` con `dist/`) y deploy (`deploy-pages` con permisos `pages: write`, `id-token: write`) — R8. NO tocar la configuración de Pages.
- [X] T020 [P] [US4] Crear `src/pages/404.astro`: bilingüe (ES principal + EN), `noindex`, diseño de bloques de marca, enlaces a `/` y `/en/` (reemplaza `404.html` preservando su rol — FR-021).
- [X] T021 [US4] Validar US4: `git branch --show-current` = dev, `git log main..dev` contiene todo, producción intacta vía curl, `dist/` contiene los 5 activos heredados + `404.html` con noindex, workflow no tiene triggers de `dev`.

**Checkpoint**: protección de producción verificada y deploy futuro listo-pero-apagado.

---

## Phase 5: User Story 2 — Evaluar si el evento vale la pena (Priority: P2)

**Goal**: La Oportunidad (primera edición), Speakers (3 confirmados + por confirmar) y Agenda (4 días), con CTAs de cierre.

**Independent Test**: un visitante recorre las tres secciones, ve exactamente a Samper Pizano/Duzán/Restrepo sin horarios inventados, y llega a un CTA desde cada cierre.

- [X] T022 [P] [US2] Crear `src/data/speakers.ts`: los 3 confirmados con nombre EXACTO (`Daniel Samper Pizano`, `María Jimena Duzán`, `Darío Restrepo`), credencial con fuente y bio breve es/en, `photo: null` hasta recibir fotos, `tbdSlots` para cupos por confirmar (FR-005, data-model).
- [X] T023 [P] [US2] Crear `src/data/agenda.ts`: estructura de los 4 días (2026-11-05 talleres gratuitos Casa Museo; 06-08 conversatorios con boleta Duruelo), TODOS los `time: null` ("por confirmar"), `title: null` donde no haya título confirmado (FR-005, edge cases).
- [X] T024 [P] [US2] Crear `src/components/Opportunity.astro` (id `#oportunidad`): copy primera edición — la ocasión única de escuchar a estos periodistas sobre lo que vieron y su oficio, en Villa de Leyva; sin testimonios ni "ediciones anteriores"; una pregunta del banco aprobado como subtítulo (FR-004).
- [X] T025 [P] [US2] Crear `src/components/SpeakerCard.astro` y `src/components/SpeakerGrid.astro` (id `#speakers`): carrusel `scroll-snap` con flechas `scrollBy()` (R7), cards con duotono (o placeholder de marca con símbolo si `photo: null`), cards "Por confirmar", `CtaButton` al cierre (FR-014/015).
- [X] T026 [US2] Crear `src/components/Schedule.astro` (id `#agenda`): tabla fecha-hora izquierda / contenido derecha, líneas finas, etiquetas "Entrada libre"/"Con boleta" por tipo, fila destacada con acento sólido en borde izquierdo, "por confirmar" para `time: null`, `CtaButton` al cierre (sección 10 del brief). Depende de T022-T023.
- [X] T027 [US2] Integrar Opportunity + SpeakerGrid + Schedule en `src/pages/index.astro` en el orden FR-004, con `data-reveal` en cada sección; validar US2 con quickstart (grep de nombres = solo confirmados, carrusel con teclado, reveals una sola vez, reduced-motion).

**Checkpoint**: página ES completa de hero a agenda.

---

## Phase 6: User Story 5 — Visitante angloparlante (CANCELADA 2026-08-25)

> **Cancelada por el usuario**: el evento es todo en español; el sitio se publica solo en español. Las tareas T028-T031 se ejecutaron y luego se revirtieron (i18n eliminada del código y del spec).

**Goal**: `/en/` con paridad total, selector de idioma correcto, señales SEO bilingües.

**Independent Test**: desde cualquier sección, el selector lleva a la sección equivalente del otro idioma; `dist/en/index.html` tiene lang/canonical/hreflang correctos y 100% del contenido.

- [X] T028 [P] [US5] Crear `src/pages/en/index.astro`: mismo árbol de componentes que `index.astro` con `locale: 'en'` (paridad por construcción — contrato data-schemas).
- [X] T029 [US5] Verificar el selector de idioma end-to-end (`Header` + `routes.ts`): ES↔EN preservando ancla activa, atributos `hreflang` en los enlaces, funcional sin JS (enlaces reales).
- [X] T030 [US5] Revisión editorial del copy EN completo (`ui.ts` + `data/*`): traducción fiel a la voz de marca, sin traducir nombres propios/sedes, mismos vetos de framing (FR-023); dejar el resultado listo para revisión del usuario.
- [X] T031 [US5] Validar US5 con quickstart: paridad 100%, `<html lang>`, canonical/hreflang/OG locale por página, sitemap consistente, sin mezcla de idiomas (SC-009).

**Checkpoint**: sitio bilingüe completo hasta agenda.

---

## Phase 7: User Story 3 — Logística: llegar y dudas frecuentes (Priority: P3)

**Goal**: Venue con las 2 sedes + "Cómo llegar", y FAQs con CTA final.

**Independent Test**: direcciones legibles en texto plano, botón "Cómo llegar" abre la app de mapas en la sede correcta desde móvil, FAQs responden gratis-vs-boleta / cómo llegar / reembolsos.

- [X] T032 [P] [US3] Crear `src/components/VenueMap.astro` (id `#lugar`): las 2 sedes con nombre, rol (talleres gratuitos / conversatorios con boleta), dirección en texto plano, mapa estático liviano (imagen con tratamiento de marca, cero JS — opción por defecto del brief §6) y botón "Cómo llegar" con deep link universal de Google Maps por sede (FR-006).
- [X] T033 [P] [US3] Crear `src/data/faqs.ts` (contenido mínimo FR-007: qué es gratis y qué con boleta incl. talleres del 5, cómo llegar a Villa de Leyva desde Bogotá/Tunja, alojamiento, dudas de compra/reembolso → Pretix) y `src/components/FAQ.astro` (id `#faq`, `<details>/<summary>` accesible sin JS, `CtaButton` final tras la lista).
- [X] T034 [US3] Integrar VenueMap + FAQ en `index.astro` y `en/index.astro` (cierra el orden FR-004); validar US3 con quickstart (deep links en móvil, FAQs sin JS, CTA final presente).

**Checkpoint**: las 7 secciones completas en ambos idiomas.

---

## Phase 8: Polish & Cross-Cutting Concerns

- [X] T035 [P] Pase visual completo contra `brand/Testigos-Brand-01.pdf` págs. 1-7 (SC-007): paleta exacta, bloques sólidos, duotono consistente, hovers discretos; `grep -ri "gradient" src/` limpio; cero elementos de la Propuesta 2.
- [X] T036 [P] Pase de accesibilidad: navegación por teclado completa (CTAs, selector, flechas de carrusel, FAQs), aria-labels desde `ui.ts`, contraste AA de todas las combinaciones de la paleta, focus visible.
- [X] T037 Pase de rendimiento (SC-005): Lighthouse móvil ≥95 en Performance/A11y/SEO, JS propio <15 KB comprimido, hero <3s en Fast 3G + CPU 4x, CLS <0.05, imágenes AVIF/WebP lazy salvo hero.
- [X] T038 Ejecutar el checklist completo de [quickstart.md](quickstart.md) (todas las secciones, SC-001..SC-010) y corregir lo que falle.
- [X] T039 Commit final en `dev` con resumen del estado (pendientes: URL de Pretix, fotos de speakers, horarios de programación, revisión del inglés por el usuario). Recordatorio: NO push, NO merge a `main` sin autorización (FR-019).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (P1)**: sin dependencias.
- **Foundational (P2)**: requiere Setup. **Bloquea todas las stories.**
- **US1 (P3)**: requiere Foundational. Sin dependencias de otras stories.
- **US4 (P4)**: requiere solo Setup para T019-T020; T021 valida con el build de US1 disponible.
- **US2 (P5)**: requiere Foundational. Independiente de US1 (secciones propias), pero comparte `index.astro` con T017 → integrar después.
- **US5 (P6)**: requiere Foundational; su valor completo crece con US1/US2 integradas (paridad se garantiza por tipos desde el inicio).
- **US3 (P7)**: requiere Foundational; edita `index.astro`/`en/index.astro` después de US2/US5.
- **Polish (P8)**: requiere todas las stories deseadas.

### Within Each Story

Datos → componentes → integración en páginas → validación. Las tareas que editan `index.astro` (T017, T027, T034) son secuenciales entre sí.

### Parallel Opportunities

- Setup: T003, T004, T005, T006 en paralelo tras T001-T002.
- Foundational: T007, T008, T009, T012 en paralelo; luego T010 → T011.
- US1: T014 ∥ T015; US2: T022 ∥ T023 ∥ T024 ∥ T025; US4: T019 ∥ T020; US3: T032 ∥ T033.
- US4 (T019/T020) puede correr en paralelo con US1 completa (archivos disjuntos).

## Parallel Example: User Story 2

```text
# Tras Foundational, lanzar juntas:
T022 src/data/speakers.ts
T023 src/data/agenda.ts
T024 src/components/Opportunity.astro
T025 src/components/SpeakerCard.astro + SpeakerGrid.astro
# Luego secuencial: T026 (Schedule, depende de datos) → T027 (integración en index.astro)
```

## Implementation Strategy

**MVP first**: Setup → Foundational → US1 → validar → (US4 en paralelo o inmediatamente después: es barata y protege producción). Con eso hay una landing publicable "hero + compra".

**Incremental**: cada checkpoint deja `dev` en estado consistente y demostrable (`npm run preview`). Orden de valor: US1 → US4 → US2 → US5 → US3 → Polish. Commit por tarea o grupo lógico, siempre en `dev`.

**Bloqueos externos conocidos** (no frenan ninguna tarea; se modelan como "por confirmar"/flags): URL de Pretix (`pretixReady`), fotos de speakers (`photo: null`), horarios (agenda `time: null`), fuentes reales del manual si el usuario las conoce (T005).

## Notes

- Numeración: no existe T013 (reservado y absorbido en reorganización final de Foundational).
- Nombres de panelistas: SOLO los 3 confirmados, grafía exacta del spec (Clarifications 2026-08-25).
- Nada de esta lista toca `main`, la configuración de Pages, ni hace push.
