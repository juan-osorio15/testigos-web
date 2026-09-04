# Revisión legal: política de tratamiento de datos y formulario de Testigos de la Memoria

Cliente: Eventalist. Fecha: 4 de septiembre de 2026. Archivos revisados (todos leídos completos):
`src/pages/tratamiento-de-datos.astro`, `src/ui.ts`, `src/components/TicketSection.astro`, `src/config.ts`, `docs/tratamiento-de-datos.md`.

## Veredicto

**Publicable con cambios menores.** El contenido mínimo del art. 13 del Decreto 1377 de 2013 está cubierto en los seis numerales. Hay una afirmación de hecho que el sistema no respalda (la "versión del texto aceptado"), un compromiso operativo que probablemente no se hace (la verificación de garantías de los proveedores fuera de Colombia), una finalidad que conviene cerrar ("otros eventos en Villa de Leyva") y un margen claro para reducir exposición del responsable sin dejar de cumplir. Ninguno impide publicar hoy si se aplican los cambios de gravedad alta y media de la tabla.

## 1. Contenido mínimo del art. 13 del Decreto 1377 (verificado en el texto literal del decreto)

| Numeral | Exige | Estado | Dónde |
|---|---|---|---|
| 1 | Nombre o razón social, domicilio, dirección, correo electrónico y teléfono del responsable | Cumple | Colofón (`tratamiento-de-datos.astro` líneas 187 a 191), con los cinco datos |
| 2 | Tratamiento y finalidad | Cumple, con una finalidad que conviene precisar | Sección 3 |
| 3 | Derechos del titular | Cumple (los seis literales del art. 8 de la Ley 1581) | Sección 7 |
| 4 | Persona o área responsable de la atención de peticiones, consultas y reclamos | Cumple parcialmente: dice "el responsable atiende" pero no designa una persona o área (el art. 23 del Dec. 1377 exige designarla) | Sección 8, primer párrafo |
| 5 | Procedimiento para conocer, actualizar, rectificar, suprimir y revocar | Cumple (plazos de los arts. 14 y 15 de la Ley 1581 transcritos correctamente) | Sección 8 |
| 6 | Fecha de entrada en vigencia y período de vigencia de la base de datos | Cumple | Cabecera y sección 10 |
| Párrafo final | Comunicar cambios sustanciales antes de aplicarlos | Cumple | Sección 10 |

Conexos: art. 18 del Dec. 1377 (procedimientos incluidos en la política): cumple. Art. 15 del Dec. 1377 (aviso de privacidad, que aquí es el texto de la casilla): cumple en responsable, datos, finalidad y acceso a la política; **falta la mención a los derechos del titular** (numeral 3 del art. 15), que hoy solo se cubre por el enlace.

### Sobre la identificación del responsable (la pregunta central)

Lo que hay hoy (persona natural, dirección, correo y teléfono en una nota final en letra pequeña) **cumple el numeral 1 del art. 13**. La norma exige los cinco datos y no exige resaltarlos, ni repetirlos, ni ubicarlos al inicio. La ubicación al final, en cuerpo pequeño, es lícita.

Formas más estratégicas de cumplir sin incumplir, en orden de preferencia:

1. **Identificar a la persona jurídica, si existe.** Si Eventalist opera a través de una sociedad (S.A.S. u otra), el responsable debe ser la sociedad, con su razón social y su domicilio social. No hace falta el NIT. Eso saca el nombre de Juan Andrés Osorio de la página. No pude verificar si la sociedad existe: el sitio eventalist.co no publica razón social, ni términos, ni política (las rutas /terminos, /privacidad, /terms y /politica-de-tratamiento-de-datos devuelven 404), y en el repositorio no hay ninguna mención a sociedad o NIT. Hay que confirmarlo con el certificado de existencia y representación legal. **Si no existe sociedad, el nombre de la persona natural es obligatorio** y no hay forma lícita de omitirlo: "Eventalist" a secas es un nombre comercial, no un "nombre o razón social".
2. **Dirección: una dirección de notificación comercial, no la residencia.** La norma dice "dirección", no "dirección de residencia". Sirve la dirección registrada en la Cámara de Comercio (que además ya es pública en el RUES), una oficina virtual o un coworking donde se reciba correspondencia. Si Calle 111 # 45A-70 es el domicilio personal, conviene sustituirla por una dirección comercial de notificación. Si es la dirección registrada mercantilmente, déjela.
3. **Teléfono: obligatorio, pero solo como dato de identificación.** El art. 13 lo exige y el art. 12 literal d) de la Ley 1581 también lo exige al momento de pedir la autorización. Lo que sí se puede hacer, y es la palanca estratégica real, es **declarar el correo electrónico como único canal habilitado para consultas, reclamos y ejercicio de derechos**. El art. 14 de la Ley 1581 dice que la consulta "se formulará por el medio habilitado por el Responsable": el responsable escoge el medio. Así el teléfono aparece una sola vez, como identificación, y ningún trámite pasa por él.
4. **Designar un área, no una persona, para la atención de peticiones** (numerales 4 del art. 13 y art. 23 del Dec. 1377): "el área de protección de datos de Eventalist". Cumple la designación sin exponer un nombre adicional.

