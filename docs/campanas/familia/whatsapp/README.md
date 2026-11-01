# Familia · WhatsApp

Plan de la campaña en [`../README.md`](../README.md). Qué es cada campo de una plantilla y cómo se manda un broadcast, en [`../../reglas.md`](../../reglas.md).

Un broadcast de respond.io a los compradores que autorizaron WhatsApp, con la misma plantilla para las dos etapas. Es la excepción a "sin variables": el código de cada persona va en el cuerpo y en el botón, y sale del campo de contacto `voucher_familia`. Sin el nombre de la persona.

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
- **Botón de respuesta rápida:** `Ayúdame a comprar`
- **Botón de enlace:** texto `Comprar con mi código`, URL dinámica:
  `https://pretix.eventalist.co/eventalist/testigos-memoria/redeem?voucher={{1}}`
  con ejemplo `https://pretix.eventalist.co/eventalist/testigos-memoria/redeem?voucher=FAMILIA-ABC12`

## Martes 3 de noviembre, con los vouchers ya creados

1. Armar los CSV:

   ```sh
   python3 scripts/campanas/campana.py respondio familia-etapa1
   python3 scripts/campanas/campana.py respondio familia-etapa2
   ```

2. Importar los dos en respond.io con la casilla **Do Not Overwrite** marcada en Tags. Cada fila trae la etiqueta del día (`familia-etapa1-03112026`), Lifecycle Customer y el código en `voucher_familia`.
3. Broadcasts → nuevo broadcast → canal WhatsApp del número colombiano → `fa1_precio_para_los_tuyos`.
4. Variables: `{{1}}` del cuerpo y `{{1}}` del botón, las dos con el campo **Voucher familia**.
5. Audiencia: solo las etiquetas `familia-etapa1-<fecha>` y `familia-etapa2-<fecha>` de hoy. **Sin** el filtro de Baja ni de Customer: a todos los compradores se les marcó Baja al importarlos, y la lista ya trae solo a quien autorizó WhatsApp y no se dio de baja en el backend.
6. Programarlo entre 9:00 y 11:00 a.m.
