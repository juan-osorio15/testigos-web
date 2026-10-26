# Reporte · Medición de Meta para Testigos de la Memoria (26 de octubre de 2026)

```
Reporte: verificación de la medición de Meta (píxel y Conversions API) de Testigos de la Memoria, 26 de octubre de 2026.

CÓMO VIAJAN LOS DATOS
1. El sitio testigosdelamemoria.com tiene el píxel de Meta (dataset 1858161698687866). Desde el navegador envía PageView, ViewContent, Lead e InitiateCheckout, solo si el visitante acepta las cookies.
2. Quien llega desde un anuncio trae en el enlace los UTM y el fbclid que agrega Meta. El sitio guarda los UTM y, con cookies aceptadas, las cookies de Meta: _fbp (identifica el navegador) y _fbc (identifica el clic en el anuncio; si no existe, el sitio la arma con el fbclid).
3. La compra ocurre en otro dominio, pretix.eventalist.co, que no puede leer las cookies del sitio. Por eso el sitio le pasa al widget de Pretix los UTM, _fbp y _fbc, y Pretix los guarda en el pedido.
4. Cuando el pedido se confirma y cuando se paga, el plugin de Eventalist en Pretix envía AddPaymentInfo y Purchase a Meta desde el servidor (Conversions API). Van el correo, el teléfono, el nombre, el apellido, el país y un identificador del comprador, cifrados con SHA-256, más _fbp, _fbc, la IP y el navegador. Al salir del servidor, la compra se mide aunque el comprador use bloqueadores.
5. La política de tratamiento de datos del sitio (sección 10) cubre todo este recorrido.

LO QUE SE REVISÓ
- Anuncios: el campo "URL parameters" de los anuncios tiene utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}. Está bien: Meta agrega solo el signo de interrogación que va antes de los parámetros. Queda revisar en cada anuncio activo que el campo Website URL sea https://testigosdelamemoria.com/ sin "#" al final, porque los parámetros pegados después de un "#" se pierden.
- Aviso "Set up manual advanced matching" en Events Manager: pide pasarle al píxel del navegador el correo y el teléfono del visitante. No aplica: el sitio no sabe quién es el visitante, porque esos datos se escriben en Pretix y ya llegan a Meta por la Conversions API. Mandar los del formulario de aviso del sitio no está cubierto por la política de datos. Se marcó como ignorado.
- Calidad de coincidencia (Event Match Quality) del evento Purchase: 8,0 de 10, enviado por la Conversions API. Meta llama "Great" al rango de 8 a 10, el más alto. Mide qué tanto le sirven los datos de cada compra para reconocer al comprador en Facebook o Instagram; un 10 es casi imposible, porque exigiría todos los datos en todas las compras.

LO QUE META SUGIERE AGREGAR Y LO QUE SE VA A HACER
- Click ID (fbc), +16 %: se va a verificar en el plugin de Pretix que llegue en todas las compras que vienen de un anuncio de Meta con cookies aceptadas. Es normal que falte en las compras que llegan por WhatsApp, Google o directo.
- Ciudad, departamento y código postal, +8 % cada uno: se van a enviar cuando el pedido ya los tenga, sin agregar campos a la compra. Antes se confirma con el abogado que la política de datos lo cubre, porque hoy nombra solo correo, teléfono, nombre y apellido.
- Fecha de nacimiento, +8 %: no se va a pedir, porque agregaría un paso a la compra.
- Facebook Login ID, +9 %: no aplica, porque el sitio no tiene inicio de sesión con Facebook.

El impacto esperado es pequeño, porque la calificación ya está en el rango más alto. Los cambios van en el plugin de Pretix y se prueban primero en el evento de prueba (testigos-sandbox) antes de llegar a producción.
```
