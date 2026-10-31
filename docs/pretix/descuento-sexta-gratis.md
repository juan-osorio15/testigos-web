# Descuento "compra 5, la sexta gratis" en Pretix

La campaña: si compras 5 boletas del mismo tipo, la sexta te sale gratis. Máximo una boleta regalada por orden. Se arma con los descuentos automáticos de Pretix, sin plugin.

Estado: idea en estudio (2026-10-30). Primero en `testigos-sandbox`, luego en `testigos-memoria`, y solo con el visto bueno del titular.

## Cómo queda en Pretix

- Un descuento por cada tipo de boleta, para que solo cuenten las del mismo tipo.
- El descuento se activa con 6 boletas iguales en el carrito: las 5 que se pagan y la sexta, que queda en 0.
- Pretix no tiene un campo para limitar cuántas veces se aplica un descuento en una orden. Sin límite, con 12 iguales regalaría 2. Para que sea máximo una, cada boleta queda con un tope de 11 por orden (paso 2).

## Paso 0. Revisar lo que ya hay

1. Entrar a `https://pretix.eventalist.co/control/` con la cuenta de Eventalist.
2. Abrir el evento `testigos-sandbox`.
3. Ir a Productos → Descuentos (Products → Discounts).
4. Si ya hay descuentos en la lista, anotarlos. Pretix los aplica en orden y cada boleta solo puede usarla uno, así que uno que esté más arriba puede impedir que estos se apliquen.

## Paso 1. Crear el descuento de la primera boleta

En Productos → Descuentos, botón "Crear un nuevo descuento" (Create a new discount).

Pestaña General:

1. Nombre interno (Internal name): `5+1 Pase completo`.
2. Activo (Active): marcado.
3. Canales de venta (Sales channels): solo la tienda en línea (Online shop).
4. Disponible desde / hasta (Available from / until): inicio y cierre de la campaña.

Pestaña Condición (Condition):

5. Productos: desmarcar "Aplicar a todos los productos" (Apply to all products) y elegir solo "Pase completo".
6. Contar complementos (Count add-on products): desmarcado.
7. Número mínimo de productos que coinciden (Minimum number of matching products): `6`.
8. Valor bruto mínimo (Minimum gross value of matching products): vacío.
9. Ignorar productos con descuento de un voucher (Ignore products discounted by a voucher): marcado.

Pestaña Beneficio (Benefit):

10. Aplicar el descuento al mismo grupo de productos (Apply discount to same set of products): marcado.
11. Descuento porcentual (Percentual discount on matching products): `100.00`.
12. Aplicar el descuento solo a este número de productos (Apply discount only to this number of matching products): `1`.
13. Aplicar a complementos (Apply to add-on products): desmarcado.
14. Ignorar productos con descuento de un voucher (Ignore products discounted by a voucher): marcado.

Guardar.

Repetir con los mismos valores para cada boleta, cambiando el nombre y el producto:

- `5+1 Pase de fin de semana`: Pase de fin de semana.
- `5+1 Viernes en la tarde`: Viernes en la tarde.
- `5+1 Sábado en la mañana`: Sábado en la mañana.
- `5+1 Sábado en la tarde`: Sábado en la tarde.
- `5+1 Domingo en la mañana`: Domingo en la mañana.

## Paso 2. Tope de 11 por orden

En Productos, abrir cada una de las 6 boletas, pestaña Disponibilidad (Availability), y poner "Cantidad máxima por orden" (Maximum amount per order) en `11`. Guardar.

Con 11 como máximo nunca se llega a 12 iguales, así que la orden recibe a lo sumo una gratis por tipo de boleta.

## Paso 3. Probar en el sandbox

Desde `https://pretix.eventalist.co/eventalist/testigos-sandbox/`, con Wompi de pruebas, y una captura del carrito en cada caso:

1. 6 boletas de Sábado en la tarde: una en 0 y el total de 5.
2. 11 boletas iguales: una en 0.
3. 12 boletas iguales: Pretix no lo deja.
4. 6 boletas iguales con un voucher de descuento: se aplica el voucher y la sexta no sale gratis.
5. Una compra completa de 6 con pago de prueba: orden pagada, llegan las 6 boletas y el correo muestra el total con el descuento.
6. La misma compra desde el widget del sitio local apuntado al sandbox: `PUBLIC_PRETIX_EVENT_URL=https://pretix.eventalist.co/eventalist/testigos-sandbox/ npm run dev`.

## Paso 4. Pasar a producción

Con las pruebas bien y el visto bueno del titular:

1. Repetir los pasos 1 y 2 en el evento `testigos-memoria`.
2. Hacer el caso 1 del paso 3 sin pagar y vaciar el carrito.
3. Recorrer `docs/copias-externas.md`: textos de Pretix, ficha del chatbot y campañas.

## Enlaces de la campaña

Campaña `sexta-gratis`, con las reglas de `docs/medicion/embudo/enlaces-y-nombres.md`.

Difusión orgánica de Juan Osorio:

- WhatsApp (mensajes, grupos y estados):
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=aliados&utm_campaign=sexta-gratis&utm_content=persona-juan-osorio`
- Instagram:
  `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=aliados&utm_campaign=sexta-gratis&utm_content=persona-juan-osorio`
- Facebook:
  `https://testigosdelamemoria.com/?utm_source=facebook&utm_medium=aliados&utm_campaign=sexta-gratis&utm_content=persona-juan-osorio`
- LinkedIn:
  `https://testigosdelamemoria.com/?utm_source=linkedin&utm_medium=aliados&utm_campaign=sexta-gratis&utm_content=persona-juan-osorio`

## Cómo apagarla

Desmarcar "Activo" en cada uno de los 6 descuentos y devolver la cantidad máxima por orden de cada boleta a como estaba (anotarla en el paso 2). Las órdenes ya pagadas no cambian.

## Fuentes

- Guía de descuentos de Pretix: `https://docs.pretix.eu/guides/products/discounts/`
- Algoritmo de precios: `https://docs.pretix.eu/dev/development/algorithms/pricing.html`
- Modelo del descuento en el código: `https://github.com/pretix/pretix/blob/master/src/pretix/base/models/discount.py`
