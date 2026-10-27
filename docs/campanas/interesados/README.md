# Interesados · IN

Plan del 19 de octubre de 2026. Objetivo: escribirle a quien se inscribió en el sitio para que le avisáramos cuando abrieran las boletas de medio día (el botón "Avísame cuando esté disponible" de cada franja), contarle que ya están a la venta y llevarlo a la tienda. A quien ya compró no se le escribe.

Este documento es el plan. Los textos y los pasos de cada medio: [`correo/`](correo/) y [`whatsapp/`](whatsapp/). No lleva datos personales (el repositorio es público): la lista sale de `scripts/campanas/campana.py` y se guarda fuera del repo.

## 1. Quiénes

Las personas que dejaron nombre, teléfono y correo en el modal "Avísame" de las franjas, desde que la tienda quedó en la portada (9 de septiembre) hasta que abrió la etapa 2 (13 de octubre). El formulario las mandó al backend de Eventalist (campaña `testigos-de-la-memoria-2026`, origen `website`).

Quedan fuera:

- Quien ya pagó o tiene un pedido pendiente en Pretix (por correo **o** por teléfono, igual que en expirados).
- Quien dejó expirar un pedido: le escribe la campaña de expirados, con un mensaje pensado para su caso.
- Quien se dio de baja en el backend. Si se dio de baja de un solo canal, sale sin ese dato.
- Quien se inscribió antes del 9 de septiembre en la lista general de la preventa ("te escribiremos en cuanto abra la venta"). Si el titular decide incluirlos, se cambia `desde` en `scripts/campanas/config/interesados.json`.

El backend no guarda **qué franja** pidió cada persona: el formulario solo manda nombre, correo, teléfono y la campaña. Por eso el mensaje presenta las cuatro franjas y no nombra una.

### Cómo se saca la lista

```sh
python3 scripts/campanas/campana.py lista interesados
```

La campaña es `scripts/campanas/config/interesados.json` y sus reglas, `scripts/campanas/audiencias/interesados.py` (cómo encaja todo: `docs/campanas/README.md`). El comando:

- Pide al backend los contactos de la campaña con origen `website`, por el endpoint de lectura (en producción desde el 2026-10-19; el prompt que se le pasó está en `../historial/prompt-backend-contactos.md`).
- Pide a Pretix todos los pedidos del evento con el token de solo lectura que ya usa la campaña de expirados.
- Descarta según la lista de arriba y comprueba al final que nadie de la salida comparta correo o teléfono con un pedido; si pasa, se detiene.
- Arma el saludo de cada persona con su primer nombre ("Hola, Ana."). Si el nombre no parece un nombre (números, una letra), queda "Hola.".
- Agrega al final al equipo desde `scripts/campanas/incluir.local.csv`.
- Guarda la lista en `~/Documents/eventalist/datos/testigos-memoria/interesados-<fecha-hora>.csv`.

Los comandos de envío vuelven a armarla en el momento: alguien puede comprar entre el correo y el WhatsApp. El 19 de octubre a las 12:25 la lista tenía 18 personas, todas con correo y WhatsApp.

## 2. Qué permite la política de datos

- La casilla del formulario siempre nombró los dos canales. Desde el 4 de septiembre dice: "autorizo a Eventalist a tratar mis datos para enviarme información del encuentro y de otros eventos por correo electrónico y WhatsApp".
- **Decisión del titular (2026-10-19):** se le escribe a todo inscrito, sin separar por versión de la política. Son personas que pidieron este aviso; no habérselo mandado el 13 de octubre fue un error nuestro.
- Horario de la Ley 2300, hora de Bogotá: lunes a viernes de 7:00 a. m. a 7:00 p. m., sábados de 8:00 a. m. a 3:00 p. m., nunca domingos ni festivos. El comando se niega a enviar fuera de ese horario. El lunes 2 de noviembre es festivo.
- Cada mensaje identifica a Eventalist S.A.S. y trae cómo darse de baja (BAJA).
- Decisión del titular (2026-10-19): sin límite de mensajes por persona ni por día; se escribe por todos los canales. El límite anterior de dos venía del dictamen del abogado del 2026-10-12. El comando no repite un mismo mensaje. Quien pida la baja no vuelve a recibir nada por ningún canal.
- Sin urgencia ni cuenta regresiva. El precio sí va: es información que la persona pidió.
- Pie: solo "Eventalist S.A.S. · hola@eventalist.co". Nunca la dirección física ni datos personales del titular.

## 3. Secuencia

1. **Correo** a todos los de la lista con correo ([`correo/`](correo/)).
2. **WhatsApp**, el mismo día o después, a quien tenga WhatsApp y no haya comprado, con la lista sacada de nuevo ese día. Requiere que Meta apruebe la plantilla ([`whatsapp/`](whatsapp/); suele tardar de minutos a un día).
3. Si alguien responde, se le atiende en la conversación.
4. Sin límite de mensajes por persona: si hace falta otro, es una plantilla nueva.

## 4. Medición

- Campaña `interesados` (anotada en `docs/medicion/embudo/enlaces-y-nombres.md`).
- Correo: `utm_source=email&utm_medium=email&utm_campaign=interesados&utm_content=correo-aviso_conversacional`. Antes: `correo-aviso` y `correo-aviso_boton-final` (plantilla de diseño).
- WhatsApp: `utm_source=whatsapp&utm_medium=mensaje&utm_campaign=interesados&utm_content=plantilla-aviso`.
- A los 7 días: `python3 scripts/campanas/campana.py lista interesados`. Quien compró ya no sale; la diferencia contra la lista del envío es la conversión de la campaña. En GA4, las visitas y compras con `utm_campaign=interesados`.

## 5. Para otros eventos

Para otro evento basta con copiar `scripts/campanas/config/interesados.json` y cambiar el evento, la campaña del backend, `desde` (el día en que abrió el formulario que interesa) y las plantillas (ver `docs/campanas/README.md`). Si el formulario del sitio llegara a mandar la franja o la boleta que la persona pidió (por ejemplo en `source_detail`), el correo podría nombrarla; hoy no se guarda.