Lo que no se puede hacer: omitir el teléfono, omitir la dirección, poner solo "Eventalist" sin nombre o razón social, o remitir a "contáctenos por el formulario" sin correo. Cualquiera de esas cuatro es un incumplimiento literal del numeral 1.

## 2. Casilla de autorización (`TicketSection.astro` líneas 94 a 105; `ui.ts` líneas 38 a 42)

| Requisito | Estado |
|---|---|
| Desmarcada por defecto | Cumple (`<input type="checkbox" ... required />` sin `checked`; el script además verifica `consent.checked` y envía el estado real, líneas 150 a 161) |
| Casilla propia, separada de otros campos | Cumple |
| Identifica al responsable | Cumple ("Autorizo a Eventalist"); la política cierra el puente en el colofón ("se entiende otorgada a este responsable") |
| Datos recogidos | Cumple (nombre, correo y teléfono) |
| Finalidad | Cumple, pero "otros eventos en Villa de Leyva" es abierta (ver hallazgo 3) |
| Canales (art. 2 de la Ley 2300) | Cumple: nombra correo electrónico y WhatsApp. Una sola casilla para dos canales es lícita (el titular autoriza ambos al marcarla); la SIC recomienda en su cartilla selección separada por finalidad, pero no es una exigencia legal verificada |
| Cómo revocar | Cumple (correo indicado) |
| Enlace a la política | Cumple (abre en pestaña nueva) |
| Derechos del titular (art. 15 num. 3 del Dec. 1377; art. 12 lit. c de la Ley 1581) | **Falta** una mención expresa; hoy depende del enlace |
| Teléfono del responsable (art. 12 lit. d de la Ley 1581) | Solo por el enlace a la política. Riesgo bajo: la práctica aceptada es aviso corto más enlace, y el art. 14 del Dec. 1377 permite el aviso cuando la política está accesible |
| Mayoría de edad | No se pide. No es obligatorio, pero es la prueba más barata frente al art. 7 de la Ley 1581 |
| Prueba (art. 8 del Dec. 1377, art. 9 de la Ley 1581) | El backend guarda fecha y método del consentimiento según la guía de Eventalist; el sitio no envía versión del texto (payload líneas 155 a 163) |

## 3. Tabla de hallazgos

Gravedad: alta = corregir antes de publicar; media = corregir en esta misma edición; baja = opcional.

