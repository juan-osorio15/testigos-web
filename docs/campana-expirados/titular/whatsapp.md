# Mandar el WhatsApp a los pedidos expirados

La plantilla `pedido_expirado_ayuda` ya está aprobada por Meta (2026-10-16). Esta guía es para enviarla. Contexto y reglas en `../plan.md`.

Solo va a quien hizo el pedido desde el 2026-10-09 (columna `desde_fecha = si` de la lista): la casilla anterior no autorizaba WhatsApp.

## Paso 1. Sacar la lista del día

Justo antes de enviar, no antes: alguien puede haber comprado desde la última vez.

- [ ] En Pretix: evento `testigos-memoria` → **Pedidos** → **Exportar** → **Lista de pedidos** → CSV. Queda en Descargas como `testigos-memoria_orders.csv` (si ya había uno, borrar el viejo antes para que no quede con otro nombre).
- [ ] En la terminal de VS Code, en la carpeta `testigos-web`:

```sh
python3 scripts/pretix/expirados_sin_compra.py ~/Downloads/testigos-memoria_orders.csv -o ~/Downloads/expirados-hoy.csv --desde 2026-10-09
```

- [ ] Leer el resumen: dice cuántas personas tienen pedido desde el 2026-10-09. Esas son las del WhatsApp.
- [ ] Abrir `~/Downloads/expirados-hoy.csv` y quedarse solo con las filas `desde_fecha = si`. Tu fila va al final (`prueba = si`, pedido `PRUEBA`).

## Paso 2. Revisar a cada persona en Pretix

Por cada fila con `desde_fecha = si` (menos la tuya):

- [ ] Buscar en Pretix el último código de la columna `pedidos` y abrir el pedido.
- [ ] Confirmar que aceptó la casilla de la política `tienda-2026-10-09`. Si no aparece aceptada, esa persona no recibe WhatsApp.
- [ ] Confirmar que no respondió BAJA ni pidió no recibir mensajes al correo del 12 de octubre (revisar hola@eventalist.co). Si lo pidió, fuera.

Quien recibió el correo del 12 de octubre llega con este WhatsApp al segundo y último mensaje. Nada más después.

## Paso 3. Revisar el horario

Ley 2300, hora de Bogotá:

- Lunes a viernes de 7:00 a. m. a 7:00 p. m.
- Sábados de 8:00 a. m. a 3:00 p. m.
- Nunca domingos ni festivos.

No mandarlo el mismo día que un correo a la misma persona.

## Paso 4. Mandarte la prueba a ti

En la plataforma que maneja el número de WhatsApp del encuentro (la del chatbot), donde se envían plantillas o campañas:

- [ ] Nueva campaña o envío de plantilla → plantilla `pedido_expirado_ayuda`, idioma español.
- [ ] Destinatario: solo tu número (columna `whatsapp` de tu fila).
- [ ] Variable `{{1}}`: `PRUEBA`.
- [ ] Enviar y revisar en el celular:
  - Que llegue con el nombre de Testigos de la Memoria.
  - Que el botón **Ver boletas** abra la tienda en `testigosdelamemoria.com` en la sección de boletas.
  - Que el botón **Necesito ayuda** llegue como respuesta a la conversación y la atienda el chatbot o una persona.

Si algo de esto falla, parar y avisar antes de mandarle a nadie más.

## Paso 5. Enviar de verdad

Un envío por persona, para que cada una reciba su propio código de pedido:

- [ ] Destinatario: columna `whatsapp` (número con 57 adelante, sin `+` ni espacios).
- [ ] Variable `{{1}}`: el último código de la columna `pedidos` de esa persona.
- [ ] Revisar número y código antes de cada envío. Un código equivocado le muestra a alguien el pedido de otra persona.

Si la plataforma pide subir los contactos en un archivo, armar uno nuevo en Descargas con solo dos columnas, `telefono` y `codigo`, y una fila por persona. No reutilizar `expirados-hoy.csv` completo: lleva correos y datos que la plataforma no necesita.

- [ ] Anotar en `~/Downloads/envios-whatsapp-expirados.csv` cada envío: número, código y fecha y hora. Así no se le escribe dos veces a nadie si el envío se repite otro día.

## Paso 6. Después

- [ ] En la plataforma, revisar el estado de cada mensaje (enviado, entregado, leído, fallido). Si alguno falla, no reintentar con otro número ni por otro canal.
- [ ] Quien responda: atenderlo en la conversación. Durante 24 horas desde su respuesta se le puede escribir libremente; mandarle el enlace de compra y ayudarle con el pago.
- [ ] Quien responda BAJA o "no me interesa": anotarlo y no volver a escribirle por ningún canal.
- [ ] Nada de un segundo WhatsApp.
- [ ] Los archivos de Descargas (`expirados-hoy.csv`, `envios-whatsapp-expirados.csv` y el de contactos si se armó) tienen datos personales: borrarlos cuando termine la campaña. Nunca se suben al repo.
- [ ] A los 7 días: nueva exportación y volver a correr el script. Quien compró ya no sale en la lista. En GA4, las visitas con `utm_source=whatsapp` y `utm_medium=recuperacion`.

## La plantilla aprobada, como referencia

Nombre `pedido_expirado_ayuda`, categoría Marketing, español. Si el texto aprobado en Meta difiere de este, manda el de Meta.

```
Hola. Te escribimos del equipo de Testigos de la Memoria (Eventalist S.A.S.). Tu pedido {{1}} de boletas no alcanzó a completarse y la reserva se venció.

Del 6 al 8 de noviembre, en la Hospedería Duruelo, en lo alto de Villa de Leyva, Daniel Samper Pizano, Cecilia Orozco, Yolanda Ruiz, Fidel Cano y otros periodistas que cubrieron los últimos cincuenta años de Colombia cuentan en persona lo que vieron de cerca: el Bogotazo, el Caguán y La Habana, el narcotráfico, los magnicidios. Y responden tus preguntas.

¿Tuviste algún problema con el pago? Escríbenos por aquí y te ayudamos a terminar la compra.
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=recuperacion&utm_campaign=expirados-2026#boletas`
- Botón de respuesta rápida **Necesito ayuda**.
