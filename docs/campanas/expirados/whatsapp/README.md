# Expirados · WhatsApp

Personas que empezaron una compra, dejaron vencer la reserva y nunca compraron. Ya recibieron correo (12 y 19 de octubre). Ahora se les escribe por WhatsApp una vez por semana, con una plantilla distinta cada semana, desde el número colombiano y por la API de Meta.

Solo reciben WhatsApp quienes lo autorizaron en la tienda (lo decide el backend). La lista se arma de nuevo en cada envío: quien compró en el camino ya no sale. Plan de la campaña en [`../README.md`](../README.md); qué es cada campo de una plantilla, en [`../../reglas.md`](../../reglas.md).

Va por dos caminos: las plantillas semanales por la API de Meta, con `campana.py`, y la importación diaria a respond.io, para que también les lleguen los broadcasts.

## Calendario

- **EX1** · martes 27 oct · plantilla `ex1_pedido_vencido`
- **EX2** · martes 3 nov · plantilla `ex2_sabado_en_la_tarde` (Narcotráfico)

## Antes del primer envío (una sola vez)

- [ ] Crear las dos plantillas en WhatsApp Manager, en la cuenta del **número colombiano**, con el texto exacto de abajo. Categoría Marketing, idioma español. Deben estar aprobadas antes del martes 27.
- [ ] Confirmar que el llavero apunta al número colombiano (servicios `eventalist-whatsapp` y `eventalist-whatsapp-cuenta`, y `WHATSAPP_PHONE_ID` si la cuenta tiene más de un número). Pasos en [`../../configuracion.md`](../../configuracion.md).
- [ ] Confirmar que las respuestas le llegan al agente.

La plantilla anterior, `pedido_expirado_ayuda`, no se usa: nombra a Daniel Samper Pizano.

## Cada martes

1. Revisar que `scripts/campanas/config/expirados.json` tenga la plantilla de la semana:
   - EX1: `"plantilla": "ex1_pedido_vencido"`, `"variables": ["primer_nombre", "codigo"]`
   - EX2: `"plantilla": "ex2_sabado_en_la_tarde"`, `"variables": ["primer_nombre"]`
2. Ver a quién le llegaría:
   ```
   python3 scripts/campanas/campana.py lista expirados
   python3 scripts/campanas/campana.py whatsapp expirados
   ```
3. Probar contigo primero (`--prueba` con tu número) y después enviar:
   ```
   python3 scripts/campanas/campana.py whatsapp expirados --enviar
   ```
4. Ver los totales: `python3 scripts/campanas/campana.py registro expirados`.

Detalles del envío:

- El comando lee la plantilla en Meta y confirma que está aprobada. Si dice que no está en el idioma `es`, cambiar `idioma` en la configuración por el que muestra (por ejemplo `es_CO`).
- En la prueba, revisar en el celular que el botón **Ver boletas** abra la portada y que, al tocar el botón de respuesta, Catalina conteste algo con sentido.
- Si Meta rechaza un número (no tiene WhatsApp, o Meta frena el marketing a esa persona), queda como fallido y sigue con los demás. Si rechaza el token, los permisos o la plantilla, se detiene sin enviar a nadie más.
- Si se corre otra vez, no repite a nadie; a los fallidos sí lo intenta de nuevo, así que no conviene correrlo otra vez el mismo día solo por ellos.

## Importación diaria a respond.io

Todos los días, para que quien expiró entre a respond.io con la etiqueta de la campaña y le lleguen los broadcasts (por ejemplo, los de `cierre-descuento`):

```sh
python3 scripts/campanas/campana.py respondio expirados
```

Deja el CSV en `~/Downloads`, con la etiqueta `expirados-<fecha>`. Importarlo en respond.io.

---

## EX1 · `ex1_pedido_vencido`

Variables: `{{1}}` primer nombre (`primer_nombre`; ejemplo para Meta: `Ana`) y `{{2}}` código del pedido (`codigo`; ejemplo: `ABC12`). Si alguien de la lista no tiene nombre, el script se detiene antes de enviar: revisar la lista.

```
Hola, {{1}}. Te escribimos del equipo de Testigos de la Memoria (Eventalist S.A.S.). Tu pedido {{2}} no alcanzó a completarse y la reserva se venció.

¿Te imaginas escuchar de cerca a Yolanda Ruiz, María Elvira Samper, Fidel Cano o Cecilia Orozco contando lo que vivieron cubriendo los últimos cincuenta años de Colombia, y poder hacerles una pregunta? El aforo es limitado y todavía queda cupo para ti.

Ahora hay dos formas más de venir: el pase de fin de semana, con descuento, para todos los conversatorios del sábado y el domingo, o una boleta de medio día por $90.000.

¿Tuviste algún problema con el pago? Escríbenos por aquí y te ayudamos.
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=expirados&utm_content=plantilla-pedido-vencido`
- Botón de respuesta rápida **Necesito ayuda**.

## EX2 · `ex2_sabado_en_la_tarde`

Variable `{{1}}`: primer nombre (`primer_nombre`; ejemplo para Meta: `Ana`).

```
Hola, {{1}}. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.). ¿Cómo se investiga a quien puede mandar a matar al investigador? Martha Soto, de la Unidad Investigativa de El Tiempo, lo cuenta con Luz María Sierra el sábado 7 de noviembre en la tarde.

Es en la Hospedería Duruelo, y el aforo es limitado.

Esa conversación entra en la boleta de medio día del sábado en la tarde, de $90.000, o llévate el pase de fin de semana, que está en descuento. ¿Te ayudamos a reservar? Escríbenos por aquí.
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=expirados&utm_content=plantilla-sabado-tarde`
- Botón de respuesta rápida **Quiero ayuda**.

## Plantillas anteriores (ya no se usan)

### `pedido_expirado_ayuda`

Aprobada por Meta el 2026-10-16 y enviada a quien tenía pedido desde el 9 de octubre. No se usa: nombra a Daniel Samper Pizano. Categoría Marketing, español; la exportación de Pretix no traía nombres, así que no saludaba por nombre. Variable `{{1}}`: código del pedido.

```historico
Hola. Te escribimos del equipo de Testigos de la Memoria (Eventalist S.A.S.). Tu pedido {{1}} de boletas no alcanzó a completarse y la reserva se venció.

Del 6 al 8 de noviembre, en la Hospedería Duruelo, en lo alto de Villa de Leyva, Daniel Samper Pizano, Cecilia Orozco, Yolanda Ruiz, Fidel Cano y otros periodistas que cubrieron los últimos cincuenta años de Colombia cuentan en persona lo que vieron de cerca: el Bogotazo, el Caguán y La Habana, el narcotráfico, los magnicidios. Y responden tus preguntas.

¿Tuviste algún problema con el pago? Escríbenos por aquí y te ayudamos a terminar la compra.
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=recuperacion&utm_campaign=expirados-2026`
- Botón de respuesta rápida **Necesito ayuda**.
