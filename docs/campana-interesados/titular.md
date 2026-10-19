# Mandar el aviso de las franjas a los interesados

Pasos para el titular. Contexto y textos en `plan.md`; cómo funcionan los comandos, en `docs/campanas/README.md`. Todo se corre en la terminal de VS Code, en la carpeta `testigos-web`. Ya están listas las llaves de la campaña de expirados (Resend, Pretix, WhatsApp) y la del backend en el llavero. Tú siempre quedas al final de la lista y recibes cada envío real.

## Paso 1. Pedirle a Meta la plantilla de WhatsApp (una sola vez, ya)

Así está aprobada para cuando toque el WhatsApp.

- [ ] Entrar a `https://business.facebook.com/wa/manage/message-templates/` → **Crear plantilla**.
- [ ] Categoría **Marketing**. Nombre `aviso_boletas_medio_dia`. Idioma **Español**.
- [ ] Copiar el cuerpo, el pie y los dos botones exactos de la sección 5 de `plan.md`.
- [ ] Enviar a revisión.

## Paso 2. Ver la lista

```sh
python3 scripts/campanas/campana.py lista interesados
```

- [ ] Leer el resumen: cuántos se inscribieron, cuántos ya compraron o expiraron (no se contactan aquí), cuántos quedan y cuántos tienen correo y WhatsApp. La lista queda en `~/Documents/eventalist/datos/testigos-memoria/interesados-<fecha-hora>.csv` por si quieres abrirla.

Este paso es solo para mirar: los comandos de envío vuelven a armar la lista en el momento.

## Paso 3. Correo

### 3a. Ver cómo queda (no envía nada)

```sh
python3 scripts/campanas/campana.py correo interesados
```

- [ ] Abrir con el navegador cualquier archivo de `~/Documents/eventalist/datos/testigos-memoria/previas-interesados/` y revisar el texto y el saludo con el nombre.

### 3b. Mandarte una prueba

En horario de la Ley 2300 (lunes a viernes de 7:00 a. m. a 7:00 p. m., sábados de 8:00 a. m. a 3:00 p. m.; nunca domingos ni festivos). Fuera de ese horario no envía.

```sh
export RESEND_API_KEY=re_...
python3 scripts/campanas/campana.py correo interesados --prueba tu@correo.com --enviar
```

- [ ] Revisar en el celular y en el computador: que caiga en **Principal** y no en Promociones ni en spam, que se vea bien y que el botón **Escoger mi franja** abra la tienda.

### 3c. Enviar de verdad

```sh
python3 scripts/campanas/campana.py correo interesados --enviar
```

- [ ] Debe decir "Enviado a ..." una vez por persona y al final cuántos salieron.
- [ ] Si se corre otra vez, no repite a nadie.
- [ ] Si la lista pasa de 100, Resend frena en el correo 100 del día y el comando se detiene. Al día siguiente, el mismo comando sigue con los que faltan.

## Paso 4. WhatsApp (otro día, con la plantilla aprobada)

Puede salir el mismo día del correo o después; no hay límite de mensajes por persona.

```sh
export WHATSAPP_TOKEN=...
export WHATSAPP_WABA_ID=...
python3 scripts/campanas/campana.py whatsapp interesados
```

- [ ] Revisar el texto que muestra. Si dice que la plantilla no está aprobada, esperar a Meta.
- [ ] Prueba a tu número (57 adelante, sin `+` ni espacios), en horario:

```sh
python3 scripts/campanas/campana.py whatsapp interesados --prueba 57XXXXXXXXXX --enviar
```

- [ ] En el celular: que el botón **Ver boletas** abra la tienda y que, al tocar **Tengo una pregunta**, Tevit conteste algo con sentido.
- [ ] Enviar de verdad:

```sh
python3 scripts/campanas/campana.py whatsapp interesados --enviar
```

Quien compró después del correo ya no sale. Si Meta rechaza un número, queda como fallido y sigue con los demás.

## Paso 5. Después

- [ ] Quien responda BAJA o "no me interesa", por correo o por WhatsApp: marcarlo en el admin del backend (acciones **Opt out of email**, **Opt out of WhatsApp** o **Mark as do-not-contact**). Desde ahí ninguna campaña lo vuelve a sacar.
- [ ] Para ver cuántos salieron: `python3 scripts/campanas/campana.py registro interesados`.
- [ ] A los 7 días: `python3 scripts/campanas/campana.py lista interesados`. Quien compró ya no sale. En GA4, las visitas y compras con `utm_campaign=interesados`.
- [ ] Los archivos de `~/Documents/eventalist/datos/` tienen datos personales: nunca se suben a ningún repo.
