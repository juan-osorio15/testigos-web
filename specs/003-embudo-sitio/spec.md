# Feature Specification: Embudo de venta por campaña · parte del sitio

**Feature Branch**: `003-embudo-sitio` (se trabaja en `main` con commits locales; ningún push sin visto bueno del titular)

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "Lee docs/medicion-embudo/prompt-sitio.md y haz lo que dice." El prompt pide la parte del sitio del embudo de venta por campaña, con Spec Kit hasta analyze.

## Para qué

El titular quiere un informe que le sirva para decidir, repetible en los próximos eventos: de dónde viene el tráfico, qué campañas y qué piezas terminan en ventas y a qué costo, en qué paso se pierde la gente (visita, clic hacia las boletas, "Comprar", datos llenos sin pagar, pago) y a quién se le puede volver a hablar. Al sitio le toca que los pasos 1 a 3 se midan bien y que cada pedido llegue a Pretix con la campaña de la visita.

Regla de esta feature (de `diseno.md`): una decisión de detalle que no cambia ese informe ni el retargeting se toma por la opción más conservadora con los datos personales, se anota en `diseno.md` y no se le pregunta al titular.

## Fuente de verdad

Esta spec cubre solo lo que cambia en este repo. El contexto (objetivos, flujo de datos, plugin de Pretix, backend, condición legal) está en documentos que no se copian aquí:

- `docs/medicion-embudo/diseno.md`, sobre todo "La meta del titular: un informe para decidir" (el porqué de todo esto y la regla para decisiones de detalle) y "Parte del sitio (este repo)". Si algo del diseño cambia, se cambia primero ahí y después en esta spec.
- `docs/revision-legal-2026-10-06-embudo.md`, sección C (texto exacto de la política y los términos) y la nota inicial sobre el teléfono.
- `docs/medicion-embudo/prompt-pretix.md`, contrato de `widget_data`: el plugin toma las claves que empiezan por `tracking-`, les quita el prefijo y cambia guiones por guion bajo.
- `specs/002-seo-medicion-visibilidad/contracts/measurement-events.md`, contrato de eventos de navegador que esta feature modifica.
- `docs/medicion-embudo/prompt-sitio.md`, sección "Hechos verificados que el diseño no dice", sobre cómo el widget construido lee los atributos.

## Clarifications

### Session 2026-10-08

- Q: El teléfono es obligatorio en la tienda, pero el dictamen dice "y, si lo indica, el teléfono" (términos) y "solo si el comprador suministra su número" (política, sección 3). ¿Cómo quedan? → A: Se ajustan ambos al teléfono obligatorio: términos "y el teléfono"; política, sección 3, WhatsApp para las finalidades b) y h) sin el condicional. La casilla A de Pretix no cambia (decisión del 2026-10-06).
- Q: Sin parámetros de campaña, ¿se guarda y se manda la página de llegada? → A: Sí. La primera página de la pestaña se guarda aunque no haya campaña, para ver por dónde entraron los pedidos orgánicos. Cambio registrado primero en `diseno.md`.
- Q: ¿Cuántas veces se manda `view_item_list`/`ViewContent` si hay varios clics hacia `#boletas` en la misma página? → A: Una vez por página, como `begin_checkout`. Registrado también en `diseno.md`.
- Q: ¿El `gclid` viaja aunque la persona no acepte cookies? → A: No, solo con el aviso aceptado, como los identificadores de Meta. Testigos no pauta en Google Ads y las ventas por campaña salen de las UTM, así que no le suma nada al informe. Ya está en `diseno.md` ("La meta del titular").
- Nota sin pregunta (para la guía de informes): desde el día de la publicación, `begin_checkout` deja de contar clics en los CTA y pasa a contar "Comprar" en el widget. Los informes de GA4 antes y después de esa fecha no son comparables en ese paso. Anotado en `diseno.md`, sección "Informes y públicos".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cada pedido llega a Pretix con la campaña de la visita (Priority: P1)

