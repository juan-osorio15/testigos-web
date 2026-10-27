# Cierre de la etapa 2 · WhatsApp

Tres broadcasts de respond.io, uno por día del martes 27 al jueves 29 de octubre, para que se sienta que el precio de la etapa 2 se acaba. Van junto con tres correos (plan completo en [`../README.md`](../README.md); qué es cada campo de una plantilla y cómo se manda un broadcast, en [`../../reglas.md`](../../reglas.md)).

**Cómo están escritos:** la urgencia va primero, en la imagen y en la primera línea, y es general ("los precios de la etapa 2"). Después viene una sola conversación que antoja y al final el precio. Es la excepción de esta campaña a "primero el antojo" (titular, 2026-10-27).

## Calendario

- **CD1** · martes 27 oct · Quedan 2 días · Marisol Gómez y las mesas de paz
- **CD2** · miércoles 28 oct · Mañana termina · Yolanda Ruiz y María Elvira Samper
- **CD3** · jueves 29 oct · Hoy es el último día · el pase de fin de semana y sus periodistas. Reemplaza a RC4, que no se envía.

## Antes del primer envío (una sola vez, hoy)

- [ ] Crear las tres plantillas en WhatsApp Manager, en la cuenta del número colombiano, campo por campo como dice cada bloque. CD1 tiene que quedar aprobada hoy antes de las 7:00 p.m. para alcanzar a salir. CD2 y CD3 se crean de una vez.
- [ ] Las piezas están en `piezas/` (`CD1.png`, `CD2.png`, `CD3.png`, 1080 × 1080). Hay que subirlas dos veces: al crear la plantilla, como ejemplo para Meta, y al armar el broadcast en respond.io, porque la imagen que Meta guarda es solo de muestra y no viaja con la plantilla.

## Cada día

1. Confirmar en Pretix que el pase de fin de semana sigue en $240.000 y el pase completo en $340.000, y que ninguno está agotado.
2. En respond.io: Broadcasts → nuevo broadcast → canal WhatsApp del número colombiano → la plantilla del día.
3. En el encabezado, subir la pieza del día. En `{{1}}`, el campo First Name.
4. Audiencia: Lifecycle distinto de Customer y la casilla Baja sin marcar (incluye a los del segmento `inactivos`).
5. Programarlo entre 9:00 y 11:00 a.m. (siempre dentro de 7:00 a.m. a 7:00 p.m.).

---

## CD1 · martes 27 de octubre

- **Nombre:** `cd1_quedan_dos_dias`
- **Categoría:** Marketing
- **Idioma:** español (`es`)
- **Encabezado:** imagen → `piezas/CD1.png`
- **Cuerpo:**

```
Hola, {{1}}. Quedan 2 días con los precios de la etapa 2 de Testigos de la Memoria. El jueves 29 de octubre es el último día; después, el descuento es menor.

¿Qué pasó de verdad en las mesas del Caguán y de La Habana? Marisol Gómez cubrió las negociaciones de paz durante 25 años y el sábado 7 de noviembre lo cuenta en Villa de Leyva, con tiempo para hacerle preguntas.

El pase de fin de semana está en $240.000 en vez de $270.000, y el pase completo en $340.000. ¿Te ayudamos a escoger tu boleta?
```

- **Ejemplo de `{{1}}`:** `Ana`
- **Pie:** `Eventalist S.A.S. · Para no recibir más, responde BAJA.`
- **Botón de respuesta rápida:** `Sí, ayúdame`
- **Botón de enlace:** texto `Ver boletas`, URL estática:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=cierre-descuento&utm_content=plantilla-quedan-dos-dias`

## CD2 · miércoles 28 de octubre

- **Nombre:** `cd2_manana_termina`
- **Categoría:** Marketing
- **Idioma:** español (`es`)
- **Encabezado:** imagen → `piezas/CD2.png`
- **Cuerpo:**

```
Hola, {{1}}. Mañana jueves termina la etapa 2 de Testigos de la Memoria. Desde el viernes, el descuento es menor.

Yolanda Ruiz y María Elvira Samper cubrieron la guerra y el poder cuando casi ninguna mujer dirigía un noticiero en Colombia. El domingo 8 de noviembre en la mañana cuentan en Villa de Leyva cómo fue.

Esa conversación entra en el pase de fin de semana, que hasta mañana está en $240.000 en vez de $270.000. ¿Te lo dejamos listo?
```

- **Ejemplo de `{{1}}`:** `Ana`
- **Pie:** `Eventalist S.A.S. · Para no recibir más, responde BAJA.`
- **Botón de respuesta rápida:** `Sí, quiero`
- **Botón de enlace:** texto `Ver boletas`, URL estática:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=cierre-descuento&utm_content=plantilla-manana-termina`

## CD3 · jueves 29 de octubre

- **Nombre:** `cd3_hoy_ultimo_dia`
- **Categoría:** Marketing
- **Idioma:** español (`es`)
- **Encabezado:** imagen → `piezas/CD3.png`
- **Cuerpo:**

```
Hola, {{1}}. Hoy es el último día de la etapa 2 de Testigos de la Memoria. Desde mañana, el descuento es menor.

Con el pase de fin de semana escuchas el sábado y el domingo a Fidel Cano, Cecilia Orozco, Yolanda Ruiz, María Elvira Samper y Marisol Gómez, entre otros, y les puedes hacer preguntas en persona.

Hoy está en $240.000 en vez de $270.000. ¿Te lo dejamos listo?
```

- **Ejemplo de `{{1}}`:** `Ana`
- **Pie:** `Eventalist S.A.S. · Para no recibir más, responde BAJA.`
- **Botón de respuesta rápida:** `Sí, quiero`
- **Botón de enlace:** texto `Ver boletas`, URL estática:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=cierre-descuento&utm_content=plantilla-hoy-termina`
