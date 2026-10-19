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

## Siguiente (actualizado 2026-10-19 por testigos-web)

Lo del 16 quedó hecho: la compra `verificacion-bq2` (`PMAGA`) trajo campaña e ids, BigQuery exporta desde el
15 y la causa del `(not set)` está resuelta (sección de pretix-wompi, `bcececa`). Ya no hay ninguna falla
conocida en la cadena. Lo que sigue es comprobar con datos reales que no queda otra y cerrar las cifras.
Cada uno anota el resultado en su sección, con fecha.

1. **pretix-wompi: prueba de la cadena completa en ventas reales (BigQuery + Pretix).** Para cada pedido
   pagado desde el 2026-10-16 a las 12:15 (despliegue de `bcececa`): `utm_campaign` en Pretix, ¿trae
   `ga_id` y `fbc`?, y en BigQuery la campaña y la fuente de la visita del `purchase` y del primer
   `page_view` de esa visita (con su `page_location`, para ver si llegó con `fbclid` o con UTM). Clasificar:
   - campaña en los dos: bien;
   - sin campaña en los dos: llegó por un enlace sin UTM (o directo); va al titular, no es del código;
   - campaña en GA4 y no en Pretix: el sitio la pierde todavía; encargo a testigos-web con el pedido;
   - campaña en Pretix y no en GA4: queda algo del lado del plugin o de GA4.
   Los datos de Pretix los saca el titular con el script que diga pretix-wompi (`railway ssh`). Responde:
   pretix-wompi.
2. **pretix-wompi: cifras para Meta contra GA4 (BigQuery).** Por día, desde el 2026-10-15: `page_view` de
   `testigosdelamemoria.com` con `fbclid` en `page_location`, separados por
   `privacy_info.analytics_storage` (Yes / No / vacío), y cuántas visitas distintas (`ga_session_id`) entre
   las que aceptaron. Si el modo de consentimiento exporta también los avisos sin cookie de quien no
   acepta, aquí se ve cuántos llegan de un anuncio y no aceptan; verificarlo en la documentación de Google
   antes de concluir. Responde: pretix-wompi. Ver la investigación al final.
3. **Titular:** para los mismos días, "vistas de la página de destino" y "clics en el enlace" de Meta por
   día (Administrador de anuncios, desglose por día) y los `PageView` del píxel por día (Administrador de
   eventos). Con eso y el punto 2, testigos-web cierra la investigación de Meta contra GA4.
4. **testigos-web:** hipótesis 1 de esa investigación (¿carga el píxel antes de aceptar en el sitio
   publicado?). No depende de nadie.
5. **Titular:** correr `docs/diagnostico/2026-10-15-referrer-semana.py` de pretix-wompi (pregunta 1) y decir
   por qué canal salió la oferta de las 11 compras (pregunta 3). Después, pretix-wompi responde la 2 con la
   Data API: BigQuery no sirve para esto porque la exportación empezó el 15 y no trae días anteriores.

Para los informes, mientras tanto: ventas por campaña, de Pretix. En GA4, las compras tienen campaña desde
el 16 de octubre a las 12:15; las anteriores se quedan en `(not set)` para siempre.

## pretix-wompi (actualizado 2026-10-17)

### RESUELTO (2026-10-17): la causa era el bloque `consent` DENIED del plugin

- Prueba controlada (BigQuery, día 16, misma visita del titular, mismo segundo): `prueba_mp_sin_consent`
  quedó con campaña `verificacion-mp`; `prueba_mp_con_consent` quedó en `(not set)` / Unassigned.
- Compras reales del 16: las de antes del despliegue de `bcececa` (`PMAGA` 05:37, `RDZD9` 11:34) salen
  `(not set)`; las de después (`YDKVX` 20:11, `QMNDQ` 23:03) salen en `ventas` / Paid Social, también en los
  informes de GA4 (Data API, `transactionId` × campaña de la sesión). Los `add_payment_info` igual.
- Después del despliegue, una visita directa queda como Direct (antes: Unassigned), como debe ser.
- Las compras anteriores al 16-oct ~12:15 no se corrigen. Las hipótesis 2 a 4 de abajo quedan cerradas
  sin hacer falta probarlas. Lo que sigue es historia de la investigación.

Informe para quien siga la investigación sin el contexto anterior. Todo lo de aquí está medido salvo lo
marcado **hipótesis**.

### El problema, en una frase

GA4 recibe las compras del plugin, las pega al usuario y a la visita correctos, pero no les da la fuente
de esa visita: en "Campaña de la sesión" salen `(not set)` y en canal "Unassigned". Los eventos web de la
misma visita (`page_view`, `begin_checkout`) sí tienen la campaña.

### Cómo viaja una compra (para ubicar dónde se pierde)

1. Visita al sitio con UTM. gtag crea `_ga` y `_ga_XJES5Z5EC9`. Eventos web con campaña.
2. "Comprar" en el widget: el sitio pasa al widget `utm_*`, `ga_id`, `ga_sessid`, `fbp`, `fbc` y
   `consent=1`. Pretix los guarda en `order.api_meta.tracking` al crear el pedido.
