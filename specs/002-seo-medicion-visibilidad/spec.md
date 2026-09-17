# Feature Specification: Medición, marcado y visibilidad de testigosdelamemoria.com

**Feature Branch**: `002-seo-medicion-visibilidad`

**Created**: 2026-09-15

**Status**: Draft

> **Replanteo del 2026-09-17**: la capa de servidor (atribución de la compra real: identificadores en el widget, webhook de Pretix, plugin, endpoints del backend, Conversions API, Measurement Protocol, registro de aceptaciones en servidor) se retiró por desproporcionada para un evento único a siete semanas. Quedan la medición en el navegador (GA4 en Consent Mode, píxel de Meta tras Aceptar, intención de compra) y todo el bloque de SEO y contenido. Nada toca Pretix ni el backend de Eventalist; no hay entregables fuera de este repositorio. Los puntos afectados se marcan abajo como RETIRADO y se conservan como registro. Las ventas se leen en Pretix; la campaña de Meta se optimiza por tráfico e intención de compra.

**Input**: User description: "Hicimos un análisis de SEO de la página y hay varios hallazgos. La idea es que uses pensamiento crítico para recibir este feedback e implementar lo que realmente nos sirva, pero si todo es bueno también acéptalo. Tiene que haber una fase de investigación profunda sobre el SOTA de cómo hacer para tener trazabilidad de marketing integrado de la manera más seamless posible con las herramientas de Meta. Veo que también nos falta la parte de Bing pero principalmente para aparecer en ChatGPT y otros LLMs sería muy bueno." Adjuntos: auditoría SEO del 15 de septiembre de 2026 (PDF, puntaje 57/100) y plan de acción de 37 tareas (Excel).

## Contexto

El evento es del 5 al 8 de noviembre de 2026. Quedan siete semanas. La auditoría concluye que la base técnica está bien hecha (82/100 en técnico, 72 en on-page) y que el problema está en tres frentes: no hay medición instalada, el marcado del evento no alcanza para el módulo de eventos de Google, y todo el contenido vive en una sola URL sin presencia fuera del dominio (18/100 en autoridad).

Restricción dura de calendario: lo que se publique después del **15 de octubre de 2026** no alcanza a indexarse y posicionarse antes del evento. Las fichas de ponentes y la programación deben estar en línea en las dos primeras semanas (antes del 29 de septiembre).

Hechos verificados en el repositorio y en el HTML publicado que corrigen o matizan la auditoría:

- El sitio tiene hoy **12 panelistas** confirmados, no 11 (León Valencia y Ana María Echeverri entraron el 15 de septiembre).
- El HTML publicado no contiene ninguna referencia a `pretix.eu`. Toda URL de compra, el widget y el marcado apuntan a la tienda propia de Eventalist en `pretix.eventalist.co`. La "trampa" del dominio de compra es un falso positivo.
- Search Console **ya está verificado** como propiedad de dominio por DNS (por eso no hay etiqueta en el HTML), el sitemap fue enviado y las tres páginas están indexadas desde el 14 de septiembre.
- La imagen de vista previa para compartir ya se validó en WhatsApp (versión v2 para renovar la caché); faltan Facebook y LinkedIn.
- La venta tiene dos etapas ya modeladas en el sitio: hasta el 4 de octubre solo se vende el pase completo (310.000 COP); desde el 5 de octubre se venden cuatro boletas por franja (90.000 COP) y el pase completo se retira. El marcado debe reflejar esas ventanas, no "dos modalidades" simultáneas.

## Lectura crítica de la auditoría

