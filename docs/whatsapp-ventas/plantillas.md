# Plantillas de WhatsApp para vender

Borradores para mandar a aprobación de Meta. Se envían igual que `pedido_expirado_ayuda`: con `scripts/campanas/campana.py whatsapp <campaña>` (ver `docs/campanas/README.md`) y los pasos de `docs/campana-expirados/titular/whatsapp.md`.

## Reglas para todas

- **A quién:** solo a quien aceptó la casilla de la tienda `tienda-2026-10-09` (compradores y pedidos desde esa fecha). Quien solo escribió al chatbot no entra hasta que el chatbot pida y guarde su autorización (ver la plantilla 1).
- **Horario de la Ley 2300, hora de Bogotá:** lunes a viernes de 7:00 a. m. a 7:00 p. m., sábados de 8:00 a. m. a 3:00 p. m., nunca domingos ni festivos.
- **Bajas:** quien responda BAJA no vuelve a recibir nada por ningún canal.
- **Frecuencia:** pocas y espaciadas. Meta frena las de marketing si una persona recibe muchas seguidas.
- **Tono:** sin cuenta regresiva, sin signos de exclamación, sin " — ". Información, no presión.
- **Pie:** las de marketing llevan `Para no recibir más mensajes, responde BAJA.` Nunca dirección física ni datos personales del titular.
- **Utilidad o marketing:** las de utilidad son más baratas y tienen menos límites, pero solo si hablan del pedido o de la asistencia, sin venta. Si llevan algo promocional, Meta las pasa a marketing.

## Estructura de los enlaces

```
https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=CAMPAÑA&utm_content=PIEZA#boletas
```

- `#boletas` solo cuando el botón lleva a la tienda, siempre al final.
- Cada campaña nueva se anota en la lista de `docs/medicion-embudo/enlaces-y-nombres.md` el día en que se crea.
- Para la prueba antes de enviar, abrir el enlace a mano con `utm_source=prueba`.

## 1. Seguimiento a quien preguntó por el chatbot

Requisito previo: que Tevit pregunte al final de la conversación algo como "¿Quieres que te avisemos por aquí de novedades del encuentro?" y guarde el sí. Hacer revisar esa pregunta con el abogado antes. Mientras no pasen 24 horas desde su último mensaje, se le puede escribir libre, sin plantilla.

- Nombre: `seguimiento_chat`
- Categoría: Marketing
- Cuerpo:

```
Hola. Te escribimos del equipo de Testigos de la Memoria (Eventalist S.A.S.). Hace unos días nos preguntaste por el encuentro.

Del 6 al 8 de noviembre, en Villa de Leyva, Daniel Samper Pizano, Cecilia Orozco, Yolanda Ruiz, Fidel Cano y otros periodistas que cubrieron los últimos cincuenta años de Colombia cuentan en persona lo que vieron de cerca. Puedes ir al encuentro completo o a una franja de medio día.

Si te quedó alguna duda, escríbenos por aquí.
```

- Botón de enlace **Ver boletas**:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=seguimiento-chat&utm_content=plantilla-seguimiento-chat#boletas`
- Botón de respuesta rápida **Tengo una pregunta**

## 2. Pedido pendiente de pago

Para quien tiene un pedido vivo sin pagar (transferencia o pago a medias). Se manda antes de que venza, no después. La política lo cubre explícitamente ("avisos sobre esta compra").

- Nombre: `pedido_pendiente_pago`
- Categoría: Utilidad
- Variables: {{1}} código del pedido, {{2}} fecha y hora en que vence (ejemplo: "el martes 20 de octubre a las 11:59 p. m.").
- Cuerpo:

```
Hola. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.). Tu pedido {{1}} sigue apartado, pero el pago no ha llegado. La reserva vence {{2}}.

Si ya pagaste, no tienes que hacer nada: el pago puede tardar en reflejarse. Si tuviste algún problema, escríbenos por aquí y te ayudamos.
```

- Botón de enlace **Ver mi pedido**:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=pendientes&utm_content=plantilla-pedido-pendiente#boletas`
  Si se puede, mejor el enlace directo al pedido en Pretix (el que llega en el correo de confirmación), como botón de enlace dinámico con el código.
- Botón de respuesta rápida **Necesito ayuda**

## 3. Novedad del cartel

Cuando se confirme un panelista o una sesión nueva. Encabezado con la foto del panelista.

- Nombre: `novedad_cartel`
- Categoría: Marketing
- Encabezado: imagen
- Variables: {{1}} nombre completo como en `src/data/speakers.ts`, {{2}} una línea de quién es, {{3}} sesión, día y hora (de `src/data/agenda.ts`).
- Cuerpo:

```
Hola. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.). {{1}} se suma al encuentro.

{{2}} Estará en {{3}}, en Villa de Leyva.
```

- Botón de enlace **Ver su sesión**:
  `https://testigosdelamemoria.com/panelistas/SLUG/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=novedades&utm_content=plantilla-novedad_SLUG`
  Ejemplo: `https://testigosdelamemoria.com/panelistas/daniel-samper-pizano/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=novedades&utm_content=plantilla-novedad_daniel-samper-pizano`
  El botón dinámico de Meta permite que solo cambie el final de la URL. Si cuesta, se aprueba una plantilla con la URL fija por cada novedad.

## 4. Cupos de una franja

Solo con un número real sacado de Pretix el mismo día del envío.

