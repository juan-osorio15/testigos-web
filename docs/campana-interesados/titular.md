# Mandar el aviso de las franjas a los interesados

Pasos para el titular. Contexto y textos en `plan.md`. Todo se corre en la terminal de VS Code, en la carpeta `testigos-web`. Se reutiliza lo que ya quedó listo para la campaña de expirados: la llave de Resend, el token de Pretix en el llavero, el token de WhatsApp y `scripts/pretix/incluir.local.csv` (tú siempre quedas al final de la lista y recibes cada envío real).

## Paso 1. Pedirle a Meta la plantilla de WhatsApp (una sola vez, hoy)

Así está aprobada para cuando toque el WhatsApp.

- [ ] Entrar a `https://business.facebook.com/wa/manage/message-templates/` → **Crear plantilla**.
- [ ] Categoría **Marketing**. Nombre `aviso_boletas_medio_dia`. Idioma **Español**.
- [ ] Copiar el cuerpo, el pie y los dos botones exactos de la sección 5 de `plan.md`.
- [ ] Enviar a revisión.

## Paso 2. Sacar la lista del día

### Mientras el backend no tenga el endpoint de lectura

- [ ] Entrar al admin del backend: `https://eventalist-backend-production.up.railway.app/admin/marketing/marketingcontact/`.
- [ ] En los filtros de la derecha: **By campaigns** → `testigos-de-la-memoria-2026` y **By source** → **Website**.
- [ ] Marcar la casilla de arriba de la lista y, si aparece, **Select all**. En **Action**, escoger **Export selected contacts as CSV (no consent filter)** → **Go**. Queda en Descargas como `contacts-selected-testigos-de-la-memoria-2026-<fecha>.csv`.
- [ ] Correr:

```sh
python3 scripts/backend/interesados_sin_compra.py --csv ~/Downloads/contacts-selected-testigos-de-la-memoria-2026-*.csv --evento testigos-memoria
LISTA=$(ls -t ~/Documents/eventalist/datos/testigos-memoria/interesados-*.csv | head -1)
```

- [ ] Borrar el archivo de Descargas: `rm ~/Downloads/contacts-selected-testigos-de-la-memoria-2026-*.csv`. La lista que sirve ya quedó en `~/Documents/eventalist/datos/`.

### Cuando el backend tenga el endpoint (prompt en `prompt-backend.md`)

Una sola vez, guardar el token de lectura que entregue el backend en el llavero (pide el token; pegarlo y Enter):

```sh
security add-generic-password -a "$USER" -s eventalist-backend-lectura -w
```

Y desde ahí, sin pasar por el admin ni por Descargas:

```sh
python3 scripts/backend/interesados_sin_compra.py --evento testigos-memoria
LISTA=$(ls -t ~/Documents/eventalist/datos/testigos-memoria/interesados-*.csv | head -1)
```

### En los dos casos

- [ ] Leer el resumen: cuántos se inscribieron, cuántos ya compraron o expiraron (no se contactan), cuántos quedan y cuántos tienen correo y WhatsApp.
- [ ] La segunda línea guarda en `LISTA` la lista recién sacada; los comandos de abajo la usan. Si se abre otra terminal, volver a correr esa línea.
- [ ] Si quieres incluir también a la lista general de la preventa (inscritos antes del 9 de septiembre), agregar `--desde 2026-08-01` al primer comando.

## Paso 3. Correo

### 3a. Ver cómo queda (no envía nada)

```sh
python3 scripts/correo/enviar_resend.py "$LISTA" --plantilla scripts/correo/plantillas/interesado-aviso.html --asunto "Tu aviso de Testigos de la Memoria: ya abrieron las boletas de medio día" --remitente "Juan de Testigos de la Memoria <hola@eventalist.co>" --sin-cabecera-baja --grupo todos --previas ~/Documents/eventalist/datos/testigos-memoria/previas-interesados --registro ~/Documents/eventalist/datos/testigos-memoria/envios-correo-interesados.csv
```

- [ ] Abrir con el navegador cualquier archivo de `~/Documents/eventalist/datos/testigos-memoria/previas-interesados/` y revisar el texto y el saludo con el nombre.

### 3b. Mandarte una prueba

