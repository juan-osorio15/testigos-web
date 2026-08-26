# Feature Specification: Landing page del evento Testigos de la Memoria

**Feature Branch**: `001-event-landing`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "Construir el sitio real del evento Testigos de la Memoria (testigosdelamemoria.com): landing page que comunica la información del evento y facilita la compra de boletas vía Pretix, con la identidad visual de la Propuesta 1 del manual de marca (`/brand`, páginas 1-7) como columna vertebral estética, y patrones de interacción modernos (referencia de flujo: pioneer.fin.ai). El placeholder en producción (`main`) no se toca; todo el trabajo vive en `dev` hasta autorización explícita."

## Contexto de marca (fuente: `/brand/Testigos-Brand-01.pdf`, páginas 1-7 — Propuesta 1 únicamente)

- **Logo**: wordmark serifado "Testigos de la Memoria" con símbolo de dos comillas (la mirada del testigo) y pleca diagonal. Variaciones: wordmark apilado, una línea, símbolo solo, versión tipográfica en mayúsculas.
- **Paleta** (bloques de color sólidos, sin gradientes):
  - `#210804` marrón casi negro (fondos oscuros, texto sobre claros)
  - `#efe8df` crema (fondo claro principal)
  - `#7d290d` rojo ladrillo oscuro
  - `#d45b30` naranja terracota (color de acento principal; fondo del logo en portada)
  - `#74b3d6` azul cielo
  - `#757522` verde oliva
- **Lenguaje gráfico**: composiciones por bloques rectangulares de color plano que se yuxtaponen (ver aplicaciones: afiche, tarjetas de panelista, escarapela, valla), fotos documentales en blanco y negro / duotono, tarjetas con esquinas redondeadas grandes en piezas sueltas.
- **Descartado explícitamente**: la Propuesta 2 (páginas 8-15, logo del lápiz, paleta alternativa y fondos con gradientes). Ningún elemento de esa propuesta entra al sitio.
- Los mockups del PDF muestran datos viejos ("25-26 noviembre", "Hotel El Duruelo"): son placeholders de diseño. Los datos válidos del evento son los de esta especificación.

## Clarifications

### Session 2026-08-25

- Q: ¿Cuáles son las fechas del evento? → A: Del 5 al 8 de noviembre de 2026 en toda la comunicación principal. El 5 hay talleres gratuitos; los conversatorios con boleta (lo principal) van del 6 al 8.
- Q: ¿Hay panelistas confirmados para publicar? → A: Sí, tres: Daniel Samper Pizano, María Jimena Duzán y Darío Restrepo. Sus horarios/franjas aún no están confirmados — se muestran como speakers, sin horario.
- Q: ¿El nombre exacto es "María Angélica Duzán" (como se escribió) o "María Jimena Duzán"? → A: María Jimena Duzán.
- Q: ¿La sección Why Attend lleva testimonios/video de ediciones anteriores? → A: No existen: esta es la primera edición. La sección se reenfoca en comunicar la oportunidad única de escuchar a estos gigantes del periodismo hablar de lo que vieron y de su oficio, en un pueblo tan encantador como Villa de Leyva.
- Q: ¿En qué idiomas se publica el sitio? → A: ~~Español e inglés~~ **Revertido más tarde el mismo día**: el evento es todo en español, el sitio se publica SOLO en español. Toda la i18n queda fuera del alcance.
- Q: ¿De dónde salen los assets del logo? → A: Se extraen del PDF de marca a la mejor calidad posible; el usuario provee SVG/fuentes solo si la extracción no alcanza.
- Q: ¿Existen los componentes de `template-evento` mencionados en el brief? → A: No — esa carpeta no existe en el repo ni en el entorno. Los componentes del sitio se crean desde cero; el listado del brief se toma solo como inventario orientativo de secciones.
- Q: ¿El coorganizador es "Fernando Restrepo" (como decía el brief)? → A: No: su nombre correcto es **Fernando Cordovez**. Corregido en organizadores y en la bio de Darío Restrepo.
- **Session 2026-08-26** — Q: ¿Llegó la programación? → A: Sí, agenda oficial parcial. Talleres el **5 y 6** de noviembre (Casa Museo, entrada libre); conversatorios con horarios y temas definidos del 6 (3:00 p.m.) al 8 en Duruelo. Confirmados nuevos (además de los 3 previos): Jorge Cardona, Marisol Gómez, Luz María Sierra, Cecilia Orozco, Martha Ruiz, Guillermo González, Yolanda Ruiz, María Elvira Samper. Los "XXXX" del documento = por confirmar. **La agenda es la fuente principal de verdad**: María Jimena Duzán ya no va (retirada). Fotos y bios las proveerán los propios panelistas (pendientes). Grafías "Martha Ruiz" y "Guillermo González" por ratificar (el documento va en mayúsculas).
- Q (2026-08-26): ¿Cambia el orden de secciones? → A: Sí, el usuario redefine FR-004: Hero → El encuentro → Panelistas → Agenda → Lugar → **Boletas** → banda de Villa de Leyva → FAQs. La venta baja para quedar después de la ubicación.
- Q: ¿Qué se muestra mientras no exista la tienda de Pretix? → A: Además del aviso "la venta abre pronto", un formulario de interesados (nombre, correo obligatorio, teléfono opcional) con nota de privacidad y honeypot antispam, conectable por configuración a un servicio de listas (recomendado: listmonk, open source). Desaparece cuando `pretixReady` pasa a true.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entender el evento y comprar boleta (Priority: P1)

