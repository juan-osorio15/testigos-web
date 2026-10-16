# Campaña a pedidos expirados sin compra

Plan del 12 de octubre de 2026. Objetivo: escribirle a quien intentó comprar boletas, dejó vencer el pedido y nunca volvió a comprar, para ayudarle a terminar la compra. A quien expiró y después compró no se le escribe.

Este documento no lleva datos personales (el repositorio es público). La lista sale del script y se guarda fuera del repo.

## 1. Quiénes

### Cómo se saca la lista

1. En Pretix: Pedidos → Exportar → "Lista de pedidos" en CSV (la exportación por defecto, en español).
2. Correr el script con esa exportación:

```sh
python3 scripts/pretix/expirados_sin_compra.py ~/Downloads/testigos-memoria_orders.csv \
  -o ~/Downloads/testigos-expirados-sin-compra-AAAA-MM-DD.csv --desde 2026-10-09
```

Qué hace:

- Toma los pedidos con estado `expirado`.
- Une los pedidos de una misma persona por correo **o** por teléfono (si expiró con un correo y pagó con otro, pero con el mismo celular, es la misma persona).
- Descarta a toda persona con algún pedido `pagado` o `pendiente`.
- Antes de escribir la salida comprueba que nadie de la lista comparta correo o teléfono con un pedido pagado o pendiente; si pasa, se detiene.
- Una fila por persona: correo, teléfono en formato +57, número para WhatsApp, cuántos intentos expirados, fechas, boletas y total del último intento, códigos de pedido.
- `--desde` marca en la columna `desde_fecha` a quien tiene un pedido expirado desde esa fecha (ver sección 2).
- `--excluir` deja por fuera correos o teléfonos del equipo o de pruebas. Se puede repetir.
- Si la exportación cambia de formato (faltan columnas o aparece un estado desconocido), el script falla con un mensaje en vez de adivinar.

**Volver a exportar y correr el script justo antes de cada envío.** Alguien de la lista puede comprar entre un paso y otro.

### Resultado con la exportación del 12 de octubre

- 89 pedidos: 30 pagados, 23 expirados, 36 cancelados.
- 8 personas expiraron y después compraron: no se contactan.
- **7 personas a contactar**: 2 con pedido del 10 y 11 de octubre, 5 con pedidos entre el 22 de septiembre y el 7 de octubre.
- 19 personas solo tienen pedidos cancelados (varios en $0 o con montos de prueba). Quedan fuera de esta campaña.
- Comprobado aparte con un método más simple (cruce directo de correos y teléfonos): da las mismas 7 personas.

## 2. Qué permite la política de datos

Dictamen del abogado interno del 12 de octubre de 2026 y decisión del titular el mismo día.

- **Correo: el mismo a las 7 personas.** El abogado recomendaba, para quien hizo el pedido antes del 2026-10-09 (política anterior), un solo correo de servicio más neutro o no escribirle. El titular decidió mandar a todos el mismo correo: es el primer evento, son personas que claramente querían la boleta y el correo es un solo mensaje sobre su propio pedido.
- **WhatsApp: solo a quien hizo el pedido desde el 2026-10-09** (`desde_fecha = si`, hoy 2 personas). La casilla anterior no autorizaba WhatsApp. Antes de enviar, confirmar en Pretix que el pedido aceptó la casilla `tienda-2026-10-09`.
- Horario de la Ley 2300, hora de Bogotá: lunes a viernes de 7:00 a. m. a 7:00 p. m., sábados de 8:00 a. m. a 3:00 p. m., nunca domingos ni festivos. El lunes 12 de octubre de 2026 es festivo. El script de correo se niega a enviar fuera de ese horario.
- Cada mensaje identifica a Eventalist S.A.S. y trae cómo darse de baja (BAJA en WhatsApp; enlace en el correo).
- Máximo dos toques por persona en total, en días distintos. Quien pida la baja no vuelve a recibir nada.
- Sin precio, descuentos ni urgencia por el cambio de etapa (también por tono: el evento no se vende con presión).
- Pendiente de confirmar si el Registro de Números Excluidos de la CRC cubre WhatsApp.
- Pie de los mensajes: solo "Eventalist S.A.S. · hola@eventalist.co". Nunca la dirección física ni datos personales del titular.

## 3. Secuencia

Con 7 personas esto se hace a mano. Antes de cada paso: nueva exportación de Pretix y volver a correr el script de la sección 1.

