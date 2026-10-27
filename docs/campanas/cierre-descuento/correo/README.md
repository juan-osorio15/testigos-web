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
python3 scripts/campanas/campana.py correo cierre-descuento-1-interesados --prueba j.a.oso15@gmail.com --enviar  # prueba
python3 scripts/campanas/campana.py correo cierre-descuento-1-interesados --enviar                               # envío real
python3 scripts/campanas/campana.py correo cierre-descuento-1-expirados                                         # vista previa
python3 scripts/campanas/campana.py correo cierre-descuento-1-expirados --prueba j.a.oso15@gmail.com --enviar    # prueba
python3 scripts/campanas/campana.py correo cierre-descuento-1-expirados --enviar                                 # envío real
```

Resend gratis manda 100 correos al día, las pruebas incluidas. Desde el 27 de octubre los interesados son toda la base del backend (los inscritos del sitio y los contactos de Fernando, unos 310 con correo), así que no caben en un día: primero los expirados y después una tanda de interesados con `--maximo` (lo que quede del cupo). Al día siguiente, la CD de ese día sigue donde quedó la anterior con `--saltar` (los que ya recibieron una CD). Si Resend llega al límite, el comando se detiene en ese correo: los anteriores ya salieron y quedan en el registro.