| Hallazgo / tarea | Decisión | Por qué |
|------------------|----------|---------|
| T01, T02 · Instalar GA4 y píxel de Meta | **Aceptado y ampliado** | Es lo más urgente. Pero el clic al widget no es la conversión: la compra ocurre dentro de Pretix. Sin atribución de la **compra real** la campaña de pago se optimiza a ciegas. Se exige trazabilidad de compra con desduplicación (ver User Story 1 e Investigación). Replanteo 2026-09-17: la trazabilidad de la compra real se retiró; queda visita e intención de compra. |
| T03 · Verificar Search Console | **Ya hecho** | Propiedad de dominio verificada por DNS; sitemap enviado; 3 URLs indexadas. Queda solo reenviar el sitemap cuando crezca y pedir indexación de las URLs nuevas. |
| T04 · Bing Webmaster Tools | **Aceptado** | Bing alimenta a ChatGPT (búsqueda) y Copilot. Es la vía concreta hacia la petición del usuario de aparecer en asistentes de IA. Acción manual del usuario: el navegador automatizado tiene bloqueado bing.com. |
| T05, T06 · Acortar título y descripción | **Aceptado** | El título actual de 73 caracteres se corta en resultados. La propuesta del auditor elimina "Periodistas en la Historia"; el texto final lo aprueba el usuario dentro del límite. |
| T07 · Unificar dominio de compra (pretix.eu) | **Rechazado: falso positivo** | Verificado en el HTML publicado: todas las URL van a `pretix.eventalist.co`. Solo se comprueba que el widget no muestre un enlace de compra externo. |
| T08 · noindex en las páginas de Pretix | **Aceptado** | Se hace en la configuración de la tienda de Pretix (fuera del repositorio, propiedad de Eventalist). Evita que la tienda compita por la búsqueda de marca. |
| T09 · noindex en términos y tratamiento de datos | **Aceptado con matiz** | El argumento de "concentrar el rastreo" no aplica a un sitio de tres páginas. Se hace porque no cuesta nada y evita que una página legal aparezca como resultado de marca. Prioridad baja. |
| T10 · Precargar la imagen LCP y variante móvil | **Aceptado** | Único punto de rendimiento mejorable. Se verifica con medición antes y después; la instalación de etiquetas de medición no puede empeorarlo. |
| T11 · Verificar imagen al compartir | **Parcialmente hecho** | WhatsApp ya validado. Faltan Facebook y LinkedIn (acción de Carolina o del usuario). Las páginas nuevas necesitan su propia imagen de vista previa. |
| T12 · Ofertas separadas en el marcado | **Aceptado y corregido** | No son dos ofertas simultáneas: son ofertas por etapa con ventanas de validez. El marcado declara cada boleta con su precio, su ventana y su disponibilidad. |
| T13 · Coordenadas de las dos sedes | **Aceptado** | Requisito del módulo de eventos. Coordenadas verificadas contra los mapas oficiales de cada sede. |
| T14 · subEvent por sesión | **Aceptado con regla** | Solo sesiones con datos confirmados (fecha, hora, sede). Nunca un nombre, horario o sede inventados (regla heredada de la especificación 001). Las sesiones sin ponente confirmado van sin ponente, no con placeholder. |
| T15 · Validar y monitorear el marcado | **Aceptado** | Criterio de cierre de todo el bloque de marcado. |
| T16 · Fichas de ponentes | **Aceptado, prioridad máxima de contenido** | Son 12, no 11. Las biografías ya existen y son públicas; la ampliación es deseable pero no bloquea la publicación. Cada ficha enlaza a las sesiones del ponente y tiene su propia imagen para compartir, para que el propio ponente enlace a su página (activo de autoridad de T25). |
| T17 · Página de charlas abiertas | **Aceptado** | Los datos ya existen en la agenda. "Entrada libre" es la consulta de mayor volumen. |
| T18 · Página de programación | **Aceptado** | Programación completa en texto, con ancla por día y por sesión y enlace a cada ficha. |
| T19 · Cuatro páginas por día | **Rechazado** | Con dos a cuatro sesiones por día son páginas delgadas que duplican la programación y compiten con ella. Se cubre con las anclas por día de la programación. Reconsiderar para 2027 si hay contenido por día. |
| T20 · Página de cómo llegar | **Aceptado, P3** | Demanda turística real y contenido derivable de fuentes públicas. Después del bloque prioritario. |
| T21 · Página de dónde dormir | **Aceptado condicionado** | Solo si Carolina entrega la lista de hoteles y acuerdos de enlace. Sin lista real no se publica nada. |
| T22 · URL propia para preguntas frecuentes | **Rechazado** | Desde 2023 Google reserva el resultado enriquecido de FAQ a sitios gubernamentales y de salud. Mover el bloque fuera de la portada le quita texto útil a la página que más posiciona. Se mantiene en la portada con su marcado. |
| T23 · Migas de pan y BreadcrumbList | **Aceptado** | Necesario al pasar a sitio multipágina. |
| T24 · Regenerar y reenviar el sitemap | **Aceptado y automatizado** | El sitemap debe derivarse de las páginas publicadas en cada compilación, nunca de una lista manual. |
| T25 a T30 · Off-site (ponentes, prensa, calendarios, sedes, Facebook, Eventalist) | **Fuera del alcance del desarrollo** | Son acciones de Jorge, Carolina y el equipo de Eventalist. El sitio las facilita: URL propia por ponente, imagen para compartir y programación enlazable. |
| T31, T33 · Campañas y revisión de datos | **Fuera del alcance, dependen de esta feature** | Solo funcionan si la medición de la User Story 1 está en producción en la semana 1. |
| T34 · Actualizar disponibilidad de boletas | **Aceptado y automatizado** | La disponibilidad se deriva de las etapas de venta ya modeladas y de un interruptor manual de "agotado" por boleta. |
| T35, T36, T37 · Post-evento e inglés | **Fuera del alcance** | Inversión para 2027. Se documentan como trabajo futuro. |
| Petición del usuario · Aparecer en ChatGPT y otros LLMs | **Añadido** | No está en la auditoría. Se cubre con Bing Webmaster (índice de ChatGPT y Copilot), acceso explícito a los rastreadores de IA, hechos del evento en texto plano y lo que arroje la investigación. |
| Petición del usuario · Trazabilidad seamless con las herramientas de Meta | **Añadido como fase de investigación obligatoria** | Ver la sección Investigación requerida. La decisión de mecanismo se toma en el plan con evidencia, no aquí. |

## Clarifications

### Session 2026-09-15

