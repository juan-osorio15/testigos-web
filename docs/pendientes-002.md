# Pendientes humanos · Feature 002 (medición, marcado y visibilidad)

Lo que no puede hacer el código. Una casilla por acción, agrupadas por quien la hace. Cada bloque dice qué desbloquea y cómo se comprueba. Fechas en calendario de Bogotá. Documento vivo: se marca a medida que llegan respuestas. Fuente de las decisiones: `specs/002-seo-medicion-visibilidad/` y `docs/revision-legal-2026-09-15-medicion.md`.

Fechas que mandan: **21 de septiembre** medición publicada · **29 de septiembre** fichas, programación y charlas publicadas · **5 de octubre** cambio de etapa de venta · **15 de octubre** último día para publicar contenido nuevo · **5 al 8 de noviembre** evento.

## 1. Preguntas que necesitan tu respuesta (Juan)

Sin estas respuestas el desarrollo avanza con identificadores vacíos, pero nada se publica.

- [x] **P1 · Título de la portada.** Respuesta 2026-09-16: opción (a), 60 caracteres. Pregunta original: ¿Cuál? (a) "Testigos de la Memoria · Villa de Leyva, 5 al 8 de noviembre" (60 caracteres) o (b) "Testigos de la Memoria · Villa de Leyva, 5-8 nov 2026" (53). Desbloquea T057.
- [x] **P2 · Textos legales del dictamen.** Respuesta 2026-09-16: aprobados tal cual. Pregunta original: ¿Apruebas tal cual, o con cambios, estos cuatro textos de `docs/revision-legal-2026-09-15-medicion.md`? (1) el aviso de cookies (§3a), (2) la sección 10 de la política y sus siete ajustes (§3b), (3) la casilla obligatoria de Pretix (§4), (4) la sección 12 de los términos (§4). Desbloquea T015 a T017 y, con ellos, toda la publicación de la medición.
- [ ] **P3 · Google Analytics 4.** Explicado el 2026-09-16 (ver sección 2, paso 1); falta el ID `G-` y el secreto. Pregunta original: ¿Existe ya una propiedad de GA4 de Eventalist para este sitio, o creo instrucciones para una nueva? Necesito el ID de medición (empieza por `G-`) y un secreto de Measurement Protocol para el backend. Desbloquea T029.
- [ ] **P4 · Meta.** Explicado el 2026-09-16 (ver sección 2, paso 2); faltan ID del dataset y token. Pregunta original: ¿En qué Business Manager va el píxel (dataset)? Necesito el ID del dataset y un token de acceso de la Conversions API. ¿Quién lo administra? Desbloquea T029.
- [ ] **P5 · Verificación del dominio en Meta.** Explicado el 2026-09-16 (ver sección 2, paso 3): es distinto de Search Console; por DNS. Pregunta original: ¿Por registro DNS en GoDaddy (recomendado, no toca el sitio) o por etiqueta en el HTML? Desbloquea T029.
- [x] **P6 · Google Ads.** Respuesta 2026-09-16: no hay cuenta. Se retira el enlace GA4 ↔ Google Ads de las tareas. Pregunta original: ¿Existe cuenta de Google Ads para la campaña? Si sí, se enlaza con GA4 y se importa la compra como conversión. Si no, se deja para cuando exista. No bloquea.
- [x] **P7 · Backend de Eventalist.** Respuesta 2026-09-16: lo desarrolla Juan con un agente en el repo del backend de Eventalist. Entrega: `docs/eventalist-integracion-medicion.md` (contrato completo para el agente; el agente devuelve cómo usar los endpoints y cualquier cambio de contrato). Pregunta original: ¿Quién desarrolla el backend en Railway y cuándo puede tener listos (1) el endpoint de registro de consentimiento y (2) el receptor del webhook de Pretix que envía la compra a Meta y GA4? Contratos en `specs/002-seo-medicion-visibilidad/contracts/`. Si (1) no está el 21 de septiembre, la política se publica con la variante B ("registro en el navegador") y se cambia después. Desbloquea T028 y decide la variante de T015.
- [x] **P8 · Pretix.** Respuesta 2026-09-16: versión 2026.5.1 (cumple). El plugin lo instala Juan en la instancia de Pretix; instrucciones en `docs/eventalist-integracion-medicion.md` §C. Pregunta original: ¿Qué versión corre pretix.eventalist.co (Admin → Global settings)? Necesita ser 2024.7 o posterior. ¿Quién puede instalar un plugin de Python en esa instancia? Desbloquea T027.
- [x] **P9 · Coordenadas de las sedes.** Respuesta 2026-09-16: tomarlas de los pines de Google Maps. Pregunta original: ¿Me autorizas a tomar latitud y longitud del pin de Google Maps de la Hospedería Duruelo y de la Casa Museo Antonio Nariño, o las confirmas con el organizador? Desbloquea T005 (se pueden dejar "por confirmar" hasta la verificación de T038).
- [x] **P10 · Hora de fin de la charla de periodismo digital.** Respuesta 2026-09-16: asumir dos horas (10:00 a 12:00 m.). Importa porque el subevento del marcado lleva hora de fin y el módulo de eventos de Google la usa. Pregunta original: (viernes 6, 10:00 a.m., Casa Museo). Sin ella el subevento se publica sin hora de fin. Pregunta para los organizadores. No bloquea.
- [x] **P11 · Fichas con las biografías actuales.** Respuesta 2026-09-16: sí. Pregunta original: ¿Publicamos las 12 fichas con las biografías que ya están en la portada, sin esperar textos de los panelistas? La spec lo asume; confírmalo. Desbloquea T042.
- [ ] **P12 · Casilla nueva en Pretix.** Explicado el 2026-09-16 (ver sección 2, paso 4); la hace Juan el día de la publicación legal. Pregunta original: ¿La aplicas tú en el panel (Settings → Confirmation text) el día que se publique la política, o lo hace quien administre Pretix? La fecha de ese cambio es la que separa las compras que sí se envían a Meta y GA4 de las que no. Desbloquea T027 y T028.
- [x] **P13 · Nombres de los productos en Pretix.** Respuesta 2026-09-16: "Pase completo", "Viernes tarde", "Sábado mañana", "Sábado tarde", "Domingo mañana". Aplicado en data-model §1. Pregunta original: Confirma los cinco nombres literales tal como están en el panel: "Pase completo", "Franja · Viernes 6, tarde", "Franja · Sábado 7, mañana", "Franja · Sábado 7, tarde", "Franja · Domingo 8, mañana". El sitio hoy reconoce "Sábado Mañana", así que puede que difieran. Desbloquea T005.
- [x] **P14 · Excel de Jorge.** Respuesta 2026-09-16: lo mantiene el desarrollador. Espejo en `docs/plan-seo-estado.md` (columna Estado); el Excel se regenera desde ahí cuando haya que enviárselo a Jorge. Pregunta original: ¿Quieres que mantenga la columna Estado del Excel según avance esta feature, o lo lleva Jorge? Ver la tabla del final.

