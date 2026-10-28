# Cierre de la etapa 2 · WhatsApp

Tres broadcasts de respond.io, uno por día del martes 27 al jueves 29 de octubre, para que se sienta que el precio de la etapa 2 se acaba. Van junto con tres correos (plan completo en [`../README.md`](../README.md); qué es cada campo de una plantilla y cómo se manda un broadcast, en [`../../reglas.md`](../../reglas.md)).

**Cómo están escritos:** la urgencia va primero, en el encabezado de texto y en la primera línea, y es general ("los precios de la etapa 2"). Después, en una o dos frases, qué es el encuentro (sin imagen, el mensaje tiene que presentarlo antes de nombrar a nadie) y una conversación que antoja, con su periodista y su tema. Al final, los precios (titular, 2026-10-27).

**Sin imagen** (titular, 2026-10-27): Meta aprueba los encabezados de imagen unas veces sí y otras no. Las plantillas van con encabezado de texto, que se aprueba como cualquier texto, y el mensaje se entiende sin pieza. Las primeras versiones (`cd1_quedan_dos_dias`, `cd2_manana_termina`, `cd3_hoy_ultimo_dia`, con imagen) no se usan; estas son `_v2`.

## Calendario

- **CD1** · martes 27 oct · Quedan 2 días · Marisol Gómez y las mesas de paz
- **CD2** · miércoles 28 oct · Mañana termina · Yolanda Ruiz y María Elvira Samper
- **CD3** · jueves 29 oct · Hoy es el último día · Luz María Sierra y Martha Soto, el narcotráfico. Reemplaza a RC4, que no se envía.

## Antes del primer envío (una sola vez)

- [ ] Crear las tres plantillas en WhatsApp Manager, en la cuenta del número colombiano, campo por campo como dice cada bloque. Cada una tiene que quedar aprobada antes de las 7:00 p.m. del día anterior a su envío (CD1, el mismo día).

## Cada día

1. Confirmar en Pretix que el pase de fin de semana sigue en $240.000 y el pase completo en $340.000, y que ninguno está agotado.
2. En respond.io: Broadcasts → nuevo broadcast → canal WhatsApp del número colombiano → la plantilla del día. En `{{1}}`, el campo First Name.
3. Audiencia: Lifecycle distinto de Customer y la casilla Baja sin marcar (incluye a los del segmento `inactivos`).
4. Programarlo entre 9:00 y 11:00 a.m. (siempre dentro de 7:00 a.m. a 7:00 p.m.).

---

## CD1 · martes 27 de octubre

- **Nombre:** `cd1_quedan_dos_dias_v2`
- **Categoría:** Marketing
- **Idioma:** español (`es`)
- **Encabezado:** texto → `Quedan 2 días con los precios de la etapa 2`
- **Cuerpo:**

```
Hola, {{1}}. Hasta el jueves 29 de octubre puedes ir a Testigos de la Memoria con los precios de la etapa 2. Desde el viernes, el descuento es menor.

Testigos de la Memoria es un encuentro en Villa de Leyva, del 6 al 8 de noviembre, en el que periodistas como Daniel Samper Pizano, Yolanda Ruiz y Fidel Cano cuentan en persona la historia de Colombia que les tocó cubrir. Una de esas conversaciones es con Marisol Gómez, que siguió las negociaciones de paz durante 25 años: el sábado 7 cuenta qué pasó de verdad en las mesas del Caguán y de La Habana, con tiempo para hacerle preguntas.

El pase de fin de semana está en $240.000 en vez de $270.000, y el pase completo en $340.000 en vez de $360.000. ¿Te ayudamos a escoger tu boleta?
```

- **Ejemplo de `{{1}}`:** `Ana`
- **Pie:** `Eventalist S.A.S. · Para no recibir más, responde BAJA.`
- **Botón de respuesta rápida:** `Sí, ayúdame`
- **Botón de enlace:** texto `Ver boletas`, URL estática:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=cierre-descuento&utm_content=plantilla-quedan-dos-dias`

## CD2 · miércoles 28 de octubre

- **Nombre:** `cd2_manana_termina_v2`
- **Categoría:** Marketing
- **Idioma:** español (`es`)
- **Encabezado:** texto → `Mañana termina la etapa 2`
- **Cuerpo:**

```
Hola, {{1}}. Mañana jueves es el último día con los precios de la etapa 2 de Testigos de la Memoria. Desde el viernes, el descuento es menor.

En Testigos de la Memoria, del 6 al 8 de noviembre en Villa de Leyva, cada conversación la dan quienes estuvieron ahí. El domingo en la mañana, Yolanda Ruiz, Premio Simón Bolívar a la Vida y Obra, y María Elvira Samper, exdirectora de Semana y Cambio, cuentan cómo fue cubrir la guerra y el poder cuando casi ninguna mujer dirigía un noticiero en Colombia.

Esa conversación entra en el pase de fin de semana, que hasta mañana está en $240.000 en vez de $270.000. ¿Te lo dejamos listo?
```

- **Ejemplo de `{{1}}`:** `Ana`
- **Pie:** `Eventalist S.A.S. · Para no recibir más, responde BAJA.`
- **Botón de respuesta rápida:** `Sí, quiero`
- **Botón de enlace:** texto `Ver boletas`, URL estática:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=cierre-descuento&utm_content=plantilla-manana-termina`

## CD3 · jueves 29 de octubre

- **Nombre:** `cd3_hoy_ultimo_dia_v2`
- **Categoría:** Marketing
- **Idioma:** español (`es`)
- **Encabezado:** texto → `Hoy es el último día de la etapa 2`
- **Cuerpo:**

```
Hola, {{1}}. Hoy es el último día con los precios de la etapa 2 de Testigos de la Memoria. Desde mañana, el descuento es menor.

¿Cómo se investigaba el narcotráfico cuando hacerlo era jugarse la vida? En Testigos de la Memoria, del 6 al 8 de noviembre en Villa de Leyva, lo cuentan en persona Luz María Sierra, exdirectora de El Colombiano, y Martha Soto, editora de la Unidad Investigativa de El Tiempo. Es el sábado 7 en la tarde, con tiempo para hacerles preguntas.

Esa conversación entra en el pase de fin de semana, que hoy está en $240.000 en vez de $270.000. ¿Te lo dejamos listo?
```

- **Ejemplo de `{{1}}`:** `Ana`
- **Pie:** `Eventalist S.A.S. · Para no recibir más, responde BAJA.`
- **Botón de respuesta rápida:** `Sí, quiero`
- **Botón de enlace:** texto `Ver boletas`, URL estática:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=cierre-descuento&utm_content=plantilla-hoy-termina`
