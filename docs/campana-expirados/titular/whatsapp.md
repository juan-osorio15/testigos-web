# Mandar el WhatsApp a los pedidos expirados

La plantilla `pedido_expirado_ayuda` ya está aprobada por Meta (2026-10-16). Se envía con `scripts/whatsapp/enviar_plantilla.py`, que habla directo con la API de WhatsApp de Meta (Cloud API), número por número, con el código de pedido de cada persona. Contexto y reglas en `../plan.md`.

Solo va a quien hizo el pedido desde el 2026-10-09 (columna `desde_fecha = si` de la lista): la casilla anterior no autorizaba WhatsApp. El script toma solo esas filas.

Por qué así: WhatsApp Manager no tiene un botón de "enviar a una lista" para números conectados a la API. Meta lo resuelve con la API, y para usarla hace falta un usuario del sistema: una cuenta sin persona detrás, dentro del portafolio, cuyo token le da al script permiso de enviar desde el número. Tevit no se toca: las respuestas le siguen llegando a Tevit y el chatbot las atiende como siempre.

## Paso 1. Dar permiso de envío (una sola vez)

Todo con la cuenta de Facebook que administra el portafolio "Testigos de la Memoria".

### 1a. Crear una app de Meta

El token siempre va atado a una app. Esta es solo para las campañas; no recibe mensajes ni cambia nada de Tevit.

- [ ] Entrar a `https://developers.facebook.com/apps/` → **Crear app**.
- [ ] Caso de uso: **Otro** → tipo **Negocio** (Business).
- [ ] Nombre: `eventalist-campanas`. Portafolio comercial: **Testigos de la Memoria**.
- [ ] Dentro de la app, en **Agregar productos**, buscar **WhatsApp** → **Configurar**. Si pide escoger una cuenta de WhatsApp Business, escoger la del encuentro.
- [ ] **No** tocar Webhooks ni registrar el número desde esta app. El número ya está registrado y sus mensajes entrantes van a Tevit; si se cambia eso, Tevit deja de recibirlos.

### 1b. Crear el usuario del sistema

- [ ] Entrar a `https://business.facebook.com/settings/system-users` (Configuración del negocio → Usuarios → **Usuarios del sistema**), con el portafolio Testigos de la Memoria elegido arriba.
- [ ] **Agregar**. Nombre: `campanas`. Rol: **Empleado**.
- [ ] Con `campanas` seleccionado → **Asignar activos**:
  - **Apps** → `eventalist-campanas` → **Control total** (o "Desarrollar app").
  - **Cuentas de WhatsApp** → la del encuentro → **Control total**.
- [ ] Guardar.

### 1c. Sacar el token

- [ ] En el mismo usuario `campanas` → **Generar token**.
- [ ] App: `eventalist-campanas`.
- [ ] Caducidad: **60 días** (la campaña es corta; si se necesita después, se genera otro).
- [ ] Permisos: marcar solo `whatsapp_business_messaging` (enviar) y `whatsapp_business_management` (leer la plantilla y el número).
- [ ] Copiar el token. Meta lo muestra una sola vez. Guardarlo en el gestor de contraseñas, nunca en chats, documentos ni en el repo.

### 1d. Copiar el identificador de la cuenta de WhatsApp

- [ ] Entrar a `https://business.facebook.com/wa/manage/home/`. Arriba, junto al nombre de la cuenta de WhatsApp del encuentro, aparece su identificador (un número largo). Copiarlo.

El identificador del número no hace falta: el script lo busca solo en esa cuenta.

## Paso 2. Sacar la lista del día

El script le pide los pedidos directamente a Pretix: no hay que exportar ni borrar nada. Cada lista queda con la fecha y la hora en el nombre, en `~/Documents/eventalist/datos/testigos-memoria/`, fuera del repo.

### 2a. Token de Pretix (una sola vez)

- [ ] En Pretix: organizador **eventalist** → **Equipos** → **Crear equipo**.
  - Nombre: `lectura-campanas`.
  - Eventos: **Todos los eventos** (así sirve para los próximos).
  - Permisos: solo **Puede ver pedidos**. Nada de cambiar pedidos ni configuración.
- [ ] Guardar, entrar al equipo → pestaña **Tokens de la API** → crear uno llamado `campanas`. Copiarlo.
- [ ] Guardarlo en el llavero del Mac. En la terminal (pide el token; pegarlo y Enter, no se ve al escribir):

```sh
security add-generic-password -a "$USER" -s eventalist-pretix -w
```

Desde ahí el script lo toma solo, en cualquier terminal.

### 2b. Correr el script

Justo antes de enviar, no antes: alguien puede haber comprado desde la última vez. En la terminal de VS Code, en la carpeta `testigos-web`:

```sh
python3 scripts/pretix/expirados_sin_compra.py --evento testigos-memoria --desde 2026-10-09
LISTA=$(ls -t ~/Documents/eventalist/datos/testigos-memoria/expirados-*[0-9].csv | head -1)
```

- [ ] Leer el resumen: cuántas personas quedan y cuántas tienen pedido desde el 2026-10-09. Tu número va al final (`prueba = si`, pedido `PRUEBA`), así recibes el envío real.
- [ ] La segunda línea guarda en `LISTA` la lista recién sacada; los comandos de abajo la usan. Si se abre otra terminal, volver a correr esa línea.
- [ ] Al lado queda la versión corta, terminada en `-whatsapp.csv`: número, todos los códigos expirados y el último.

## Paso 3. Revisar a cada persona en Pretix

Por cada fila con `desde_fecha = si` (menos la tuya):