1. **Correo a las 7 personas** (sección 5), en horario. Es lo único que no depende de la aprobación de Meta.
2. **WhatsApp a quien tenga pedido desde el 2026-10-09** (el 12 de octubre eran 2; la lista del día manda) que no hayan respondido ni comprado, en otro día. La plantilla se aprobó el 2026-10-16; pasos en `titular/whatsapp.md`.
3. Si alguien responde: se le atiende en la conversación (dentro de las 24 horas de servicio de WhatsApp se escribe libremente) y se le manda el enlace de compra.
4. Fin. No hay tercer mensaje.

Pasos del titular, concretos: `titular/correo-resend.md` y `titular/whatsapp.md`.

## 4. Plantilla de WhatsApp (solo pedidos desde el 2026-10-09)

Categoría **Marketing**, idioma español. La exportación de Pretix no trae nombres, así que no saluda por nombre. Nombre: `pedido_expirado_ayuda`.

Aprobada por Meta el 2026-10-16. El cuerpo vigente está en `titular/whatsapp.md` (al final): el aviso del pedido vencido, un párrafo antojador con sede, panelistas y temas, y la oferta de ayuda con el pago. Sin plazo ni precio. Pie: "Para no recibir más mensajes, responde BAJA."

- Variable {{1}}: código del pedido (columna `pedidos`, el último).
- Botón de enlace "Ver boletas" → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=recuperacion&utm_campaign=expirados-2026#boletas`
- Botón de respuesta rápida "Necesito ayuda".

## 5. Correo

Se manda con Resend (el mismo proveedor que usa Pretix, dominio eventalist.co ya verificado, plan gratis de 100 correos al día) usando `scripts/correo/enviar_resend.py`, uno por persona.

- Remitente: `Juan de Testigos de la Memoria <hola@eventalist.co>` (`--remitente`); las respuestas llegan a hola@eventalist.co.
- Asunto: "Tu pedido {{codigo}} de Testigos de la Memoria".
- HTML: `scripts/correo/plantillas/expirado-pedido.html`, con forma de seguimiento de pedido: logo de texto y "PEDIDO {{codigo}}", terracota con el titular ("Hoy es el último día del pase completo a su mejor precio", remate "Hasta las 11:59 p. m."), franja cielo con $310.000 y el botón "Completar mi compra" (el único enlace), bloque blanco con los panelistas y bloque ladrillo con la ayuda para el pago. Pie con la baja por respuesta; sin dirección física.
- Sin la cabecera `List-Unsubscribe` (`--sin-cabecera-baja`); la baja queda en el texto.
- **Decisión del titular (2026-10-12):** el correo sale el mismo 12 de octubre, festivo, porque la etapa 1 termina esa medianoche y es la última oportunidad real del mejor precio. Se envía con `--ignorar-horario`. El tono es vendedor a propósito: la urgencia es cierta. `{{codigo}}` se cambia por el código del pedido de cada persona.
- El script también arma la versión en texto plano y guarda cada envío en un registro para no repetir.

### Principal o Promociones en Gmail

La primera plantilla (`expirado.html`, con la imagen grande de las caras, enlace a WhatsApp y a la política, remitente de marca, asunto con el precio y cabecera de baja) cayó en Promociones en las pruebas. La variante de pedido, con todo lo anterior quitado, llegó a Principal en la prueba del 12 de octubre. Gmail decide por destinatario, así que no hay garantía, pero para recuperar pedidos se parte de la variante: un solo enlace, sin imágenes enlazadas, asunto con el código del pedido y remitente con nombre de persona. `expirado.html` queda como referencia.

El envío real del 12 de octubre (16:24, 7 personas más el titular) salió con una versión anterior de la variante que decía "los cuatro días" y "del jueves 5 al domingo 8"; el pase cubre los conversatorios del 6 al 8. La plantilla ya está corregida.

## 6. Cómo saber si funcionó

- A los 7 días: nueva exportación de Pretix y cruce de las 7 personas contra los pedidos pagados (el mismo script: quien compró ya no sale en la lista).
- En GA4, las visitas con `utm_medium=recuperacion`.

## 7. Para otros eventos

El script sirve para cualquier evento de Pretix con la exportación "Lista de pedidos". Lo que cambia por evento es la fecha de `--desde` (la de la política que autoriza el recordatorio) y los textos de las plantillas. Cuando el backend de Eventalist tenga el contacto directo por estado de pedido (`docs/medicion-embudo/diseno.md`), este proceso manual pasa a ser un respaldo.
