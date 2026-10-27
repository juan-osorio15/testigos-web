# Cierre de la etapa 2 · CD

Tres días de mensajes, del martes 27 al jueves 29 de octubre de 2026, para que se sienta que el precio de la etapa 2 se acaba. Desde el viernes 30 rige la etapa 3 y el descuento es menor (`src/data/event.ts`). Va por dos canales: correo (con `campana.py`, a interesados y expirados) y WhatsApp (broadcasts de respond.io).

## Qué cambia frente a las otras campañas

- **La urgencia va primero** (titular, 2026-10-27). El mensaje abre con cuántos días quedan; después, una sola conversación que antoja; al final, el precio.
- **El anuncio es general:** "quedan 2 días con los precios de la etapa 2", no solo del pase de fin de semana. Los precios concretos van abajo.
- **Los correos van con diseño, cifras y botón.** Es una excepción a los correos conversacionales solo para esta campaña: con texto plano igual caían en Promociones, y una fecha límite no se puede esconder. Las demás campañas siguen con la regla de siempre.
- Sin " — ", sin mayúsculas gritadas, sin "últimos cupos" ni contadores. La urgencia es la fecha, no el tono.

## Calendario

- **Martes 27 oct · CD1 · Quedan 2 días.** Antojo: Marisol Gómez y las mesas del Caguán y de La Habana.
- **Miércoles 28 oct · CD2 · Mañana termina.** Antojo: Yolanda Ruiz y María Elvira Samper.
- **Jueves 29 oct · CD3 · Hoy es el último día.** Antojo: el recorrido completo con sus periodistas.

Cada día: el correo a interesados, el correo a expirados y el broadcast de respond.io. Dentro del horario de la Ley 2300 (lunes a viernes de 7:00 a.m. a 7:00 p.m.), mejor entre 9:00 y 11:00 a.m.

## Antes de cada envío

- Confirmar en Pretix que el pase de fin de semana sigue en $240.000 y el pase completo en $340.000, y que ninguno está agotado.
- `npm run build` si cambió algo en `src/data/` (los correos toman los precios de ahí). Los correos se niegan a salir desde el 30 de octubre: la variable `{{fin_etapa_actual}}` deja de existir cuando termina la etapa.

## Correo

Plantillas `scripts/campanas/plantillas/cierre-descuento-1.html`, `-2` y `-3`. Una configuración por día y audiencia en `scripts/campanas/config/` (`cierre-descuento-1-interesados`, `cierre-descuento-1-expirados`, …). Interesados y expirados no se cruzan: la audiencia de interesados ya deja por fuera a quien tiene un pedido expirado.

Asuntos:

- Día 1: `Quedan 2 días con los precios de la etapa 2`
- Día 2: `Mañana termina la etapa 2`
- Día 3: `Hoy es el último día de la etapa 2`

Comandos del día (cambiar el número del día):

```sh
python3 scripts/campanas/campana.py correo cierre-descuento-1-interesados                                       # vista previa
python3 scripts/campanas/campana.py correo cierre-descuento-1-interesados --prueba manager@eventalist.co --enviar  # prueba
python3 scripts/campanas/campana.py correo cierre-descuento-1-interesados --enviar                               # envío real
python3 scripts/campanas/campana.py correo cierre-descuento-1-expirados                                         # vista previa
python3 scripts/campanas/campana.py correo cierre-descuento-1-expirados --prueba manager@eventalist.co --enviar    # prueba
python3 scripts/campanas/campana.py correo cierre-descuento-1-expirados --enviar                                 # envío real
```

Resend gratis manda 100 correos al día. Si las dos listas suman más, el envío se detiene en el límite y al día siguiente sigue con los que faltan, que ya no sirve para esta campaña: revisar el total con la vista previa antes de enviar.

## WhatsApp (respond.io)

Las plantillas se crean en WhatsApp Manager, en la cuenta del número colombiano, categoría Marketing, idioma español. **La de cada día tiene que estar aprobada antes de enviarla:** CD1 se crea ya, para que alcance a salir hoy antes de las 7:00 p.m.; CD2 y CD3 de una vez, para no depender de la aprobación esos días.

- Variable `{{1}}`: First Name. Ejemplo para Meta: "Ana".
- Audiencia: todos los contactos con Lifecycle distinto de Customer y la casilla Baja sin marcar. Incluye a los del segmento `inactivos`.
- **Cruce con RC (`../whatsapp/respondio/inactivos/`):** CD3 reemplaza a RC4, que dice lo mismo; RC4 no se envía. RC2 y RC3 siguen: a los inactivos esos días les llegan dos mensajes, lo que las reglas permiten.

### CD1 · martes 27 de octubre · `cd1_quedan_dos_dias`

```
Hola, {{1}}. Quedan 2 días con los precios de la etapa 2 de Testigos de la Memoria. El jueves 29 de octubre es el último día; después, el descuento es menor.

¿Qué pasó de verdad en las mesas del Caguán y de La Habana? Marisol Gómez cubrió las negociaciones de paz durante 25 años y el sábado 7 de noviembre lo cuenta en Villa de Leyva, con tiempo para hacerle preguntas.

El pase de fin de semana está en $240.000 en vez de $270.000, y el pase completo en $340.000. ¿Te ayudamos a escoger tu boleta?
```

- Pie: `Eventalist S.A.S. · Para no recibir más, responde BAJA.`
- Botón de respuesta rápida **Sí, ayúdame**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=cierre-descuento&utm_content=plantilla-quedan-dos-dias`

### CD2 · miércoles 28 de octubre · `cd2_manana_termina`

```
Hola, {{1}}. Mañana jueves termina la etapa 2 de Testigos de la Memoria. Desde el viernes, el descuento es menor.

Yolanda Ruiz y María Elvira Samper cubrieron la guerra y el poder cuando casi ninguna mujer dirigía un noticiero en Colombia. El domingo 8 de noviembre en la mañana cuentan en Villa de Leyva cómo fue.

Esa conversación entra en el pase de fin de semana, que hasta mañana está en $240.000 en vez de $270.000. ¿Te lo dejamos listo?
```

- Pie: `Eventalist S.A.S. · Para no recibir más, responde BAJA.`
- Botón de respuesta rápida **Sí, quiero**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=cierre-descuento&utm_content=plantilla-manana-termina`

### CD3 · jueves 29 de octubre · `cd3_hoy_ultimo_dia`

```
Hola, {{1}}. Hoy es el último día de la etapa 2 de Testigos de la Memoria. Desde mañana, el descuento es menor.

Con el pase de fin de semana escuchas el sábado y el domingo a Fidel Cano, Cecilia Orozco, Yolanda Ruiz, María Elvira Samper y Marisol Gómez, entre otros, y les puedes hacer preguntas en persona.

Hoy está en $240.000 en vez de $270.000. ¿Te lo dejamos listo?
```

- Pie: `Eventalist S.A.S. · Para no recibir más, responde BAJA.`
- Botón de respuesta rápida **Sí, quiero**.
- Botón de enlace **Ver boletas** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=cierre-descuento&utm_content=plantilla-hoy-termina`

## Cómo se mide

`utm_campaign=cierre-descuento` en todos los enlaces (anotada en `docs/medicion/embudo/enlaces-y-nombres.md`). El contenido dice el canal y el día: `correo-quedan-dos-dias`, `correo-manana-termina`, `correo-hoy-termina` y `plantilla-quedan-dos-dias`, `plantilla-manana-termina`, `plantilla-hoy-termina`. Quien responde en WhatsApp sigue con Catalina, que da sus propios enlaces.