## 2. Tus acciones (Juan, manager de Eventalist)

Guía de las cuatro que generan dudas (respuesta a P3, P4, P5 y P12 del 2026-09-16):

**Paso 1 · GA4.** Entra a https://analytics.google.com con la cuenta de Google de Eventalist. Abajo a la izquierda, el engranaje "Administrar". Si ya existe una propiedad de Eventalist, puedes crear dentro de ella un "flujo de datos" nuevo para este sitio; si no, "Crear propiedad" (nombre: Testigos de la Memoria; zona horaria Bogotá; moneda COP). En la propiedad: "Flujos de datos" → "Añadir flujo" → Web → URL `https://testigosdelamemoria.com`. Al crearlo aparece el **ID de medición**, con este aspecto: `G-AB12CD34EF`. Es lo que necesito. En la misma pantalla del flujo, más abajo, "Secretos de la API de Measurement Protocol" → "Crear" → copia el valor (parece `aBcDeFgHiJkLmNoPqRsT`); es para el backend, no para el sitio. Luego, en Administrar → "Recopilación y modificación de datos" → "Recopilación de datos": apaga "Señales de Google" y "Personalización de anuncios". Por último, Administrar → "Eventos" → cuando existan `purchase` y `begin_checkout`, marcarlos como "Evento clave" (se puede hacer después de la primera compra de prueba).

