# Reportes para el informe de tráfico y campañas

Lista de lo que hay que exportar para que Claude escriba la guía del informe y el script que genera el PDF. Marca cada casilla cuando el archivo esté en la carpeta.

## Antes de empezar

- [ ] Elegir el rango de fechas y usar **el mismo en todos los reportes**: desde el día en que empezó la venta (o el primer anuncio) hasta ayer. Anotarlo aquí: `____ a ____`.
- [ ] Crear la carpeta `~/Downloads/reporte-testigos/` y guardar ahí cada archivo con un nombre que diga qué es (por ejemplo `ga4-campanas.csv`, `meta-anuncios-region.csv`).

**Qué se puede medir y desde cuándo.** El plugin de Pretix está activo en `testigos-memoria` desde el 8 de octubre de 2026 a las 11:41 p. m. Desde entonces cada pedido guarda la campaña con la que llegó la persona, y el informe puede decir qué campaña generó cada compra en tres lugares:

- **Pretix:** recuadro "Origen" de cada pedido y la página "Ventas por campaña" del evento. Esa página solo se ve en pantalla; no se descarga.
- **Backend:** Ticket orders, con filtros y resumen por campaña, y la exportación a CSV cuando esté desplegada.
- **GA4:** `add_payment_info` (pedido confirmado) y `purchase` (pedido pagado) llegan desde el plugin y quedan unidos a la visita con su campaña. Solo pasa si la persona aceptó las cookies (ver "Entender Google Analytics").

Los pedidos anteriores al 9 de octubre no tienen campaña y aparecen como "Sin campaña". Hay además un límite conocido: hasta el 13 de octubre la campaña se perdía si la persona compraba en otra visita, y del 9 al 12 de octubre solo 1 de unos 23 pedidos llegó con UTM. Desde el 13 de octubre el sitio la recuerda hasta 30 días en el mismo navegador. Las ventas totales siguen saliendo de Pretix.

## Google Analytics 4

Para exportar cualquier informe: icono de compartir (arriba a la derecha) → "Descargar archivo" → CSV.

- [ ] **1. Canales.** Informes → Adquisición → Adquisición de tráfico. Dimensión "Grupo de canales principal de la sesión". Ya existe uno, pero hay que repetirlo con el rango completo.
- [ ] **2. Fuente / medio.** El mismo informe, cambiando la dimensión (flecha junto al nombre de la primera columna) a "Fuente/medio de la sesión".
- [ ] **3. Campañas.** El mismo informe con la dimensión "Campaña de la sesión".
- [ ] **3b. Compras por campaña en GA4.** El mismo informe de campañas. En la columna "Eventos clave", abrir la flecha y elegir solo `purchase`; hacer lo mismo con `add_payment_info` y exportar otro CSV. Solo cuenta compras de quien aceptó las cookies; el total real de ventas sale de Pretix.
- [ ] **3c. Interesados por campaña en GA4.** El mismo informe de campañas, con la columna "Eventos clave" filtrada a `generate_lead`. Exportar en CSV. Solo existe desde que se publicó ese evento.
- [ ] **4. Exploración por campaña y contenido.** Explorar → Exploración libre.
  - En Variables, con el "+" de Dimensiones, importar: Campaña de la sesión, Fuente/medio de la sesión, Contenido de anuncio manual de la sesión.
  - Con el "+" de Métricas, importar: Sesiones, Usuarios activos, Sesiones con interacción, Tasa de interacción, Duración media de la sesión.
  - Arrastrar las tres dimensiones a "Filas" y las cinco métricas a "Valores".
  - En "Filas", subir "Mostrar filas" a 100 para que no se corte.
  - Exportar: icono de descarga arriba a la derecha de la exploración → CSV.
- [ ] **5. Clics en "comprar" por campaña.** Duplicar la exploración anterior (clic derecho en la pestaña → Duplicar).
  - Importar la dimensión "Nombre del evento" y la métrica "Recuento de eventos"; poner la métrica en "Valores".
  - En "Filtros": "Nombre del evento" coincide exactamente con `begin_checkout`.
  - Exportar en CSV.
