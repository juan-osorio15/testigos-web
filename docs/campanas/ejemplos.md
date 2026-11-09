# Ejemplos · lo que mejor funcionó

Las piezas de Testigos de la Memoria (2026) que más vendieron, con su texto, para usarlas de modelo. Las cifras y de dónde salen, en [`README.md`](README.md). Los precios y las fechas son los de este evento.

La pieza que más vendió no está aquí: el anuncio del pase completo de la recta final en Meta (`ventas_recta-final_c1_c2`, `c1_pase-completo_ad`, 7 pagados). Su texto y su imagen están en el Administrador de anuncios de Meta.

## El afiche de las caras: últimos días

Grupos de Villa de Leyva (3 pagados por enlace) y, con el mismo afiche en el encabezado, la plantilla de inactivos RC9 (1 pagado, la única de su campaña). Es la promoción general: la fecha, todos los nombres conocidos y los temas, sin una charla en particular. Imagen: [`ejemplos/afiche-caras-ultimos-dias.jpg`](ejemplos/afiche-caras-ultimos-dias.jpg).

Para grupos (publicado a mano, el 3 de noviembre):

```
Este jueves empieza Testigos de la Memoria y son los últimos días para conseguir boleta.

Daniel Samper Pizano, Yolanda Ruiz, María Elvira Samper, Fidel Cano, Cecilia Orozco y otros periodistas que cubrieron de frente la historia reciente de Colombia van a estar aquí, en la Hospedería Duruelo, del viernes 6 al domingo 8 de noviembre. Cuentan lo que vieron y responden preguntas. El aforo es limitado.

Boleta de medio día: $90.000, o el pase de fin de semana, que está en descuento.

Boletas en la página:
https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=grupos-villa&utm_content=afiche-caras_ultimos-dias

¿Dudas? Escríbannos:
https://wa.me/573239236021?text=Hola%2C%20vi%20Testigos%20de%20la%20Memoria%20en%20un%20grupo%20de%20Villa%20de%20Leyva
```

Plantilla de Meta `rc9_ultimos_dias` (broadcast de respond.io a inactivos), encabezado de imagen con el afiche, pie `Eventalist S.A.S. · Responde BAJA para no recibir más`, botón de respuesta **Sí, ayúdame** y botón de enlace **Ver boletas**:

```
Este jueves empieza Testigos de la Memoria y quedan pocos días para conseguir tu boleta.

Daniel Samper Pizano, Yolanda Ruiz, María Elvira Samper, Fidel Cano, Cecilia Orozco, Luz María Sierra, Martha Soto, Marta Ruiz y María Alejandra Villamizar, entre otros periodistas, cuentan en persona lo que les tocó cubrir de frente, y puedes hacerles preguntas.

El Bogotazo y el Frente Nacional, el surgimiento de las guerrillas, lo que pasó en las mesas del Caguán y La Habana, el narcotráfico y el paramilitarismo, las reelecciones de Uribe y Santos, y lo que fue ser mujer periodista en medio del conflicto.

Del 5 al 8 de noviembre en Villa de Leyva. El aforo es limitado.
Boleta de medio día: $90.000
Pase de fin de semana: $255.000, con descuento por tiempo limitado
Pase completo: $340.000

¿Te ayudamos a escoger tu boleta?
```

## La noticia: llega una invitada

Grupos de Villa de Leyva, 31 de octubre: 4 pedidos y los 4 pagados, lo mejor de los grupos. Una noticia abre mejor que una pregunta. Imagen: la tarjeta de su ficha en el sitio, [`ejemplos/llega-maria-alejandra-villamizar.jpg`](ejemplos/llega-maria-alejandra-villamizar.jpg).

```
Se suma una invitada a Testigos de la Memoria: María Alejandra Villamizar. Conoce las negociaciones de paz desde adentro: trabajó en la Oficina del Alto Comisionado para la Paz en los años del Caguán y fue delegada del Gobierno en la mesa con el ELN.

Va a conversar con Marisol Gómez el sábado 7 de noviembre a las 11:00 a.m., aquí en la Hospedería Duruelo. El aforo es limitado.

Boleta de medio día: $90.000, o el pase de fin de semana, que está en descuento.

Boletas en la página:
https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=grupos-villa&utm_content=anuncio-maria-alejandra-villamizar

¿Dudas? Escríbannos:
https://wa.me/573239236021?text=Hola%2C%20vi%20Testigos%20de%20la%20Memoria%20en%20un%20grupo%20de%20Villa%20de%20Leyva
```

## El correo de fecha límite

Primer día del cierre de la etapa 2, 27 de octubre. De las 14 personas que habían dejado vencer un pedido, 6 compraron después. Con diseño, precios y un botón; la urgencia en el asunto y en la primera línea. Plantilla: `scripts/campanas/plantillas/cierre-descuento-1.html`.

Asunto: `Quedan 2 días con los precios de la etapa 2`

```
Quedan 2 días con los precios de la etapa 2.
Después, el descuento es menor.

Hasta el jueves 29 de octubre puedes ir a Testigos de la Memoria con los precios de la etapa 2. Es la mejor oportunidad que queda: el pase de fin de semana cubre todos los conversatorios del sábado y el domingo, y el pase completo, los del viernes al domingo.

Vas a escuchar en persona a Daniel Samper Pizano, Fidel Cano, Yolanda Ruiz, María Elvira Samper, Cecilia Orozco, Luz María Sierra y Marisol Gómez, entre otros, contando lo que vieron de cerca: el Bogotazo y el Frente Nacional, el Caguán y La Habana, el narcotráfico, las reelecciones de Uribe y Santos, y las mujeres que cubrieron el conflicto.

Es del 6 al 8 de noviembre en Villa de Leyva, y en cada conversación les puedes hacer preguntas.

[Pase de fin de semana · Pase completo, con sus precios]
[Ver boletas]

¿Tienes alguna duda? Responde este correo y te ayudo a escoger.
```

## El aviso a quien lo pidió

Correo a los inscritos del sitio que pidieron que les avisáramos de las boletas de medio día (19 de octubre): 4 de 18 compraron después, 2 de ellos desde el botón del final. Con diseño, el precio arriba, las cuatro boletas con su tema y sus periodistas, y dos botones. La plantilla se reemplazó después por una conversacional que no vendió; la original está en git: `git show b0b9123^:scripts/campanas/plantillas/interesado-aviso.html`.
