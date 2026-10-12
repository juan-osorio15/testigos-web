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

Dictamen del abogado interno del 12 de octubre de 2026, sobre la política vigente desde el 2026-10-09 (finalidad h) y párrafo de canales de la sección 3) y la anterior, vigente desde el 2026-09-17.

### Grupo A · pedidos desde el 2026-10-09 (`desde_fecha = si`, hoy 2 personas)

Cubiertos por la finalidad h): un pedido expirado es un pedido no pagado mientras la venta está abierta. El mensaje es **comercial**, así que:

- Antes de enviar, confirmar en Pretix que cada pedido aceptó la casilla versión `tienda-2026-10-09`. Lo que cuenta es la casilla aceptada, no la fecha. Si un pedido no la tiene, esa persona pasa al grupo B.
- Identifica a Eventalist S.A.S. y al encuentro.
- Trae cómo darse de baja: "Para no recibir más mensajes, responde BAJA" en WhatsApp; un enlace de un clic en el correo.
- Máximo **dos toques en total**: un WhatsApp y, en **otra semana**, un correo. Un mensaje al día como mucho.

### Grupo B · pedidos antes del 2026-10-09 (`desde_fecha = no`, hoy 5 personas)

Aceptaron una política que decía que los datos de la compra no se usan para publicidad, y no autorizaron WhatsApp.

- **Nada de WhatsApp.**
- **Un solo correo de servicio** (finalidad e: atender solicitudes del comprador sobre su pedido), sin seguimiento. Debe ser neutro: pregunta si hubo un problema con el pago e invita a responder.
- Prohibido en ese correo: precio, descuentos, códigos, la etapa 1 o el cambio de etapa del 13 de octubre, "últimas boletas", "no te lo pierdas", "aún estás a tiempo", botón de compra destacado. Un enlace simple a la tienda solo como forma de reintentar el pago.
- No entran a la base de contactos.
- La debilidad: la SIC juzga por el contenido, no por la etiqueta. Si el negocio no depende de estas 5 personas, lo más prudente es no escribirles.

### Para los dos grupos

- Horario de la Ley 2300, hora de Bogotá: lunes a viernes de 7:00 a. m. a 7:00 p. m., sábados de 8:00 a. m. a 3:00 p. m., nunca domingos ni festivos. El lunes 12 de octubre de 2026 es festivo.
- Pendiente de confirmar si el Registro de Números Excluidos de la CRC cubre WhatsApp. Mientras no se confirme, a un número inscrito solo se le escribe por correo.
- Nada de urgencia por el cambio de etapa (además, ver la memoria de tono: el evento no se vende con presión).

## 3. Secuencia

Con 7 personas esto se hace a mano, sin automatizar. Antes de cada paso: nueva exportación de Pretix y volver a correr el script.

**Grupo A**

1. Semana 1, día hábil y en horario: **WhatsApp** con la plantilla de la sección 4.
2. Si responde: se le atiende en la conversación (dentro de las 24 horas de servicio se escribe libremente) y se le manda el enlace de compra.
3. Semana 2: **correo** (sección 5) solo a quien no respondió, no compró y no pidió la baja. También a quien no tenga WhatsApp (la plantilla no se entrega).
4. Fin.

**Grupo B** (solo si se decide escribirles)

1. Un **correo de servicio** (sección 5), en horario. Fin.

Quien responda BAJA, "no me interesa" o algo parecido se anota para no volver a escribirle por ningún canal.

## 4. Plantilla de WhatsApp para crear en Meta (solo grupo A)

Se crea en el WhatsApp Manager de la cuenta de WhatsApp Business del encuentro, idioma español, categoría **Marketing** (es comercial; si se manda como Utilidad, Meta la recategoriza). La exportación de Pretix no trae nombres, así que no saluda por nombre.

### `pedido_expirado_ayuda`

> Hola. Te escribimos del equipo de Testigos de la Memoria (Eventalist S.A.S.). Tu pedido {{1}} de boletas para el encuentro del 5 al 8 de noviembre en Villa de Leyva no alcanzó a completarse y la reserva se venció. ¿Tuviste algún problema con el pago? Si quieres, te ayudamos por aquí a terminar la compra.
>
> Para no recibir más mensajes, responde BAJA.

- Variable {{1}}: código del pedido (columna `pedidos`, el último). Ejemplo para la revisión de Meta: `ABC12`.
- Botón de enlace: "Ver boletas" → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=recuperacion&utm_campaign=expirados-2026#boletas`
- Botón de respuesta rápida: "Necesito ayuda".
- Botón de exclusión de marketing que ofrece Meta ("Detener promociones"), además del BAJA en el texto.

Sin precio, sin descuentos, sin mencionar la etapa. El enlace siempre con `https://` explícito (en Colombia el sitio no responde por HTTP).

## 5. Correos

Desde hola@eventalist.co, uno por persona (nunca varios en el mismo envío).

### Grupo A · correo de la semana 2

**Asunto:** Tu pedido de Testigos de la Memoria

> Hola:
>
> Te escribimos del equipo de Testigos de la Memoria. Tu pedido {código} de boletas no alcanzó a completarse y la reserva se venció.
>
> Si tuviste algún problema con el pago, respóndenos este correo o escríbenos por WhatsApp y te ayudamos a terminar la compra. Las boletas están en https://testigosdelamemoria.com/?utm_source=email&utm_medium=recuperacion&utm_campaign=expirados-2026#boletas
>
> Equipo de Testigos de la Memoria · Eventalist S.A.S.
>
> [No quiero recibir más mensajes](mailto:hola@eventalist.co?subject=BAJA)

### Grupo B · correo de servicio único

**Asunto:** Tu pedido {código} de Testigos de la Memoria

> Hola:
>
> Te escribimos del equipo de Testigos de la Memoria. Tu pedido {código} de boletas no se completó y la reserva se venció. Queremos saber si tuviste algún problema con el pago, para revisarlo.
>
> Si fue así, respóndenos este correo y te ayudamos. Si quieres volver a intentar el pago, puedes hacerlo en https://testigosdelamemoria.com/#boletas
>
> Equipo de Testigos de la Memoria · Eventalist S.A.S.

Sin UTM de campaña, sin precio, sin fechas de etapa y sin seguimiento.

## 6. Cómo saber si funcionó

- A los 7 días: nueva exportación de Pretix y cruce de las 7 personas contra los pedidos pagados (el mismo script: quien compró ya no sale en la lista).
- En GA4, las visitas con `utm_medium=recuperacion`.

## 7. Para otros eventos

El script sirve para cualquier evento de Pretix con la exportación "Lista de pedidos". Lo que cambia por evento es la fecha de `--desde` (la de la política que autoriza el recordatorio) y los textos de las plantillas. Cuando el backend de Eventalist tenga el contacto directo por estado de pedido (`docs/medicion-embudo/diseno.md`), este proceso manual pasa a ser un respaldo.