- Nombre: `cupos_franja`
- Categoría: Marketing
- Variables: {{1}} franja ("el sábado 7 en la mañana"), {{2}} sesiones de esa franja, {{3}} cupos que quedan.
- Cuerpo:

```
Hola. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.). Para {{1}}, con {{2}}, quedan {{3}} cupos.

La boleta de medio día cuesta 90.000 COP y el pase completo, con los tres días de conversatorios, 340.000 COP.
```

- Botón de enlace **Ver boletas**:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=cupos&utm_content=plantilla-cupos_FRANJA#boletas`
  Franjas: `viernes-tarde`, `sabado-manana`, `sabado-tarde`, `domingo-manana`.
  Ejemplo: `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=cupos&utm_content=plantilla-cupos_sabado-manana#boletas`

Franjas y sesiones, según la agenda:

- Viernes 6 en la tarde: Bogotazo, dictadura y Frente Nacional.
- Sábado 7 en la mañana: Surgimiento de las guerrillas; Negociaciones de paz, el Caguán y La Habana.
- Sábado 7 en la tarde: Narcotráfico y paramilitarismo; Las reelecciones de Uribe y Santos.
- Domingo 8 en la mañana: Magnicidios y víctimas de la violencia; Mujeres periodistas y conflicto.

## 5. De medio día a pase completo (solo compradores de franja)

Antes de aprobarla: confirmar en Pretix si se puede cobrar solo la diferencia o si toca comprar el pase aparte. Si toca aparte, la plantilla no debe insinuar que se cambia la boleta.

- Nombre: `mejora_pase`
- Categoría: Marketing
- Variables: {{1}} la franja que compró.
- Cuerpo:

```
Hola. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.). Ya tienes tu boleta para {{1}}.

El pase completo te deja entrar a los siete conversatorios del 6 al 8 de noviembre: del Bogotazo y el Frente Nacional a las reelecciones, los magnicidios y las mujeres periodistas en el conflicto. Si quieres quedarte todo el fin de semana, escríbenos y te contamos cómo.
```

- Botón de enlace **Ver la programación**:
  `https://testigosdelamemoria.com/programacion/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=compradores&utm_content=plantilla-mejora-pase`
- Botón de respuesta rápida **Quiero el pase completo**

## 6. Invita a alguien (solo compradores)

- Nombre: `invita_alguien`
- Categoría: Marketing
- Cuerpo:

```
Hola. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.). Gracias por comprar tu boleta.

Si conoces a alguien a quien le interese oír en persona a los periodistas que cubrieron los últimos cincuenta años de Colombia, puedes reenviarle este mensaje o el enlace de abajo.
```

- Botón de enlace **Ver el encuentro**:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=compradores&utm_content=plantilla-invita`
  Sin `#boletas`: quien lo recibe reenviado llega en frío y necesita ver primero de qué se trata.

## 7. Logística (una semana antes, solo compradores)

- Nombre: `logistica_asistentes`
- Categoría: Utilidad (sin precio ni invitación a comprar más)
- Variables: {{1}} código del pedido.
- Cuerpo:

```
Hola. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.) sobre tu pedido {{1}}.

Los conversatorios son en la Hospedería Duruelo (Carrera 3 n.º 12-88, Villa de Leyva). En la página del encuentro están la programación con los horarios, cómo llegar desde Bogotá y los hoteles aliados con descuento para asistentes.

Tu boleta llegó al correo con que hiciste la compra. Si no la encuentras, escríbenos por aquí.
```

- Botón de enlace **Cómo llegar**:
  `https://testigosdelamemoria.com/como-llegar/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=compradores&utm_content=plantilla-logistica`
- Botón de enlace **Programación**:
  `https://testigosdelamemoria.com/programacion/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=compradores&utm_content=plantilla-logistica`

## 8. Recordatorio un día antes (solo compradores)

- Nombre: `recordatorio_asistencia`
- Categoría: Utilidad
- Variables: {{1}} código del pedido, {{2}} primera sesión de su boleta con día y hora (ejemplo: "el viernes 6 a las 3:00 p. m., con la bienvenida").
- Cuerpo:

```
Hola. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.) sobre tu pedido {{1}}. Te esperamos {{2}} en la Hospedería Duruelo, Villa de Leyva.

Lleva tu boleta en el celular o impresa. Si tienes alguna pregunta, escríbenos por aquí.
```

- Botón de enlace **Programación**:
  `https://testigosdelamemoria.com/programacion/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=compradores&utm_content=plantilla-recordatorio`

## 9. Después del evento (asistentes)

- Nombre: `gracias_asistencia`
- Categoría: Marketing
- Cuerpo:

```
Hola. Gracias por acompañarnos en Testigos de la Memoria (Eventalist S.A.S.).

Pronto vamos a compartir fotos y lo mejor de los conversatorios. Si quieres que te avisemos de los próximos encuentros, responde SÍ.
```

- Botón de enlace **Ver el encuentro**:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=gracias&utm_content=plantilla-gracias`
- Botón de respuesta rápida **SÍ**

## Por dónde empezar

1. La 2 (pedido pendiente): salva compras a medio camino y es de utilidad.
2. La 3 (novedad del cartel): vende sin desentonar.
3. La 1 (seguimiento del chat): la de más potencial, pero depende del ajuste en Tevit y de la revisión del abogado.
