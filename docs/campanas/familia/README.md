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

## Paso 3. Pasado: sin prueba en el sandbox

Lo que hace Pretix con un voucher está en su código ([`https://github.com/pretix/pretix`](https://github.com/pretix/pretix), `src/pretix/base/models/vouchers.py`, revisado el 2026-11-01): cada boleta del carrito es un uso y no pasa de "Número máximo de usos"; después de "Válido hasta" el código deja de servir; "Establecer el precio en" fija ese precio; con un producto elegido solo sirve para ese producto; y `/redeem?voucher=` abre la tienda con el código puesto. Lo que el código no puede saber es si los vouchers quedaron bien escritos en nuestra tienda: eso lo revisa `vouchers --revisar` en el paso 4, contra la API.

## Paso 4. Martes 3: crear los vouchers reales

1. Sacar los códigos de cada grupo, con los compradores de ese momento:

   ```
   npm run build
   python3 scripts/campanas/campana.py vouchers familia-etapa1
   python3 scripts/campanas/campana.py vouchers familia-etapa2
   ```

2. Entrar a `https://pretix.eventalist.co/control/`, abrir `testigos-memoria` e ir a Vales → "Crear múltiples vales de compra nuevos" (en inglés, Vouchers → "Create multiple new vouchers").
3. Llenar con los códigos de `familia-etapa1`:
   - Códigos: los que imprimió el comando, uno por línea.
   - Número máximo de usos: `4`. Usos mínimos: `1`, como viene.
   - Válido hasta: jueves 5 de noviembre de 2026, 11:59 p.m.
   - Producto: solo **Pase Completo**.
   - Efecto en el precio: "Establecer el precio en". Valor del vale: `310000`.
   - Etiqueta: `familia-etapa1`, exacta: es como la encuentra la revisión.
   - Comentario: `Familia etapa 1, docs/campanas/familia/README.md`.
   - Sin marcar ni llenar: reservar entrada con cargo a la cuota, permitir omitir la cuota, mostrar productos ocultos, presupuesto máximo de descuento y enviar los vales por correo.
4. Guardar y repetir con los de `familia-etapa2`: Pase Fin de Semana, `240000`, etiqueta `familia-etapa2`.
5. Revisar que quedaron bien:

   ```
   python3 scripts/campanas/campana.py vouchers familia-etapa1 --revisar
   python3 scripts/campanas/campana.py vouchers familia-etapa2 --revisar
   ```

   Cada uno tiene que terminar en "Todos bien". Si dice que falta, sobra o quedó mal alguno, se corrige en Pretix y se vuelve a correr.
6. Abrir uno de los enlaces para ver el precio, sin pagar, y vaciar el carrito.

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
