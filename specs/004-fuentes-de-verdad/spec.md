# Feature Specification: Fuentes de verdad del evento y orden del repo

**Feature Branch**: `004-fuentes-de-verdad` (se trabaja en `main` con commits locales; ningún push sin visto bueno del titular)

**Created**: 2026-10-19

**Status**: Draft · entregable 1 (diagnóstico) listo para revisión

**Input**: `docs/proyecto/prompt-centralizacion.md`, pasado completo a `/speckit-specify` el 2026-10-19.

## Para qué

El repo es el cerebro de la operación de Testigos de la Memoria: de aquí salen el sitio, los correos y WhatsApp de campaña, los textos de la tienda, la base del chatbot, el plan de pauta, las boletas y las imágenes. Creció por acumulación y hoy un mismo dato del evento vive copiado a mano en decenas de piezas. Cuando cambia, alguna copia queda vieja y llega al público (ver `diagnostico.md`).

El titular quiere dos cosas, en este orden:

1. Que cada dato del evento se cambie en un solo lugar y de ahí llegue a todo lo que lo usa, dentro y fuera del repo; y que las herramientas y los documentos estén donde se buscan, no en la carpeta de la feature que los creó.
2. Que esa organización sea la que se repite en el próximo evento.

## Fuente de verdad de esta feature

- `docs/proyecto/prompt-centralizacion.md`: el encargo, las restricciones y los entregables con parada.
- `specs/004-fuentes-de-verdad/diagnostico.md`: entregable 1, con los inventarios y los problemas ordenados por riesgo. Si un hallazgo cambia, se cambia primero ahí.
- `docs/proyecto/punto-de-partida.md` y `/Users/juandev/Documents/eventalist/investigacion-testigos-web.md` (secciones 3.1, 3.4 y 4): contexto.

## Clarifications

### Session 2026-10-19 (revisión del diagnóstico)

- Q: ¿Cómo se cuentan las franjas al público? → A: "Franja" es un nombre interno; al público se le dice "boletas de medio día", y así está bien. Las campañas a interesados y expirados ya salieron; no se manda corrección. Las campañas y sus plantillas entran en el sistema centralizado como consumidores de la fuente.
- Q: ¿"Talleres de periodismo" o "charlas abiertas"? → A: "Charlas abiertas" en todas partes. Incluyen la proyección del documental, porque después se conversa con su codirectora.
- Q: ¿Pretix entra en la centralización? → A: No: Pretix es su propio sistema. Pero las reglas del repo (`CLAUDE.md`) deben decir que todo pedido de textos para Pretix es una señal inmediata de cotejar con la fuente de verdad.
- Q: ¿Hay venta en la puerta? → A: Sí, dentro del hotel, para casos puntuales (alguien llega con un acompañante). Es un hecho de la fuente, pero no se publicita.
- Q: ¿Canales de atención? → A: Hoy funcionan Instagram y el correo. El chatbot está conectado a WhatsApp e Instagram, pero el canal de WhatsApp funciona mal y sigue en pruebas: en la fuente queda como "pendiente de confirmación". Los botones de contacto por WhatsApp del sitio probablemente deban apagarse mientras tanto (se decide en la propuesta).
- Q: ¿El número +1 711-136-9321 es correcto? → A: Sí, por ahora. Pronto cambia a un número colombiano que atenderá el mismo chatbot: es el caso de prueba del sistema.
- Q: ¿Aforo publicable? → A: La Hospedería Duruelo (conversatorios con boleta) tiene una capacidad máxima de 300 asistentes. El de la Casa Museo (charlas abiertas) está pendiente; el titular lo averigua el 2026-10-20.
- Q: ¿Los botones de contacto por WhatsApp? → A: De acuerdo con que apunten a Instagram mientras WhatsApp siga en pruebas; se publica solo con visto bueno de ese cambio.

## Entregables y paradas

1. Diagnóstico (`diagnostico.md`). **Parada: revisión del titular.**
2. Propuesta de estructura y metodología (`plan.md` de esta feature). **Parada: aprobación del titular.**
3. Implementación por partes, en commits pequeños, de mayor a menor riesgo, verificando sitio y campañas en cada paso.
4. Nota corta para la plantilla de repo de evento de `prompt-skill-init-new-event.md`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 · Un dato cambia en un lugar y llega a todas las piezas del repo (Priority: P1)