- Q: ¿Hace falta aviso o consentimiento para GA4 y el píxel de Meta en Colombia? → A: Dictamen del abogado interno (`docs/revision-legal-2026-09-15-medicion.md`): las cookies que reconocen el navegador son datos personales para la SIC; se exige autorización previa y expresa con prueba. Aviso con un solo botón "Aceptar" (sin "Rechazar"); GA4 carga sin cookies hasta aceptar; el píxel de Meta solo tras aceptar (cargarlo antes no es defendible); registro de cada aceptación; enlace permanente de preferencias; la casilla de Pretix y los términos cubren el envío hasheado de datos de compra. Afecta a FR-008 y al escenario 1 de la historia 1. Replanteo 2026-09-17: la aceptación se registra solo en el navegador (variante B del dictamen); la casilla de Pretix y los términos no cambian.
- **RETIRADO el 2026-09-17** (capa de servidor): Q: ¿Cómo se atribuye una compra que ocurre en Pretix? → A: El checkout corre en un iframe de otro dominio y el widget no avisa al sitio; los identificadores de la visita viajan como atributos del widget hasta el pedido, y el webhook de pedido pagado dispara el envío desde el backend de Eventalist a Meta y GA4 (plan, contrato `pretix-attribution.md`).
- Q: ¿Colombia entra en el módulo de eventos de Google? → A: Sí, la documentación oficial lista "Latin America (Spanish)". Google exige una URL por evento: las charlas abiertas tienen evento propio; las sesiones van como subeventos en la portada (útiles para asistentes de IA, sin entrada propia en el carrusel).
- Q: ¿Vocabulario? → A: "panelistas" en rutas, textos y tareas (`/panelistas/`); "ponentes" solo al citar la auditoría.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - El organizador mide visitas y compras y construye audiencia de retargeting (Priority: P1)

> Replanteo 2026-09-17: la historia queda en visitas, intención de compra y audiencia de retargeting. La atribución de la compra real (escenario 3, FR-003 a FR-005, SC-002, SC-003, SC-010) se retiró; las ventas se leen en Pretix.

Jorge y Carolina van a pagar una campaña de boletas en Meta y Google. Necesitan que, desde la primera semana, cada visita al sitio alimente las audiencias de retargeting y que cada compra en Pretix quede atribuida a su origen (campaña, publicación de un ponente, búsqueda orgánica, WhatsApp). Al final del evento deben poder responder: de las boletas vendidas, cuántas llegaron por pago y cuántas por orgánico, y cuánto costó cada compra pagada.

**Why this priority**: Es la tarea más urgente de la auditoría y la única que pierde valor cada día que pasa: la audiencia de retargeting no se puede reconstruir hacia atrás. Sin atribución de compra la inversión publicitaria se decide a ciegas.

**Independent Test**: Con solo esta historia publicada, el organizador abre las consolas de Google Analytics y de Meta y ve visitas en tiempo real, un evento de intención de compra al pulsar el botón de boletas y, tras una compra de prueba en Pretix, un evento de compra con valor y moneda en ambas plataformas, contado una sola vez.

**Acceptance Scenarios**:

1. **Given** un visitante llega a cualquier página del sitio, **When** la página termina de cargar, **Then** Google Analytics registra la visita sin instalar cookies (medición sin identificador) y el sitio muestra un aviso de cookies con un solo botón de aceptación.
1b. **Given** el aviso de cookies visible, **When** el visitante pulsa "Aceptar", **Then** ambas plataformas registran la visita con su página, origen y campaña, el visitante queda en la audiencia de retargeting de Meta, y la aceptación queda registrada con fecha, versión y alcance (en el navegador). Cerrar el aviso, ignorarlo o seguir navegando no activa nada.
2. **Given** un visitante en la sección de boletas, **When** pulsa un botón de compra o interactúa con el widget de Pretix, **Then** ambas plataformas registran un evento de intención de compra (inicio de pago) sin recargar la página.
3. **RETIRADO el 2026-09-17** (capa de servidor): **Given** un visitante que llegó desde una campaña con parámetros de seguimiento, **When** completa una compra en Pretix, **Then** la compra queda atribuida a esa campaña en ambas plataformas con valor, moneda y número de boletas, y se cuenta exactamente una vez aunque se registre por más de un canal.
4. **Given** un visitante con bloqueador de anuncios o sin JavaScript, **When** navega y compra, **Then** el sitio y la compra funcionan igual; la medición se degrada sin errores visibles.
5. **Given** la instalación de la medición, **When** se vuelve a medir el rendimiento móvil de la portada, **Then** la carga percibida no empeora respecto a la medición previa (ver SC-007).
6. **Given** un lector de la política de tratamiento de datos, **When** busca qué se mide y con quién se comparte, **Then** encuentra la descripción de la medición y de las plataformas antes de que las etiquetas estén en producción.

---

### User Story 2 - Google muestra el evento en su módulo de eventos (Priority: P1)

Una persona busca "eventos en Villa de Leyva noviembre" o "conversatorio Daniel Samper Pizano". Google muestra el módulo de eventos por encima de los resultados clásicos. Entrar ahí no depende de la autoridad del dominio sino de la completitud del marcado: sedes con coordenadas, cada sesión como subevento con fecha, hora, sede y ponente, y cada boleta como oferta con precio, ventana de venta y disponibilidad.

**Why this priority**: Es la única vía por la que un dominio nuevo consigue visibilidad en siete semanas sin depender de enlaces externos. Cada sesión declarada multiplica la superficie en el módulo.

**Independent Test**: La herramienta de prueba de resultados enriquecidos de Google valida la portada sin errores ni advertencias, mostrando el evento con sus dos sedes georreferenciadas, todas las sesiones confirmadas como subeventos y las ofertas por etapa.

**Acceptance Scenarios**:

