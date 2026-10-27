# Interesados · WhatsApp

Personas que pidieron en el sitio que les avisáramos de las boletas y no han comprado. Ya recibieron correo el 19 de octubre. Ahora se les escribe por WhatsApp una vez por semana, con una plantilla distinta cada semana, desde el número colombiano y por la API de Meta.

La lista se arma de nuevo en cada envío: quien compró, tiene un pedido pendiente o dejó vencer uno (ese va en EX) no sale. Plan de la campaña en [`../README.md`](../README.md); qué es cada campo de una plantilla, en [`../../reglas.md`](../../reglas.md).

## Calendario

- **IN1** · martes 27 oct · plantilla `in1_boletas_medio_dia`
- **IN2** · martes 3 nov · plantilla `in2_domingo_en_la_manana` (Mujeres periodistas)

## Antes del primer envío (una sola vez)

- [ ] Crear las dos plantillas en WhatsApp Manager, en la cuenta del **número colombiano**, con el texto exacto de abajo. Categoría Marketing, idioma español. Deben estar aprobadas antes del martes 27.
- [ ] Las llaves de WhatsApp en el llavero ([`../../configuracion.md`](../../configuracion.md)); si ya se hizo para expirados, no hay que repetirlo.

La plantilla anterior, `aviso_boletas_medio_dia`, no se usa: nombra a Daniel Samper Pizano y habla de "franjas". Está al final, como referencia.

## Cada martes

1. Revisar que `scripts/campanas/config/interesados.json` tenga la plantilla de la semana (`in1_boletas_medio_dia` o `in2_domingo_en_la_manana`; ninguna lleva variables).
2. Ver a quién le llegaría:
   ```
   python3 scripts/campanas/campana.py lista interesados
   python3 scripts/campanas/campana.py whatsapp interesados
   ```
3. Probar contigo primero (`--prueba` con tu número) y después enviar:
   ```
   python3 scripts/campanas/campana.py whatsapp interesados --enviar
   ```
4. Ver los totales: `python3 scripts/campanas/campana.py registro interesados`.

En la prueba, revisar en el celular que el botón **Ver boletas** abra la portada y que, al tocar el botón de respuesta, Catalina conteste algo con sentido. Si Meta rechaza un número, queda como fallido y sigue con los demás.

---

## IN1 · `in1_boletas_medio_dia`

Sin variables.

```
Hola. Te escribimos del equipo de Testigos de la Memoria (Eventalist S.A.S.). Nos pediste que te avisáramos de las boletas de medio día, y ya están a la venta.

¿Te imaginas escuchar de cerca a periodistas como María Elvira Samper, Fidel Cano y Yolanda Ruiz, en conversaciones sobre el narcotráfico, las negociaciones de paz y las reelecciones de Uribe y Santos?

Cada boleta de medio día vale $90.000, y el aforo es limitado.

Mira la agenda completa para decidir cuáles te interesan más o, si no te quieres perder nada, llévate el pase de fin de semana que está en descuento!
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de enlace **Ver la agenda** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=interesados&utm_content=plantilla-boletas-medio-dia_agenda#agenda`
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=interesados&utm_content=plantilla-boletas-medio-dia_boletas`
- Botón de respuesta rápida **Tengo una pregunta**.
- **Antes de mandarla a Meta:** el pase de fin de semana tiene que estar a la venta en Pretix, con descuento, el día del envío, porque una plantilla aprobada no se puede editar. Si no alcanza a estar, cambiar la última frase por "…o, si no te quieres perder nada, llévate el Pase completo."

## IN2 · `in2_domingo_en_la_manana`

Sin variables.

```
Hola. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.). ¿Qué le tocaba enfrentar a una mujer al frente de un noticiero cuando casi ninguna lo dirigía? Yolanda Ruiz y María Elvira Samper lo cuentan este domingo en la mañana.

Es el domingo 8 de noviembre en la Hospedería Duruelo, y el aforo es limitado.

Esa conversación entra en la boleta de medio día del domingo en la mañana, de $90.000, o llévate el pase de fin de semana, que está en descuento. ¿Te ayudamos a reservar? Escríbenos por aquí.
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=interesados&utm_content=plantilla-domingo-manana`
- Botón de respuesta rápida **Quiero reservar**.

## Plantillas anteriores (ya no se usan)

El primer aviso por WhatsApp, del 19 de octubre. No se usa: nombra a Daniel Samper Pizano y habla de "franjas".

### `aviso_boletas_medio_dia`

Categoría **Marketing**, idioma español, sin variables (el saludo por nombre queda solo en el correo: un nombre mal escrito en una plantilla no se puede corregir). Nombre: `aviso_boletas_medio_dia`.

```historico
Hola. Te escribimos del equipo de Testigos de la Memoria (Eventalist S.A.S.). Nos pediste que te avisáramos cuando abrieran las boletas de medio día: ya están a la venta.

Son cuatro franjas, del viernes 6 en la tarde al domingo 8 en la mañana, en la Hospedería Duruelo de Villa de Leyva. En cada una, periodistas como Daniel Samper Pizano, Cecilia Orozco, Yolanda Ruiz y Fidel Cano cuentan lo que vieron de cerca y responden tus preguntas.

Si no sabes cuál escoger, escríbenos por aquí y te ayudamos.
```

- Pie: `Para no recibir más mensajes, responde BAJA.`
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=interesados&utm_content=plantilla-aviso`
- Botón de respuesta rápida **Tengo una pregunta**.
