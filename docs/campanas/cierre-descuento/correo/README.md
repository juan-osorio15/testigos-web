# Cierre de la etapa 2 · correo

Plan de la campaña en [`../README.md`](../README.md). Es la excepción a los correos conversacionales de [`../../reglas.md`](../../reglas.md): va con diseño, precios tachados y botón.

## Plantillas y configuraciones

Plantillas `scripts/campanas/plantillas/cierre-descuento-1.html`, `-2` y `-3`. Una configuración por día y audiencia en `scripts/campanas/config/` (`cierre-descuento-1-interesados`, `cierre-descuento-1-expirados`, …). Interesados y expirados no se cruzan: la audiencia de interesados ya deja por fuera a quien tiene un pedido expirado.

## Asuntos

- Día 1: `Quedan 2 días con los precios de la etapa 2`
- Día 2: `Mañana termina la etapa 2`
- Día 3: `Hoy es el último día de la etapa 2`

## Comandos del día

Cambiar el `1` por el número del día:

```sh
python3 scripts/campanas/campana.py correo cierre-descuento-1-interesados                                       # vista previa
python3 scripts/campanas/campana.py correo cierre-descuento-1-interesados --prueba manager@eventalist.co --enviar  # prueba
python3 scripts/campanas/campana.py correo cierre-descuento-1-interesados --enviar                               # envío real
python3 scripts/campanas/campana.py correo cierre-descuento-1-expirados                                         # vista previa
python3 scripts/campanas/campana.py correo cierre-descuento-1-expirados --prueba manager@eventalist.co --enviar    # prueba
python3 scripts/campanas/campana.py correo cierre-descuento-1-expirados --enviar                                 # envío real
```

Resend gratis manda 100 correos al día. Si las dos listas suman más, el envío se detiene en el límite y al día siguiente sigue con los que faltan, que ya no sirve para esta campaña: revisar el total con la vista previa antes de enviar.