Una persona del público de historia/no-ficción (perfil Hay Festival / Festival Gabo) llega al sitio, entiende en segundos qué es el evento (historia de Colombia contada por los periodistas que la cubrieron), cuándo (5 al 8 de noviembre de 2026) y dónde (Villa de Leyva), y compra su boleta sin salir de la página a través del widget de compra embebido.

**Why this priority**: Es el objetivo no negociable del sitio: informar y facilitar la compra. Sin esto no hay producto.

**Independent Test**: Con solo el hero + sección de compra publicados, un visitante puede entender el evento y completar una compra en el widget. Eso ya es un MVP viable.

**Acceptance Scenarios**:

1. **Given** un visitante nuevo en la página, **When** carga el hero, **Then** ve nombre del evento, fechas (5 al 8 de noviembre de 2026), lugar y un botón de compra visible sin hacer scroll.
2. **Given** un visitante en cualquier punto del scroll, **When** mira el header, **Then** el botón de compra sigue visible y al pulsarlo lo lleva con scroll suave a la sección del widget de compra.
3. **Given** un visitante en la sección de compra, **When** interactúa con el widget de Pretix, **Then** puede ver tipos de boleta, precios y completar el checkout dentro del widget, sin que la página muestre precios o tipos de boleta por fuera de él.
4. **Given** que el widget de Pretix no carga (bloqueado o caído), **When** el visitante llega a la sección de compra, **Then** ve un enlace directo a la tienda de Pretix como alternativa, no un espacio vacío.

---

### User Story 2 - Evaluar si el evento vale la pena (Priority: P2)

Un visitante interesado pero no convencido recorre la página: la oportunidad única que representa esta primera edición (escuchar a gigantes del periodismo colombiano hablar de lo que vieron y de su oficio, en Villa de Leyva), quiénes son los panelistas, qué hay en la agenda. El contenido le habla primero al público de historia/no-ficción (compra por curaduría y prestigio, no por precio) y lo lleva a CTAs de compra en los cierres de sección.

**Why this priority**: Convierte interés en compra; es la mitad "antojar" del objetivo.

**Independent Test**: Con las secciones La Oportunidad, Speakers y Agenda publicadas, un visitante puede formarse una opinión del valor del evento y llegar a un CTA de compra desde cada una.

**Acceptance Scenarios**:

1. **Given** un visitante haciendo scroll, **When** pasa por La Oportunidad, Speakers y Agenda, **Then** cada sección aparece con un reveal sutil (fade + desplazamiento vertical leve) que ocurre una sola vez.
2. **Given** la sección La Oportunidad, **When** el visitante la lee, **Then** el copy comunica que es la primera edición y la ocasión única de escuchar a estos periodistas en Villa de Leyva — sin testimonios ni referencias a "ediciones anteriores" que no existen.
3. **Given** la sección de Speakers, **When** el visitante la recorre, **Then** ve a los tres panelistas confirmados (Daniel Samper Pizano, María Jimena Duzán, Darío Restrepo) y cualquier cupo adicional como "por confirmar", nunca con nombres inventados.
4. **Given** las fotos de panelistas de fuentes y calidades dispares, **When** se muestran en el sitio, **Then** todas tienen el mismo tratamiento visual unificado (duotono con la paleta de marca).
5. **Given** el cierre de Speakers, de Agenda y el final de la página tras FAQs, **When** el visitante llega a esos puntos, **Then** encuentra un CTA de compra con el mismo texto y estilo que el del header.
6. **Given** un visitante en la agenda, **When** la lee, **Then** distingue fecha/hora a la izquierda y contenido a la derecha, con los talleres gratuitos del 5 de noviembre claramente diferenciados de los conversatorios con boleta del 6 al 8; los panelistas confirmados sin horario aparecen sin franja asignada, no con horarios inventados.

---

### User Story 3 - Resolver logística: llegar y dudas frecuentes (Priority: P3)

Un asistente decidido (o a punto de decidirse) necesita la dirección exacta de las dos sedes — Casa Museo Antonio Nariño (talleres, entrada libre) y Hospedería Duruelo (conversatorios) —, cómo llegar, y respuestas a preguntas frecuentes.

**Why this priority**: Remueve fricciones de último momento que frenan la compra y reduce carga de soporte de los organizadores.

**Independent Test**: Con la sección Venue y FAQs publicadas, un visitante encuentra dirección en texto plano, un mapa y un botón "Cómo llegar" que abre su app de mapas.

**Acceptance Scenarios**:

1. **Given** la sección Venue, **When** el visitante la consulta, **Then** ve la dirección completa de cada sede en texto plano (no solo en el mapa) y qué actividad ocurre en cada una.
2. **Given** el botón "Cómo llegar", **When** el visitante lo pulsa desde móvil, **Then** se abre la navegación en su app de mapas apuntando a la sede correcta.
3. **Given** la sección de FAQs, **When** el visitante la recorre, **Then** encuentra respuestas a las dudas típicas (entrada libre vs. boleta, cómo llegar a Villa de Leyva, alojamiento, política de reembolso según Pretix) y un CTA final de compra.

---

### User Story 4 - El sitio en producción no se ve afectado durante el desarrollo (Priority: P1)

El dueño del proyecto necesita que el placeholder "Próximamente" que hoy vive en producción (testigosdelamemoria.com) siga en línea, intacto, durante todo el desarrollo del sitio nuevo, y que el reemplazo ocurra solo cuando él lo autorice.

**Why this priority**: Riesgo reputacional y de SEO en un dominio ya publicado e indexado. Es una restricción dura del encargo.

**Independent Test**: En cualquier momento del desarrollo, visitar testigosdelamemoria.com muestra el placeholder actual sin cambios; todo el trabajo nuevo existe solo en la rama `dev`.

**Acceptance Scenarios**:

1. **Given** el desarrollo en curso, **When** se hace cualquier commit, **Then** ocurre en la rama `dev` (u otra rama de trabajo), nunca en `main`, y no se hace push ni merge a `main` sin autorización explícita del usuario.
2. **Given** el momento del merge final (futuro, fuera del alcance de esta feature hasta la orden), **When** se prepare, **Then** el plan preserva de `main`: `CNAME`, `1b880322af30410c8832c1e6748dc455.txt` (clave IndexNow en la raíz), `robots.txt` y `sitemap.xml` (con URLs actualizadas), los metadatos SEO del index actual (description, Open Graph con `assets/og-image.png`, canonical, JSON-LD — mejorados, no perdidos) y el `404.html` con diseño propio (noindex).
3. **Given** el flujo de publicación futuro, **When** se construya el sitio, **Then** el workflow de despliegue (build de Astro para GitHub Pages) queda preparado dentro de `dev` pero la configuración de Pages no se toca hasta la orden del usuario.

