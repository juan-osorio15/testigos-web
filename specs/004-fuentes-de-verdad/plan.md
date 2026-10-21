# Propuesta: fuentes de verdad y orden del repo

Entregable 2 de `specs/004-fuentes-de-verdad`. Fecha: 2026-10-19. Parte de `diagnostico.md` y de las respuestas del titular (`spec.md`, Clarifications). **Parada: aprobación del titular antes de implementar.**

## 1. La idea en tres reglas

1. **Un hecho vive en un solo lugar del repo, y ese lugar es el que ya usa el sitio** (`src/data/` y `src/config.ts`). No se crea una fuente nueva al lado: se completa la que hay y se abre para que la lean los scripts.
2. **Derivar donde se puede leer código; verificar donde se pega a mano.** El sitio, las plantillas de campaña, los generadores de imágenes y las boletas toman los hechos de la fuente. Los textos que se pegan a mano en Pretix, el chatbot, Meta o Google Ads siguen siendo redacción libre, pero una comprobación los coteja con la fuente antes de usarlos.
3. **Lo que está afuera se lleva en una lista.** Cada lugar externo donde se publicó un hecho queda anotado con qué contiene y cuándo se actualizó. Al cambiar un hecho, la lista dice qué hay que volver a pegar.

Es el mismo razonamiento de `docs/campanas/README.md`: piezas con una sola responsabilidad (la fuente, la exportación, la comprobación, la lista de copias) que no saben unas de otras.

## 2. Dónde vive cada tipo de verdad

- **Hechos del evento**: `src/data/`, como hoy. Se agregan los que no tienen fuente:
  - **Boletas de medio día** como dato, no como lógica: un módulo `src/data/boletas.ts` que dice qué sesiones tiene cada una, derivado de `agenda.ts` con la regla que hoy está dentro de `TicketSection.astro` y repetida en `jsonld.ts`. El componente y el marcado pasan a usarlo.
  - **El papel de cada sesión** en `agenda.ts` (temática, bienvenida o cierre), para que "siete conversatorios" salga de contar y no de escribir.
  - **Conteos derivados**: conversatorios temáticos, días del encuentro, días del pase, panelistas.
  - **Aforo por sede**: Duruelo 300; Casa Museo pendiente.
  - **Canales de atención con su estado**: Instagram y correo activos; WhatsApp "pendiente de confirmación", con su número y su enlace.
  - **Venta en la puerta**: sí, con la marca "no se publicita".
  - **Precio por etapa**: cada oferta guarda todas sus etapas (incluido el 310.000 de la etapa 1 como historia) y el precio vigente se calcula en el build con la fecha, como ya se hace con la disponibilidad en `src/seo/offers.ts`. Para Testigos ya no quedan cambios de etapa; es sobre todo para la plantilla.
- **Integraciones e identificadores**: `src/config.ts`, como hoy (dominio, tienda, slugs de Pretix y del backend, URL del backend, GA4, píxel, contacto, fechas legales).
- **Redacción del sitio**: `src/ui.ts` queda solo con redacción. Las claves que hoy tienen fechas, sedes, precios o conteos escritos pasan a armarse con los datos (`event`, `venues`, `boletas`). Las claves que describen etapas vencidas (`tickets.soon`, `tickets.slotSoon`, `notify.*`, `stages.*`) se eliminan y el aviso de tienda cerrada queda con un texto que no vence.
- **Lo que no es Testigos sino Eventalist** (remitente, responsable, horario de la Ley 2300, festivos): sigue donde está, pero los festivos se leen de un solo archivo de datos y no de código.

### Cómo llega la fuente a los scripts

El sitio es TypeScript y las campañas son Python; Python no puede leer `src/data/*.ts`, y los `.ts` importan fotos, así que ni Node puede importarlos solos. Propuesta: **el build exporta los hechos**. Un archivo `src/pages/datos/evento.json.ts`, igual que el `sitemap.xml.ts` que ya existe, produce en cada build un JSON con todos los hechos y los derivados (precio vigente, boletas de medio día con sus sesiones y panelistas, conteos, canales, identificadores).