3. Pedido creado (antes de ir a Wompi): el plugin manda desde el servidor `add_payment_info` a GA4.
4. El comprador paga en Wompi y vuelve a la página de Pretix.
5. El webhook de Wompi confirma el pago y el plugin manda desde el servidor `purchase` a GA4.

Los envíos de GA4 (pasos 3 y 5) usan solo lo guardado en el paso 2. No leen cookies ni dependen del
navegador en ese momento.

### Lo descartado, con la prueba

- **Que se pierdan las cookies o la visita en el salto a Wompi y la vuelta:** descartado.
  `add_payment_info` sale en el paso 3, antes de ir a Wompi, y también llega sin fuente. Además los
  envíos no usan el navegador (ver arriba), y BigQuery muestra en ellos el mismo `user_pseudo_id` y el
  mismo `ga_session_id` que la visita web.
- **Que Pretix no reciba los ids:** descartado para las compras con cookies aceptadas. `DVUGA`, `7M3LX`,
  `PREEY`, `SFWWK` y `PMAGA` traen `ga_id` y `ga_sessid` con forma correcta. La excepción fue `CUHNG`
  (aceptar y comprar en el mismo minuto), arreglada por testigos-web en `8d47daf`.
- **Que GA4 no una el evento a la visita:** descartado. BigQuery, día 15: `DVUGA` está en la visita
  `ga_session_id=1792064366`, que entró por `ventas` (Paid Social) a las 06:39, con `begin_checkout`
  a las 06:58, `add_payment_info` a las 07:01 y `purchase` a las 07:04. `7M3LX` está en su visita
  Organic Social (`begin_checkout` 09:06, `purchase` 09:10).
- **La hora del evento (`timestamp_micros`):** descartado. Desde `982f155` (13-oct) no se manda cuando hay
  sesión, y siguió igual.
- **Fuera de plazo:** descartado. Los envíos llegan entre 1 y 6 minutos después del último evento web, y
  Google pide menos de 24 h.
- **Otra propiedad o clave:** descartado. El `measurement_id` del plugin es `G-XJES5Z5EC9`, el del sitio.
  GA4 responde 204 y el validador (`/debug/mp/collect`) no da mensajes.
- **Nombre del parámetro de sesión:** descartado. Se manda `session_id` (GA4 lo guarda como
  `ga_session_id`). `ga_` es un prefijo reservado y no se usa.
- **Que el consentimiento `DENIED` impidiera registrar los datos:** descartado. Las compras están
  completas en BigQuery. Esos dos permisos (`ad_user_data` y `ad_personalization`) solo afectan Google
  Ads, Display & Video 360 y Search Ads 360. La propiedad no tiene ninguno vinculado y Google Signals está
  apagado (comprobado por la Admin API el 16-oct).

### Lo que sí se ve distinto en los eventos del servidor (BigQuery, día 15)

Comparados con los eventos web de la misma visita, los eventos del plugin:
- tienen campaña de sesión `(not set)` y canal Unassigned (los web: `ventas` y Paid Social);
- tienen primera campaña del usuario `(direct)` y no traen `user_first_touch_timestamp` (los web:
  `ventas` / `fb`). **Tampoco heredan la atribución del usuario, no solo la de la sesión;**
- tienen `privacy_info.analytics_storage` y `ads_storage` vacíos (los web: Yes / Yes);
- no traen `ga_session_number`, `page_location` ni hostname;
- sí heredan región y tipo de aparato.

Lo mismo pasa en los 8 eventos del servidor del día (5 `add_payment_info`, 3 `purchase`): ninguno tiene
fuente.

### Lo que dice Google (documentación oficial, citada)

- Guía de casos de uso del Measurement Protocol: los eventos con `session_id`, enviados antes de 24 h
  desde el inicio de la visita y con hora dentro de la visita si se fija, *"appear in reports with the same
  session attributes (such as geographic information, source, medium, and campaign) as online events from
  the same session"*. Cumplimos los tres requisitos y no se cumple el resultado.
- Ayuda de Analytics (answer 9900444): para `(not set) / (not set)`, mandar `session_id` *"with a valid
  value from the client-side event"*. Ya se hace.
- Referencia del Measurement Protocol: *"If you don't specify consent, Google Analytics uses the consent
  settings from corresponding online interactions"*.
- La guía "enviar eventos" nombra `session_id` y `session_number` como parámetros de sesión.
- Ninguna página de Google relaciona el consentimiento con la atribución de la sesión.

### Cambio hecho el 16-oct

- El plugin mandaba siempre `"consent": {"ad_user_data": "DENIED", "ad_personalization": "DENIED"}`.
  Venía del ejemplo de `prompt-pretix.md` (línea 146), sin justificación. El dictamen legal no lo pide:
  pide Google Signals y personalización de anuncios apagados en la propiedad, y lo están.
- Se quitó en el commit `bcececa` de pretix-wompi (`main`, 16-oct 12:11), desplegado ese día.
- No se manda `GRANTED`: el sitio permite aceptar solo analítica y Pretix solo recibe `consent=1`. Sin
  bloque, GA4 usa lo que eligió cada persona en el sitio.

