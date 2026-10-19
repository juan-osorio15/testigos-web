# Mandar el correo a los pedidos expirados con Resend

> **Histórico.** Este correo se envió el 12 de octubre de 2026 con los scripts de entonces, que ya no existen. El paso 1 (la llave de Resend) sigue valiendo. Hoy las campañas se mandan con `scripts/campanas/campana.py` (`docs/campanas/README.md`), y el correo de expirados está desactivado en `scripts/campanas/config/expirados.json` porque su texto habla del último día de la etapa 1.

Resend es el servicio que ya usa Pretix para mandar los correos de la tienda. El dominio `eventalist.co` ya está verificado ahí y el plan gratis da 100 correos al día, de sobra para 7. No hay que conectar nada nuevo: solo sacar una llave para el script.

Contexto y textos en `../plan.md`. Se usa la plantilla con forma de pedido, que fue la que llegó a Principal en Gmail (ver sección 5 del plan).

## Paso 1. Sacar una llave de Resend (una sola vez)

- [x] Entrar a `https://resend.com/login` con la cuenta de Eventalist donde está el dominio `eventalist.co` (es la misma que se usó para el correo de Pretix).
- [x] Ir a **Domains** y confirmar que `eventalist.co` aparece como **Verified**. Si no aparece verificado, parar y avisar.
- [x] Ir a **API Keys** → **Create API Key**.
  - Name: `campanas-correo`
  - Permission: **Sending access**
  - Domain: `eventalist.co`
- [x] Copiar la llave (empieza por `re_`). Resend solo la muestra una vez. Guardarla en el gestor de contraseñas, no en chats ni documentos.

La llave de Pretix no se toca: esta es otra, aparte, y se puede borrar cuando termine la campaña.

## Paso 2. Confirmar que hola@eventalist.co recibe respuestas

- [x] Desde un correo personal, escribirle a `hola@eventalist.co` y confirmar que llega. Las respuestas de los compradores van a llegar ahí.

## Paso 3. Sacar la lista actualizada (el día del envío)

- [x] En Pretix: evento `testigos-memoria` → **Pedidos** → **Exportar** → **Lista de pedidos** → formato CSV. Queda en Descargas como `testigos-memoria_orders.csv`.
- [x] En la terminal de VS Code, en la carpeta `testigos-web`:

```sh
python3 scripts/pretix/expirados_sin_compra.py ~/Downloads/testigos-memoria_orders.csv -o ~/Downloads/expirados-hoy.csv --desde 2026-10-09
```

- [ ] Leer el resumen: cuántas personas quedan a contactar. Si alguien compró desde la última vez, ya no sale.
- [ ] Tú siempre quedas en la lista (última fila, `prueba = si`, pedido `PRUEBA`), así recibes cada envío real. Sale del archivo `scripts/pretix/incluir.local.csv`, que está solo en este computador (git lo ignora porque el repo es público). Para sumar a alguien más del equipo, agregarle una fila con `nombre,correo,telefono`.

## Paso 4. Ver cómo queda el correo (no envía nada)

```sh
python3 scripts/correo/enviar_resend.py ~/Downloads/expirados-hoy.csv --plantilla scripts/correo/plantillas/expirado-pedido.html --asunto "Tu pedido {{codigo}} de Testigos de la Memoria" --remitente "Juan de Testigos de la Memoria <hola@eventalist.co>" --sin-cabecera-baja --grupo todos --previas ~/Downloads/previas-expirados --registro ~/Downloads/envios-expirados.csv
```

- [ ] Abrir cualquiera de los archivos de `~/Downloads/previas-expirados/` con el navegador y revisar el texto.

## Paso 5. Mandarte una prueba a ti

Fuera del horario de la Ley 2300 (lunes a viernes de 7:00 a. m. a 7:00 p. m., sábados de 8:00 a. m. a 3:00 p. m.; no domingos ni festivos) el script no envía, salvo que se le agregue `--ignorar-horario` al final. **Envío del 12 de octubre de 2026:** es festivo y la etapa 1 termina a la medianoche; el titular decidió enviar hoy, así que los comandos de los pasos 5 y 6 llevan `--ignorar-horario`. En otro envío, quitarlo.

- [ ] En la misma terminal, cargar la llave solo para esta sesión (pegarla donde dice `re_...`):

```sh
export RESEND_API_KEY=re_...
```

- [ ] Mandarte un solo correo de muestra, con el código de un pedido real (cambia `tu@correo.com`):

```sh
python3 scripts/correo/enviar_resend.py ~/Downloads/expirados-hoy.csv --plantilla scripts/correo/plantillas/expirado-pedido.html --asunto "Tu pedido {{codigo}} de Testigos de la Memoria" --remitente "Juan de Testigos de la Memoria <hola@eventalist.co>" --sin-cabecera-baja --grupo todos --previas ~/Downloads/previas-expirados --registro ~/Downloads/envios-expirados.csv --prueba tu@correo.com --enviar --ignorar-horario
```

- [ ] Revisar en el celular y en el computador: que se vea bien, que el botón "Ver boletas" abra la tienda y que no haya caído en spam.

## Paso 6. Enviar de verdad

- [ ] El mismo comando del paso 5 **sin** `--prueba tu@correo.com`:

```sh
python3 scripts/correo/enviar_resend.py ~/Downloads/expirados-hoy.csv --plantilla scripts/correo/plantillas/expirado-pedido.html --asunto "Tu pedido {{codigo}} de Testigos de la Memoria" --remitente "Juan de Testigos de la Memoria <hola@eventalist.co>" --sin-cabecera-baja --grupo todos --previas ~/Downloads/previas-expirados --registro ~/Downloads/envios-expirados.csv --enviar --ignorar-horario
```

- [ ] Debe decir "Enviado a ..." una vez por persona. Si se corre otra vez por error, no repite a nadie (lo evita el registro `envios-expirados.csv`).
- [ ] En Resend → **Emails** se ve cada correo con su estado (Delivered, Bounced).

## Paso 7. Después

- [ ] Quien responda BAJA o "no me interesa": anotarlo y no volver a escribirle por ningún canal.
- [ ] Cuando termine la campaña: Resend → **API Keys** → borrar `campanas-correo`.
- [ ] Los archivos de Descargas (`expirados-hoy.csv`, `envios-expirados.csv`, `previas-expirados`) tienen datos personales: borrarlos cuando ya no se necesiten. Nunca se suben al repo.