- [ ] **6. Tendencia diaria.** Nueva pestaña de Exploración libre.
  - Filas: "Fecha".
  - Valores: Usuarios activos, Usuarios nuevos, Sesiones, Recuento de eventos.
  - Exportar en CSV.
- [ ] **7. Geografía por región.** Informes → Usuario → Atributos de usuario → Detalles demográficos. Cambiar la dimensión a "Región". Exportar.
- [ ] **7b. Geografía por ciudad.** El mismo informe con la dimensión "Ciudad". Exportar.
- [ ] **8. Dispositivo.** Informes → Tecnología → Descripción general de la tecnología (o "Detalles de tecnología"), dimensión "Categoría de dispositivo". Exportar.

## Meta

El "píxel" no es otra plataforma: es el código instalado en el sitio. Sus datos se ven en dos partes de Meta Business Suite: el Administrador de anuncios y el Administrador de eventos.

- [ ] **9. Anuncios.** Administrador de anuncios → seleccionar las campañas de Testigos → pestaña **Anuncios** → el rango de fechas.
  - Columnas → Personalizar columnas. Dejar: Importe gastado, Alcance, Impresiones, Frecuencia, Clics en el enlace, CTR (porcentaje de clics en el enlace), CPC (costo por clic en el enlace), Visitas a la página de destino, Resultados, Costo por resultado.
  - Guardar como preset (por ejemplo "Informe Testigos") para reutilizarlo.
  - Exportar → "Exportar datos de la tabla" → CSV.
- [ ] **10. Anuncios por región.** La misma tabla con Desglose → Por entrega → Región. Exportar otro CSV. Sirve para saber cuánta gente de Boyacá vio y tocó los anuncios.
- [ ] **11. Píxel.** Administrador de eventos → Orígenes de datos → el píxel del sitio → Información general, con el mismo rango de fechas. Una **captura de pantalla** basta: muestra cuántos `PageView` e `InitiateCheckout` recibió.

## Pretix

- [ ] **12. Pedidos.** Evento de producción → Pedidos → Exportar → "Lista de pedidos" (CSV o Excel). Se necesitan: código, fecha, estado, total, producto y medio de pago. **Antes de pasarlo, borrar las columnas de nombre, correo y teléfono.**
- [ ] **13. Panel del evento.** Captura de pantalla del resumen de ventas por producto en el panel del evento.
- [ ] **13b. Ventas por campaña.** Evento de producción → "Ventas por campaña", con el mismo rango de fechas. **Captura de pantalla**: la página no se puede descargar. Muestra por fuente, campaña y contenido los pedidos confirmados, pagados, vencidos y cancelados, y el total pagado.

## Backend (interesados y pedidos)

- [ ] **14. Contactos de la campaña Testigos.** Exportar desde el admin la lista de contactos de la campaña. Se necesitan la fecha de registro, el origen y la etapa (interesado, confirmó y no pagó, compró). **Borrar nombre, correo y teléfono antes de pasarlo.** Es la única fuente completa de los interesados: GA4 solo los cuenta desde que se publicó `generate_lead` y solo si aceptaron cookies.
- [ ] **15. Pedidos con campaña.** Admin → Ticket orders → filtrar la campaña de Testigos y el rango de fechas → seleccionar todos → acción "Export selected orders as CSV". Ya viene sin datos personales. Si la acción no aparece, es que la exportación todavía no está desplegada: en ese caso, una captura del resumen que sale encima de la lista.

## Datos que solo tú tienes

Escribirlos aquí mismo o en un mensaje:

- [ ] **Todas las URL con UTM** que se han usado, no solo las dos del afiche y el reel: QR de afiches impresos, enlace de la bio de Instagram, correos, mensajes de WhatsApp.
- [ ] **Fechas clave**: inicio de la preventa, inicio y fin de cada anuncio, publicaciones grandes en redes, cambios de precio (el 13 de octubre empieza la etapa 2).
- [ ] **Para quién es el informe**: para uso interno, para tu hermana o para los organizadores del evento. Cambia el tono y el nivel de detalle del PDF.