1. **Given** la portada publicada, **When** se valida su marcado, **Then** el evento aparece con dos sedes, cada una con dirección y coordenadas, y sin advertencias.
2. **Given** la agenda confirmada, **When** se valida el marcado, **Then** cada charla y conversatorio con fecha, hora y sede aparece como subevento con esos datos y con sus ponentes confirmados; ninguna sesión lleva datos inventados.
3. **Given** la etapa 1 de venta (hasta el 4 de octubre), **When** se lee el marcado, **Then** declara el pase completo con precio, ventana de venta y disponible, y las boletas por franja con su ventana futura.
4. **Given** el cambio a la etapa 2 (5 de octubre), **When** se compila y publica el sitio, **Then** el marcado deja el pase completo como no disponible y las cuatro franjas como disponibles, sin edición manual del marcado.
5. **Given** que una boleta se agota, **When** el organizador marca esa boleta como agotada y publica, **Then** el marcado la declara agotada en la siguiente publicación.
6. **Given** que existan fichas de ponentes, **When** se valida el marcado del evento, **Then** cada ponente enlaza a su ficha propia además de a sus perfiles públicos.

---

### User Story 3 - Un lector busca a un periodista y llega a su ficha en el sitio (Priority: P1)

Un lector de Los Danieles busca "Daniel Samper Pizano Villa de Leyva". Hoy no hay ninguna página en internet que cruce ese nombre con el evento. Con una ficha propia por ponente, con su biografía, su foto, sus enlaces y las sesiones en que participa, el sitio captura una demanda que ya existe y que nadie más atiende. Desde la ficha el lector llega a la programación y a la compra.

**Why this priority**: Es la acción de mayor retorno del plan según la auditoría, y la que da a cada ponente una URL propia que compartir en sus redes y columnas (el activo de autoridad más grande y gratuito). Debe estar publicada antes del 29 de septiembre.

**Independent Test**: Existen 12 fichas con URL propia enlazadas desde la portada y presentes en el sitemap; una búsqueda por nombre de ponente más "Villa de Leyva" devuelve la ficha en los resultados en las tres semanas siguientes a su publicación.

**Acceptance Scenarios**:

1. **Given** un ponente confirmado, **When** un visitante abre su ficha, **Then** ve nombre, credencial, biografía, foto, enlaces a sus perfiles y obras, las sesiones del evento en las que participa con fecha, hora y sede, y un camino claro hacia la compra de boletas.
2. **Given** la portada, **When** un visitante pulsa la tarjeta de un ponente, **Then** llega a su ficha; la portada conserva su galería de ponentes tal como está.
3. **Given** una ficha compartida en WhatsApp, Facebook, X o LinkedIn, **When** se genera la vista previa, **Then** muestra la foto del ponente, su nombre y el nombre del evento con fechas y lugar.
4. **Given** un visitante en la programación, **When** revisa cualquier día, **Then** encuentra cada sesión con hora, sede, tipo (entrada libre o con boleta) y enlace a la ficha de cada ponente, todo en texto rastreable con ancla por día y por sesión.
5. **Given** una persona que busca planes gratuitos en Villa de Leyva, **When** llega a la página de charlas abiertas, **Then** entiende qué charlas son de entrada libre, cuándo, dónde y si requieren inscripción, y ve el camino hacia los conversatorios con boleta.
6. **Given** cualquier página interna, **When** el visitante la abre, **Then** ve migas de pan hacia la portada y la sección, y los buscadores reciben el marcado equivalente.
7. **Given** un ponente que se retira del evento, **When** se retira del sitio, **Then** su ficha deja de publicarse, sale del sitemap y su URL redirige a la portada.

---

### User Story 4 - El evento aparece en Bing, ChatGPT y otros asistentes de IA (Priority: P2)

Una persona le pregunta a ChatGPT, Copilot o Perplexity "qué eventos culturales hay en Villa de Leyva en noviembre de 2026". Estos asistentes se apoyan en el índice de Bing y en sus propios rastreadores. El sitio debe estar en el índice de Bing, permitir explícitamente el acceso de los rastreadores de búsqueda de IA y exponer los hechos del evento (qué, quién, cuándo, dónde, cuánto cuesta, qué es gratis) en texto plano y consistente en todas las páginas.

**Why this priority**: Petición explícita del usuario. Es de bajo costo y complementa el bloque P1, pero no sustituye a Google ni a la medición.

**Independent Test**: Bing Webmaster Tools muestra la propiedad verificada, el sitemap procesado y las URLs indexadas; una consulta de marca en Bing devuelve el sitio; una pregunta sobre el evento en un asistente con búsqueda en vivo cita testigosdelamemoria.com.

**Acceptance Scenarios**:

1. **Given** la propiedad verificada en Search Console, **When** el usuario la importa en Bing Webmaster Tools, **Then** queda verificada, con sitemap enviado y sin errores de rastreo.
2. **Given** las reglas de rastreo del sitio, **When** un rastreador de búsqueda de IA solicita una página, **Then** no encuentra ninguna regla que lo bloquee y recibe el mismo HTML completo que cualquier visitante.
3. **Given** cualquier página del sitio, **When** se lee su texto sin estilos ni scripts, **Then** contiene el nombre del evento, las fechas, la ciudad, las sedes y el estado de la boletería en texto plano y consistente con la portada.
4. **Given** una publicación nueva, **When** el sitio se despliega, **Then** los buscadores que aceptan notificaciones de cambios reciben aviso sin intervención manual (si la investigación confirma que vale la pena).