**Paso 2 · Meta.** Todo vive en https://business.facebook.com. El "Business Manager" (ahora "Portafolio empresarial") es la cuenta de empresa de Eventalist; dentro está el "Administrador de eventos" (Events Manager): https://business.facebook.com/events_manager2. Ahí, "Conectar orígenes de datos" → Web → crea un **conjunto de datos** (dataset; es lo que antes se llamaba píxel; Meta cambió el nombre en 2024). Al crearlo aparece un número de 15 o 16 cifras, por ejemplo `1234567890123456`: ese es el **ID del dataset**, lo que necesito para el sitio. Para el backend hace falta además un **token de la Conversions API**: en el mismo dataset, pestaña "Configuración" (Settings), sección "API de conversiones" → "Generar token de acceso" → aparece una cadena muy larga que empieza por `EAA…`. Cópiala una vez: no se vuelve a mostrar. En la pestaña "Probar eventos" (Test Events) hay un código tipo `TEST12345` que se usa solo en las pruebas. Y en "Configuración" del dataset, revisa que "Categorías de origen de datos" no lo tenga clasificado como salud o finanzas.

**Paso 3 · Verificación del dominio en Meta.** No es lo mismo que Search Console: Google ya sabe que el dominio es tuyo, pero Meta no. Se hace en Configuración del negocio → "Seguridad de la marca" → "Dominios" → "Añadir" → `testigosdelamemoria.com` → pestaña "Verificación de DNS": Meta te da un registro TXT con la forma `facebook-domain-verification=abc123…`. Lo añades en GoDaddy (DNS → Añadir registro → tipo TXT, nombre `@`, valor el que te dio Meta), esperas unos minutos y pulsas "Verificar dominio". Desde 2025 ya no es obligatorio para las campañas, pero permite editar cómo se ven los enlaces del sitio en los anuncios y ata el dataset al dominio. Cinco minutos; si prefieres saltarlo, no bloquea nada.

**Paso 4 · Casilla nueva en Pretix.** Hoy la tienda tiene una casilla obligatoria que el comprador marca antes de pagar ("He leído la política… y autorizo a Eventalist a tratar mis datos para emitir la boleta…"). Solo autoriza la boleta y el ingreso. El dictamen dice que enviar a Meta y Google el correo, teléfono y nombre del comprador (hasheados) es una finalidad nueva y una transferencia, y que la casilla debe decirlo. Por eso hay un texto nuevo (`docs/revision-legal-2026-09-15-medicion.md` §4) que reemplaza al actual. Dónde: en Pretix, el evento → Configuración → General → sección "Textos de confirmación" (Confirmation texts), donde está la casilla actual. Cuándo: el mismo día que se publique la política nueva del sitio (publicación 1, ≤ 21 sep). Esa fecha es `ATTRIBUTION_CONSENT_SINCE`: el backend solo enviará a Meta y Google los pedidos creados después. Lo haces tú (tienes admin): dos minutos.


- [ ] Crear o localizar la propiedad de GA4; apagar Google Signals y la personalización de anuncios; sin User-ID; crear el secreto de Measurement Protocol; marcar `purchase` y `begin_checkout` como eventos clave. Se comprueba con el ID `G-` y una captura de Data collection. Antes del 19 de septiembre.
- [ ] Crear o localizar el dataset de Meta, generar el token de la Conversions API, verificar el dominio testigosdelamemoria.com y revisar que el dataset no caiga en una categoría restringida. Se comprueba en Events Manager → Settings. Antes del 19 de septiembre.
- [ ] Bing Webmaster Tools desde el perfil de Chrome "Eventalist": My Sites → Import → Google Search Console → importar testigosdelamemoria.com; Sitemaps → añadir `https://testigosdelamemoria.com/sitemap.xml`; URL Inspection → portada → Request indexing; abrir el informe AI Performance. Se comprueba con una captura de la propiedad verificada. Antes del 30 de septiembre.
- [ ] Dar el visto bueno de publicación a `main` en cada despliegue: (1) medición y textos legales (≤ 21 sep), (2) marcado y páginas nuevas (≤ 29 sep), (3) cómo llegar y dónde dormir (≤ 15 oct), (4) cambio de etapa (5 oct), (5) agotados (cuando ocurra). Cada uno es un sí explícito a ese cambio.
- [ ] Tras cada despliegue: Search Console → Sitemaps → reenviar; Inspección de URL → solicitar indexación de las páginas nuevas (portada, programación, charlas, fichas).
- [ ] Revisión semanal hasta el 4 de noviembre (con el desarrollador): pedidos pagados en Pretix frente a compras en Meta y GA4; páginas indexadas en Search Console; informe de eventos sin errores; citas en Bing AI Performance.
- [ ] Atender por hola@eventalist.co consultas y revocaciones sobre cookies en los plazos ya asumidos (10 días hábiles consultas, 15 reclamos), incluida la entrega del registro de aceptación cuando lo pidan.