## Cuando esté todo

Pasarle a Claude la carpeta `~/Downloads/reporte-testigos/` y las respuestas de arriba. Claude revisa qué trae cada archivo y recién entonces escribe la guía del informe y el script del PDF, sin suponer columnas que no existan.

---

# Entender Google Analytics

Esta parte no es para exportar nada. Es para que sepas qué mirar en GA4 cada semana, qué significan las palabras que usa y dónde aparece lo que le mandan el sitio y el plugin de Pretix. Datos del plugin confirmados por `pretix-wompi` el 2026-10-13.

## Las palabras que más vas a ver

- **Usuario:** un navegador, no una persona. La misma persona en el celular y en el computador son dos usuarios.
- **Sesión:** una visita. Empieza cuando alguien entra y termina tras 30 minutos sin actividad.
- **Evento:** cualquier cosa que pasa en una visita y se registra: ver una página, pulsar "Comprar", pagar.
- **Evento clave:** un evento que marcaste con estrella porque importa para el negocio. GA4 los cuenta aparte en casi todos los informes, en la columna "Eventos clave".
- **Fuente:** de dónde vino la visita (`ig`, `instagram`, `google`, `whatsapp`).
- **Medio:** qué tipo de enlace era (`paid_social`, `social`, `organic`, `referral`).
- **Campaña:** el nombre que le pusimos (`etapa2-2026`, `bio`). Fuente, medio y campaña salen de las UTM del enlace; sin UTM, GA4 los adivina con el sitio de donde vino la persona.
- **Grupo de canales:** la clasificación que GA4 hace con fuente y medio: Paid Social, Organic Social, Organic Search, Direct, Referral, Email. Las reglas están en `../guia-manager-redes.md`.
- **"De la sesión" y "del primer usuario":** muchas dimensiones existen en dos versiones. "Fuente de la sesión" es cómo llegó esa visita. "Fuente del primer usuario" es cómo llegó ese navegador la primera vez. Para campañas casi siempre interesa la de la sesión.
- **Directo, o `(direct) / (none)`:** GA4 no sabe de dónde vino: la persona escribió la dirección, usó un favorito o abrió el enlace desde una app que no deja rastro. Cuando una visita directa viene después de una con campaña, GA4 le pone la campaña anterior (hasta 90 días) en los informes de sesión.
- **`(not set)`:** el dato no llegó. Es normal en una porción pequeña; si crece, algo está mal configurado.

## Qué ve GA4 y qué no

- GA4 solo registra en detalle a quien **aceptó las cookies**. De quien no acepta recibe avisos sin identificador que no aparecen en los informes. Por eso GA4 siempre muestra menos visitas y menos ventas que la realidad. **Las ventas reales las cuenta Pretix.** GA4 sirve para comparar campañas y ver tendencias, no para el total.
- El sitio le manda cuatro eventos propios:
  - `generate_lead`: alguien se inscribió en la lista de interesados (el formulario que va al backend de Eventalist). Lleva de dónde se inscribió (`lead_source`: `aviso_franja` si fue en el modal "Avísame" de una franja, `lista_interesados` si fue en el formulario general) y, en el modal, qué franja (`franja`). Nunca datos de la persona. Al píxel de Meta va el mismo aviso como `Lead`.
  - `view_item_list`: la persona pulsó un botón que lleva a la sección de boletas.
  - `begin_checkout`: pulsó "Comprar" en la tienda.
  - `contact`: pulsó el enlace de WhatsApp de dudas.
- El plugin de Pretix le manda dos, desde el servidor de Pretix:
  - `add_payment_info`: se confirmó un pedido (datos llenos, pago pendiente). Lleva el valor del pedido, el producto y el medio de pago (`wompi`).
  - `purchase`: se pagó el pedido. Lleva el valor, el producto y el código del pedido.
