# Crear el evento sandbox `testigos-sandbox`

El sandbox es una copia del evento real donde se hacen todas las compras de ensayo: el barrido de Wompi, el plugin de medición y los cambios del sitio. El dinero no se mueve porque usa el ambiente de pruebas de Wompi. **Sin este evento no se puede probar nada de lo que están construyendo los agentes.** No existía al 2026-10-06.

Regla de oro: **nunca poner en modo prueba el evento de producción** (`testigos-memoria`). Los compradores reales terminarían haciendo pedidos de prueba que no cuentan.

## Lo que debe tener al final

- Slug `testigos-sandbox`, en el organizador `eventalist`. Queda en `https://pretix.eventalist.co/eventalist/testigos-sandbox/`.
- Los mismos productos, preguntas, casilla y textos que `testigos-memoria`, pero con **sus propios cupos**.
- La tienda **en modo prueba**.
- No se enlaza desde el sitio, desde redes ni desde ningún otro lugar.
- Wompi en **ambiente de pruebas**, con las cuatro llaves de prueba.
- La URL de eventos registrada en el ambiente de pruebas de Wompi.
- Una compra de prueba que llegue a "pagado" y envíe la boleta.

## Paso 1. Sacar las credenciales de prueba en Wompi

En el panel de comercios de Wompi (`comercios.wompi.co`). Los nombres de los menús pueden variar un poco.

- [ ] Arriba del panel, cambiar a **modo de pruebas / Sandbox**. Todo lo que sigue se hace en ese modo; el de producción no se toca.
- [ ] Ir a **Desarrolladores → Programadores** (o "Desarrollo").
- [ ] Copiar, en un lugar seguro y temporal, las cuatro credenciales de prueba:
  - Llave pública: empieza por `pub_test_`.
  - Llave privada: empieza por `prv_test_`.
  - Secreto de integridad: contiene `_integrity_`.
  - Secreto de eventos: contiene `_events_`.
- [ ] En la misma página, en **URL de Eventos** del ambiente de pruebas, poner exactamente:
  `https://pretix.eventalist.co/_wompi/webhook/`
  Es la misma dirección que tiene producción, y está bien: el plugin distingue a qué evento pertenece cada pago. **La URL de producción no se cambia.**
- [ ] Guardar.

Las llaves privada, de integridad y de eventos son secretas: no se pegan en chats ni en documentos. Solo van en el formulario de Pretix.

## Paso 2. Clonar el evento en Pretix

En `https://pretix.eventalist.co/control/`.

- [ ] Organizador `eventalist` → Eventos → **Crear un nuevo evento**.
- [ ] En el asistente, elegir **copiar la configuración de** `testigos-memoria`.
- [ ] Nombre: `Testigos de la memoria (SANDBOX)`. Slug: `testigos-sandbox`. Las mismas fechas que el real.
- [ ] Terminar el asistente y revisar que se copiaron los productos, las preguntas y la casilla de autorización.
- [ ] **Cupos**: entrar a Productos → Cupos y confirmar que el sandbox tiene cupos propios. Si no se copiaron, crearlos (por ejemplo 50 por producto). No deben ser los del evento real.

## Paso 3. Configurar Wompi en el sandbox

- [ ] En el evento `testigos-sandbox`: Configuración → Plugins → confirmar que el plugin de Wompi está activo.
- [ ] Configuración → Pagos → Wompi.
  - **Environment**: `Test / Sandbox`.
  - Public key: la `pub_test_...`.
  - Private key: la `prv_test_...`.
  - Integrity secret: la de `_integrity_`.
  - Events secret: la de `_events_`.
  - Activar el medio de pago y guardar.
- [ ] Si Pretix muestra "The public key prefix does not match the selected environment", la llave pública es la de producción o el ambiente quedó en Production. Corregir y volver a guardar.

## Paso 4. Poner la tienda en modo prueba

- [ ] En el panel del evento `testigos-sandbox`, abrir **Estado de la tienda** (o "Shop status").
- [ ] Activar el **modo de prueba**.
- [ ] Activar la tienda (ponerla en línea) para poder comprar desde el navegador y desde el widget. Al estar en modo prueba, Pretix muestra un aviso de prueba en cada página y los pedidos quedan marcados como de prueba.
- [ ] Verificar dos veces que el evento que quedó en modo prueba es **`testigos-sandbox`**, no `testigos-memoria`.

## Paso 5. Compra de prueba

- [ ] Abrir `https://pretix.eventalist.co/eventalist/testigos-sandbox/` en una ventana privada.
- [ ] Elegir una boleta y llenar los datos con tu propio correo.
- [ ] En Wompi, pagar con la tarjeta de prueba aprobada: `4242 4242 4242 4242`, cualquier fecha futura, cualquier CVC de 3 dígitos.
- [ ] Confirmar tres cosas:
  - En Pretix, el pedido aparece como **pagado** y marcado como de prueba.
  - La boleta llega al correo.
  - En el panel de Wompi (modo pruebas), la transacción aparece **aprobada**.
- [ ] Opcional: repetir con la tarjeta rechazada (`4111 1111 1111 1111`) y comprobar que el pedido sigue pendiente.
- [ ] Tomar capturas del pedido pagado en Pretix y de la transacción en Wompi.

## Paso 6. Avisar

- [ ] Avisarle al agente de `pretix-wompi` que el sandbox existe, para que siga con el PR del barrido de Wompi.
- [ ] Marcar aquí la fecha en que quedó listo: `____`.

## Después (no hace falta ahora)

Para el ensayo completo del embudo, más adelante:

- En el sandbox se activa el plugin de medición con su configuración de prueba. Los agentes dirán qué valores poner.
- En el backend se crea la campaña de ensayo con el mismo slug, `testigos-sandbox`. Es una campaña del backend, no un evento de Pretix: comparten el nombre a propósito.

## Para próximos eventos

Todo evento nuevo en Pretix lleva su sandbox con estos mismos pasos, cambiando el slug (`<evento>-sandbox`). Es el paso 0 de la plantilla de eventos.