Una persona entra al sitio desde un anuncio o un enlace con parámetros de campaña, recorre una o varias páginas y compra en el widget. El pedido que se crea en Pretix lleva la campaña de esa visita, aunque la persona no haya aceptado las cookies. Así el informe "Ventas por campaña" de Pretix y el del backend de Eventalist dejan de poner todo en "sin campaña".

**Why this priority**: Sin esto el plugin de Pretix y el backend funcionan pero no atribuyen nada. Es la pieza que falta en el embudo de los tres repos y la que el ensayo conjunto necesita comprobar.

**Independent Test**: Sitio local apuntando a `testigos-sandbox`, entrada con `?utm_source=prueba&utm_campaign=ensayo&fbclid=TEST123`, sin aceptar cookies. El campo `widget_data` del formulario del widget trae las UTM presentes y la página de llegada, y nada más del embudo.

**Acceptance Scenarios**:

1. **Given** una visita que llega con `utm_source=prueba&utm_campaign=ensayo` y no acepta cookies, **When** abre la sección de boletas, **Then** `widget_data` contiene `tracking-utm-source: "prueba"`, `tracking-utm-campaign: "ensayo"` y `tracking-landing` con la ruta de llegada, y ninguna clave de `gclid`, de identificadores de la visita ni de consentimiento.
2. **Given** esa misma visita, **When** navega a otra página del sitio y vuelve a la portada en la misma pestaña, **Then** `widget_data` conserva la campaña y la página de llegada originales.
3. **Given** una pestaña que ya tiene campaña guardada, **When** la persona entra por un enlace con otra campaña, **Then** se guarda la campaña nueva con su propia página de llegada (gana la última campaña de la pestaña).
4. **Given** una pestaña nueva sin parámetros de campaña, **When** la persona abre el widget, **Then** no aparece ninguna clave de campaña vacía y `tracking-landing` trae la primera página de la pestaña.
5. **Given** la URL trae un parámetro de campaña vacío (`utm_content=`), **When** se construyen los atributos, **Then** ese atributo no aparece.

---

### User Story 2 - Con cookies aceptadas, el pedido se liga a la visita en GA4 y Meta (Priority: P1)

Quien aceptó el aviso de cookies compra, y su pedido lleva además los identificadores de la visita (GA4 y Meta) y la marca de consentimiento. El plugin los usa para que la compra que confirma Pretix se una a la sesión de GA4 y al navegador en Meta, y para el público de retargeting.

**Why this priority**: Es lo que permite que GA4 muestre el embudo completo hasta `purchase` por campaña y que Meta arme "confirmó y no pagó". Comparte prioridad con la historia 1 porque se prueban juntas en el mismo ensayo.

**Independent Test**: Misma entrada de la historia 1, aceptando cookies. Tras unos segundos, `widget_data` trae además `tracking-ga-id`, `tracking-ga-sessid`, `tracking-fbp`, `tracking-fbc` y `tracking-consent: "1"`. Al revocar desde "Cookies y preferencias", esas claves dejan de tener valor.

**Acceptance Scenarios**:

1. **Given** una visita con `fbclid=TEST123` que acepta cookies, **When** pulsa "Comprar" en el widget, **Then** el formulario enviado lleva `tracking-ga-id`, `tracking-ga-sessid`, `tracking-fbp` y `tracking-consent: "1"`, y `tracking-fbc` con el formato oficial de Meta construido a partir de `TEST123` si el navegador no tenía ya la cookie `_fbc`.
2. **Given** la persona aceptó cookies hace un instante y los identificadores todavía no existen, **When** interactúa con el widget (toca o enfoca un elemento) y pulsa "Comprar", **Then** el envío ya lleva los identificadores que existan en ese momento, sin retrasar la compra.
3. **Given** una visita con cookies aceptadas, **When** revoca la aceptación desde el pie de página, **Then** `widget_data` deja de llevar valores en `tracking-ga-id`, `tracking-ga-sessid`, `tracking-fbp`, `tracking-fbc` y `tracking-consent`, y la campaña se mantiene.
4. **Given** GA4 o el píxel bloqueados por el navegador, **When** la persona acepta y compra, **Then** el widget funciona igual, sin errores en la consola, y solo viajan los identificadores que se pudieron leer.
5. **Given** la persona aceptó cookies en una visita anterior (aceptación vigente), **When** vuelve en una pestaña nueva, **Then** los identificadores se ponen sin que tenga que aceptar de nuevo.