| # | Ubicación | Riesgo | Gravedad | Qué dice hoy | Redacción propuesta (lista para pegar) |
|---|---|---|---|---|---|
| 1 | `tratamiento-de-datos.astro`, sección 5, líneas 103 a 105 | Exposición: afirmación de hecho no respaldada. El formulario no envía ninguna versión del texto y la guía del backend habla de fecha y método, no de versión | Alta | "El responsable conserva prueba de la autorización (fecha y hora del registro y versión del texto aceptado)." | "El responsable conserva prueba de la autorización (fecha y hora del registro y medio por el que se otorgó) y del texto del aviso vigente en cada momento." (La segunda parte se sostiene con el historial del repositorio; ver obligaciones operativas.) |
| 2 | `tratamiento-de-datos.astro`, sección 4, líneas 92 a 94 | Exposición: asume un procedimiento de verificación que no existe. Además confunde régimen: la transmisión a un encargado en el exterior se rige por el art. 24 num. 2 y el art. 25 del Dec. 1377 (basta contrato), no requiere informar ni verificar nada ante el titular; y Estados Unidos, donde se aloja el backend (Railway), figura en la lista de países con nivel adecuado de la Circular Externa 005 de 2017 de la SIC | Alta | "Cuando alguno de ellos aloja la información fuera de Colombia, el responsable verifica que ofrezca garantías adecuadas de seguridad y confidencialidad." | "Algunos de esos proveedores pueden alojar la información en servidores ubicados fuera de Colombia. En tal caso la transmisión se realiza conforme al artículo 26 de la Ley 1581 de 2012, a los artículos 24 y 25 del Decreto 1377 de 2013 y a los estándares fijados por la Superintendencia de Industria y Comercio." |
| 3 | `tratamiento-de-datos.astro`, sección 3, literal c (línea 75) y párrafo introductorio (línea 40); `ui.ts` `waitlist.consent1` | Cumplimiento: el art. 5 del Dec. 1377 exige "todas las finalidades específicas". "Otros eventos en Villa de Leyva" no dice de quién ni de qué tipo | Media | Política: "Informar sobre futuras ediciones y otros eventos en Villa de Leyva." Casilla: "...información sobre este evento y otros eventos en Villa de Leyva..." | Política, literal c: "Informar sobre futuras ediciones del encuentro y sobre otros eventos culturales en Villa de Leyva cuya comunicación o boletería gestione Eventalist." Párrafo introductorio: "...para recibir información del encuentro, de sus futuras ediciones y de otros eventos culturales en Villa de Leyva gestionados por Eventalist." Casilla: "...para enviarme información sobre este encuentro, sus futuras ediciones y otros eventos culturales en Villa de Leyva gestionados por Eventalist, por correo electrónico y WhatsApp." |
| 4 | `ui.ts` `waitlist.consent1` (línea 39) | Cumplimiento: el aviso no menciona los derechos del titular (art. 15 num. 3 del Dec. 1377). Tampoco pide mayoría de edad | Media | "Puedo retirar esta autorización en cualquier momento escribiendo a" | Texto completo sugerido para `waitlist.consent1`: "Declaro ser mayor de edad y autorizo a Eventalist a tratar mis datos personales (nombre, correo electrónico y número de teléfono) para enviarme información sobre este encuentro, sus futuras ediciones y otros eventos culturales en Villa de Leyva gestionados por Eventalist, por correo electrónico y WhatsApp. Puedo conocer, actualizar, rectificar y suprimir mis datos y retirar esta autorización en cualquier momento escribiendo a" (el componente añade el correo, el punto y "He leído la política de tratamiento de datos"). |
| 5 | `tratamiento-de-datos.astro`, sección 8, líneas 137 a 140 | Cumplimiento (num. 4 del art. 13 y art. 23 del Dec. 1377: designar persona o área) y estrategia (fijar el correo como único medio habilitado, art. 14 de la Ley 1581) | Media | "El responsable atiende las peticiones, consultas y reclamos de los titulares, y da trámite al ejercicio de sus derechos, a través del correo electrónico hola@eventalist.co." | "El área de protección de datos de Eventalist atiende las peticiones, consultas y reclamos de los titulares y da trámite al ejercicio de sus derechos. El único medio habilitado para estos efectos es el correo electrónico {DATA_CONTACT_EMAIL}; las solicitudes presentadas por otros medios se tendrán por recibidas cuando lleguen a ese correo." |
| 6 | `tratamiento-de-datos.astro`, colofón, líneas 187 a 191; `config.ts` `DATA_CONTROLLER` | Exposición: nombre de persona natural y dirección posiblemente residencial | Media (alta si la dirección es la vivienda) | "Responsable del tratamiento: Juan Andrés Osorio, quien opera Eventalist. Domicilio: Bogotá, Colombia. Dirección: Calle 111 # 45A-70. Correo electrónico: hola@eventalist.co. Teléfono: +57 305 840 6091." | Si existe sociedad: "Responsable del tratamiento: [RAZÓN SOCIAL], titular de la plataforma Eventalist. Domicilio: Bogotá, Colombia. Dirección de notificación: [DIRECCIÓN COMERCIAL]. Correo electrónico: {DATA_CONTACT_EMAIL}. Teléfono: {c.phone}. La autorización que el titular otorga a Eventalist en el formulario se entiende otorgada a este responsable." Si no existe sociedad: mantener el nombre de la persona natural, sustituir "Dirección:" por "Dirección de notificación:" con la dirección registrada en Cámara de Comercio u oficina virtual, y dejar el resto igual. El nombre de la persona natural no puede omitirse. |
| 7 | `tratamiento-de-datos.astro`, sección 1, líneas 50 a 52 | Cumplimiento: hay que confirmar el hecho. Si la organización del encuentro (persona distinta de Eventalist) recibe la lista de inscritos, eso es una transmisión o transferencia a un tercero y la frase "no se comparten" sería falsa | Media (condicionada al hecho) | "El tratamiento lo realiza Eventalist, plataforma que gestiona la comunicación y la boletería del encuentro" | Si la organización del encuentro NO recibe los datos: dejar igual. Si SÍ los recibe: añadir en la sección 4 "Los datos se transmiten a la organización del encuentro Testigos de la Memoria únicamente para las finalidades de la sección 3." y ajustar la frase absoluta del párrafo introductorio y de la sección 4. |
| 8 | `tratamiento-de-datos.astro`, sección 8, líneas 149 a 152 | Cumplimiento menor: el art. 15 num. 1 de la Ley 1581 exige también "la dirección" del reclamante. Omitirla debilita la facultad de pedir que se complete el reclamo | Baja | "puede presentar un reclamo con su identificación, la descripción de los hechos y los documentos que quiera hacer valer" | "puede presentar un reclamo con su identificación, la descripción de los hechos, una dirección de contacto y los documentos que quiera hacer valer" |
| 9 | `tratamiento-de-datos.astro`, párrafo introductorio, línea 41 | Exposición: garantía absoluta en negrita, repetida tres veces (introducción, sección 4 y `waitlist.privacy`) | Baja | "**no se comparten, no se ceden y no se venden a terceros**" | Quitar la negrita y dejar: "Esos datos se guardan con ese fin y no se comparten, ceden ni venden a terceros." Es cierto y conviene decirlo; no conviene enfatizarlo como promesa destacada. |
| 10 | `tratamiento-de-datos.astro`, sección 2, líneas 64 a 65 | Exposición baja: asume un deber de vigilancia activa ("advierte") | Baja | "Si el responsable advierte que ha recibido datos de un menor de edad, procederá a suprimirlos." | "El formulario está dirigido a personas mayores de edad. Los datos de un menor de edad que lleguen a recibirse se suprimirán tan pronto se tenga conocimiento de esa circunstancia." |
| 11 | `tratamiento-de-datos.astro`, sección 3, líneas 79 a 81 | Cumplimiento operativo: la frase sobre horarios de la Ley 2300 es correcta pero obliga al equipo. Se mantiene (ver "qué no cambiar") | Baja | "dentro de los horarios previstos en la Ley 2300 de 2023" | Sin cambio de fondo. Opcional: "conforme a los canales, horarios y periodicidad previstos en la Ley 2300 de 2023", que cubre también la regla de frecuencia del art. 3, que el art. 5 extiende a la publicidad. |
| 12 | `ui.ts` `waitlist.privacy` (línea 42) | Exposición mínima; coherencia con el hallazgo 9 | Baja | "No compartimos ni vendemos tus datos a terceros." | "Los datos no se comparten ni se venden a terceros." (El tuteo es el registro del sitio; si se prefiere conservarlo, no hay problema legal.) |
| 13 | `tratamiento-de-datos.astro`, sección 7, literal e (línea 130) | Ninguno de cumplimiento; nota de precisión. El art. 8 lit. e) de la Ley 1581 condiciona la revocatoria, pero el art. 9 del Dec. 1377 la permite "en todo momento" salvo deber legal o contractual de permanecer | Baja | "Revocar la autorización y solicitar la supresión de sus datos." | Dejar igual. Es la lectura más favorable al titular y la que el Dec. 1377 impone en la práctica. |

