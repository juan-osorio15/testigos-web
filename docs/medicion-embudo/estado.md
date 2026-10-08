# Estado de la entrega

Qué existe de verdad en cada repo y qué falta, para que ningún agente dé por hecho algo que no está.
Cada repo actualiza **su propia sección** con fecha cuando cambie algo. Las secciones de los demás no
se editan: si algo no cuadra, se anota en "Preguntas abiertas". El diseño y el contrato siguen en
`diseno.md`, `prompt-pretix.md` y `prompt-backend.md`; este archivo solo dice en qué punto va cada uno.

## pretix-wompi (actualizado 2026-10-08)

**El plugin funciona de punta a punta contra el backend local.** No está en producción.

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

**Implementado y probado en local. No está en producción.** El trabajo está commiteado en la rama
`016-pretix-ticket-orders` (commits `b1b6d06` y `6761a68`), sin push ni merge. Spec, plan, tareas y borrador del resultado están en
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

Todo se consulta en el admin de Django del backend. No hay
API de lectura ni exportación de pedidos.

| Dato | Dónde | Cómo se ve |
|---|---|---|
| UTM (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`), `landing`, `gclid`, `has_ga_session` | `TicketOrder`, una fila por pedido. Es la atribución del primer contacto y no se sobrescribe | Admin → Ticket orders, con columnas y filtros por campaña, estado, UTM, `testmode` y fecha |
| Estado, total, productos, fechas de creación y de pago | `TicketOrder` | Igual que arriba |
| Resumen por `utm_source` / `utm_campaign` / `utm_content`: confirmados, pagados, vencidos, cancelados, total pagado y tasa de pago | Se calcula al abrir la lista | Encima de la lista de Ticket orders, según los filtros. Solo en pantalla, no se descarga |
| Contacto: correo, teléfono, nombre, país, idioma, origen, fecha de alta | `MarketingContact` (no guarda UTM) | Admin → Marketing contacts. Cada pedido enlaza a su contacto |
| Etapa por campaña | `CampaignMembership` | Filtro "etapa en la campaña", junto al de campaña |
| Autorizaciones | `ContactConsent` | Historial de solo lectura dentro de cada contacto |
| Listas para correo y WhatsApp ("confirmó y no pagó", "compró") | Se calculan al exportar | Filtrar campaña y etapa, y exportar CSV. La de WhatsApp exige filtrar una campaña |

**Límites:**
- El CSV de contactos trae la etapa pero **no las UTM**. Para segmentar una lista por campaña UTM hay
  que cruzarla a mano con los pedidos.
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

## testigos-web (actualizado 2026-10-08, noche)

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