- [ ] Buscar en Pretix el último código de la columna `pedidos` y abrir el pedido.
- [ ] Confirmar que aceptó la casilla de la política `tienda-2026-10-09`. Si no, borrar esa fila de la lista.
- [ ] Confirmar en hola@eventalist.co que no pidió la baja después del correo del 12 de octubre. Si la pidió, borrar la fila.

Quien recibió el correo del 12 de octubre llega con este WhatsApp al segundo y último mensaje.

## Paso 4. Ver cómo queda (no envía nada)

- [ ] En la misma terminal, cargar las dos llaves solo para esta sesión (pegar donde dice `...`):

```sh
export WHATSAPP_TOKEN=...
export WHATSAPP_WABA_ID=...
```

- [ ] Correr:

```sh
python3 scripts/whatsapp/enviar_plantilla.py "$LISTA" --plantilla pedido_expirado_ayuda --registro ~/Documents/eventalist/datos/testigos-memoria/envios-whatsapp.csv
```

El script lee la plantilla en Meta, confirma que está aprobada y muestra el mensaje de cada persona con su código. Si dice que la plantilla no está en el idioma `es`, muestra en cuál está: repetir con `--idioma` y ese código (por ejemplo `--idioma es_CO`).

## Paso 5. Mandarte una prueba a ti

En horario (Ley 2300, hora de Bogotá): lunes a viernes de 7:00 a. m. a 7:00 p. m., sábados de 8:00 a. m. a 3:00 p. m.; nunca domingos ni festivos. Fuera de ese horario el script no envía.

- [ ] El mismo comando con tu número (57 adelante, sin `+` ni espacios) y `--enviar`:

```sh
python3 scripts/whatsapp/enviar_plantilla.py "$LISTA" --plantilla pedido_expirado_ayuda --registro ~/Documents/eventalist/datos/testigos-memoria/envios-whatsapp.csv --prueba 57XXXXXXXXXX --enviar
```

- [ ] Revisar en el celular:
  - Que llegue de Testigos de la Memoria, con el código de un pedido real.
  - Que el botón **Ver boletas** abra la tienda en la sección de boletas.
  - Que al tocar **Necesito ayuda**, Tevit conteste algo que tenga sentido. El chatbot recibe "Necesito ayuda" sin saber que viene de esta plantilla; si contesta mal, avisar antes de seguir.

Si algo falla, parar y avisar.

## Paso 6. Enviar de verdad

- [ ] El mismo comando **sin** `--prueba`:

```sh
python3 scripts/whatsapp/enviar_plantilla.py "$LISTA" --plantilla pedido_expirado_ayuda --registro ~/Documents/eventalist/datos/testigos-memoria/envios-whatsapp.csv --enviar
```

- [ ] Debe decir "Enviado a ..." una vez por persona y, al final, cuántos salieron y cuántos fallaron.
- [ ] Si Meta rechaza un número (no tiene WhatsApp, o Meta frena mensajes de marketing a esa persona), el script lo anota como fallido y sigue con los demás. Si rechaza el token, los permisos o la plantilla, se detiene sin enviar a nadie más.
- [ ] Si se corre otra vez por error, no repite a nadie (lo evita el registro). A los fallidos sí lo intenta otra vez: no correrlo de nuevo el mismo día solo por ellos.

Todo queda en `~/Documents/eventalist/datos/testigos-memoria/envios-whatsapp.csv`: fecha y hora, número, pedido, plantilla, si fue prueba, estado y el id de Meta. Cuando el backend tenga el registro de envíos, este archivo se importa allá.

## Paso 7. Después

- [ ] Las respuestas llegan a Tevit, como cualquier mensaje. Si alguien pide ayuda con el pago, atenderlo ahí y mandarle el enlace de compra (durante 24 horas desde su respuesta se le puede escribir libremente).
- [ ] Quien responda BAJA o "no me interesa": anotarlo y no volver a escribirle por ningún canal.
- [ ] Nada de un segundo WhatsApp.
- [ ] Cada mensaje de una plantilla de Marketing entregado lo cobra Meta a la cuenta de WhatsApp. Con pocas personas es poco, pero la cuenta necesita un método de pago en WhatsApp Manager; si no lo tiene, Meta rechaza el envío y el script se detiene.
- [ ] Los archivos de `~/Documents/eventalist/datos/` tienen datos personales: nunca se suben a ningún repo. Cuando el backend tenga el registro de envíos, `envios-whatsapp.csv` se importa allá; las listas viejas se pueden borrar cuando termine el evento.
- [ ] A los 7 días: nueva exportación y volver a correr el script de expirados. Quien compró ya no sale en la lista. En GA4, las visitas con `utm_source=whatsapp` y `utm_medium=recuperacion`.

## La plantilla aprobada, como referencia

Nombre `pedido_expirado_ayuda`, categoría Marketing, español. El script siempre usa el texto aprobado en Meta; este es solo para consulta.

```
Hola. Te escribimos del equipo de Testigos de la Memoria (Eventalist S.A.S.). Tu pedido {{1}} de boletas no alcanzó a completarse y la reserva se venció.

Del 6 al 8 de noviembre, en la Hospedería Duruelo, en lo alto de Villa de Leyva, Daniel Samper Pizano, Cecilia Orozco, Yolanda Ruiz, Fidel Cano y otros periodistas que cubrieron los últimos cincuenta años de Colombia cuentan en persona lo que vieron de cerca: el Bogotazo, el Caguán y La Habana, el narcotráfico, los magnicidios. Y responden tus preguntas.

¿Tuviste algún problema con el pago? Escríbenos por aquí y te ayudamos a terminar la compra.
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=recuperacion&utm_campaign=expirados-2026#boletas`
- Botón de respuesta rápida **Necesito ayuda**.
