# Pendientes humanos · Feature 002 (medición, marcado y visibilidad)

> **Replanteo del 2026-09-17**: la capa de servidor (webhook de Pretix, plugin, endpoints del backend, envío de datos de compra a Meta y Google) se retiró. Nadie toca Pretix ni el backend. Lo que sigue es solo lo de este repo más las cuentas de medición.

Lo que no puede hacer el código. Una casilla por acción, agrupadas por quien la hace. Cada bloque dice qué desbloquea y cómo se comprueba. Fechas en calendario de Bogotá. Documento vivo: se marca a medida que llegan respuestas. Fuente de las decisiones: `specs/002-seo-medicion-visibilidad/` y `docs/revision-legal-2026-09-15-medicion.md`.

Fechas que mandan: **21 de septiembre** medición publicada · **29 de septiembre** fichas, programación y charlas publicadas · **5 de octubre** cambio de etapa de venta · **15 de octubre** último día para publicar contenido nuevo · **5 al 8 de noviembre** evento.

## 1. Preguntas que necesitan tu respuesta (Juan)

Sin estas respuestas el desarrollo avanza con identificadores vacíos, pero nada se publica.

- [x] **P1 · Título de la portada.** Respuesta 2026-09-16: opción (a), 60 caracteres. Pregunta original: ¿Cuál? (a) "Testigos de la Memoria · Villa de Leyva, 5 al 8 de noviembre" (60 caracteres) o (b) "Testigos de la Memoria · Villa de Leyva, 5-8 nov 2026" (53). Desbloquea T057.
- [x] **P2 · Textos legales del dictamen.** Respuesta 2026-09-16: aprobados tal cual. Pregunta original: ¿Apruebas tal cual, o con cambios, estos cuatro textos de `docs/revision-legal-2026-09-15-medicion.md`? (1) el aviso de cookies (§3a), (2) la sección 10 de la política y sus siete ajustes (§3b), (3) la casilla obligatoria de Pretix (§4), (4) la sección 12 de los términos (§4). Desbloquea T015 a T017 y, con ellos, toda la publicación de la medición.
- [ ] **P3 · Google Analytics 4.** Explicado el 2026-09-16 (ver sección 2, paso 2); falta el ID `G-`. Pregunta original: ¿Existe ya una propiedad de GA4 de Eventalist para este sitio, o creo instrucciones para una nueva? Necesito el ID de medición (empieza por `G-`). Desbloquea T029.
- [ ] **P4 · Meta.** Explicado el 2026-09-16 (ver sección 2, paso 3); falta el ID del dataset. Pregunta original: ¿En qué Business Manager va el píxel (dataset)? Necesito el ID del dataset. ¿Quién lo administra? Desbloquea T029.
- [ ] **P5 · Verificación del dominio en Meta.** Explicado el 2026-09-16 (ver sección 2, paso 3): es distinto de Search Console; por DNS. Pregunta original: ¿Por registro DNS en GoDaddy (recomendado, no toca el sitio) o por etiqueta en el HTML? Desbloquea T029.
- [x] **P6 · Google Ads.** Respuesta 2026-09-16: no hay cuenta. Se retira el enlace GA4 ↔ Google Ads de las tareas. Pregunta original: ¿Existe cuenta de Google Ads para la campaña? Si sí, se enlaza con GA4 y se importa la compra como conversión. Si no, se deja para cuando exista. No bloquea.
- [x] **P7 · Backend de Eventalist.** Resuelto el 2026-09-17: no hay backend en esta feature (capa retirada; contrato archivado en `docs/archivo-2027/`).
- [x] **P8 · Pretix.** Resuelto el 2026-09-17: no se instala nada en Pretix (capa retirada).
- [x] **P9 · Coordenadas de las sedes.** Respuesta 2026-09-16: tomarlas de los pines de Google Maps. Pregunta original: ¿Me autorizas a tomar latitud y longitud del pin de Google Maps de la Hospedería Duruelo y de la Casa Museo Antonio Nariño, o las confirmas con el organizador? Desbloquea T005 (se pueden dejar "por confirmar" hasta la verificación de T038).
- [x] **P10 · Hora de fin de la charla de periodismo digital.** Respuesta 2026-09-16: asumir dos horas (10:00 a 12:00 m.). Importa porque el subevento del marcado lleva hora de fin y el módulo de eventos de Google la usa. Pregunta original: (viernes 6, 10:00 a.m., Casa Museo). Sin ella el subevento se publica sin hora de fin. Pregunta para los organizadores. No bloquea.
- [x] **P11 · Fichas con las biografías actuales.** Respuesta 2026-09-16: sí. Pregunta original: ¿Publicamos las 12 fichas con las biografías que ya están en la portada, sin esperar textos de los panelistas? La spec lo asume; confírmalo. Desbloquea T042.
- [x] **P12 · Casilla nueva en Pretix.** Resuelto el 2026-09-17: la casilla no cambia (la ampliación se retiró con la capa de servidor).
- [x] **P13 · Nombres de los productos en Pretix.** Respuesta 2026-09-16: "Pase completo", "Viernes tarde", "Sábado mañana", "Sábado tarde", "Domingo mañana". Aplicado en data-model §1. Pregunta original: Confirma los cinco nombres literales tal como están en el panel: "Pase completo", "Franja · Viernes 6, tarde", "Franja · Sábado 7, mañana", "Franja · Sábado 7, tarde", "Franja · Domingo 8, mañana". El sitio hoy reconoce "Sábado Mañana", así que puede que difieran. Desbloquea T005.
- [x] **P14 · Excel de Jorge.** Respuesta 2026-09-16: lo mantiene el desarrollador. Espejo en `docs/plan-seo-estado.md` (columna Estado); el Excel se regenera desde ahí cuando haya que enviárselo a Jorge. Pregunta original: ¿Quieres que mantenga la columna Estado del Excel según avance esta feature, o lo lleva Jorge? Ver la tabla del final.