---

### Edge Cases

- **Widget de Pretix caído o bloqueado** (adblockers, cookies de terceros): la sección de compra muestra enlace directo al checkout de Pretix; la página nunca depende del widget para informar.
- **Usuario con `prefers-reduced-motion`**: todo movimiento (reveals, cortina del hero, scroll suave, hovers animados) se desactiva o reduce a cambios sin animación; el contenido sigue 100% accesible.
- **Panelista aún no confirmado**: la tarjeta muestra "por confirmar" sin nombre ni foto inventados; la agenda puede listar la franja sin nombre.
- **JavaScript deshabilitado**: toda la información del evento (hero, descripción, speakers, agenda, venue, FAQs, direcciones) es legible; solo se pierden los realces de interacción y el widget embebido (queda el enlace directo a Pretix).
- **Pantallas móviles pequeñas y conexiones lentas** (visitantes buscando el evento desde el celular): la página carga rápido, las imágenes pesadas se cargan de forma diferida y el CTA de compra es alcanzable con el pulgar.
- **Datos viejos en piezas de marca**: cualquier fecha, sede u horario tomado de los mockups del manual de marca se considera inválido; solo valen los hechos de esta spec (sección Clarifications incluida) y el archivo de programación.

## Requirements *(mandatory)*

### Functional Requirements

**Contenido e información del evento**

- **FR-001**: La página MUST comunicar, visible sin scroll en el hero: nombre del evento (Testigos de la Memoria), fechas (5 al 8 de noviembre de 2026 — el rango completo, incluido el día de talleres gratuitos), lugar (Villa de Leyva, Colombia) y un CTA de compra. La distinción "5 nov: talleres gratuitos / 6-8 nov: conversatorios con boleta" se comunica en la agenda y donde el contexto lo pida, sin fragmentar la fecha principal.
- **FR-002**: El framing de todo el copy MUST ser "la historia de Colombia contada/analizada por los periodistas que la vivieron"; queda prohibido reducirlo a "encuentro de periodistas", así como las frases vetadas ("espacio de reflexión", "diálogo enriquecedor", "evento imperdible") y el lenguaje corporativo de eventos.
- **FR-003**: El copy MUST usar únicamente el tagline aprobado ("Periodistas en la Historia") como principal, y los slogans/preguntas del banco aprobado según contexto; el copy principal (hero, La Oportunidad, CTAs) le habla primero al público de historia/no-ficción.
- **FR-004**: La página MUST presentar las secciones en este orden fijo (redefinido por el usuario el 2026-08-26): (1) Hero, (2) La Oportunidad (primera edición, sin testimonios ni video de ediciones anteriores, que no existen), (3) Speakers, (4) Agenda, (5) Venue, (6) descripción corta + widget de compra, (7) banda visual de Villa de Leyva, (8) FAQs.
- **FR-005**: Los nombres de panelistas publicados MUST provenir exclusivamente de confirmaciones explícitas del usuario o del archivo de programación vigente; ante ausencia o duda se publica "por confirmar". Ningún nombre, ortografía ni horario se inventa o asume. Confirmados a la fecha (sin horario): Daniel Samper Pizano, María Jimena Duzán y Darío Restrepo.
- **FR-006**: La sección Venue MUST mostrar la dirección completa de cada sede en texto plano, indicar qué actividad ocurre en cada una (talleres de entrada libre en Casa Museo Antonio Nariño; conversatorios en Hospedería Duruelo), incluir un mapa y un botón "Cómo llegar" que abre la navegación externa hacia la sede.
- **FR-007**: Las FAQs MUST cubrir al menos: qué es gratis y qué requiere boleta (talleres del 5 de noviembre gratuitos vs. conversatorios del 6 al 8 con boleta), cómo llegar a Villa de Leyva, y a dónde dirigir dudas de compra/reembolso (dominio de Pretix).

**Compra de boletas**

