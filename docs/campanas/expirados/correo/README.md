# Expirados · correo

Plan de la campaña en [`../README.md`](../README.md). Cómo funciona el comando: [`../../README.md`](../../README.md).

## Recordatorio (desde el 19 de octubre)

Decisión del titular del 2026-10-19: el correo del 12 de octubre ya no aplica (hablaba del último día del precio de la etapa 1). El nuevo es un recordatorio: la reserva se venció, todavía hay boletas y ahora hay dos formas de ir. La escasez es el aforo limitado, no el precio.

- Plantilla: `scripts/campanas/plantillas/expirado-texto.html` (desde el 2026-10-26; la anterior, `expirado-recordatorio.html`, con la fórmula visual, sigue en el historial de git). Asunto "Tu pedido {{codigo}} de Testigos de la Memoria" (el mismo que llegó a Principal), remitente `Juan de Testigos de la Memoria <direccion@testigosdelamemoria.com>` (antes, hola@eventalist.co), sin cabecera `List-Unsubscribe`; las respuestas llegan a manager@eventalist.co (desde el 2026-10-26; antes, a hola@eventalist.co).
- Contenido, como correo escrito a mano, sin precios, descuentos ni fechas límite (las razones, en `../../reglas.md`, "Correo"): el saludo, el pedido que se venció, Daniel Samper Pizano, Fidel Cano y Yolanda Ruiz con sus temas, "Si quieres revisar la agenda o retomar tu pedido…" con un solo enlace a la portada, sin decir "boletas", "¿Algo falló con el pago? Respóndeme y lo resolvemos." y la firma de Juan.
- Enlace: `utm_source=email&utm_medium=email&utm_campaign=expirados&utm_content=correo-recordatorio_conversacional` (antes del 2026-10-26, `correo-recordatorio`).
- Comandos: `python3 scripts/campanas/campana.py correo expirados` (vista previa), luego con `--prueba tu@correo.com --enviar` y con `--enviar`.

A quién le llega, con el registro de envíos: a toda la lista del día. Para las 6 personas que recibieron el correo del 12 de octubre y no han comprado (el 19 de octubre), este es su segundo correo. Sin límite de mensajes (decisión del 19 de octubre), a quien tenga WhatsApp autorizado le llega también el WhatsApp, el mismo día o después.

## Primer correo (12 de octubre, ya enviado)

Se manda con Resend (el mismo proveedor que usa Pretix, dominio eventalist.co ya verificado, plan gratis de 100 correos al día) uno por persona, con el script de entonces.

- Remitente: `Juan de Testigos de la Memoria <hola@eventalist.co>` (`--remitente`); las respuestas llegan a hola@eventalist.co.
- Asunto: "Tu pedido {{codigo}} de Testigos de la Memoria".
- HTML: `scripts/campanas/plantillas/expirado-pedido.html`, con forma de seguimiento de pedido: logo de texto y "PEDIDO {{codigo}}", terracota con el titular ("Hoy es el último día del pase completo a su mejor precio", remate "Hasta las 11:59 p. m."), franja cielo con $310.000 y el botón "Completar mi compra" (el único enlace), bloque blanco con los panelistas y bloque ladrillo con la ayuda para el pago. Pie con la baja por respuesta; sin dirección física.
- Sin la cabecera `List-Unsubscribe` (`--sin-cabecera-baja`); la baja queda en el texto.
- **Decisión del titular (2026-10-12):** el correo sale el mismo 12 de octubre, festivo, porque la etapa 1 termina esa medianoche y es la última oportunidad real del mejor precio. Se envía con `--ignorar-horario`. El tono es vendedor a propósito: la urgencia es cierta. `{{codigo}}` se cambia por el código del pedido de cada persona.
- El script también arma la versión en texto plano y guarda cada envío en un registro para no repetir.

## Principal o Promociones en Gmail

La primera plantilla (`expirado.html`, con la imagen grande de las caras, enlace a WhatsApp y a la política, remitente de marca, asunto con el precio y cabecera de baja) cayó en Promociones en las pruebas. La variante de pedido, con todo lo anterior quitado, llegó a Principal en la prueba del 12 de octubre. Gmail decide por destinatario, así que no hay garantía, pero para recuperar pedidos se parte de la variante: un solo enlace, sin imágenes enlazadas, asunto con el código del pedido y remitente con nombre de persona. Las dos plantillas del 12 de octubre (`expirado.html` y `expirado-pedido.html`, con el precio de la etapa 1) se borraron el 2026-10-20 para que nadie las reutilice; siguen en el historial de git. La vigente es `expirado-texto.html`.

El envío real del 12 de octubre (16:24, 7 personas más el titular) salió con una versión anterior de la variante que decía "los cuatro días" y "del jueves 5 al domingo 8"; el pase cubre los conversatorios del 6 al 8. La plantilla ya está corregida.

## Comandos

```sh
python3 scripts/campanas/campana.py correo expirados                                          # vista previa
python3 scripts/campanas/campana.py correo expirados --prueba manager@eventalist.co --enviar   # prueba
python3 scripts/campanas/campana.py correo expirados --enviar                                  # envío real
```

La vista previa queda en `~/Documents/eventalist/datos/testigos-memoria/previas-expirados/`. Si se corre otra vez, no repite a nadie.
