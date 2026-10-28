# Cierre de la etapa 2 · CD

Tres días de mensajes, del martes 27 al jueves 29 de octubre de 2026, para que se sienta que el precio de la etapa 2 se acaba. Desde el viernes 30 rige la etapa 3 y el descuento es menor (`src/data/event.ts`). Va por dos canales: correo (con `campana.py`, a interesados y expirados) y WhatsApp (broadcasts de respond.io).

## Qué cambia frente a las otras campañas

- **La urgencia va primero** (titular, 2026-10-27). El mensaje abre con cuántos días quedan; después, una sola conversación que antoja; al final, el precio.
- **El anuncio es general:** "quedan 2 días con los precios de la etapa 2", no solo del pase de fin de semana. Los precios concretos van abajo.
- **Los correos van con diseño, cifras y botón.** Es una excepción a los correos conversacionales solo para esta campaña: con texto plano igual caían en Promociones, y una fecha límite no se puede esconder. Las demás campañas siguen con la regla de siempre.
- Sin " — ", sin mayúsculas gritadas, sin "últimos cupos" ni contadores. La urgencia es la fecha, no el tono.

## Calendario

- **Martes 27 oct · CD1 · Quedan 2 días.** Antojo: Marisol Gómez y las mesas del Caguán y de La Habana.
- **Miércoles 28 oct · CD2 · Mañana termina.** Antojo: dos conversaciones en corto, nombres · tema: María Elvira Samper y Yolanda Ruiz, Fidel Cano y Cecilia Orozco.
- **Jueves 29 oct · CD3 · Hoy es el último día.** Antojo: las mismas dos conversaciones de CD2.

Los correos cuentan el evento completo. Los WhatsApp van sin imagen: primero presentan el encuentro y después nombran a los periodistas (titular, 2026-10-27). La pieza de la campaña desde el 28 es [`whatsapp/piezas/cierre-etapa-2.jpg`](whatsapp/piezas/cierre-etapa-2.jpg), para lo que se publica a mano.

Cada día: el correo a interesados, el correo a expirados y el broadcast de respond.io. Dentro del horario de la Ley 2300 (lunes a viernes de 7:00 a.m. a 7:00 p.m.), mejor entre 9:00 y 11:00 a.m.

## Antes de cada envío

- Confirmar en Pretix que el pase de fin de semana sigue en $240.000 y el pase completo en $340.000, y que ninguno está agotado.
- `npm run build` si cambió algo en `src/data/` (los correos toman los precios de ahí). Los correos se niegan a salir desde el 30 de octubre: la variable `{{fin_etapa_actual}}` deja de existir cuando termina la etapa.

## Los medios

- [`correo/`](correo/): tres plantillas con diseño, una por día, a interesados y a expirados con `campana.py`.
- [`whatsapp/`](whatsapp/): tres plantillas de Meta con encabezado de texto (sin imagen), por broadcast de respond.io a todos los contactos sin compra. CD3 reemplaza a RC4 de `inactivos`.

## Cómo se mide

`utm_campaign=cierre-descuento` en todos los enlaces (anotada en `docs/medicion/embudo/enlaces-y-nombres.md`). El contenido dice el canal y el día: `correo-quedan-dos-dias`, `correo-manana-termina`, `correo-hoy-termina` y `plantilla-quedan-dos-dias`, `plantilla-manana-termina`, `plantilla-hoy-termina`, y para los grupos, `grupos-manana-termina` y `grupos-hoy-termina`. Quien responde en WhatsApp sigue con Catalina, que da sus propios enlaces.