## 2. Tu paso a paso completo (Juan)

Todo lo que depende de ti, en el orden en que conviene hacerlo. Cada paso dice qué obtienes al final y a quién se lo entregas. Las que ya respondiste están en la sección 1; aquí solo van acciones.

### Esta semana (antes del 19 de septiembre)

- [x] **Paso 1 · Contratos externos.** Ya no aplica (2026-09-17): las ramas de los otros repos se borraron; los contratos quedan archivados en `docs/archivo-2027/` por si el evento se repite.
- [ ] **Paso 2 · Google Analytics 4.** Entra a https://analytics.google.com con la cuenta de Google de Eventalist. Abajo a la izquierda, el engranaje "Administrar".
  1. Si ya existe una propiedad de Eventalist, entra en ella; si no, "Crear propiedad" (nombre: Testigos de la Memoria; zona horaria: Colombia; moneda: COP).
  2. En la propiedad: "Flujos de datos" → "Añadir flujo" → "Web" → URL `https://testigosdelamemoria.com`, nombre "Sitio Testigos de la Memoria" → Crear.
  3. En la pantalla del flujo aparece el **ID de medición**, con la forma `G-AB12CD34EF`. Cópialo: es lo que va en el sitio.
  4. Administrar → "Recopilación y modificación de datos" → "Recopilación de datos": apaga "Señales de Google" y, si aparece, "Personalización de anuncios". (Obligación del dictamen legal.)
  5. Más adelante, cuando ya haya datos: Administrar → "Eventos" → marcar `begin_checkout` como "Evento clave".

  Lo que obtienes: el `G-…` (me lo pasas). Nada más.

- [ ] **Paso 3 · Meta: conjunto de datos (píxel).** Todo vive en https://business.facebook.com. El "Business Manager" (hoy "Portafolio empresarial") es la cuenta de empresa de Eventalist. Dentro está el "Administrador de eventos": https://business.facebook.com/events_manager2.
  1. "Conectar orígenes de datos" → "Web" → Conectar. Nombre: Testigos de la Memoria. Sitio: `https://testigosdelamemoria.com`. Crea un **conjunto de datos** (dataset). Es lo que antes se llamaba píxel; Meta le cambió el nombre en 2024, es la misma cosa.
  2. Al crearlo aparece un número de 15 o 16 cifras, por ejemplo `1234567890123456`. Ese es el **ID del dataset**: cópialo, es lo que va en el sitio.
  3. Si te ofrece "instalar el código" o "usar un socio", cierra esa parte: el código lo pone el sitio.
  4. En el dataset, pestaña "Configuración": "Coincidencias avanzadas automáticas": actívala. Y "Categorías de origen de datos": comprueba que no esté clasificado como salud o finanzas.

  Lo que obtienes: el ID del dataset (me lo pasas). Sin tokens: nada corre en servidor.

- [ ] **Paso 4 · Meta: verificar el dominio.** No es lo mismo que Search Console: Google ya sabe que el dominio es tuyo; Meta no.
  1. https://business.facebook.com/settings → "Seguridad de la marca" → "Dominios" → "Añadir" → `testigosdelamemoria.com`.
  2. Pestaña "Verificación de DNS": Meta te muestra un registro TXT con la forma `facebook-domain-verification=abc123…`. Cópialo.
  3. GoDaddy → tu dominio → DNS → "Añadir registro": tipo TXT, nombre `@`, valor el texto de Meta, TTL por defecto. Guardar.
  4. Espera unos minutos, vuelve a Meta y pulsa "Verificar dominio".

  Desde 2025 no es obligatorio para las campañas. Cinco minutos; si prefieres saltarlo, no bloquea nada.