---

### User Story 5 - Ajustes on-page y técnicos de la auditoría (Priority: P2)

El título y la descripción de la portada se cortan en los resultados; la imagen principal no está precargada; las páginas legales y la tienda de Pretix son indexables y pueden competir por la búsqueda de marca.

**Why this priority**: Correcciones baratas y verificables que mejoran el resultado en buscadores sin depender de nadie más. No son urgentes por sí solas, pero deben salir en la primera publicación junto con la medición.

**Independent Test**: El HTML publicado muestra título y descripción dentro de los límites, la imagen principal precargada con variante móvil, las páginas legales excluidas del índice y del sitemap, y la tienda de Pretix configurada para no indexarse.

**Acceptance Scenarios**:

1. **Given** la portada publicada, **When** se lee su título y descripción, **Then** el título tiene como máximo 60 caracteres y la descripción como máximo 155, conservan marca, lugar y fechas, y el texto fue aprobado por el usuario.
2. **Given** la portada en un móvil de gama media, **When** se mide la carga, **Then** el elemento principal más grande aparece en menos de 2,5 segundos.
3. **Given** las páginas de términos y de tratamiento de datos, **When** un buscador las rastrea, **Then** recibe la instrucción de no indexarlas pero seguir sus enlaces, y no aparecen en el sitemap.
4. **Given** la tienda de Pretix, **When** un buscador la rastrea, **Then** recibe la instrucción de no indexarla; la compra sigue funcionando igual.
5. **Given** el enlace de la portada compartido en Facebook y LinkedIn, **When** cada plataforma genera la vista previa, **Then** la miniatura se muestra correctamente.

---

### User Story 6 - Páginas prácticas para quien planea el viaje (Priority: P3)

Quien considera ir desde Bogotá o Tunja quiere saber cómo llegar y dónde dormir. Son consultas turísticas de volumen constante y resuelven una objeción de compra.

**Why this priority**: Valor real pero después del bloque prioritario y sujeto a la fecha límite del 15 de octubre. La página de hospedaje depende de contenido que el equipo debe entregar; sin lista real de hoteles no se publica.

**Independent Test**: Existen las páginas de cómo llegar y dónde dormir, enlazadas desde la portada y las preguntas frecuentes, con contenido verificable y presentes en el sitemap.

**Acceptance Scenarios**:

1. **Given** una persona en Bogotá, **When** abre la página de cómo llegar, **Then** encuentra rutas por carretera y en bus desde Bogotá y Tunja, tiempos aproximados, referencia a parqueaderos y la ubicación de las dos sedes.
2. **Given** que Carolina entregó la lista de hoteles, **When** se publica la página de dónde dormir, **Then** muestra al menos seis alojamientos con enlace, distancia aproximada a las sedes y la recomendación de reservar con anticipación.
3. **Given** que la lista de hoteles no llegó antes del 15 de octubre, **When** se revisa el alcance, **Then** la página de dónde dormir se pospone y las preguntas frecuentes siguen cubriendo la respuesta.

---

### Edge Cases

- **Cambio de etapa de venta el 5 de octubre**: el marcado y la disponibilidad deben cambiar con una publicación sin editar datos a mano; si el sitio no se recompila ese día, el marcado seguirá diciendo que el pase completo está disponible. Debe existir un recordatorio o mecanismo para publicar ese día.
- **Boleta agotada en Pretix**: el marcado no lo sabe por sí solo. Debe existir un interruptor manual por boleta y una verificación de cierre en la semana 7.
- **Sesión sin ponente confirmado** (charla de periodismo digital, cierre): se declara como subevento sin ponente; nunca con un nombre provisional.
- **Ponente que se retira**: la ficha sale del sitio y del sitemap y su URL redirige a la portada; el marcado del evento deja de nombrarlo.
- **Bloqueadores de anuncios y modo privado**: la medición se pierde en esa visita; el sitio y la compra deben funcionar sin errores en consola ni cambios visibles.
- **RETIRADO el 2026-09-17** (capa de servidor): **Compra que empieza en el sitio y termina dentro del dominio de Pretix**: el origen de la visita puede perderse al cruzar de dominio. La atribución de compra debe sobrevivir ese cruce o registrarse desde Pretix con la información de origen conservada.
- **RETIRADO el 2026-09-17** (capa de servidor): **Compra registrada dos veces** (una desde el navegador y otra desde el servidor): debe contarse una sola vez.
- **Publicación después del 15 de octubre**: cualquier página nueva después de esa fecha se considera inversión para 2027 y no cuenta para los criterios de éxito de esta feature.
- **Título o descripción que exceden el límite en una página nueva**: cada página nueva debe cumplir los mismos límites que la portada.
- **Coordenadas equivocadas de una sede**: llevarían a la gente al lugar equivocado en Google Maps; se verifican contra los mapas oficiales y se revisan con el organizador.
- **Miniatura de vista previa en caché**: al cambiar la imagen de una ficha, la URL de la imagen debe cambiar para que WhatsApp la renueve.

## Requirements *(mandatory)*

### Functional Requirements

**Medición y trazabilidad (User Story 1)**

