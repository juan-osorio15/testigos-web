# Lista de Fernando · correo

La invitación de Fernando Cordovez a sus contactos personales, por correo, firmada por él y desde `direccion@testigosdelamemoria.com`. Va con la misma campaña de medición que su WhatsApp (`utm_campaign=lista-fernando`, con `utm_medium=email` como todo correo).

- Configuración: `scripts/campanas/config/agenda-fernando.json`. Plantilla: `scripts/campanas/plantillas/agenda-fernando.html`. Asunto: "Te invito a Testigos de la Memoria, en Villa de Leyva".
- Audiencia `agenda` (`scripts/campanas/audiencias/agenda.py`): los CSV de Google Contacts que él comparta, en `~/Documents/eventalist/datos/testigos-memoria/agenda-fernando/`. No entran al backend ni a ninguna otra campaña, y la carpeta se borra al terminar el evento.
- Solo correo: a estos contactos nunca se les escribe por WhatsApp desde el número del encuentro. Fuera quien ya compró, tiene un pedido pendiente o se dio de baja del correo en el backend.

## Comandos

```sh
python3 scripts/campanas/campana.py lista agenda-fernando
python3 scripts/campanas/campana.py correo agenda-fernando                                          # vista previa
python3 scripts/campanas/campana.py correo agenda-fernando --prueba j.a.oso15@gmail.com --enviar   # prueba
python3 scripts/campanas/campana.py correo agenda-fernando --enviar                                  # envío real
```

Resend manda 100 correos al día entre todas las campañas. Si la agenda pasa de eso, se repite el mismo comando cada día y sigue con los que faltan. Los días de `cierre-descuento`, primero el cierre.

## Carta de Fernando (desde el 27 de octubre de 2026)

El 27 de octubre sus contactos entraron al backend de Eventalist, en la campaña `testigos-de-la-memoria-2026` con origen `referral`. Casi todos son conocidos directos de Fernando; unos pocos vienen de Conexión Zaquencipá, otro proyecto suyo. La agenda de arriba (`agenda-fernando`) nunca se mandó y queda reemplazada por esta carta.

En el backend, su `source_detail` dice "Contactos personales de Fernando - sin autorización escrita", pero el titular confirmó el 27 de octubre que sí hay autorización. Por eso el backend los marca como alcanzables por correo y la carta les sale.

- Configuración: `scripts/campanas/config/carta-fernando.json`. Plantilla: `scripts/campanas/plantillas/carta-fernando.html`. Asunto: "Quería contártelo yo mismo". Remitente: `Fernando Cordovez <direccion@testigosdelamemoria.com>`; las respuestas llegan a manager@eventalist.co.
- Conversacional (las reglas de correo de `../../reglas.md`): sin precios, botones ni fechas límite, un solo enlace y una pregunta para responder. Como puede llegarle a gente que no conoce el encuentro, cuenta el evento completo y no una sola charla.
- Audiencia `interesados` con dos orígenes: `referral` (sus contactos) y `website` (los inscritos del sitio, que ese día la reciben en vez de CD1). Fuera quien compró, tiene un pedido pendiente o lo dejó expirar, y quien no autorizó el correo o se dio de baja. El pie dice por qué le escribimos a cada uno según su origen (`motivos` en la configuración).
- Medición: `utm_source=email&utm_medium=email&utm_campaign=lista-fernando&utm_content=correo-carta_conversacional`.

Son unos 300 correos y Resend manda 100 al día entre todo, así que va por tandas, siempre después de los correos de `cierre-descuento` del día:

```sh
python3 scripts/campanas/campana.py lista carta-fernando                                          # quiénes y cuántos
python3 scripts/campanas/campana.py correo carta-fernando --maximo 80                             # vista previa de la tanda
python3 scripts/campanas/campana.py correo carta-fernando --prueba j.a.oso15@gmail.com --enviar # prueba
python3 scripts/campanas/campana.py correo carta-fernando --maximo 80 --enviar                    # la tanda
```

Cada vez que se corre con `--enviar` sigue con los siguientes, sin repetir a quien ya la recibió. La tanda se ajusta a lo que quede del día: 100 menos lo que ya salió (las pruebas también cuentan).

## Últimos días (4 de noviembre de 2026)

La misma voz de la carta, a la misma base: `carta-fernando-ultimos-dias`, unos 300 correos en un solo envío, con Resend en plan pago. Dice "este fin de semana" y no da ningún día ni fecha de inicio, a propósito (titular, 2026-11-04): el foco son las boletas pagas, y quien oye "jueves" piensa que no alcanza porque trabaja. Sin precios: nombra las boletas de medio día y lo demás queda en la página.

- Configuración: `scripts/campanas/config/carta-fernando-ultimos-dias.json`. Plantilla: `scripts/campanas/plantillas/carta-fernando-ultimos-dias.html`. Asunto: "Ya es este fin de semana".
- Medición: `utm_source=email&utm_medium=email&utm_campaign=lista-fernando&utm_content=correo-carta_ultimos-dias`.

```sh
python3 scripts/campanas/campana.py correo carta-fernando-ultimos-dias                                          # vista previa
python3 scripts/campanas/campana.py correo carta-fernando-ultimos-dias --prueba j.a.oso15@gmail.com --enviar  # prueba
python3 scripts/campanas/campana.py correo carta-fernando-ultimos-dias --enviar                                 # envío real
```