- [ ] **Paso 6 · Pretix: no indexar la tienda (opcional).** Único ajuste en Pretix, y es opcional: evento `testigos-memoria` → Configuración → General → "Pedir a los buscadores que no indexen la tienda" → marcar → Guardar. No afecta la venta.

- [ ] **Paso 7 · Enviarme los identificadores.** Por este chat: el `G-…` de GA4 y el ID del dataset de Meta. Con eso configuro el sitio. No hacen falta secretos ni tokens: nada corre en servidor.

### Cuando tengas los identificadores



### El día de la publicación 1 (medición y textos legales, ≤ 21 de septiembre)


- [ ] **Paso 10b · Confirmar el cambio del workflow de despliegue.** El paso IndexNow en `.github/workflows/deploy.yml` (aviso a Bing tras cada deploy) quedó sin confirmar en git porque el hook de revisión no me deja preparar archivos de workflow: revisa el diff de ese archivo y confírmalo tú con un commit propio ("Deploy: aviso a IndexNow tras publicar").
- [ ] **Paso 11 · Revisión de restos y visto bueno de la publicación 1.** Antes del sí: repasamos juntos el diff completo de la rama y yo busco restos de la capa retirada en código, textos legales y documentación (tarea T073); comprobamos que el widget de Pretix carga igual que el 15 de septiembre. Luego me das el sí para `main`. Tras el deploy verifico en producción que no hay cookies antes de "Aceptar" y te paso captura.

### Antes del 30 de septiembre

- [ ] **Paso 12 · Bing Webmaster Tools.** Desde el perfil de Chrome "Eventalist" (el que tiene Search Console): https://www.bing.com/webmasters → iniciar sesión con la cuenta Microsoft o con Google → "Añadir sitio" → "Importar desde Google Search Console" → "Importar" → autorizar con la cuenta de Google → marcar `testigosdelamemoria.com` → "Importar". Queda verificado solo. Luego: menú "Sitemaps" → "Enviar sitemap" → `https://testigosdelamemoria.com/sitemap.xml`. Luego: "Inspección de URL" → pega `https://testigosdelamemoria.com/` → "Solicitar indexación". Por último abre "Rendimiento de IA" (AI Performance) para que empiece a registrar. Comprobación: captura de la propiedad con el sitemap en "Procesado".

- [ ] **Paso 13 · Visto bueno de la publicación 2** (≤ 29 sep): marcado del evento, 12 fichas de panelistas, programación, charlas abiertas. Tras el deploy: Search Console → "Sitemaps" → reenviar; "Inspección de URL" → solicitar indexación de la portada, `/programacion/`, `/charlas-abiertas/` y las fichas (Google limita las solicitudes diarias; empieza por portada, programación, charlas y los cuatro panelistas más conocidos).

### Octubre y noviembre

- [ ] **Paso 14 · 5 de octubre: visto bueno de la publicación del cambio de etapa.** Ese día el sitio debe recompilarse para que el marcado y el texto pasen de "pase completo" a "boletas por franja". Te lo pido ese día por la mañana.
- [ ] **Paso 15 · ≤ 15 de octubre: visto bueno de la publicación 3** (cómo llegar; dónde dormir solo si Carolina entregó la lista el 10).
- [ ] **Paso 16 · Agotados.** Cuando Pretix muestre una boleta agotada, avísame: cambio un interruptor, te pido el sí y publico para que Google deje de decir "disponible".
- [ ] **Paso 17 · Revisión semanal hasta el 4 de noviembre** (media hora, contigo): pedidos pagados en Pretix frente a compras en Meta (Events Manager) y en GA4 (Informes → Monetización); páginas indexadas en Search Console (meta: 80 % el 20 de octubre); informe "Eventos" de Search Console sin errores; citas en Bing "Rendimiento de IA".
- [ ] **Paso 18 · Correo hola@eventalist.co.** Si alguien escribe pidiendo retirar su aceptación de cookies o una copia de ella: responder en 10 días hábiles (consultas) o 15 (reclamos); la copia se saca del backend buscando el identificador que la persona ve en "Cookies y preferencias" del sitio.

## 3. Backend y Pretix

Nada. La capa de servidor se retiró el 2026-09-17. Los contratos están archivados en `docs/archivo-2027/` por si el encuentro se repite en 2027 con venta continua.

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
| ≤ 21 sep | Publicación 1: medición y textos legales (revisión de restos antes) | Juan (visto bueno) |
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
| T08 noindex Pretix | Opcional, casilla en el panel de Pretix (paso 6) |
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
