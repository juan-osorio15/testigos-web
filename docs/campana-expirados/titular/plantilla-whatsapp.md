# Mandar el WhatsApp a los pedidos expirados

Solo a quien hizo el pedido desde el 2026-10-09 (columna `desde_fecha = si` de la lista; hoy 2 personas). Contexto y texto en `../plan.md`.

## Paso 0. Saber desde dónde se manda

Depende de cómo está conectado el número de WhatsApp del encuentro:

- **Si el número se usa en la app WhatsApp Business del celular** (el chatbot no lo ocupa): no hace falta plantilla ni aprobación de Meta. Se escribe a mano desde la app, ir directo al paso 4.
- **Si el número está conectado a la API** (lo atiende el chatbot y ya no se puede abrir en la app): hace falta la plantilla aprobada. Seguir los pasos 1 a 3.

Cómo saberlo: si en `https://business.facebook.com/wa/manage/home/` aparece el número con estado "Conectado" en la API, es el segundo caso.

## Paso 1. Crear la plantilla en Meta

- [ ] Entrar a `https://business.facebook.com/wa/manage/message-templates/` con la cuenta del portafolio "Testigos de la Memoria" y elegir la cuenta de WhatsApp del encuentro.
- [ ] **Crear plantilla**.
- [ ] Categoría: **Marketing** → tipo **Personalizado** (Default / Custom).
- [ ] Nombre: `pedido_expirado_ayuda`
- [ ] Idioma: **Español**.
- [ ] Tipo de variable: **Número** (así queda `{{1}}`).
- [ ] Encabezado: ninguno.
- [ ] Cuerpo, pegar tal cual:

```
Hola. Te escribimos del equipo de Testigos de la Memoria (Eventalist S.A.S.). Tu pedido {{1}} de boletas para el encuentro del 5 al 8 de noviembre en Villa de Leyva no alcanzó a completarse y la reserva se venció. ¿Tuviste algún problema con el pago? Si quieres, te ayudamos por aquí a terminar la compra.
```

- [ ] Ejemplo de la variable `{{1}}`: `ABC12`
- [ ] Pie de página: `Para no recibir más mensajes, responde BAJA.`
- [ ] Botones:
  - **Ir al sitio web**, texto `Ver boletas`, URL estática:
    `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=recuperacion&utm_campaign=expirados-2026#boletas`
  - **Respuesta rápida personalizada**, texto `Necesito ayuda`
- [ ] **Enviar para revisión**.

## Paso 2. Esperar la aprobación

- Suele tardar desde minutos hasta 24 horas; a veces un poco más con una cuenta nueva. El estado se ve en la misma lista de plantillas: "En revisión", "Activa" o "Rechazada".
- Si la rechazan: abrir el motivo y avisar. No editar y reenviar a ciegas, porque cada edición vuelve a empezar la revisión.
- Mientras tanto se puede mandar el correo (`correo-resend.md`); no depende de esto.

## Paso 3. Enviar con la plantilla aprobada

Desde la herramienta que maneja el número (la plataforma del chatbot o el envío de plantillas de WhatsApp Manager):

- [ ] Sacar la lista del día (paso 3 de `correo-resend.md`) y tomar solo las filas con `desde_fecha = si`.
- [ ] Confirmar en Pretix que el pedido de cada una aceptó la casilla `tienda-2026-10-09` y sigue sin comprar.
- [ ] Destino: columna `whatsapp` (número con 57 adelante). Variable `{{1}}`: el último código de la columna `pedidos`.
- [ ] En horario: lunes a viernes de 7:00 a. m. a 7:00 p. m., sábados de 8:00 a. m. a 3:00 p. m.; no domingos ni festivos. Y no el mismo día que el correo.

## Paso 4. Si se manda a mano desde la app

- [ ] Mismo texto del cuerpo, con el código del pedido en vez de `{{1}}`, el enlace de "Ver boletas" al final y la línea de BAJA.
- [ ] Un mensaje por persona, en horario, no el mismo día que el correo.

## Paso 5. Después

- [ ] Si alguien responde: atenderlo en la conversación y mandarle el enlace de compra.
- [ ] Quien responda BAJA o "no me interesa": anotarlo y no volver a escribirle por ningún canal.
- [ ] Nada de un segundo WhatsApp.
