# Prompt: fuentes de verdad y orden del repo testigos-web

> Para un agente nuevo que trabaja en `/Users/juandev/Documents/eventalist/testigos/testigos-web/`. Escrito el 2026-10-19 a partir de una investigación preliminar. Responde siempre en español.

## 1. Quién soy y qué quiero

Soy Juan, de Eventalist. Con agentes de IA monté toda la operación digital de Testigos de la Memoria (Villa de Leyva, 5 al 8 de noviembre de 2026). Funcionó, pero el repo creció por acumulación: cada feature resolvió lo suyo y dejó sus datos, scripts y documentos dentro de su propia carpeta. Hoy me cuesta encontrar las cosas y cometemos errores cuando un dato cambia y no se actualiza en todas partes.

Quiero dos cosas, en este orden:

1. **Que este repo tenga fuentes de verdad.** Un dato del evento (un precio, una fecha, un panelista, el número de WhatsApp) se cambia en un solo lugar y de ahí llega a todo lo que lo usa. Los scripts y herramientas están en lugares lógicos y fáciles de encontrar, no en la carpeta de la feature que los creó.
2. **Que esa organización sea la que se repite en el próximo evento.** No es arreglar Testigos por arreglarlo: es diseñar la estructura que después se vuelve plantilla. Eso conecta con la metodología en construcción (`/Users/juandev/Documents/eventalist/prompt-skill-init-new-event.md`).

Tú decides cómo organizarlo y con qué metodología. No te doy la solución; te doy el problema bien descrito.

## 2. Lee primero

1. `docs/proyecto/punto-de-partida.md`: qué es este repo, la filosofía del sitio y lo que pasó después del 13 de octubre.
2. `/Users/juandev/Documents/eventalist/investigacion-testigos-web.md`, sobre todo las secciones 3.1, 3.4 y 4: la arquitectura y lo que ya se sabe que impide usar el sitio como plantilla.
3. La memoria del proyecto: `~/.claude/projects/-Users-juandev-Documents-eventalist-testigos-testigos-web/memory/` (empieza por `MEMORY.md`). Ahí están mis reglas de trabajo y decisiones.
4. `docs/campanas/README.md`: el ejemplo más reciente de reordenar algo disperso (las campañas pasaron de un script por campaña a piezas con una sola responsabilidad). Úsalo como referencia del tipo de razonamiento que espero, no como molde obligatorio.

## 3. Lo que ya se encontró (investigación preliminar)

Esto es evidencia de un recorrido corto. Verifícalo y profundiza; no lo tomes como completo.

### 3.1 Datos del evento copiados a mano

- **Precios.** Dentro del sitio están bien: solo en `src/data/event.ts`. Fuera del sitio, el precio del pase y de la boleta de medio día está escrito a mano en unos 15 archivos: la base y el prompt del chatbot (`docs/chatbot/legacy/chatbot-conocimiento.md`, `docs/chatbot/legacy/system-prompt-atencion.md`, `docs/chatbot/legacy/prueba-chatbot-adversarial.md`), los textos de Pretix (`docs/pretix/pretix-tienda-textos.md`), las plantillas de correo (`scripts/campanas/plantillas/`), las plantillas de WhatsApp, el plan de Google Ads y los planes de campañas. El precio de la etapa 1 (310.000) sigue en documentos y plantillas viejas.
- **Fechas y sede.** `src/ui.ts` repite "5 al 8 de noviembre de 2026" y "Hospedería Duruelo" varias veces, aunque `event.ts` ya los tiene. También hay fechas escritas a mano en `src/routes.ts`, `Hero.astro`, `terminos-y-condiciones.astro` y `en.astro`. `ui.ts` además mezcla microcopy con datos del evento; por ejemplo, `tickets.soon` describe etapas ya vencidas y se ve si se apaga la tienda.
- **Panelistas.** Cada nombre aparece a mano en 16 a 25 archivos fuera de `src/data/`: chatbot, Pretix, plantillas, investigaciones y planes.
- **Una inconsistencia real, encontrada hoy.** El correo a interesados dice que cada franja "reúne dos conversatorios". La base del chatbot dice "dos o tres". Según `src/data/agenda.ts`, el viernes tiene uno más la bienvenida y el domingo dos más el cierre. La plantilla copió a mano los panelistas y temas por franja, y la definición de franja vive como lógica dentro de `src/components/TicketSection.astro`, donde ningún script ni plantilla la puede usar.
- **Patrones buenos que ya existen:** `brand/og/make-og.mjs` lee los panelistas de `src/data/speakers.ts`; `src/routes.ts` alimenta el sitemap, las migas y los metadatos; y el número de WhatsApp es una constante (`WHATSAPP_URL`), así que cambiarlo hoy en el sitio fue una línea.

### 3.2 Identificadores repetidos entre el sitio y los scripts

La URL del backend, el slug de la campaña del backend (`testigos-de-la-memoria-2026`) y el slug del evento de Pretix (`testigos-memoria`) están en `src/config.ts` y otra vez en `scripts/campanas/` (los JSON de campaña y `fuentes/backend.py`). Los festivos de Colombia están en `scripts/campanas/reglas.py`.

### 3.3 Copias fuera del repo sin inventario

Hay datos publicados en sistemas que no se pueden buscar desde aquí: los textos de la tienda en Pretix, la plataforma del chatbot, las plantillas aprobadas en Meta (que no se pueden editar después de aprobadas), los anuncios de Google, las bios de redes y el material impreso con QR. Hoy, al cambiar el número de WhatsApp, el sitio se arregló en una línea, pero la lista de lugares externos salió de memoria. No hay un registro de dónde está publicado cada dato.

### 3.4 Scripts y herramientas dispersos

