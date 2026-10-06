# Embudo de venta por campaña · diseño

Fecha: 2026-10-06. Estado: diseño aprobado en conversación; pendiente de revisión escrita del titular.
Reemplaza la decisión del 2026-09-17 que retiró la capa de servidor (`docs/archivo-2027/`): el titular quiere que este evento deje lista la plantilla profesional de medición y retargeting para los siguientes.

## Qué se quiere ver

Para cualquier rango de fechas y por campaña UTM (fuente, medio, campaña, contenido):

1. Cuántas personas llegaron al sitio, de qué fuente y con qué porcentaje de interacción.
2. Cuántas hicieron clic hacia las boletas.
3. Cuántas pulsaron "Comprar" en el widget de Pretix.
4. Cuántas confirmaron el pedido con sus datos (nombre, correo, teléfono) y no pagaron.
5. Cuántas pagaron, y por cuánto.

Y poder actuar sobre los pasos 4 y 5:

- **Retargeting en Meta**: público "confirmó y no pagó" (excluye compradores) y público "compró" (para mensajes distintos, por ejemplo invitar a alguien más).
- **Contacto directo** por correo y WhatsApp con quien confirmó y no pagó, desde la base de contactos de Eventalist, donde ya están los interesados de las franjas. Los compradores quedan marcados como tales para no pedirles que compren otra vez.

## Lo que se decidió y por qué

- **Un plugin de Pretix hace el trabajo de servidor** (`pretix-eventalist-tracking`, en el repo `pretix-wompi`, al lado del plugin de Wompi). Envía directamente a GA4 (Measurement Protocol) y a Meta (Conversions API) usando los workers y el programador que ya corren en la instancia. Se activa y configura por evento desde el panel: para otro evento basta con activarlo y poner sus ID. Prompt: `prompt-pretix.md`.
- **El backend de Eventalist solo recibe contactos y pedidos** en un endpoint nuevo, autenticado, y los guarda en `apps/marketing` (la misma base de `MarketingContact` y `Campaign` que alimenta el formulario de interesados), con el estado de compra de cada persona. No habla con Meta ni con Google. Prompt: `prompt-backend.md`.
- **El sitio** entrega al widget la campaña de la visita y los identificadores de GA4 y Meta, y separa los dos eventos de navegador del embudo. Detalle abajo.
- **Sin casillas nuevas.** Decisión del titular: la casilla obligatoria que ya existe en el checkout se reescribe para cubrir medición, públicos de Meta y contacto comercial. El texto, el alcance defendible y los cambios de la política y los términos los da el abogado interno (ver "Condición legal").
- **Se descartó**: el diseño archivado con webhook y backend enviando a Meta y GA4 (tres despliegues para lo que un plugin hace solo); el plugin comercial "Tracking codes" de pretix.eu (licencia, sin Conversions API); poner el píxel dentro de la tienda (exigiría otro aviso de cookies en la compra).

## Flujo de datos

1. **Visita** al sitio con `?utm_...`. GA4 registra la sesión (como hoy). El sitio guarda la campaña de la visita en `sessionStorage` de la pestaña.
2. **Clic hacia boletas** (CTA a `#boletas`): GA4 `view_item_list`, Meta `ViewContent`.
3. **"Comprar" en el widget**: GA4 `begin_checkout`, Meta `InitiateCheckout` (con `eventID`). En ese instante el `<pretix-widget>` ya tiene los atributos `data-tracking-*`, y Pretix los guarda en el carrito como `widget_data`.
4. **Pedido confirmado en Pretix** (datos llenos, pago pendiente): el plugin guarda la atribución en el pedido y envía GA4 `add_payment_info`, Meta `AddPaymentInfo` (con correo y teléfono cifrados) y el contacto al backend con estado `pending`.
5. **Pago confirmado** por Wompi: GA4 `purchase`, Meta `Purchase` y backend con estado `paid`.
6. **Pedido vencido o cancelado**: solo backend (`expired`, `canceled`). A Meta y GA4 no se envía nada; el público de Meta "confirmó y no pagó" se arma restando `Purchase` de `AddPaymentInfo`.

## Parte del sitio (este repo)

Cambios en `src/measurement/` y en `TicketSection.astro`. Respetan las reglas de 002: nada retrasa ni toca el comportamiento del widget, todo en `try/catch`, sin errores en consola.

- **Captura de campaña** (`attribution.ts`, nuevo): en cada carga lee de la URL `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid` y `fbclid`. Si hay alguno, los guarda en `sessionStorage['tdm.attribution']` junto con la página de llegada; si no hay, conserva lo guardado en la pestaña. No usa `localStorage` ni cookies: la campaña vive solo mientras dure la pestaña. Las UTM no identifican a nadie y viajan aunque la persona no acepte cookies; así el informe de ventas por campaña de Pretix y del backend queda completo.
- **Identificadores de la visita**, solo si el aviso de cookies está aceptado: `client_id` y `session_id` de GA4 (`gtag('get', …)`, tope de 2 s) y las cookies `_fbp` y `_fbc` (si hay `fbclid` y no `_fbc`, se construye `fb.1.<ms>.<fbclid>`, formato oficial de Meta).
- **Atributos del widget**: se ponen de inmediato al construir la sección y se completan cuando gtag responde. Nombres (el plugin les quita `tracking-` y cambia guiones por guion bajo):
  - `data-tracking-utm-source`, `-utm-medium`, `-utm-campaign`, `-utm-content`, `-utm-term`
  - `data-tracking-gclid`, `data-tracking-landing`
  - `data-tracking-ga-id`, `data-tracking-ga-sessid` (mismos nombres del plugin oficial de pretix.eu)
  - `data-tracking-fbp`, `data-tracking-fbc`
  - `data-tracking-event-id-checkout` (el `eventId` del `begin_checkout` de esa página)
  - `data-tracking-consent` con valor `1` si el aviso de cookies está aceptado
  - Ningún atributo con valor vacío.
