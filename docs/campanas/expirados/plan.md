# Campaña a pedidos expirados sin compra

Plan del 12 de octubre de 2026. Objetivo: escribirle a quien intentó comprar boletas, dejó vencer el pedido y nunca volvió a comprar, para ayudarle a terminar la compra. A quien expiró y después compró no se le escribe.

Este documento no lleva datos personales (el repositorio es público). La lista sale del comando de la sección 1 y se guarda fuera del repo.

## 1. Quiénes

### Cómo se saca la lista

```sh
python3 scripts/campanas/campana.py lista expirados
```

La campaña es `scripts/campanas/config/expirados.json` y sus reglas, `scripts/campanas/audiencias/expirados.py` (cómo encaja todo: `docs/campanas/README.md`). Hasta el 19 de octubre esto lo hacía `scripts/pretix/expirados_sin_compra.py`, que ya no existe.

Qué hace:

- Lee los pedidos directamente de la API de Pretix, con el token de solo lectura del llavero.
- Toma a quien tiene algún pedido `expirado`.
- Une los pedidos de una misma persona por correo **o** por teléfono (si expiró con un correo y pagó con otro, pero con el mismo celular, es la misma persona).
- Descarta a toda persona con algún pedido `pagado` o `pendiente`, y comprueba al final que nadie de la lista comparta correo o teléfono con uno; si pasa, se detiene.
- Le pregunta al backend por qué canal se le puede escribir a cada persona (sección 2).
- Una fila por persona: correo, número para WhatsApp, el código del último pedido expirado (variable de las plantillas), cuántos intentos, fechas, boletas y total del último intento.
- Si Pretix trae un estado desconocido, se detiene con un mensaje en vez de adivinar.

Los comandos de envío la vuelven a armar en el momento: alguien de la lista puede comprar entre un paso y otro.

Comparación del 19 de octubre entre el script viejo y el comando nuevo, con los mismos datos: las mismas personas por correo. Por WhatsApp, una persona más con el nuevo: hizo su pedido el 6 de octubre (antes de la casilla de la tienda), pero ese mismo día llenó el formulario del sitio, que sí autoriza WhatsApp.

### Resultado con la exportación del 12 de octubre

- 89 pedidos: 30 pagados, 23 expirados, 36 cancelados.
- 8 personas expiraron y después compraron: no se contactan.
- **7 personas a contactar**: 2 con pedido del 10 y 11 de octubre, 5 con pedidos entre el 22 de septiembre y el 7 de octubre.
- 19 personas solo tienen pedidos cancelados (varios en $0 o con montos de prueba). Quedan fuera de esta campaña.
- Comprobado aparte con un método más simple (cruce directo de correos y teléfonos): da las mismas 7 personas.

## 2. Qué permite la política de datos

Dictamen del abogado interno del 12 de octubre de 2026 y decisión del titular el mismo día.

- **Correo: el mismo a las 7 personas.** El abogado recomendaba, para quien hizo el pedido antes del 2026-10-09 (política anterior), un solo correo de servicio más neutro o no escribirle. El titular decidió mandar a todos el mismo correo: es el primer evento, son personas que claramente querían la boleta y el correo es un solo mensaje sobre su propio pedido.
- **WhatsApp: solo a quien lo autorizó.** La casilla de la tienda autoriza WhatsApp desde el 2026-10-09 (`tienda-2026-10-09`); la anterior no. Desde el 19 de octubre el comando se lo pregunta al backend, que guarda la casilla de cada pedido desde esa fecha y la del formulario del sitio, con sus bajas y su vencimiento. Ya no se revisa a mano en Pretix.
- **Correo y bajas:** si el backend conoce el correo de la persona y dice que no se le puede escribir (baja), queda sin correo.
- Horario de la Ley 2300, hora de Bogotá: lunes a viernes de 7:00 a. m. a 7:00 p. m., sábados de 8:00 a. m. a 3:00 p. m., nunca domingos ni festivos. El lunes 12 de octubre de 2026 es festivo. El script de correo se niega a enviar fuera de ese horario.
- Cada mensaje identifica a Eventalist S.A.S. y trae cómo darse de baja (BAJA en WhatsApp; enlace en el correo).
- Máximo dos toques por persona en total, en días distintos. **Reemplazado el 2026-10-19:** Decisión del titular (2026-10-19): sin límite de mensajes por persona ni por día; se escribe por todos los canales. El límite anterior de dos venía del dictamen del abogado del 2026-10-12. Quien pida la baja no vuelve a recibir nada.
- Sin precio, descuentos ni urgencia por el cambio de etapa (también por tono: el evento no se vende con presión).
- Pendiente de confirmar si el Registro de Números Excluidos de la CRC cubre WhatsApp.
- Pie de los mensajes: solo "Eventalist S.A.S. · hola@eventalist.co". Nunca la dirección física ni datos personales del titular.

## 3. Secuencia

Cada paso es un comando (sección 1); el comando arma la lista de nuevo en el momento y no repite un mismo mensaje.

1. **Correo a las 7 personas** (sección 5), en horario. Es lo único que no depende de la aprobación de Meta.
2. **WhatsApp a quien tenga pedido desde el 2026-10-09** (el 12 de octubre eran 2; la lista del día manda) que no hayan respondido ni comprado, en otro día. La plantilla se aprobó el 2026-10-16; pasos en `titular/whatsapp.md`.
3. Si alguien responde: se le atiende en la conversación (dentro de las 24 horas de servicio de WhatsApp se escribe libremente) y se le manda el enlace de compra.
4. Sin límite de mensajes por persona desde el 19 de octubre; cada mensaje nuevo es una plantilla nueva.

Pasos del titular, concretos: `titular/correo-resend.md` y `titular/whatsapp.md`.

