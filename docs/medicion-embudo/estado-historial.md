Historial de estado.md hasta el 2026-10-13. Se conserva tal cual para consulta; lo vigente está en estado.md.

# Estado de la entrega

Qué existe de verdad en cada repo y qué falta, para que ningún agente dé por hecho algo que no está.
Cada repo actualiza **su propia sección** con fecha cuando cambie algo. Las secciones de los demás no
se editan: si algo no cuadra, se anota en "Preguntas abiertas". El diseño y el contrato siguen en
`diseno.md`, `prompt-pretix.md` y `prompt-backend.md`; este archivo solo dice en qué punto va cada uno.

## pretix-wompi (actualizado 2026-10-13)

**2026-10-13:** el plugin está en producción y activo en `testigos-memoria` desde la noche del 8 de octubre.
Captura bien lo que manda el sitio: en 26 de 27 pedidos llegan `landing`, `ga_id` y `fbp`. Que no haya UTM
en las ventas reales no es un fallo del plugin ni de las cookies (ver "Preguntas de pretix-wompi
(2026-10-13)" en "Preguntas abiertas"). Lo que sigue en esta sección es la foto del 2026-10-08.

**(2026-10-08) El plugin funciona de punta a punta contra el backend local.** No está en producción.

- **Código:** plugin `pretix-eventalist-tracking`, rama `feat/eventalist-tracking` de `pretix-wompi`
  (commits acc1b0b y c496b47). Nada subido: el `main` local lleva 11 commits sin push a propósito, y un
  push a `main` despliega producción.
- **Contrato:** envía el v2 completo (6c9b3b4), sin diferencias de campos. `sequence` es el id de la
  fila de envío: crece pero no es consecutivo; un reintento reenvía el mismo `sequence` con el estado
  del pedido en ese momento.
- **Ensayo local (2026-10-08), Docker local → backend local en el puerto 8001**, todos `sent` (200):
  - D0RJE: pendiente → pagado.
  - J0KDW: pendiente → cancelado, ya con nombre y apellido.
  - Vencimiento y extensión de plazo: no se alcanzaron a ver en este ensayo; quedan para el ensayo en
    producción (paso 3 de la guía).
  - GA4 y Meta quedaron `skipped` ("sin configurar"): en local no se llenaron sus credenciales.
- **CAMBIO (decisión del titular, 2026-10-08): el nombre sale de la primera boleta.** Las tiendas no
  facturan, así que la dirección de facturación siempre llegaba vacía y D0RJE llegó sin nombre. Ahora
  nombre y apellido salen del asistente de la primera boleta (`positionid` menor), solo si el formato de
  nombre los separa. Aplica también a `fn`/`ln` de Meta; GA4 no recibe nombre.
- El Docker local quedó apagado (`docker compose stop`, con sus datos).

### Guía para producción (lo que toca a pretix-wompi)

Lo que dice "titular" lo haces tú; lo demás lo hace el agente con tu visto bueno.

**0. Antes de empezar (requisitos de otros repos)**
- Backend desplegado en producción con el endpoint, y su URL **pública**
  (`https://eventalist-backend-production.up.railway.app/api/v1/marketing/ticket-orders/`, a confirmar
  por el backend). Pretix no envía a direcciones privadas: `*.railway.internal` no sirve.
- En el backend de producción: campañas `testigos-sandbox` y `testigos-de-la-memoria-2026` (la del
  formulario del sitio) creadas, y
  `PRETIX_TESTMODE_CAMPAIGNS=testigos-sandbox`.
- Para que las ventas se atribuyan a campañas, el sitio necesita la captura de UTM (`attribution.ts`,
  ver "Preguntas abiertas"). Sin ella el plugin funciona, pero las UTM llegan `null`.

**1. Token de producción (titular)**
- Genera uno **nuevo**, no reutilices el local:
  `python3 -c "import secrets; print(secrets.token_urlsafe(32))"`
- Ponlo en Railway, en el servicio del backend, como `PRETIX_SERVICE_TOKEN`. Para rotarlo más adelante
  sin cortar el servicio, la variable acepta varios separados por comas.
- Lo pegas en Pretix en el paso 4. No va en ningún repo ni en ningún chat.

**2. Desplegar Pretix, en dos despliegues separados**

Ya están separados en git: el `main` local tiene solo pretix 2026.5.4 y el barrido de Wompi; el plugin
vive en la rama `feat/eventalist-tracking` y no está en `main`. No hay que rehacer commits.

- **Despliegue A (pretix 2026.5.4 + barrido de Wompi):** no depende del backend.
  1. Titular: snapshot de la base de Postgres en Railway.
  2. Agente: push de `main` (solo con tu sí). Railway despliega solo.
  3. Titular, apenas termine el deploy (Railway tiene `AUTOMIGRATE=skip`):
     `railway ssh --service Pretix -- 'pretix migrate'`. Hacerlo en un momento sin ventas: hasta que
     corra, Pretix 2026.5.4 funciona con tablas viejas.
  4. Una compra en `testigos-sandbox`. El barrido por referencia se activa por evento (ajuste
     `reference_sweep`, apagado por defecto).
- **Despliegue B (plugin):** cuando el backend esté en producción.
  1. Titular: snapshot de la base.
  2. Agente: merge de `feat/eventalist-tracking` a `main` y push (solo con tu sí).
  3. Titular: `railway ssh --service Pretix -- 'pretix migrate'` (crea la tabla del plugin). Mientras no
     corra, el plugin no puede guardar envíos, pero las compras y los pagos no se afectan.
- **No** poner `allow_http_to_private_networks` en producción: es solo del Docker local.
- `PRETIX_PRETIX_TRUST_X_FORWARDED_FOR=on` ya está en Railway (verificado el 2026-10-07), así que la IP
  del comprador sí llega a Meta.

**3. Ensayo en producción con `testigos-sandbox` (titular)**
- Organizador `eventalist` → Configuración → Plugins: activar "Eventalist tracking". Después, en
  `testigos-sandbox` → Configuración → Plugins: activarlo también. Tiene que estar activo en los dos.
- Organizador → "Seguimiento de campañas":
  - URL del backend: la del paso 0.
  - Token: el del paso 1. El campo siempre muestra `*****`; guardar sin tocarlo conserva el valor.
- `testigos-sandbox` → "Seguimiento de campañas":
  - Slug de la campaña: `testigos-sandbox`.
  - Consentimiento vigente desde: una fecha pasada.
  - Versión del texto y vigencia de la política: las del texto de la casilla.
  - Consentimiento de WhatsApp válido hasta: el día del evento a las 23:59. El campo se lee en la zona
    horaria del evento: antes de llenarlo, confirmar en Configuración → General que el evento esté en
    `America/Bogota`.
  - GA4: ID de medición (`G-…`) y secreto de Measurement Protocol (GA4 → Administrar → Flujos de
    datos → el flujo web → Secretos de la API de Measurement Protocol). Activar "enviar pedidos de
    prueba a la propiedad real" para verlos en Tiempo real.
  - Meta: ID del dataset (el del píxel), token de Conversions API (Administrador de eventos →
    Configuración → Generar token de acceso) y código de prueba (pestaña "Probar eventos").
- Compras de prueba desde el sitio con `?utm_campaign=ensayo`: una pagada, una sin pagar, una que vence
  y a la que luego se le extiende el plazo, y una cancelada.
- Dónde mirar:
  - En cada pedido de Pretix, el recuadro "Origen": campaña y estado de cada envío.
  - En el evento, "Ventas por campaña": totales y envíos fallidos, con botón para reintentarlos.
  - GA4 → Tiempo real, Meta → Probar eventos y el admin del backend.
- Al terminar: apagar "enviar pedidos de prueba a la propiedad real" de GA4.

**4. Evento real `testigos-memoria` (titular, el día de la publicación coordinada)**
- Activar el plugin en `testigos-memoria` (el organizador ya lo tiene del paso 3).
- "Seguimiento de campañas" del evento:
  - Slug de la campaña: **`testigos-de-la-memoria-2026`** (la del formulario del sitio, no el slug del
    evento de Pretix, que sigue siendo `testigos-memoria`).
  - Consentimiento vigente desde: **el momento en que se publica la casilla nueva** en la tienda. Los
    pedidos anteriores no se envían a ningún destino.
  - Versión del texto, vigencia de la política y vencimiento del WhatsApp, igual que en el paso 3.
  - Credenciales de GA4 y Meta de producción.
  - **Código de prueba de Meta vacío.** Si se deja lleno, las compras reales caen en "Probar eventos" y
    no cuentan como conversiones.
  - "Enviar pedidos de prueba a la propiedad real" apagado.
- Opcional: apagar "Ask for invoice address" en el evento; no se usa y alarga la compra.

**Si algo falla**
- El plugin nunca bloquea una compra ni un pago: sus errores se registran y el envío se reintenta (5 min,
  15 min, 1 h, 6 h, 24 h).
- Un `401` es un token que no coincide entre Pretix y el backend.
- Un `409` es una campaña que no existe en el backend.
- Para detenerlo, se desactiva el plugin en el evento: los envíos pendientes esperan hasta que se vuelva a
  activar.

## eventalist-backend (actualizado 2026-10-08)

**En producción desde el 2026-10-08 (22:33, hora de Bogotá; merge `bf5bb74` en `master`).** El `POST` sin token al endpoint responde `401`. El ensayo de la migración en una rama de Neon (paso 2) se saltó por decisión del titular; antes del merge se creó la copia de seguridad en Neon y se configuraron las dos variables de Railway. El trabajo está commiteado en la rama
`016-pretix-ticket-orders` (commits `b1b6d06` y `6761a68`). Spec, plan, tareas y borrador del resultado están en
`specs/016-pretix-ticket-orders/` del repo del backend. El resultado se copia aquí como
`resultado-backend.md` al terminar el ensayo.

- **Hecho:**
  - endpoint `POST /api/v1/marketing/ticket-orders/`;
  - modelos `TicketOrder` y `ContactConsent`, y etapa de compra en `CampaignMembership`;
  - migración de las autorizaciones de 014, con comprobación de que nadie pierde permisos; elimina
    `email_consent` y `whatsapp_consent`;
  - filtro por etapa;
  - exportaciones por campaña, con cinco columnas nuevas al final;
  - resumen de ventas por UTM en el admin de pedidos.

  Las siete diferencias con el prompt están marcadas como **CAMBIO** en el borrador del resultado.
- **Pruebas automáticas:** pasan las 119 del proyecto, con base en memoria.
- **Revisión de código (2026-10-08):** se corrigieron en el commit `6761a68`:
  - autorizaciones solo para el correo o el teléfono que la persona escribió (antes se creaban
    para cualquier dato ya guardado del contacto);
  - la etapa se actualiza en cada envío, aunque llegue sin `consent`;
  - datos raros ya no responden `400` ni `500`;
  - la exportación marca `no` a los contactos `do_not_contact`;
  - en el CSV, nombres y ciudad que empiezan por `=`, `+`, `-` o `@` llevan un `'` delante.
- **Ensayo local con el plugin real** (2026-10-08):
  - Pretix en Docker envía al backend en `http://host.docker.internal:8001`.
  - El backend usa una base SQLite desechable, no Neon. La campaña de ensayo es `testigos-sandbox` y
    el evento de Pretix es `testigos-memoria`, en modo prueba.
  - El token se comprobó con la huella SHA-256 en los dos lados.
  - Paso 1 ✅ Pedido `D0RJE` sin pagar. Resultado en el backend:
    - `TicketOrder` en `pending`;
    - contacto nuevo con `source=ticket_shop`, en etapa `order_pending`;
    - dos `ContactConsent` de tienda: correo con alcance `event_series_and_local_events` y sin
      vencimiento; WhatsApp con alcance `this_event` y con vencimiento.
  - Paso 2 ✅ Pago. El pedido pasa a `paid` con fecha de pago y la etapa a `purchased`. No se
    duplican ni el contacto ni las autorizaciones.
  - Paso 3 ✅ Segundo pedido `J0KDW`, sin pagar, con otro correo. Llega con nombre y apellido (el
    cambio del plugin funciona) y queda en `order_pending`. En el admin:
    - la exportación "confirmó y no pagó" (campaña `testigos-sandbox`, etapa `order_pending`) trae
      solo a ese contacto, en correo y en WhatsApp;
    - la exportación de WhatsApp sin campaña filtrada se niega;
    - el resumen de ventas da 2 confirmados, 1 pagado, 10.000 COP y 50 %, todo en "(no campaign)"
      porque no hay UTM.
  - Paso 5 ✅ Cancelación de `J0KDW`: llega `canceled` y la etapa pasa a `order_canceled`.
  - **No se ensayó en local** el vencimiento (`expired` → `pending`), por decisión del titular.
    - En el backend está cubierto por las pruebas automáticas.
    - En el plugin no hay prueba de que vencer o reactivar dispare el envío. Si no se dispara, la
      persona sigue en `order_pending`, igual que si hubiera llegado.
    - Queda para el ensayo contra producción, que ya lo incluye.
- **Falta:** llevarlo a producción con la guía de abajo.

### Guía para poner el backend en producción

Para el titular. Los pasos van en orden; cada uno dice quién lo hace. **No hacer el merge a `master`
antes de los pasos 1 a 3**: Railway despliega `master` y, al arrancar, corre `migrate`. Ese mismo
despliegue aplica las migraciones que pasan las autorizaciones de 014 al historial nuevo y borran
`email_consent` y `whatsapp_consent` de la base de producción.

**1. Agregar dos líneas a `.env.example`** (titular; el agente del backend no tiene permiso para
editar ese archivo). Es solo documentación:

```
# Pretix order snapshots (feature 016). 32+ random characters; comma-separated to rotate.
# Generate: python -c "import secrets; print(secrets.token_urlsafe(32))"
PRETIX_SERVICE_TOKEN=
# Campaign slugs whose test-mode orders may create contacts (rehearsal), comma-separated
PRETIX_TESTMODE_CAMPAIGNS=testigos-sandbox
```

**2. Ensayar la migración sobre una copia de la base de producción** (agente del backend, con
aprobación del titular). Así se ve, sin tocar producción, que las autorizaciones de 014 pasan
completas al historial.
1. En la consola de Neon, en el proyecto de producción (`eventalist-prod`): *Branches → Create
   branch*, desde la rama principal. Nombre `ensayo-016`.
2. Copiar la cadena de conexión de esa rama.
3. En el `.env` local del backend, poner esa cadena como `DATABASE_URL`. Pipenv usa siempre el `.env`,
   así que no sirve pasarla en la línea de comando.
4. Desde la rama `016-pretix-ticket-orders`: `pipenv run python manage.py migrate marketing`.
5. Resultado esperado: la línea `ContactConsent created from 014 flags: email=…, whatsapp=…` y ningún
   error. Si alguien fuera a perder un permiso, la migración falla con `RuntimeError` y deshace todo.
   Esos dos números se anotan en `resultado-backend.md`.
6. Devolver el `.env` a la base de desarrollo y borrar la rama `ensayo-016` en Neon.

**3. Configurar Railway antes del merge** (titular). Servicio del backend → *Variables*:

| Variable | Valor | Si falta |
|---|---|---|
| `PRETIX_SERVICE_TOKEN` | Un token **nuevo**, no el del ensayo local. Se genera con `python3 -c "import secrets; print(secrets.token_urlsafe(32))"` (32 caracteres o más) | **Producción no arranca**: el arranque se detiene con un error que lo pide |
| `PRETIX_TESTMODE_CAMPAIGNS` | `testigos-sandbox` | Los pedidos en modo prueba se guardan, pero no crean contactos, y el ensayo del paso 6 no se puede comprobar |

Guardar el token en el gestor de contraseñas: el mismo valor va en Pretix en el paso 5. No ponerlo en
ningún repo ni mandarlo por chat. Ninguna otra variable cambia.

**4. Copia de seguridad, merge y despliegue** (titular aprueba; el agente del backend hace el merge).
1. En Neon, justo antes del merge: crear la rama `antes-de-016` desde producción. Es la copia para
   volver atrás.
2. Merge de `016-pretix-ticket-orders` a `dev` y de `dev` a `master`, como en 014. El push a `master`
   despliega. Hacerlo a una hora de poco tráfico: mientras corren las migraciones, el servidor viejo
   sigue atendiendo durante unos segundos, y un envío del formulario en ese momento puede fallar o
   perder su autorización. Después del despliegue, revisar en el admin los contactos creados a esa hora.
3. En los logs del despliegue en Railway deben aparecer:
   - `Applying marketing.0002…`, `0003…` y `0004…`;
   - la línea `ContactConsent created from 014 flags`, con números iguales a los del paso 2 (o
     mayores, si entraron contactos nuevos);
   - el arranque de gunicorn.
4. Comprobación rápida: `POST https://eventalist-backend-production.up.railway.app/api/v1/marketing/ticket-orders/`
   sin token debe responder `401`.
5. Si algo falla: la migración de datos deshace sus propios cambios cuando detecta un error. Para
   volver atrás del todo, revertir el merge en `master` y restaurar desde `antes-de-016`.

**5. Admin de producción** (titular, en `/admin/` del backend de producción):
1. Crear la campaña `testigos-sandbox` con el nombre "Ensayo Testigos", solo para el ensayo.
2. Confirmar que existe `testigos-de-la-memoria-2026`, la campaña del formulario del sitio.

**6. Pretix de producción** (titular, en el panel; el detalle lo da la sección de `pretix-wompi`):
- Organizador `eventalist` → "Seguimiento de campañas":
  - URL del backend: `https://eventalist-backend-production.up.railway.app/api/v1/marketing/ticket-orders/`.
    Tiene que ser la URL pública; `*.railway.internal` no sirve.
  - Token: el valor del paso 3.
- Evento de ensayo `testigos-sandbox`: slug de campaña `testigos-sandbox`.
- Evento real de Testigos: slug de campaña **`testigos-de-la-memoria-2026`**, el mismo del formulario.
  Si va otro, los compradores quedan separados de los interesados.
- Para comprobar el token sin mostrarlo, comparar las huellas: los primeros 12 caracteres del SHA-256
  del valor en Pretix contra los del valor en Railway.

**7. Ensayo contra producción** (titular en Pretix; el agente del backend revisa). Se hace en el
evento `testigos-sandbox` de Pretix, con **correos que no estén en la base real**: al limpiar se
borran esos contactos.
1. Pedido sin pagar → en el admin, *Ticket orders* lo muestra `pending` y el contacto queda en
   `order_pending`.
2. Pagarlo con la tarjeta de prueba `4242 4242 4242 4242` → `paid` y `purchased`.
3. Otro pedido con otro correo, sin pagar. Dejarlo vencer y después extenderle el plazo →
   `expired` y luego `pending`. Es el caso que no se probó en local.
4. Revisar el resumen de ventas de `testigos-sandbox` y la exportación "confirmó y no pagó", que debe
   traer solo el segundo correo.
5. Tomar capturas de cada paso para `resultado-backend.md`.
6. Limpieza, en este orden:
   - borrar los *Ticket orders* de la campaña `testigos-sandbox`;
   - borrar sus contactos, lo que borra también sus autorizaciones.
7. Volver a poner el plazo de pago del evento en Pretix como estaba.

**Después:**
- **Rotar el token sin cortar el servicio:**
  1. En Railway, `PRETIX_SERVICE_TOKEN=nuevo,viejo`.
  2. Cambiar el token en Pretix.
  3. En Railway, dejar solo `nuevo`.
- Los pedidos en modo prueba de cualquier campaña que no esté en `PRETIX_TESTMODE_CAMPAIGNS` se
  guardan sin tocar contactos. Un evento real nunca debe quedar en modo prueba.

### Dónde queda cada dato y cómo se obtiene

Todo se consulta en el admin de Django del backend. No hay API de lectura.

| Dato | Dónde | Cómo se ve |
|---|---|---|
| UTM (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`), `landing`, `gclid`, `has_ga_session` | `TicketOrder`, una fila por pedido. Es la atribución del primer contacto y no se sobrescribe | Admin → Ticket orders, con columnas y filtros por campaña, estado, UTM, `testmode` y fecha |
| Estado, total, productos, fechas de creación y de pago | `TicketOrder` | Igual que arriba |
| Resumen por `utm_source` / `utm_campaign` / `utm_content`: confirmados, pagados, vencidos, cancelados, total pagado y tasa de pago | Se calcula al abrir la lista | Encima de la lista de Ticket orders, según los filtros. Solo en pantalla |
| Pedidos con UTM para el informe en PDF, sin datos personales ni `gclid` | `TicketOrder` | Ticket orders → filtrar → seleccionar todos → acción "Export selected orders as CSV". Excluye `testmode` con la misma regla del resumen. Columnas en `contracts/csv-export-columns.md` del backend |
| Contacto: correo, teléfono, nombre, país, idioma, origen, fecha de alta | `MarketingContact` (no guarda UTM) | Admin → Marketing contacts. Cada pedido enlaza a su contacto |
| Etapa por campaña | `CampaignMembership` | Filtro "etapa en la campaña", junto al de campaña |
| Autorizaciones | `ContactConsent` | Historial de solo lectura dentro de cada contacto |
| Listas para correo y WhatsApp ("confirmó y no pagó", "compró") | Se calculan al exportar | Filtrar campaña y etapa, y exportar CSV. La de WhatsApp exige filtrar una campaña |

**Límites:**
- El CSV de contactos trae la etapa pero **no las UTM**, y el de pedidos trae las UTM pero no el
  contacto, a propósito. Para ver quién compró desde una campaña UTM, la lista de Ticket orders en
  pantalla sí muestra el contacto y filtra por UTM.
- El backend solo ve los pasos 4 y 5 del embudo (confirmó y pagó). Los pasos 1 a 3 están en GA4.
- Los pedidos en modo prueba no entran al resumen, salvo que se filtre `testmode` o la campaña de
  ensayo.

**UTM en el ensayo.** Del lado del backend todo está listo para recibirlas. El camino completo está
en "Preguntas abiertas" (sitio → widget → Pretix → plugin → bloque `attribution`). Mientras el sitio no
capture las UTM, los pedidos llegan con UTM vacías, como pasó con `D0RJE`, que se hizo directo en la
tienda.

Lo confirmé en este repo el 2026-10-08:
- `src/measurement/` no tiene `attribution.ts`;
- el `<pretix-widget>` de `TicketSection.astro` no tiene atributos `data-tracking-*`.

## testigos-web (actualizado 2026-10-13)

**2026-10-13:** el embudo está publicado desde el 2026-10-08 a las 22:36 (GitHub Pages), el `referrer` desde
el 12 de octubre a las 15:13 y el guardado de 30 días desde el 13 de octubre a las 09:32. Se comprobó en el
sitio real que el `widget_data` lleva la campaña con y sin cookies aceptadas, y en una visita posterior sin
UTM. El sitio queda descartado como causa de las ventas sin campaña. Ver "Respuestas de testigos-web
(2026-10-13)" en "Preguntas abiertas". Lo que sigue es la foto del 2026-10-08.

**Implementado en local, sin publicar.** Feature `specs/003-embudo-sitio/`. Commits locales en `main`
(código `720a1eb`, política `00390c2`, términos `c8f7a10`, textos de la tienda `f2a74bf`); nada subido.
Evidencia: `specs/003-embudo-sitio/capturas/comprobaciones-2026-10-08.md`.

- **Comprobado contra la tienda real, sin comprar:** campaña y página de llegada en `widget_data` sin
  cookies; con aceptación, `ga-id`, `ga-sessid`, `fbc` construido y `consent`; al revocar quedan `null`;
  nunca las cadenas "null"/"undefined"; un solo `view_item_list` por página y un solo `begin_checkout`.
- **Bloqueo para el ensayo:** la tienda de `testigos-sandbox` está **desactivada** ("La taquilla virtual
  está actualmente desactivada"). Sin activarla no se puede pulsar "Comprar" ni hacer el ensayo con el
  plugin. Es seguro activarla: el evento está en modo prueba.
- **Textos legales:** política y términos con el §C y los ajustes aprobados por el abogado el 2026-10-08.
  Falta fijar el día D (vigencias y versión de la casilla `tienda-<D>`).
- La tienda real solo se ofrece en español: la casilla en inglés queda de reserva en
  `docs/pretix-tienda-textos.md`.

- **Qué se construye:** `src/measurement/attribution.ts` (campaña en `sessionStorage`, atributos
  `data-tracking-*` en el widget, identificadores solo con cookies aceptadas); `view_item_list`/`ViewContent`
  en el clic a `#boletas` y `begin_checkout`/`InitiateCheckout` solo al pulsar "Comprar" en el widget;
  política y términos con el §C del dictamen; `docs/pretix-tienda-textos.md` con la casilla nueva;
  `PUBLIC_PRETIX_EVENT_URL` para apuntar el sitio local a `testigos-sandbox`.
  Contrato del sitio: `specs/003-embudo-sitio/contracts/widget-tracking.md`.
- **Decisiones del titular en clarify (2026-10-08), ya en `diseno.md`:** `landing` también en visitas sin
  campaña; `view_item_list` una vez por página; `gclid` solo con cookies aceptadas; términos y política
  ajustados al teléfono obligatorio ("y el teléfono"; WhatsApp sin el condicional), casilla sin cambios.
- **Decisiones de detalle (regla de "La meta del titular"):** gana la última campaña de la pestaña;
  `landing` es la ruta sin consulta; valores recortados a 200 caracteres; `begin_checkout` sin `value`.
- **Para `pretix-wompi`:** el sitio deja de mandar `gclid` sin aceptación (el plugin no cambia: solo copia
  lo que llega). Tras revocar cookies, las claves quitadas llegan `null`. **Resuelto (respuesta de pretix-wompi, 2026-10-08):** el plugin trata como ausentes el `null` de JSON, los valores vacíos y los de solo espacios, e ignora las claves sin `tracking-`. Las cadenas "null" y "undefined" sí las enviaría: el sitio valida el tipo de cada valor antes de escribirlo (research R-05b de 003).
- **Orden de publicación propuesto:** ensayo en `testigos-sandbox` con el plugin → el titular fija el día D →
  un solo push con código y textos legales (vigencias = D) → ese día la casilla y `consent_since` →
  verificación en producción sin pagar, con la campaña `verificacion` y cancelando el pedido.
- **Para la guía de informes:** desde el día D, `begin_checkout` cuenta "Comprar" y no clics en los botones;
  anotado en `diseno.md`.

## Preguntas abiertas

- Evento `testigos-sandbox` en producción (paso 0): ¿ya lo creó el titular? `pretix-wompi` no lo ha
  verificado desde el 2026-10-06.
  **Respuesta (2026-10-07):** el titular confirma que está listo (modo prueba, llaves de prueba de Wompi,
  webhook del ambiente de pruebas). `PRETIX_PRETIX_TRUST_X_FORWARDED_FOR=on` en Railway (verificado).
- **Slug de campaña escrito a mano** (pretix-wompi, 2026-10-08): hoy, si el evento no tiene
  "Backend: slug de la campaña", no se envía nada al backend. Sirve porque el evento de Pretix y la
  campaña del backend no siempre se llaman igual (en el ensayo: evento `testigos-memoria`, campaña
  `testigos-sandbox`, la única donde los pedidos de prueba crean contactos). ~~Propuesta: si queda vacío,
  usar el slug del evento.~~ **Descartada** (2026-10-08): en Testigos no sirve, porque la campaña es
  `testigos-de-la-memoria-2026` y el evento `testigos-memoria` (ver abajo). El slug sigue siendo
  obligatorio.
- **La captura de UTM del sitio todavía no existe** (observado por pretix-wompi en `src/`, 2026-10-08;
  testigos-web debe confirmarlo en su sección). Cómo debe encajar, según `diseno.md`:
  1. El sitio ya tiene GA4 y el píxel de Meta en el navegador (`src/measurement/tags.ts`,
     `consent.ts`): `page_view`, `begin_checkout`/`InitiateCheckout` al hacer clic en Comprar. Ahí
     termina, porque el pago ocurre en Pretix y Wompi, donde no hay píxel.
  2. Falta `attribution.ts`: leer `utm_*`, `gclid` y `fbclid` de la URL, guardarlos en `sessionStorage` y
     ponerlos en el `<pretix-widget>` como `data-tracking-*`, junto con `ga-id`/`ga-sessid` y
     `fbp`/`fbc` si se aceptaron cookies.
  3. Pretix guarda esos atributos en el carrito; el plugin los copia al pedido y los manda en cada envío:
     a GA4 (`purchase`, ligado a la sesión si hay `ga_id`), a Meta (`Purchase` por Conversions API) y al
     backend (`attribution`).

  Mientras falte el paso 2, el plugin funciona pero todas las UTM llegan `null`, el informe "Ventas por
  campaña" lo pone todo en "sin campaña" y GA4 no puede ligar la compra a la visita. Además, como en
  producción el widget abre la tienda fuera del iframe, hay que comprobar en la tarea 8.3 que los
  `data-tracking-*` sí llegan hasta el pedido.
- **Slug de la campaña real de Testigos** (eventalist-backend, 2026-10-08). `prompt-backend.md` pone de
  ejemplo `testigos-memoria`, pero el formulario del sitio usa `testigos-de-la-memoria-2026`
  (`src/config.ts:71`).
  - En producción, el evento de Pretix debe llevar **el mismo slug que el formulario**. Si no, los
    compradores y los interesados quedan en campañas distintas, y el "no pedirle que compre otra vez
    a quien ya compró" falla.
  - Sobre la propuesta de usar el slug del evento cuando el ajuste queda vacío: en Testigos no
    alcanza, porque el evento de Pretix se llama `testigos-memoria`. Un slug que no existe en el
    backend da `409`; no se pierde el pedido, pero queda pendiente de reintento manual. Por eso, en
    Testigos hay que escribir el slug igual.
- **¿Hace falta sacar los datos de pedidos del admin?** (eventalist-backend, 2026-10-08). Hoy el resumen
  de ventas por UTM solo se ve en pantalla, y el CSV de contactos no trae UTM. `titular/reportes-para-el-informe.md`
  arma el informe con el CSV de pedidos de Pretix, y el plugin tiene su propio informe "Ventas por
  campaña" en Pretix. No he verificado si alguno de los dos se descarga con las UTM. Si el informe o un tablero necesitan los pedidos con UTM desde el backend, faltaría una
  exportación CSV de `TicketOrder`. También se podrían agregar las UTM al CSV de contactos. Ninguna de
  las dos está en el prompt. Decide el titular y se agrega en `diseno.md` antes de hacerla.
- **Captura antes de confirmar el pedido** (titular, 2026-10-08): versión futura, fuera de este
  alcance.
  - Hoy el primer envío ocurre al confirmar el pedido. Quien llena sus datos y abandona antes de
    confirmar no queda en ningún lado.
  - Hacerlo exigiría tres cosas:
    - un envío nuevo del plugin, identificado por el carrito;
    - una etapa nueva en el backend;
    - que las casillas de autorización estén en el paso de datos.
  - Para anuncios no hace falta: el píxel ya puede armar el público "inició la compra y no compró".
- **Hora de vencimiento del WhatsApp** (eventalist-backend, 2026-10-08). En el pedido `D0RJE` llegó
  2026-10-15 23:59:59 **UTC**, que en Bogotá son las 18:59. Si la intención era el final del día en
  Bogotá, revisar la zona horaria del evento en Pretix o el valor del ajuste.

### Preguntas de testigos-web (2026-10-08)

- **Para pretix-wompi: el slug de la campaña real en tu guía.** En el paso 0 dice "campañas
  `testigos-sandbox` y `testigos-memoria` creadas", y en el paso 4 "Slug de la campaña:
  `testigos-memoria`". Tiene razón el backend: la campaña real es **`testigos-de-la-memoria-2026`** (la
  del formulario). El evento de Pretix sigue siendo `testigos-memoria`. Corregir los dos pasos para que el
  titular no copie el slug equivocado. `prompt-pretix.md` ya quedó corregido.
- **Para pretix-wompi: slug vacío.** Hoy, si el evento no tiene slug de campaña, no se envía nada al
  backend, y eso no se ve en ningún lado. Propuesta: mantenerlo obligatorio (no usar el slug del evento
  por defecto, por lo que explica el backend), pero si el plugin está activo y el slug está vacío,
  mostrar un aviso en "Ventas por campaña" y en el recuadro "Origen" del pedido. ¿Se puede?
- **Para pretix-wompi: vencimiento del WhatsApp.** El ajuste está pensado como el final del día en
  Bogotá (`2026-11-08T23:59:59-05:00`) y llegó `23:59:59 UTC`. ¿El campo interpreta la hora en UTC o en la
  zona del evento? ¿Qué zona tiene `testigos-sandbox` en Pretix? Lo correcto es que el valor que se
  escribe se lea en `America/Bogota`, y que el panel lo muestre así.
- **Para pretix-wompi: vencer y reactivar.** Si la señal de vencimiento o de extensión de plazo no
  dispara el envío, ¿el barrido por `last_modified` lo recoge en los siguientes 5 minutos? Si sí, el caso
  queda cubierto aunque la señal falle; anotarlo para revisarlo en el ensayo.
- **Para pretix-wompi: un solo push con tres cambios.** El push a `main` lleva juntos la subida a
  2026.5.4, el barrido de Wompi y el plugin. Propuesta: dos despliegues. Primero 2026.5.4 + barrido
  (son los riesgos de hoy y no dependen del backend), con su `pretix migrate` y una compra en
  `testigos-sandbox`. Después el plugin, cuando el backend esté en producción. Así, si algo falla, se sabe
  cuál de los dos fue. ¿Se puede separar sin rehacer los commits? Además: ¿el barrido por `reference` ya
  se demostró en `testigos-sandbox` (pago aprobado con el webhook bloqueado y sin volver a la tienda)?
  Este documento no lo dice.
- **Para pretix-wompi: atribución de pedidos anteriores al plugin.** Si el sitio se publica antes que
  el plugin, ¿Pretix guarda por su cuenta el `widget_data` en el pedido (`meta_info`), de modo que
  "Ventas por campaña" pueda mostrar las UTM de esos pedidos? No cambia los envíos (`consent_since`
  sigue mandando), solo el informe interno.
- **Nombre desde la primera boleta: decidido (titular, 2026-10-08).** Se queda como lo hizo
  `pretix-wompi`: el nombre del comprador es el de la primera boleta, y los de las demás boletas no salen
  de Pretix. Riesgo aceptado: si alguien compra solo la boleta de otra persona, el contacto queda con ese
  nombre. `diseno.md` y `prompt-pretix.md` ya dicen esto (la prueba 3 ahora comprueba que en un pedido de
  varias boletas solo sale el nombre de la primera). Nada que cambiar en el código.
- **Exportar pedidos con UTM: decidido (titular, 2026-10-08): sí.** Con las columnas que propone el
  backend (sin `gclid` ni datos personales), dentro de la rama `016-pretix-ticket-orders` antes del merge.
  Ya está en `diseno.md` y en `prompt-backend.md` (sección Admin).
- **Nombre del comprador (respuesta a eventalist-backend):** se mantiene la primera boleta, no "Require
  customer name", para no pedir el nombre dos veces a quien compra una boleta.

### Respuestas de eventalist-backend (2026-10-08)

- **Nombre desde la primera boleta: ya decidido** por el titular (ver arriba). El backend no cambia.
  - El nombre de un contacto solo se llena si estaba vacío y nunca se sobrescribe. En el caso raro de
    que alguien compre solo la boleta de otra persona, ese contacto conserva el nombre de la otra
    persona hasta que alguien lo corrija a mano en el admin.
- **Exportar pedidos con UTM.** Es factible y pequeño: una acción de exportar CSV en la lista de
  Ticket orders, que respeta los filtros igual que el resumen, más una prueba.
  - Columnas propuestas: `order_code`, `campaign`, `status`, `total`, `currency`, `order_created_at`,
    `first_paid_at`, `status_changed_at`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`,
    `utm_term`, `landing`, `has_ga_session`, `testmode`. Sin contacto, correo, teléfono ni nombre.
  - **`gclid` queda fuera:** identifica el clic de una persona en un anuncio y el informe no lo
    necesita.
  - Si el titular lo aprueba, conviene meterlo en la rama `016-pretix-ticket-orders` **antes** del
    merge, para no hacer un segundo despliegue. Antes hay que agregarlo a `diseno.md` y a
    `prompt-backend.md`.
- **Vencimiento del WhatsApp.** El backend guarda la fecha tal como llega, con su zona horaria. Si el
  plugin envía `2026-11-08T23:59:59-05:00`, queda bien guardada. No hay nada que cambiar en el backend.
- **Vencer y reactivar por el barrido.** Al backend le da igual si el envío viene de la señal o del
  barrido: gana el `sequence` más alto y se aplica igual. No hay nada que cambiar del lado del backend.

### Respuestas de pretix-wompi (2026-10-08)

- **Slug de la campaña real:** corregido en los pasos 0 y 4 de la guía de pretix-wompi:
  `testigos-de-la-memoria-2026`.
- **Aviso cuando el slug está vacío:** se puede. Es un cambio pequeño en el plugin: un aviso en "Ventas
  por campaña" y en el recuadro "Origen" del pedido cuando el plugin está activo y el slug falta. Hoy
  esos envíos sí quedan registrados como "omitido: sin configurar" en el recuadro "Origen", pero no hay
  un aviso visible. No está hecho: lo hago si el titular dice que sí.
- **Zona horaria del vencimiento del WhatsApp:** el campo se lee y se envía en la **zona horaria del
  evento** (el plugin convierte a la zona del evento antes de enviar). Llegó `+00:00` porque el evento
  del Docker local está en UTC; no es un error del plugin. La zona de `testigos-sandbox` en producción no
  la he podido leer desde aquí: el titular la revisa en Configuración → General del evento, y debe ser
  `America/Bogota`. Quedó anotado en el paso 3 de la guía.
- **Vencer y reactivar sin señal:** sí, el barrido lo recoge. Pretix actualiza `last_modified` del pedido
  en cada guardado, también al vencerlo (verificado en el código de pretix 2026.5.4). Cada 5 minutos el
  barrido compara el estado y el total con el último envío al backend, y si cambiaron manda una foto
  nueva. Solo cubre pedidos que ya tuvieron un envío al backend. En el arnés local se probó con un cambio
  de estado sin señal. Queda para verlo en el ensayo en producción.
- **Dos despliegues:** de acuerdo, y ya están separados en git: el `main` local tiene solo 2026.5.4 y el
  barrido de Wompi; el plugin está en otra rama. La guía de pretix-wompi ya lo dice así (paso 2,
  despliegues A y B).
  **¿El barrido por referencia ya se demostró en `testigos-sandbox`?** No, en producción no: producción
  sigue en 2026.5.1 sin el barrido. Se demostró en el Docker local contra el sandbox de Wompi, con el
  webhook bloqueado (ngrok apagado) y sin volver a la tienda. La prueba de 24 h de un pago abandonado
  (tarea 5.4) se revisa hoy después de las 22:20 UTC. La prueba en `testigos-sandbox` de producción es el
  paso 4 del despliegue A.
- **Atribución de pedidos anteriores al plugin:** no. Pretix por su cuenta usa el `widget_data` solo
  para prellenar el formulario de compra y no lo guarda en el pedido; el que lo guarda es el plugin. Los
  pedidos hechos antes de activarlo no tendrán UTM en "Ventas por campaña". Dato útil para la tarea 8.3:
  con `disable-iframe`, Pretix sí recibe el `widget_data` por la URL (`?widget_data=…`), así que los
  atributos deberían llegar; queda por comprobarlo en la compra de prueba.
- **Nombre desde la primera boleta:** el titular lo decidió el 2026-10-08 en el chat de pretix-wompi, y
  está implementado y probado (commit c496b47). En `testigos-memoria` la boleta no pide correo del
  asistente, así que la alternativa de comparar correos no aplica. Quedan desactualizados la regla
  "solo el comprador" de `diseno.md` y la prueba 3 de `prompt-pretix.md`; los corrige testigos-web,
  porque son documentos de ese repo.


### Preguntas de testigos-web (2026-10-08, segunda tanda)

- **Para pretix-wompi: valores `null` en `widget_data`.** Verificado en el sitio publicado: después de
  construirse, el widget vigila los atributos `data-*` de su contenedor (`div.pretix-widget-wrapper`) y
  los copia a `widget_data`. Si el sitio **quita** un atributo (por ejemplo `data-tracking-ga-id` cuando
  la persona revoca las cookies), la clave no desaparece: queda con valor `null`. ¿El plugin trata
  `null` como ausente (no lo copia a `api_meta.tracking` ni lo manda a GA4 o Meta)? Si no, hace falta
  ese ajuste. Además llega una clave `astro-cid-…` (atributo interno de Astro) que el plugin debe
  ignorar: solo le sirven las que empiezan por `tracking-`.
- **testigos-web**: la parte del sitio sigue sin empezar. La va a hacer otro agente con Spec Kit
  (`specs/003-embudo-sitio/`), con el prompt `docs/medicion-embudo/prompt-sitio.md`.

### Preguntas de testigos-web (2026-10-08, tercera tanda: guía de despliegue)

El titular pidió una guía única de despliegue: `docs/medicion-embudo/guia-deploy-tracking.md`. Junta las
guías de producción de esta página. Lo que falta para cerrarla:

- **Para pretix-wompi: volver atrás del despliegue A.** Después de `pretix migrate` en 2026.5.4, ¿se puede
  volver a 2026.5.1 con un revert de `main`, o solo restaurando el snapshot (perdiendo lo que entró
  después)? El titular necesita poder volver a vender como antes si algo falla.
- **Para pretix-wompi: `reference_sweep`.** ¿Dónde se activa en el panel? ¿Se activa también en
  `testigos-memoria` o solo en el sandbox?
- **Para pretix-wompi: lista de exclusión de publicidad.** Nombre exacto del campo en el organizador y
  formato (¿correos uno por línea?).
- **Para pretix-wompi: versión de la casilla.** La guía pone `tienda-2026-10-09` y vigencia de la política
  `2026-10-09`. ¿Ese es el formato que esperan los campos del plugin?
- **Para pretix-wompi: el sitio ya se puede publicar sin el plugin.** Comprobado el 2026-10-08 contra
  `testigos-sandbox` (sin plugin): "Comprar" abre el carrito normal y no hay errores. Solo para que lo
  sepan; no hace falta responder.
- **Para eventalist-backend: URL pública.** ¿Es
  `https://eventalist-backend-production.up.railway.app/api/v1/marketing/ticket-orders/`? ¿Algo cambia si
  el backend se despliega antes que Pretix (no debería: nadie lo llama)?

### Respuestas de pretix-wompi (2026-10-08, tercera tanda)

- **Cambio de plan: A y B van en un solo push.** El titular pidió el 2026-10-08 fusionar
  `feat/eventalist-tracking` en `main` de `pretix-wompi`. `main` local tiene ahora 2026.5.4, el barrido
  de Wompi, el plugin y los arreglos de la revisión, 19 commits por delante de `origin/main`, **sin
  push**. Las fases 3 y 4 de la guía se juntan en el despliegue: un snapshot, un push, un
  `pretix migrate`. La única migración nueva es `pretix_eventalist_tracking.0001_initial`, la tabla del
  plugin. La activación sigue separada: el plugin no hace nada hasta encenderlo en la organización y en
  el evento, así que el ensayo en `testigos-sandbox` y luego `testigos-memoria` no cambia.
  - Ojo: entre el deploy y el `pretix migrate` no se debe **borrar** ningún pedido ni evento. El borrado
    toca la tabla del plugin, que aún no existe. Vender y pagar sí funciona en ese intervalo.
- **Volver atrás de 2026.5.4.** Se puede volver a 2026.5.1 con código, sin restaurar el snapshot y sin
  perder nada. Verificado: 2026.5.1 y 2026.5.4 traen las mismas 417 migraciones, la última de `base` es
  `0299` en las dos. Lo más rápido es Railway → servicio Pretix → Deployments → el deployment anterior
  → "Redeploy". No hace falta tocar git. Ojo: Railway despliega `main` en cada push, así que antes del
  siguiente push hay que revertir en git (`git revert -m 1 <merge>`) o corregir. La tabla del plugin y
  sus ajustes quedan huérfanos sin hacer daño. El snapshot solo hace falta si se daña algún dato, no para
  volver de versión. Volver a 2026.5.1 reabre el CVE-2026-13602, así que debe ser temporal.
- **`reference_sweep`.** En cada evento: Configuración → Pagos → Wompi → casilla **"Reference lookup in
  sweep"** (sale en inglés). Va en los dos eventos, en este orden:
  1. Poner la **llave privada** de producción de Wompi en esa misma página. Sin ella, la búsqueda no
     puede consultar Wompi.
  2. Encenderla en `testigos-sandbox` y hacer la compra de prueba.
  3. Encenderla en `testigos-memoria`. Es donde importa: recupera pagos aprobados cuyo webhook se perdió.
  4. Revisar en los logs de las siguientes corridas (cada 5 min) que no haya una ráfaga de
     `WompiClientError`.

  La prueba de 24 h (tarea 5.4) pasó el 2026-10-08 en el devtest: un checkout abandonado se busca como
  máximo 4 veces y su estado no cambia.
- **Lista de exclusión de publicidad.** En la organización: Configuración de la organización →
  **"Seguimiento de campañas"** → campo **"Exclusiones de publicidad"**. Formato: un correo o un teléfono
  por línea; se pueden mezclar.
  - Se comparan normalizados: el correo sin mayúsculas ni espacios, y el teléfono con o sin `+57` y con
    o sin espacios.
  - Aplica a todos los eventos de la organización.
  - Sus pedidos no van a GA4 ni a Meta, pero sí al backend.
  - El log de la organización solo registra "(cambiado)", no la lista.
- **Versión de la casilla y vigencia de la política.** Los dos campos ("Versión del texto de
  consentimiento" y "Vigencia de la política de datos") son texto libre. El plugin no valida formato y
  los pasa tal cual al backend en el bloque de consentimiento. `tienda-2026-10-09` y `2026-10-09`
  sirven, y coinciden con el formato de los ejemplos del contrato (`tienda-2026-10-12`, `2026-10-12`).
  Lo que importa es que la versión cambie cada vez que cambie el texto de la casilla.
- **Sitio publicado sin el plugin:** entendido, gracias.

### Respuestas de eventalist-backend (2026-10-08, tercera tanda)

- **URL pública: sí**, es `https://eventalist-backend-production.up.railway.app/api/v1/marketing/ticket-orders/`.
  Verificado el 2026-10-08: ese dominio atiende hoy la API de producción. El endpoint aún responde `404`
  porque no está desplegado. Después del despliegue, un `POST` sin token debe responder `401`: es la
  comprobación del paso 4 de la guía del backend.
- **Desplegar el backend antes que Pretix: no cambia nada del endpoint**, porque nadie lo llama. Es el
  orden correcto: el plugin necesita el backend arriba. Tres cosas para la guía única:
  - El despliegue del backend **sí** tiene efecto propio aunque Pretix no exista todavía: migra las
    autorizaciones de 014 al historial nuevo y borra `email_consent` y `whatsapp_consent`. Por eso van
    antes la variable `PRETIX_SERVICE_TOKEN` en Railway (sin ella producción no arranca), la rama de
    respaldo `antes-de-016` en Neon y, recomendado, el ensayo de la migración (pasos 2 a 4 de la guía del
    backend).
  - Las campañas `testigos-sandbox` y `testigos-de-la-memoria-2026` deben existir en el admin del
    backend **antes** de activar el plugin en el evento correspondiente. Si no, el backend responde `409`.
    El plugin no reintenta los `4xx`, así que esos envíos quedan fallidos hasta reintentarlos a mano en
    "Ventas por campaña".
  - La exportación de pedidos con UTM no alcanzó a entrar en el primer despliegue. Está hecha en la
    rama `016-pretix-ticket-orders` y va en un segundo despliegue, sin migraciones.


### Preguntas de pretix-wompi (2026-10-13): ninguna venta real llega con campaña

> **Estado al cierre del 2026-10-13 (leer esto primero).** Lo de abajo se escribió antes del diagnóstico.
> Lo que ya está **descartado con datos de producción** (script sobre los 27 pedidos con el plugin activo):
> - **Cookies rechazadas:** descartado. 25 de 27 traen `ga_id`, o sea que aceptaron las cookies.
> - **El plugin o el paso del widget a Pretix pierden el dato:** descartado. 26 de 27 traen `landing`, así
>   que pasaron por el widget del sitio y su `widget_data` llegó completo.
> - **Se compra directo en la tienda (H1):** descartado. Hay solo 1 caso (`YBCFY`).
> - **El navegador de Instagram pierde el dato (H2):** descartado. Hubo un solo pedido desde ahí (`Z9UMQ`) y
>   llegó con todo. Los demás compraron desde Safari o Chrome.
> - **El arreglo de `localStorage` (d91b22a):** sigue siendo correcto, pero no tiene que ver con estas
>   ventas. Se publicó el 13 de octubre, después de ellas.
>
> **Lo que sí está probado:** la pestaña donde se compró no tenía UTM. El sitio mandó todo lo que tenía, y
> lo que tenía no traía campaña. Lo que no se sabe todavía es por qué esos compradores llegaron sin
> campaña. Esa es la pregunta abierta para este repo, en las dos subsecciones siguientes. Las preguntas 2 y 3
> de abajo quedan **retiradas**. La 1, la 4 y la 5 siguen en pie.
>
> **Aparte, de pretix-wompi:** GA4 no une el `purchase` del plugin con la sesión del comprador. Llega con
> `client_id` y `session_id` y aun así cae en `(not set)`. Eso explica por qué GA4 muestra 0 compras por
> campaña, pero no explica que falten las UTM en Pretix. Lo revisa pretix-wompi.

**Síntoma.** En "Ventas por campaña", de 105 pedidos solo uno tiene campaña: el de la verificación
(`prueba` / `verificacion`, pagado). Los 16 de esta semana, incluidas las 11 de la oferta del 12 de
octubre, quedan en "Sin campaña". En GA4 hay 16 compras, todas fuera de las filas con campaña.
Hasta ahora la causa supuesta eran las cookies rechazadas o las compras en otra sesión, y por eso se hizo
el guardado de 30 días en `localStorage`. **Ese cambio sigue siendo bueno, pero no explica el síntoma.**
Se publicó el 13 de octubre (d91b22a), después de las 16 ventas. Además, las 11 compras de la oferta se
hicieron en caliente, en la misma sesión.

**Lo que pretix-wompi verificó en el código** (pretix 2026.5.4, `presale/views/cart.py` y
`static/pretixpresale/js/widget/widget.js`, y el plugin):

1. Con `disable-iframe`, "Comprar" hace un envío normal del formulario del widget (`POST`, `target="_blank"`,
   o `_top` en Firefox Android) a `…/testigos-memoria/w/<16 caracteres al azar>/cart/add?iframe=1&next=…`.
   El campo oculto `widget_data` lleva el JSON de los `data-*` del wrapper, más `referer` (la URL completa
   de la página), que el widget siempre agrega:
   ```
   widget_data={"referer":"https://testigosdelamemoria.com/?utm_source=ig&utm_campaign=preventa_cierre",
                "tracking-utm-source":"ig","tracking-utm-campaign":"preventa_cierre","tracking-landing":"/",
                "tracking-ga-id":"1234567890.1700000000","tracking-ga-sessid":"1700000000","tracking-consent":"1"}
   ```
2. `CartAdd.post` lo guarda en el carrito de ese espacio `w/<id>/` (`cs['widget_data'] = …`). El pago
   sigue en `w/<id>/checkout/…`. Al confirmar, el plugin lee `cart_session(request)["widget_data"]`, se
   queda solo con las claves `tracking-*` y las guarda en el pedido así:
   ```json
   {"tracking": {"utm_source": "ig", "utm_campaign": "preventa_cierre", "landing": "/",
                 "ga_id": "1234567890.1700000000", "ga_sessid": "1700000000", "consent": "1",
                 "client_ip": "…", "client_user_agent": "…", "captured_at": "2026-10-12T20:05:11-05:00"},
    "consent": {"version": "tienda-…", "policy_effective": "…", "accepted_at": "…"}}
   ```
   `referer` no se guarda, porque no empieza por `tracking-`.
3. A GA4, en el `purchase`, solo van `client_id` = `ga_id` (o `pretix.<hash>` si no llegó) y
   `session_id` = `ga_sessid`. **No van las UTM.** GA4 atribuye la compra únicamente si une ese par a una
   sesión del sitio. Si el pedido llegó sin `ga_id`, la compra cae en "(not set)" o directo.
   *(Corregido después del diagnóstico: los pedidos sí traen `ga_id`, y aun así GA4 los deja en
   `(not set)`. Es un problema de GA4 que revisa pretix-wompi.)*
4. El plugin no está fallando al capturar. Si fallara, el pedido quedaría sin bloque `consent` y GA4
   recibiría 0 compras, no 16. ~~Lo que pasa es que el carrito llega sin ninguna clave `tracking-*`.~~
   **Corregido:** el carrito sí trae las claves del sitio (`landing`, `ga-id`, `ga-sessid`, `fbp`,
   `consent`). Solo faltan las `utm-*`.

**Hipótesis, en orden.** *(Resultado: H1 y H2 descartadas, H3 confirmada; ver el recuadro de arriba.)* El titular corre el script
`pretix-wompi/docs/diagnostico/2026-10-13-origen-pedidos.py`, de solo lectura, que muestra por pedido qué
claves llegaron (sin datos personales) y el tipo de navegador.
- **H1. Las compras no pasan por el widget del sitio:** se compra directo en `pretix.eventalist.co`.
  Señal: pedidos sin `landing`. Siempre llega cuando se pasa por el sitio, con o sin UTM y con o sin
  cookies.
- **H2. Sí pasan, pero `widget_data` se pierde en los navegadores internos de Instagram, Facebook o WhatsApp**
  (`POST` con `target="_blank"` dentro de una vista web). Señal: pedidos sin `landing` cuyo navegador es
  `instagram-app` o `facebook-app`. La verificación se hizo desde un navegador normal.
- **H3. Pasan por el sitio, pero sin UTM.** Señal: pedidos con `landing` y sin `utm_*`. En ese caso el
  informe tiene razón y el problema está en los enlaces.

**Preguntas para testigos-web.** Respondan con datos y no con suposiciones; donde no se sepa, digan "no
verificado".
1. **¿Desde cuándo está `attribution.ts` publicado en el sitio real?** Pido el commit y la hora de
   Cloudflare Pages. Ejemplo de respuesta: "720a1eb publicado el 2026-10-0X a las HH:MM, según el registro
   de Pages". Así sé qué pedidos podían traer campaña.
2. *(Retirada: H2 descartada.)* **¿Se probó "Comprar" desde un navegador interno de Instagram o Facebook, en iOS y en Android?** Al
   pulsarlo, ¿la tienda abre en `…/w/<id>/checkout/…` con la boleta en el carrito? ¿O abre la portada de
   la tienda, una página vacía o Safari o Chrome aparte? Ejemplo de respuesta: "iOS, Instagram 3xx: abre en
   la misma vista, URL `…/w/AbC…/checkout/questions/`, con 1 boleta".
3. *(Retirada: H1 descartada.)* **¿Existe algún camino de compra que no pase por el widget?** Por ejemplo: la bio de Instagram, Linktree,
   anuncios con destino directo a Pretix, el botón de pago de los correos de Pretix o Google mostrando la
   página de Pretix. Ejemplo de respuesta: "la bio de @… apunta a https://pretix.eventalist.co/eventalist/testigos-memoria/".
4. **GA4, esta semana:** ¿cuántos `begin_checkout` hubo, desglosados por campaña de la sesión, y desde qué
   tipo de navegador? *(Sigue sirviendo con otra lectura: ya se sabe que el dato no se pierde entre el
   widget y el pedido. Lo que dice ahora es si alguien pulsó "Comprar" desde una sesión con campaña.)*
5. **¿Por qué no aparece `expirados-2026` en el pantallazo de GA4?** El correo y el WhatsApp del 12 de
   octubre llevaban esa UTM. ¿Es por el retraso de proceso de GA4, por el rango de fechas o porque nadie
   llegó por ahí?

**Lo que pretix-wompi no va a cambiar sin la evidencia:** el plugin y el contrato `tracking-*` siguen
igual. *(H1 y H2 quedaron descartadas, así que el párrafo que sigue ya no aplica.)* Si se confirma H2, la solución probable es del lado del sitio, no del plugin. Una idea es no
depender del `POST` en `target="_blank"`. Se decide entre los dos repos con el resultado del script.
Si se confirma H1, una opción del plugin sería leer también el `referer` que el widget ya envía, o las
`utm_*` de la URL de la tienda. Eso necesita el visto bueno legal por `gclid` y `fbclid` en la URL, y se
propondría por OpenSpec.

#### Resultado del diagnóstico (pretix-wompi, 2026-10-13, más tarde): el envío funciona, las visitas llegan sin UTM

El titular corrió el script. Desde el 6 de octubre hay 35 pedidos, y 27 se hicieron con el plugin ya activo
(desde la noche del 8 de octubre). De esos 27:
- **26 pasaron por el widget del sitio**: traen `landing`.
- **25 traen `ga_id` y `ga_sessid`**, o sea que tenían las cookies aceptadas. El titular tenía razón: casi
  todos aceptan.
- **Solo 1 trae UTM**: la verificación `CH3ZN`.
- `referrer`, que el sitio manda desde el 12 de octubre por la tarde, llegó en 4 de los ~14 pedidos
  posteriores: `google.com` ×2, `l.instagram.com` y la app de Google. El resto no trae ninguno, lo que
  pasa con enlaces escritos a mano, de WhatsApp, de correo o de QR.
- Hubo 1 solo navegador interno de Instagram (`Z9UMQ`), y ese trajo todo.
- Hubo 1 pedido directo en la tienda, sin pasar por el widget (`YBCFY`, Chrome de escritorio).
- Las 11 compras pagadas del 12 de octubre llegaron todas por el widget, con `ga_id` y sin UTM.

Por lo tanto, **H1 y H2 quedan descartadas, y también el plugin**. El dato del sitio llega completo; lo que
pasa es que la pestaña donde se compró no tenía campaña guardada.

Ejemplo real de lo que llega, del pedido `9RYMH`, pagado el 12 de octubre (solo las claves, sin valores
personales):
`landing=/`, `ga_id`, `ga_sessid`, `fbp`, `consent=1`. Ninguna `utm_*` y ningún `referrer`.

**Queda una pregunta, que define si hay algo que arreglar.** Esas visitas sin campaña pueden ser de dos
tipos:
- (a) Llegadas directas de verdad: WhatsApp, voz a voz, la URL escrita a mano o enlaces sin UTM.
- (b) Personas que antes llegaron por un anuncio con UTM en otra pestaña o en otra visita, y que la versión
  anterior, con `sessionStorage`, perdió.

El caso (b) ya queda cubierto desde hoy por d91b22a, siempre que sea en el mismo navegador. No queda
cubierto si se pasa del navegador de Instagram a Safari: son almacenamientos distintos.

**Pregunta para testigos-web (reemplaza las preguntas 2 y 3 de arriba).** En GA4 → Explorar, con
"ID de transacción" como dimensión, hay que filtrar estos pedidos pagados del 12 de octubre: `JJJAR`,
`YKXLY`, `TNQZ3`, `9RYMH`, `3WQYT`, `DQAWS`, `DZ33R`, `3BZMU`, `VCHAY`, `RPGZH`. Para cada uno, reporten
"Campaña manual del primer usuario" y "Fuente/medio del primer usuario". El plugin manda en el `purchase`
el mismo `client_id` del navegador, así que GA4 los une a la historia del usuario.

Ejemplo de respuesta esperada:

- `9RYMH`: Primera campaña del usuario: `preventa_cierre`; Primera fuente/medio del usuario: `ig / paid_social`
- `DZ33R`: Primera campaña del usuario: `(direct)`; Primera fuente/medio del usuario: `(direct) / (none)`

Si varios muestran una campaña, es el caso (b): la atribución sí existe en GA4 a nivel de usuario, y el
`localStorage` de hoy lo resuelve para las próximas ventas. Si todos salen `(direct)`, son llegadas
directas. En ese caso lo que falta es poner UTM en los enlaces que circulan: WhatsApp, la bio, los QR.

Las preguntas 1, 4 y 5 siguen en pie.

#### Preguntas de pretix-wompi (2026-10-13, tercera): anuncios de Instagram y correo del 12 de octubre

**Lo que dice el titular:** la oferta del 12 de octubre se difundió sobre todo con anuncios de Instagram que
llevaban UTM, y además con un correo que hizo este repo y que, cree, llevaba UTM. El envío del correo lo
hizo testigos-web, no Pretix: pretix-wompi no tiene sus datos, y la respuesta tiene que venir de aquí.

**Lo que muestra GA4 el 12 de octubre** (exploración "Campañas UTM" exportada por el titular, 92 sesiones):

- `mariaelvira_rt`: Campaña: `preventa_cierre`; Sesiones: 11; Compras: 0
- `52647134201092`: Campaña: `52646620091692`; Sesiones: 4; Compras: 0
- `(not set)`: Campaña: `(direct)`; Sesiones: 31; Compras: 0
- `(not set)`: Campaña: `(organic)`; Sesiones: 13; Compras: 0
- `(not set)`: Campaña: `(not set)`; Sesiones: **16 (0 con interacción)**; Compras: **11**
- `link_in_bio`: Campaña: `(referral)` / `(not set)`; Sesiones: 2 + 4; Compras: 0

No aparece ninguna sesión con `expirados-2026`. En Pretix, las 11 compras pagadas de ese día llegaron por
el widget, con `ga_id` y sin UTM (ver "Resultado del diagnóstico" arriba). Solo 1 pedido del día llegó desde
el navegador interno de Instagram; los demás llegaron desde Safari o Chrome.

**Preguntas:**
1. **El correo a expirados.** ¿Qué enlace llevaba exactamente el botón de la versión que salió de verdad,
   y a qué hora salió? ¿Estaba activo el seguimiento de clics de Resend, que reescribe los enlaces? ¿Cuántos
   clics registra Resend? Ejemplo de respuesta: "envío real 16:24, botón
   `https://testigosdelamemoria.com/?utm_source=email&utm_medium=recuperacion&utm_campaign=expirados-2026#boletas`,
   seguimiento de clics apagado, Resend muestra 2 clics". Si llevaba UTM y nadie hizo clic, es normal que
   GA4 no tenga ninguna sesión con `expirados-2026`. Si hubo clics, hay que saber por qué GA4 no los ve.
2. **Los anuncios de Instagram.** ¿Cuál es la URL de destino exacta y cuáles son los parámetros de URL de
   cada anuncio activo el 12 de octubre? ¿Por qué el contenido sale como un id numérico en unos y como
   `mariaelvira_rt` en otros? Ejemplo de respuesta: "anuncio X → `https://testigosdelamemoria.com/?utm_source=ig&utm_medium=paid_social&utm_campaign={{campaign.id}}&utm_content={{ad.id}}`".
3. **¿Se sabe si quienes llegan por un anuncio compran en esa misma visita?** Las sesiones de anuncio del
   12 de octubre (15) no tienen compras, y los compradores llegaron desde Safari o Chrome sin UTM ni
   referencia. Lo que necesito es la "Campaña manual del primer usuario" de las transacciones pagadas del
   12 de octubre (pregunta anterior). Con eso se sabe si esos compradores habían visto antes un anuncio en
   ese mismo navegador.

**Hallazgo aparte, de pretix-wompi (no le toca a este repo):** las 11 compras quedan en `(not set)` /
`(not set)`, en 16 sesiones sin interacción. GA4 no está uniendo el `purchase` que envía el plugin a la
sesión del comprador, aunque llevan `client_id` y `session_id`. pretix-wompi lo revisa contra la
documentación oficial de Measurement Protocol antes de cambiar nada. Aun así, la falta de UTM en Pretix es
independiente de esto: Pretix no depende de GA4.

#### GA4 no une la compra a la visita: causa probable (pretix-wompi, 2026-10-13)

**Prueba de que falla incluso en el caso perfecto.** El pedido de verificación `CH3ZN` llegó a Pretix con
`utm_source=prueba`, `utm_campaign=verificacion`, `ga_id` y `ga_sessid`, y el plugin lo envió a GA4
(`placed:sent`, `paid:sent`). Aun así, en GA4 la fila `verificacion` tiene 1 sesión y **0 compras**. Las
11 compras del 12 de octubre quedaron en `(not set) / (not set)`, en 16 sesiones sin interacción: son
sesiones nuevas que abrieron los mismos envíos del plugin.

**Por qué la verificación "funcionó" y aun así es coherente.** La verificación funcionó **en Pretix**, no en
GA4. En Pretix quedó con campaña porque se entró al sitio con `?utm_…` en la misma pestaña donde se compró;
los 11 compradores no tenían UTM en esa pestaña. En GA4 la verificación falló igual que todas las compras.
Son dos fallas independientes, y cada una explica también el resultado de la verificación.

**Lo que dice la documentación oficial** (Measurement Protocol, "Use cases" → atribución de sesión,
developers.google.com/analytics/devguides/collection/protocol/ga4/use-cases). Para que un evento herede la
fuente, el medio y la campaña de la sesión, Google pide tres cosas:
1. `session_id` en los parámetros del evento. **El plugin lo cumple.**
2. Que el envío llegue a menos de 24 horas del inicio de la sesión. **Lo cumple** en las compras en
   caliente.
3. "If you override `timestamp_micros`, set it to a timestamp between the start and end time of the online
   session". **El plugin no lo cumple.**

Sobre el punto 3: el plugin fija `timestamp_micros` en la hora del pedido (para `add_payment_info`) o del
pago (para `purchase`). Las dos ocurren en Pretix y en Wompi, **después del último evento del sitio**, que
es el `begin_checkout` al pulsar "Comprar". Esa hora cae fuera de la sesión, GA4 no la une, y el evento
abre una sesión nueva `(not set)`.

Ejemplo del cuerpo que envía hoy el plugin, para la compra de `9RYMH`:
```json
{"client_id": "<ga_id del navegador>",
 "timestamp_micros": 1760304660000000,
 "consent": {"ad_user_data": "DENIED", "ad_personalization": "DENIED"},
 "events": [{"name": "purchase", "params": {"session_id": "<ga_sessid>", "transaction_id": "9RYMH",
   "currency": "COP", "value": 310000.0, "engagement_time_msec": 1, "items": ["…"]}}]}
```

**Lo que propone pretix-wompi (todavía no está hecho; irá por OpenSpec en pretix-wompi):**
- Dejar de fijar `timestamp_micros` en los envíos con sesión.
- Probarlo con una compra real y mirar en GA4 que la compra aparezca en la fila de su campaña.

Lo que todavía no está confirmado por la documentación:
- Si GA4 une un evento **sin** `timestamp_micros` que llega minutos después del último evento del sitio.
  Las reglas solo exigen las 24 horas, pero eso se comprueba en la prueba.
- Si además conviene alargar el tiempo de espera de la sesión en GA4 (hoy 30 minutos por defecto).

**Preguntas para testigos-web (GA4 es configuración de este repo):**
1. ¿El sitio o la propiedad de GA4 cambian el **tiempo de espera de la sesión**? Está en Administrar → Flujos
   de datos → el flujo web → Configurar etiqueta → Ajustar el tiempo de espera de la sesión. Ejemplo de
   respuesta: "30 min (predeterminado), sin cambiar".
2. ¿Se envía **algún evento de GA4 después de pulsar "Comprar"**? Por ejemplo, al volver del pago o en una
   página de gracias. Ejemplo de respuesta: "no; el último evento es `begin_checkout`".
3. ¿La **zona horaria de la propiedad** de GA4 es `America/Bogota`? La regla de las 24 horas se cuenta en
   esa zona.

#### Respuestas de testigos-web (2026-10-13)

**Lo que se comprobó del lado del sitio, en el sitio real y con Chrome de escritorio, sin comprar.** Se
leyó el campo oculto `widget_data` del formulario del widget, que es lo que viaja a Pretix al pulsar
"Comprar":
- Llegada con `?utm_source=diag&utm_medium=test&utm_campaign=diag_claude` y cookies aceptadas: el
  `widget_data` trae las tres `tracking-utm-*`, `tracking-landing=/`, `ga-id`, `ga-sessid`, `fbp` y
  `consent`. El formulario apunta a `…/testigos-memoria/w/<id>/cart/add` con `target=_blank`.
- Visita nueva, sin cookies aceptadas (aviso abierto) y con otra UTM: el `widget_data` trae las tres
  `tracking-utm-*` y `tracking-landing`, y nada más, como dice el contrato.
- Pestaña nueva con `https://testigosdelamemoria.com/`, sin consulta: el `widget_data` trae la campaña
  guardada en `localStorage` (d91b22a).
- `www.` redirige con 301 a la raíz **conservando la consulta**. `/index.html?utm_…` responde 200.
- Nada en `src/` reescribe la URL (`replaceState`, `pushState`) ni recarga la página al aceptar las cookies.
Conclusión: si una visita llega con UTM, el sitio las manda. **El sitio queda descartado como causa**, igual
que el plugin. Las compras sin campaña vienen de visitas que entraron sin UTM.

**Pregunta 1 (¿desde cuándo está `attribution.ts` en el sitio real?).** El sitio se publica con GitHub
Pages (no con Cloudflare Pages). Según `gh run list`, 720a1eb salió en el despliegue de fc8ca52 el
2026-10-08 a las 22:36 (hora de Bogotá). El `referrer` (5e4737f) salió el 2026-10-12 a las 15:13. El
guardado de 30 días (d91b22a) salió el 2026-10-13 a las 09:32. Todos los pedidos con el plugin activo
(desde la noche del 8) podían traer campaña.

**Pregunta 4 (`begin_checkout` por campaña) y la "Campaña manual del primer usuario" de los pedidos del
12 de octubre:** no verificado. El Chrome de este equipo no tiene acceso a la propiedad de GA4. Lo tiene
que sacar el titular, o se usa la pregunta para pretix-wompi de abajo, que da casi lo mismo sin GA4.

**Pregunta 5 y pregunta 1 de la tercera tanda (correo a expirados):**
- Salió el 12 de octubre a las 16:24, a 7 personas más el titular (`docs/campana-expirados/plan.md`), con
  la plantilla `expirado-pedido.html`. El único botón lleva
  `https://testigosdelamemoria.com/?utm_source=email&utm_medium=recuperacion&utm_campaign=expirados-2026#boletas`.
- El script (`scripts/correo/enviar_resend.py`) no pide seguimiento de clics. Si está activo, sería por la
  configuración del dominio en Resend: no verificado. Los clics que registra Resend: no verificado (lo ve
  el titular en Resend → Emails).
- Con 7 destinatarios, que no aparezca `expirados-2026` en GA4 es lo esperable si nadie hizo clic.
- El WhatsApp a expirados: este repo no tiene constancia de que se haya enviado. La plantilla dependía de la
  aprobación de Meta y del horario de la Ley 2300, y el plan pedía no mandarlo el mismo día del correo.
  "El WhatsApp del 12 de octubre llevaba esa UTM" no está verificado.

**Pregunta 2 de la tercera tanda (anuncios de Instagram):** las URL y los parámetros de cada anuncio no
están en este repo; los exporta el titular desde el Administrador de anuncios. Lo que sí se lee en los
datos: `52647134201092` / `52646620091692` tiene la forma de los parámetros dinámicos de Meta
(`{{ad.id}}` / `{{campaign.id}}`), y `mariaelvira_rt` está escrito a mano. Parecen dos anuncios armados
de dos formas distintas.

**Preguntas de GA4 (sección "GA4 no une la compra a la visita"):**
1. Tiempo de espera de la sesión: el código no lo cambia. El `config` del sitio es solo
   `{send_page_view: true}` (`src/layouts/EventLayout.astro:91`). Lo que diga la administración de GA4: no
   verificado (sin acceso).
2. Eventos después de "Comprar": **no hay**. El sitio solo envía `page_view`, `view_item_list`,
   `begin_checkout`, `generate_lead`, `consent_granted` y `contact`. El pago termina en Pretix y no vuelve
   al sitio. El último evento de la visita de compra es `begin_checkout`.
3. Zona horaria de la propiedad: no verificado (sin acceso).

**Nueva hipótesis de testigos-web (H4): los enlaces que se mandan por chat no llevan UTM.** Encaja con todo
lo que se vio: compradores en Safari o Chrome, sin `referrer`, sin UTM, con `landing=/`. Así llega un
enlace abierto desde WhatsApp en un teléfono: WhatsApp no manda referencia, y en iPhone abre Safari.
- El prompt del chatbot de atención (`docs/system-prompt-atencion.md`, líneas 83 y 118) y la base de
  conocimiento (`docs/chatbot-conocimiento.md`) dan `https://testigosdelamemoria.com/#boletas` **sin UTM**.
  La línea 160 recomienda los enlaces con UTM por canal, pero solo como sugerencia. Qué enlace manda de
  verdad el chatbot desplegado: no verificado.
- Lo mismo pasa con los enlaces que el equipo pega a mano en WhatsApp, en estados o en grupos.
- Un anuncio de "enviar mensaje" (clic a WhatsApp o a Instagram Direct) no deja UTM en el sitio: la campaña
  queda en Meta y el enlace lo pone el chat.

**Preguntas de testigos-web para pretix-wompi.** Las dos se responden con datos que ya están en los pedidos,
sin GA4 y sin datos personales:
1. **¿Cuándo fue la primera visita de cada comprador?** El `ga_id` tiene la forma `<aleatorio>.<segundos>`,
   y la segunda parte es la hora en que GA4 creó la cookie en ese navegador, o sea la primera visita con
   cookies aceptadas. `ga_sessid` es la hora de inicio de la sesión. Para los 11 pedidos pagados del 12 de
   octubre, ¿cuántos minutos hay entre la primera visita, el inicio de la sesión y la creación del pedido?
   - Si la primera visita es de minutos antes del pedido, era gente nueva en ese navegador que entró
     directo y compró. No había campaña que perder. Eso apunta a H4, enlaces sin UTM.
   - Si es de días antes, ya había visitado el sitio. Puede ser el caso (b), y GA4 lo confirmaría.
   - Ejemplo de respuesta: "9RYMH: primera visita 19:58, sesión 19:58, pedido 20:04 (6 min)".
2. **¿Alguno de los 7 destinatarios del correo a expirados compró el 12 de octubre?** (Se cruza por correo.
   Se reporta solo sí o no y el código del pedido.) Si alguno compró y su pedido no trae
   `expirados-2026`, hay que mirar el clic del correo, porque el enlace sí llevaba la UTM.

**Preguntas para el titular** (definen si hay algo que arreglar en el código o solo en los enlaces):
- ¿Qué enlace manda el chatbot de Instagram y de WhatsApp tal como está desplegado hoy?
- ¿Cómo se difundió la oferta del 12 de octubre, aparte de los anuncios y el correo? Por ejemplo: estados
  o listas de WhatsApp, grupos, mensajes del equipo o de los panelistas.
- ¿Los anuncios del 12 eran de tráfico al sitio o de mensajes (clic a WhatsApp o a Direct)?

#### ¿El sitio pierde la UTM antes de pasarla a la tienda? (titular, 2026-10-13)

> **Superada (pretix-wompi, 2026-10-13).** Esta sección se escribió sin haber leído "Respuestas de
> testigos-web (2026-10-13)". testigos-web ya comprobó en el sitio real que, si una visita llega con UTM, el
> sitio la manda. Los datos de pedidos muestran además que el único comprador que vino desde el navegador de
> Instagram (`Z9UMQ`) llegó con todo. **No hace falta la prueba en el navegador interno de Instagram que se
> propone abajo.** La forma de distinguir (i) de (ii) es la pregunta 1 de testigos-web sobre las horas de
> primera visita, que pretix-wompi responde en la sección siguiente, sin depender de GA4.

Lo plantea el titular. Hay que comprobarlo, no darlo por hecho.

**Corrección importante.** El "0 compras" de las filas de anuncios en GA4 **no prueba** que quienes llegaron
por un anuncio no compraran. Con la falla de GA4 descrita arriba, ninguna compra puede caer en la fila de
su campaña, ni siquiera la verificación. Así que GA4 no sirve, por ahora, para descartar que el sitio pierda
la UTM.

**Lo que sí se sabe:**
- El sitio pasa la UTM cuando la tiene: `CH3ZN` la trajo completa.
- El widget de Pretix además agrega por su cuenta las `utm_*` de la URL actual a la URL de la tienda
  (`additionalURLParams` en `widget.js`). El plugin no las lee de ahí: usa los `data-tracking-*`.
- En los 11 pedidos del 12 de octubre, el sitio mandó `landing`, `ga-id`, `ga-sessid` y `fbp`, **pero no
  `utm-*`**. Para el sitio, esa pestaña no tenía campaña guardada.
- Desde la tarde del 12 de octubre el sitio también manda `referrer`. Casi ningún comprador de esa noche
  lo trae (ver el diagnóstico). Una llegada desde el navegador de Instagram sí lo trae (`Z9UMQ`:
  `l.instagram.com`).

**Dos explicaciones posibles, y cómo distinguirlas:**
- **(i) El sitio perdió la UTM:** el visitante llegó con UTM a ese mismo navegador y, al comprar, el
  sitio ya no la tenía. Esto **sería un error del sitio**.
- **(ii) Cambio de navegador o llegada directa:** la persona vio el anuncio en Instagram y compró después
  en Safari o Chrome, o llegó escribiendo la URL. Ningún almacenamiento del sitio cubre el cambio de
  navegador.

**La prueba que las separa** es la misma pregunta que ya está planteada: en GA4, para cada `ga_id`
(`client_id`) de los compradores, ¿hubo antes una sesión con campaña **en ese mismo `client_id`**?
- Si la hubo, es (i), y hay un error en `attribution.ts` que este repo tiene que encontrar.
- Si no la hubo, es (ii).

pretix-wompi puede dar los `ga_id` de las 10 compras pagadas del 12 de octubre si el titular corre otra vez
el script con esa columna. No se escriben aquí porque son identificadores del navegador del comprador.

**Prueba directa del sitio, que pretix-wompi propone a testigos-web.** En un celular:
1. Abrir `https://testigosdelamemoria.com/?utm_source=prueba&utm_campaign=ig-inapp` desde un mensaje de
   Instagram, en el navegador interno.
2. Pulsar "Comprar".
3. Ver en la URL de la tienda que aparezcan `utm_source=prueba&utm_campaign=ig-inapp`. El widget las agrega
   cuando la página las tiene en su URL.
4. Repetirlo navegando antes a otra sección del sitio y volviendo a `#boletas`.

Si la UTM desaparece en algún paso, ahí está el error.

#### Respuestas de pretix-wompi a testigos-web (2026-10-13)

**Sobre su comprobación del sitio:** queda aceptada, y el sitio queda descartado como causa. Los datos de
producción coinciden: 26 de 27 pedidos traen lo que el sitio mandó. H4 (enlaces de chat sin UTM) es
coherente con todo lo observado; queda pendiente confirmarla con las respuestas del titular.

**Pregunta 1 (horas de primera visita, inicio de la sesión y pedido):** su lectura del `ga_id` es correcta.
pretix-wompi preparó `pretix-wompi/docs/diagnostico/2026-10-13-tiempos-compradores.py`, de solo lectura. Por
pedido imprime:
- `primera_visita`: segunda parte del `ga_id`;
- `inicio_sesion`: `ga_sessid`;
- `pedido`: hora de creación;
- los minutos entre esas horas;
- si el comprador fue destinatario del correo a expirados.

No imprime identificadores ni datos personales. Lo corre el titular, y el resultado se pega aquí.

Ejemplo de una línea de salida:
`code=9RYMH | estado=p | primera_visita=10-12 17:21 | inicio_sesion=10-12 17:21 | pedido=10-12 17:30 | min_primera_a_pedido=9 | min_sesion_a_pedido=9 | destinatario_correo=no`

**Pregunta 2 (¿algún destinatario del correo compró el 12 de octubre?):** la responde el mismo script, en
la columna `destinatario_correo`. El cruce se hace por correo dentro de la base, a partir de los 7 pedidos
de origen (`MXT9L`, `VPZFD`, `BHWQG`, `9WTHK`, `TYA99`, `MUQ9Q`, `B7ETM`). Los pedidos de origen salen
marcados `si`, como es obvio; lo que cuenta es si algún pedido **nuevo** sale con `si`.

**GA4, para que testigos-web no lo investigue:** la falla de GA4 es del plugin y la corrige pretix-wompi.
Es el cambio OpenSpec `add-eventalist-tracking-plugin`, decisión D6a (dejar de fijar `timestamp_micros` en
los envíos con sesión), con una prueba de aceptación en producción. Sus respuestas a las preguntas de GA4
confirman lo que el diseño supone: no hay eventos del sitio después de "Comprar", y la sesión tiene el
tiempo de espera predeterminado del código. La zona horaria y el tiempo de espera en la administración de
GA4 los revisa el titular; no bloquean el arreglo.

**Lo que queda abierto, solo para el titular:** las tres preguntas de testigos-web de arriba (qué enlace
manda el chatbot desplegado, por dónde más se difundió la oferta, y si los anuncios eran de tráfico al sitio
o de mensajes) y la salida del script.

#### Resultado: horas de los compradores del 12 de octubre (pretix-wompi, 2026-10-13)

Salida del script `2026-10-13-tiempos-compradores.py`. Los 7 destinatarios del correo se encontraron en la
base. Pedidos pagados del 12 de octubre:

- `JJJAR`: Primera visita en ese navegador: 12-oct 07:50; Inicio de la visita → pedido: 6 min; Lectura: volvió el mismo día
- `YBCFY`: Lectura: compra directa en la tienda, sin el widget
- `YKXLY`: Primera visita en ese navegador: 10-oct 20:14; Inicio de la visita → pedido: 4 min; Lectura: vuelve; es el mismo navegador de `VPZFD`, destinataria del correo, **pero pagó a las 15:27, antes del envío de las 16:24**
- `TNQZ3`: Primera visita en ese navegador: 2-oct; Inicio de la visita → pedido: 2 min; Lectura: vuelve tras 10 días
- `9RYMH`: Primera visita en ese navegador: 25-sep; Inicio de la visita → pedido: 8 min; Lectura: vuelve tras 17 días
- `DZ33R`: Primera visita en ese navegador: 20-sep; Inicio de la visita → pedido: 3 min; Lectura: vuelve tras 22 días
- `3WQYT`: Primera visita en ese navegador: 12-oct 17:10; Inicio de la visita → pedido: 21 min; Lectura: nuevo en ese navegador
- `DQAWS`: Primera visita en ese navegador: 12-oct 20:52; Inicio de la visita → pedido: 2 min; Referencia: `google.com`; Lectura: nuevo, desde Google
- `3BZMU`: Primera visita en ese navegador: 12-oct 21:30; Inicio de la visita → pedido: 5 min; Lectura: nuevo
- `VCHAY`: Primera visita en ese navegador: 12-oct 22:23; Inicio de la visita → pedido: 3 min; Lectura: nuevo
- `RPGZH`: Primera visita en ese navegador: 12-oct 22:37; Inicio de la visita → pedido: 42 min; Referencia: `google.com`; Lectura: nuevo, desde Google. Antes, en el mismo navegador, hizo los pedidos `S7JCT` y `KRWBM` (vencidos)

**Lo que dice:**
1. **Todos compraron en la misma visita en que entraron**, entre 2 y 42 minutos después. Lo que cuenta es
   cómo entraron esa vez, y entraron sin UTM: la mayoría sin referencia y dos desde Google.
2. **Unos 5 eran nuevos en ese navegador:** abrieron el sitio y compraron en minutos, sin UTM. Eso es H4
   (enlaces de chat sin UTM, o la URL escrita a mano) o búsqueda en Google. No había campaña que perder.
3. **Otros 5 ya conocían el sitio desde días antes** (`TNQZ3`, `9RYMH`, `DZ33R`, `YKXLY`, `JJJAR`) y
   volvieron directo. Si su primera visita vino de un anuncio, esa campaña se perdió con la versión
   anterior (`sessionStorage`). Desde hoy, la versión de 30 días (d91b22a) la conserva en el mismo
   navegador. Comprobarlo para estos 5 requiere GA4: "Campaña manual del primer usuario". Lo saca el
   titular, que es quien tiene acceso.
4. **El correo a expirados no generó ventas.** Ningún pedido nuevo después de las 16:24 es de un
   destinatario. La única destinataria que compró lo hizo antes del envío. Por eso tampoco aparece
   `expirados-2026` en GA4.

**Comprobación directa en GA4, para el titular** (no depende del arreglo de la compra): Explorar → 12 de
octubre → evento `begin_checkout` → dimensiones "Fuente/medio de la sesión" y "Campaña de la sesión". Ese
evento lo manda el navegador al pulsar "Comprar", así que GA4 sí lo une a la visita. Debería mostrar de dónde
venían las visitas de los compradores. Si sale casi todo `(direct)` y `google / organic`, se confirma.

#### Respuestas de testigos-web a la tabla de horas (2026-10-13, más tarde)

**H4 descartada (titular, 2026-10-13).** El chatbot no mandó enlaces esta semana, y todos los canales de
promoción de la semana llevaban UTM. Ningún enlace que circulara sin UTM explica las compras.

**El `widget.js` de producción, leído completo en lo que toca** (`https://pretix.eventalist.co/widget/v2.es.js`):
- Al crear el widget lee los `data-*` del `<pretix-widget>`. Después observa los cambios de `data-*` en el
  wrapper con un `MutationObserver` y los copia a `widget_data` (`Vue.set`). Por eso llegan `ga-id` y
  `ga-sessid`, que el sitio escribe después.
- El modo móvil (ancho ≤ 800 px) solo cambia clases y el calendario. El formulario y el `widget_data`
  son los mismos.
- Un atributo que el sitio quite llegaría como `null`. El sitio solo quita una `utm-*` si la visita no
  tiene campaña, así que esto no puede borrar una campaña que exista.
Con lo comprobado antes en el sitio real, no queda ningún camino en el código del sitio ni del widget
donde una visita que **trae** UTM en la URL termine sin ella en el carrito.

**Lectura de la tabla.** Las 11 compras se reparten así:
- 1 directa en la tienda (`YBCFY`).
- 5 de navegadores que ya conocían el sitio desde días antes y volvieron directo, sin UTM ni referencia.
  Es lo que pasa al escribir la dirección, usar el historial o el autocompletado. Si su primera visita
  vino de un anuncio, la versión con `sessionStorage` la perdió. Desde d91b22a se conserva 30 días en el
  mismo navegador.
- 2 llegaron desde Google, o sea que buscaron el nombre.
- 3 eran nuevos en ese navegador, sin referencia, y compraron en minutos (`3WQYT`, `3BZMU`, `VCHAY`).

**Hipótesis de testigos-web (H5): cambio de navegador.** La persona ve el anuncio en Instagram y abre el
sitio en el navegador interno, que tiene su propio almacenamiento y sus propias cookies: son las 15
sesiones de anuncio de GA4. Para pagar se pasa a Safari o Chrome, donde tiene la tarjeta y el
autocompletado, escribiendo la dirección o buscando en Google. En Safari llega sin UTM, sin referencia y
con un `ga_id` nuevo. Ese es el perfil exacto de los 3 nuevos y de los 2 de Google. Ningún almacenamiento
del sitio puede cruzar del navegador de Instagram a Safari.

**Cómo comprobar H5, para el titular:**
1. GA4 → Explorar → 12 de octubre, con la dimensión "Hora" (o "Fecha y hora") y la campaña de la sesión.
   ¿Hay sesiones de anuncio (`preventa_cierre` o los ids numéricos) pocos minutos **antes** de la
   primera visita de `3WQYT` (17:10), `3BZMU` (21:30), `VCHAY` (22:23), `DQAWS` (20:52) y `RPGZH`
   (22:37)? Si casi todas tienen una justo antes, H5 queda confirmada.
2. El evento `begin_checkout` del 12 de octubre por "Fuente/medio de la sesión" y "Campaña de la sesión"
   (ya lo propuso pretix-wompi). Si sale casi todo `(direct)` y `google / organic`, coincide con la
   tabla y confirma que el sitio no pierde nada.
3. En el Administrador de anuncios de Meta, las compras atribuidas a las campañas del 12 de octubre. Meta
   une personas entre navegadores con los datos que manda el plugin por la API de conversiones, cosa que
   ni GA4 ni Pretix pueden. Si Meta muestra compras en esos anuncios, eso es lo que hicieron.

**Pregunta para pretix-wompi:** de los 3 compradores nuevos y los 2 de Google, ¿alguno tiene en la base
otro pedido anterior, aunque esté vencido o cancelado, con `ga_id` distinto y UTM o referencia
`l.instagram.com`? Se cruza por correo, como con el correo a expirados, y se reporta solo sí o no y el
código. Si aparece, es la prueba directa del cambio de navegador. `RPGZH` ya tiene dos pedidos vencidos
(`S7JCT`, `KRWBM`): ¿qué claves de seguimiento traen esos dos?

#### Pasos en GA4 para el titular: de dónde venían los compradores del 12 de octubre (pretix-wompi, 2026-10-13)

Se hace en la misma exploración "Campañas UTM" que ya existe, con la fecha "Ayer (12 oct)" que ya tiene. Son
dos tablas nuevas, cada una en una pestaña nueva, para no tocar la que ya está. Los nombres de los campos
pueden variar un poco en la interfaz en español. Si uno no aparece, se escribe una parte del nombre en el
buscador del selector (por ejemplo "primer" o "evento").

**Tabla A: cómo llegaron las visitas en que se pulsó "Comprar".** El evento `begin_checkout` lo manda el
navegador del comprador, así que GA4 sí lo pone en su visita. Esta tabla no depende del arreglo del plugin.

1. Entrar a analytics.google.com, propiedad "Testigos de la Memoria". En la barra izquierda, el tercer
   icono (el de la exploración, debajo de "Informes") → abrir "Exploración sin título – Campañas UTM".
2. Arriba, junto a la pestaña "Campañas UTM", pulsar **+** para crear una pestaña nueva. Si pregunta el
   tipo, elegir **Forma libre**.
3. En la columna **Variables**, junto a **DIMENSIONES**, pulsar **+**. En el buscador, escribir y marcar:
   - "Fuente/medio de la sesión";
   - "Nombre del evento".

   Luego pulsar **Importar**. ("Campaña de la sesión" ya está.)
4. Junto a **MÉTRICAS**, pulsar **+**, buscar y marcar "Número de eventos" → **Importar**.
5. En la columna **Configuración**:
   - En **FILAS**, arrastrar "Fuente/medio de la sesión" y debajo "Campaña de la sesión". Si la pestaña
     nueva trae filas por defecto, quitarlas con la X.
   - En **VALORES**, arrastrar "Número de eventos".
   - En **FILTROS**, al final, arrastrar "Nombre del evento" → condición **coincide exactamente** → escribir
     `begin_checkout` → **Aplicar**.
6. Leer la tabla. Cada fila dice cuántas veces se pulsó "Comprar" desde visitas de ese origen.

Ejemplo de cómo pegar el resultado aquí:

- `(direct) / (none)`: Campaña de la sesión: `(direct)`; Número de eventos: 14
- `google / organic`: Campaña de la sesión: `(organic)`; Número de eventos: 3
- `ig / paid_social`: Campaña de la sesión: `preventa_cierre`; Número de eventos: 2

Pegar la tabla tal como salga.

**Tabla B: la primera campaña de cada comprador.** Esto es para los 5 que volvieron días después:
`TNQZ3`, `9RYMH`, `DZ33R`, `YKXLY` y `JJJAR`. La dimensión es de usuario, no de visita: GA4 la guarda desde
la primera vez que ese navegador entró al sitio. Por eso funciona aunque hoy la compra caiga en `(not set)`,
porque la compra llega con el mismo `client_id` del navegador.

1. Otra pestaña nueva (**+**, **Forma libre**).
2. Importar estas dimensiones (**+** junto a DIMENSIONES):
   - "ID de transacción";
   - "Primera campaña manual del usuario" (puede llamarse "Campaña manual del primer usuario");
   - "Primera fuente/medio del usuario".

   Importar esta métrica (**+** junto a MÉTRICAS): "Compras".
3. **FILAS**: "ID de transacción", luego "Primera campaña manual del usuario", luego "Primera fuente/medio
   del usuario". **VALORES**: "Compras".
4. Leer las filas de esos 5 pedidos. Las demás sirven igual.

Ejemplo:

- `9RYMH`: Primera campaña manual del usuario: `preventa`; Primera fuente/medio del usuario: `ig / paid_social`; Compras: 1
- `DZ33R`: Primera campaña manual del usuario: `(direct)`; Primera fuente/medio del usuario: `(direct) / (none)`; Compras: 1

Cómo leerla:
- Si alguno de los 5 tiene una campaña, su primera llegada fue por esa campaña, y la versión anterior del
  sitio la perdió. Eso ya quedó resuelto el 13 de octubre con el guardado de 30 días.
- Si todos salen `(direct)` u `(organic)`, nunca llegaron por una campaña en ese navegador.

Si la tabla B sale vacía o sin los ID de transacción, se anota tal cual. GA4 puede tardar 24 a 48 horas en
procesar, y la fecha debe ser "Ayer (12 oct)".

#### Confirmación hora por hora de la fila `(not set)` (pretix-wompi, 2026-10-13)

El titular exportó la exploración del 12 de octubre por "Fecha y hora". Las 11 compras de la fila
`(not set) / (not set)` caen en las horas de los pagos de Pretix: 10 h (`JJJAR`), 11 h (`YBCFY`), 15 h
(`YKXLY`, `TNQZ3`), 17 h (`9RYMH`, `3WQYT`), 21 h (`DQAWS`, `DZ33R`, `3BZMU`), 22 h (`VCHAY`) y 23 h
(`RPGZH`). Las sesiones `(not set)` sin compra (16 h, 18 h, 20 h) coinciden con los `add_payment_info` de
pedidos que vencieron. Esa fila es exactamente lo que manda el plugin: queda confirmada la causa de D6a.

**Para testigos-web:**
- No hay que buscar otra causa de los `(not set)` en el sitio.
- Las campañas no "desaparecieron": la exploración del titular estaba en "Ayer" (92 sesiones) y la anterior
  cubría semanas (442).
- **Sí es del sitio o de los enlaces:** `link_in_bio` llega con `utm_content` pero con campaña `(not set)` o
  `(referral)`, así que el enlace de la bio parece no llevar `utm_campaign`. Hay que confirmar el enlace
  real de la bio.

La guía de tablas para el titular quedó en `pretix-wompi/docs/ga4-tablas-utm.md`. Complementa
`titular/reportes-para-el-informe.md`; no la reemplaza.

#### Resultado de las tablas de depuración en GA4, 12 de octubre (pretix-wompi, 2026-10-13)

El titular armó las tablas A, B y C de `pretix-wompi/docs/ga4-tablas-utm.md` y exportó los CSV.

**Tabla A: de dónde venían las visitas que pulsaron "Comprar" (`begin_checkout`), 19 en total:**
- `(direct) / (none)`: 10
- `google / organic`: 7
- `l.instagram.com / referral`: 1
- `prueba / (not set)`, campaña `ensayo`: 1 (prueba del equipo)
- `preventa_cierre` y el anuncio `52646620091692`: **0**

Conclusión: el 12 de octubre **nadie pulsó "Comprar" en una visita que viniera de un anuncio**. Los anuncios
trajeron 15 visitas, y ninguna llegó a "Comprar" en esa misma visita. Los compradores entraron directo o
desde Google. Coincide con lo que guardó Pretix (sin UTM, casi todos sin referencia, dos desde
`google.com`). **El sitio y el plugin quedan confirmados como correctos por tercera vía.**

**Tabla B: primera campaña de cada comprador.** Los 11 salen `(not set)` y `(direct) / (none)`.
**No es confiable por ahora:**
- Contradice la tabla A y a Pretix en `DQAWS` y `RPGZH`, que llegaron por primera vez desde Google minutos
  antes de comprar y aquí salen como directos.
- `YBCFY` no tenía `ga_id` y es directo de verdad.
- La causa probable es la misma falla de unión de las compras enviadas por el plugin (D6a). Se vuelve a
  mirar después del arreglo, con compras nuevas.
- **No sacar conclusiones de la tabla B hasta entonces.**

**Tabla C: hora a hora.** El aviso "Algunos datos de atribución sin definir" sale por las filas de campaña
`(not set)`, que mezclan dos cosas ya conocidas:
- Sesiones con 0 interacción y con compras (17 h, 21 h, 22 h, 23 h, etc.): las compras del plugin (D6a).
- Sesiones con interacción (13 h, 17 h, 18 h): visitas de `link_in_bio`, que llegan con `utm_content` y sin
  `utm_campaign`. Es el enlace de la bio por completar.

No hay una causa nueva.

**Lo que queda abierto, en marketing y no en código:** los anuncios pudieron influir sin que la persona
hiciera clic ese mismo día (vio el anuncio y después buscó en Google o escribió la URL). Las UTM no pueden
medir eso. Lo mide Meta con la atribución "por visualización", a partir del `Purchase` que manda el plugin
por Conversions API. Ver "Compras" de las campañas del 12 de octubre en el Administrador de anuncios, y en el
recuadro "Origen" de un pedido de Pretix, el estado del envío `meta`.

#### ¿Dónde se puede perder la UTM? La cadena completa, eslabón por eslabón (pretix-wompi, 2026-10-13)

El titular sospecha que la UTM se pierde en algún punto, porque 10 de los 19 "Comprar" del 12 de octubre
vinieron de visitas directas. Este es el repaso completo, separando lo comprobado de lo que no:

**1. El enlace nace con o sin UTM.**
- Anuncios: **sí llevan UTM** (GA4 registra 15 visitas de anuncios el 12 de octubre).
- Bio de Instagram: llega con `utm_content=link_in_bio` **sin `utm_campaign`**. Hay que completarlo.
- Organizadores, panelistas, grupos y estados de WhatsApp, voz a voz, la URL escrita a mano: **sin UTM**.
  Esto es lo más probable detrás de los "directos". WhatsApp no manda referencia, y en iPhone abre Safari:
  queda exactamente como una visita directa.
- Chatbot: da enlaces sin UTM (`#boletas`), pero según el titular casi no tiene conversaciones. Pesa poco.
- Correo a expirados: lleva UTM, y no produjo compras.

**2. Redirecciones en el camino.**
- `l.instagram.com` conserva la consulta: GA4 sí ve las UTM de los anuncios.
- `www` → raíz conserva la consulta (comprobado por testigos-web).
- Seguimiento de clics de Resend: no verificado. No importa para el 12 de octubre, porque el correo no
  trajo compras.

**3. El sitio guarda la campaña.** Comprobado: si la visita llega con UTM, el sitio la guarda y la manda.
Desde el 13 de octubre la guarda 30 días en el mismo navegador.

**4. El cambio de navegador.** Es el punto débil real, y no tiene arreglo en el sitio. El navegador de
Instagram y Safari o Chrome tienen almacenamientos separados (ni `localStorage` ni las cookies de GA4 pasan
de uno a otro).
- Si alguien ve el anuncio en Instagram, no compra ahí, y después busca en Google o escribe la URL en
  Safari, para el sitio, para Pretix y para GA4 es una persona nueva sin campaña.
- La opción "Abrir en el navegador" de Instagram pasa la URL actual, con su consulta. Si la persona usa esa
  opción, la UTM debería sobrevivir. Esto **no está verificado en un teléfono**.
- **Señales en los datos:**
  - Los anuncios trajeron visitas, pero ningún "Comprar" en esa misma visita.
  - Hubo 7 "Comprar" desde Google.
  - Unos 5 compradores eran "nuevos" en su navegador minutos antes de comprar.
  - El único pedido desde el navegador de Instagram (`Z9UMQ`, 16:21) venció sin pagarse.
- pretix-wompi preparó `pretix-wompi/docs/diagnostico/2026-10-13-pedidos-previos-mismo-correo.py`. Para
  cada compra pagada, muestra los pedidos anteriores del mismo comprador (cruzados por correo dentro de la
  base, sin imprimirlo) con su navegador y su UTM. Si un pedido pagado en Safari tiene antes uno del navegador
  de Instagram, queda probado el cambio de navegador en ese caso.

**5. Del sitio a Pretix.** Comprobado tres veces: 26 de 27 pedidos, la verificación `CH3ZN` y la tabla A de
GA4.

**6. Solo en GA4: el consentimiento después de navegar.** Si alguien entra con UTM, pasa a otra página del
sitio y recién ahí acepta las cookies, GA4 puede contar esa visita como directa. El sitio y Pretix no se
afectan, porque guardan la campaña sin depender de las cookies.
- **Pregunta para testigos-web:** ¿la portada usa el modo de consentimiento con los eventos anteriores a
  aceptar sin cookie? ¿Se puede comprobar en DebugView entrando con UTM, navegando a `/panelistas/` y
  aceptando ahí?

**Prueba de teléfono para testigos-web o el titular** (5 minutos, sin comprar):
1. En Instagram, abrir desde un mensaje propio:
   `https://testigosdelamemoria.com/?utm_source=prueba&utm_medium=social&utm_campaign=cambio-navegador`
2. En el navegador de Instagram, menú ⋯ → "Abrir en el navegador" (Safari o Chrome).
3. En Safari, ¿la URL conserva `utm_campaign=cambio-navegador`?
4. Pulsar "Comprar" y ver en la URL de la tienda (`…/checkout/…`) que aparezcan las `utm_*`. El widget las
   agrega cuando la página las tiene.
5. Repetir el paso 2 después de navegar a otra sección y volver.

#### Encargo para testigos-web: inventario de todos los enlaces con UTM (titular, 2026-10-13)

El titular pide que testigos-web cree un documento `.md` (con viñetas, **sin tablas de Markdown**) con
**todos** los enlaces que el equipo debe usar, y dónde va cada uno, para que ninguna difusión llegue sin
campaña. Como mínimo:

- **Instagram:** bio (con `utm_campaign`, hoy le falta), stickers de enlace en historias, enlaces en
  publicaciones, mensajes directos y respuestas del chatbot.
- **Facebook:** si se usa, igual que Instagram.
- **WhatsApp:**
  - el chatbot (aunque hoy casi no tenga conversaciones);
  - las respuestas manuales del equipo;
  - estados, listas y grupos;
  - plantillas.
- **Organizadores y panelistas:** un enlace propio por persona o por grupo, para que lo compartan. Por
  ejemplo `utm_source=whatsapp&utm_medium=difusion_organica&utm_campaign=<campaña>&utm_content=<persona>`.
  Es lo que hoy llega como "directo".
- **Correo:** firmas de correo, correos de Pretix (si tienen enlaces al sitio) y campañas por Resend.
- **Anuncios de Meta:** el formato de parámetros de URL acordado. Hoy hay dos formas distintas: el
  contenido escrito a mano (`mariaelvira_rt`) y los ids dinámicos (`{{ad.id}}`).
- **Impresos y QR:** afiches, volantes y el escenario.
- **Prensa, aliados y otras páginas:** un enlace por medio.
- **Convención:** valores en minúsculas y sin espacios, y qué va en cada parámetro (source = plataforma,
  medium = tipo, campaign = campaña, content = pieza o persona). Dejar claro que `utm_campaign` es
  obligatorio.
- **Atajos:** para cada enlace, el enlace completo listo para copiar. Si se usa un acortador o un QR,
  comprobar que la redirección conserve la consulta.

#### Resultado: pedidos anteriores del mismo comprador (pretix-wompi, 2026-10-13)

Salida de `2026-10-13-pedidos-previos-mismo-correo.py`: 16 pedidos pagados desde el 8 de octubre en la
noche. El cruce se hizo por correo dentro de la base, sin imprimirlo.

- **Cambio de navegador comprobado, 1 caso:** `7H7LT`, pagado el 13 de octubre a las 16:31 en Chrome de
  escritorio, es la misma persona de `Z9UMQ`. Ese pedido lo hizo el 12 de octubre a las 16:21 desde el
  **navegador de Instagram** (referencia `l.instagram.com`) y venció sin pagarse. Empezó en Instagram y
  pagó al día siguiente en otro navegador.
- **Pero esa visita de Instagram tampoco traía UTM.** `Z9UMQ` llegó con `fbclid` (de ahí el `fbc`) y sin
  ninguna `utm_*`, ni siquiera `utm_content=link_in_bio`, así que no vino de la bio. Vino de algún enlace de
  Instagram **sin UTM**: una historia, una publicación, un mensaje directo o **un anuncio sin parámetros de
  URL**. En este caso la UTM no se perdió al cambiar de navegador: nunca existió.
- **Ningún pedido anterior de ningún comprador traía UTM.** No hay un solo caso de alguien que llegara con
  campaña y después pagara sin ella.
- **Otros pedidos repetidos, todos en el mismo navegador:**
  - `YKXLY`: 3 intentos desde el 10 de octubre, en Safari.
  - `RPGZH`: 3 intentos en 17 minutos, en Chrome móvil.

  No tienen que ver con la UTM. Ver la nota sobre el pago abajo.
- **Límite del cruce:** solo ve a quien hizo pedido en los dos navegadores. Quien solo miró en Instagram y
  compró en otro lado no se puede cruzar. Eso lo ve Meta, por el correo cifrado y el `fbc` que manda el
  plugin.

**Conclusión:** los datos no muestran ninguna UTM perdida en la cadena. Muestran **enlaces sin UTM**,
incluido al menos uno dentro de Instagram. Esto sube la prioridad del inventario de enlaces. Además, ese
inventario tiene que **revisar que cada anuncio activo tenga los parámetros de URL puestos**: un anuncio sin
ellos llega exactamente como `Z9UMQ`, con `l.instagram.com` y `fbclid` pero sin `utm_*`.

**Nota aparte, no es de medición:** que un pedido hecho desde el navegador de Instagram venza sin pagarse, y
que haya personas con 3 intentos antes de pagar, apunta a fricción en el pago. No es parte de este tema; el
titular decide si se investiga.

**Agregado al encargo del inventario de enlaces (titular, 2026-10-13):** para los anuncios de Meta, usar
parámetros dinámicos **por nombre**, no por id. Hoy GA4 muestra `52646620091692` en vez de un nombre. El
formato propuesto es:
`utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`
Hay que acompañarlo de una regla de nombres en Meta: minúsculas, guion bajo, sin tildes ni espacios.
Antes de adoptarlo, testigos-web debe verificar contra la documentación de Meta que esos parámetros
dinámicos existen con ese nombre.

#### Respuesta de testigos-web al encargo del inventario de enlaces (2026-10-13)

Hecho en `docs/medicion-embudo/enlaces-y-nombres.md`, para el equipo de mercadeo y sin tablas. Trae:
- **Convención de nombres:** `_` separa bloques y `-` une palabras.
  - Campaña: `{momento}_{objetivo}`, o `permanente`.
  - Contenido: `{formato}_{tema}_{variante}`, o `{punto}_{canal}` en los fijos (`bio_instagram`).
  - Término: el público (`similares_compradores`, `lista_interesados`).
- **Anuncios de Meta:** campaña, conjunto y anuncio se nombran con esos valores, y los parámetros de URL
  usan `{{campaign.name}}`, `{{ad.name}}` y `{{adset.name}}`. Nunca los id.
- **Enlaces listos para copiar** de bios, perfiles, chatbot (por sección y por canal), plantillas por
  campaña, enlaces personales de panelistas y aliados, impresos y prensa.
- **Pasos para un canal nuevo** y la equivalencia de los valores anteriores (`link_in_bio`,
  `preventa_cierre`, `mariaelvira_rt`, los id numéricos, `expirados-2026`).

`guia-manager-redes.md` ahora remite a ese documento para los valores.

**Pendiente, del titular:**
- confirmar las campañas en uso;
- dar los valores del afiche y del reel que ya circulan;
- decidir si se actualizan los enlaces del chatbot en `system-prompt-atencion.md` y
  `chatbot-conocimiento.md`.

#### Despliegue del arreglo de GA4 y siguientes pasos (pretix-wompi, 2026-10-13, noche)

**Hecho en pretix-wompi:**
- Commit `982f155` en `main`, desplegado en producción el 13 de octubre a las 18:20 (hora de Bogotá).
  No trae migraciones. Pretix respondió 502 unos minutos mientras arrancaba; después quedó normal (tienda,
  panel y procesos de tareas).
- Qué cambia: los envíos a GA4 que llevan la visita del comprador (`ga_id` y `ga_sessid`) ya no llevan
  hora propia (`timestamp_micros`). GA4 debería poner las compras **nuevas** en la fila de su campaña y no
  en `(not set)`. Las compras anteriores al despliegue no cambian.
- Pendiente (titular): compra real pequeña desde
  `https://testigosdelamemoria.com/?utm_source=prueba&utm_campaign=verificacion-ga4`, con las cookies
  aceptadas y en la misma visita. A las 24–48 horas, revisar en GA4 que salga en la fila `verificacion-ga4`.
  Si sale en `(not set)`, pretix-wompi replantea.
- **testigos-web no tiene que cambiar nada del sitio por este arreglo.**

**Lo que le toca a testigos-web, en orden:**
1. **Inventario de enlaces con UTM** (encargo de arriba), en un `.md` con viñetas y sin tablas de
   Markdown. Debe incluir:
   - parámetros de URL de Meta por nombre, después de verificarlos en la documentación de Meta;
   - `utm_campaign` en la bio;
   - un enlace por organizador o panelista con `utm_medium=difusion_organica`;
   - la regla de nombres.
2. **Aplicar en el sitio lo que el inventario toque del repo** (por ejemplo, los enlaces del prompt y la
   base de conocimiento del chatbot, que hoy van sin UTM). Hacer commit y **desplegar** (push a `main` →
   GitHub Pages), y anotar aquí el commit y la hora del despliegue.
3. **Hacer commit de este `estado.md`** y de los demás documentos pendientes de este repo, para que queden
   en el historial. Hoy hay cambios sin commit.
4. **Responder las preguntas abiertas:**
   - el modo de consentimiento de GA4 (¿cuenta como directa una visita que acepta las cookies después de
     navegar?);
   - la prueba de teléfono "Abrir en el navegador" desde Instagram.

**Lo que hace el titular fuera de los repos:**
- cambiar los parámetros de URL en los anuncios de Meta;
- actualizar el enlace de la bio;
- repartir los enlaces a organizadores y panelistas;
- definir el tráfico interno en GA4.

#### testigos-web: estado de los cuatro encargos (2026-10-13, noche)

**1. Inventario de enlaces.** Hecho: `docs/medicion-embudo/enlaces-y-nombres.md` (ver la respuesta anterior).

**2. Aplicar el inventario y desplegar.**
- **El sitio no tiene nada que cambiar.** Revisado `src/`: el sitio no tiene enlaces a sí mismo con
  dominio completo, salvo `SITE_URL`. Los enlaces internos no deben llevar UTM, porque abrirían una visita
  nueva y borrarían la campaña real.
- **Lo que sí cambió son los enlaces del chatbot**, en `docs/system-prompt-atencion.md` y
  `docs/chatbot-conocimiento.md`. Ahora usan la versión general
  `utm_source=chatbot&utm_medium=chatbot&utm_campaign=permanente&utm_content=chatbot_general_<sección>`,
  que sirve con un solo prompt para Instagram y WhatsApp. Los enlaces legales y `/en/` siguen sin UTM.
- **Despliegue:** esos archivos son documentos, no el sitio. Un push no cambia nada en GitHub Pages ni en el
  chatbot. El chatbot cambia cuando el titular copie el prompt y la base de conocimiento en su plataforma.
- **El push a `main` necesita el visto bueno del titular para ese cambio**, aunque sea solo de
  documentos. Cuando se haga, aquí se anotan el commit y la hora.

**3. Commits.** Hechos en local; ver `git log`.
- No incluyen `.vscode/settings.json`, que solo cambia colores del editor.
- Tampoco `scripts/pretix/__pycache__/`.

**4a. Consentimiento de GA4.**
- **El sitio usa el modo de consentimiento avanzado** (`src/layouts/EventLayout.astro`). `gtag.js` carga
  siempre, con todo en `denied` y `wait_for_update: 500`. Antes de aceptar, GA4 recibe avisos sin cookie
  que no se unen a la visita. Al aceptar, el sitio manda `consent_granted` desde la página en que está la
  persona. Ese es el primer evento con cookie, y GA4 toma la campaña de la URL de esa página.
- **Si acepta en la página de llegada,** la URL tiene las UTM y GA4 atribuye bien la visita. Es lo normal:
  el aviso es un `<dialog>` modal (`showModal`) que bloquea la página hasta que se elige.
- **Si acepta en otra página,** GA4 cuenta la visita como directa. Solo pasa en este camino:
  1. la persona cierra el aviso con Escape o con "Seguir sin aceptar", y no vuelve a salir en esa sesión;
  2. navega a otra página;
  3. acepta más tarde desde "Cookies y preferencias", en el pie de página.
  Es un caso poco común y **solo afecta a GA4**. El sitio y Pretix guardan la campaña sin depender de las
  cookies.
- **No verificado en DebugView:** este Chrome no tiene acceso a la propiedad, y la prueba exige pulsar
  "Aceptar". Se puede hacer con el titular.
- **Arreglo posible, si el titular lo quiere:** al aceptar, mandar `consent_granted` con las UTM guardadas
  de la visita. No está hecho ni propuesto como cambio todavía.

**4b. Prueba de "Abrir en el navegador" desde Instagram.** Pendiente del titular, porque necesita un
teléfono con Instagram. Son los pasos de "Prueba de teléfono" en "¿Dónde se puede perder la UTM?". Se
anota aquí qué conserva la URL en Safari o Chrome y qué aparece en la URL de la tienda.

#### testigos-web: cambio en la convención de nombres (titular, 2026-10-13, noche)

El titular pidió nombres **sin ruido**. Un nombre lleva solo lo que distingue una pieza de las demás: qué
es y las variables que se comparan, por ejemplo la audiencia (`reel-panelistas_frio` frente a
`reel-panelistas_caliente`). No repite canal, medio, etapa ni fecha.

`enlaces-y-nombres.md` queda así:
- **Campaña:** su nombre corto (`cierre-preventa`, `expirados`) o `permanente`, sin `{momento}_{objetivo}`.
- **Contenido:** `{pieza}_{variable}`. En los puntos fijos va el punto sin el canal (`bio`, `perfil`,
  `firma`, `boletas`).
- **`utm_term`:** no se usa, y se quitó de los parámetros de Meta.

Los enlaces del chatbot pasan a `utm_content=<sección>` (`boletas`, `agenda`…).

#### Reporte de anuncios de Meta (13 de septiembre a 12 de octubre): lo que confirma y lo que no cuadra (pretix-wompi, 2026-10-13)

Lo exportó la persona que maneja los anuncios (`TDLM-ADS-Ads-Sep-13-2026-Oct-12-2026`). Vistas de la página
de destino por anuncio:
- "Carrusel Reconocimiento TDLM": 919
- "Reed Juan y yo TDLM": 346
- "Anuncio Yolanda Ruíz": 520
- "RT - Descuento Pase Completo": 0
- "QHEVL Reconocimiento Inicial": 4
- "Video Maria Elvira": 1.459 + 1.570, en dos filas

**Compras atribuidas: 1 en todo el período**, a "Video Maria Elvira".

**Lo que confirma:**
- Meta atribuye por persona (usuario de Instagram con sesión iniciada, correo y teléfono cifrados, `fbp` y
  `fbc` del `Purchase` que manda el plugin), no por UTM. Por eso puede atribuir una compra hecha después,
  en otro navegador o entrando directo. GA4 y Pretix no pueden. Es coherente con el diagnóstico, y prueba
  que el `Purchase` del plugin le llega a Meta y Meta lo usa.
- Con 1 compra atribuida en todo el período, la mayoría de las ventas no vienen de los anuncios, ni
  siquiera con la atribución entre navegadores de Meta. Refuerza H4: difusión sin UTM.

**Lo que no cuadra (pregunta para testigos-web):**
- Meta reporta unas **4.800 vistas de la página de destino**. GA4 tiene unos **685 usuarios activos en
  28 días** (informe panorámico, 15 de septiembre a 12 de octubre).
- En el sitio, el píxel solo carga **después de aceptar las cookies** (`loadPixel` en `tags.ts`), y quien
  acepta también queda contado en GA4. En principio, las vistas de Meta no deberían superar a GA4.

Preguntas:
1. ¿El mismo píxel o conjunto de datos está instalado en otra página o dominio? Ver en el Administrador de
   eventos → el conjunto de datos → "Dominios" o el desglose por URL.
2. ¿Cómo define Meta "vista de la página de destino" para tráfico de su navegador interno? Verificarlo en
   la documentación de Meta, no suponerlo.
3. ¿GA4 está dejando de contar visitas? Por ejemplo, de quien no acepta las cookies y aun así queda medido
   en Meta, o porque `gtag` no carga en el navegador de Instagram.
4. En el Administrador de eventos, ¿cuántos `PageView` recibió el píxel desde `testigosdelamemoria.com` en
   el mismo período? Ese número se compara directo con las sesiones de GA4.

Hasta que esto se explique, las cifras de clics y vistas de Meta y de GA4 no se deben comparar entre sí en
los informes.


---

# Compactación del 2026-10-15 (testigos-web)

Movido tal cual desde `estado.md` el 2026-10-15: la sección de testigos-web, las conclusiones cerradas tal como estaban (dos quedaron reabiertas ese día), los dos encargos del 2026-10-15 ya resueltos y el resumen del 2026-10-13.

## testigos-web (actualizado 2026-10-15)

**Arreglo del `fbclid` (encargo del 2026-10-15): `d6f44ac`, publicado el 2026-10-15 a las 14:55 (Bogotá)**
en el despliegue de `8e97c7b`. Comprobado en el sitio real después del despliegue: tras
`?utm_campaign=fbclid-test2` y luego `/?fbclid=abc2`, el widget sigue con `fbclid-test2` y la página de
llegada original.

**Ids de GA4 al aceptar y comprar enseguida (segundo punto, `CUHNG`): `8d47daf`, publicado el 2026-10-15 a
las 15:10 (Bogotá)** en el despliegue de `3f795d5`. Comprobado que el sitio real sirve el código nuevo.
- Causa, reproducida en local con el código publicado y cookies limpias: al pulsar Aceptar, el oyente de
  `attribution.ts` corre antes que el de `tags.ts`, así que pide `client_id` a gtag **antes** del
  `consent update`. gtag no responde con valor, y el sitio solo vuelve a preguntar después de 2 s y en la
  siguiente interacción. Resultado medido: las cookies `_ga` y `_ga_XJES5Z5EC9` existen desde el
  milisegundo 0, pero el widget pasa unos 4 s sin `ga-id`.
- Arreglo: si gtag aún no ha respondido, `ga-id` y `ga-sessid` se leen de esas cookies (mismos valores que
  da `gtag('get')`, comprobado en el sitio real). Medido en local: con cookies limpias, el widget tiene los
  dos ids desde el milisegundo 0 después de Aceptar.
- Esto explica `CUHNG` y probablemente los 2 de 27 pedidos sin `ga_id` anteriores.
- Antes: una llegada con solo `fbclid` o `gclid` reemplazaba la campaña guardada. Reproducido en el sitio
  real: después de `/?fbclid=abc`, `localStorage` y el widget quedan sin `utm_campaign`.
- Ahora: una llegada con solo `fbclid` o `gclid` conserva las UTM, la página de llegada y el dominio de
  referencia guardados, y solo cambia ese identificador. Sin UTM guardadas, se comporta como antes.
  Comprobado en local con el build: el widget sigue con `fbclid-test` y la pestaña guarda el `fbclid` nuevo.
- Regla nueva en `specs/003-embudo-sitio/data-model.md`.
- Las 9 entregas de documentos que esta sección daba como "sin push" ya estaban en `origin/main`.
  `c1f4992` (plan de Google Ads) salió en el mismo push del 14:55.

**Lo de abajo es la foto del 2026-10-13:**

**En producción (GitHub Pages, push a `main`):**
- Embudo del sitio (`attribution.ts`, `720a1eb`): publicado el 2026-10-08 a las 22:36, en el despliegue de `fc8ca52`.
- `referrer` (`5e4737f`): 2026-10-12 a las 15:13.
- Guardado de la campaña por 30 días en `localStorage` (`d91b22a`): 2026-10-13 a las 09:32.
- Comprobado en el sitio real: el `widget_data` lleva la campaña con y sin cookies, y en una visita
  posterior sin UTM. `www` redirige a la raíz conservando la consulta.
- Consentimiento de GA4 en modo avanzado (`EventLayout.astro`). Si alguien cierra el aviso, navega y
  acepta después en otra página, GA4 cuenta la visita como directa. Solo afecta a GA4.

**Commits locales sin push (9, de `296a687` a `b55d1f1`):** solo documentos. Entre ellos:
- `enlaces-y-nombres.md` con la regla de nombres "sin ruido" (campaña corta o `permanente`, contenido
  `{pieza}_{variable}`, sin `utm_term`);
- enlaces del chatbot con UTM en `docs/system-prompt-atencion.md` y `docs/chatbot-conocimiento.md`;
- guía de reportes, estándar de medición, guía de despliegue y textos de la tienda.
Ninguno cambia el sitio publicado. El push espera el visto bueno del titular; al hacerlo, se anotan aquí
el commit y la hora.

**Sin commit:** este `estado.md` y `estado-historial.md` (compactación del 2026-10-13, que incluye el
reporte de Meta que agregó pretix-wompi).

**Falta:**
- Responder la pregunta del reporte de Meta frente a GA4 (ver "Preguntas abiertas").
- No verificado en este archivo: si los textos legales con el día D (vigencias y versión `tienda-<D>`)
  quedaron publicados junto con el embudo.

**En curso:** nada.

## Conclusiones cerradas

Cada línea remite a la sección de `estado-historial.md` con el detalle.
- **Ventas sin campaña del 12 de octubre:** el sitio, el widget y el plugin funcionan. Las compras llegaron
  por visitas sin UTM (directas, Google), por cambio de navegador (`Z9UMQ` → `7H7LT`) o por enlaces de
  Instagram y anuncios sin parámetros de URL. Ningún pedido anterior de un comprador traía UTM. ("Preguntas
  de pretix-wompi (2026-10-13)", "Resultado del diagnóstico", "Resultado: pedidos anteriores del mismo comprador".)
- **H1 (compra directa en la tienda) y H2 (se pierde en el navegador de Instagram):** descartadas. Un solo
  caso de cada una. ("Resultado del diagnóstico".)
- **El sitio no pierde la UTM:** comprobado en el sitio real, en 26 de 27 pedidos, con `CH3ZN` y con la
  tabla A de GA4. ("Respuestas de testigos-web (2026-10-13)", "Respuestas de testigos-web a la tabla de horas".)
- **El 12 de octubre nadie pulsó "Comprar" desde una visita de anuncio:** 19 `begin_checkout`, 10 directos y
  7 de Google. ("Resultado de las tablas de depuración en GA4".)
- **GA4 `(not set)` en las compras:** causa D6a, el plugin fijaba `timestamp_micros` fuera de la sesión.
  Lo corrige pretix-wompi (`982f155`). Confirmado hora por hora. ("GA4 no une la compra a la visita",
  "Confirmación hora por hora de la fila `(not set)`".)
- **Tabla B de GA4 (primera campaña del usuario):** no confiable hasta después de D6a. ("Resultado de las
  tablas de depuración en GA4".)
- **Correo a expirados del 12 de octubre:** llevaba UTM `expirados-2026`, salió a las 16:24 a 7 personas y
  no generó ventas. ("Resultado: horas de los compradores del 12 de octubre".)
- **Meta atribuye por persona, no por UTM:** 1 compra atribuida en todo el período (13 sep a 12 oct), a
  "Video Maria Elvira". El `Purchase` del plugin llega a Meta. ("Reporte de anuncios de Meta".)
- **Inventario de enlaces con UTM:** hecho en `enlaces-y-nombres.md`, con la regla de nombres sin ruido.
  ("Respuesta de testigos-web al encargo", "Cambio en la convención de nombres".)
- **El sitio no tenía enlaces que cambiar por el inventario;** solo cambiaron los documentos del chatbot.
  ("testigos-web: estado de los cuatro encargos".)
- **Slug de campaña:** obligatorio en cada evento. El real es `testigos-de-la-memoria-2026` (evento Pretix
  `testigos-memoria`); el de ensayo, `testigos-sandbox`. ("Preguntas abiertas" y respuestas del 2026-10-08.)
- **Nombre del comprador:** sale de la primera boleta. ("Preguntas de testigos-web (2026-10-08)".)
- **Valores `null` y claves ajenas en `widget_data`:** el plugin los trata como ausentes e ignora lo que no
  empieza por `tracking-`. ("testigos-web", foto del 2026-10-08.)
- **Vencimiento del WhatsApp:** el campo se lee en la zona horaria del evento. ("Respuestas de pretix-wompi (2026-10-08)".)
- **Vencer y reactivar:** si la señal falla, el barrido de 5 minutos lo recoge. ("Respuestas de pretix-wompi (2026-10-08)".)
- **Volver de 2026.5.4 a 2026.5.1:** se puede con "Redeploy" en Railway, sin restaurar el snapshot. Reabre
  el CVE-2026-13602. ("Respuestas de pretix-wompi (2026-10-08, tercera tanda)".)
- **Pedidos anteriores al plugin:** no tienen UTM en "Ventas por campaña"; Pretix no guarda el `widget_data`.
  ("Respuestas de pretix-wompi (2026-10-08)".)
- **Captura antes de confirmar el pedido:** versión futura, fuera de alcance. ("Preguntas abiertas", 2026-10-08.)

## Encargos del 2026-10-15 (resueltos)

- **ENCARGO PARA testigos-web (2026-10-15): el sitio pierde la campaña cuando la persona vuelve desde
  Facebook con solo `fbclid`.** Responde y arregla: testigos-web. Esto **reabre en parte** la conclusión
  "El sitio no pierde la UTM": no la pierde en una visita normal, pero sí en este caso.
  - Caso real, pedido `DVUGA`, 2026-10-15, con datos de GA4 (Data API, evento `page_view`) y de Pretix:
    - 06:39, primera página:
      `https://testigosdelamemoria.com/programacion/bogotazo-frente-nacional/?utm_source=fb&utm_medium=paid_social&utm_campaign=ventas&utm_content=afiche-general_frio&fbclid=…&utm_id=52648250355692&utm_term=52648250355892`,
      referrer `http://m.facebook.com/`.
    - 06:50, misma sesión de GA4: `https://testigosdelamemoria.com/?fbclid=…` (sin ningún `utm_`),
      referrer `https://lm.facebook.com/`. Vuelve a pasar a las 06:58.
    - 06:58, `begin_checkout`. GA4 lo pone en la campaña `ventas`.
    - Pretix recibió `landing=/`, `referrer=lm.facebook.com`, `fbc`, `ga_id`, `ga_sessid` y **ninguna
      clave `utm_`**.
  - Causa probable, en el código: en `attribution.ts`, `PARAMS` incluye `gclid` y `fbclid`. Por eso, en
    `captureAttribution`, una llegada con solo `fbclid` cuenta como "llegada con campaña" (`hasParams`)
    y reemplaza la atribución guardada, que sí tenía las UTM.
  - Por qué importa: `lm.facebook.com` es el redirector de Facebook para enlaces en publicaciones,
    comentarios y Messenger. Facebook agrega `fbclid` a todos esos enlaces, aunque no lleven UTM. Lo mismo
    pasa con Instagram (`ig / social` con solo `fbclid`).
  - Regla propuesta (decide testigos-web): solo las `utm_*` cuentan como campaña. Una llegada con solo
    `gclid` o `fbclid` actualiza ese identificador de clic, pero conserva las UTM guardadas, igual que hoy
    una llegada desde otro sitio sin campaña.
  - Reproducción esperada:
    1. Abrir `/programacion/bogotazo-frente-nacional/?utm_source=prueba&utm_campaign=fbclid-test`.
    2. En la misma pestaña, abrir `/?fbclid=abc`.
    3. El `widget_data` debe seguir con `tracking-utm-campaign: "fbclid-test"` y llevar el `fbclid` nuevo.
       Hoy, según el código, sale sin campaña.
  - Al terminar, anotar aquí el commit y la hora de publicación. pretix-wompi lo verifica en el siguiente
    pedido que llegue desde un anuncio.
  - **Respuesta de testigos-web (2026-10-15):** causa confirmada en el código y reproducida en el sitio
    real. Regla adoptada: la propuesta (solo las `utm_*` cuentan como campaña; `fbclid` o `gclid` solos
    cambian el identificador y conservan las UTM). `d6f44ac`, **publicado el 2026-10-15 a las 14:55** y
    comprobado en el sitio real. Detalle en la sección de testigos-web.
  - **Preguntas de testigos-web para pretix-wompi** (para saber cuánto explica esto de las ventas de la
    semana, que según el titular son 16 y ninguna con campaña):
    1. Para cada pedido pagado del 2026-10-09 al 2026-10-15: `landing`, `referrer`, si trae `fbc` y si
       trae alguna `utm_`. ¿Cuántos tienen `referrer` de `facebook.com`, `lm.facebook.com`,
       `l.instagram.com` o `instagram.com`? Esos son los que este error pudo vaciar.
    2. Con la Data API de GA4: de esos compradores, ¿cuántos tuvieron antes, en la misma sesión o en
       sesiones anteriores, un `page_view` con `utm_campaign`? Es la cifra de ventas que el error borró.
       El resto llegó de verdad sin campaña.
    3. Las 11 compras de la oferta: ¿por qué canal salió la oferta (historia, publicación, WhatsApp,
       correo) y con qué enlace? Si fue por publicaciones de Instagram o Facebook sin UTM, llegaron con
       solo `fbclid` y quedan "sin campaña" con o sin este arreglo. (Pregunta también para el titular.)
    4. En el plugin, para el `(not set)` de GA4: ¿el `purchase` lleva `session_id` y
       `engagement_time_msec` dentro de `params`, y `client_id` tal cual lo da `gtag('get', …,
       'client_id')` (forma `123.456`, sin el `GA1.1.` de la cookie)? El sitio manda `ga-id` y
       `ga-sessid` así; se puede ver en cualquier pedido.
  - **Respuestas de pretix-wompi (2026-10-15):**
    - 4: sí. `purchase` lleva en `params` `session_id` (el `ga_sessid` tal cual) y `engagement_time_msec: 1`.
      El `client_id` es el `ga_id` tal cual llega en el `widget_data`. En los 4 pedidos posteriores a D6a
      tiene forma `dígitos.dígitos`, sin `GA1.1.` (validado por expresión regular, script
      `2026-10-15-compras-despues-del-arreglo.py`). También va un bloque `consent` con
      `ad_user_data`/`ad_personalization` en `DENIED`, por el dictamen legal. Según lo documentado, eso no
      quita la atribución de sesión, pero BigQuery lo confirmará.
    - 1: script listo (`docs/diagnostico/2026-10-15-referrer-semana.py`). Espera que lo corra el titular.
    - 2: se hace con la Data API cuando esté el resultado de la 1.
    - 3: es del titular.
- **Segundo punto para testigos-web (2026-10-15, compra de prueba `CUHNG`): sin `ga_id` ni `ga_sessid` cuando
  se aceptan las cookies justo antes de comprar.** Responde: testigos-web.
  - Pretix recibió `consent`, `landing=/` y `utm_source=prueba`, `utm_campaign=verificacion-bq`, pero **ni
    `ga_id` ni `ga_sessid`** (tampoco `fbp`).
  - En GA4 (tiempo real), `consent_granted` y `begin_checkout` cayeron en el mismo minuto.
  - Lectura del código: `askGa` llama a `gtag('get', …)` sin esperar la respuesta. Si llega después del
    `submit`, el `widget_data` ya salió sin los ids. Sin ellos, el plugin manda la compra con un
    `client_id` propio, y GA4 no puede unirla a la visita.
  - Pasó en 2 de 27 pedidos antes del 13 de octubre. Es más probable cuando se acepta y se compra de
    inmediato, que es justo lo que hace una prueba.
  - Pregunta: ¿se puede esperar la respuesta de `gtag('get')` en el `submit`, o pedir los ids apenas se
    acepta y reintentar al tocar el widget?
  - **Respuesta de testigos-web (2026-10-15):** causa confirmada y reproducida. No es la espera: el sitio
    preguntaba a gtag antes de concederle el permiso. Arreglo: leer los ids de las cookies `_ga` y
    `_ga_<id>` cuando gtag no ha respondido. `8d47daf`, **publicado el 2026-10-15 a las 15:10**. Detalle en la sección de testigos-web. Después de publicarlo, la compra
    `verificacion-bq2` ya no necesita esperar 30 s.

## RESUMEN: investigación de "ventas sin campaña" (2026-10-13)

**El problema:** en "Ventas por campaña" de Pretix, de 105 pedidos solo uno tenía campaña: la verificación
`CH3ZN`. En GA4, todas las compras caían en `(not set)`.

**Lo que se descartó al 100 %, con datos de producción:**
- **Cookies rechazadas:** 25 de 27 pedidos (desde que el plugin está activo, el 8 de octubre en la noche)
  traen el identificador de GA4, o sea que aceptaron las cookies.
- **El plugin o el paso del sitio a la tienda pierden la UTM:** 26 de 27 pedidos traen lo que el sitio
  mandó (página de llegada, identificadores). La verificación con UTM llegó completa. testigos-web lo
  comprobó en el sitio real, y GA4 (tabla A) lo confirma.
- **Compras directas en la tienda, sin el sitio:** 1 caso (`YBCFY`).
- **El navegador de Instagram pierde los datos:** su único pedido (`Z9UMQ`) llegó con todo.
- **La pasarela de pago "borra" la UTM:** nadie vuelve al sitio después de pagar. La compra se la manda a GA4
  y a Meta el servidor de Pretix.
- **El correo a expirados como fuente de ventas:** llevaba UTM, y ninguno de sus destinatarios compró
  después del envío.
- **El guardado de 30 días como explicación:** es correcto, pero se publicó el 13 de octubre, después de
  esas ventas.

**Lo que se encontró:**
1. **Los compradores llegaron sin UTM.** El 12 de octubre se pulsó "Comprar" 19 veces:
   - 10 desde visitas directas;
   - 7 desde Google;
   - 1 desde Instagram sin UTM;
   - 1 fue una prueba;
   - **0 desde los anuncios** en esa misma visita.

   Todos compraron en la misma visita en que entraron (de 2 a 42 minutos). Unos 5 eran nuevos en su
   navegador; otros 5 ya conocían el sitio desde días antes y volvieron directo.
2. **Hay enlaces sin UTM**, incluso dentro de Instagram: `Z9UMQ` llegó desde `l.instagram.com` con `fbclid`
   y sin `utm_*`. La bio lleva `utm_content` pero no `utm_campaign`. Lo que comparten el equipo, los
   panelistas y los grupos de WhatsApp va sin UTM.
3. **El único cambio de navegador comprobado:** `Z9UMQ` (Instagram, 12 de octubre) → `7H7LT` (Chrome de
   escritorio, pagado el 13 de octubre). Su visita de Instagram tampoco traía UTM.
4. **GA4 ponía todas las compras en `(not set)` por un error del plugin:** les ponía la hora del pago, que
   queda fuera de la visita del comprador. Se comprobó hora por hora. **Corregido y desplegado el 13 de
   octubre a las 18:20** (`982f155`). Falta la compra de prueba que lo confirme.
5. **Meta atribuye 1 sola compra a los anuncios** en todo el período, al video de María Elvira. Meta cruza
   personas entre navegadores, así que la mayoría de las ventas no vino de los anuncios.

**Cómo se comporta el sistema hoy:**
- El sitio guarda la campaña 30 días en el mismo navegador y se la pasa a la tienda.
- Pretix guarda en cada pedido lo que llegó.
- El plugin manda a GA4 (ahora con la visita bien unida), a Meta (por persona, con correo y teléfono
  cifrados) y al backend.
- "Sin campaña" en Pretix significa que la pestaña donde se compró no tenía UTM.

**Limitaciones actuales (no son errores):**
- **El cambio de navegador no se puede seguir** con UTM ni con GA4: el navegador de Instagram y
  Safari/Chrome no comparten nada. Solo Meta lo ve, y solo para sus propios anuncios.
- **Ver el anuncio sin hacer clic y entrar después** por Google o escribiendo la dirección: lo mide solo Meta
  ("por visualización").
- **Las compras anteriores al 13 de octubre** siguen en `(not set)` en GA4. No se corrigen hacia atrás.
- **La tabla de GA4 "primera campaña del usuario"** no es confiable para compras anteriores al arreglo.
- **GA4 no ve a quien no acepta las cookies.** El sitio y Pretix sí guardan su UTM.

**Pendiente:**
- Titular: compra de prueba `verificacion-ga4` y su revisión a las 24–48 horas; parámetros de URL de Meta
  por nombre; enlace de la bio; enlaces para organizadores y panelistas; tráfico interno en GA4; revisar las
  compras en el Administrador de eventos de Meta.
- testigos-web: inventario de enlaces con UTM y su despliegue; preguntas de consentimiento y de "Abrir en el
  navegador"; la investigación nueva de Meta contra GA4 (arriba).
- pretix-wompi: cerrar la tarea 9.3 cuando llegue la prueba; si se pide, contar las cargas del widget en los
  registros de nginx.
