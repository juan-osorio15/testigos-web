# Familia · WhatsApp

Plan de la campaña en [`../README.md`](../README.md). Qué es cada campo de una plantilla, en [`../../reglas.md`](../../reglas.md).

Uno por uno desde respond.io, a los compradores que autorizaron WhatsApp (unos 25), con la misma plantilla para las dos etapas. Es la excepción a "sin variables": el código de cada persona va en el cuerpo (`{{1}}`) y al final de la URL del botón. Sin el nombre de la persona. Ni broadcast (no deja poner el código de cada uno) ni API de Meta (no está configurada).

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
- **Botón de enlace** (el único botón): texto `Comprar con mi código`, URL dinámica:
  `https://pretix.eventalist.co/eventalist/testigos-memoria/redeem?voucher={{1}}`
  con ejemplo `https://pretix.eventalist.co/eventalist/testigos-memoria/redeem?voucher=FAMILIA-ABC12`

## Martes 3 de noviembre, con los vouchers ya creados

1. Armar las listas del momento:

   ```sh
   python3 scripts/campanas/campana.py lista familia-etapa1
   python3 scripts/campanas/campana.py lista familia-etapa2
   ```

2. Abrir los CSV que dice el comando (`~/Documents/eventalist/datos/testigos-memoria/familia-etapa1-<fecha-hora>.csv`). Van las filas con `whatsapp` lleno; la de `tipo` titular es la tuya, para la prueba. De cada fila se usan `whatsapp` y `voucher`.
3. Primero la prueba: en respond.io, abrir tu propio chat, mandar `fa1_precio_para_los_tuyos` con `FAMILIA-PRUEBA` en el `{{1}}` del cuerpo y en el del botón, y abrir el botón (la tienda dirá que el código no es válido: no existe en producción).
4. Por cada persona: buscarla por teléfono en respond.io (si no existe, crear la conversación con el número), mandar la plantilla y pegar su `voucher` en los dos `{{1}}`.
5. Entre 9:00 a.m. y 7:00 p.m. Las respuestas le llegan a Catalina como siempre.