- El valor (`value`) es el total del pedido **con comisiones**. Por eso los ingresos de GA4 no coinciden con la suma de precios de los productos.
- El plugin no le manda la campaña a GA4. Le manda el identificador del navegador y el de la visita, y GA4 une la compra con esa visita, que ya tiene su fuente, medio y campaña. Cuando la persona no aceptó cookies, el pedido llega sin esos identificadores, con el parámetro `atribucion` = `sin_sesion`. Todavía no sabemos en qué fila de los informes aparecen esos pedidos (probablemente `(direct)` o `(not set)`).
- Nunca se envían a GA4 correo, teléfono, nombre, IP ni navegador.
- El formulario de interesados no le avisaba nada a GA4 hasta que se publicó `generate_lead`. Los anteriores, y los de quien no acepta cookies, se cuentan en el backend.
- GA4 no da nombres. Para saber **quién** dejó una compra a medias se usan el backend (etapa "confirmó y no pagó") y los pedidos vencidos de Pretix.

## Configuración pendiente en GA4 (una sola vez)

Todo está en **Administrar** (engranaje abajo a la izquierda). Ninguno de estos cambios es retroactivo: valen desde el día en que se hacen, así que conviene hacerlos ya.

- [ ] **Eventos clave.** Administrar → Visualización de datos → Eventos → pestaña "Eventos recientes". Poner la estrella a `generate_lead` y a `add_payment_info`. `purchase` ya es clave por defecto. `generate_lead` solo aparece en la lista después de la primera inscripción publicada; si no está, volver a mirar después. En la pestaña "Eventos clave", quitar la estrella a `close_convert_lead` y `qualify_lead`: son sugerencias de GA4 que nada envía. `begin_checkout` es opcional: con más de dos o tres eventos clave los informes cuestan más de leer.
- [ ] **Dimensión personalizada `atribucion`.** Administrar → Visualización de datos → Definiciones personalizadas → "Crear dimensión personalizada". Nombre: `Atribución`. Ámbito: Evento. Parámetro del evento: `atribucion`. Sin esto GA4 recibe el dato pero no deja verlo. Sirve para saber cuántas compras llegaron sin visita (`sin_sesion`) y dónde las pone GA4.
- [ ] **Dimensiones `lead_source` y `franja`.** Igual que la anterior, dos veces: nombre `Origen del interesado`, parámetro `lead_source`; nombre `Franja de interés`, parámetro `franja`. Ámbito: Evento. Con ellas se ve qué franjas despiertan más interés antes de abrir su venta.
- [ ] **Conservación de datos a 14 meses.** Administrar → Recogida y modificación de datos → Conservación de datos → "Conservación de datos de eventos": 14 meses → Guardar. Por defecto son 2 meses, y las exploraciones (la parte de Explorar) no pueden mirar más atrás que eso. Para comparar con la edición 2027 hace falta el máximo.
- [ ] **Referencias no deseadas.** Administrar → Recogida y modificación de datos → Flujos de datos → el flujo web → "Configurar ajustes de etiquetas" → "Mostrar todo" → "Especificar referencias no deseadas". Agregar `pretix.eventalist.co` y `checkout.wompi.co`. Así, quien vuelve de la tienda o de la pasarela al sitio no aparece como si lo hubiera traído Pretix o Wompi.
- [ ] **"Configuración de atribución"** (el botón junto a "Crear evento"): dejarla como está. Ahí se elige cómo GA4 reparte el crédito de una compra entre varias visitas; la opción por defecto sirve.

## Qué mirar cada semana

Usa siempre el selector de fechas de arriba a la derecha y, si quieres ver la evolución, la opción "Comparar" con la semana anterior.