## 4. Plantilla de WhatsApp (solo pedidos desde el 2026-10-09)

Categoría **Marketing**, idioma español. La exportación de Pretix no trae nombres, así que no saluda por nombre. Nombre: `pedido_expirado_ayuda`.

Aprobada por Meta el 2026-10-16. El cuerpo vigente está en `titular/whatsapp.md` (al final): el aviso del pedido vencido, un párrafo antojador con sede, panelistas y temas, y la oferta de ayuda con el pago. Sin plazo ni precio. Pie: "Para no recibir más mensajes, responde BAJA."

- Variable {{1}}: código del pedido (columna `pedidos`, el último).
- Botón de enlace "Ver boletas" → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=recuperacion&utm_campaign=expirados-2026#boletas`
- Botón de respuesta rápida "Necesito ayuda".

## 5. Correo

### Recordatorio (desde el 19 de octubre)

Decisión del titular del 2026-10-19: el correo del 12 de octubre ya no aplica (hablaba del último día del precio de la etapa 1). El nuevo es un recordatorio: la reserva se venció, todavía hay boletas y ahora hay dos formas de ir. La escasez es el aforo limitado, no el precio.

- Plantilla: `scripts/campanas/plantillas/expirado-recordatorio.html`. Asunto "Tu pedido {{codigo}} de Testigos de la Memoria" (el mismo que llegó a Principal), remitente `Juan de Testigos de la Memoria <hola@eventalist.co>`, sin cabecera `List-Unsubscribe`.
- Contenido: logo y "PEDIDO {{codigo}}" en crema; en terracota "TU RESERVA SE VENCIÓ ANTES DEL PAGO", el titular "Todavía puedes asegurar tu lugar." y el remate "El aforo es limitado."; franja cielo con "6 al 8 de noviembre · Hospedería Duruelo, Villa de Leyva" y el botón "Retomar mi compra" (único enlace); en blanco las dos formas de ir (pase completo $340.000, medio día $90.000 con las cuatro franjas) y los panelistas; en ladrillo la ayuda con el pago.
- Enlace: `utm_source=email&utm_medium=email&utm_campaign=expirados&utm_content=correo-recordatorio`.
- Comandos: `python3 scripts/campanas/campana.py correo expirados` (vista previa), luego con `--prueba tu@correo.com --enviar` y con `--enviar`.

A quién le llega, con el registro de envíos: a toda la lista del día. Para las 6 personas que recibieron el correo del 12 de octubre y no han comprado (el 19 de octubre), este es su segundo correo. Sin límite de mensajes (decisión del 19 de octubre), a quien tenga WhatsApp autorizado le llega también el WhatsApp, el mismo día o después.

### Primer correo (12 de octubre, ya enviado)

Se manda con Resend (el mismo proveedor que usa Pretix, dominio eventalist.co ya verificado, plan gratis de 100 correos al día) uno por persona, con el script de entonces.

- Remitente: `Juan de Testigos de la Memoria <hola@eventalist.co>` (`--remitente`); las respuestas llegan a hola@eventalist.co.
- Asunto: "Tu pedido {{codigo}} de Testigos de la Memoria".
- HTML: `scripts/campanas/plantillas/expirado-pedido.html`, con forma de seguimiento de pedido: logo de texto y "PEDIDO {{codigo}}", terracota con el titular ("Hoy es el último día del pase completo a su mejor precio", remate "Hasta las 11:59 p. m."), franja cielo con $310.000 y el botón "Completar mi compra" (el único enlace), bloque blanco con los panelistas y bloque ladrillo con la ayuda para el pago. Pie con la baja por respuesta; sin dirección física.
- Sin la cabecera `List-Unsubscribe` (`--sin-cabecera-baja`); la baja queda en el texto.
- **Decisión del titular (2026-10-12):** el correo sale el mismo 12 de octubre, festivo, porque la etapa 1 termina esa medianoche y es la última oportunidad real del mejor precio. Se envía con `--ignorar-horario`. El tono es vendedor a propósito: la urgencia es cierta. `{{codigo}}` se cambia por el código del pedido de cada persona.
- El script también arma la versión en texto plano y guarda cada envío en un registro para no repetir.

### Principal o Promociones en Gmail

La primera plantilla (`expirado.html`, con la imagen grande de las caras, enlace a WhatsApp y a la política, remitente de marca, asunto con el precio y cabecera de baja) cayó en Promociones en las pruebas. La variante de pedido, con todo lo anterior quitado, llegó a Principal en la prueba del 12 de octubre. Gmail decide por destinatario, así que no hay garantía, pero para recuperar pedidos se parte de la variante: un solo enlace, sin imágenes enlazadas, asunto con el código del pedido y remitente con nombre de persona. Las dos plantillas del 12 de octubre (`expirado.html` y `expirado-pedido.html`, con el precio de la etapa 1) se borraron el 2026-10-20 para que nadie las reutilice; siguen en el historial de git. La vigente es `expirado-recordatorio.html`.

El envío real del 12 de octubre (16:24, 7 personas más el titular) salió con una versión anterior de la variante que decía "los cuatro días" y "del jueves 5 al domingo 8"; el pase cubre los conversatorios del 6 al 8. La plantilla ya está corregida.

## 6. Cómo saber si funcionó

- A los 7 días: `python3 scripts/campanas/campana.py lista expirados` (quien compró ya no sale en la lista).
- En GA4, las visitas con `utm_medium=recuperacion`.

## 7. Para otros eventos

Para otro evento: copiar `scripts/campanas/config/expirados.json` y cambiar el evento, la campaña del backend y las plantillas (ver `docs/campanas/README.md`). Los textos de las plantillas son de este evento.