- Los scripts leen `dist/datos/evento.json`. Si es más viejo que `src/data/` o `src/config.ts`, se niegan y piden `npm run build`.
- El JSON también queda publicado en `testigosdelamemoria.com/datos/evento.json`. Son datos públicos; no lleva llaves ni datos personales. Ventaja: lo que leen las campañas es exactamente lo que el sitio dice.
- Así hay una sola implementación de cada regla (la de las boletas de medio día, la del precio vigente), en TypeScript, y nadie la reescribe en Python.

## 3. Cómo llega a cada consumidor

- **Sitio y marcado para buscadores**: ya leen `src/data/`. Cambian `ui.ts`, `TicketSection.astro`, `jsonld.ts`, `routes.ts` (descripciones con fechas y el "quince"), `Hero.astro`, `en.astro` y `terminos-y-condiciones.astro` para tomar fechas, sedes y conteos de los datos. Se comprueba que el HTML de las rutas, los metadatos y el JSON-LD salen iguales antes y después (salvo lo que se corrija a propósito).
- **Campañas** (`scripts/campanas/`): leen el JSON exportado.
  - Los JSON de campaña dejan de repetir el slug de Pretix y el del backend; `fuentes/backend.py` deja de repetir la URL.
  - Las plantillas de correo reciben los hechos como variables (`{{precio_pase}}`, `{{precio_medio_dia}}`, `{{fechas_pase}}`, las sesiones de cada boleta de medio día, enlaces con su UTM), igual que ya reciben `{{saludo}}`. La redacción queda en la plantilla.
  - Antes de mostrar la vista previa y antes de `--enviar`, la comprobación de vigencia (abajo) revisa la plantilla ya llena. Si falla, no envía.
  - Se borran `expirado.html` y `expirado-pedido.html` (310.000, sin uso) y la guía histórica que manda a usarlas queda en historia.
- **Plantillas de WhatsApp en Meta**: no se editan después de aprobadas. Regla nueva: el cuerpo fijo de una plantilla no lleva hechos que puedan cambiar (precio, fecha de etapa, número); si los necesita, van como variables que llena `campana.py` desde la fuente. Las aprobadas que ya tienen "340.000" fijo quedan en la lista de copias externas con la marca "no editable: si cambia el precio, plantilla nueva".
- **Imágenes, boleta y escarapela**: los generadores leen el JSON exportado en vez de usar expresiones regulares sobre `speakers.ts` o tener la sede y las fechas a mano. Estas piezas ya están entregadas; el cambio importa para el próximo evento y para regenerarlas sin errores.
- **Informe al cliente**: igual, lee el JSON.
- **Pretix**: no se centraliza (decisión del titular). `docs/pretix-tienda-textos.md` sigue escrito a mano; la comprobación de vigencia lo revisa, y `CLAUDE.md` dice que todo pedido de textos para Pretix obliga a cotejar con la fuente antes de redactar.
- **Chatbot**: es el que más hechos copia y el que contesta cualquier cosa. Propuesta: la base de conocimiento conserva su redacción, pero su bloque de "datos duros" (fechas, horarios, sedes, precios, boletas de medio día con sus sesiones, panelistas y cargos, canales, aforo, venta en la puerta) se genera desde el JSON entre dos marcas en el archivo. Al cambiar un hecho se regenera el bloque y se vuelve a pegar. El resto del archivo lo revisa la comprobación de vigencia.
- **Google Ads, perfiles, impresos**: la comprobación revisa lo que tenga copia en el repo; el resto va en la lista de copias externas.

## 4. La comprobación de vigencia

Un script, `scripts/verificar/`, con un solo trabajo: leer el JSON exportado y revisar las piezas vigentes (plantillas, textos para pegar, la base del chatbot, el plan de Google Ads). Reporta con archivo y línea:

- precios que no son ningún precio vigente;
- nombres de panelistas que no coinciden con `speakers.ts` (con las variantes conocidas: "Martha Ruiz", "Echeverry", "Ana Maria");
- términos internos o retirados en piezas públicas ("franja", "talleres de periodismo", "cuatro días" junto a "pase");
- fechas de etapa vencidas, enlaces con `http://` y enlaces de WhatsApp distintos del vigente;
- canales anunciados como activos que en la fuente no lo están.

La lista de patrones vencidos es corta y crece con cada error real: cada vez que algo se cuela, se agrega su patrón. Corre con `npm run verificar`, dentro de `campana.py` antes de la vista previa y del envío, y lo pide `CLAUDE.md` antes de entregar cualquier texto para pegar. No corre en el build de GitHub: lo que publica el sitio ya sale de la fuente.

## 5. Copias externas

Un archivo, `docs/copias-externas.md`, con una entrada por lugar externo (la tienda de Pretix y sus correos, la plataforma del chatbot, cada plantilla de Meta, los anuncios de Google, la bio de Instagram, los impresos con QR, las escarapelas). Cada entrada dice:

- qué hechos contiene (precio, fechas, panelistas, WhatsApp, dominio…);
- de qué archivo del repo sale el texto, si lo hay;
- cuándo se pegó o se publicó por última vez;
- si se puede editar, y si no, qué se hace cuando cambia (reemplazar, retirar, dejar).

Regla de `CLAUDE.md`: al cambiar un hecho, el agente busca ese hecho en la lista y le entrega al titular los lugares que debe actualizar. Prueba inmediata: el cambio de número de WhatsApp al número colombiano.

Recomendación para ese cambio: que los impresos y las bios no apunten directo a `wa.me`, sino a una dirección del sitio que redirija (por ejemplo `testigosdelamemoria.com/whatsapp`). Así el próximo cambio de número vuelve a ser una línea. Agrega una ruta pública; la pongo solo si la apruebas.

## 6. Herramientas

Todas bajo `scripts/`, una carpeta por herramienta, con lo común en `scripts/lib/`:

- `scripts/campanas/` (sin cambios de lugar);
- `scripts/informe/`;
- `scripts/imagenes/` (hoy `brand/og/`);
- `scripts/pretix/boleta/` y `scripts/pretix/escarapela/` (hoy en `brand/pretix/`);
- `scripts/verificar/` (nuevo);
- `scripts/lib/`: una sola forma de abrir Chrome, cargar el logo y leer la paleta.

Lo que producen se queda donde se usa (`public/og/`, `brand/pretix/*.pdf`). `brand/` queda solo con la marca: la fórmula visual, los logos y los resultados. `package.json` gana un comando por herramienta (`npm run imagenes`, `npm run boleta`, `npm run escarapela`, `npm run informe`, `npm run verificar`, `npm run campana`), y el `README.md` las lista con lo que leen y producen. Ese es el índice.

## 7. Documentos, estado y decisiones