1. **Informes → Tiempo real.** Para comprobar al momento que un enlace nuevo llega con sus UTM: lo abres desde el celular y en menos de un minuto aparece con su fuente y campaña. No es para medir, es para verificar.
2. **Informes → Adquisición → Adquisición de tráfico.** El informe principal. Una fila por canal (o por fuente/medio o campaña si cambias la dimensión) con sesiones, interacción, eventos clave e ingresos. Responde "¿qué campaña trae visitas que terminan comprando?". En la columna "Eventos clave" puedes elegir uno solo (`purchase` o `add_payment_info`) con la flecha del encabezado.
3. **Informes → Adquisición → Adquisición de usuarios.** Lo mismo, pero con la primera visita de cada navegador. Sirve para ver qué canal **trae gente nueva**, aunque después compren por otro camino.
4. **Informes → Interacción → Páginas y pantallas.** Qué páginas se ven más y cuánto tiempo. Útil para saber si la gente lee la agenda o los panelistas antes de comprar.
5. **Informes → Interacción → Eventos.** Cuántas veces pasó cada evento. Es la manera rápida de ver el embudo completo: `view_item_list`, `begin_checkout`, `add_payment_info` y `purchase` uno al lado del otro.
6. **Informes → Monetización.** Ingresos y compras por producto (Pase Completo, franjas). Recuerda que solo cuenta a quien aceptó cookies.
7. **Informes → Usuario → Detalles demográficos** y **Tecnología.** De qué ciudades llegan y con qué dispositivo. Casi todo será celular: si una página se ve mal en celular, se pierde gente.

## El embudo de compra

Muestra en qué paso se cae la gente. Se arma una vez y queda guardado.

1. Explorar → "Exploración de embudo".
2. En "Pasos", editar y crear cinco:
   - Visita: evento `session_start`.
   - Fue a boletas: evento `view_item_list`.
   - Pulsó Comprar: evento `begin_checkout`.
   - Confirmó pedido: evento `add_payment_info`.
   - Pagó: evento `purchase`.
3. Dejarlo como "embudo abierto" (botón en la configuración), porque mucha gente entra directo a la tienda sin pasar por los primeros pasos.
4. En "Desglose", poner "Campaña de la sesión" para ver el embudo de cada campaña.

Cómo leerlo:
- **Mucha caída entre "Visita" y "Fue a boletas":** la página no está llevando a la compra (contenido, botones).
- **Entre "Pulsó Comprar" y "Confirmó pedido":** la tienda pide algo que frena (datos, teléfono, precio con comisión).
- **Entre "Confirmó pedido" y "Pagó":** problema en la pasarela o gente que se arrepiente. Es el público de la campaña a expirados.

## Errores de lectura comunes

- Sumar usuarios de varios días: un mismo navegador cuenta en cada día. Para el total del periodo, se cambia el rango de fechas, no se suma.
- Comparar ingresos de GA4 con Pretix: nunca van a cuadrar (cookies no aceptadas y comisiones). Se compara la **proporción** entre campañas, no el monto.
- Leer los datos de hoy: GA4 tarda hasta 24 a 48 horas en procesar todo. Para decisiones, mirar hasta ayer.
- Confiar en una campaña con muy pocas visitas: con menos de unas 50 sesiones, cualquier diferencia puede ser casualidad.

---

# Entender Meta

Igual que la sección de GA4: qué mirar en Meta, qué significan sus números y por qué nunca van a coincidir con GA4.

## Dos lugares distintos

- **Administrador de anuncios:** lo que pasó **con los anuncios** (cuánta gente los vio, cuántos tocaron, cuánto costó). Es donde trabaja quien arma las campañas.
- **Administrador de eventos:** lo que le llega a Meta **desde el sitio y desde Pretix** (visitas, compras). Ahí se revisa que la medición funcione.

## Las palabras que más vas a ver