Sección 8, plazos de consultas y reclamos: verificados contra los arts. 14 y 15 de la Ley 1581 (10 + 5 días hábiles; 5 días para subsanar, 2 meses para desistimiento, 2 días hábiles para la leyenda, 15 + 8 días hábiles). Correctos. Sección 7: los seis derechos coinciden con el art. 8. Sección 6: coincide con el art. 11 del Dec. 1377. Requisito de procedibilidad (art. 16 de la Ley 1581): correctamente enunciado en las secciones 7 y 8.

## 4. Qué NO cambiar aunque parezca tentador

- **No quitar el teléfono ni la dirección del colofón.** Son exigencia literal del numeral 1 del art. 13 del Dec. 1377 y del art. 12 lit. d) de la Ley 1581. Se pueden sustituir por datos comerciales; no omitir.
- **No poner solo "Eventalist" como responsable** si no hay sociedad detrás. Un nombre comercial no es "nombre o razón social".
- **No borrar la sección de comunicación de cambios sustanciales** (sección 10). La exige el párrafo final del art. 13 y el art. 5 del Dec. 1377.
- **No acortar los plazos** de consultas y reclamos ni prometer respuesta "inmediata". Los plazos legales son máximos y ya están bien transcritos; ofrecer menos crea una obligación voluntaria.
- **No quitar la mención a la SIC ni al requisito de procedibilidad.** El derecho a quejarse ante la SIC es un derecho legal que hay que informar (art. 8 lit. d); la frase "una vez agotado el trámite ante el responsable" es la que protege a Eventalist, porque obliga al titular a pasar primero por el correo.
- **No quitar la frase sobre horarios de la Ley 2300.** Es obligación legal aunque no se mencione; mencionarla no añade exposición y demuestra diligencia.
- **No añadir un formulario web de PQR, chat, ni teléfono de atención.** Un solo canal (correo) es lícito y es lo que menos tráfico genera.
- **No convertir el aviso de la casilla en un texto largo con dirección y teléfono.** El aviso corto más enlace a la política es la fórmula que el art. 14 del Dec. 1377 permite; poner el teléfono en la casilla lo expone en la página principal.
- **No eliminar la casilla `required` ni el chequeo en el script.** La casilla sin marcar por defecto y el envío del estado real son la prueba de que el silencio no se tomó por autorización (art. 7 del Dec. 1377).
- **No eliminar "El titular puede solicitar copia de esa prueba".** El parágrafo del art. 12 de la Ley 1581 obliga a entregar copia; decirlo no añade nada que no exista ya.

