# Diagnóstico: fuentes de verdad y orden del repo

Entregable 1 de `specs/004-fuentes-de-verdad`. Fecha: 2026-10-19. Hecho con cuatro inventarios en paralelo (hechos, herramientas, documentos, historial de git) y verificado a mano en los puntos graves. No se abrió ningún archivo de credenciales ni de datos personales; el registro de envíos se consultó con `campana.py registro`, que solo da conteos.

## 1. Lo esencial

1. **Un error de dato llegó hoy a 29 personas.** Las dos plantillas activas dicen que cada franja tiene "dos conversatorios" (`interesado-aviso.html:74`, `expirado-recordatorio.html:80`). El registro muestra 18 correos reales a interesados y 11 a expirados el 19 de octubre. Según `agenda.ts`, el viernes en la tarde tiene un conversatorio más la bienvenida y el domingo en la mañana tiene dos más el cierre.
2. **El patrón se repite.** En dos meses hubo seis errores de dato que llegaron al público. Todos vienen de lo mismo: un hecho copiado a mano que no se actualiza, o un hecho que no tiene fuente y cada pieza lo cuenta a su manera.
3. **Dentro del sitio la base es buena.** `src/data/`, `src/config.ts` y `src/routes.ts` funcionan como fuente. El problema está en lo que sale del sitio: plantillas, scripts, textos para pegar y documentos.
4. **Afuera no hay inventario.** Pretix, el chatbot, Meta, Google Ads, los perfiles y los impresos reciben texto pegado a mano y nadie lleva la cuenta de qué se pegó ni cuándo.
5. **El orden de herramientas y documentos frena a los agentes, pero no le llega al público.** Va después en la prioridad.

## 2. Errores que ya pasaron y lo que costaron

Ordenados por costo.

- **Precio del pase de la etapa 1 en la etapa 2.** El 13 de octubre Pretix cobraba 340.000 y el sitio y su marcado para buscadores siguieron en 310.000 hasta el 17 (`63f0755`, 14 archivos). Quedan restos de 310.000 en 9 archivos, dos de ellos plantillas de correo que se pueden reutilizar (`expirado.html`, `expirado-pedido.html`). Causa: un dato que depende de la fecha se cambia a mano el día del cambio.
- **"Dos conversatorios" por franja.** 29 correos el 19 de octubre (sección 1). Sigue en las plantillas activas. El sitio (`ui.ts:79`) y el chatbot dicen "dos o tres" desde el 18 de septiembre. Causa: la franja no tiene fuente; es lógica dentro de `TicketSection.astro:57-79` y otra vez en `jsonld.ts:143`. Además "conversatorio" significa dos cosas: el pase vende "siete" (sin bienvenida ni cierre) y `agenda.ts` tiene nueve sesiones de tipo conversatorio.
- **El pase como "los cuatro días".** Correo a expirados del 12 de octubre, 8 personas; la corrección llegó dos minutos después del envío (`cb0b905`). El pase cubre del 6 al 8. Causa: se copió el gancho del sitio ("Cuatro días en Villa de Leyva", que habla del encuentro) sin cotejar con la agenda.
- **Enlace de WhatsApp equivocado.** Casi 7 días en el sitio (`7cbc122` a `eca1131`). Dentro del sitio la corrección fue una línea gracias a `WHATSAPP_URL`; la copia en una plantilla de correo hubo que cambiarla aparte. Nota: `estado.md` dice que el correo del 12 de octubre salió con el enlace viejo, pero las versiones enviadas no tenían enlace de WhatsApp. El estado también se equivoca.
- **Cargos y grafía de panelistas.** Cinco correcciones. La más larga: Luz María Sierra como directora de El Colombiano 25 días en el sitio; en el chatbot se corrigió dos semanas después que en el sitio.
- **`http://` en textos externos.** El guion del chatbot y la firma de los correos de Pretix llevaban el dominio sin `https://`, que en Colombia no abre. Hubo que volver a pegar ambos (`55ec227`).
- **Fechas de etapa.** La etapa 2 se puso el 12 y se corrigió al 13 dos horas después; la fecha estaba en 5 archivos (`d660136`, `bde6d22`).

## 3. Problemas ordenados por riesgo

Riesgo es la probabilidad de que un dato falso llegue al público por la cantidad de gente y lo irreversible del canal.