- **FR-001**: El sitio MUST registrar cada vista de página en Google Analytics 4 y en Meta, con página, origen, medio y campaña cuando existan parámetros de seguimiento.
- **FR-002**: El sitio MUST registrar un evento de intención de compra en ambas plataformas cuando el visitante pulsa un botón de compra o inicia interacción con el widget de Pretix, sin recargar la página.
- **FR-003**: **RETIRADO el 2026-09-17** (capa de servidor): Cada compra completada en Pretix MUST quedar registrada como evento de compra en ambas plataformas con valor, moneda y cantidad, y atribuida al origen de la visita que la generó.
- **FR-004**: **RETIRADO el 2026-09-17** (capa de servidor): Si una compra llega por más de un canal de medición, MUST contarse una sola vez en cada plataforma.
- **FR-005**: **RETIRADO el 2026-09-17** (capa de servidor): Los parámetros de seguimiento con los que llega el visitante MUST conservarse hasta la compra en Pretix, aunque la compra ocurra en otro dominio.
- **FR-006**: La medición MUST degradarse en silencio cuando esté bloqueada: sin errores visibles, sin afectar la compra ni la navegación.
- **FR-007**: La medición MUST poder activarse, desactivarse o cambiar de identificadores desde un único punto de configuración, sin tocar el resto del sitio.
- **FR-008**: La política de tratamiento de datos MUST describir la medición, las plataformas con las que se comparten datos y la forma de oponerse, y esa versión MUST estar publicada antes o junto con las etiquetas. Conforme al dictamen legal del 2026-09-15: el sitio MUST mostrar un aviso de cookies con botón de aceptación; el píxel de Meta MUST NOT cargar antes de la aceptación; Google Analytics MAY cargar antes sin instalar cookies; la aceptación MUST quedar registrada con identificador, fecha, versión y alcance; MUST existir un enlace permanente de preferencias que permita revocar; y la casilla de compra de Pretix y los términos MUST cubrir el envío de datos de compra a Meta y Google.
- **FR-009**: (Replanteo 2026-09-17: pasa a SHOULD; sin eventos de compra la verificación no bloquea nada.) El dominio testigosdelamemoria.com SHOULD quedar verificado en la cuenta de Meta Business de Eventalist para que los eventos de compra sean utilizables en campañas.
- **FR-010**: La instalación de la medición MUST NOT empeorar la carga percibida de la portada en móvil (SC-007) ni añadir más de un tercio al peso total actual del sitio.

**Marcado del evento (User Story 2)**

- **FR-011**: Cada sede MUST declararse con nombre, dirección postal, enlace de mapa y coordenadas verificadas.
- **FR-012**: Cada sesión confirmada de la agenda MUST declararse como subevento con nombre, fecha y hora de inicio y fin, sede y ponentes confirmados; las sesiones sin ponente confirmado se declaran sin ponente.
- **FR-013**: Cada boleta (pase completo y cuatro franjas) MUST declararse como oferta con nombre, precio, moneda, URL de compra, ventana de venta y disponibilidad.
- **FR-014**: La disponibilidad de cada oferta MUST derivarse de las etapas de venta ya definidas y de un interruptor manual de "agotado" por boleta, sin editar el marcado a mano.
- **FR-015**: Cada ponente en el marcado del evento MUST enlazar a su ficha propia en el sitio y a sus perfiles públicos verificados.
- **FR-016**: El marcado de la portada MUST validar sin errores ni advertencias en la herramienta de resultados enriquecidos de Google.
- **FR-017**: Toda página interna MUST mostrar migas de pan visibles y su marcado equivalente.

**Arquitectura de contenido (User Stories 3 y 6)**

- **FR-018**: Cada ponente confirmado MUST tener una ficha con URL propia y estable, con nombre, credencial, biografía, foto, enlaces a perfiles y obras, sus sesiones en el evento y un camino hacia la compra.
- **FR-019**: Cada ficha MUST declarar a la persona en el marcado con sus perfiles públicos y su relación con el evento.
- **FR-020**: Cada ficha MUST tener su propia imagen de vista previa para compartir, con la foto del ponente y la identidad del evento.
- **FR-021**: El sitio MUST tener una página de programación completa en texto, con ancla por día y por sesión, hora, sede, tipo de entrada y enlace a cada ficha; es la única representación de la programación por día (no se publican páginas por día).
- **FR-022**: El sitio MUST tener una página de charlas abiertas con las charlas de entrada libre, fecha, hora, sede, condiciones de ingreso y el camino hacia los conversatorios con boleta.
- **FR-023**: La portada MUST enlazar a cada ficha desde la galería de ponentes y a las páginas de programación y charlas abiertas, conservando su estructura actual y su bloque de preguntas frecuentes.
- **FR-024**: Cada página nueva MUST tener título de máximo 60 caracteres, descripción de máximo 155, canonical propio, imagen de vista previa y la identidad visual vigente del sitio (fórmula visual de bloques, sin guiones de pausa en el copy).
- **FR-025**: Toda ficha, programación y charlas abiertas MUST estar publicadas antes del 29 de septiembre de 2026; cualquier página de esta feature MUST estar publicada antes del 15 de octubre de 2026 o se pospone a 2027.
- **FR-026**: El sitio SHOULD tener una página de cómo llegar (rutas desde Bogotá y Tunja, tiempos, bus, parqueaderos, sedes) publicada antes del 15 de octubre.
- **FR-027**: El sitio SHOULD tener una página de dónde dormir con al menos seis alojamientos verificados, solo si el equipo entrega la lista antes del 15 de octubre.
- **FR-028**: Si un ponente se retira, su ficha MUST dejar de publicarse, salir del sitemap y redirigir a la portada.