## 5. Obligaciones operativas que la política asume (el equipo debe poder cumplirlas)

1. **Responder consultas en 10 días hábiles y reclamos en 15 días hábiles** desde el correo hola@eventalist.co, con prórroga informada por escrito si hace falta (5 y 8 días hábiles respectivamente). Alguien tiene que leer ese buzón con frecuencia suficiente para que un correo no se quede sin respuesta más de una semana.
2. **Marcar "reclamo en trámite" en el registro** del contacto dentro de los 2 días hábiles siguientes a recibir un reclamo completo (art. 15 de la Ley 1581). Verificar que el backend de Eventalist tenga un campo o etiqueta para esto; si no lo tiene, una nota manual en el registro sirve.
3. **Suprimir o desuscribir a petición** por correo y por el mecanismo de baja de cada mensaje (art. 9 del Dec. 1377: mecanismos gratuitos y de fácil acceso). La guía del backend dice que honra opt-outs por canal y borra a petición; confirmarlo con una prueba real antes del primer envío.
4. **Entregar copia de la prueba de la autorización** cuando la pidan: fecha, hora y método del consentimiento que guarda el backend (parágrafo del art. 12 de la Ley 1581, art. 8 del Dec. 1377).
5. **Conservar el modelo del aviso** (texto de la casilla) y cada versión de la política mientras haya datos tratados con base en ellos (art. 16 del Dec. 1377). El repositorio ya versiona `ui.ts` y `tratamiento-de-datos.astro`; basta con no reescribir el historial y, en cada cambio del texto legal, hacer un commit separado o una etiqueta con la fecha. Con eso la frase propuesta en el hallazgo 1 ("y del texto del aviso vigente en cada momento") es verdadera.
6. **Enviar solo por los canales autorizados y en el horario de la Ley 2300**: lunes a viernes de 7:00 a. m. a 7:00 p. m., sábados de 8:00 a. m. a 3:00 p. m., nunca domingos ni festivos; y, en la lectura prudente del art. 5 que extiende el art. 3 a la publicidad, no más de un contacto al día ni por varios canales en la misma semana. Si un inscrito no dejó teléfono, no hay canal WhatsApp para él.
7. **Comunicar cualquier cambio sustancial** (identidad del responsable o finalidades) a los inscritos antes de aplicarlo y publicarlo en la página (art. 13 del Dec. 1377). Un cambio de persona natural a sociedad, si se hace después de recoger datos, es un cambio sustancial: hay que avisar por correo.
8. **Suprimir datos de menores** cuando se tenga conocimiento.
9. **Reportar a la SIC los incidentes de seguridad** que afecten datos personales (art. 17 lit. n de la Ley 1581; la Circular 003 de 2018 lo extiende a quienes no están obligados al RNBD). Verificar el plazo en la circular; la investigación previa lo toma de una reseña (15 días hábiles) y no del texto.
10. **RNBD**: si Eventalist es persona natural, o sociedad o entidad sin ánimo de lucro con activos totales iguales o inferiores a 100.000 UVT, no hay obligación de inscribir la base (Decreto 090 de 2018). Si supera el umbral, inscribir y actualizar cada año entre el 2 de enero y el 31 de marzo.
11. **Contrato con los encargados** (Railway, proveedor de correo, WhatsApp Business): los términos de servicio aceptados valen como contrato para efectos del art. 25 del Dec. 1377. Conservar copia o enlace a la versión aceptada.
12. **Coherencia con la organización del encuentro**: confirmar por escrito que la lista de inscritos no se entrega a la organización del evento. Si se entrega, la política debe decirlo (hallazgo 7).

