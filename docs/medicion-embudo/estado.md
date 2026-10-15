# Estado de la entrega

Qué existe de verdad en cada repo y qué falta. Reglas:
- Cada repo actualiza **solo su propia sección**, con fecha. Las de los demás no se editan.
- Las preguntas van en "Preguntas abiertas", con quién debe responderlas.
- **Cuando un tema se cierra, se mueve a `estado-historial.md` y aquí queda solo una línea con la conclusión.**
- El diseño y el contrato siguen en `diseno.md`, `prompt-pretix.md` y `prompt-backend.md`.
- Todo lo anterior al 2026-10-13 está, tal cual, en `estado-historial.md`.

Documentos con los datos operativos (no se copian aquí):
- Despliegue, URL, variables, tokens y ajustes del panel: `guia-deploy-tracking.md`.
- Enlaces con UTM y regla de nombres: `enlaces-y-nombres.md`.
- Informes, GA4 y Meta para el titular: `titular/reportes-para-el-informe.md` y `pretix-wompi/docs/ga4-tablas-utm.md`.
- Scripts de diagnóstico (solo lectura): `pretix-wompi/docs/diagnostico/`.
- Qué dato queda en qué modelo del backend: historial, "Dónde queda cada dato y cómo se obtiene".
- Compactado el 2026-10-15 por testigos-web: lo cerrado ese día está en el historial, "Compactación del 2026-10-15".

## Para mañana (2026-10-16)

En orden. Cada uno anota aquí, en su sección, lo que salga.

1. **Titular, lo antes posible:** compra de prueba pequeña desde
   `https://testigosdelamemoria.com/?utm_source=prueba&utm_campaign=verificacion-bq2`. Aceptar las cookies
   y comprar en la misma pestaña; ya no hace falta esperar 30 s (`8d47daf`). Si no se hizo el 15, hacerla el
   16: entra en la exportación a BigQuery del día siguiente.
2. **pretix-wompi, apenas exista el pedido:** confirmar en Pretix que trae `utm_campaign=verificacion-bq2`,
   `ga_id` y `ga_sessid`. Si falta algo, encargo a testigos-web en "Preguntas abiertas".
3. **pretix-wompi:** revisar si apareció el dataset `analytics_554842243` en `eventalist-analytics` y, con
   él, con qué `ga_session_id` guarda GA4 las compras del plugin (`DVUGA`, `7M3LX` y la de prueba, si
   entraron). Es la causa del `(not set)` en GA4.
4. **Titular:** correr `docs/diagnostico/2026-10-15-referrer-semana.py` de pretix-wompi (pregunta 1) y decir
   por qué canal y con qué enlace salió la oferta de las 11 compras de la semana (pregunta 3).
5. **pretix-wompi:** con el resultado de la 1, la pregunta 2 con la Data API: cuántas ventas de la semana
   borró el error del `fbclid` y cuántas llegaron de verdad sin campaña.
6. **pretix-wompi:** en el primer pedido real que llegue desde un anuncio, confirmar que trae su campaña
   (prueba de `d6f44ac` en producción).

Lo que no depende de nada de lo anterior: la investigación de Meta contra GA4 (al final) y las preguntas
del titular en "Preguntas abiertas".

## pretix-wompi (actualizado 2026-10-15)

**En producción:**
- Plugin `pretix-eventalist-tracking` activo en `testigos-memoria` desde la noche del 2026-10-08.
- Arreglo de GA4 (D6a): commit `982f155`, desplegado el 2026-10-13 a las 18:20 (Bogotá). Los envíos con
  `ga_id` y `ga_sessid` ya no fijan `timestamp_micros`.

**Resultado del arreglo D6a (2026-10-15): no basta.** Las 4 compras pagadas después del despliegue
(`PREEY`, `SFWWK`, `DVUGA`, `7M3LX`) siguen en `(not set)` en GA4.
- Pretix tenía `ga_id` y `ga_sessid` con forma correcta en las 4, y el pago fue entre 5 y 45 min después del
  inicio de la sesión.
- El plugin envió en el mismo minuto del pago, sin `timestamp_micros`, y GA4 respondió 204. El
  `measurement_id` del plugin es el del sitio (`G-XJES5Z5EC9`).
- GA4 sí reconoce al usuario (región, aparato y, en 3 de 4, primera fuente `(direct)`), pero no une la
  compra a la sesión.
