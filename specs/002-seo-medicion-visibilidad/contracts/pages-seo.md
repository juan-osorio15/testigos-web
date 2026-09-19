# Contrato: páginas, metadatos, sitemap, robots e IndexNow

Cubre FR-018 a FR-037 y R-05.

## Rutas (`src/routes.ts`)

| Ruta | Página | Título (≤ 60) | Migas | OG |
|---|---|---|---|---|
| `/` | portada | opción aprobada por el usuario (60 o 53 car.) | — | `og-image-v3.png` (v3 desde el 2026-09-18: hero con las caras) |
| `/panelistas/` | índice | `Panelistas · Testigos de la Memoria 2026` | Inicio › Panelistas | portada |
| `/panelistas/<slug>/` ×12 | ficha | `<Nombre> · Testigos de la Memoria 2026` | Inicio › Panelistas › Nombre | `og/panelistas/<slug>-v1.png` |
| `/programacion/` | programación | `Programación · Testigos de la Memoria, Villa de Leyva 2026` (58) | Inicio › Programación | `og/paginas/programacion-v1.png` |
| `/charlas-abiertas/` | charlas | `Charlas abiertas gratis · Testigos de la Memoria 2026` | Inicio › Charlas abiertas | `og/paginas/charlas-abiertas-v1.png` |
| `/como-llegar/` | práctica | `Cómo llegar a Villa de Leyva · Testigos de la Memoria` | Inicio › Cómo llegar | portada |
| `/donde-dormir/` | práctica (condicionada) | `Dónde dormir en Villa de Leyva · Testigos de la Memoria` | Inicio › Dónde dormir | portada |

Fuera del sitemap y con `noindex, follow`: `/tratamiento-de-datos/`, `/terminos-y-condiciones/`; `/404` con `noindex`.

Descripciones: ≤ 155 caracteres, con fechas y "Villa de Leyva"; las de las fichas se derivan de la credencial: "<Nombre>, <credencial>. Participa en Testigos de la Memoria, Villa de Leyva, 5 al 8 de noviembre de 2026." (truncada a 155 en build si hace falta, con aserción).

## Contenido mínimo por página (texto rastreable)

- **Ficha**: h1 nombre; credencial; foto (misma pipeline de `astro:assets`, `alt` = nombre); biografía completa; obras y enlaces (si existen); "En el encuentro": sesiones con día, hora, sede y enlace a `/programacion/#slug`; CTA a `/#boletas`; migas. Bloque fijo de hechos del evento (InnerLayout).
- **Índice de panelistas**: h1; los 12 con foto, nombre, credencial y enlace; CTA.
- **Programación**: h1; "Actualizado el <lastmod>"; una sección por día con `id` (`jueves-5`, `viernes-6`, `sabado-7`, `domingo-8`) y una fila por sesión con `id` = `slot.slug`, hora, título, sede (enlace a mapa), tipo (entrada libre o con boleta), panelistas enlazados a su ficha, nota; botón de compra en las de boleta (mismo CtaButton). Precios y etapas en texto plano desde `ticketOffers` y `salesStages`.
- **Charlas abiertas**: h1; qué son, cuándo, dónde (Casa Museo con dirección y mapa), condiciones de ingreso (desde `faqs`: si requieren inscripción), lista de charlas con hora y presentador; enlace a los conversatorios con boleta y CTA.
- **Cómo llegar**: rutas desde Bogotá y Tunja (carretera y bus, tiempos), parqueaderos, las dos sedes con dirección, coordenadas y mapa, distancia entre sedes. Fuentes públicas verificables; nada de horarios de bus concretos sin fuente.
- **Dónde dormir**: solo con la lista entregada por Carolina (≥ 6, con enlace y distancia aproximada).

## Enlaces internos

