# Guía de despliegue del embudo de medición

Para el titular. Junta en un solo orden lo que hay que publicar en los tres repos y lo que se configura
a mano en Pretix, Railway, Neon, GA4 y Meta. El detalle técnico de cada repo sigue en su sección de
`estado.md`. Si algo de aquí choca con `diseno.md`, manda `diseno.md`.

Fecha: 2026-10-08. Completa: los otros dos repos respondieron todas las preguntas (tercera tanda de
`estado.md`). Lo único abierto es trabajo del backend, no una duda: la exportación de pedidos con UTM
(ver fase 2).

## Principio: cada pieza aguanta sola

- **El sitio** funciona igual con o sin el plugin. Pretix sin plugin recibe los `tracking-*` y no hace
  nada con ellos (comprobado el 2026-10-08 en `testigos-sandbox`, que no tiene el plugin).
- **El backend** agrega un endpoint y tablas que nadie llama hasta activar el plugin. Pero su despliegue
  sí migra datos propios (ver fase 2), por eso lleva respaldo.
- **El plugin** se apaga desde el panel de Pretix, sin desplegar nada. Es el botón de emergencia.
- **La subida de Pretix a 2026.5.4** se deshace con "Redeploy" del deployment anterior en Railway, sin
  perder datos. Ver "Cómo volver atrás".

## Orden

1. Fase 1 · esta noche (2026-10-08): sitio y casilla.
2. Fase 2 · backend en producción.
3. Fase 3 · Pretix: 2026.5.4, barrido de Wompi y plugin en un solo despliegue.
4. Fase 4 · activar el plugin y ensayo en `testigos-sandbox`.
5. Fase 5 · activar el plugin en `testigos-memoria`.

Las fases 2 y 3 son independientes entre sí. La 4 necesita las dos.

---

## Fase 1 · Sitio y casilla (esta noche)

**Variables de entorno del sitio:** ninguna en producción. Los ID de GA4 (`G-XJES5Z5EC9`) y del píxel de
Meta ya están en `src/config.ts`. `PUBLIC_PRETIX_EVENT_URL` es solo para pruebas locales y nunca se
define en el workflow de GitHub Pages.

1. **Push a `main`** (~11:30 p. m.). Lo hace el agente de `testigos-web` con tu sí, o tú. GitHub Pages
   publica solo en unos minutos.
2. **Comprobar lo publicado**, en una ventana privada:
   - `https://testigosdelamemoria.com/tratamiento-de-datos/` dice "rige a partir del 9 de octubre de
     2026" y la sección 10 habla del envío de datos de los pedidos a Google y Meta.
   - `https://testigosdelamemoria.com/terminos-y-condiciones/` sección 12 dice "el correo electrónico y
     el teléfono".
   - El aviso de cookies muestra "Ver opciones" y, dentro, "¿Nos ayudas a saber cómo llegaste?".
   - Entrar con `?utm_source=prueba&utm_campaign=verificacion`, pulsar "Comprar boletas": baja a las
     boletas sin recargar la página.
   - Bajo la tienda aparece el botón de WhatsApp (en celular, "¿Dudas? Escríbenos").
3. **Pretix, evento `testigos-memoria`, antes de las 12:00 a. m.** (*Settings → General → Texts*; los
   textos están en `docs/pretix-tienda-textos.md`):
   - "Confirmation text": la casilla nueva, versión `tienda-2026-10-09`.
   - "Help text of the phone number field": "Se usa para avisos sobre esta compra y para los mensajes
     por WhatsApp que se autorizan al final del pedido."
   - Anotar la hora exacta en que guardas la casilla. El 9 de octubre a las 00:00 queda como
     `consent_since`, que va después de esa hora; los pedidos de esos minutos simplemente no se envían.
4. **Prueba en producción sin pagar:** desde el sitio con `?utm_source=prueba&utm_campaign=verificacion`,
   elegir una boleta, llenar los datos hasta la pantalla de Wompi y no pagar. Después, en Pretix,
   cancelar ese pedido.

Sin el plugin, en la fase 1 no se envía nada a Meta, GA4 por servidor ni al backend. La campaña viaja en
el carrito y nadie la guarda todavía.

---

## Fase 2 · Backend en producción

Detalle: sección `eventalist-backend` de `estado.md`, "Guía para poner el backend en producción".

**Antes del merge, falta trabajo del backend:** la exportación de pedidos con UTM que aprobaste todavía
no está implementada. Va en la misma rama para no desplegar dos veces.

**Ojo:** este despliegue tiene efecto propio aunque Pretix no haya cambiado. Migra las autorizaciones de
014 al historial nuevo y borra `email_consent` y `whatsapp_consent`. Por eso van primero la variable, el
ensayo y la rama de respaldo.

**Variables de entorno (Railway, servicio del backend):**