- **FR-008**: La venta MUST ocurrir únicamente dentro del widget/checkout embebido de Pretix; la página no muestra, asume ni codifica tipos de boleta, precios ni etapas de venta en ninguna otra parte.
- **FR-009**: El header MUST mantener un botón de compra siempre visible durante todo el scroll, en ambos estados visuales del header.
- **FR-010**: Los CTAs de compra repetidos (cierre de Speakers, cierre de Agenda, cierre final tras FAQs) MUST compartir texto y estilo con el del header, y todos MUST desplazar suavemente a la sección del widget (nunca duplicar el widget).
- **FR-011**: Si el widget no puede cargar, la sección de compra MUST ofrecer un enlace directo a la tienda de Pretix como vía alterna.
- **FR-011b**: Mientras la venta no esté activa (`pretixReady: false`), la sección de compra MUST ofrecer un formulario de interesados con correo obligatorio y nombre/teléfono opcionales, funcional sin JavaScript, con honeypot antispam y nota de uso de datos; el formulario desaparece al activarse la venta.

**Identidad visual y experiencia**

- **FR-012**: El sistema visual MUST usar exclusivamente la Propuesta 1 del manual de marca (`/brand/Testigos-Brand-01.pdf`, páginas 1-7): logo serifado con símbolo de comillas y paleta `#210804`, `#efe8df`, `#7d290d`, `#d45b30`, `#74b3d6`, `#757522`, con composición por bloques de color sólidos como recurso estético principal. Ningún elemento de la Propuesta 2 (lápiz, gradientes, paleta alternativa) aparece en el sitio.
- **FR-013**: Las superficies MUST ser colores planos: sin gradientes, sin glassmorphism decorativo (única excepción: header translúcido sobre el hero por legibilidad), sin glow/neón, sin parallax, sin animaciones en loop, sin scroll-jacking.
- **FR-014**: Las fotos (panelistas, ediciones anteriores, contexto) MUST llevar un tratamiento duotono unificado con colores de la paleta de marca para homogeneizar fuentes dispares.
- **FR-015**: La página MUST implementar los patrones de interacción definidos: hero fijo con efecto cortina, header de dos estados (translúcido/claro sobre el hero, sólido/oscuro después), scroll reveal por sección de una sola ejecución, carrusel horizontal con snap para speakers, y hovers discretos.
- **FR-016**: Todo movimiento MUST respetar `prefers-reduced-motion` sin excepción.
- **FR-017**: La tipografía MUST limitarse a máximo dos familias coherentes con la marca (serif del wordmark para identidad/titulares donde aplique, sans grotesca para UI/cuerpo), con jerarquía bold en titulares e interlineado cómodo en cuerpo.
- **FR-018**: Toda la información del evento MUST ser accesible sin JavaScript; el JS se limita a los realces (header, reveals, carrusel) y al widget de Pretix.

**Idioma**

- **FR-022**: El sitio MUST publicarse únicamente en español (decisión del usuario, Clarifications 2026-08-25: el evento es todo en español). Sin selector de idioma, sin rutas alternas ni hreflang.

**Protección de producción y SEO**

- **FR-019**: Ningún cambio de esta feature MUST tocar la rama `main` ni la configuración de GitHub Pages; todo el trabajo se commitea en `dev` y el push/merge a `main` requiere autorización explícita del usuario.
- **FR-020**: El proyecto MUST dejar preparado (sin activar) el flujo de publicación con build de Astro para GitHub Pages dentro de `dev`.
- **FR-021**: El sitio nuevo MUST conservar y mejorar los activos SEO existentes: metadatos description/Open Graph (`assets/og-image.png`)/canonical/JSON-LD del index actual, `robots.txt` y `sitemap.xml` con URLs actualizadas, `404.html` propio con noindex, `CNAME` y la clave IndexNow (`1b880322af30410c8832c1e6748dc455.txt`) en la raíz publicada.

### Key Entities