1. **Campañas con hechos escritos a mano.** Correo y WhatsApp son irreversibles y llegan a la gente más cercana a comprar. Las plantillas tienen precios, fechas, franjas, panelistas y enlaces a mano, y nada las compara con la fuente antes de `--enviar`. Las plantillas viejas con 310.000 siguen en la carpeta y una guía vigente (`docs/campanas/expirados/titular/correo-resend.md`) todavía manda a usarlas.
2. **Hechos sin fuente.** La franja y sus sesiones, el número de conversatorios, los días del pase, el número de panelistas ("quince" escrito en `routes.ts:136`, el chatbot y el plan de Google Ads), el aforo, la venta en la puerta. Cada pieza los redacta a su manera.
3. **Copias externas sin registro.** El chatbot responde con lo que se le pegó; Pretix muestra lo que se le pegó; las plantillas de Meta no se editan después de aprobadas. Hoy hay contradicciones vivas: Pretix llama "talleres de periodismo" a lo que el sitio llama "charlas abiertas" (`pretix-tienda-textos.md:171`), y anuncia venta en la puerta que el prompt del chatbot da como no confirmada; la base del chatbot dice que el único canal de atención es el correo (`chatbot-conocimiento.md:282`) y el sitio ofrece WhatsApp.
4. **Datos que dependen de la fecha cambiados a mano.** El precio y las fechas de etapa. El 310.000 ya no existe en el código, solo en copias, así que nadie puede saber desde el repo cuál fue el precio de la etapa 1.
5. **Textos vencidos dormidos.** `tickets.soon`, `tickets.slotSoon`, `notify.*` y `stages.*` en `src/ui.ts` describen etapas pasadas y se publican si `pretixReady` pasa a `false`. `ui.ts` mezcla con el microcopy unas 30 claves que son hechos (fechas, sedes, conteos, etapas) y las repite en inglés.
6. **Identificadores repetidos entre el sitio y los scripts.** URL del backend, slug de la campaña del backend, slug del evento y organizador de Pretix, correo de contacto, dominio. Un cambio olvidado rompe una campaña o lee el evento equivocado. Suele fallar de forma visible, por eso va abajo.
7. **Estado y decisiones repartidos.** Pendientes en cinco lugares que se contradicen (`pendientes-002.md`, `plan-seo-estado.md`, `medicion-embudo/estado.md`, `atencion-preguntas.md`, casillas de `campana-interesados/titular.md`, más 26 tareas abiertas en specs ya publicadas). `plan-seo-estado.md` dice "sin Google Ads" y `campana-google-ads/plan.md` planea pauta. Decisiones en unos 15 archivos más la memoria de Claude y los commits. Unas 15 referencias rotas.
8. **Reglas fuera del repo.** No hay `README` ni `CLAUDE.md`; `.claude/` lo ignora `~/.gitignore_global`, así que el agente abogado y los skills no viajan. Los skills de spec-kit citan `.specify/scripts/` y `.specify/templates/`, borrados el 26 de agosto.
9. **Herramientas sin índice.** Tres raíces (`brand/og/`, `brand/pretix/`, `scripts/`), ningún comando en `package.json` y la forma de correrlas repartida en comentarios y documentos de features (uno inexistente: `generar.mjs:12` cita `specs/003-embudo-sitio/informe.md`).

## 4. Inventario de hechos (resumen)

### Hechos con fuente y cuántas copias tienen fuera de ella

- **Nombre y subtítulo**: `event.ts:14-16`. Más de 40 copias; ninguna contradice.
- **Fechas y días**: `event.ts:17-22`, `agenda.ts`. Unas 20 copias en el sitio (`ui.ts`, `routes.ts`, `Hero.astro:162`, `en.astro`, `terminos-y-condiciones.astro`, `faqs.ts`, `stays.ts`), 8 en `brand/`, 4 plantillas de correo, Pretix, chatbot, WhatsApp, Google Ads.
- **Horarios**: `agenda.ts`. Copiados en Pretix, chatbot y Google Ads; sin contradicciones.
- **Sedes y direcciones**: `event.ts:188-237`. Copias en `stays.ts`, `ui.ts`, boleta, escarapela, Pretix, chatbot y WhatsApp.
- **Precios y etapas**: `event.ts:40-43` y `:96-142`. Unas 25 piezas con copias.
- **Panelistas y cargos**: `speakers.ts`. Samper Pizano aparece en 24 archivos fuera de `src/data/`; Yolanda Ruiz en 17; Cecilia Orozco en 15. Las piezas públicas tienen hoy la grafía correcta.
- **Contacto**: `config.ts:109` y `:116`. El número de WhatsApp en sí solo existe como comentario (`config.ts:114`).
- **Dominio y enlaces**: `config.ts:6` y `:18`. El dominio está escrito en unos 75 lugares de documentos y plantillas.
- **Identificadores** (backend, Pretix, GA4, píxel): `config.ts`. Repetidos en `scripts/campanas/` y en documentos.
- **Festivos**: solo `scripts/campanas/reglas.py:25-30`, solo 2026.
- **Datos legales**: `config.ts:128-145`.

