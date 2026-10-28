# Cierre de la etapa 2 · WhatsApp

Tres broadcasts de respond.io, uno por día del martes 27 al jueves 29 de octubre, para que se sienta que el precio de la etapa 2 se acaba. Van junto con tres correos (plan completo en [`../README.md`](../README.md); qué es cada campo de una plantilla y cómo se manda un broadcast, en [`../../reglas.md`](../../reglas.md)).

**Cómo están escritos:** la urgencia va primero, en el encabezado de texto y en la primera línea, y es general ("los precios de la etapa 2"). Después, en una o dos frases, qué es el encuentro (sin imagen, el mensaje tiene que presentarlo antes de nombrar a nadie) y una conversación que antoja, con su periodista y su tema. Al final, los precios (titular, 2026-10-27).

**Sin imagen** (titular, 2026-10-27): Meta aprueba los encabezados de imagen unas veces sí y otras no. Las plantillas van con encabezado de texto, que se aprueba como cualquier texto, y el mensaje se entiende sin pieza. Las primeras versiones (`cd1_quedan_dos_dias`, `cd2_manana_termina`, `cd3_hoy_ultimo_dia`, con imagen) no se usan. CD1 va con `_v2`; CD2 y CD3, con `_v3`.

**CD2 y CD3 nombran dos conversaciones, no una** (titular, 2026-10-28): en corto, nombres · tema, María Elvira Samper y Fidel Cano. Sin "¿te imaginas…?" y sin el nombre de la persona: es un anuncio general, no un mensaje personal (titular, 2026-10-28). Las acompaña la pieza [`piezas/cierre-etapa-2.jpg`](piezas/cierre-etapa-2.jpg) (pase de fin de semana con las caras) donde se publique a mano.

## Calendario

- **CD1** · martes 27 oct · Quedan 2 días · Marisol Gómez y las mesas de paz
- **CD2** · miércoles 28 oct · Mañana termina · María Elvira Samper y Fidel Cano
- **CD3** · jueves 29 oct · Hoy es el último día · María Elvira Samper y Fidel Cano. Reemplaza a RC4, que no se envía.

## Antes del primer envío (una sola vez)

- [ ] Crear las tres plantillas en WhatsApp Manager, en la cuenta del número colombiano, campo por campo como dice cada bloque. Cada una tiene que quedar aprobada antes de las 7:00 p.m. del día anterior a su envío (CD1, el mismo día).

## Cada día

1. Confirmar en Pretix que el pase de fin de semana sigue en $240.000 y el pase completo en $340.000, y que ninguno está agotado.
2. En respond.io: Broadcasts → nuevo broadcast → canal WhatsApp del número colombiano → la plantilla del día. CD1 lleva `{{1}}` con el campo First Name; CD2 y CD3 no tienen variables.
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

- **Nombre:** `cd2_manana_termina_v3`
- **Categoría:** Marketing
- **Idioma:** español (`es`)
- **Encabezado:** texto → `Mañana termina la etapa 2`
- **Cuerpo:**

```
Mañana es el último día con los precios de la etapa 2 de Testigos de la Memoria. Desde el viernes, el descuento es menor.

Del 6 al 8 de noviembre en Villa de Leyva, los periodistas que cubrieron la historia de Colombia la cuentan en persona. Dos de las conversaciones del fin de semana:

María Elvira Samper y Yolanda Ruiz · las mujeres que cubrieron la guerra.
Fidel Cano y Cecilia Orozco · las reelecciones de Uribe y Santos.

El pase de fin de semana, con las dos, está hasta mañana en $240.000 en vez de $270.000. ¿Te lo dejamos listo?
```

- **Pie:** `Eventalist S.A.S. · Para no recibir más, responde BAJA.`
- **Botón de respuesta rápida:** `Sí, quiero`
- **Botón de enlace:** texto `Ver boletas`, URL estática:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=cierre-descuento&utm_content=plantilla-manana-termina`

## CD3 · jueves 29 de octubre

- **Nombre:** `cd3_hoy_ultimo_dia_v3`
- **Categoría:** Marketing
- **Idioma:** español (`es`)
- **Encabezado:** texto → `Hoy es el último día de la etapa 2`
- **Cuerpo:**

```
Hoy es el último día con los precios de la etapa 2 de Testigos de la Memoria. Desde mañana, el descuento es menor.

Del 6 al 8 de noviembre en Villa de Leyva, los periodistas que cubrieron la historia de Colombia la cuentan en persona. Dos de las conversaciones del fin de semana:

María Elvira Samper y Yolanda Ruiz · las mujeres que cubrieron la guerra.
Fidel Cano y Cecilia Orozco · las reelecciones de Uribe y Santos.

El pase de fin de semana, con las dos, está hoy en $240.000 en vez de $270.000. ¿Te lo dejamos listo?
```

- **Pie:** `Eventalist S.A.S. · Para no recibir más, responde BAJA.`
- **Botón de respuesta rápida:** `Sí, quiero`
- **Botón de enlace:** texto `Ver boletas`, URL estática:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=cierre-descuento&utm_content=plantilla-hoy-termina`

---

## Versión para grupos · miércoles 28 y jueves 29

Texto plano para pegar a mano en grupos de WhatsApp, con los enlaces adentro y sin botones (titular, 2026-10-28). Va con la pieza [`piezas/cierre-etapa-2.jpg`](piezas/cierre-etapa-2.jpg): primero la pieza y después el texto, en el mismo mensaje si se puede. El enlace del agente es el mismo de los grupos de Villa, para que Catalina sepa de dónde viene la persona.

### Miércoles 28 · Mañana termina

```
Mañana jueves es el último día con los precios de la etapa 2 de Testigos de la Memoria.

Del 5 al 8 de noviembre, aquí en Villa de Leyva, los periodistas que cubrieron la historia de Colombia la cuentan en persona. Dos de las conversaciones del fin de semana:

María Elvira Samper y Yolanda Ruiz · las mujeres que cubrieron la guerra.
Fidel Cano y Cecilia Orozco · las reelecciones de Uribe y Santos.

El pase de fin de semana está hasta mañana en $240.000 en vez de $270.000. Las boletas, aquí:
https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=cierre-descuento&utm_content=grupos-manana-termina

¿Dudas? Escríbannos:
https://wa.me/573239236021?text=Hola%2C%20vi%20Testigos%20de%20la%20Memoria%20en%20un%20grupo%20de%20Villa%20de%20Leyva
```

### Jueves 29 · Hoy es el último día

```
Hoy es el último día con los precios de la etapa 2 de Testigos de la Memoria.

Del 5 al 8 de noviembre, aquí en Villa de Leyva, los periodistas que cubrieron la historia de Colombia la cuentan en persona. Dos de las conversaciones del fin de semana:

María Elvira Samper y Yolanda Ruiz · las mujeres que cubrieron la guerra.
Fidel Cano y Cecilia Orozco · las reelecciones de Uribe y Santos.

El pase de fin de semana está hoy en $240.000 en vez de $270.000. Las boletas, aquí:
https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=cierre-descuento&utm_content=grupos-hoy-termina

¿Dudas? Escríbannos:
https://wa.me/573239236021?text=Hola%2C%20vi%20Testigos%20de%20la%20Memoria%20en%20un%20grupo%20de%20Villa%20de%20Leyva
```
