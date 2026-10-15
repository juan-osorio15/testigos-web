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

## Preguntas abiertas

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

- Decir por qué canal y con qué enlace salió la oferta de las 11 compras de esta semana (historia, publicación,
  WhatsApp, correo). Es la pregunta 3 de testigos-web a pretix-wompi en "Preguntas abiertas".
- Compra real pequeña desde `https://testigosdelamemoria.com/?utm_source=prueba&utm_campaign=verificacion-ga4`,
  con cookies aceptadas y en la misma visita. A las 24 a 48 horas, mirar en GA4 que salga en la fila
  `verificacion-ga4`.
- Prueba en el teléfono de "Abrir en el navegador" desde Instagram: pasos en el historial, "¿Dónde se puede
  perder la UTM?", "Prueba de teléfono". Anotar qué conserva la URL en Safari o Chrome y en la tienda.
- Dar los valores del afiche y del reel que ya circulan, y confirmar las campañas en uso.
- Copiar el prompt y la base de conocimiento del chatbot (`docs/system-prompt-atencion.md`,
  `docs/chatbot-conocimiento.md`) en su plataforma.
- Fuera de los repos: parámetros de URL por nombre en los anuncios de Meta (y revisar que cada anuncio activo
  los tenga), enlace de la bio con `utm_campaign`, repartir los enlaces a organizadores y panelistas, y
  definir el tráfico interno en GA4.
- Las respuestas marcadas "Responde: titular" en "Preguntas abiertas".

---

## INVESTIGACIÓN NUEVA: Meta reporta unas 7 veces más visitas que GA4 (abierta el 2026-10-13)

Para un agente nuevo de testigos-web. Es una investigación aparte de la de UTM, que está resumida más abajo.
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

---

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