- Portada: cada `SpeakerCard` enlaza nombre y foto a su ficha; la sección Agenda enlaza a `/programacion/` ("Ver la programación completa") y las charlas a `/charlas-abiertas/`; las FAQ de cómo llegar y hospedaje enlazan a las páginas nuevas cuando existan. El header conserva las anclas actuales (decisión de no rediseñar la navegación); el footer gana enlaces a Panelistas, Programación y Charlas abiertas.
- Páginas interiores: `InnerLayout` con migas, título en bloque de color (fórmula visual) y el bloque de hechos al pie; header `solid`.

## Metadatos (`EventLayout`)

- `title`, `description` con aserciones de longitud en build (`src/seo/meta.ts`).
- `robots`: `index, follow, max-image-preview:large, max-snippet:-1` por defecto; `noindex, follow` en legales (prop `noindex` pasa a emitir `noindex, follow`); `noindex` en 404.
- `og:type`: `website` en portada, `article` no (se mantiene `website`); `og:image` por página; `og:image:alt` por página. Las fichas añaden `profile:first_name`/`profile:last_name` no (innecesario).

## Sitemap (`src/pages/sitemap.xml.ts`)

- Lee `routes` y emite `<url>` con `<loc>` y `<lastmod>` = `route.lastmod` (fecha de contenido, no de build). Sin legales ni 404.
- Se conserva la URL `https://testigosdelamemoria.com/sitemap.xml` ya enviada a Search Console (sin pasar a sitemap-index).

## robots.txt

```
User-agent: *
Allow: /

# Rastreadores de búsqueda y respuesta de asistentes de IA
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: bingbot
User-agent: Googlebot
Allow: /

Sitemap: https://testigosdelamemoria.com/sitemap.xml
```

No se bloquean GPTBot, ClaudeBot, Google-Extended ni CCBot (R-05).

## IndexNow (`.github/workflows/deploy.yml`)

Paso final del job `deploy`, tras `actions/deploy-pages`:

```yaml
- name: IndexNow
  run: |
    URLS=$(curl -s https://testigosdelamemoria.com/sitemap.xml | grep -o '<loc>[^<]*' | sed 's/<loc>//' | jq -R . | jq -s .)
    curl -s -o /dev/null -w '%{http_code}\n' -X POST https://api.indexnow.org/IndexNow \
      -H 'Content-Type: application/json; charset=utf-8' \
      -d "{\"host\":\"testigosdelamemoria.com\",\"key\":\"1b880322af30410c8832c1e6748dc455\",\"keyLocation\":\"https://testigosdelamemoria.com/1b880322af30410c8832c1e6748dc455.txt\",\"urlList\":$URLS}"
```

La clave ya es pública en la raíz (es su función); 200 o 202 = aceptado. Solo notifica a Bing y afines; Google sigue por sitemap y Search Console.

## Imágenes de vista previa (`brand/og/`)

- Plantilla `og-panelista.html` (foto en b/n con grano, nombre, credencial, "Testigos de la Memoria · Villa de Leyva, 5 al 8 de noviembre de 2026") y `og-pagina.html` (título de la página); `make.sh` acepta `panelista <slug>` y `pagina <ruta>` y escribe en `public/og/panelistas/` y `public/og/paginas/` con versión en el nombre (`-v1`). Requiere Chrome, como hoy.
- Regla de caché: cambiar la imagen exige subir la versión en el nombre (WhatsApp).

## Preload de la imagen principal (portada)

- Desde el 2026-09-18 la imagen principal es el mosaico de caras del hero (doce retratos de `speakers.ts`), no la foto de la calle.
- `Hero.astro`: cada tile lleva `<Image priority src={speaker.photo} widths={[200, 320, 480]} sizes="(max-width: 63.9rem) 25vw, 14vw" />`.
- `EventLayout` (solo con `hero`): `getImage({ src: <primer retrato>, widths: [200, 320, 480], format: 'webp' })` → `<link rel="preload" as="image" href={img.src} imagesrcset={img.srcSet.attribute} imagesizes="(max-width: 63.9rem) 25vw, 14vw" fetchpriority="high">`. Se precarga solo el primer retrato. Los `widths` y `sizes` deben ser idénticos a los de las `<img>`; la constante compartida `heroTile` en `src/seo/hero.ts` los fija una sola vez.
