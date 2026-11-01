# Familia · el precio de tu etapa para los tuyos

Quien compró en la etapa 1 o en la etapa 2 recibe un código propio para que su familia compre su mismo pase al precio que él pagó. Es un voucher de Pretix por persona: el sitio y la tienda no cambian.

Estado: código listo y probado con datos reales (2026-11-01). Faltan tus decisiones, los vouchers en Pretix y las plantillas. Nada se ha creado en Pretix ni se ha enviado.

## Quién entra

Lo arma `scripts/campanas/audiencias/familia.py` con los pedidos de Pretix. Al 2026-11-01:

- **`familia-etapa1`**: pedidos pagados con Pase Completo hasta el 12 de octubre. 57 boletas, todas a 310.000, de 35 personas (35 con correo, 20 con WhatsApp autorizado).
- **`familia-etapa2`**: pedidos pagados con Pase Fin de Semana del 13 al 29 de octubre. 7 boletas, todas a 240.000, de 5 personas (las 5 con correo y WhatsApp).

No cuentan las boletas en cero ni las que llevan voucher. Si algún día aparecen dos precios distintos en una etapa, el comando se detiene y los muestra.

El código de cada persona es `FAMILIA-` más el código de su pedido (por ejemplo `FAMILIA-ABC12`): lo reconoce y no hay tabla que guardar. Quien hizo varios pedidos recibe uno solo, el del más reciente.

## Paso 1. Decidir

Antes de crear nada, responde estas cuatro:

1. **Usos por código.** Cuántas boletas puede comprar cada familia con un código. Propuesta: 4. Cada boleta es un uso.
2. **Hasta cuándo vale.** Propuesta: hasta el jueves 5 de noviembre a las 11:59 p.m.
3. **Canal.** Propuesta: correo a todos y WhatsApp por la API de Meta (`campana.py whatsapp`), no por respond.io. La lista ya trae solo a quien autorizó WhatsApp en el backend. En respond.io los compradores tienen la casilla Baja marcada y ahí no se distingue a quien de verdad pidió no recibir mensajes.
4. **Excepción a "a quien compró no se le escribe".** Esta campaña sí les escribe. Confirmarlo deja la regla escrita en `docs/campanas/reglas.md`.

## Paso 2. Revisar la lista

En la raíz del repo:

```
npm run build
python3 scripts/campanas/campana.py lista familia-etapa1
python3 scripts/campanas/campana.py lista familia-etapa2
```

Cada uno dice cuántas boletas hubo, a qué precio y cuántas personas quedan. La lista completa queda en `~/Documents/eventalist/datos/testigos-memoria/`. Confirma que el precio es el que quieres sostener.

## Paso 3. Crear los vouchers en el sandbox

Primero en `testigos-sandbox`, para probar. Los pedidos reales no están ahí, así que basta con un código de prueba por grupo.

1. Entrar a `https://pretix.eventalist.co/control/` con la cuenta de Eventalist y abrir `testigos-sandbox`.
2. Ir a Vouchers → "Crear varios vouchers nuevos" (Create multiple new vouchers).
3. Llenar:
   - Códigos (Codes): `FAMILIA-PRUEBA`.
   - Usos máximos (Maximum usages): el número del paso 1.
   - Válido hasta (Valid until): la fecha del paso 1.
   - Producto (Product): solo **Pase Completo**.
   - Efecto en el precio (Price effect): "Fijar el precio del producto en" (Set product price to) `310000`.
   - Etiqueta (Tag): `familia-etapa1`.
   - Comentario (Comment): `Familia etapa 1, docs/campanas/familia/README.md`.
   - Sin marcar: reservar cupo (Reserve ticket from quota), saltar el cupo (Allow to bypass quota), mostrar productos ocultos (Shows hidden products) y enviar los vouchers por correo.
4. Guardar.
5. Repetir con código `FAMILIA-PRUEBA2`, producto **Pase Fin de Semana**, precio `240000` y etiqueta `familia-etapa2`.

## Paso 4. Probar en el sandbox

Con Wompi de pruebas y una captura en cada caso:

1. Abrir `https://pretix.eventalist.co/eventalist/testigos-sandbox/redeem?voucher=FAMILIA-PRUEBA`: el Pase Completo sale a 310.000.
2. Con el mismo código, comprar tantas boletas como usos: todas a 310.000.
3. Una más que los usos: Pretix no la deja con el código.
4. Con el código, intentar otra boleta (Sábado en la tarde): no aplica.
5. Seis pases iguales con el código: no sale la sexta gratis (el descuento ignora lo que lleva voucher).
6. Una compra completa con pago de prueba: la orden queda pagada y el correo de Pretix muestra el precio del voucher.

## Paso 5. Crear los vouchers reales

Con las pruebas bien:

1. Sacar los códigos de cada grupo:

   ```
   python3 scripts/campanas/campana.py vouchers familia-etapa1
   python3 scripts/campanas/campana.py vouchers familia-etapa2
   ```

2. En `testigos-memoria`, Vouchers → "Crear varios vouchers nuevos", pegar los códigos de `familia-etapa1` en Códigos (uno por línea) y llenar lo mismo del paso 3 (Pase Completo, 310.000, etiqueta `familia-etapa1`). Guardar.
3. Lo mismo con los de `familia-etapa2` (Pase Fin de Semana, 240.000, etiqueta `familia-etapa2`).
4. Abrir uno de los enlaces sin pagar para ver el precio, y vaciar el carrito.

`FAMILIA-PRUEBA` no se crea en producción: es el código que les llega a las filas del equipo en las pruebas.

## Paso 6. Plantillas y envío

Lo preparo yo cuando decidas el paso 1, y tú las revisas:

- Correo: un texto corto con su código y su enlace (`{{voucher}}`, `{{enlace_voucher}}`). Pasa por `npm run verificar`.
- WhatsApp: plantilla de Meta con encabezado de texto, el código como variable. Tú la mandas a aprobación.
- La fecha del envío entra en `docs/campanas/checklist-diario.md`.
- La ficha del chatbot (`docs/chatbot/`) aprende qué es un código FAMILIA, para que Catalina sepa responder.

Para enviar, como en las demás campañas:

```
python3 scripts/campanas/campana.py correo familia-etapa1 --prueba j.a.oso15@gmail.com --enviar
python3 scripts/campanas/campana.py correo familia-etapa1
python3 scripts/campanas/campana.py correo familia-etapa1 --enviar
```

El `--enviar` sin `--prueba` solo cuando tú lo pidas para ese envío.

## Cómo saber cuántos lo usaron

En Pretix, Vouchers, filtrar por la etiqueta `familia-etapa1` o `familia-etapa2`: cada voucher dice cuántas veces se usó.

## Cómo apagarla

En Vouchers, filtrar por la etiqueta, seleccionar todos y borrarlos (o cambiarles la fecha de vencimiento a hoy). Las órdenes ya pagadas no cambian.