- `PRETIX_SERVICE_TOKEN`: un token **nuevo** de 32 caracteres o más.
  `python3 -c "import secrets; print(secrets.token_urlsafe(32))"`. Guardarlo en el gestor de
  contraseñas; va también en Pretix en la fase 4. **Sin esta variable el backend no arranca.**
- `PRETIX_TESTMODE_CAMPAIGNS=testigos-sandbox`.

Pasos:

1. Agregar esas dos variables a `.env.example` del backend (solo documentación; lo haces tú).
2. Ensayo de la migración en una rama de Neon (`ensayo-016`) desde producción. Lo hace el agente del
   backend con tu aprobación.
3. Poner las dos variables en Railway **antes** del merge.
4. En Neon, rama `antes-de-016` justo antes del merge. Es la copia para volver atrás.
5. Merge de `016-pretix-ticket-orders` a `dev` y a `master` a una hora de poco tráfico. El push a
   `master` despliega y migra.
6. En los logs: `Applying marketing.0002…`, `0003…`, `0004…` y `ContactConsent created from 014 flags`.
7. `POST https://eventalist-backend-production.up.railway.app/api/v1/marketing/ticket-orders/` sin token
   responde `401` (URL confirmada por el backend; antes del despliegue responde `404`).
8. Admin del backend: crear la campaña `testigos-sandbox` ("Ensayo Testigos") y confirmar que existe
   `testigos-de-la-memoria-2026`. **Las dos deben existir antes de activar el plugin en su evento**: si
   no, el backend responde `409` y el plugin no reintenta esos envíos (quedan fallidos hasta reintentarlos
   a mano en "Ventas por campaña").

---

## Fase 3 · Pretix: 2026.5.4, barrido de Wompi y plugin (un solo despliegue)

Detalle: sección `pretix-wompi` de `estado.md`. `main` local de `pretix-wompi` ya tiene todo junto
(2026.5.4, el barrido, el plugin y los arreglos de la revisión), sin push.

**Variables de entorno (Railway, servicio de Pretix):** no cambian.

- `PRETIX_PRETIX_TRUST_X_FORWARDED_FOR=on`, ya puesta (verificada el 2026-10-07).
- `AUTOMIGRATE=skip`, ya puesta: la migración se corre a mano.
- No poner `allow_http_to_private_networks` en producción.

Pasos:

1. Snapshot de la base de Postgres de Pretix en Railway.
2. Push de `main` de `pretix-wompi` (lo hace su agente con tu sí). Railway despliega.
3. Apenas termine, a una hora sin ventas:
   `railway ssh --service Pretix -- 'pretix migrate'`. La única migración nueva es la tabla del plugin.
   - Entre el despliegue y este paso **no borrar** pedidos ni eventos (el borrado toca la tabla que aún
     no existe). Vender y pagar sí funciona.
4. Una compra con la tarjeta 4242 en `testigos-sandbox`.

El plugin queda instalado pero apagado: no hace nada hasta la fase 4.

---

## Fase 4 · Activar el plugin y ensayo en `testigos-sandbox`

Requiere las fases 2 y 3.

**Barrido de Wompi** (en cada evento: Configuración → Pagos → Wompi; los textos salen en inglés):

1. Poner la **llave privada** de producción de Wompi en esa página. Sin ella el barrido no puede
   consultar Wompi.
2. Encender **"Reference lookup in sweep"** en `testigos-sandbox` y hacer una compra de prueba.
3. Encenderla en `testigos-memoria`. Ahí es donde importa: recupera pagos aprobados cuyo aviso de Wompi
   se perdió.
4. En los logs de las siguientes corridas (cada 5 min), confirmar que no hay una ráfaga de
   `WompiClientError`.

**Configuración del plugin en el panel de Pretix:**

Organizador `eventalist`:

- Configuración → Plugins: activar "Eventalist tracking".
- "Seguimiento de campañas":
  - URL del backend: `https://eventalist-backend-production.up.railway.app` (la pública, no
    `*.railway.internal`).
  - Token: el `PRETIX_SERVICE_TOKEN` de la fase 2. El campo muestra `*****`; guardar sin tocarlo lo
    conserva.
  - **"Exclusiones de publicidad"**: quien pida no ir a Meta ni a GA4. Un correo o un teléfono por línea,
    mezclados. Se comparan sin mayúsculas ni espacios, y el teléfono con o sin `+57`. Aplica a todos los
    eventos; esos pedidos sí van al backend.

Evento `testigos-sandbox`:

- Configuración → General: zona horaria `America/Bogota`.
- Configuración → Plugins: activar "Eventalist tracking".
- "Seguimiento de campañas":
  - Slug de la campaña: `testigos-sandbox`.
  - Consentimiento vigente desde: una fecha pasada.
  - Versión del texto: `tienda-2026-10-09`. Vigencia de la política: `2026-10-09`. Son texto libre; lo
    que importa es cambiar la versión cada vez que cambie el texto de la casilla.
  - Consentimiento de WhatsApp válido hasta: `2026-11-08 23:59`.
  - GA4: ID `G-XJES5Z5EC9` y el secreto de Measurement Protocol (GA4 → Administrar → Flujos de datos →
    el flujo web → Secretos de la API de Measurement Protocol → crear uno).
  - "Enviar pedidos de prueba a la propiedad real": activado solo durante el ensayo.
  - Meta: ID del dataset `1858161698687866`, token de Conversions API (Administrador de eventos → el
    dataset → Configuración → Generar token de acceso) y el código de prueba de la pestaña "Probar
    eventos".

En GA4, una sola vez: marcar `add_payment_info` y `purchase` como eventos clave.

**Ensayo** (correos que no estén en la base real):

1. Sitio local apuntando al sandbox:
   `PUBLIC_PRETIX_EVENT_URL=https://pretix.eventalist.co/eventalist/testigos-sandbox/ npm run dev`,
   entrar con `?utm_source=prueba&utm_campaign=ensayo`.
2. Pedidos: uno pagado con 4242, uno sin pagar, uno que vence y luego se le extiende el plazo, uno
   cancelado. Uno sin aceptar cookies y otro aceptándolas.
3. Dónde mirar: recuadro "Origen" de cada pedido en Pretix (campaña, identificadores solo en el pedido
   con cookies), "Ventas por campaña" del evento, GA4 → Tiempo real, Meta → Probar eventos, y el admin
   del backend (Ticket orders, etapa del contacto).
4. Limpieza: borrar en el backend los Ticket orders y contactos de `testigos-sandbox`; apagar "Enviar
   pedidos de prueba a la propiedad real"; devolver el plazo de pago del evento a como estaba.

---

## Fase 5 · Plugin en `testigos-memoria`

1. Evento `testigos-memoria` → Configuración → General: zona horaria `America/Bogota`.
2. Configuración → Plugins: activar "Eventalist tracking".
3. "Seguimiento de campañas":
   - Slug de la campaña: **`testigos-de-la-memoria-2026`** (la del formulario del sitio, no el slug del
     evento).
   - Consentimiento vigente desde: **`2026-10-09 00:00`** (el que quedó en la fase 1).
   - Versión del texto `tienda-2026-10-09`, vigencia de la política `2026-10-09`, WhatsApp hasta
     `2026-11-08 23:59`.
   - GA4 y Meta: las mismas credenciales de producción.
   - **Código de prueba de Meta vacío.** Si queda lleno, las compras reales no cuentan como
     conversiones.
   - "Enviar pedidos de prueba a la propiedad real": apagado.
4. Una persona del equipo llega a la pantalla de pago de Wompi sin pagar desde el sitio con
   `?utm_campaign=verificacion`, revisa el recuadro "Origen" del pedido y lo cancela.

---

## Cómo volver atrás

- **Algo raro con las compras:** desactivar "Eventalist tracking" en el evento (Configuración →
  Plugins). Pretix vuelve a comportarse como antes al instante; los envíos pendientes esperan. El sitio
  no se toca.
- **El barrido de Wompi:** apagar "Reference lookup in sweep" en el evento.
- **El sitio:** revertir los commits en `main` de `testigos-web` y push. No depende de lo demás.
- **El backend:** revertir el merge en `master` y, si hace falta, restaurar la rama `antes-de-016` de
  Neon.
- **Pretix 2026.5.4:** Railway → servicio Pretix → Deployments → el deployment anterior → "Redeploy".
  No se pierden datos ni hace falta el snapshot (2026.5.1 y 2026.5.4 tienen las mismas migraciones; la
  tabla del plugin queda huérfana sin hacer daño). Antes del siguiente push a `main` de `pretix-wompi`
  hay que revertir en git (`git revert -m 1 <merge>`), porque Railway despliega cada push. Volver a
  2026.5.1 reabre el CVE-2026-13602: que sea temporal. El snapshot solo sirve si se daña algún dato.
- **La casilla:** se puede volver al texto anterior en Pretix en cualquier momento; está en
  `docs/pretix-tienda-textos.md` como "Versión anterior".

## Si algo falla en los envíos

- El plugin nunca bloquea una compra ni un pago. Reintenta a los 5 min, 15 min, 1 h, 6 h y 24 h.
- `401`: el token de Pretix y el de Railway no coinciden. Comparar los primeros 12 caracteres del
  SHA-256 de cada uno.
- `409`: la campaña no existe en el backend. Crearla y reintentar a mano en "Ventas por campaña" (el
  plugin no reintenta los `4xx`).