---

### User Story 3 - GA4 y Meta separan "vio las boletas" de "pulsó Comprar" (Priority: P1)

El organizador quiere ver en GA4 el embudo visita → `view_item_list` → `begin_checkout` → `add_payment_info` → `purchase`. Hoy `begin_checkout` cuenta clics hacia la sección de boletas, que no son intención de compra.

**Why this priority**: Sin la separación, el paso 3 del embudo del diseño ("pulsó Comprar en el widget") no se puede medir, y los públicos de Meta mezclan curiosos con compradores.

**Independent Test**: En la pestaña Red, un clic en un CTA hacia `#boletas` produce `view_item_list` (GA4) y `ViewContent` (Meta) y ningún `begin_checkout`; pulsar "Comprar" en el widget produce un solo `begin_checkout` y un solo `InitiateCheckout`.

**Acceptance Scenarios**:

1. **Given** una página con el widget, **When** la persona hace clic en cualquier CTA hacia `#boletas` (cabecera, hero, panelistas, agenda, cierre), **Then** se envía `view_item_list` con `item_list_name: 'boletas'` a GA4 y `ViewContent` a Meta, solo en el primer clic de la página.
2. **Given** la persona elige boletas en el widget, **When** pulsa "Comprar", **Then** se envían `begin_checkout` e `InitiateCheckout` con el mismo identificador de evento, una sola vez por página aunque pulse varias veces.
3. **Given** la tienda no está activa y el contenedor de boletas muestra el formulario de interesados o el modal "avísame", **When** la persona envía uno de esos formularios, **Then** no se envía `begin_checkout`.
4. **Given** el píxel no cargó (sin aceptación), **When** ocurre cualquiera de los eventos anteriores, **Then** GA4 recibe su evento en modo sin cookies y no hay errores.

---

### User Story 4 - La política y los términos dicen lo que el embudo hace (Priority: P1)

Antes de que el titular cambie la casilla en Pretix y fije `consent_since`, la política de tratamiento de datos y los términos publicados deben describir el envío de datos de pedidos a Google y Meta, los mensajes comerciales y el registro de la campaña, con el texto del dictamen.

**Why this priority**: Es la condición legal de T0. Sin estos textos publicados no se puede activar el plugin en producción.

**Independent Test**: Leer las dos páginas compiladas y comprobar, frase por frase, que cada cambio de la sección C del dictamen está, con las nuevas fechas de vigencia, y que no queda la frase "Los datos de la compra de boletas no se transmiten a estos proveedores" ni "salvo que el titular lo autorice por separado".

**Acceptance Scenarios**:

1. **Given** la política compilada, **When** se compara con la sección C del dictamen, **Then** están todos sus cambios, la sección 10 enumera además la dirección IP y el tipo de navegador, y "[fecha de publicación]" queda con la fecha de vigencia de la política.
2. **Given** los términos compilados, **When** se lee la sección 12, **Then** sus dos primeros párrafos son los del dictamen, con "y el teléfono" en lugar de "y, si lo indica, el teléfono".
3. **Given** `docs/pretix-tienda-textos.md`, **When** el titular lo usa para configurar la tienda, **Then** encuentra la casilla A del dictamen, el texto de ayuda del teléfono de la nota inicial y la fecha de cada cambio.
4. **Given** los comentarios de cabecera de los archivos de medición y de las páginas legales, **When** se leen, **Then** ninguno afirma que el envío a Google y Meta "se retiró".

---