### Hechos sin fuente

- La franja: cuántas hay, su nombre y qué sesiones tiene.
- Los conteos: siete conversatorios, cuatro días del encuentro, tres días del pase, quince panelistas.
- El aforo y los cupos (la plantilla de Meta `cupos_franja` depende de un dato que no existe).
- El precio de la etapa 1.
- La venta en la puerta y la apertura de puertas.
- Las UTM de cada pieza (la misma campaña de expirados usa `utm_campaign=expirados-2026` en WhatsApp y `expirados` en correo).

### Hecho o texto

Criterio propuesto: es un **hecho** todo lo que, si cambia en la realidad, vuelve falsa la frase (un precio, una fecha, una hora, un nombre, un cargo, una sede, un conteo, un enlace, un identificador, el nombre de un producto en Pretix). Es **texto** lo que sigue siendo cierto aunque cambien los hechos ("Todavía puedes asegurar tu lugar"). Una frase puede mezclar los dos: "el pase completo a todos los conversatorios está a $340.000" es texto con un hecho dentro, y el hecho debe entrar desde la fuente.

## 5. Consumidores que no leen código

- **Pretix**: textos de tienda, productos, correos y firma (`docs/pretix/pretix-tienda-textos.md`), más la boleta y la escarapela generadas en `brand/pretix/`.
- **Chatbot**: base de conocimiento y prompt (`docs/chatbot/legacy/chatbot-conocimiento.md`, `docs/chatbot/legacy/system-prompt-atencion.md`), con su prueba adversarial. Son los que más hechos copian.
- **Meta**: plantillas de WhatsApp aprobadas (`docs/campanas/whatsapp-ventas/plantillas.md` y los planes de cada campaña). No se editan después de aprobadas; un dato que cambia obliga a una plantilla nueva.
- **Google Ads**: `docs/campanas/google-ads/plan.md`, con precios y 13 nombres de panelistas.
- **Perfiles, impresos con QR, OG en redes**: no tienen copia en el repo ni registro.

En ninguno queda constancia de qué versión se pegó ni cuándo.

## 6. Herramientas

- `scripts/campanas/` (Python): bien armado. No lee nada de `src/`; slugs, URL del backend, organizador de Pretix y remitente están copiados.
- `scripts/informe/` (Node): lee `speakers.ts` y `agenda.ts` con expresiones regulares. El contenido de cada informe (`informes/<fecha>/contenido.mjs`, ignorado) tiene precios a mano.
- `brand/og/make-og.mjs`: lee `speakers.ts` con expresiones regulares (buen patrón). `og.html` y los textos de las páginas tienen fechas y lugar a mano. La versión `v3` de la imagen de portada hay que subirla en cinco archivos.
- `brand/pretix/boleta/` y `escarapela/`: sede, fechas y dominio a mano. Comparten `lib.mjs` (buen patrón).
- Duplicación: cuatro cargadores del logo, cinco rutas fijas de Chrome, dos lectores de TypeScript por expresiones regulares, la paleta copiada en cinco o más sitios fuera de `tokens.css`.
- El sitio está en TypeScript y las campañas en Python: Python no puede importar `src/data/*.ts`. Esto condiciona dónde vive la fuente.
- `acreditaciones.csv` (ignorado) está suelto en la raíz sin herramienta.

## 7. Documentos

