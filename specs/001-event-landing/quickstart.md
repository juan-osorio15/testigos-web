# Quickstart — validación del sitio

Guía para levantar, construir y validar la landing contra los criterios del spec. No es guía de implementación (eso es `tasks.md`).

## Prerrequisitos

- Node 22+ (`node --version` → v22.16.0 local ✓), rama `dev` (`git branch --show-current`).
- **Nunca** ejecutar nada de esto en `main`.

## Levantar y construir

```bash
npm install          # primera vez
npm run dev          # http://localhost:4321
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

**Degradación y accesibilidad**

- [ ] DevTools → deshabilitar JS → recargar: TODO el contenido legible, secciones visibles (sin reveals), FAQs abren (details/summary), fallback de compra visible (SC-004, FR-018).
- [ ] macOS: Ajustes → Accesibilidad → Reducir movimiento → recargar: sin reveals animados, sin scroll suave, carrusel sin smooth (FR-016).
- [ ] Navegación completa por teclado: CTAs, selector de idioma, flechas del carrusel, FAQs.

**Rendimiento (SC-005)**

- [ ] Lighthouse móvil sobre `npm run preview`: Performance ≥ 95, A11y ≥ 95, SEO ≥ 95; CLS < 0.05.
- [ ] DevTools → Network → Fast 3G + CPU 4x: hero visible < 3 s.
- [ ] JS propio (excluyendo Pretix) < 15 KB comprimido: revisar tamaño de los `<script>` en dist.

**Marca (SC-007)**

- [ ] Revisión visual contra `brand/Testigos-Brand-01.pdf` págs. 1-7: solo colores de la Propuesta 1, bloques sólidos, duotono; `grep -ri "gradient" src/styles src/components` limpio (FR-013).
- [ ] Cero elementos de la Propuesta 2 (lápiz, paleta alterna).

**Protección de producción (SC-006)**

- [ ] `git log main..dev` contiene todo el trabajo; `git status` nunca en `main`.
- [ ] `curl -sI https://testigosdelamemoria.com` → el placeholder sigue en línea, sin cambios.
- [ ] `.github/workflows/deploy.yml` solo dispara en `push: main` / `workflow_dispatch`.

## Demo pública en /demo (mientras se aprueba)

Publicada el 2026-08-26 con autorización del usuario: la raíz sigue sirviendo el
placeholder y el sitio nuevo vive en https://testigosdelamemoria.com/demo/
(con `noindex` + `Disallow: /demo/` en robots.txt: no compite en SEO).

**Cómo se publica/actualiza la demo** (desde `dev`):

```bash
npm run build:demo                       # build con base /demo (noindex automático)
# limpiar metaarchivos de raíz que no aplican bajo /demo:
rm -f dist/CNAME dist/robots.txt dist/sitemap.xml dist/1b880322af30410c8832c1e6748dc455.txt
git checkout main
rm -rf demo && cp -R dist demo
git add demo && git commit -m "Actualizar demo"
git push origin main                     # publica: raíz intacta + /demo actualizado
git checkout dev
```

En `main` existen además `.nojekyll` (necesario para que Pages sirva `_astro/`)
y el `robots.txt` con `Disallow: /demo/`. No tocar ninguno de los dos.

## Promoción a la raíz cuando el sitio quede aprobado (deploy final)

**SOLO con orden explícita del usuario — no ejecutar antes.**

1. Merge `dev → main` (en conflictos modify/delete de `specs/`, `brand/` y
   `.specify/` — retirados de `main` al publicar la demo — tomar la versión
   de `dev` o volver a retirarlos: no deben publicarse).
2. Retirar de `main` lo que ya no aplica: la carpeta `demo/`, los archivos
   del placeholder (`index.html`, `404.html`, `assets/`) y quitar el
   `Disallow: /demo/` de `public/robots.txt`.
3. En GitHub: Settings → Pages → Source: **GitHub Actions** (el workflow
   `.github/workflows/deploy.yml` ya está listo; construye con `npm run build`,
   SIN base /demo, y publica `dist/`).
4. Push de `main` → workflow construye y publica; verificar dominio, sitemap,
   IndexNow, y que https://testigosdelamemoria.com sirva el sitio nuevo.
5. Smoke test de producción: checklist completo de este documento + compra + 404.