**Indexación y visibilidad (User Stories 4 y 5)**

- **FR-029**: El sitemap MUST generarse en cada compilación a partir de las páginas publicadas, excluyendo las páginas con instrucción de no indexar.
- **FR-030**: Las páginas de términos y de tratamiento de datos MUST llevar instrucción de no indexar pero seguir enlaces, y salir del sitemap.
- **FR-031**: La tienda de Pretix MUST configurarse para no indexarse en buscadores.
- **FR-032**: El sitio MUST quedar verificado en Bing Webmaster Tools con el sitemap enviado (acción manual del usuario, importando desde Search Console).
- **FR-033**: Las reglas de rastreo MUST permitir explícitamente a los rastreadores de búsqueda de los asistentes de IA (los que indexan para responder, no necesariamente los de entrenamiento) y MUST NOT bloquear ninguno de los buscadores tradicionales.
- **FR-034**: Cada página MUST contener en texto plano los hechos del evento: nombre, fechas, ciudad, sedes y estado de la boletería, consistentes con la portada.
- **FR-035**: El título de la portada MUST tener como máximo 60 caracteres y la descripción como máximo 155, conservando marca, lugar y fechas, con texto aprobado por el usuario.
- **FR-036**: La imagen principal de la portada MUST precargarse y servirse en una variante más liviana para móvil.
- **FR-037**: Tras cada publicación, las URLs nuevas o cambiadas SHOULD notificarse a los buscadores que aceptan avisos de cambio, si la investigación confirma su utilidad para Bing.
- **FR-038**: Toda publicación a producción MUST tener aprobación explícita del usuario para ese cambio (regla vigente del proyecto).
- **FR-039** (añadido el 2026-09-17): Antes de cada publicación a `main`, MUST revisarse el diff completo de la rama en busca de restos de la capa de servidor retirada (código, HTML compilado, textos legales y documentación) y MUST comprobarse que el checkout de Pretix se comporta igual que en `main`.

### Key Entities

- **Ponente**: persona confirmada con URL propia, nombre, credencial, biografía, foto, perfiles públicos, obras y sesiones. Solo existen ponentes confirmados.
- **Sesión**: charla abierta o conversatorio con fecha, hora de inicio y fin, sede, tipo de entrada, ponentes confirmados e invitados. Se representa como subevento del encuentro.
- **Sede**: lugar con nombre, dirección, enlace de mapa y coordenadas. Dos sedes: Hospedería Duruelo (conversatorios) y Casa Museo Antonio Nariño (charlas abiertas).
- **Oferta de boleta**: pase completo o franja, con precio, moneda, ventana de venta, disponibilidad e URL de compra. La disponibilidad se deriva de la etapa de venta y del interruptor de agotado.
- **Etapa de venta**: ventana de fechas que decide qué ofertas están a la venta (etapa 1 hasta el 4 de octubre; etapa 2 desde el 5 de octubre).
- **Evento de medición**: vista de página o intención de compra, con sus parámetros (moneda, valor si se conoce, identificador de desduplicación) y las plataformas destino. (Replanteo 2026-09-17: sin evento de compra.)
- **Origen de la visita**: fuente, medio y campaña con los que llega el visitante, tal como los registran GA4 y Meta en el navegador. (Replanteo 2026-09-17: ya no viajan hasta la compra.)
- **Página indexable**: URL pública con título, descripción, canonical, imagen de vista previa, migas de pan y presencia en el sitemap.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En las 24 horas siguientes a la publicación de la medición, las consolas de Google Analytics y de Meta muestran visitas en tiempo real y al menos un evento de intención de compra registrado desde el sitio.
- **SC-002**: **RETIRADO el 2026-09-17** (capa de servidor): Una compra de prueba en Pretix aparece como evento de compra en ambas plataformas con valor, moneda y origen correctos, contada una sola vez, en menos de una hora.
- **SC-003**: **RETIRADO el 2026-09-17** (capa de servidor): Durante la campaña, el número de compras registradas en cada plataforma coincide con las órdenes pagadas de Pretix con una desviación máxima del 10 %.
- **SC-004**: La portada valida en la herramienta de resultados enriquecidos de Google con el evento, dos sedes georreferenciadas, todas las sesiones confirmadas como subeventos y cinco ofertas, sin errores ni advertencias; a los 7 días el informe de eventos de Search Console no muestra errores.
- **SC-005**: Antes del 29 de septiembre están publicadas 12 fichas de ponentes, la programación y las charlas abiertas; el sitemap pasa de 3 a al menos 15 URLs y al menos el 80 % de ellas están indexadas en Google el 20 de octubre.
- **SC-006**: El 1 de noviembre, para al menos 8 de los 12 ponentes, la búsqueda de su nombre más "Villa de Leyva" devuelve su ficha en la primera página de Google.
- **SC-007**: La carga del elemento principal de la portada en móvil se mantiene por debajo de 2,5 segundos después de instalar la medición, y el peso total del sitio no supera 560 KB.
- **SC-008**: Bing Webmaster Tools muestra la propiedad verificada, el sitemap procesado y la portada indexada antes del 30 de septiembre; una búsqueda de marca en Bing devuelve el sitio el 15 de octubre.
- **SC-009**: El 1 de noviembre, una búsqueda de marca en Google devuelve el sitio como primer resultado (hoy gana el perfil de Instagram).
- **SC-010**: **RETIRADO el 2026-09-17** (capa de servidor): Al cierre del evento, el organizador puede informar la proporción de boletas vendidas con origen pagado frente a orgánico y el costo por compra de la campaña.
- **SC-011**: La política de tratamiento de datos publicada describe la medición antes o el mismo día en que las etiquetas entran en producción.

