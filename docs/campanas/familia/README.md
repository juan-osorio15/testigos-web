# Familia · el precio de tu etapa para los tuyos

Quien compró en la etapa 1 o en la etapa 2 recibe un código propio para que su familia compre su mismo pase al precio que él pagó. Es un voucher de Pretix por persona: el sitio y la tienda no cambian.

Decisiones del titular (2026-11-01):

- **4 usos por código** (cada boleta es un uso) y **vence el jueves 5 de noviembre** a las 11:59 p.m.
- **Correo** con `campana.py` y **WhatsApp uno por uno desde respond.io** (unas 25 personas). Un broadcast no deja poner el código de cada persona en la plantilla, `boleta_de_interes` no sirve porque Catalina lo lee en su prompt, y la API de Meta no está configurada en el portafolio (revisado el 2026-11-01: no hay app ni usuario del sistema de campañas).
- Esta campaña sí les escribe a los compradores: es la excepción a la regla de `../reglas.md`.

Envío: martes 3 de noviembre (`../checklist-diario.md`). El lunes 2 es festivo.

## Quién entra

Lo arma `scripts/campanas/audiencias/familia.py` con los pedidos de Pretix. Al 2026-11-01:

- **`familia-etapa1`**: pedidos pagados con Pase Completo hasta el 12 de octubre. 57 boletas, todas a 310.000, de 35 personas (35 con correo, 20 con WhatsApp autorizado).
- **`familia-etapa2`**: pedidos pagados con Pase Fin de Semana del 13 al 29 de octubre. 7 boletas, todas a 240.000, de 5 personas (las 5 con correo y WhatsApp).

No cuentan las boletas en cero ni las que llevan voucher. Si algún día aparecen dos precios distintos en una etapa, el comando se detiene y los muestra.

El código de cada persona es `FAMILIA-` más el código de su pedido (por ejemplo `FAMILIA-ABC12`): lo reconoce y no hay tabla que guardar. Quien hizo varios pedidos recibe uno solo, el del más reciente.

Canales, con las mismas reglas que expirados: correo a todos salvo baja en el backend; WhatsApp solo a quien lo autorizó en el backend y sigue vigente.

## Paso 1. La plantilla de WhatsApp

`fa1_precio_para_los_tuyos`, campo por campo como dice [`whatsapp/README.md`](whatsapp/README.md). Aprobada el 2026-11-01.

## Paso 2. Pasado

(Era guardar las llaves de la API de Meta; ya no hace falta.)

## Paso 3. Crear los vouchers en el sandbox y probarlos

Primero en `testigos-sandbox`. Los pedidos reales no están ahí, así que basta con un código de prueba por grupo.

1. Entrar a `https://pretix.eventalist.co/control/` con la cuenta de Eventalist y abrir `testigos-sandbox`.
2. Ir a Vouchers → "Crear varios vouchers nuevos" (Create multiple new vouchers).
3. Llenar:
   - Códigos (Codes): `FAMILIA-PRUEBA`.
   - Usos máximos (Maximum usages): `4`.
   - Válido hasta (Valid until): jueves 5 de noviembre de 2026, 11:59 p.m.
   - Producto (Product): solo **Pase Completo**.
   - Efecto en el precio (Price effect): "Fijar el precio del producto en" (Set product price to) `310000`.
   - Etiqueta (Tag): `familia-etapa1`.
   - Comentario (Comment): `Familia etapa 1, docs/campanas/familia/README.md`.
   - Sin marcar: reservar cupo (Reserve ticket from quota), saltar el cupo (Allow to bypass quota), mostrar productos ocultos (Shows hidden products) y enviar los vouchers por correo.
4. Guardar.
5. Repetir con código `FAMILIA-PRUEB2`, producto **Pase Fin de Semana**, precio `240000` y etiqueta `familia-etapa2`.

Probar con Wompi de pruebas, con una captura en cada caso:

1. Abrir `https://pretix.eventalist.co/eventalist/testigos-sandbox/redeem?voucher=FAMILIA-PRUEBA`: el Pase Completo sale a 310.000.
2. Con el mismo código, 4 boletas: todas a 310.000.
3. Una quinta con el código: Pretix no la deja.
4. Con el código, otra boleta (Sábado en la tarde): no aplica.
5. Una compra completa con pago de prueba: la orden queda pagada y el correo de Pretix muestra el precio del voucher.

## Paso 4. Martes 3: crear los vouchers reales

1. Sacar los códigos de cada grupo, con los compradores de ese momento:

   ```
   npm run build
   python3 scripts/campanas/campana.py vouchers familia-etapa1
   python3 scripts/campanas/campana.py vouchers familia-etapa2
   ```

2. En `testigos-memoria`, Vouchers → "Crear varios vouchers nuevos", pegar los códigos de `familia-etapa1` en Códigos (uno por línea) y llenar lo mismo del paso 3 (4 usos, 5 de noviembre, Pase Completo, 310.000, etiqueta `familia-etapa1`). Guardar.
3. Lo mismo con los de `familia-etapa2` (Pase Fin de Semana, 240.000, etiqueta `familia-etapa2`).
4. Abrir uno de los enlaces sin pagar para ver el precio, y vaciar el carrito.

`FAMILIA-PRUEBA` no se crea en producción: es el código que les llega a las filas del equipo en las pruebas.

## Paso 5. Martes 3: enviar

Los vouchers tienen que existir antes de que salga cualquier mensaje.

- **Correo**: [`correo/README.md`](correo/README.md).
- **WhatsApp**: [`whatsapp/README.md`](whatsapp/README.md).

Si sabes de un comprador que pidió no recibir mensajes y no está marcado en el backend, sácalo con `--excluir su-correo-o-teléfono` en el correo y sáltalo en WhatsApp.

## Cómo saber cuántos lo usaron

En Pretix, Vouchers, filtrar por la etiqueta `familia-etapa1` o `familia-etapa2`: cada voucher dice cuántas veces se usó.

## Cómo apagarla

Vencen solos el 5 de noviembre. Para apagarla antes: en Vouchers, filtrar por la etiqueta y cambiarles la fecha de vencimiento a hoy (o borrarlos). Las órdenes ya pagadas no cambian.