En horario de la Ley 2300 (lunes a viernes de 7:00 a. m. a 7:00 p. m., sábados de 8:00 a. m. a 3:00 p. m.; nunca domingos ni festivos). Fuera de ese horario el script no envía.

- [ ] Cargar la llave de Resend solo para esta terminal:

```sh
export RESEND_API_KEY=re_...
```

- [ ] El mismo comando con `--prueba` y tu correo, y `--enviar`. La muestra sale con tu propio saludo:

```sh
python3 scripts/correo/enviar_resend.py "$LISTA" --plantilla scripts/correo/plantillas/interesado-aviso.html --asunto "Tu aviso de Testigos de la Memoria: ya abrieron las boletas de medio día" --remitente "Juan de Testigos de la Memoria <hola@eventalist.co>" --sin-cabecera-baja --grupo todos --previas ~/Documents/eventalist/datos/testigos-memoria/previas-interesados --registro ~/Documents/eventalist/datos/testigos-memoria/envios-correo-interesados.csv --prueba tu@correo.com --enviar
```

- [ ] Revisar en el celular y en el computador: que caiga en **Principal** y no en Promociones ni en spam, que se vea bien y que el botón **Escoger mi franja** abra la tienda.

### 3c. Enviar de verdad

- [ ] El mismo comando **sin** `--prueba tu@correo.com`:

```sh
python3 scripts/correo/enviar_resend.py "$LISTA" --plantilla scripts/correo/plantillas/interesado-aviso.html --asunto "Tu aviso de Testigos de la Memoria: ya abrieron las boletas de medio día" --remitente "Juan de Testigos de la Memoria <hola@eventalist.co>" --sin-cabecera-baja --grupo todos --previas ~/Documents/eventalist/datos/testigos-memoria/previas-interesados --registro ~/Documents/eventalist/datos/testigos-memoria/envios-correo-interesados.csv --enviar
```

- [ ] Debe decir "Enviado a ..." una vez por persona. Si se corre otra vez por error, no repite a nadie (lo evita el registro).
- [ ] Resend tiene un límite de 100 correos al día en el plan gratis. Si la lista pasa de 100, el script se detiene con el error de Resend: correr el mismo comando al día siguiente y sigue con los que faltan.

## Paso 4. WhatsApp (otro día, con la plantilla aprobada)

- [ ] Sacar la lista de nuevo (paso 2): quien compró con el correo ya no sale.
- [ ] Cargar las llaves de WhatsApp solo para esta terminal:

```sh
export WHATSAPP_TOKEN=...
export WHATSAPP_WABA_ID=...
```

- [ ] Ver cómo queda (no envía nada):

```sh
python3 scripts/whatsapp/enviar_plantilla.py "$LISTA" --plantilla aviso_boletas_medio_dia --grupo todos --registro ~/Documents/eventalist/datos/testigos-memoria/envios-whatsapp.csv
```

- [ ] Prueba a tu número (57 adelante, sin `+` ni espacios), en horario:

```sh
python3 scripts/whatsapp/enviar_plantilla.py "$LISTA" --plantilla aviso_boletas_medio_dia --grupo todos --registro ~/Documents/eventalist/datos/testigos-memoria/envios-whatsapp.csv --prueba 57XXXXXXXXXX --enviar
```

- [ ] Revisar en el celular que el botón **Ver boletas** abra la tienda y que, al tocar **Tengo una pregunta**, Tevit conteste algo con sentido.
- [ ] Enviar de verdad: el mismo comando **sin** `--prueba 57XXXXXXXXXX`.

El registro de WhatsApp es el mismo archivo de expirados: queda todo junto, con la plantilla en cada fila.

## Paso 5. Después

- [ ] Quien responda BAJA o "no me interesa", por correo o por WhatsApp: marcarlo en el admin del backend (acciones **Opt out of email** / **Opt out of WhatsApp**, o **Mark as do-not-contact**). Así el script no lo vuelve a sacar en ninguna campaña.
- [ ] Nada de un tercer mensaje.
- [ ] A los 7 días: correr el paso 2 otra vez. Quien compró ya no sale. En GA4, las visitas y compras con `utm_campaign=interesados`.
- [ ] Los archivos de `~/Documents/eventalist/datos/` tienen datos personales: nunca se suben a ningún repo.