- **Evento**: nombre, fechas (5-8 nov 2026; talleres gratuitos el 5, conversatorios con boleta 6-8), sedes, organizadores (Fernando Cordovez y Darío Restrepo), framing editorial. Fuente: esta spec.
- **Panelista**: nombre, medio/credencial, foto (tratada en duotono), estado de confirmación, franja horaria (opcional — puede estar confirmado sin horario). Confirmados: Daniel Samper Pizano, María Jimena Duzán, Darío Restrepo. Fuente de verdad para nuevos nombres: confirmación explícita del usuario o archivo de programación; "por confirmar" es un valor válido.
- **Franja de agenda**: día, hora, tipo (taller gratuito / conversatorio con boleta), título, sede, panelistas asociados.
- **Sede**: nombre, dirección en texto plano, tipo de actividad, enlace de navegación.
- **FAQ**: pregunta y respuesta.
- **Activos SEO heredados**: CNAME, clave IndexNow, robots.txt, sitemap.xml, metadatos del index, 404.html — se preservan en el merge final.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visitante nuevo puede identificar qué es el evento, cuándo y dónde en menos de 10 segundos desde la carga, sin hacer scroll.
- **SC-002**: Desde cualquier punto de la página, un visitante alcanza la sección de compra con una sola acción (el CTA persistente) y puede iniciar el checkout dentro de la página.
- **SC-003**: El 100% de los nombres de panelistas publicados coincide con el archivo de programación vigente; cero nombres inventados en cualquier revisión.
- **SC-004**: La página es completamente legible y navegable sin JavaScript y con `prefers-reduced-motion` activo (verificable por inspección manual).
- **SC-005**: En móvil de gama media con conexión 3G rápida, el contenido del hero es visible en menos de 3 segundos y la página no produce saltos de layout perceptibles al cargar.
- **SC-006**: Durante todo el desarrollo, testigosdelamemoria.com sigue sirviendo el placeholder actual sin ninguna alteración (verificable en cualquier momento).
- **SC-007**: Una revisión visual contra el manual de marca (páginas 1-7) confirma que colores, logo y lenguaje de bloques corresponden a la Propuesta 1, sin gradientes ni elementos de la Propuesta 2.
- **SC-008**: Los CTAs de compra aparecen exactamente en los puntos definidos (header persistente + cierres de Speakers, Agenda y FAQs) con texto y estilo idénticos.
- **SC-009**: Los tres panelistas confirmados aparecen publicados con nombre exacto (Daniel Samper Pizano, María Jimena Duzán, Darío Restrepo) y sin horarios inventados mientras la programación no los confirme.

## Assumptions

- **Hosting**: el despliegue final permanece en GitHub Pages con el dominio testigosdelamemoria.com ya configurado (CNAME + DNS GoDaddy). La mención a Cloudflare Pages en el brief original se considera superada por el contexto operativo del repositorio.
- **Datos del evento**: valen los de este documento (5-8 nov 2026: talleres gratuitos el 5, conversatorios con boleta 6-8; Casa Museo Antonio Nariño y Hospedería Duruelo). Fechas/sedes/horarios de los mockups del manual de marca son placeholders de diseño sin validez.
- **Programación**: el archivo de programación detallado aún no fue entregado; hasta recibirlo, la agenda se construye con estructura real y franjas "por confirmar". Los únicos panelistas publicables hoy son los tres confirmados por el usuario (sin horario).
- **Asignación de sedes por día**: se asume que los talleres gratuitos del 5 ocurren en Casa Museo Antonio Nariño y los conversatorios del 6-8 en Hospedería Duruelo, según el brief original; si la programación final ubica talleres en otros días o sedes, manda la programación.
- **Pretix**: el organizador ya cuenta (o contará) con la tienda de Pretix configurada; la URL del evento en Pretix se inyecta como dato de configuración. Mientras no exista, se usa un placeholder claramente marcado que no se publica.
- **Idioma**: el sitio se publica solo en español (el evento es íntegramente en español).
- **Assets de marca**: el logo y el símbolo se extraen del PDF de marca a la mejor calidad posible (idealmente vectorial); el usuario provee archivos fuente (SVG/AI) solo si la extracción no alcanza la calidad necesaria.
- **Componentes previos**: la carpeta `template-evento/src/components/` mencionada en el brief no existe en el repositorio ni en el entorno; todos los componentes del sitio se crean desde cero y el listado del brief se usa solo como inventario orientativo de secciones.