## Investigación requerida antes del plan

El usuario pide una fase de investigación profunda. El plan debe responder estas preguntas con fuentes vigentes y proponer una decisión por cada una; la especificación fija solo el resultado esperado.

- **RETIRADO el 2026-09-17** (capa de servidor): **R-01 · Atribución de compra Pretix ↔ Meta y Google**: cómo registrar la compra que ocurre en Pretix (widget embebido y tienda en otro dominio) como evento de compra en Meta y en GA4 con origen conservado y desduplicación. Comparar: complementos de seguimiento disponibles en Pretix, notificaciones de pedido (webhooks) de Pretix hacia un servicio propio que envíe a la Conversions API de Meta y al protocolo de medición de GA4, y paso de parámetros de origen a través del widget. Evaluar si el backend existente de Eventalist puede recibir esas notificaciones.
- **R-02 · Estado del arte de la medición en Meta** (aplicado solo en la parte de navegador; Conversions API retirada el 2026-09-17): Conversions API con desduplicación por identificador de evento, Advanced Matching, verificación de dominio, configuración de eventos y qué de todo esto aplica a un sitio estático sin servidor propio. Concluir con la arquitectura mínima que dé atribución de compra confiable en siete semanas.
- **R-03 · Gestor de etiquetas y consentimiento**: si conviene un gestor de etiquetas o etiquetas directas; qué exige la ley colombiana (Ley 1581 de 2012 y guías de la SIC) sobre aviso o consentimiento para cookies y píxeles, y qué exigen las políticas de Meta y Google. Revisión con el abogado interno antes de publicar.
- **R-04 · Rendimiento**: cómo cargar las etiquetas sin afectar la carga percibida ni el peso (FR-010), y cómo medirlo antes y después.
- **R-05 · Visibilidad en asistentes de IA**: qué índices y rastreadores usan hoy ChatGPT, Copilot, Perplexity, Gemini y Claude para responder con búsqueda en vivo; cómo se llaman sus agentes de usuario; si `llms.txt` tiene adopción real; si IndexNow acelera Bing; y qué señales de entidad (perfiles públicos, Wikidata, calendarios) mejoran que un asistente cite el sitio.
- **R-06 · Módulo de eventos de Google en 2026**: requisitos vigentes del marcado de evento, ofertas y subeventos, y disponibilidad del módulo en Colombia.

## Assumptions

- Las cuentas de medición (propiedad de Google Analytics 4, píxel y Business Manager de Meta) pertenecen a Eventalist; el usuario las crea o da acceso antes de la implementación.
- ~~La revisión legal decide si hace falta un aviso de cookies~~ Resuelto el 2026-09-15 (ver Clarifications): aviso con aceptación expresa, píxel de Meta solo tras aceptar, registro de la aceptación. ~~Las audiencias de compradores no dependen del aviso: se construyen desde el servidor con los datos autorizados en la casilla de compra.~~ Retirado el 2026-09-17: no hay audiencias de compradores; solo la de visitantes que aceptaron.
- Las biografías actuales de los 12 ponentes, ya públicas en la portada, bastan para publicar las fichas; la ampliación con obras y enlaces adicionales llega después sin bloquear la publicación.
- El sitio sigue siendo estático y en español; no hay versión en inglés en esta feature.
- Las coordenadas de las sedes se obtienen de los mapas oficiales de cada sede y se confirman con el organizador.
- Las tareas off-site (T25 a T30) las ejecutan Jorge, Carolina y el equipo de Eventalist en paralelo; esta feature entrega las URLs y las imágenes que necesitan.
- Bing Webmaster Tools y la configuración de Pretix las hace el usuario o Eventalist a mano; el plan entrega instrucciones precisas.
- Toda publicación a producción requiere la aprobación explícita del usuario para ese cambio; el trabajo se hace en la rama de la feature y se integra a `dev`.
- El puntaje y las métricas de la auditoría (420 KB, carga del elemento principal, TTFB) sirven como línea base; lo que la auditoría marca como correcto no se toca.

## Out of Scope

- (Desde el 2026-09-17) Atribución de la compra real a su origen: webhook de Pretix, plugin en la instancia, endpoints del backend de Eventalist, Conversions API de Meta, Measurement Protocol de GA4 y registro de aceptaciones en servidor. Contratos archivados en `docs/archivo-2027/`.
- Páginas por día del evento (T19), URL propia para preguntas frecuentes (T22), unificación del dominio de compra (T07, falso positivo).
- Campañas publicitarias, nota de prensa, contacto con ponentes, calendarios locales, evento de Facebook y refuerzo de la ficha en eventalist.co (T25 a T31, T33).
- Grabaciones, transcripciones, estructura para la edición 2027 y versión en inglés (T35 a T37).
- Cualquier página nueva publicada después del 15 de octubre de 2026.
