# Research — Landing Testigos de la Memoria

Phase 0. Todas las incógnitas del Technical Context resueltas. Formato: Decisión / Racional / Alternativas.

## R1. Framework y versión

- **Decisión**: Astro 5.x, `output: 'static'` (default), proyecto en la raíz del repo en rama `dev`.
- **Racional**: exigido por el brief; Astro no emite JS salvo el que se escriba en `<script>`; soporta i18n de rutas nativo y optimización de imágenes integrada (`astro:assets`/sharp), lo que evita dependencias extra.
- **Alternativas**: Eleventy/HTML a mano (descartado: el brief fija Astro y sus componentes ordenan el trabajo); Astro 4 (sin razón para una major vieja).

## R2. i18n — enrutado y estrategia de contenido

- **Decisión**: i18n nativo de Astro: `defaultLocale: 'es'`, `locales: ['es', 'en']`, español en la raíz (`/`) sin prefijo, inglés bajo `/en/`. Contenido en módulos tipados con `LocalizedString { es, en }` (ambos campos obligatorios) y diccionario de UI en `src/i18n/ui.ts`. Selector de idioma en el header enlaza a la URL equivalente (`routes.ts`), con anchor de sección preservado.
- **Racional**: dos páginas no ameritan librería de i18n; el tipo `LocalizedString` con ambos idiomas obligatorios implementa el edge case "no se publica contenido sin traducir" en compile-time (falla `astro check`).
- **Alternativas**: librerías i18n (astro-i18next etc.) — dependencia injustificada; detección automática de idioma por `Accept-Language` con redirect — imposible en hosting estático y hostil al SEO; se descartó.

## R3. Logo y assets de marca

- **Decisión**: usar `assets/logo.svg` ya existente en `main` como fuente vectorial: es el lockup completo de la Propuesta 1 (símbolo de comillas + pleca + wordmark serifado en paths, tinta `#210804`, sobre rect `#d45b30`). Derivar variantes: (a) lockup transparente (sin rect de fondo), (b) versión tinta clara `#efe8df` para fondos oscuros, (c) símbolo solo (las dos comillas) para favicon/detalles. El PDF de marca queda como referencia visual; no se extrae nada de él.
- **Racional**: el vector ya existe en el repo con los colores exactos de la paleta — extraer del PDF (18 MB, rasterizado por página) sería peor en calidad y esfuerzo. El usuario ofreció SVGs fuente solo "si es necesario": no lo es.
- **Alternativas**: `pdftocairo -svg` sobre las páginas del manual (innecesario); pedir fuentes al diseñador (queda como respaldo si alguna variante necesita un trazo que el SVG actual no tiene).

## R4. Tipografía

- **Decisión**: dos familias self-hosted (woff2, subset latin, en `public/fonts/`, `font-display: swap`): **Archivo** (grotesca variable; UI, cuerpo y titulares bold) y **Fraunces** (serif con carácter afín al wordmark; acentos editoriales: citas, destacados, números de fecha). El wordmark del logo es SVG, nunca texto tipografiado.
- **Racional**: el brief pide sans grotesca bold en titulares y máx. dos familias; la Propuesta 1 usa una sans geométrica en aplicaciones y un serif irregular en el wordmark — Archivo + Fraunces cubren ambos registros con licencia libre (OFL). Self-hosting evita requests a terceros y elimina layout shift controlando `size-adjust` del fallback.
- **Alternativas**: Google Fonts CDN (request externo, sin beneficio); usar el serif del wordmark como tipografía de titulares (no está identificado ni licenciado como fuente; el manual no lo entrega). **Validación pendiente en implementación**: contraste visual contra las páginas 4-7 del PDF antes de fijar pesos; si el usuario conoce las familias reales del manual, reemplazan a las propuestas.

## R5. Embed de Pretix

- **Decisión**: widget oficial de Pretix: `<link>` al CSS del widget + `<script async src="https://pretix.eu/widget/v1.{lang}.js">` (por idioma: `v1.es.js` en `/`, `v1.en.js` en `/en/`) + elemento `<pretix-widget event="{PRETIX_EVENT_URL}">`. Dentro del elemento, el fallback oficial `<noscript>`/`<div class="pretix-widget-info-message">` con enlace directo a la tienda. `PRETIX_EVENT_URL` vive en `src/config.ts` con placeholder marcado (`TODO-PRETIX-URL`) y un flag `pretixReady: false` que, mientras sea falso, renderiza la sección con el enlace deshabilitado visualmente y texto "venta próximamente" — nunca un widget roto.
- **Racional**: es el mecanismo soportado por Pretix, con estado propio y aislado (cumple FR-008); el script por idioma alinea el widget con la página; el flag evita publicar un embed contra una URL inexistente.
- **Alternativas**: iframe manual a la tienda (pierde checkout embebido y estilos); botón que abre Pretix en pestaña nueva como única vía (más fricción; queda como fallback, no como principal).

## R6. Duotono de fotos

- **Decisión**: CSS puro: contenedor con `background-color` del tinte de marca + `<img>` con `filter: grayscale(1) contrast(1.05)` y `mix-blend-mode: multiply` (variante `screen` para tinte claro sobre fondo oscuro). Tinte por defecto: terracota `#d45b30` sobre crema; alternos por sección con la paleta. `@media (prefers-reduced-motion)` no aplica (no es movimiento); imprime igual.
- **Racional**: unifica fotos dispares (FR-014) sin preprocesado ni dependencias; funciona con `astro:assets` y lazy-loading.
- **Alternativas**: duotono pre-procesado en build con sharp (más control fino de curvas, pero acopla el tratamiento al pipeline; se reserva por si el blend-mode rinde mal con alguna foto concreta); SVG `<feColorMatrix>` (más código para el mismo resultado).

