# RC · Retomar conversaciones inactivas

Personas que le escribieron a Catalina, se les cerró la conversación por inactividad y no compraron. Ya conocen el evento y alguna vez preguntaron: el mensaje retoma la conversación como quien se acuerda de ellas, les cuenta algo que antoja, les resuelve dónde quedarse y les deja el pase de fin de semana. Termina en una pregunta para que respondan y Catalina siga.

Cada plantilla tiene una sola idea (una conversación del programa o el recorrido completo) y abre de forma distinta: un dato, una pregunta sobre el tema, una noticia. No todas con "¿te imaginas…?". Después, una línea de hospedaje (cuatro variantes que se alternan), sin nombrar un hotel (los hoteles y sus descuentos están en la página, en el botón Ver hoteles), y al final el pase de fin de semana con su descuento por tiempo limitado.

## Calendario

- **RC1** · lunes 26 oct · Yolanda Ruiz y María Elvira Samper
- **RC2** · martes 27 oct · Fidel Cano y Cecilia Orozco
- **RC3** · miércoles 28 oct · el recorrido completo
- **RC4** · jueves 29 oct · último día del pase de fin de semana a $240.000. **No se envía:** la reemplaza CD3 (`docs/campanas/cierre-descuento/`), que llega a todos los contactos sin compra
- **RC5** · viernes 30 oct · Marisol Gómez
- **RC6** · sábado 31 oct (de 8:00 a.m. a 3:00 p.m.) · Luz María Sierra y Martha Soto
- **RC7** · martes 3 nov · Marta Ruiz y Guillermo González Uribe
- **RC8** · miércoles 4 nov · mañana empieza

El domingo 1 y el lunes 2 (festivo) no se envía.

## Antes del primer envío (una sola vez)

- [ ] **Crear las 8 plantillas** en WhatsApp Manager, con el texto exacto de abajo, al menos un día antes de su envío. Nombre, cuerpo, pie y botones como dice cada bloque. Si alguna ya se mandó a Meta con el texto del 25 de octubre, la nueva se crea con `_v2` al final del nombre.
- [ ] **La baja (decisión del titular, 2026-10-26).** En respond.io, crear el campo de contacto **Baja** (Field ID `baja`, tipo Checkbox). Pegar `docs/chatbot/prompt_v5.md` en Catalina: quien responda BAJA o "no me interesa" queda con la casilla Baja marcada. A quienes ya la pidieron antes, marcársela a mano.

## Cada día

1. En respond.io, Broadcasts → nuevo broadcast, canal WhatsApp del número colombiano, plantilla del día.
2. Audiencia: el segmento guardado `inactivos`: "Time Since Last Incoming Message" mayor que 24 horas, Lifecycle distinto de Customer y la casilla Baja sin marcar.
3. Programarlo dentro del horario de la Ley 2300 (mejor entre 9:00 y 11:00 a.m.).
4. **RC5 en adelante:** confirmar en Pretix, el mismo día, que el pase de fin de semana y la boleta de medio día que nombra la plantilla siguen a la venta. Desde el 30 de octubre las plantillas dicen "con descuento por tiempo limitado" sin cifras, porque el precio de la etapa 3 todavía no está definido.

Si alguien también está en IN o EX, el mismo día le pueden llegar dos mensajes. Se acepta (sin límite de mensajes por persona desde el 19 de octubre).

---

## RC1 · lunes 26 de octubre · `rc1_mujeres_periodistas`

Variable `{{1}}`: nombre.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.). Hace unos días hablamos por aquí del encuentro y queríamos contarte algo.

Yolanda Ruiz y María Elvira Samper cubrieron la guerra y el poder cuando casi ninguna mujer dirigía un noticiero en Colombia. El domingo 8 de noviembre en la mañana van a contar cómo fue, en Villa de Leyva, y vas a poder hacerles preguntas.

Para que no tengas que preocuparte por el hospedaje, tenemos varios hoteles aliados con descuentos especiales para asistentes.

El pase de fin de semana está en $240.000 en vez de $270.000, un descuento por tiempo limitado. ¿Te ayudamos a escoger tu boleta?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Sí, ayúdame**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc1-mujeres-periodistas_boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc1-mujeres-periodistas_hospedaje#hospedaje`

## RC2 · martes 27 de octubre · `rc2_reelecciones`

Variable `{{1}}`: nombre.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.).

¿Qué pasó detrás de las reelecciones de Uribe y Santos? Fidel Cano, director de El Espectador, y Cecilia Orozco lo conversan el sábado 7 de noviembre a las 5:00 p.m. en Villa de Leyva, y al final les puedes preguntar en persona.

¿Ya sabes dónde quedarte? Tenemos varios hoteles aliados con descuentos especiales para asistentes.

Esa conversación entra en el pase de fin de semana, que está en $240.000 en vez de $270.000 por tiempo limitado. ¿Quieres que te lo dejemos listo?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Sí, quiero**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc2-reelecciones_boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc2-reelecciones_hospedaje#hospedaje`

## RC3 · miércoles 28 de octubre · `rc3_recorrido_completo`