El titular (o un agente) cambia un hecho del evento: un precio, la fecha de una etapa, el cargo de un panelista, el enlace de WhatsApp, las sesiones de una franja. Lo cambia en un solo lugar. El sitio, sus datos para buscadores, las plantillas de correo, las de WhatsApp, las imágenes y los textos que se generan para otras plataformas toman el valor nuevo sin que nadie los edite uno por uno.

**Why this priority**: Es el origen de los errores que ya llegaron al público: el precio de la etapa 1 cinco días en el sitio y en el marcado, el pase como "los cuatro días" en un correo, "dos conversatorios" por franja en los correos del 19 de octubre.

**Independent Test**: Cambiar en la fuente un precio o el título de una sesión en una copia de trabajo, regenerar todo y comprobar que ninguna pieza del repo conserva el valor anterior.

**Acceptance Scenarios**:

1. **Given** el precio del pase cambia en la fuente, **When** se regenera el sitio y las piezas derivadas, **Then** el sitio, el marcado de ofertas, las plantillas de correo y los textos para Pretix, el chatbot y Meta muestran el precio nuevo, y una búsqueda del precio anterior en las piezas vigentes no encuentra nada.
2. **Given** una franja cambia de sesiones en la agenda, **When** se arma una vista previa de campaña, **Then** el correo describe la franja con las sesiones y el conteo que salen de la agenda, no con texto escrito a mano.
3. **Given** un hecho que no tiene fuente hoy (definición de franja, número de conversatorios, aforo, venta en la puerta), **When** una pieza lo necesita, **Then** existe un lugar único donde está definido, o la pieza no lo afirma.

---

### User Story 2 · Antes de un envío o una publicación, lo vencido se detecta solo (Priority: P1)

Antes de enviar una campaña, publicar el sitio o pegar un texto en otra plataforma, una comprobación compara las piezas con la fuente y avisa si alguna afirma algo que la contradice (un precio que ya no existe, una etapa vencida, un nombre mal escrito). El envío o la publicación no sigue en silencio con un dato viejo.

**Why this priority**: Los envíos son irreversibles. El correo de los "cuatro días" salió dos minutos antes de su corrección.

**Independent Test**: Poner a propósito un precio viejo en una plantilla activa y correr la vista previa de la campaña: la herramienta lo señala y no deja enviar.

**Acceptance Scenarios**:

1. **Given** una plantilla activa contiene un precio que no está en la fuente, **When** se corre la vista previa, **Then** la herramienta lo reporta con el archivo y la línea, y el envío real se niega hasta corregirlo.
2. **Given** un texto del sitio describe una etapa ya vencida, **When** se compila el sitio, **Then** el texto vencido no se publica aunque cambie un interruptor de la tienda.

---

### User Story 3 · El titular sabe dónde está publicado cada dato fuera del repo (Priority: P1)

Cuando cambia un dato, el titular tiene una lista de cada lugar externo donde ese dato está publicado (tienda de Pretix, plataforma del chatbot, plantillas aprobadas en Meta, anuncios de Google, perfiles de redes, material impreso con QR), con el texto exacto que hay que pegar en cada uno. Para lo que no se puede editar (una plantilla de Meta aprobada, un impreso), la lista dice qué hacer: reemplazar, retirar o dejar.

**Why this priority**: El cambio de número de WhatsApp del 19 de octubre se arregló en el sitio en una línea, pero la lista de lugares externos salió de memoria. El cargo de Luz María Sierra, el `http://` y el precio de la etapa 1 se corrigieron en el sitio y siguieron mal afuera.

**Independent Test**: Preguntar "¿dónde está publicado el enlace de WhatsApp?" y obtener la respuesta completa desde el repo, sin depender de la memoria del titular.

**Acceptance Scenarios**:

1. **Given** cambia el enlace de WhatsApp, **When** el titular consulta el registro de copias externas, **Then** ve cada sistema donde está publicado y la fecha en que se actualizó por última vez.
2. **Given** se regenera un texto para pegar en Pretix o en el chatbot, **When** el titular lo pega, **Then** puede marcar esa copia como actualizada y el registro deja de mostrarla como pendiente.

---

### User Story 4 · Cualquiera encuentra una herramienta y sabe cómo correrla (Priority: P2)

El titular o un agente nuevo quiere generar las imágenes para compartir, las boletas, el informe al cliente o una campaña. Encuentra en un solo índice qué herramientas hay, qué leen, qué producen y el comando exacto, sin buscar en comentarios de archivos ni en documentos de features.