- **Eventos de navegador**: el clic en un CTA a `#boletas` pasa de `begin_checkout` a `view_item_list` (GA4, `item_list_name: 'boletas'`) y `ViewContent` (Meta). `begin_checkout` e `InitiateCheckout` quedan solo para el envío del formulario del widget, una vez por página.
- **Textos legales**: política (`src/pages/tratamiento-de-datos.astro`) y términos (`src/pages/terminos-y-condiciones.astro`, sección 12) con los cambios del dictamen §C, incluida la IP y el navegador en la enumeración de la sección 10; nuevas `DATA_POLICY_EFFECTIVE` y `TERMS_EFFECTIVE` en `src/config.ts`; `docs/pretix-tienda-textos.md` con la casilla nueva, el texto de ayuda del teléfono y su fecha.
- **Comprobación**: `npm run build` y `npm run check`. La prueba real es manual y de punta a punta: el sitio local apuntando al evento sandbox de Pretix (nunca poner en modo prueba el evento de producción), entrar con `?utm_campaign=ensayo`, aceptar cookies, comprar con la tarjeta de prueba de Wompi y ver en el pedido que `api_meta.tracking` trae la campaña y los identificadores. Repetir sin aceptar cookies: llegan las UTM y nada más. Tras publicar, una persona del equipo llega hasta la pantalla de pago de Wompi en producción sin pagar. Sin pruebas automáticas nuevas en este repo: lo que podrían cubrir ya lo garantiza TypeScript.

Regla que se conserva del arreglo del pago "cargando" (commit `8087686`, 2026-09-16): el widget sigue con `disable-iframe`. Pretix guarda `widget_data` también en modo pestaña nueva (verificado en 002).

## Condición legal

Dictamen del abogado interno del 2026-10-06: `docs/revision-legal-2026-10-06-embudo.md`. La casilla única es defendible con el alcance recortado. Lo que eso significa para cada parte:

- **Alcance de la casilla**: anuncios de Meta solo de este encuentro; correo con novedades de este encuentro, sus próximas ediciones y otros eventos culturales de Eventalist en Villa de Leyva; WhatsApp solo si la persona da su teléfono, solo para el recordatorio de pago y novedades de este encuentro, hasta el 8 de noviembre de 2026.
- **Fecha de corte (T0)**: hora en que se guarda la casilla nueva en Pretix, con política y términos ya publicados. Pedidos creados antes no van a ningún destino (ni GA4, ni Meta, ni backend), aunque se paguen después. En el plugin es `consent_since`.
- **Solo el comprador**: los nombres de los asistentes nunca salen de Pretix.
- **Prueba**: cada pedido guarda la versión de la casilla; cada contacto guarda cada autorización por separado, con canal, alcance y vencimiento.
- **Mensajes del equipo**: baja en cada mensaje, horarios de la Ley 2300, un mensaje comercial al día, no mezclar canales en la misma semana, máximo dos recordatorios por pedido, nada después de las 3:00 p. m. del 6 de noviembre. Van en la guía del equipo.
- **Pendientes de verificar** (no bloquean el código): umbral del Registro Nacional de Bases de Datos y si el Registro de Números Excluidos de la CRC cubre WhatsApp, antes de la primera campaña por WhatsApp.

## Configuración que hace el titular (una vez)

- GA4: Administrar → Flujos de datos → el flujo web → "Secretos de la API de Measurement Protocol" → crear uno. Marcar `add_payment_info` y `purchase` como eventos clave.
- Meta: Events Manager → el dataset → Configuración → Conversions API → generar token de acceso.
- Pretix: activar el plugin en el evento y llenar sus ajustes; reescribir la casilla.
- Backend: crear el token de servicio y ponerlo en Pretix.

## Informes y públicos (guía para el equipo, entregable de este repo)

Al terminar se escribe `docs/medicion-embudo/guia-informes-y-publicos.md`, en lenguaje no técnico:

- GA4: exploración de embudo con los pasos visita → `view_item_list` → `begin_checkout` → `add_payment_info` → `purchase`, desglosada por "Campaña de la sesión" y "Contenido de anuncio manual de la sesión", con rango de fechas editable.
- Meta: crear los públicos "confirmó y no pagó, 30 días" (`AddPaymentInfo` excluyendo `Purchase`), "compró" y "vio el reel / interactuó con el perfil", y lanzar una campaña de retargeting con ellos.
- Backend: exportar del admin los contactos por campaña y estado para correo y WhatsApp.
- Reglas para escribirle a la gente (Ley 2300 y dictamen §D): horarios, festivos, límites por día y por semana, línea de baja en cada mensaje y cómo cargar las bajas.
- Públicos de Meta con retención que termine poco después del encuentro.

## Orden de entrega

1. Abogado: casilla, política y términos (bloquea el envío de datos personales, no el código).
2. Backend: endpoint y modelos (el plugin lo necesita para su prueba de punta a punta).
3. Plugin de Pretix.
4. Sitio: atributos del widget y eventos.
5. Publicación coordinada: política nueva, casilla, `consent_since`, sitio. Cada despliegue con visto bueno del titular.
6. Guía de informes y públicos.