### User Story 5 - Probar el sitio contra el evento de prueba sin tocar la configuración (Priority: P2)

El equipo levanta el sitio en local apuntando al evento `testigos-sandbox` para el ensayo, sin editar la configuración del repo ni arriesgar que esa URL se publique.

**Why this priority**: Habilita las pruebas de las historias 1 a 3 y el ensayo conjunto. No tiene valor por sí sola para el visitante.

**Independent Test**: Con la variable `PUBLIC_PRETIX_EVENT_URL=https://pretix.eventalist.co/eventalist/testigos-sandbox/` el widget local muestra el evento de prueba; sin la variable, la compilación apunta a `testigos-memoria`.

**Acceptance Scenarios**:

1. **Given** la variable definida en local, **When** se abre el sitio, **Then** el widget, su hoja de estilos y su script salen del evento `testigos-sandbox`.
2. **Given** la variable sin definir, **When** se compila el sitio para publicar, **Then** todas las URL de la tienda son las de `testigos-memoria`, igual que hoy.

---

### Edge Cases

- El script del widget carga `async`: puede construirse antes o después del script del sitio. Los atributos se escriben en el elemento que exista en ese momento (`<pretix-widget>` antes de construirse, `div.pretix-widget-wrapper` después) y se vuelven a sincronizar al construirse.
- Quitar un atributo deja la clave con valor `null` en `widget_data`. `pretix-wompi` confirmó (2026-10-08) que el plugin trata el `null` de JSON, los valores vacíos y los de solo espacios como ausentes. En cambio, las cadenas "null" o "undefined" sí las guarda y las envía: el sitio nunca debe escribirlas (FR-005).
- El atributo de consentimiento nunca se llama `data-consent`: esa clave la reserva Pretix para su propio aviso.
- `sessionStorage` no disponible (navegación privada estricta, bloqueo): la campaña se toma solo de la URL de la página actual; nada falla.
- Parámetros de campaña muy largos o con caracteres raros: se pasan tal cual, recortados a 200 caracteres, sin romper el widget.
- La persona abre la tienda en otra pestaña desde el widget (envío nativo con `target="_blank"`): el evento `begin_checkout` se registra en la pestaña del sitio antes de que se abra la otra.
- La página en inglés (`/en/`) tiene el mismo widget y se comporta igual. Las páginas legales existen solo en español.
- La página de llegada no incluye la cadena de consulta: los parámetros ya viajan en sus propias claves y así no se duplican identificadores de clic.
- Pedidos de quien entra directo a la tienda de Pretix (sin pasar por el sitio): no traen nada, y es lo esperado.

## Requirements *(mandatory)*

### Functional Requirements

Captura de campaña:

- **FR-001**: En cada carga de página, el sitio MUST leer de la URL `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid` y `fbclid`. Si hay al menos uno con valor, MUST guardarlos en `sessionStorage['tdm.attribution']` junto con la ruta de llegada, reemplazando lo anterior; si no hay ninguno, MUST conservar lo guardado en la pestaña, y si la pestaña no tiene nada guardado MUST guardar solo la ruta de llegada (visitas sin campaña).
- **FR-002**: La campaña MUST vivir solo en `sessionStorage` de la pestaña. El sitio MUST NOT usar `localStorage` ni cookies para la campaña.
- **FR-003**: La ruta de llegada MUST ser la ruta de la página (sin cadena de consulta ni fragmento).

Atributos del widget:

- **FR-004**: El widget MUST recibir los atributos de la lista de `diseno.md` ("Atributos del widget"), con esos nombres exactos, y ningún otro atributo `data-tracking-*`.
- **FR-005**: Un atributo MUST escribirse solo si su valor es texto que no queda vacío después de quitar espacios; un dato ausente se omite. Nunca MUST aparecer como valor la cadena "null" ni "undefined" (el plugin las enviaría como datos reales).
- **FR-006**: Sin aceptación de cookies vigente, el widget MUST llevar solo las UTM presentes y `tracking-landing`. MUST NOT llevar `gclid`, `ga-id`, `ga-sessid`, `fbp`, `fbc` ni `consent`.
- **FR-007**: Con aceptación vigente, el widget MUST llevar además `tracking-consent="1"`, `tracking-gclid` si la pestaña lo tiene, y los identificadores de la visita que existan: client_id y session_id de GA4 (consulta asíncrona con tope de 2 s) y las cookies `_fbp` y `_fbc`. Si hay `fbclid` y no hay `_fbc`, `fbc` MUST construirse con el formato oficial de Meta `fb.1.<ms>.<fbclid>`.
- **FR-008**: Los atributos MUST escribirse en `<pretix-widget>` si el widget aún no se construyó, o en `div.pretix-widget-wrapper` si ya se construyó, y MUST volver a sincronizarse: al construirse el widget, al aceptar o revocar cookies, al responder GA4 y en cada interacción con el widget (`pointerdown` o `focusin`), lo que asegura una sincronización antes de "Comprar"; solo se toca el DOM si algo cambió.
- **FR-009**: Al revocar la aceptación, MUST quitarse los atributos `gclid`, de identificadores y de consentimiento; las UTM y la página de llegada MUST mantenerse.
- **FR-010**: El widget MUST seguir con `disable-iframe` y su comportamiento MUST NOT cambiar ni retrasarse. Todo el código nuevo MUST correr en `try/catch`, sin errores ni avisos en la consola.

Eventos de navegador:

- **FR-011**: Un clic en un enlace a `#boletas` MUST enviar `view_item_list` a GA4 con `item_list_name: 'boletas'` y `ViewContent` a Meta, una vez por página, y MUST NOT enviar `begin_checkout`.
- **FR-012**: El envío del formulario de compra dentro de `.pretix-widget-wrapper` MUST enviar `begin_checkout` a GA4 e `InitiateCheckout` a Meta con el mismo identificador de evento, una vez por página. Los formularios de interesados y del modal "avísame" MUST NOT dispararlo.
- **FR-013**: El contrato `specs/002-seo-medicion-visibilidad/contracts/measurement-events.md` MUST quedar actualizado o con una nota que remita a esta feature, de modo que no queden dos contratos contradictorios vigentes.

Textos legales:

- **FR-014**: `src/pages/tratamiento-de-datos.astro` MUST incluir todos los cambios de la política de la sección C del dictamen, con la IP y el tipo de navegador en la enumeración de la sección 10, "[fecha de publicación]" reemplazada por la fecha de vigencia nueva y, en el párrafo final de la sección 3, WhatsApp para las finalidades b) y h) sin el condicional "solo si el comprador suministra su número" (el teléfono es obligatorio).
- **FR-015**: `src/pages/terminos-y-condiciones.astro`, sección 12, MUST llevar los dos párrafos del dictamen, con "y el teléfono" en lugar de "y, si lo indica, el teléfono".
- **FR-016**: `DATA_POLICY_EFFECTIVE` y `TERMS_EFFECTIVE` MUST actualizarse a la fecha de publicación que decida el titular, y los comentarios de cabecera que dicen que el envío a Google y Meta "se retiró" MUST corregirse.
- **FR-017**: `docs/pretix-tienda-textos.md` MUST traer la casilla A del dictamen, el texto de ayuda del teléfono de la nota inicial (sin "Opcional") y la fecha de cada cambio.
- **FR-018**: Cada cambio de texto legal MUST ir en un commit propio, sin reescribir historial.
- **FR-019**: Los textos visibles MUST estar en español, sin " — ", y las páginas legales MUST conservar su estilo sobrio.

Pruebas y publicación:

- **FR-020**: La URL del evento de Pretix MUST poder tomarse de `PUBLIC_PRETIX_EVENT_URL` en local, con `https://pretix.eventalist.co/eventalist/testigos-memoria/` por defecto.
- **FR-021**: `npm run check` y `npm run build` MUST pasar sin errores.
- **FR-022**: Ningún push ni despliegue sin visto bueno del titular para ese cambio. El plan MUST proponer el orden de publicación sin fijar fechas.

