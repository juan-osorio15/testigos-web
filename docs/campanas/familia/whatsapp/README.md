# Familia · WhatsApp

Plan de la campaña en [`../README.md`](../README.md). Qué es cada campo de una plantilla, en [`../../reglas.md`](../../reglas.md).

Por la API de Meta con `campana.py`, a los compradores que autorizaron WhatsApp, con la misma plantilla para las dos etapas. Es la excepción a "sin variables": el código de cada persona va en el cuerpo (`{{1}}`) y al final de la URL del botón. Sin el nombre de la persona.

## Plantilla

- **Nombre:** `fa1_precio_para_los_tuyos`
- **Categoría:** Marketing
- **Idioma:** español (`es`)
- **Encabezado:** texto → `Tu precio, también para los tuyos`
- **Cuerpo** (ejemplo de `{{1}}`: `FAMILIA-ABC12`):

```
Gracias por tener ya tu pase para Testigos de la Memoria. Queremos que puedas llevar a quien quieras con el mismo precio que pagaste tú.

Con tu código {{1}}, tu familia o tus amigos pueden comprar hasta cuatro pases iguales al tuyo a ese precio, hasta el jueves 5 de noviembre. El botón abre la tienda con el código ya puesto.

¿A quién te gustaría llevar?
```

- **Pie:** `Eventalist S.A.S. · Para no recibir más, responde BAJA.`
- **Botón de enlace** (el único botón: `campana.py` llena el primero): texto `Comprar con mi código`, URL dinámica:
  `https://pretix.eventalist.co/eventalist/testigos-memoria/redeem?voucher={{1}}`
  con ejemplo `https://pretix.eventalist.co/eventalist/testigos-memoria/redeem?voucher=FAMILIA-ABC12`

## Martes 3 de noviembre, con los vouchers ya creados

```sh
python3 scripts/campanas/campana.py whatsapp familia-etapa1                                # a quién le llegaría y el texto
python3 scripts/campanas/campana.py whatsapp familia-etapa1 --prueba 57XXXXXXXXXX --enviar  # prueba
python3 scripts/campanas/campana.py whatsapp familia-etapa1 --enviar                        # envío real
```

Lo mismo con `familia-etapa2`. La prueba lleva `FAMILIA-PRUEBA`, que no existe en producción: el botón abre la tienda con un código no válido. Al final, `python3 scripts/campanas/campana.py registro familia-etapa1`.