- **Alcance:** personas distintas que vieron el anuncio al menos una vez.
- **Impresiones:** veces que se mostró el anuncio. Una persona puede sumar varias.
- **Frecuencia:** impresiones dividido alcance. Por encima de 3 o 4 en una semana, la gente se cansa del anuncio.
- **Clics (todos):** cualquier toque en el anuncio: abrir el perfil, ver más texto, dar like, ampliar la foto. **No son visitas al sitio.**
- **Clics en el enlace:** toques en el botón o enlace que lleva al sitio. Se cuentan en el momento del toque, aunque la página nunca termine de cargar.
- **Visitas a la página de destino:** personas que tocaron el enlace **y** la página alcanzó a cargar y avisarle al píxel. Es el número de Meta más parecido a una visita. Como el píxel solo carga cuando la persona acepta las cookies, también se queda corto.
- **CTR:** porcentaje de quienes vieron el anuncio y tocaron el enlace. En Instagram, por encima de 1 % es razonable.
- **CPC:** cuánto costó cada clic en el enlace.
- **Resultados:** depende del objetivo con que se creó la campaña (clics, visitas, compras, mensajes). Siempre hay que mirar qué está contando antes de citar el número.
- **Configuración de atribución:** Meta se atribuye una compra si la persona tocó el anuncio en los 7 días anteriores o lo vio en el día anterior, aunque haya llegado al sitio por otro camino. Por eso Meta puede reclamar compras que GA4 o Pretix ponen en otra campaña.

## Qué le llega a Meta desde Testigos

- Desde el navegador (píxel, solo con cookies aceptadas): `PageView` (cada página), `ViewContent` (fue a boletas), `Lead` (se inscribió como interesado), `InitiateCheckout` (pulsó "Comprar").
- Desde Pretix (plugin, por Conversions API): `AddPaymentInfo` (pedido confirmado) y `Purchase` (pedido pagado), con el correo, el teléfono y el nombre del comprador convertidos en códigos que no revelan el dato. Con esos códigos Meta reconoce al comprador aunque no haya aceptado cookies, si tiene cuenta en Facebook o Instagram. Por eso **Meta puede ver más compras que GA4**.

## Por qué Meta y GA4 nunca coinciden

De mayor a menor, cada paso pierde gente:

1. **Clics en el enlace** (Meta): toques, no visitas.
2. **Visitas a la página de destino** (Meta): la página cargó. Se pierden quienes cerraron antes, sobre todo en el navegador interno de Instagram, que es lento.
3. **Sesiones en GA4**: solo las de quien aceptó las cookies. Quien no acepta no aparece en los informes.
4. **De esas, las que GA4 pone en Meta**: solo las que llegan con UTM bien puestas. Sin UTM, una visita desde un anuncio puede quedar como `l.instagram.com`, Organic Social o directa.

Ninguno de los números está "inflado": cada plataforma cuenta una cosa distinta. Para el informe se usa cada uno para lo suyo: Meta para el alcance y el costo, GA4 para comparar campañas en el sitio, Pretix y el backend para los totales de ventas e interesados.

## Qué mirar cada semana

1. **Administrador de anuncios, pestaña Anuncios**, con el preset "Informe Testigos" del reporte 9: importe gastado, alcance, frecuencia, clics en el enlace, visitas a la página de destino, CTR y CPC por anuncio. Responde "¿qué pieza funciona mejor por cada peso?".
2. **Desglose → Por entrega → Plataforma** (Facebook o Instagram) y **Ubicación** (feed, historias, reels): dónde rinde más el presupuesto.
3. **Administrador de eventos → el píxel → Información general**: que lleguen `PageView`, `ViewContent`, `Lead`, `InitiateCheckout`, `AddPaymentInfo` y `Purchase`. Si un evento deja de llegar varios días, algo se rompió.
4. **Administrador de eventos → Purchase → "Calidad de la coincidencia de eventos"**: qué tan bien reconoce Meta a los compradores que manda Pretix. De 6 en adelante está bien.

## Errores de lectura comunes

- Decir "mandamos 2.000 personas al sitio" con clics (todos) o clics en el enlace. Lo correcto es "2.000 clics en el enlace" y, al lado, las visitas a la página de destino.
- Comparar el alcance de Meta con los usuarios de GA4: alcance es gente que **vio** el anuncio, no que entró.
- Sumar las compras de Meta y de GA4: son las mismas compras vistas desde dos lados. El total es el de Pretix.
