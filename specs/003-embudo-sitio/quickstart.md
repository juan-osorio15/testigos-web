# Quickstart · comprobación de 003

La prueba de verdad es en el navegador, con capturas guardadas en `specs/003-embudo-sitio/capturas/`. No se agregan pruebas automáticas (decisión del titular).

## 0. Requisitos

- Evento `testigos-sandbox` en modo prueba (listo desde el 2026-10-07, `estado.md`). Nunca `testigos-memoria` en modo prueba.
- `npm run check` y `npm run build` sin errores.

## 1. Sitio local contra el sandbox

```sh
PUBLIC_PRETIX_EVENT_URL=https://pretix.eventalist.co/eventalist/testigos-sandbox/ npm run dev
```

Esperado: el widget muestra el evento de prueba. Sin la variable, `npm run build` y `grep -r testigos-sandbox dist/` no encuentran nada.

## 2. Sin aceptar cookies

1. Pestaña privada nueva: `http://localhost:4321/?utm_source=prueba&utm_campaign=ensayo&fbclid=TEST123`. Pulsar "Seguir sin aceptar".
2. En la consola: `JSON.parse(document.querySelector('.tickets-widget input[name=widget_data]').value)`.

Esperado: `tracking-utm-source`, `tracking-utm-campaign` y `tracking-landing: "/"`. Ninguna clave `tracking-gclid`, `tracking-ga-*`, `tracking-fb*` ni `tracking-consent`. Consola sin errores. Captura.

## 3. Navegar y volver

Ir a `/panelistas/`, luego a otra ficha y volver a la portada por el menú. Repetir la consulta.

Esperado: la misma campaña y `tracking-landing: "/"`. Captura.

## 4. Visita sin campaña

Pestaña privada nueva en `http://localhost:4321/programacion/`, luego ir a la portada.

Esperado: solo `tracking-landing: "/programacion/"`.

## 5. Aceptar cookies

En la pestaña del paso 2, abrir "Cookies y preferencias" y aceptar. Esperar unos segundos, tocar una boleta del widget y repetir la consulta.

Esperado: además `tracking-ga-id`, `tracking-ga-sessid`, `tracking-fbp`, `tracking-fbc` que termina en `.TEST123` y `tracking-consent: "1"`. Captura.

## 6. Revocar

"Cookies y preferencias" → "Retirar la aceptación". Repetir la consulta.

Esperado: las claves de identificadores y `tracking-consent` sin valor (`null` o ausentes); UTM y `landing` intactas. Captura.

## 7. Eventos en la pestaña Red

Filtro `collect` (GA4) y `facebook.com/tr` (Meta), con cookies aceptadas.

1. Clic en "Comprar boleta" del hero y luego en el de la cabecera: un solo `view_item_list` y un solo `ViewContent`; ningún `begin_checkout`.
2. Elegir una boleta y pulsar "Comprar" dos veces (cerrando la pestaña que abre): un solo `begin_checkout` y un solo `InitiateCheckout`, con el mismo identificador de evento.
3. En la tienda abierta, comprobar que la URL lleva `widget_data` con la campaña.

Capturas de cada filtro.

## 8. Bloqueos

Con un bloqueador que impida `googletagmanager.com` y `connect.facebook.net`, repetir los pasos 2 y 7. Esperado: el widget compra igual y no hay errores en consola.

## 9. Páginas legales

`npm run build` y revisar `dist/tratamiento-de-datos/index.html` y `dist/terminos-y-condiciones/index.html` contra la sección C del dictamen, frase por frase, más los ajustes de clarify. Ninguna de estas frases debe aparecer: "Los datos de la compra de boletas no se transmiten a estos proveedores", "salvo que el titular lo autorice por separado", "si lo indica, el teléfono", "[fecha de publicación]".

## 10. Ensayo conjunto (con el plugin desplegado)

Paso 3 de la guía de `pretix-wompi` en `estado.md`: compra completa con la tarjeta 4242 desde el sitio local, con y sin cookies. Esperado: recuadro "Origen" del pedido con la campaña, y con los identificadores solo en la compra con cookies.

## 11. Después de publicar

Alguien del equipo entra a `https://testigosdelamemoria.com/?utm_source=prueba&utm_campaign=verificacion`, llega a la pantalla de pago de Wompi sin pagar y revisa `widget_data` en la URL de la tienda o en el input oculto. Después se cancela ese pedido en Pretix para que no quede en el informe como "confirmó y no pagó" ni reciba recordatorios; la campaña `verificacion` se filtra en los informes.