- **`README.md`** (nuevo, una página): qué es el repo, dónde vive cada tipo de verdad y la lista de herramientas.
- **`CLAUDE.md`** (nuevo): las reglas de trabajo del titular que hoy están solo en la memoria de Claude y deben viajar con el repo. Hay que separar las del servicio (sin push sin visto bueno, sin tablas, sin guiones largos, tono, `https://`) de las de Testigos (marca, nombres públicos, canales). Lleva también las reglas de esta feature: hecho o texto, cotejar los textos de Pretix, revisar la lista de copias externas al cambiar un hecho, y correr la comprobación antes de entregar un texto para pegar. Las memorias que pasen a `CLAUDE.md` se reducen a un enlace para que no haya dos versiones. Tú decides cuáles; propongo una lista en la implementación.
- **`ESTADO.md`** (nuevo, uno solo): hecho, falta, bloqueado y por quién. Reemplaza `docs/pendientes-002.md`, `docs/plan-seo-estado.md`, los pendientes de `docs/atencion-preguntas.md` y las casillas sueltas de las guías. Lo vivo de `docs/medicion-embudo/estado.md` pasa aquí. Las tareas abiertas de las specs 001 a 003 se cierran o se pasan a `ESTADO.md` y las specs quedan como historia.
- **`docs/decisiones.md`** (nuevo): una línea por decisión, con fecha, qué se decidió y por qué, y un enlace si hay más. Las decisiones de los documentos y de la memoria que sigan vigentes se pasan aquí. Las reglas de cómo trabajar van a `CLAUDE.md`; las decisiones sobre el evento van aquí.
- **`docs/` por vertical**, no por feature, con los nombres de la metodología:
  - `docs/atencion/`: chatbot (base, prompt, prueba adversarial);
  - `docs/boleteria/`: textos de Pretix;
  - `docs/campanas/`: el README actual y una carpeta por campaña (`expirados/`, `interesados/`, `google-ads/`, `whatsapp-ventas/`), cada una con `plan.md` y, si hace falta, `titular.md`;
  - `docs/medicion/`: lo que hoy está en `medicion-embudo/` y sigue vivo;
  - `docs/contenido/`: panelistas, sedes, cómo llegar;
  - `docs/legal/`: dictámenes y tratamiento de datos;
  - `docs/historia/`: investigaciones ya volcadas, prompts ejecutados, guías de pasos ya hechos, `archivo-2027/`, `estado-historial.md`, los estados viejos.
- Se arreglan las referencias rotas de los documentos vigentes.
- **Spec-kit**: se usa solo para cambios del sitio con contratos que verificar. Las campañas y la pauta usan su carpeta de `docs/campanas/`. Hay que reparar `.specify/` (restaurar sus plantillas y scripts) o quitar los skills que lo usan; recomiendo restaurar solo la plantilla de spec y dejar el estado en `ESTADO.md`, no en `tasks.md`.

## 8. Orden de implementación

Avance: paso 1 hecho el 2026-10-20 (commits `3329d9e`, `bac9aea`, `b8bc6a4`). La línea de la base del chatbot que dice que el único canal de atención es el correo no se cambió: habla de la atención humana de compras y reclamos, y el chatbot mismo es el primer contacto por Instagram y WhatsApp, así que no contradice al sitio. "Dos o tres conversatorios" en el sitio y en el chatbot tampoco: cuenta la bienvenida y el cierre, que en la agenda son conversatorios.

De mayor a menor riesgo público, con commits pequeños en la rama `004-fuentes-de-verdad`. Después de cada paso: `npm run build`, `npm run check`, y para las campañas `campana.py lista` y la vista previa de las dos, sin `--enviar`. Nada se publica sin tu visto bueno de ese cambio.

1. **Correcciones ya decididas** (pequeño, público):
   - los botones de contacto del sitio apuntan a Instagram mientras WhatsApp siga en pruebas (sale a producción solo con tu visto bueno);
   - en las plantillas activas, las boletas de medio día nombran sus sesiones en vez de contarlas, y el domingo dice "en la mañana";
   - "talleres" pasa a "charlas abiertas" en el texto de Pretix;
   - en la base del chatbot, los canales quedan en Instagram y correo, y se agrega la venta en la puerta con la marca de no publicitarla;
   - se borran las plantillas con 310.000.