**Independent Test**: Un agente sin contexto previo genera la imagen de un panelista y la vista previa de una campaña solo con lo que dice el índice.

**Acceptance Scenarios**:

1. **Given** una herramienta existe en el repo, **When** se busca en el índice, **Then** aparece con su comando y lo que lee y produce.
2. **Given** una herramienta necesita un dato del evento, **When** se revisa su código, **Then** lo lee de la fuente y no lo tiene escrito a mano.

---

### User Story 5 · Un solo estado, decisiones encontrables y reglas que viajan con el repo (Priority: P2)

Un agente que retoma el trabajo encuentra en un minuto qué está hecho, qué falta y qué está bloqueado, en un solo lugar. Las decisiones del titular están en un lugar del repo y no repartidas entre specs, documentos, memoria y commits. Las reglas de trabajo del titular están versionadas en el repo. Lo que es historia está separado de lo que se usa para actuar.

**Independent Test**: Un agente nuevo, sin la memoria de Claude cargada, responde "¿qué falta antes del evento?" y "¿por qué no se usan tablas?" leyendo solo el repo.

**Acceptance Scenarios**:

1. **Given** hoy hay pendientes en cinco documentos que se contradicen, **When** termina la feature, **Then** queda un solo archivo de estado y los otros quedan archivados o eliminados.
2. **Given** un documento cita un archivo que ya no existe, **When** se revisan los documentos vigentes, **Then** no queda ninguna referencia rota.

---

### User Story 6 · La estructura se repite en el próximo evento (Priority: P3)

Para el próximo evento se copia la estructura (dónde viven los hechos, las herramientas, los textos para otras plataformas, el estado y las decisiones) y se cambian los datos, no la organización.

**Independent Test**: Describir, sin escribir código, qué archivos de hechos se llenarían para un evento ficticio y verificar que todas las piezas derivadas saldrían de ellos.

### Edge Cases

- Un hecho cambia mientras hay una campaña a medio enviar: los que faltan reciben el valor nuevo; el registro deja ver quién recibió cuál.
- Una plantilla de Meta aprobada contiene un dato que cambió: no se puede editar; el registro de copias externas la marca para reemplazo o retiro.
- Dos fuentes se contradicen (por ejemplo, el sitio y Pretix sobre el nombre de las charlas abiertas): no se elige una; se pregunta al titular y se anota la decisión.
- Un dato depende de la fecha (precio por etapa): la fuente define todas las etapas y el valor vigente se calcula, en vez de reemplazarse a mano el día del cambio.
- Una pieza histórica (investigación, dictamen legal, correo ya enviado) contiene datos viejos: se conserva como historia y no la toma ninguna comprobación de vigencia.
- Los scripts de campañas están en otro lenguaje que el sitio: igual tienen que leer la misma fuente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Cada hecho del evento (nombre, fechas, horarios, sedes, precios por etapa, ofertas, franjas, panelistas y cargos, aforo, contacto, dominio, identificadores de sistemas) MUST tener exactamente un lugar de origen en el repo.
- **FR-002**: Toda pieza del repo que muestra o usa un hecho MUST tomarlo de su origen: sitio, marcado para buscadores, scripts, plantillas de correo y de WhatsApp, generadores de imágenes, boletas y escarapelas, informes.
- **FR-003**: Los hechos que hoy solo existen como lógica o como redacción (definición de franja y sus sesiones, conteo de conversatorios, días del pase, número de panelistas) MUST quedar definidos una vez y reutilizables por cualquier pieza.
- **FR-004**: Los textos para plataformas que no leen el repo (Pretix, chatbot, Meta, Google Ads) MUST generarse desde el origen, y no editarse a mano en su copia del repo.
- **FR-005**: MUST existir un registro de copias externas: por cada sistema externo, qué hechos contiene, qué texto se pegó, cuándo se actualizó y si se puede editar.
- **FR-006**: MUST existir una comprobación que detecte hechos vencidos o contradictorios en las piezas vigentes, y que corra antes de compilar el sitio y antes de cualquier envío real de campaña.
- **FR-007**: El sitio MUST separar la redacción (microcopy) de los hechos: ningún texto de interfaz contiene una fecha, un precio, un conteo o un nombre propio del evento escrito a mano.
- **FR-008**: Los textos que describen estados del pasado (etapas vencidas) MUST NOT poder publicarse por un cambio de interruptor.
- **FR-009**: MUST existir un índice único de herramientas con su comando, lo que leen y lo que producen.
- **FR-010**: MUST existir un solo archivo de estado del evento; los demás archivos de estado y pendientes quedan archivados.
- **FR-011**: Las reglas de trabajo del titular que hoy están solo en la memoria de Claude MUST quedar versionadas en el repo (las que aplican al servicio, separadas de las que son solo de Testigos).
- **FR-012**: Los documentos MUST quedar separados entre los que se usan para actuar y los que son historia, y ningún documento vigente MUST citar archivos que no existen.
- **FR-013**: Ningún cambio MUST alterar rutas, metadatos, marcado para buscadores, medición, la tienda ni el comportamiento de las campañas; cada paso se verifica con la compilación del sitio, su comprobación de tipos, la lista y la vista previa de cada campaña.
- **FR-014**: Ningún archivo de credenciales ni de datos personales MUST abrirse, citarse ni moverse al repo.
- **FR-015**: Cuando dos fuentes se contradigan, la feature MUST preguntar al titular y anotar la decisión, no elegir.

