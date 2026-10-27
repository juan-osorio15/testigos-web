# Interesados · correo

Plan de la campaña en [`../README.md`](../README.md). Las reglas de los correos conversacionales, en [`../../reglas.md`](../../reglas.md).

## La plantilla

- Plantilla: `scripts/campanas/plantillas/interesado-texto.html` (desde el 2026-10-26; la anterior, `interesado-aviso.html`, con la fórmula visual, sigue en el historial de git).
- Asunto: "Sobre el aviso que nos pediste" (desde el 2026-10-26; antes, "Tu aviso de Testigos de la Memoria: ya abrieron las boletas de medio día").
- Remitente: `Juan de Testigos de la Memoria <direccion@testigosdelamemoria.com>`, sin la cabecera `List-Unsubscribe`; las respuestas llegan a manager@eventalist.co (desde el 2026-10-26; antes, a hola@eventalist.co).
- Contenido, como correo escrito a mano: el saludo con el nombre, el recordatorio de que la persona pidió el aviso, los cuatro temas con sus panelistas (sin horarios), "Cada uno cuenta en persona lo que vio de cerca, y uno puede hacerles preguntas.", "Si quieres revisar la agenda completa o ver cómo asistir…" con un solo enlace a la portada, los hoteles sin enlace propio, "¿Cuál tema te llama más? Respóndeme y te ayudo a escoger." y la firma de Juan. Pie con la razón del mensaje y la baja.

## Por qué así (Principal y no Promociones)

Decisión del titular del 2026-10-26: los correos de campaña se ven como un correo personal.

- Sin más imagen que el logo sobre terracota, sin botones y sin texto oculto de vista previa.
- Sin precios, descuentos, fechas límite ni la palabra "boletas" (ni "venta" ni "tienda"): el correo antoja con el contenido del evento, y lo comercial queda en la página. Con el descuento y su fecha seguía cayendo en Promociones (pruebas del titular del 2026-10-26).
- Enlace con UTM: se quitaron un rato el 2026-10-26 y el correo siguió cayendo en Promociones, así que volvieron para no perder la medición.
- Un solo enlace, dentro del texto. Nada de redes, WhatsApp ni política enlazados.
- Una pregunta que invita a responder: cada respuesta le enseña a Gmail que el remitente es conversación.
- Remitente con nombre de persona, siempre el mismo, desde el dominio del evento.
- Asunto y primera línea que responden a algo que la persona pidió, con su nombre. Sin precio en el asunto ni palabras de oferta.
- Un correo por persona, enviado uno a uno, sin cabecera de lista masiva, y con versión en texto plano.

Gmail decide por destinatario, así que no hay garantía. La prueba al titular dice dónde cae.

## Si los precios o los panelistas cambian

Los precios salen de `evento.json` (`npm run build` si el script dice que está viejo). Los temas y panelistas están escritos en la plantilla, según `src/data/agenda.ts`: si algo cambia en el sitio, cambiarlo también ahí. Si una boleta de medio día se agota, quitar su tema del correo.

## Comandos

```sh
python3 scripts/campanas/campana.py correo interesados                                          # vista previa
python3 scripts/campanas/campana.py correo interesados --prueba j.a.oso15@gmail.com --enviar   # prueba
python3 scripts/campanas/campana.py correo interesados --enviar                                  # envío real
```

- La vista previa queda en `~/Documents/eventalist/datos/testigos-memoria/previas-interesados/`: revisar el texto y el saludo con el nombre.
- En la prueba, revisar en el celular y en el computador dónde cae (Principal, Promociones o spam) y que el enlace abra la portada.
- Si se corre otra vez, no repite a nadie. Si la lista pasa de 100, Resend frena en el correo 100 del día y el comando se detiene; al día siguiente, el mismo comando sigue con los que faltan.
