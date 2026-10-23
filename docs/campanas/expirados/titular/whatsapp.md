# Mandar el WhatsApp a los pedidos expirados

La plantilla `pedido_expirado_ayuda` ya está aprobada por Meta (2026-10-16). Se envía con `python3 scripts/campanas/campana.py whatsapp expirados`, que habla directo con la API de WhatsApp de Meta (Cloud API), número por número, con el código de pedido de cada persona. Contexto y reglas en `../plan.md`; cómo funciona el comando, en `docs/campanas/README.md`.

Solo va a quien autorizó WhatsApp: el comando le pregunta al backend, que guarda la casilla de la tienda (`tienda-2026-10-09`) de cada pedido desde el 9 de octubre y la del formulario del sitio. Antes de esa fecha la casilla de la tienda no autorizaba WhatsApp. Ya no hay que revisarlo a mano en Pretix.

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

## Paso 2. Ver la lista

El token de Pretix (equipo `lectura-campanas`, servicio `eventalist-pretix` en el llavero) y el del backend (servicio `eventalist-backend-lectura`) ya están guardados. Si algún día hay que volver a crear el de Pretix: organizador **eventalist** → **Equipos** → equipo con solo **Puede ver pedidos** en todos los eventos → pestaña **Tokens de la API**, y guardarlo con `security add-generic-password -a "$USER" -s eventalist-pretix -w`.

En la terminal de VS Code, en la carpeta `testigos-web`:

```sh
python3 scripts/campanas/campana.py lista expirados
```

- [ ] Leer el resumen: cuántas personas quedan y cuántas tienen WhatsApp autorizado. Tu número va al final, con el pedido `PRUEBA`, así recibes el envío real.

Es solo para mirar: el comando de envío vuelve a armar la lista en el momento, por si alguien compró.

## Paso 3. Revisar las bajas

- [ ] Confirmar en hola@eventalist.co que nadie de la lista pidió la baja después del correo del 12 de octubre. Si alguien la pidió, marcarlo en el admin del backend (**Opt out of WhatsApp** o **Mark as do-not-contact**) y volver al paso 2.

Desde el 19 de octubre no hay límite de mensajes por persona: el WhatsApp le llega también a quien recibió los correos. El comando solo evita repetir el mismo mensaje.

## Paso 4. Ver cómo queda (no envía nada)

- [ ] En la misma terminal, cargar las dos llaves solo para esta sesión (pegar donde dice `...`):

```sh
export WHATSAPP_TOKEN=...
export WHATSAPP_WABA_ID=...
```

- [ ] Correr:

```sh
python3 scripts/campanas/campana.py whatsapp expirados
```

El comando lee la plantilla en Meta, confirma que está aprobada y muestra el mensaje de cada persona con su código. Si dice que la plantilla no está en el idioma `es`, cambiar `idioma` en `scripts/campanas/config/expirados.json` por el que muestra (por ejemplo `es_CO`).

## Paso 5. Mandarte una prueba a ti

En horario (Ley 2300, hora de Bogotá): lunes a viernes de 7:00 a. m. a 7:00 p. m., sábados de 8:00 a. m. a 3:00 p. m.; nunca domingos ni festivos. Fuera de ese horario no envía.

- [ ] Con tu número (57 adelante, sin `+` ni espacios):

```sh
python3 scripts/campanas/campana.py whatsapp expirados --prueba 57XXXXXXXXXX --enviar
```

- [ ] Revisar en el celular:
  - Que llegue de Testigos de la Memoria, con el código `PRUEBA`.
  - Que el botón **Ver boletas** abra la tienda en la sección de boletas.
  - Que al tocar **Necesito ayuda**, Tevit conteste algo que tenga sentido. El chatbot recibe "Necesito ayuda" sin saber que viene de esta plantilla; si contesta mal, avisar antes de seguir.

Si algo falla, parar y avisar.

## Paso 6. Enviar de verdad

```sh
python3 scripts/campanas/campana.py whatsapp expirados --enviar
```

- [ ] Debe decir "Enviado a ..." una vez por persona y, al final, cuántos salieron y cuántos fallaron.
- [ ] Si Meta rechaza un número (no tiene WhatsApp, o Meta frena mensajes de marketing a esa persona), queda como fallido y sigue con los demás. Si rechaza el token, los permisos o la plantilla, se detiene sin enviar a nadie más.
- [ ] Si se corre otra vez, no repite a nadie. A los fallidos sí lo intenta otra vez: no correrlo de nuevo el mismo día solo por ellos.

Todo queda en el registro único, `~/Documents/eventalist/datos/registro-envios.csv`. Para ver los totales: `python3 scripts/campanas/campana.py registro expirados`.

## Paso 7. Después

- [ ] Las respuestas llegan a Tevit, como cualquier mensaje. Si alguien pide ayuda con el pago, atenderlo ahí y mandarle el enlace de compra (durante 24 horas desde su respuesta se le puede escribir libremente).
- [ ] Quien responda BAJA o "no me interesa": marcarlo en el admin del backend y no volver a escribirle por ningún canal.
- [ ] Nada de un segundo WhatsApp.
- [ ] Cada mensaje de una plantilla de Marketing entregado lo cobra Meta a la cuenta de WhatsApp. Con pocas personas es poco, pero la cuenta necesita un método de pago en WhatsApp Manager; si no lo tiene, Meta rechaza el envío y el comando se detiene.
- [ ] Los archivos de `~/Documents/eventalist/datos/` tienen datos personales: nunca se suben a ningún repo.
- [ ] A los 7 días: `python3 scripts/campanas/campana.py lista expirados`. Quien compró ya no sale. En GA4, las visitas con `utm_source=whatsapp` y `utm_medium=recuperacion`.

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