- Scripts: `docs/diagnostico/2026-10-15-compras-despues-del-arreglo.py` y `2026-10-15-llegada-compradores.py`.
- pretix-wompi lee GA4 con la Data API (propiedad `properties/554842243`, cuenta de servicio
  `claude-lector`, solo lectura).

**BigQuery (2026-10-15):** vinculado por el titular a las ~14:40, con exportación diaria, sin streaming y
sin facturación, al proyecto `eventalist-analytics`. `claude-lector` puede leerlo.
- El dataset `analytics_554842243` aparece con la primera exportación, normalmente al día siguiente.
- Sirve para ver con qué `ga_session_id` guarda GA4 cada compra del plugin, al lado de la visita. Es lo
  que falta para cerrar la causa del `(not set)`. El sitio no tiene nada que hacer en esto.
- No verificado: si la primera exportación incluye el 15 completo. Si lo incluye, también estarán `DVUGA`
  y `7M3LX`.

**Compra de prueba `CUHNG` (2026-10-15 14:47): no sirve para D6a.**
- Llegó con `utm_campaign=verificacion-bq` pero sin `ga_id` ni `ga_sessid`. Las cookies se aceptaron y se
  pulsó "Comprar" en el mismo minuto (ver el segundo punto del encargo a testigos-web en "Preguntas
  abiertas").
- El plugin la envió a las 14:47 (204) con un `client_id` propio. Saldrá sin visita en GA4, como se espera.
- Pendiente del titular: repetir la compra (`?utm_source=prueba&utm_campaign=verificacion-bq2`, aceptar,
  esperar unos 30 s, comprar en la misma pestaña). pretix-wompi confirma en Pretix que trae los ids y la
  revisa en BigQuery al día siguiente.

**Falta:**
- La causa del `(not set)` de las compras: espera la exportación a BigQuery y la compra `verificacion-bq2`.
  Con `8d47daf` publicado, esa compra ya no necesita esperar 30 s después de aceptar.
- Preguntas 1 y 2 de testigos-web (cuántas ventas de la semana borró el error del `fbclid`): script listo,
  espera al titular.
- Aviso visible cuando el slug de campaña del evento está vacío: factible, no hecho. Espera el sí del titular.

## eventalist-backend (actualizado 2026-10-08)

**En producción desde el 2026-10-08 a las 22:33 (Bogotá):** merge `bf5bb74` en `master`, rama
`016-pretix-ticket-orders` (`b1b6d06`, `6761a68`).
- Endpoint `POST /api/v1/marketing/ticket-orders/`; sin token responde `401`.
- Modelos `TicketOrder` y `ContactConsent`, etapa de compra en `CampaignMembership`, filtro por etapa,
  exportaciones por campaña y resumen de ventas por UTM en el admin.
- El ensayo de la migración en una rama de Neon se saltó por decisión del titular. Antes del merge se hizo
  la copia en Neon y se configuraron `PRETIX_SERVICE_TOKEN` y `PRETIX_TESTMODE_CAMPAIGNS`.
- Spec y resultado en `specs/016-pretix-ticket-orders/` del repo del backend.

**Falta (estado al 2026-10-08; no hay actualización posterior):**
- Exportación CSV de pedidos con UTM (aprobada por el titular): hecha en la rama, iba en un segundo
  despliegue sin migraciones. Si ya se desplegó: no verificado.
- Ensayo contra producción (paso 7 de su guía) y copia de `resultado-backend.md` a este directorio: no verificado.

**En curso:** no verificado.

## testigos-web (actualizado 2026-10-15)

**En producción (GitHub Pages, push a `main`):**
- Embudo del sitio (`attribution.ts`, `720a1eb`): 2026-10-08 a las 22:36. `referrer` (`5e4737f`): 2026-10-12
  a las 15:13. Campaña guardada 30 días en `localStorage` (`d91b22a`): 2026-10-13 a las 09:32.
- **Campaña que se perdía con `fbclid` (`d6f44ac`): 2026-10-15 a las 14:55.** Una llegada con solo `fbclid`
  o `gclid` reemplazaba la campaña guardada (pedido `DVUGA`). Ahora conserva las UTM, la página de llegada y
  el dominio de referencia, y solo cambia ese identificador. Comprobado en el sitio real después del
  despliegue. Regla en `specs/003-embudo-sitio/data-model.md`.
- **Ids de GA4 al aceptar y comprar enseguida (`8d47daf`): 2026-10-15 a las 15:10.** Al pulsar Aceptar, el
  sitio pedía `client_id` a gtag antes del `consent update`; gtag no respondía con valor y el widget pasaba
  unos 4 s sin `ga-id` (pedido `CUHNG`; probablemente también los 2 de 27 anteriores sin `ga_id`). Ahora, si
  gtag no ha respondido, los ids se leen de las cookies `_ga` y `_ga_XJES5Z5EC9`, con los mismos valores.
  Reproducido en local con cookies limpias, antes y después; comprobado que el sitio real sirve el código.
- **Botones de WhatsApp (`eca1131`): 2026-10-15 a las 15:19.** Apuntaban a un número equivocado. Ahora van a
  `https://wa.me/message/VJNUOS3MM3WLE1` (Testigos de la Memoria, +1 555-406-8726). También la plantilla
  del correo a expirados. El correo del 12 de octubre salió con el enlace viejo.
- Consentimiento de GA4 en modo avanzado (`EventLayout.astro`). Si alguien cierra el aviso, navega y
  acepta después en otra página, GA4 cuenta la visita como directa. Solo afecta a GA4.

**Sin push:** nada del sitio. `docs/campana-google-ads/plan.md` tiene cambios sin commit, anteriores a esta
sesión y de otro trabajo.

**Falta:**
- La investigación de Meta contra GA4 (al final).
- No verificado: si los textos legales con el día D (vigencias y versión `tienda-<D>`) quedaron publicados.

## Conclusiones cerradas

Cada línea remite al historial. "(C-15)" es la sección "Compactación del 2026-10-15".
- **Ventas sin campaña del 12 de octubre:** llegaron por visitas sin UTM (directas, Google), por cambio de
  navegador (`Z9UMQ` → `7H7LT`) o por enlaces de Instagram y anuncios sin parámetros de URL. Ese día nadie
  pulsó "Comprar" desde una visita de anuncio. ("Resultado del diagnóstico", "Resultado de las tablas de
  depuración en GA4".)
- **El sitio perdía la UTM en dos casos, ya corregidos:** al volver con solo `fbclid` (`d6f44ac`) y los ids
  de GA4 al aceptar y comprar enseguida (`8d47daf`). En una visita normal no la pierde. (C-15, "Encargos del
  2026-10-15".)
- **Cookies rechazadas y compras en otra sesión** no explican las ventas sin campaña: 25 de 27 pedidos traen
  `ga_id` y casi todos compran en la misma visita. (C-15, "RESUMEN".)
- **H1 (compra directa en la tienda) y H2 (se pierde en el navegador de Instagram):** descartadas. Un solo
  caso de cada una. ("Resultado del diagnóstico".)
- **D6a (`982f155`) era necesario pero no basta:** las compras siguen en `(not set)`. La causa sigue abierta
  (sección de pretix-wompi). Tabla B de GA4: no confiable mientras tanto.
- **El plugin envía la compra a GA4 bien formada:** `session_id`, `engagement_time_msec` y `client_id` en la
  forma correcta. (C-15, respuesta 4 de pretix-wompi.)
- **Correo a expirados del 12 de octubre:** llevaba UTM `expirados-2026`, salió a 7 personas y no generó
  ventas. ("Resultado: horas de los compradores del 12 de octubre".)
- **Meta atribuye por persona, no por UTM:** 1 compra atribuida del 13 sep al 12 oct. El `Purchase` del
  plugin llega a Meta. ("Reporte de anuncios de Meta".)
- **Inventario de enlaces con UTM:** en `enlaces-y-nombres.md`, con la regla de nombres sin ruido.
- **Slug de campaña:** obligatorio en cada evento. El real es `testigos-de-la-memoria-2026` (evento Pretix
  `testigos-memoria`); el de ensayo, `testigos-sandbox`.
- **Nombre del comprador:** sale de la primera boleta. **Valores `null` y claves ajenas en `widget_data`:** el
  plugin los ignora. **Vencimiento del WhatsApp:** en la zona horaria del evento. **Vencer y reactivar:** el
  barrido de 5 minutos lo recoge. (Respuestas del 2026-10-08.)
- **Volver de 2026.5.4 a 2026.5.1:** "Redeploy" en Railway, sin restaurar el snapshot. Reabre el
  CVE-2026-13602.
- **Pedidos anteriores al plugin:** sin UTM en "Ventas por campaña"; Pretix no guarda el `widget_data`.
- **Captura antes de confirmar el pedido:** versión futura, fuera de alcance.

## Preguntas abiertas

- **¿Cuántas de las 16 ventas de la semana borró el error del `fbclid`?** Para saber si el arreglo resuelve
  lo de "0 de 16" o si las ventas llegaron de verdad sin campaña.
  1. Por pedido pagado del 2026-10-09 al 2026-10-15: `landing`, `referrer`, si trae `fbc` y alguna `utm_`.
     Cuántos con `referrer` de Facebook o Instagram. Script listo:
     `docs/diagnostico/2026-10-15-referrer-semana.py` de pretix-wompi. Responde: titular (correrlo).
  2. De esos compradores, cuántos tuvieron antes un `page_view` con `utm_campaign` (Data API). Responde:
     pretix-wompi, con el resultado de la 1.
  3. Por qué canal y con qué enlace salió la oferta de las 11 compras (historia, publicación, WhatsApp,
     correo). Si fue por publicaciones sin UTM, esas ventas quedan "sin campaña" aunque el sitio funcione.
     Responde: titular.
- **Causa del `(not set)` de las compras en GA4.** Responde: pretix-wompi, con BigQuery y `verificacion-bq2`.
- **Meta reporta unas 4.800 vistas de la página de destino y GA4 unos 685 usuarios en 28 días.** ¿El
  píxel está en otro dominio? ¿Cómo define Meta esa vista en su navegador interno? ¿GA4 deja de contar
  visitas? ¿Cuántos `PageView` recibió el píxel desde `testigosdelamemoria.com`? Responde: testigos-web
  (documentación de Meta y código), con el titular para el Administrador de eventos. Hasta entonces, no
  comparar cifras de Meta y GA4 en los informes. (Historial: "Reporte de anuncios de Meta".)
- **¿Aviso cuando el slug de campaña está vacío?** Responde: titular. Lo hace pretix-wompi si dice que sí.
- **Zona horaria de `testigos-sandbox` y `testigos-memoria` en Pretix:** debe ser `America/Bogota`. Responde: titular.
- **GA4 en la administración:** tiempo de espera de la sesión y zona horaria de la propiedad. No bloquean
  D6a. Responde: titular.
- **Consentimiento después de navegar:** ¿se quiere que `consent_granted` lleve las UTM guardadas? No está
  hecho ni propuesto. Comprobarlo en DebugView exige acceso a GA4. Responde: titular (con testigos-web).
- **Exportación CSV de pedidos con UTM en producción:** ¿ya se desplegó? Responde: backend.
- **Fricción en el pago** (un pedido desde el navegador de Instagram vencido, compradores con 3 intentos):
  no es de medición. ¿Se investiga? Responde: titular.

## Pendientes del titular

- Hoy o mañana temprano: la compra `verificacion-bq2` (punto 1 de "Para mañana").
- Correr el script de la pregunta 1 y responder la pregunta 3 (canal de la oferta).
- Prueba en el teléfono de "Abrir en el navegador" desde Instagram: pasos en el historial, "¿Dónde se puede
  perder la UTM?", "Prueba de teléfono".
- Dar los valores del afiche y del reel que ya circulan, y confirmar las campañas en uso.
- Copiar el prompt y la base de conocimiento del chatbot (`docs/system-prompt-atencion.md`,
  `docs/chatbot-conocimiento.md`) en su plataforma.
- Cambiar el enlace de WhatsApp fuera del sitio donde esté el viejo (tienda de Pretix, bio, perfiles):
  el correcto es `https://wa.me/message/VJNUOS3MM3WLE1`.
- Fuera de los repos: parámetros de URL por nombre en los anuncios de Meta (y revisar que cada anuncio activo
  los tenga), enlace de la bio con `utm_campaign`, repartir los enlaces a organizadores y panelistas, y
  definir el tráfico interno en GA4.
- Las respuestas marcadas "Responde: titular" en "Preguntas abiertas".

---

## INVESTIGACIÓN NUEVA: Meta reporta unas 7 veces más visitas que GA4 (abierta el 2026-10-13)

Para un agente nuevo de testigos-web. Es una investigación aparte de la de UTM, resumida en el historial ("Compactación del 2026-10-15").
Seguir la regla de siempre: verificar en la documentación oficial y con pruebas, no suponer. Anotar aquí cada
resultado con fecha.

**El dato:**
- Meta, del 13 de septiembre al 12 de octubre: unas **4.800 "vistas de la página de destino"** (3.029 de los
  dos anuncios "Video Maria Elvira"), según el reporte exportado del Administrador de anuncios.
- GA4, del 15 de septiembre al 12 de octubre: **685 usuarios activos** (informe panorámico). La exploración
  "Campañas UTM" muestra 34 sesiones de `mariaelvira_rt` en un período parecido.

**Por qué no es obvio:** en el sitio, el píxel solo carga **después** de aceptar las cookies (`loadPixel` en
`src/measurement/tags.ts`), y quien acepta también queda medido en GA4. Si "vista de la página de destino"
requiere que cargue el píxel, Meta no debería superar a GA4.

**Hipótesis, de la más barata de comprobar a la más cara:**

1. **El píxel carga antes del consentimiento en el sitio publicado**, aunque el código diga lo contrario (por
   un error del build o una etiqueta vieja).
   - Prueba: ventana de incógnito → `testigosdelamemoria.com` → no tocar el aviso de cookies → Herramientas de
     desarrollador → Red → filtrar `facebook` → ¿se pide `fbevents.js` o `tr?id=`? Es la prueba que propuso
     la persona que maneja los anuncios.
   - Si se pide, además del conteo hay un problema legal.
2. **El mismo píxel o conjunto de datos está instalado en otra página o dominio** (otro sitio de Eventalist,
   una página vieja, un Linktree).
   - Prueba: Administrador de eventos → el conjunto de datos → ver los dominios y URL que mandan `PageView`.
3. **Meta define "vista de la página de destino" distinto de lo que creemos**, por ejemplo con medición propia
   de su navegador interno, sin depender del píxel.
   - Prueba: documentación oficial de Meta. Citarla aquí.
4. **GA4 no carga o no cuenta en el navegador de Instagram**: `gtag` bloqueado o lento, o la persona cierra
   antes de que cargue.
   - Prueba: desde un teléfono, abrir el enlace de un anuncio en Instagram y mirar GA4 → Tiempo real o
     DebugView. Repetir en Android y en iPhone.
5. **GA4 no muestra a quien no acepta las cookies.** Con el modo de consentimiento, esas visitas mandan avisos
   sin cookie que GA4 no cuenta como usuarios sin modelado, y el modelado necesita mucho volumen.
   - Prueba: documentación de GA4 sobre el modo de consentimiento y sus requisitos. Además, Administrar →
     Configuración de datos → ¿hay datos modelados?
   - Esto explica que GA4 cuente menos, pero **no** que Meta cuente más, si el píxel también espera el
     consentimiento. Hay que combinarla con la 1 o la 3.
6. **Clics accidentales y abandono** (deslizar sin querer, el navegador de Instagram lento, salir antes de
   que cargue). Es la hipótesis del titular.
   - Esto infla los **clics** de Meta. Si inflara también las "vistas de la página de destino", la página
     tendría que cargar el píxel, lo que vuelve a la 1 o la 3.
7. **Diferencias de período, zona horaria o conteo** (Meta por fecha de la impresión, GA4 por fecha de la
   visita; vistas contra usuarios contra sesiones). Pueden mover un 10–30 %, no 7 veces.

**Fuentes para cruzar, independientes de las cookies:**
- **Administrador de eventos de Meta:** `PageView` recibidos desde `testigosdelamemoria.com`, por día. Es
  la comparación directa con GA4.
- **Registros del widget de Pretix.** Cada carga de la portada pide a `pretix.eventalist.co` el script del
  widget y la lista de boletas. Es un conteo del lado del servidor, sin cookies, de cuántas veces cargó la
  portada. pretix-wompi puede revisar si los registros de nginx en Railway guardan esas peticiones, y por
  cuántos días. **No verificado.** Pedírselo al titular para que abra un agente de pretix-wompi.
- **Cloudflare**, si el dominio pasa por Cloudflare: sus estadísticas cuentan visitas sin cookies.
  Preguntar al titular cómo está configurado el DNS.
- **GitHub Pages** no ofrece estadísticas de visitas del sitio publicado. Confirmarlo, pero no contar con
  ellas.

**Resultado esperado:** una explicación con cifras de por qué difieren y cuál número usar en los informes
para cada cosa (alcance de anuncios, visitas reales, compras). Hasta entonces, no comparar en los informes
los clics ni las visitas de Meta con los de GA4.
