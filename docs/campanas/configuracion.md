# Configuración (una sola vez)

Lo que hay que dejar listo una vez para que las campañas funcionen: las llaves de `campana.py`, el permiso de envío de WhatsApp por la API y lo de respond.io. Ya está todo hecho; esto queda para repetirlo si una llave vence o para otro evento.

Las llaves van en el llavero de macOS, nunca en chats, documentos ni en el repo. Para guardar una (la pide; pegarla y Enter):

```sh
security add-generic-password -a "$USER" -s NOMBRE-DEL-SERVICIO -w
```

## Pretix

Token del equipo `lectura-campanas`, servicio `eventalist-pretix`. Para crearlo de nuevo: organizador **eventalist** → **Equipos** → un equipo con solo **Puede ver pedidos** en todos los eventos → pestaña **Tokens de la API**.

## Backend de Eventalist

Token de lectura, servicio `eventalist-backend-lectura`. El token de Pretix no sirve aquí. El contrato del endpoint está en `README.md`, "Contrato del backend".

## Resend (correo)

Llave `campanas-correo`, servicio `eventalist-resend`. Para crearla de nuevo:

- [ ] Entrar a `https://resend.com/login` con la cuenta de Eventalist (la misma de los correos de Pretix).
- [ ] En **Domains**, confirmar que los dominios desde los que se envía aparecen como **Verified**: `eventalist.co` y `testigosdelamemoria.com` (el remitente de hoy es `direccion@testigosdelamemoria.com`). Si alguno no aparece, parar y avisar.
- [ ] **API Keys** → **Create API Key**. Name `campanas-correo`, permiso **Sending access**.
- [ ] Copiar la llave (empieza por `re_`; Resend la muestra una sola vez) y guardarla en el llavero.

El plan gratis manda 100 correos al día entre todas las campañas.

## WhatsApp por la API de Meta

Hace falta para las campañas que mandan plantillas con `campana.py` (`interesados` y `expirados`). Los broadcasts de respond.io no la usan.

Por qué así: WhatsApp Manager no tiene un botón para enviar a una lista desde un número conectado a la API. Meta lo resuelve con la API, y para usarla hace falta un usuario del sistema: una cuenta sin persona detrás, dentro del portafolio, cuyo token le da al script permiso de enviar desde el número. Las respuestas siguen llegando a Catalina en respond.io.

Se guardan dos cosas en el llavero: el token, en el servicio `eventalist-whatsapp`, y el identificador de la cuenta, en `eventalist-whatsapp-cuenta`. Si la cuenta tiene más de un número, también `WHATSAPP_PHONE_ID`. Todo con la cuenta de Facebook que administra el portafolio "Testigos de la Memoria".

### 1. Crear una app de Meta

El token siempre va atado a una app. Esta es solo para las campañas: no recibe mensajes ni cambia nada del agente.

- [ ] `https://developers.facebook.com/apps/` → **Crear app**. Caso de uso **Otro** → tipo **Negocio**.
- [ ] Nombre `eventalist-campanas`, portafolio **Testigos de la Memoria**.
- [ ] En **Agregar productos**, **WhatsApp** → **Configurar**, con la cuenta de WhatsApp Business del encuentro.
- [ ] **No** tocar Webhooks ni registrar el número desde esta app: los mensajes entrantes van al agente, y si se cambia eso deja de recibirlos.

### 2. Crear el usuario del sistema

- [ ] `https://business.facebook.com/settings/system-users`, con el portafolio Testigos de la Memoria elegido arriba.
- [ ] **Agregar**: nombre `campanas`, rol **Empleado**.
- [ ] **Asignar activos**: la app `eventalist-campanas` y la cuenta de WhatsApp del encuentro, las dos con **Control total**.

### 3. Sacar el token

- [ ] En el usuario `campanas` → **Generar token**, app `eventalist-campanas`, caducidad 60 días.
- [ ] Permisos: solo `whatsapp_business_messaging` (enviar) y `whatsapp_business_management` (leer la plantilla y el número).
- [ ] Copiarlo (Meta lo muestra una sola vez) y guardarlo en el llavero.

### 4. Copiar el identificador de la cuenta

- [ ] En `https://business.facebook.com/wa/manage/home/`, junto al nombre de la cuenta del encuentro, está su identificador (un número largo). Guardarlo en el llavero.

Meta cobra cada plantilla de Marketing entregada a la cuenta de WhatsApp, así que la cuenta necesita un método de pago en WhatsApp Manager. Sin él, Meta rechaza el envío y el comando se detiene.

## respond.io

- **Campo Baja** (titular, 2026-10-26): campo de contacto **Baja** (Field ID `baja`, tipo Checkbox). El prompt de Catalina (`docs/chatbot/`, la versión más alta) lo marca cuando alguien responde BAJA o "no me interesa". A quien la pidió antes, se le marca a mano. Ningún broadcast va a quien la tenga marcada.
- **Customer**: quien ya compró queda con Lifecycle **Customer** para que los broadcasts no le lleguen. Se marca importando la lista de compradores: `python3 scripts/campanas/campana.py respondio compradores` e importar en respond.io el CSV que deja en `~/Downloads`.
- **Segmento `inactivos`**: "Time Since Last Incoming Message" mayor que 24 horas, Lifecycle distinto de Customer y la casilla Baja sin marcar. Lo usa la campaña `inactivos`.