## 3. Backend y Pretix (Eventalist)

Contratos: `specs/002-seo-medicion-visibilidad/contracts/pretix-attribution.md` y `contracts/measurement-events.md` (sección "Endpoint de consentimiento"). Cuanto antes: es lo que más tarda.

- [ ] Confirmar versión de pretix ≥ 2024.7 en pretix.eventalist.co.
- [ ] Instalar y habilitar el mini plugin `pretix_tdm_attribution` (unas 30 líneas: copia los atributos `tracking-*` del widget más IP y user-agent al `api_meta` del pedido). Se comprueba con un pedido de prueba cuyo `api_meta.tracking` tenga datos.
- [ ] Activar "Ask search engines not to index the ticket shop" en la configuración del evento. Se comprueba con `curl -sI` de la tienda o el `<meta name="robots">` de su HTML.
- [ ] Crear el webhook del organizador hacia el backend con la acción `pretix.event.order.paid` y Basic Auth.
- [ ] Aplicar la casilla obligatoria nueva (texto del dictamen §4) y anotar la fecha como `ATTRIBUTION_CONSENT_SINCE`.
- [ ] Backend: endpoint `POST /api/v1/marketing/consent/` (upsert por `id`, sin IP ni identidad, CORS para https://testigosdelamemoria.com, responde 204).
- [ ] Backend: receptor del webhook, idempotente por código de pedido, que consulta el pedido por la API, descarta los anteriores a `ATTRIBUTION_CONSENT_SINCE` y envía `Purchase` a la Conversions API (event_id = código) y `purchase` al Measurement Protocol de GA4 (client_id y session_id del pedido). Se comprueba con el quickstart §4: compra de prueba visible en Meta Test Events y en GA4 DebugView, y reenvío del webhook sin duplicado.
- [ ] Enviar solo los datos enumerados en la sección 10 de la política; si se añade un dato, avisar antes para actualizar la política.

## 4. Carolina

- [ ] Vista previa de la portada en el depurador de Facebook (Sharing Debugger) y en el Post Inspector de LinkedIn; si sale la imagen vieja, "Scrape again". WhatsApp ya está validado. Cuando existan las fichas, repetir con una ficha. Se comprueba con capturas.
- [ ] Lista de alojamientos para la página "Dónde dormir": al menos seis, con nombre, URL, distancia aproximada a las sedes y, donde se consiga, acuerdo de enlace recíproco. Fecha límite **10 de octubre**; sin lista, la página no se publica.
- [ ] Tareas off-site del Excel que le corresponden (T11, T21, T26 a T29): nota de prensa, calendarios locales (fondocultura.org, terrojo.com, relatovilla.com, agenda de la Alcaldía, Colombia.travel), enlace desde las dos sedes, evento de Facebook. El sitio le da URL propia por panelista, programación y charlas abiertas para enlazar. Las agendas culturales que ya rankean para "eventos Villa de Leyva" son lo que los asistentes de IA leen: pesan más que los enlaces.

## 5. Jorge

- [ ] Pedir a cada uno de los 12 panelistas que publique en sus redes o columnas con enlace a su ficha (`https://testigosdelamemoria.com/panelistas/<nombre>/`, disponibles desde el 29 de septiembre) o a la portada. Meta del Excel: al menos 8 de 12. Es el activo de autoridad más grande y no cuesta nada.
- [ ] Decisiones del Excel que son suyas: T07 (ya resuelta: no existe pretix.eu, era un falso positivo), T14 (validar la programación que se publica como subeventos), T16 y T17 (aprobar los textos de las fichas y de charlas abiertas), T31 (presupuesto de campaña), T36 y T37 (edición 2027 e inglés: fuera de esta feature).
- [ ] Un vídeo en YouTube con el nombre del evento (correlación más alta con visibilidad en asistentes de IA según Ahrefs 2026). Opcional.

## 6. Hitos con fecha

| Fecha | Qué | Quién |
|---|---|---|
| ≤ 19 sep | Cuentas de GA4 y Meta, respuestas P1 a P13 | Juan |
| ≤ 21 sep | Publicación 1: medición y textos legales; casilla nueva en Pretix el mismo día | Juan (visto bueno), Eventalist |
| ≤ 29 sep | Publicación 2: marcado, fichas, programación, charlas abiertas; reenvío de sitemap; Bing verificado | Juan, desarrollador |
| ≤ 30 sep | Bing Webmaster Tools importado y sitemap enviado | Juan |
| 5 oct | Publicación del cambio de etapa (franjas a la venta, pase retirado) | Juan (visto bueno) |
| ≤ 10 oct | Lista de hoteles | Carolina |
| ≤ 15 oct | Publicación 3: cómo llegar, dónde dormir | Juan, desarrollador |
| 20 oct | Comprobación: ≥ 80 % de las URL indexadas | Juan, desarrollador |
| 27 oct a 4 nov | Marcar agotados en cuanto ocurran y publicar | Juan |
| 1 nov | Comprobación: 8 de 12 panelistas en primera página por nombre; marca en primer lugar | desarrollador |

## 7. Excel de Jorge: qué pasa con cada tarea

| Excel | Estado en esta feature |
|---|---|
| T01 GA4, T02 píxel | En la feature (historia 1), con aviso de consentimiento y atribución de compra real, no solo el clic |
| T03 Search Console | Ya hecho antes de la auditoría (propiedad de dominio por DNS) |
| T04 Bing | Acción de Juan (sección 2) |
| T05, T06 título y descripción | En la feature; título pendiente de P1 |
| T07 dominio de compra | Descartada: falso positivo, no existe pretix.eu en el sitio |
| T08 noindex Pretix | Acción de Eventalist (sección 3) |
| T09 legales noindex, T10 imagen LCP | En la feature (historia 5) |
| T11 imagen al compartir | Carolina (Facebook y LinkedIn; WhatsApp ya validado) |
| T12, T13, T14, T15 schema | En la feature (historia 2); T14 requiere que Jorge valide la programación |
| T16 fichas, T17 charlas, T18 programación | En la feature (historia 3), antes del 29 de septiembre; son 12 panelistas, no 11 |
| T19 páginas por día | Descartada: contenido delgado que compite con la programación |
| T20 cómo llegar, T21 dónde dormir | En la feature (historia 6); T21 depende de la lista de Carolina |
| T22 URL para FAQ | Descartada: Google retiró el resultado enriquecido de FAQ en 2026 y se le quitaría texto a la portada |
| T23 migas, T24 sitemap | En la feature (historias 3 y 4); el sitemap se genera solo y se avisa a Bing por IndexNow |
| T25 ponentes | Jorge (sección 5) |
| T26 prensa, T27 calendarios, T28 sedes, T29 Facebook | Carolina (sección 4) |
| T30 ficha en eventalist.co | Equipo Eventalist, fuera de este repositorio |
| T31 campañas, T33 revisión de datos | Fuera de la feature; dependen de que la medición esté publicada el 21 de septiembre |
| T32 artículos por tema | Fuera de la feature (semanas 5 y 6, redacción) |
| T34 disponibilidad | En la feature: automática el 5 de octubre y con interruptor de agotado |
| T35, T36, T37 post-evento | Fuera de la feature; inversión para 2027 |
