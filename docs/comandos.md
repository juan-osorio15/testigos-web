# Comandos

Todos se corren en la carpeta `testigos-web`.

## Sitio

### `npm run dev`
Levanta el sitio en local en http://localhost:4321.
- `PUBLIC_PRETIX_EVENT_URL=https://pretix.eventalist.co/eventalist/testigos-sandbox/ npm run dev`: el sitio local con la tienda del evento de prueba (sandbox).

### `npm run build`
Construye el sitio y exporta los hechos del evento en `dist/datos/evento.json`. Correrlo cuando un script pida datos más nuevos.
- `npm run build && npm run preview`: construye y sirve el resultado como en producción.

### `npm run check`
Revisa los tipos del sitio. Va junto con `npm run build` antes de entregar un cambio.

### `npm run preview`
Sirve la carpeta `dist/` como en producción.

### `npm install`
Instala las dependencias (primera vez o tras cambiar `package.json`).
- `npm ci`: instalación limpia, idéntica al `package-lock.json`.

## Textos para pegar

### `npm run verificar`
Coteja con la fuente las plantillas de correo y los textos que se pegan a mano (Pretix, chatbot, WhatsApp, Google Ads).
- `npm run verificar -- RUTA.md [RUTA2.md…]`: revisa solo esos archivos.
- `npm run verificar -- --casos`: comprueba que siga detectando los errores históricos.

## Campañas

### `python3 scripts/campanas/campana.py lista <campaña>`
Arma la lista con los datos del momento y dice cuántos quedaron y cuántos salieron y por qué. No envía nada.
- Campañas: `expirados`, `interesados`, `compradores`, `agenda-fernando`.
- `--dias N`: solo las personas de los últimos N días.
- `--excluir correo-o-telefono`: deja a alguien por fuera (se puede repetir).

### `python3 scripts/campanas/campana.py correo <campaña>`
Vista previa del correo (queda en `~/Documents/eventalist/datos/<evento>/previas-<campaña>/`). Sin `--enviar` no sale nada.
- `--prueba tu@correo.com --enviar`: un solo correo de muestra a esa dirección.
- `--enviar`: envío real.
- `--ignorar-horario`: envía fuera del horario de la Ley 2300; solo por decisión explícita del titular.
- `--lista ARCHIVO.csv`: usa una lista ya guardada en vez de armarla.
- `--dias N` y `--excluir`: igual que en `lista`.
- `agenda-fernando`: 100 por día en el plan gratis de Resend; se repite el mismo comando cada día y sigue con los que faltan.

### `python3 scripts/campanas/campana.py whatsapp <campaña>`
Vista previa del WhatsApp por la API de Meta, sin respond.io (el texto sale en la terminal).
- `--prueba 57XXXXXXXXXX --enviar`: un solo mensaje de muestra a ese número.
- `--enviar`: envío real.
- `--ignorar-horario`, `--lista`, `--dias` y `--excluir`: igual que en `correo`.

### `python3 scripts/campanas/campana.py respondio <campaña>`
Arma el CSV de importación de respond.io en `~/Downloads`, solo con quien autorizó WhatsApp, con la etiqueta y la fecha (`expirados-25102026`).
- `respondio expirados` y `respondio interesados`: listas para broadcasts.
- `respondio compradores`: compradores como Customer (todo teléfono, sin mirar la autorización). Opcional: casi ningún comprador está en respond.io. Si se usa, importar con Purpose "Update existing contacts only" e identificador Phone, para no crear contactos nuevos.
- `--salida RUTA.csv`: guarda el archivo en otra parte.
- `--dias N` y `--excluir`: igual que en `lista`.

### `python3 scripts/campanas/campana.py registro`
Cuenta los envíos por día, campaña, canal y tipo, sin datos de personas.
- `registro <campaña>`: solo esa campaña.

### `npm run campana -- <acción> <campaña> [opciones]`
Atajo del mismo `campana.py`; acepta todo lo anterior.

## Informes

### `npm run informe -- informes/<carpeta>`
Arma la presentación del informe al cliente (HTML y PDF) con las exportaciones de GA4, Meta y Pretix de esa carpeta.
- `--resumen`: solo imprime los datos leídos en JSON, para escribir las lecturas; no arma diapositivas.
- `--sin-pdf`: solo el HTML.

## Imágenes para compartir

### `npm run og:portada`
Regenera la imagen de vista previa de la portada (`public/og/og-image-vN.png`). Si cambia el diseño, subir la versión en `brand/og/make.sh` y en `src/layouts/EventLayout.astro`.

### `npm run og -- panelistas`
Regenera las imágenes de vista previa de todos los panelistas (`public/og/`).
- `npm run og -- panelistas <slug>`: solo ese panelista.
- `npm run og -- paginas`: las de las páginas interiores.

## Pretix

### `npm run boleta`
Regenera el fondo en PDF y el `layout.json` de la boleta (`brand/pretix/`). Después se suben a Pretix a mano.

### `npm run escarapela`
Regenera los fondos y el `layout.json` de las escarapelas de las tres categorías. Después se suben a Pretix a mano.
- `npm run escarapela -- panelista`, `-- staff` o `-- prensa`: solo esa categoría (se pueden poner varias).
- `CHROME=/ruta/a/chrome npm run escarapela`: otra ruta de Chrome (sirve igual para `boleta`, `og` y `og:portada`).

### `security add-generic-password -a "$USER" -s eventalist-pretix -w`
Guarda en el llavero el token de Pretix del equipo `lectura-campanas` (lo pide; pegarlo y Enter).
- `-s eventalist-backend-lectura`: token de lectura del backend.
- `-s eventalist-resend`: llave de Resend.
- `-s eventalist-whatsapp`: token de WhatsApp.
- `-s eventalist-whatsapp-cuenta`: identificador de la cuenta de WhatsApp.

## Comprobaciones en producción

### `curl -sI https://testigosdelamemoria.com`
Muestra los encabezados de la respuesta del sitio publicado.
- `curl -s https://testigosdelamemoria.com/robots.txt`: revisa los agentes permitidos y el sitemap.
- `curl -s https://testigosdelamemoria.com/programacion/ | grep -c 'id="'`: cuenta las anclas de la programación (al menos 17).
