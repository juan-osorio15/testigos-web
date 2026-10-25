# RC · Retomar conversaciones inactivas

Personas que le escribieron a Catalina, se les cerró la conversación por inactividad y no compraron. Ya conocen el evento y alguna vez preguntaron: el mensaje retoma la conversación como quien se acuerda de ellas, les cuenta algo que antoja, les resuelve dónde quedarse y les deja el pase de fin de semana. Termina en una pregunta para que respondan y Catalina siga.

Cada plantilla tiene una sola idea (una conversación del programa o el recorrido completo), una línea de hospedaje con un hotel aliado distinto y, al final, la oferta.

## Calendario

- **RC1** · lunes 26 oct · Yolanda Ruiz y María Elvira Samper · Hospedería Duruelo
- **RC2** · martes 27 oct · Fidel Cano y Cecilia Orozco · Mesón de los Virreyes
- **RC3** · miércoles 28 oct · el recorrido completo · La Posada de San Antonio
- **RC4** · jueves 29 oct · último día del pase de fin de semana a $240.000 · Casa Boutique
- **RC5** · viernes 30 oct · Marisol Gómez y Ricardo Ospina · Hospedería Duruelo
- **RC6** · sábado 31 oct (de 8:00 a.m. a 3:00 p.m.) · Luz María Sierra y Martha Soto · Mesón de los Virreyes
- **RC7** · martes 3 nov · Marta Ruiz y Guillermo González Uribe · La Posada de San Antonio
- **RC8** · miércoles 4 nov · mañana empieza · Casa Boutique

El domingo 1 y el lunes 2 (festivo) no se envía.

## Antes del primer envío (una sola vez)

- [ ] **Crear las 8 plantillas hoy** en WhatsApp Manager, con el texto exacto de abajo, para que RC1 esté aprobada el lunes 26. Nombre, cuerpo, pie y botones como dice cada bloque.
- [ ] **Decidir cómo se marca a quien pidió la baja.** Hoy Catalina pone en Cold Lead tanto a quien dice "No me interesa" como a quien no respondió los seguimientos, así que el Lifecycle no los distingue. Sin eso, el filtro de abajo deja por fuera a todos los Cold Lead (y se pierde a los inactivos) o los incluye a todos (y le escribe a quien pidió que no). Lo sólido: que Catalina agregue la etiqueta `baja` cuando alguien la pide, en una versión nueva del prompt, y marcar a mano a quienes ya la pidieron.
- [ ] **Compradores que no se lo dijeron a Catalina.** Quien compró en la página sin avisar en el chat sigue como Hot Lead o Payment y le llegaría el mensaje. Antes del primer envío, cotejar con los compradores de Pretix y pasarlos a Customer.

## Cada día

1. En respond.io, Broadcasts → nuevo broadcast, canal WhatsApp del número colombiano, plantilla del día.
2. Audiencia: contactos con la conversación cerrada, Lifecycle distinto de Customer y sin la etiqueta `baja`.
3. Programarlo dentro del horario de la Ley 2300 (mejor entre 9:00 y 11:00 a.m.).
4. **RC5 en adelante:** confirmar en Pretix, el mismo día, que el pase de fin de semana y la boleta de medio día que nombra la plantilla siguen a la venta. Desde el 30 de octubre las plantillas no dicen precio porque el de la etapa 3 todavía no está definido.

Si alguien también está en IN o EX, el mismo día le pueden llegar dos mensajes. Se acepta (sin límite de mensajes por persona desde el 19 de octubre).

---

## RC1 · lunes 26 de octubre · `rc1_mujeres_periodistas`

Variable `{{1}}`: nombre.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.). Hace unos días hablamos por aquí del encuentro y nos acordamos de ti.

¿Te imaginas escuchar a Yolanda Ruiz y María Elvira Samper contar cómo fue cubrir la guerra y el poder cuando casi ninguna mujer dirigía un noticiero? Es el domingo 8 de noviembre en la mañana, en Villa de Leyva.

Y si no sabes dónde quedarte, te lo resolvemos: la Hospedería Duruelo, donde son los conversatorios, tiene un paquete especial con descuento para asistentes. Sales de tu habitación y llegas a la charla.

Si quieres vivir todo el fin de semana, el pase de fin de semana está en $240.000 en vez de $270.000 hasta este jueves. ¿Te ayudamos a escoger tu boleta?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Sí, ayúdame**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc1-mujeres-periodistas_boletas#boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc1-mujeres-periodistas_hospedaje#hospedaje`

## RC2 · martes 27 de octubre · `rc2_reelecciones`

Variable `{{1}}`: nombre.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.). ¿Te imaginas preguntarle en persona a Fidel Cano, director de El Espectador, y a Cecilia Orozco qué pasó detrás de las reelecciones de Uribe y Santos?

Es el sábado 7 de noviembre a las 5:00 p.m., en la Hospedería Duruelo de Villa de Leyva, en una sala para 300 personas.

¿Ya sabes dónde quedarte? El Mesón de los Virreyes, una casona colonial a una cuadra de la Plaza Mayor, tiene 20 % de descuento para asistentes.

El pase de fin de semana está en $240.000 en vez de $270.000 hasta este jueves. ¿Quieres que te lo dejemos listo?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Sí, quiero**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc2-reelecciones_boletas#boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc2-reelecciones_hospedaje#hospedaje`

## RC3 · miércoles 28 de octubre · `rc3_recorrido_completo`

Variable `{{1}}`: nombre.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.).

