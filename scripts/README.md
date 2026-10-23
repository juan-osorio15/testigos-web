# Herramientas

Todas se corren en la raíz del repo. Las que usan hechos del evento (precios, fechas, sede, panelistas) los leen de `dist/datos/evento.json`, que exporta `npm run build` desde `src/data/` y `src/config.ts`. Si la exportación falta o es más vieja que la fuente, se detienen y piden `npm run build`. Lo común vive en `scripts/lib/` (`hechos.py`, `hechos.mjs`, la ruta de Chrome).

Chrome: las que capturan HTML usan Google Chrome en su ruta de macOS; otra ruta va en la variable `CHROME`.

## Comprobación de vigencia

`npm run verificar` coteja con la fuente las plantillas de correo y los textos que se pegan a mano (Pretix, chatbot, WhatsApp, Google Ads). Detalle en `scripts/verificar/verificar.py`. Correrla antes de pegar o enviar un texto.

## Campañas de correo y WhatsApp

`npm run campana -- lista expirados` (y `correo`, `whatsapp`, `respondio`, `registro`). Código en `scripts/campanas/`; manual, comandos y preguntas de reunión en `docs/campanas/README.md`. Sin `--enviar` no envía nada.

## Informe al cliente

`npm run informe -- informes/<carpeta>` arma la presentación (HTML y PDF) con las exportaciones de GA4, Meta y Pretix. La carpeta `informes/` no se versiona. Qué exportar: `docs/medicion/embudo/titular/reportes-para-el-informe.md`.

## Imágenes para compartir

- `npm run og:portada`: la imagen de la portada (`public/og/og-image-vN.png`). Si cambia el diseño, subir la versión aquí y en `src/layouts/EventLayout.astro`.
- `npm run og -- panelistas [slug]` y `npm run og -- paginas`: las de cada panelista y de las páginas interiores (`public/og/`). Plantillas en `brand/og/`.

## Boleta y escarapela de Pretix

- `npm run boleta`: fondo en PDF y `layout.json` de la boleta (`brand/pretix/`). La sede y las fechas salen de la fuente.
- `npm run escarapela -- [panelista|staff|prensa]`: lo mismo para las escarapelas.

Después de regenerarlas hay que subirlas a Pretix a mano (ver `docs/copias-externas.md`).