- `scripts/campanas/` (ordenado hoy) y `scripts/informe/` (informe al cliente).
- `brand/og/` (`make-og.mjs`, `make.sh`, `inline-logo.mjs`) y `brand/pretix/` (`boleta/`, `escarapela/`, `lib.mjs`, cada uno con su `make.sh`).
- `informes/`, ignorado por git, con contenido por edición (`contenido.mjs`).
- `package.json` solo tiene los comandos de Astro. No hay un índice de qué herramientas existen ni cómo se corren: cada una lo explica en su propio comentario o en un documento de su feature.

### 3.5 Documentos dispersos y por feature

- `docs/` tiene más de 30 archivos sueltos de tipos muy distintos: investigaciones de panelistas, revisiones legales con fecha, chatbot, sedes, portafolio, credenciales, pendientes de la 002 y estado del SEO.
- Cada iniciativa tiene su carpeta con su propia forma: `docs/medicion/embudo/` (diseño, estado, historial, un prompt por repo y guías del titular), `docs/campanas/expirados/`, `docs/campanas/interesados/`, `docs/campanas/`, `docs/campanas/google-ads/`, `docs/campanas/whatsapp-ventas/` y `docs/medicion/archivo-2027/`.
- Spec-kit se usó solo en `specs/001` a `003`. Lo posterior (campañas, Google Ads, WhatsApp) se hizo sin spec, y `.specify/feature.json` sigue apuntando a la 003.
- Hay varios archivos de estado y pendientes que se pisan: `docs/proyecto/pendientes-002.md`, `docs/medicion/plan-seo-estado.md` y `docs/medicion/embudo/estado.md` con su historial.
- Las decisiones viven en cuatro lugares: specs, documentos, la memoria de Claude (fuera del repo) y los mensajes de commit.
- El repo no tiene `README` ni `CLAUDE.md`. Las reglas del titular están solo en la memoria.

### 3.6 Credenciales y datos personales en varios lugares

`docs/proyecto/credenciales.md` y `creds.txt` (los dos ignorados por git), el llavero de macOS con varios servicios, `scripts/campanas/incluir.local.csv` y `~/Documents/eventalist/datos/` (listas y registro de envíos). **No abras ni cites el contenido de ningún archivo de credenciales.**

## 4. Qué investigar a fondo

- **Inventario de hechos.** Qué datos del evento existen (precios, etapas, fechas, horarios, sedes, panelistas, franjas, aforo, contacto, enlaces, identificadores) y, para cada uno, en qué archivos aparece y quién lo consume: el build del sitio, los scripts, las plantillas de correo, los textos que se copian a mano a Pretix y al chatbot, las plantillas de Meta y el material impreso.
- **Hecho o texto.** Qué es un dato que debe venir de una fuente y qué es redacción que puede vivir en su pieza. Por ejemplo, "340.000" es un dato; "Todavía puedes asegurar tu lugar" es redacción.
- **Consumidores que no pueden leer código.** Pretix, el chatbot y Meta reciben texto pegado a mano, y las plantillas de Meta no se editan después de aprobadas. Hay que resolver cómo se mantiene la verdad en esos casos.
- **Copias externas.** Cómo saber en todo momento dónde está publicado cada dato fuera del repo.
- **Herramientas.** Inventario de scripts y generadores, qué leen, qué producen y cómo se corren.
- **Documentos.** Qué tipos de documento existen (decisión, estado, guía para el titular, prompt para otro repo, investigación, texto para pegar en otra plataforma, historia), cuáles se usan para actuar y cuáles son historia.
- **El historial de git.** Para ver qué errores de dato desactualizado ya pasaron y cuánto costaron. Al menos estos: el número de WhatsApp equivocado (`eca1131`), el pase descrito como "cuatro días" en el correo de expirados del 12 de octubre, la franja de "dos conversatorios" y la grafía de los panelistas.

Puedes usar subagentes enfocados para los inventarios: uno por dimensión, con un formato de respuesta corto y evidencia (archivo y línea), no volcados de archivos.

## 5. Restricciones

- **El sitio está en producción y vende.** Ningún cambio puede romper la tienda, el SEO (rutas, JSON-LD, metadatos), la medición o las campañas. Después de cada cambio: `npm run build` y `npm run check`, y para las campañas `python3 scripts/campanas/campana.py lista <campaña>` y la vista previa sin `--enviar`.
- **No inventes datos.** Si dos fuentes se contradicen, pregúntame cuál es la verdad.
- **Liviano.** Prefiere poco y sólido a mucho y frágil. Nada de documentación que nadie use para actuar (sección 2 de `prompt-skill-init-new-event.md`).
- Commits locales sí. **Ningún push ni deploy sin mi visto bueno de ese cambio.**
- Sin tablas en Markdown. Sin guiones largos de pausa en los textos visibles.
- No envíes mensajes de ninguna campaña.

## 6. Entregables, con parada en cada uno

1. **Diagnóstico.** Los inventarios de la sección 4 resumidos, los problemas ordenados por riesgo (qué error de dato puede llegar al público y cuánto cuesta) y qué está bien y conviene conservar. **Para aquí y espera mi revisión.**
2. **Propuesta.** La estructura y la metodología que recomiendas: dónde vive cada tipo de verdad, cómo llega a cada consumidor (incluidos los que reciben texto pegado a mano), dónde viven las herramientas y los documentos y cómo se llevan las decisiones y el estado. Explica por qué y qué se descarta. Incluye cómo se vería en el próximo evento. **Para aquí y espera mi aprobación.**
3. **Implementación por partes.** En commits pequeños, verificando el sitio y las campañas en cada paso, empezando por lo de mayor riesgo.
4. **Nota para la metodología.** Al final, una nota corta con lo que este ejercicio enseña para la plantilla de repo de evento de `prompt-skill-init-new-event.md`.
