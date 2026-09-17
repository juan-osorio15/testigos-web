# Cuaderno de la feature 002

## Línea base

2026-09-17, rama `dev` (commit b80e44b), `astro build` + `astro preview`, Lighthouse 12 móvil simulado (Moto G Power, 4G lento), cinco corridas, `--only-categories=performance`.

| Métrica | Corridas | Mediana |
|---|---|---|
| LCP (ms) | 4206, 3460, 4053, 4205, 4054 | **4054** |
| Peso total sin comprimir (KB) | | **678** |

### Estado b · esta rama, identificadores vacíos, precarga de la imagen principal (2026-09-17)

| Métrica | Corridas | Mediana | Frente a la base |
|---|---|---|---|
| LCP (ms) | 3679, 3701, 3679, 3705, 3679 | **3679** | −375 ms (−9 %) |
| Peso total sin comprimir (KB) | | **627** | −51 KB (widths más ajustados de la hero) |

La precarga apunta al mismo `srcset` que la `<img>` (verificado en el HTML). El estado c (con GA4 y Meta) se mide cuando existan los identificadores.

Nota: la auditoría reportó 420 KB transferidos (comprimidos) y TTFB de 53 ms en producción; Lighthouse local mide sin la compresión de GitHub Pages. La comparación válida es contra esta misma línea base con el mismo comando. El criterio de la spec (LCP < 2,5 s) se evalúa en PageSpeed Insights sobre producción tras el deploy, y aquí se exige que ninguna etapa empeore la mediana local.

## Cuentas

| Identificador | Estado | Fecha |
|---|---|---|
| GA4 `G-…` | pendiente (Juan, paso 2) | |
| Meta dataset ID | pendiente (Juan, paso 3) | |
| Dominio verificado en Meta | pendiente (paso 4, opcional) | |
| Bing Webmaster Tools | pendiente (paso 12) | |
| Backend y Pretix | no aplica (capa retirada el 2026-09-17) | 2026-09-17 |

## Revisiones de restos antes de publicar (FR-039, T073)

| Fecha | Publicación | Resultado |
|---|---|---|
| | 1 (medición y legales) | pendiente |

## Verificaciones por historia

(Se rellena al cerrar cada historia con la sección del quickstart ejecutada.)

## Hitos

| Fecha | Hito | Estado |
|---|---|---|
| ≤ 2026-09-21 | Publicación 1: medición y textos legales | |
| ≤ 2026-09-29 | Publicación 2: marcado, fichas, programación, charlas | |
| 2026-10-05 | Cambio de etapa | |
| ≤ 2026-10-15 | Publicación 3: cómo llegar, dónde dormir | |