## 6. Fuentes consultadas

Verificadas en texto literal para este informe:
- Decreto 1377 de 2013, arts. 5, 8, 9, 12, 13, 14, 15, 16, 17, 18, 21, 24 y 25: PDF publicado por IMSALUD (reproduce el Régimen Legal de Bogotá), https://www.imsalud.gov.co/web/wp-content/uploads/normatividad/decreto1377.pdf ; contrastado con https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=53646
- Ley 1581 de 2012, arts. 4, 8, 9, 10, 12, 14, 15, 16, 17, 19 y 26: mismo PDF (incluye la ley) y https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=49981
- Ley 2300 de 2023, arts. 1 a 6: https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=143903
- Circular Externa 005 de 2017 de la SIC (países con nivel adecuado de protección; incluye a Estados Unidos): copia en el gestor normativo de la CRA, https://normas.cra.gov.co/gestor/docs/circular_superindustria_0005_2017.htm
- Sitio eventalist.co (búsqueda de razón social y políticas): página principal sin datos legales; /terminos, /privacidad, /terms y /politica-de-tratamiento-de-datos devuelven 404.

Tomadas de la investigación previa (`docs/tratamiento-de-datos.md`), no reverificadas hoy:
- Decreto 090 de 2018 y Circular Externa 003 de 2018 de la SIC (umbral del RNBD, reporte de incidentes).
- Cartilla de formatos de la SIC (recomendación de selección separada por finalidad), citada a través de la reseña del Observatorio Habeas Data de Uniandes.
- Numeración compilada del Decreto 1074 de 2015: solo consta que el art. 13 del Dec. 1377 es el art. 2.2.2.25.3.1. No pude cargar el capítulo 25 del Decreto 1074 (el normograma de la DIAN no lo incluye en la página consultada), así que cito por la numeración original del Dec. 1377, que es la que la propia política usa.

Lo que no pude verificar:
- Existencia de una persona jurídica detrás de Eventalist (requiere certificado de Cámara de Comercio).
- Si la dirección Calle 111 # 45A-70 es residencial o comercial registrada.
- El plazo exacto de reporte de incidentes en la Circular 003 de 2018.
- La guía de integración del backend de Eventalist no está en el repositorio; los hechos sobre fecha y método del consentimiento, opt-outs, borrado y horarios los tomo del contexto entregado para esta revisión.
