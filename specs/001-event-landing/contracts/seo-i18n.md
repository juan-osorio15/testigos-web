# Contrato: SEO, i18n y activos heredados

> **SUPERADO PARCIALMENTE (2026-08-25)**: el sitio es SOLO en español por decisión del usuario. Ignorar todo lo relativo a `/en/`, hreflang y selector de idioma; sigue vigente lo de canonical, OG, JSON-LD, sitemap (1 URL) y activos heredados.

## URLs

| Página | URL | Notas |
|---|---|---|
| Landing ES | `https://testigosdelamemoria.com/` | idioma principal, sin prefijo |
| Landing EN | `https://testigosdelamemoria.com/en/` | |
| 404 | `/404.html` (generada de `404.astro`) | bilingüe, `noindex` |

## `<head>` por página (EventLayout)

- `<title>` y `<meta name="description">` por idioma (mejorando los actuales de `main`, no perdiéndolos — FR-021).
- `<link rel="canonical">` absoluto a la URL propia.
- hreflang: `<link rel="alternate" hreflang="es" href=".../">`, `hreflang="en" href=".../en/"`, `hreflang="x-default" href=".../">` — en AMBAS páginas.
- Open Graph/Twitter: `og:title`, `og:description`, `og:image` = `/og/og-image.png` (preservado), `og:locale` (`es_CO` / `en_US`) + `og:locale:alternate`.
- JSON-LD `@type: Event`: `name`, `startDate: 2026-11-05`, `endDate: 2026-11-08`, `eventAttendanceMode: OfflineEventAttendanceMode`, `location`: las dos sedes como `Place` con `address`, `organizer`, `image`, `inLanguage` por página; `offers` (url de Pretix, `availability`) SOLO cuando `pretixReady` — nunca precios en el JSON-LD (dominio de Pretix).

## `public/sitemap.xml` (estático, escrito a mano)

2 `<url>` (/, /en/) cada una con los 3 `<xhtml:link rel="alternate" hreflang>` cruzados y `lastmod`. `robots.txt` preservado: `Allow: /` + `Sitemap: https://testigosdelamemoria.com/sitemap.xml`.

## Activos heredados de `main` → `public/`

| Activo | Destino | Cambio permitido |
|---|---|---|
| `CNAME` | `public/CNAME` | ninguno (contenido: `testigosdelamemoria.com`) |
| `1b880322af30410c8832c1e6748dc455.txt` | `public/` (raíz) | ninguno |
| `robots.txt` | `public/robots.txt` | ninguno (ya apunta al sitemap) |
| `sitemap.xml` | `public/sitemap.xml` | reescrito con 2 URLs + hreflang |
| `assets/og-image.png` | `public/og/og-image.png` | ninguno (regenerable después como mejora aparte) |
| `assets/logo.svg` | `src/assets/logo/` (fuente de variantes) | derivar variantes sin alterar formas |
| `404.html` | reemplazado por `404.astro` | mantiene `noindex` y gana diseño de marca bilingüe |

## Selector de idioma

En el header, visible en ambos estados. ES↔EN enlazan la URL equivalente preservando `#ancla`. Atributo `lang` correcto en `<html>`; `hreflang` en los enlaces del selector.