### Hipótesis abiertas, en orden, con su prueba

1. **El bloque `consent` (hipótesis).** Prueba enviada el 16-oct: visita del titular con
   `?utm_source=prueba&utm_campaign=verificacion-mp`, cookies aceptadas (`client_id` 1080503558.1792169880,
   `session_id` 1792169879). Desde Pretix salieron `prueba_mp_con_consent` y `prueba_mp_sin_consent`, con
   debug sin mensajes y 204 (script `docs/diagnostico/2026-10-16-prueba-mp-consent.py`). Además hay un
   pedido sin pagar de esa visita, cuyo `add_payment_info` sirve de control. Se lee en la exportación del
   16 (debería estar el 17 por la mañana): si `prueba_mp_sin_consent` sale con campaña `verificacion-mp`
   y el otro no, es la causa y `bcececa` lo arregla.
2. **Falta `session_number` (hipótesis).** Los eventos web lo traen y los del servidor no. Google lo
   nombra pero no dice que sea obligatorio. El sitio no lo pasa a Pretix: está en la cookie `_ga_<id>`
   (el `o` de `GS2.1.s<session_id>$o<session_number>$…`). Se prueba igual que la 1: evento de prueba con
   `session_id` + `session_number` sobre una visita del titular. Si funciona, el sitio tendría que
   pasarlo al widget y el plugin mandarlo.
3. **Faltan los datos de página (hipótesis).** Sin `page_location` el evento no trae fuente propia. Se
   prueba igual, con `page_location` = la URL de entrada guardada (`tracking.landing`).
4. **El Measurement Protocol no da atribución a los eventos del servidor en esta propiedad (hipótesis).**
   Lo que lo sugiere: tampoco heredan la primera campaña del usuario. Si 1, 2 y 3 fallan, queda esto. La
   salida sería atribuir con lo que sí funciona: `begin_checkout` del navegador (siempre con campaña) y
   "Ventas por campaña" de Pretix, que usa `utm_*` de cada pedido.

Las pruebas 2 y 3 se pueden mandar juntas en una sola visita del titular, con nombres de evento distintos.
Hay que mandarlas antes de 30 minutos sin actividad en la visita.

### Cómo mirar (para el siguiente agente)

- Acceso: ADC con
  `gcloud auth application-default login --impersonate-service-account=claude-lector@eventalist-analytics.iam.gserviceaccount.com`
  (solo lectura en GA4 y BigQuery). Propiedad `properties/554842243`; dataset
  `eventalist-analytics.analytics_554842243`, tablas `events_AAAAMMDD` (diarias, llegan al día siguiente
  a media mañana).
- `docs/diagnostico/2026-10-16-bq-sesion-compras.py AAAAMMDD` (pretix-wompi, se corre local): por cada
  evento del servidor imprime la visita completa, evento por evento, con fuente, consentimiento y primera
  campaña.
- Scripts de Pretix (los corre el titular por `railway ssh`, ver el encabezado de cada uno):
  `2026-10-15-compras-despues-del-arreglo.py`, `2026-10-15-llegada-compradores.py`,
  `2026-10-16-prueba-mp-consent.py`.
- En los eventos del servidor no hay `batch_page_id`: así se separan de los web.

### Otros pendientes de pretix-wompi

- Preguntas 1 y 2 de testigos-web (cuántas ventas de la semana borró el error del `fbclid`): script
  `2026-10-15-referrer-semana.py` listo, espera al titular.
- Aviso visible cuando el slug de campaña del evento está vacío: factible, no hecho. Espera el sí del
  titular.

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

## testigos-web (actualizado 2026-10-19)

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
- La investigación de Meta contra GA4 (al final): hipótesis 1 a cargo de testigos-web; las cifras, en los
  puntos 2 y 3 de "Siguiente".
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
- **Compras en `(not set)` en GA4:** la causa era el bloque `consent` `DENIED` que mandaba el plugin.
  Quitado en `bcececa` (pretix-wompi, 2026-10-16 12:11); probado en BigQuery con un evento con bloque y otro
  sin él en la misma visita, y con las compras reales del 16. D6a (`982f155`) también hacía falta. Tabla B
  de GA4: confiable desde el 16 a las 12:15; antes, no. (Sección de pretix-wompi.)
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
- **Meta reporta unas 4.800 vistas de la página de destino y GA4 unos 685 usuarios en 28 días.** ¿El
  píxel está en otro dominio? ¿Cómo define Meta esa vista en su navegador interno? ¿GA4 deja de contar
  visitas? ¿Cuántos `PageView` recibió el píxel desde `testigosdelamemoria.com`? Responde: testigos-web
  (documentación de Meta y código), con las cifras de los puntos 2 y 3 de "Siguiente". Hasta entonces, no
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

- Correr los scripts de Pretix que pida pretix-wompi para el punto 1 de "Siguiente".
- Las cifras de Meta por día (punto 3 de "Siguiente").
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
- **BigQuery (desde el 2026-10-15):** visitas con `fbclid` por día y por estado del consentimiento. Es el
  punto 2 de "Siguiente", a cargo de pretix-wompi.
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