Variable `{{1}}`: nombre.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.).

Testigos de la Memoria está armado como un solo recorrido por la historia de Colombia. Empieza el viernes con Daniel Samper Pizano y el Bogotazo, y de ahí las conversaciones siguen en orden: las guerrillas, el Caguán y La Habana, el narcotráfico, las reelecciones, las víctimas y las mujeres que cubrieron todo eso.

Si todavía no sabes dónde quedarte, tenemos varios hoteles aliados con descuentos especiales para asistentes.

Para vivirlo entero, el pase completo vale $340.000. Si no puedes el viernes, el pase de fin de semana está en $240.000 en vez de $270.000, por tiempo limitado. ¿Cuál te sirve más?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Tengo una pregunta**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc3-recorrido-completo_boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc3-recorrido-completo_hospedaje#hospedaje`

## RC4 · jueves 29 de octubre · `rc4_ultimo_dia_fin_de_semana`

Variable `{{1}}`: nombre.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.).

Te avisamos porque hoy es el último día del pase de fin de semana a $240.000 en vez de $270.000. Desde mañana el descuento es menor.

Con ese pase escuchas el sábado y el domingo a Fidel Cano, Yolanda Ruiz, María Elvira Samper, Marta Ruiz y Marisol Gómez, entre otros, con tiempo para hacerles preguntas.

Si vienes de fuera, tenemos varios hoteles aliados con descuentos especiales para asistentes.

¿Te lo dejamos listo hoy?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Sí, quiero**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc4-ultimo-dia_boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc4-ultimo-dia_hospedaje#hospedaje`

## RC5 · viernes 30 de octubre · `rc5_negociaciones_paz`

Variable `{{1}}`: nombre. Sin cifras: desde hoy rige la etapa 3.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.).

Marisol Gómez cubrió las negociaciones de paz durante 25 años, del Caguán a La Habana. El sábado 7 de noviembre a las 11:00 a.m. cuenta en Villa de Leyva lo que vio en esas mesas y nunca llegó a los titulares.

Para que no tengas que preocuparte por el hospedaje, tenemos varios hoteles aliados con descuentos especiales para asistentes.

Esa conversación entra en la boleta del sábado en la mañana y en el pase de fin de semana, que sigue con descuento por tiempo limitado. ¿Te ayudamos a escoger?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Sí, ayúdame**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc5-negociaciones-paz_boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc5-negociaciones-paz_hospedaje#hospedaje`

## RC6 · sábado 31 de octubre (de 8:00 a.m. a 3:00 p.m.) · `rc6_narcotrafico`

Variable `{{1}}`: nombre.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.).

Una tarde para entender el narcotráfico y el paramilitarismo con dos periodistas que los cubrieron de cerca: Luz María Sierra, exdirectora de El Colombiano, y Martha Soto, editora de la Unidad Investigativa de El Tiempo. Es el sábado 7 de noviembre a las 3:00 p.m.

Si todavía no sabes dónde quedarte, tenemos varios hoteles aliados con descuentos especiales para asistentes.

El pase de fin de semana sigue con descuento por tiempo limitado, y también está la boleta del sábado en la tarde. ¿Te cuento cuál te conviene?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Sí, cuéntame**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc6-narcotrafico_boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc6-narcotrafico_hospedaje#hospedaje`

## RC7 · martes 3 de noviembre · `rc7_magnicidios_victimas`

Variable `{{1}}`: nombre.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.).

Los magnicidios han marcado la historia de Colombia una y otra vez, y por doloroso que sea, es un patrón que hay que entender. Este domingo a las 9:00 a.m., Marta Ruiz, excomisionada de la Verdad, y Guillermo González Uribe, fundador de Número, hablan de eso y de las víctimas de la violencia.

Si vienes de fuera, tenemos varios hoteles aliados con descuentos especiales para asistentes.

El pase de fin de semana sigue con descuento por tiempo limitado, y también está la boleta del domingo en la mañana. ¿Te ayudamos a reservar?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Sí, ayúdame**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc7-magnicidios-victimas_boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc7-magnicidios-victimas_hospedaje#hospedaje`

## RC8 · miércoles 4 de noviembre · `rc8_manana_empieza`

Variable `{{1}}`: nombre. Antes de enviarla, confirmar en Pretix que sigue habiendo boletas.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.). Mañana empieza el encuentro en Villa de Leyva.

El jueves a las 3:00 p.m., en la Casa Museo Antonio Nariño, se proyecta el documental sobre Sady González, el fotógrafo que estuvo con su cámara el 9 de abril de 1948, con Guillermo González Uribe. La entrada es libre, como en todas las charlas abiertas.

¿Ya sabes dónde quedarte? Tenemos varios hoteles aliados con descuentos especiales para asistentes.

Para los conversatorios en Duruelo todavía hay cupo: el pase completo desde el viernes, o el pase de fin de semana, que sigue con descuento por tiempo limitado. ¿Te ayudamos a escoger?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Sí, ayúdame**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc8-manana-empieza_boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc8-manana-empieza_hospedaje#hospedaje`
