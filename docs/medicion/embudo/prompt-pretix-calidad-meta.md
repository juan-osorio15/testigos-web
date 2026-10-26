# Prompt · plugin `pretix-eventalist-tracking`: calidad de coincidencia de Meta

> Copiar como instrucción al agente del repo `pretix-wompi`.

```
Contexto: el plugin de medición de este repo envía AddPaymentInfo y Purchase a la Conversions API de Meta (dataset 1858161698687866). En Events Manager, Purchase tiene una calidad de coincidencia (Event Match Quality) de 8,0/10. Meta sugiere agregar: Click ID (fbc) +16 %, código postal +8 %, ciudad +8 %, departamento (state) +8 %, fecha de nacimiento +8 % y Facebook Login ID +9 %. País y external_id ya no aparecen en las sugerencias, así que ya llegan.

Reglas que no cambian: el plugin no toca el checkout (ni pasos, ni campos, ni textos, ni campos obligatorios nuevos); ningún error del plugin puede deshacer un pago; nada personal en los logs; los campos vacíos se omiten, nunca se envían cadenas vacías; no se inventa fbc. Nada a producción sin el visto bueno del titular.

1. Diagnosticar fbc (lo primero, antes de cambiar código)
   - El sitio testigosdelamemoria.com le pasa fbc al widget de Pretix, junto con los UTM y fbp, solo si el visitante aceptó cookies; Pretix lo guarda con el carrito y el plugin lo copia al pedido. El sitio toma fbc de la cookie _fbc o, si no existe, lo arma como fb.1.<milisegundos de llegada>.<fbclid>. Buscar en el código del plugin dónde lee esos datos del widget.
   - En los pedidos pagados de testigos-memoria, contar sin mostrar datos personales: cuántos traen fbc, cuántos traen consentimiento y cuántos vienen de Meta (utm_medium=paid_social o utm_source fb, ig, facebook o instagram). Revisar que, cuando el pedido trae fbc, el cuerpo enviado a Meta lo incluya en user_data.fbc sin hash, y que el formato sea fb.1.<número>.<valor>.
   - Reportar los números y, si se pierde en algún punto (datos del widget, copia al pedido, armado del cuerpo), dónde. Corregirlo si es del plugin; si el problema está en el sitio, decirlo y no tocar nada fuera de este repo.

2. Enviar ciudad, departamento y código postal solo si ya existen
   - Si el pedido tiene dirección de facturación (invoice_address) con ciudad, departamento o código postal, enviarlos en user_data como ct, st y zp, con SHA-256 y la normalización de Meta: minúsculas, sin tildes, sin espacios ni signos (ct: "bogota", "villadeleyva"; zp: solo dígitos y letras, sin espacios). Para st en Colombia, el nombre del departamento normalizado igual (Meta pide el código de dos letras solo para Estados Unidos).
   - Si el pedido no los tiene, omitirlos. No agregar ni volver obligatorios campos de dirección en el checkout.
   - Antes de implementarlo, revisar si la política de datos del sitio cubre enviarlos (https://testigosdelamemoria.com/tratamiento-de-datos/, sección 10: hoy nombra correo, teléfono, nombre y apellido cifrados). Si no los cubre, no enviarlos: dejar el código listo detrás de una opción apagada y avisar al titular, que lo consulta con el abogado.

3. Lo que no se hace
   - Fecha de nacimiento: habría que pedirla en la compra.
   - Facebook Login ID: el sitio no tiene inicio de sesión con Facebook.

4. Pruebas
   - Normalización y hash de ct, st y zp contra valores calculados a mano (con tildes y espacios: "Bogotá D.C.", "Villa de Leyva", "Boyacá").
   - Un pedido sin dirección no envía ct, st ni zp; un pedido con fbc lo envía tal cual.
   - Ensayo en el evento testigos-sandbox con meta_test_event_code: en Test events de Meta, Purchase muestra fbc, ct, st y zp cuando el pedido los tiene.

Entregar: el diagnóstico de fbc con los números, los cambios en un PR aparte y lo que quede pendiente para el titular.
```