- **Vigentes para actuar** (unos 20): estado y diseño del embudo, estándar de medición, enlaces y nombres, guía del manager de redes, guía de reportes, README de campañas, planes de campañas, guías del titular de WhatsApp e interesados, plan de Google Ads, plantillas de WhatsApp, los cuatro del chatbot, textos de Pretix, fórmula visual, punto de partida.
- **Historia** (unos 30): `pendientes-002.md`, `plan-seo-estado.md`, `estado-historial.md` (1.758 líneas), los prompts ya ejecutados para el backend, Pretix y el sitio, las guías de despliegue y de sandbox, las cinco investigaciones de panelistas, `sedes.md`, `preguntas-charlas.md`, `seo-y-analitica-para-socios.md`, los dictámenes legales, `archivo-2027/` y las specs 001 a 003.
- **Forma de las carpetas de iniciativa**: el patrón implícito es plan o diseño, más los pasos del titular, más un prompt por repo afectado. Solo `medicion-embudo/` tiene estado; "titular" es a veces carpeta y a veces archivo; SEO y chatbot no tienen carpeta.
- **Dato personal de terceros en un repo público**: `chatbot-conocimiento.md` y la prueba adversarial tienen nombres y celulares de contacto de los hoteles aliados. Los mismos números ya están publicados en el sitio (`stays.ts`), así que no es una filtración nueva, pero conviene que salgan de una sola fuente.

## 8. Lo que está bien y conviene conservar

- `src/data/` como datos tipados del evento y `src/config.ts` como punto único de integraciones, con el reemplazo para el sandbox validado.
- `src/routes.ts` como fuente de rutas, de la que salen el sitemap, las migas y los metadatos.
- Las aserciones del build (`src/seo/meta.ts`, `assertJsonLd`): convierten contratos en fallas de compilación. Es el mecanismo natural para la comprobación de vigencia.
- La disponibilidad de ofertas calculada en el build desde las etapas (`src/seo/offers.ts`): el modelo para que el precio vigente también se calcule.
- `make-og.mjs` y el informe leyendo `src/data/` en vez de copiar.
- La arquitectura de campañas: piezas con una responsabilidad, una campaña es un JSON, en seco por defecto, datos personales fuera del repo.
- `WHATSAPP_URL` como constante: el cambio de hoy fue una línea en el sitio.
- Las investigaciones con secciones "no confirmado" y "no publicar".

## 9. Preguntas al titular

Respondidas el 2026-10-19; las respuestas están en `spec.md`, sección Clarifications. Lo que cambia frente al diagnóstico:

- "Franja" es interno; al público, "boletas de medio día". Las campañas ya enviadas quedan así.
- "Charlas abiertas" es el término; el texto de Pretix que dice "talleres" se corrige.
- La venta en la puerta existe pero no se publicita.
- El WhatsApp de atención sigue en pruebas: el riesgo 3 es más grave de lo que parecía, porque el sitio manda a un canal que no responde bien. Atención real hoy: Instagram y correo.
- Aforo: 300 asistentes como capacidad máxima de la sede.

Preguntas originales:

1. **Franjas y conversatorios.** ¿Cómo se cuenta al público? Hechos: el viernes en la tarde tiene la bienvenida y un conversatorio (Bogotazo); el sábado en la mañana y en la tarde, dos cada uno; el domingo en la mañana, dos más el cierre. El pase dice "siete conversatorios". Propuesta: "siete conversatorios" para el pase y, por franja, nombrar las sesiones en vez de contarlas. ¿Se manda algo a los 29 que recibieron "dos conversatorios" o se deja así?
2. **Charlas abiertas.** Pretix dice "talleres de periodismo del jueves 5 y el viernes 6"; el sitio dice "charlas abiertas" e incluye el documental del jueves. ¿Cuál es el nombre que va en todas partes?
3. **Venta en la puerta.** Pretix la anuncia; el prompt del chatbot dice que no está confirmada. ¿Hay venta en la puerta?
4. **Canal de atención del chatbot.** La base dice que el único canal es el correo; el sitio ofrece WhatsApp para dudas de compra. ¿El chatbot debe remitir al WhatsApp?
5. **Domingo.** El correo de expirados dice "al domingo 8 al mediodía"; la agenda cierra a la 1:00 p.m. ¿Basta con corregir la plantilla a "domingo en la mañana"?
6. **Número de WhatsApp.** El comentario de `config.ts:114` dice +1 711-136-9321. 711 no es un código de área regular en Estados Unidos. El enlace `wa.me/message/...` funciona aparte del número, pero si el número se va a imprimir o a pegar en perfiles, conviene confirmarlo.
7. **Aforo.** No hay cifra en ninguna parte y la plantilla `cupos_franja` la necesita. ¿Hay una cifra que se pueda publicar, o la plantilla no se usa?