## R7. Patrones de interacción (mecánica exacta)

- **Decisión**: implementar tal como fija el brief, sin librerías:
  - **Hero cortina**: hero `position: fixed; inset: 0` + spacer `height: 100svh` + main con fondo sólido y `z-index` mayor. CSS puro.
  - **Header 2 estados**: `IntersectionObserver` sobre un sentinel al fondo del hero alterna una clase en `<header>`; estados translúcido-claro / sólido-oscuro con sombra sutil. Estado inicial correcto sin JS (translúcido) y con JS deshabilitado el header queda en estado sólido por `@supports`/fallback de clase — legible siempre.
  - **Scroll reveal**: clase `.reveal` (opacity 0 + translateY(16px), transición 500ms ease-out) removida una sola vez por un único `IntersectionObserver` compartido (`threshold: 0.15`, `unobserve` tras disparar). Sin JS, las secciones son visibles por defecto (la clase se aplica vía JS al cargar, no en el HTML).
  - **Carrusel speakers**: `scroll-snap-type: x mandatory` + `scroll-snap-align: start`; flechas `scrollBy({left: ±card, behavior: 'smooth'})`; en `prefers-reduced-motion`, `behavior: 'auto'`.
  - **Scroll suave de CTAs**: anchors reales (`href="#boletas"`) + `scroll-behavior: smooth` en CSS, desactivado bajo `prefers-reduced-motion`. Sin JS.
- **Racional**: cumple FR-015/016/018 y el presupuesto de JS (<15 KB); aplicar reveal desde JS garantiza contenido visible sin JS.
- **Alternativas**: evento `scroll` (prohibido por el brief); librerías (prohibidas).

## R8. Deploy — workflow preparado e inerte

- **Decisión**: `.github/workflows/deploy.yml` con `on: { push: { branches: [main] }, workflow_dispatch: {} }`, jobs: build (`actions/checkout` → `actions/setup-node@v4` con Node 22 → `npm ci` → `npm run build` → `actions/upload-pages-artifact` con `dist/`) y deploy (`actions/deploy-pages`). Mientras viva solo en `dev`, no dispara nunca. El cambio de la fuente de Pages ("Deploy from branch" → "GitHub Actions") es una acción manual del usuario que se hará solo con su orden, documentada en `quickstart.md`.
- **Racional**: cumple FR-019/020 — el workflow existe y está probado (via `workflow_dispatch` se podría ensayar en un fork o tras autorización) pero no puede afectar producción desde `dev`; GitHub Pages ignora workflows de ramas no publicadas y la fuente actual (branch/legacy) sigue mandando hasta que el usuario la cambie.
- **Alternativas**: opción (b) del brief — commitear `dist/` a `main` (frágil, contamina historial); Cloudflare Pages (superado: el hosting real es GitHub Pages).

## R9. SEO, sitemap y activos heredados

- **Decisión**: `sitemap.xml` **estático escrito a mano** en `public/` con las 2 URLs y alternates `xhtml:link hreflang` cruzados (es/en/x-default); `robots.txt` preservado apuntándolo. Metadatos por página en `EventLayout.astro`: title/description por idioma, canonical absoluto, `hreflang` alternates en `<head>`, Open Graph con `og-image.png` preservado, JSON-LD `Event` (con `startDate: 2026-11-05`, `endDate: 2026-11-08`, `location` con las dos sedes, `offers` apuntando a Pretix cuando exista URL) que mejora el actual. `404.astro` bilingüe con `noindex`. `CNAME` y clave IndexNow en `public/`.
- **Racional**: 2 URLs no justifican `@astrojs/sitemap` (mantiene la dependencia única); FR-021 pide conservar y mejorar cada activo, y `public/` garantiza que el build los emita en la raíz.
- **Alternativas**: `@astrojs/sitemap` con config i18n (más dependencia para generar 10 líneas de XML); sitemap por endpoint dinámico de Astro (complejidad sin beneficio).

## R10. Imágenes y rendimiento

- **Decisión**: `astro:assets` (`<Image>`/`<Picture>`) para fotos: AVIF/WebP con fallback, `widths` responsivos, `loading="lazy"` + `decoding="async"` salvo la imagen del hero (si la hay) con `loading="eager"` + `fetchpriority="high"`. Fondo del hero preferentemente en bloques de color de marca (cero peso) con foto duotono como acento, no como fondo full-bleed obligatorio. Presupuesto: JS propio < 15 KB comprimido; CSS < 30 KB; hero sin imágenes bloqueantes → SC-005 alcanzable.
- **Racional**: sharp ya viene con Astro; el lenguaje de bloques de la marca permite un hero casi sin bytes de imagen, que es la vía más segura hacia "hero < 3s en 3G rápido".
- **Alternativas**: servicio de imágenes externo (request a terceros, innecesario).

## R11. Testing y validación

- **Decisión**: gate mecánico = `astro check` (tipos, incluye la obligatoriedad de `es`+`en` en todo `LocalizedString`) + `astro build` sin warnings. Validación funcional = checklist reproducible en `quickstart.md` (sin JS, reduced-motion, idiomas, Lighthouse ≥ 95 en Performance/A11y/SEO móvil, revisión visual contra PDF págs. 1-7). Sin framework de tests.
- **Racional**: una landing estática con datos tipados obtiene más valor del type-checking + checklist que de un harness de tests que nadie mantendrá; los criterios SC-001..SC-010 son verificables manualmente en minutos.
- **Alternativas**: Playwright/Vitest (peso de mantenimiento injustificado para 2 páginas estáticas; reconsiderar solo si el sitio crece a multi-página con lógica).
