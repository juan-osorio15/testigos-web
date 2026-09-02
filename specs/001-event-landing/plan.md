# Implementation Plan: Landing page del evento Testigos de la Memoria

**Branch**: `dev` (feature dir `001-event-landing`) | **Date**: 2026-08-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-event-landing/spec.md`

> **Actualización 2026-08-25 (post-implementación)**: el usuario revirtió el alcance bilingüe — el evento es todo en español y el sitio se publica SOLO en español. Toda mención a i18n/EN/hreflang en este plan y en `contracts/seo-i18n.md` quedó superada; el código la eliminó por completo.

## Summary

Landing page bilingüe (ES/EN) del evento Testigos de la Memoria (5-8 nov 2026, Villa de Leyva) construida con Astro como sitio 100% estático en la raíz del repo (rama `dev`). La identidad visual sale de la Propuesta 1 del manual de marca (bloques de color sólidos, duotono, logo ya disponible en `assets/logo.svg`). La compra vive íntegramente en el widget embebido de Pretix. Interacciones limitadas a CSS + `IntersectionObserver` + `scrollBy()` nativos: hero fijo con cortina, header de dos estados, scroll reveal, carrusel con snap. Deploy final preparado como workflow de GitHub Actions (build Astro → Pages) que solo dispara en push a `main` — inerte hasta autorización del usuario.

## Technical Context

**Language/Version**: Astro 5.x (estático), TypeScript para datos/config, JavaScript vanilla en `<script>` de Astro. Node 22 (v22.16.0 instalado localmente).

**Primary Dependencies**: `astro` (única dependencia de runtime/build). Sin frameworks UI, sin librerías de carrusel/animación/i18n externas (i18n con el routing nativo de Astro). Widget de Pretix como único script externo.

**Storage**: N/A — contenido en módulos TypeScript tipados (`src/data/`) y diccionarios de UI (`src/i18n/`).

**Testing**: `astro build` + `astro check` como gate mecánico; validación funcional por checklist de `quickstart.md` (sin framework de tests — sitio estático de una página; el costo de un harness no se justifica).

**Target Platform**: Web estática en GitHub Pages (dominio testigosdelamemoria.com ya configurado). Navegadores evergreen + móvil; degradación completa sin JS.

**Project Type**: Sitio web estático (landing de una página × 2 idiomas + 404).

**Performance Goals**: Hero visible < 3s en 3G rápido / móvil gama media (SC-005); CLS ≈ 0; JS propio < 15 KB comprimido (excluye widget Pretix); imágenes lazy salvo hero.

**Constraints**: Sin gradientes ni glassmorphism decorativo; `prefers-reduced-motion` respetado en todo movimiento; toda la información legible sin JS; Pretix único dueño de precios/tipos de boleta; rama `main` y configuración de Pages intocables hasta autorización.

**Scale/Scope**: 2 páginas públicas (`/`, `/en/`) + 404 bilingüe; 7 secciones; 3 speakers confirmados (estructura para ~10-15); agenda de 4 días; ~10 FAQs.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` es la plantilla sin ratificar (placeholders sin llenar) → no impone gates. Actúan como gates de facto las restricciones no negociables del spec: FR-013 (superficies planas), FR-016 (`prefers-reduced-motion`), FR-018 (información sin JS), FR-019 (no tocar `main`/Pages), FR-008 (Pretix único punto de venta). **PASS** — el diseño de Phase 1 no viola ninguna. Re-chequeado tras Phase 1: **PASS** (sin cambios).

## Project Structure

### Documentation (this feature)

```text
specs/001-event-landing/
├── plan.md              # Este archivo
├── research.md          # Phase 0: decisiones técnicas
├── data-model.md        # Phase 1: entidades y esquemas de datos
├── quickstart.md        # Phase 1: guía de validación
├── contracts/
│   ├── data-schemas.md  # Contratos de datos de contenido (speakers, agenda, FAQs, i18n)
│   ├── seo-i18n.md      # Contrato SEO/hreflang/sitemap/JSON-LD y activos heredados
│   └── pretix-embed.md  # Contrato del embed de Pretix y su fallback
└── tasks.md             # Phase 2 (/speckit-tasks — aún no)
```

### Source Code (repository root)

Proyecto Astro en la **raíz del repo, en la rama `dev`**. Los archivos del placeholder (`index.html`, `assets/franja.jpg`, etc.) se retiran en `dev` — siguen intactos en `main`, que es lo que está publicado. Los activos a preservar (FR-021) se trasladan a `public/` para que el build los emita en la raíz de `dist/`.

```text
astro.config.mjs           # site, i18n (es raíz / en prefijo), output estático
package.json               # dependencia única: astro
tsconfig.json
.github/workflows/deploy.yml   # preparado, dispara SOLO en push a main (inerte en dev)
public/
├── CNAME                  # preservado de main (testigosdelamemoria.com)
├── 1b880322af30410c8832c1e6748dc455.txt   # clave IndexNow, preservada
├── robots.txt             # preservado, URLs actualizadas
├── og/og-image.png        # preservado de assets/
└── fonts/                 # woff2 self-hosted (2 familias)
src/
├── config.ts              # PRETIX_EVENT_URL (placeholder marcado), SITE_URL, flags
├── styles/
│   ├── tokens.css         # paleta Propuesta 1, tipografía, espaciado
│   └── global.css         # reset, reveal, duotone, reduced-motion
├── assets/
│   ├── logo/              # variantes derivadas de assets/logo.svg (main)
│   └── photos/            # fotos documentales y de speakers (fuente para duotono)
├── i18n/
│   ├── ui.ts              # diccionario UI es/en + helper t()
│   └── routes.ts          # mapeo de URLs equivalentes entre idiomas
├── data/
│   ├── event.ts           # fechas, sedes, organizadores (por idioma donde aplique)
│   ├── speakers.ts        # 3 confirmados + estructura "por confirmar"
│   ├── agenda.ts          # franjas por día/tipo/sede
│   └── faqs.ts            # preguntas/respuestas por idioma
├── layouts/
│   └── EventLayout.astro  # <head> SEO/hreflang/JSON-LD, header 2 estados, footer, scripts IO
├── components/
│   ├── Header.astro       # logo, nav, selector idioma, CTA persistente
│   ├── CtaButton.astro    # botón de compra único reutilizado
│   ├── Hero.astro         # hero fijo con cortina
│   ├── TicketSection.astro# descripción + widget Pretix + fallback
│   ├── Opportunity.astro  # "La Oportunidad" (primera edición)
│   ├── SpeakerCard.astro / SpeakerGrid.astro   # carrusel snap + duotono
│   ├── Schedule.astro     # tabla agenda 4 días
│   ├── VenueMap.astro     # 2 sedes, direcciones, "Cómo llegar"
│   └── FAQ.astro          # detalles/summary accesible
└── pages/
    ├── index.astro        # español (raíz)
    ├── en/index.astro     # inglés
    └── 404.astro          # bilingüe, noindex, reemplaza al 404.html actual
```

**Structure Decision**: proyecto único en la raíz porque el repo es el sitio (Pages). El placeholder no convive con el código nuevo en `dev`: la separación de ramas es la separación de entornos. `sitemap.xml` se genera en build con alternates hreflang (ver contrato SEO).

## Complexity Tracking

Sin violaciones que justificar: una sola dependencia (astro), cero librerías de efectos, un solo proyecto.