### Key Entities

- **Campaña de la pestaña** (`tdm.attribution`): UTM presentes, `gclid`, `fbclid`, ruta de llegada y hora de captura. Vive en `sessionStorage`.
- **Identificadores de la visita**: `gclid` (guardado con la campaña, pero solo se entrega con aceptación), client_id y session_id de GA4, `_fbp`, `_fbc`. Solo con aceptación vigente; no se guardan en ningún almacenamiento propio, se leen cuando hacen falta.
- **Atributos `data-tracking-*`**: la proyección de las dos anteriores sobre el widget, según el contrato de `prompt-pretix.md`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En el ensayo con `testigos-sandbox`, el 100 % de los pedidos de prueba hechos desde el sitio con parámetros de campaña muestran esa campaña en el recuadro "Origen" del pedido en Pretix.
- **SC-002**: Sin aceptar cookies, `widget_data` no contiene ningún identificador de la visita ni la marca de consentimiento en ninguno de los recorridos del ensayo.
- **SC-003**: Con cookies aceptadas, los identificadores de GA4 y Meta aparecen en `widget_data` antes de pulsar "Comprar" en todos los recorridos del ensayo en los que el navegador los tiene.
- **SC-004**: En el ensayo, cada clic en "Comprar" produce exactamente un `begin_checkout` por página y ningún clic en un CTA lo produce.
- **SC-005**: El tiempo hasta que el widget es usable y el comportamiento de "Comprar" no cambian frente a la versión publicada (mismo recorrido, sin esperas nuevas).
- **SC-006**: Cero errores nuevos en la consola en todas las páginas, con y sin aceptación, y con GA4 y el píxel bloqueados.
- **SC-007**: Tras publicar, una persona del equipo llega a la pantalla de pago de Wompi en producción sin pagar y ve la campaña en `widget_data`.
- **SC-008**: Las páginas legales publicadas contienen el 100 % de los cambios de la sección C del dictamen antes de que se fije `consent_since`.

## Assumptions

- Decisiones de detalle tomadas por la regla del diseño y anotadas en `diseno.md`: gana la última campaña de la pestaña (FR-001); la página de llegada va sin cadena de consulta (FR-003); cada valor se recorta a 200 caracteres. Entre pestañas o visitas no se conserva nada, como exige el dictamen §D.7 para el almacenamiento entre visitas sin aceptación.
- El aviso de cookies y su versión (`consentVersion`) no cambian: el dictamen no los toca y los datos del pedido se autorizan en la casilla de la tienda.
- El `value` de `begin_checkout` sigue la regla de 002: solo si se conoce, nunca inventado.
- Pretix guarda `widget_data` con `disable-iframe` (verificado en 002 y por `pretix-wompi`); llega a la tienda por la URL.
- Sin corredor de pruebas nuevo: la prueba es en el navegador contra `testigos-sandbox`, con capturas. La compra completa con la tarjeta 4242 se hace en el ensayo conjunto con el plugin desplegado.
- Nunca se pone en modo prueba `testigos-memoria`.

## Dependencies

- `pretix-wompi`: plugin desplegado para el ensayo conjunto. La pregunta de los valores `null` quedó resuelta el 2026-10-08.
- Titular: fecha de publicación de política y términos (después la casilla y `consent_since`).

## Out of Scope

- El plugin de Pretix, el backend y la configuración de GA4, Meta y Pretix.
- La guía de informes y públicos (`docs/medicion-embudo/guia-informes-y-publicos.md`), entregable posterior. Desde esta feature se anota para ella que `begin_checkout` cambia de significado el día de la publicación.
- Captura de datos antes de confirmar el pedido (versión futura, `estado.md`).
- Páginas legales del sitio en inglés. La casilla de la tienda sí va en inglés si la tienda se ofrece en ese idioma (dictamen §A).