¿Te imaginas recorrer la historia de Colombia en un fin de semana, contada por los periodistas que la vivieron de frente? Las conversaciones van en orden, como un solo recorrido: las guerrillas, el Caguán y La Habana, el narcotráfico, las reelecciones, las víctimas y las mujeres que cubrieron todo eso.

Para quedarte, La Posada de San Antonio, tres casas coloniales en el centro histórico con el desayuno incluido, tiene 10 % de descuento para asistentes.

El pase de fin de semana está en $240.000 en vez de $270.000 hasta mañana jueves. Y si puedes llegar desde el viernes, el pase completo empieza con el Bogotazo. ¿Cuál te sirve más?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Tengo una pregunta**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc3-recorrido-completo_boletas#boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc3-recorrido-completo_hospedaje#hospedaje`

## RC4 · jueves 29 de octubre · `rc4_ultimo_dia_fin_de_semana`

Variable `{{1}}`: nombre.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.).

¿Te imaginas un sábado y un domingo escuchando de cerca a Fidel Cano, Yolanda Ruiz, María Elvira Samper, Marta Ruiz y Ricardo Ospina, con tiempo para hacerles preguntas? Eso es el pase de fin de semana, y hoy es el último día a $240.000 en vez de $270.000.

Y para no pensar en dónde dormir: Casa Boutique, en el centro histórico de Villa de Leyva, te da 15 % de descuento con el código TESTIGOS en su página de reservas.

¿Te lo dejamos listo hoy?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Sí, quiero**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc4-ultimo-dia_boletas#boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc4-ultimo-dia_hospedaje#hospedaje`

## RC5 · viernes 30 de octubre · `rc5_negociaciones_paz`

Variable `{{1}}`: nombre. Sin precio: desde hoy rige la etapa 3.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.).

¿Qué pasó de verdad en las mesas del Caguán y de La Habana? Lo cuentan Marisol Gómez, que cubrió esas negociaciones durante 25 años, y Ricardo Ospina, director de noticias de Blu Radio. Es el sábado 7 de noviembre a las 11:00 a.m., en Villa de Leyva.

Si vienes de fuera, la Hospedería Duruelo, donde son los conversatorios, tiene un paquete especial con descuento para asistentes.

Esa conversación entra en la boleta de medio día del sábado en la mañana, y también en el pase de fin de semana, que sigue con descuento. ¿Te ayudamos a escoger?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Sí, ayúdame**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc5-negociaciones-paz_boletas#boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc5-negociaciones-paz_hospedaje#hospedaje`

## RC6 · sábado 31 de octubre (de 8:00 a.m. a 3:00 p.m.) · `rc6_narcotrafico`

Variable `{{1}}`: nombre.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.).

¿Te imaginas escuchar a Luz María Sierra, exdirectora de El Colombiano, y a Martha Soto, editora de la Unidad Investigativa de El Tiempo, hablar de lo que vieron cubriendo el narcotráfico y el paramilitarismo? Es el sábado 7 de noviembre a las 3:00 p.m., en la Hospedería Duruelo.

¿Ya tienes dónde quedarte? El Mesón de los Virreyes, a una cuadra de la Plaza Mayor y con piscina climatizada, tiene 20 % de descuento para asistentes.

La boleta del sábado en la tarde incluye también a Fidel Cano y Cecilia Orozco. Y el pase de fin de semana sigue con descuento. ¿Te cuento cuál te conviene?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Sí, cuéntame**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc6-narcotrafico_boletas#boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc6-narcotrafico_hospedaje#hospedaje`

## RC7 · martes 3 de noviembre · `rc7_magnicidios_victimas`

Variable `{{1}}`: nombre.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.).

¿Te imaginas escuchar a Marta Ruiz, excomisionada de la Verdad, y a Guillermo González Uribe, fundador de Número, hablar de los magnicidios y de las víctimas de la violencia? Es este domingo 8 de noviembre a las 9:00 a.m., en Villa de Leyva.

Si vienes a pasar el fin de semana, La Posada de San Antonio, en el centro histórico y con desayuno incluido, tiene 10 % de descuento para asistentes.

La boleta del domingo en la mañana incluye también a Yolanda Ruiz y María Elvira Samper. Y el pase de fin de semana sigue con descuento. ¿Te ayudamos a reservar?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Sí, ayúdame**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc7-magnicidios-victimas_boletas#boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc7-magnicidios-victimas_hospedaje#hospedaje`

## RC8 · miércoles 4 de noviembre · `rc8_manana_empieza`

Variable `{{1}}`: nombre. Antes de enviarla, confirmar en Pretix que sigue habiendo boletas.

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.). Mañana empieza el encuentro en Villa de Leyva.

¿Te imaginas ver con Guillermo González Uribe el documental sobre Sady González, el fotógrafo que estuvo con su cámara el 9 de abril de 1948? Es mañana jueves a las 3:00 p.m. en la Casa Museo Antonio Nariño, con entrada libre, como todas las charlas abiertas.

Y si decides quedarte, Casa Boutique, en el centro histórico, te da 15 % de descuento con el código TESTIGOS en su página de reservas.

Para los conversatorios en Duruelo todavía hay cupo: el pase completo desde el viernes, o el pase de fin de semana, que sigue con descuento. ¿Te ayudamos a escoger?
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de respuesta rápida **Sí, ayúdame**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc8-manana-empieza_boletas#boletas`
- Botón de enlace **Ver hoteles** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=recuperacion&utm_content=plantilla-rc8-manana-empieza_hospedaje#hospedaje`
