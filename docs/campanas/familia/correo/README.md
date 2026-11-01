# Familia · correo

Plan de la campaña en [`../README.md`](../README.md).

- Plantilla: `scripts/campanas/plantillas/familia.html`, la misma para las dos etapas (`{{pase}}` dice "pase completo" o "pase de fin de semana").
- Asunto: "Para quien quieras llevar a Testigos de la Memoria". Remitente `Juan de Testigos de la Memoria <direccion@testigosdelamemoria.com>`; las respuestas llegan a manager@eventalist.co.
- Escrito a mano como los demás correos (`../../reglas.md`, "Correo"): logo sobre terracota, sin cifras ni botones, un solo enlace y una pregunta para responder. Dos diferencias: lleva la fecha, porque es cuándo vence el código, y el enlace va a la tienda con el voucher puesto, sin UTM (la medición es la etiqueta del voucher en Pretix).
- Contenido: el saludo, gracias por haber comprado desde temprano, el código, "hasta cuatro pases iguales al tuyo a ese precio, hasta el jueves 5 de noviembre", el enlace con el código puesto, "¿A quién te gustaría llevar?" y la firma de Juan.

## Martes 3 de noviembre, con los vouchers ya creados

```sh
python3 scripts/campanas/campana.py correo familia-etapa1                                          # vista previa
python3 scripts/campanas/campana.py correo familia-etapa1 --prueba j.a.oso15@gmail.com --enviar   # prueba
python3 scripts/campanas/campana.py correo familia-etapa1 --enviar                                  # envío real
```

Lo mismo con `familia-etapa2`. La vista previa queda en `~/Documents/eventalist/datos/testigos-memoria/previas-familia-etapa1/`. La prueba lleva el código `FAMILIA-PRUEBA`, que no existe en producción: el enlace dirá que el código no es válido.