### Key Entities

- **Hecho del evento**: un dato verificable con un solo valor vigente (o un valor por etapa). Tiene un origen y uno o más consumidores.
- **Consumidor**: una pieza que usa hechos. Puede leer el repo (sitio, scripts, generadores) o recibir texto pegado a mano (Pretix, chatbot, Meta, Google Ads, perfiles, impresos).
- **Copia externa**: un texto publicado en un sistema que el repo no puede leer, con su fecha de actualización y si es editable.
- **Herramienta**: un script o generador con un comando, unas entradas y unas salidas.
- **Documento**: con un tipo (decisión, estado, guía para el titular, prompt para otro repo, investigación, texto para otra plataforma, referencia viva, historia) y un estado (vigente o historia).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Cambiar el precio del pase, el enlace de WhatsApp o el cargo de un panelista toca un solo archivo editado a mano; el resto se regenera.
- **SC-002**: Una búsqueda de cualquier hecho vencido conocido (310.000, "dos conversatorios", "cuatro días" referido al pase, etapas del 4 y 5 de octubre) en las piezas vigentes da cero resultados.
- **SC-003**: La comprobación de vigencia detecta el 100 % de los casos sembrados a propósito en una prueba (precio viejo, nombre mal escrito, etapa vencida) antes del envío o la publicación.
- **SC-004**: Ante "¿dónde está publicado X fuera del repo?", el titular obtiene la lista completa en menos de un minuto desde el repo.
- **SC-005**: Un agente nuevo, sin la memoria de Claude, encuentra el comando de cualquier herramienta y el estado del evento en menos de cinco minutos.
- **SC-006**: Queda un solo archivo de estado y cero referencias rotas en los documentos vigentes.
- **SC-007**: El sitio publicado no cambia en rutas, metadatos ni marcado (comparación de la compilación antes y después), y las campañas producen la misma lista y vistas previas equivalentes salvo los textos corregidos a propósito.
- **SC-008**: Para el próximo evento, la lista de archivos de hechos que hay que llenar cabe en una página.

## Assumptions

- Se trabaja en `main` con commits locales pequeños, como en las features anteriores; el push lo autoriza el titular cambio por cambio.
- Las piezas históricas (investigaciones, dictámenes, correos ya enviados, specs cerradas) no se reescriben: se archivan o se marcan como historia.
- Los textos de plataformas externas se siguen pegando a mano; la feature no integra Pretix, el chatbot ni Meta por API, salvo que el titular lo pida en la propuesta.
- `.specify/` no tiene plantillas ni scripts desde el 2026-08-26; esta spec sigue la forma de `specs/003`.
- El evento es en 17 días: la implementación empieza por lo que puede llegar al público antes del 5 de noviembre.

## Dependencies

- Titular: respuestas a las contradicciones de datos listadas en `diagnostico.md`, sección "Preguntas al titular", antes de corregir cualquier pieza afectada.
- Titular: acceso a los sistemas externos para levantar el registro de copias (qué está pegado hoy en Pretix, el chatbot, Meta y Google Ads).

## Out of Scope

- Enviar mensajes de cualquier campaña.
- Cambiar textos legales vigentes o `DATA_POLICY_EFFECTIVE`.
- Rediseñar el sitio o su copy comercial.
- Construir la plantilla de repo para otros eventos; aquí solo se deja la nota del entregable 4.