2. **Fuente completa y exportada**: `boletas.ts`, el papel de cada sesión, aforo, canales, venta en la puerta, `evento.json`. `TicketSection` y `jsonld.ts` usan `boletas.ts`. Se compara el sitio antes y después.
3. **Campañas sobre la fuente**: identificadores y variables desde el JSON. Además (pedido del titular, 2026-10-20): un filtro `--dias N` en las audiencias para contar solo lo reciente, y en `docs/campanas/` una referencia de una página con los comandos para responder en una reunión ("¿cuántos expirados van?", "¿cuántos interesados quedan sin escribirles?", "¿cuántos envíos salieron esta semana?"), cada uno listo para copiar y correr.
4. **Comprobación de vigencia**, conectada a `campana.py`, con los errores históricos como casos de prueba.
5. **`CLAUDE.md` y `docs/copias-externas.md`**. Para la lista necesito que me digas qué hay publicado hoy en cada sistema; la armo con lo que está en el repo y tú completas.
6. **`ui.ts` solo con redacción**: fechas, sedes y conteos desde los datos; fuera los textos de etapas vencidas.
7. **Bloque generado en la base del chatbot.**
8. **Herramientas a `scripts/`**, con lo común en `scripts/lib/`, los comandos en `package.json` y el `README.md`.
9. **Documentos**: `ESTADO.md`, `decisiones.md`, `docs/` por vertical, historia, referencias rotas, `.specify/`.
10. **Nota para la metodología** (entregable 4).

Los pasos 1 a 5 son los que pueden evitar un error público antes del 5 de noviembre. Del 6 al 9 se pueden hacer después del evento sin riesgo, y en ese momento ya sirven de plantilla.

## 9. Lo que se descarta y por qué

- **Pasar todos los hechos a un JSON o YAML nuevo** que lean el sitio y los scripts. Es lo más "limpio" en teoría, pero obliga a reescribir `src/data/` (tipos, fotos, textos en inglés) a 17 días del evento, con riesgo para el SEO y la tienda. La exportación desde el build da lo mismo a los scripts sin tocar lo que funciona.
- **Generar desde plantillas toda la prosa** de los textos para Pretix, el chatbot y Meta. Mata la redacción y vuelve frágil cada texto. Se genera solo el bloque de datos duros del chatbot; el resto se verifica.
- **Conectar Pretix, el chatbot o Meta por API** para empujar los textos. Pretix quedó fuera por decisión tuya, y para los otros la lista de copias y la comprobación resuelven el problema con mucho menos.
- **Usar el backend de Eventalist como fuente de los hechos.** Puede tener sentido en la metodología, pero hoy agregaría una dependencia de red y otro sistema que mantener.
- **Spec-kit completo para todo.** Las specs 002 y 003 dejaron 26 tareas abiertas que nadie mantuvo. El estado vive en un archivo.
- **Un README por carpeta.** Basta uno en la raíz y el de campañas, que ya existe y se usa.

## 10. Cómo se vería en el próximo evento

```
src/data/          los hechos: evento, sedes, ofertas y etapas, agenda, panelistas, boletas, aliados, hoteles
src/config.ts      integraciones e identificadores
src/ui.ts          solo redacción
src/pages/datos/evento.json.ts   la exportación (no se toca)
scripts/           todas las herramientas; leen el JSON exportado
docs/<vertical>/   lo vigente, por vertical
docs/historia/     lo cerrado
docs/copias-externas.md   empieza vacía y crece con cada publicación afuera
docs/decisiones.md
ESTADO.md  CLAUDE.md  README.md
```

Para arrancar se llenan `src/data/` y `src/config.ts`; todo lo demás (sitio, marcado, plantillas, imágenes, boletas, base del chatbot) sale de ahí. La lista de patrones vencidos y la de copias externas empiezan vacías y se llenan con el evento.

## 11. Para aprobar

1. La exportación desde el build (`/datos/evento.json`, público) como puente hacia los scripts.
2. Verificar en vez de generar los textos que se pegan, salvo el bloque de datos duros del chatbot.
3. La ruta `/whatsapp` que redirige, para los impresos y las bios, antes del cambio al número colombiano.
4. El orden de implementación, empezando por el paso 1.
5. Pasar tus reglas de la memoria a `CLAUDE.md` y dejar en la memoria solo un enlace.
