# Quickstart — validación del sitio

Guía para levantar, construir y validar la landing contra los criterios del spec. No es guía de implementación (eso es `tasks.md`).

## Prerrequisitos

- Node 22+ (`node --version` → v22.16.0 local ✓), rama `dev` (`git branch --show-current`).
- **Nunca** ejecutar nada de esto en `main`.

## Levantar y construir

```bash
npm install          # primera vez
npm run dev          # http://localhost:4321  (y /en/)
npm run check        # astro check — tipos: paridad es/en obligatoria
npm run build        # genera dist/ — debe terminar sin errores ni warnings
npm run preview      # sirve dist/ como en producción
```

Gate mecánico: `check` + `build` en verde antes de cualquier commit que toque `src/`.

## Checklist de validación (mapeada a Success Criteria)

**Contenido y compra**

- [ ] `/` muestra sin scroll: nombre, "5 al 8 de noviembre de 2026", Villa de Leyva, CTA (SC-001).
- [ ] CTA del header visible en todo el scroll; clic → scroll a `#boletas` (SC-002).
- [ ] CTAs en cierre de Speakers, Agenda y tras FAQs, texto/estilo idénticos al del header (SC-008).
- [ ] `grep -ri "samper\|duzán\|restrepo" src/` solo devuelve los 3 confirmados; ningún horario junto a ellos (SC-003, SC-010).
- [ ] Con `pretixReady: false`: sección de compra muestra "venta próximamente", sin widget ni enlaces rotos.
- [ ] Ningún precio/tipo de boleta en `src/`: `grep -riE "\\$|COP|precio|price" src/` limpio (FR-008).

**Idiomas**

- [ ] `/en/` existe con el 100% del contenido; selector de idioma en header lleva a la sección equivalente (SC-009).
- [ ] `<html lang>`, canonical, hreflang (es/en/x-default) correctos en ambas páginas — ver `dist/index.html` y `dist/en/index.html`.
- [ ] `dist/sitemap.xml` con 2 URLs + alternates; `dist/CNAME`, `dist/robots.txt`, `dist/1b88...txt`, `dist/og/og-image.png` presentes (FR-021).

**Degradación y accesibilidad**

- [ ] DevTools → deshabilitar JS → recargar: TODO el contenido legible, secciones visibles (sin reveals), FAQs abren (details/summary), fallback de compra visible (SC-004, FR-018).
- [ ] macOS: Ajustes → Accesibilidad → Reducir movimiento → recargar: sin reveals animados, sin scroll suave, carrusel sin smooth (FR-016).
- [ ] Navegación completa por teclado: CTAs, selector de idioma, flechas del carrusel, FAQs.

**Rendimiento (SC-005)**

- [ ] Lighthouse móvil sobre `npm run preview`: Performance ≥ 95, A11y ≥ 95, SEO ≥ 95; CLS < 0.02.
- [ ] DevTools → Network → Fast 3G + CPU 4x: hero visible < 3 s.
- [ ] JS propio (excluyendo Pretix) < 15 KB comprimido: revisar tamaño de los `<script>` en dist.

**Marca (SC-007)**

- [ ] Revisión visual contra `brand/Testigos-Brand-01.pdf` págs. 1-7: solo colores de la Propuesta 1, bloques sólidos, duotono; `grep -ri "gradient" src/styles src/components` limpio (FR-013).
- [ ] Cero elementos de la Propuesta 2 (lápiz, paleta alterna).

**Protección de producción (SC-006)**

- [ ] `git log main..dev` contiene todo el trabajo; `git status` nunca en `main`.
- [ ] `curl -sI https://testigosdelamemoria.com` → el placeholder sigue en línea, sin cambios.
- [ ] `.github/workflows/deploy.yml` solo dispara en `push: main` / `workflow_dispatch`.

## Deploy final (SOLO con orden explícita del usuario — no ejecutar)

1. Merge `dev → main` preservando activos (ya en `public/`).
2. En GitHub: Settings → Pages → Source: **GitHub Actions**.
3. Push de `main` → workflow construye y publica; verificar dominio, sitemap, IndexNow.
4. Smoke test de producción: checklist de idiomas + compra + 404.
