# Reportes para el informe de tráfico y campañas

Lista de lo que hay que exportar para que Claude escriba la guía del informe y el script que genera el PDF. Marca cada casilla cuando el archivo esté en la carpeta.

## Antes de empezar

- [ ] Elegir el rango de fechas y usar **el mismo en todos los reportes**: desde el día en que empezó la venta (o el primer anuncio) hasta ayer. Anotarlo aquí: `____ a ____`.
- [ ] Crear la carpeta `~/Downloads/reporte-testigos/` y guardar ahí cada archivo con un nombre que diga qué es (por ejemplo `ga4-campanas.csv`, `meta-anuncios-region.csv`).

**Qué se puede medir hoy y qué no.** Hoy ningún dato dice qué campaña generó cada compra; eso lo agrega el plugin de Pretix cuando se publique, y solo desde ese día en adelante. Con estos reportes el informe muestra tráfico, interacción y clics en "comprar" por campaña, y al lado las ventas totales por día según Pretix. Cuando el plugin esté publicado, el mismo informe suma las compras por campaña.

## Google Analytics 4

Para exportar cualquier informe: icono de compartir (arriba a la derecha) → "Descargar archivo" → CSV.

- [ ] **1. Canales.** Informes → Adquisición → Adquisición de tráfico. Dimensión "Grupo de canales principal de la sesión". Ya existe uno, pero hay que repetirlo con el rango completo.
- [ ] **2. Fuente / medio.** El mismo informe, cambiando la dimensión (flecha junto al nombre de la primera columna) a "Fuente/medio de la sesión".
- [ ] **3. Campañas.** El mismo informe con la dimensión "Campaña de la sesión".
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

## Backend (formulario de interesados)

- [ ] **14. Contactos de la campaña Testigos.** Exportar desde el admin la lista de contactos de la campaña. Solo se necesitan la fecha de registro y el origen. **Borrar nombre, correo y teléfono antes de pasarlo.**

## Datos que solo tú tienes

Escribirlos aquí mismo o en un mensaje:

- [ ] **Todas las URL con UTM** que se han usado, no solo las dos del afiche y el reel: QR de afiches impresos, enlace de la bio de Instagram, correos, mensajes de WhatsApp.
- [ ] **Fechas clave**: inicio de la preventa, inicio y fin de cada anuncio, publicaciones grandes en redes, cambios de precio (el 13 de octubre empieza la etapa 2).
- [ ] **Para quién es el informe**: para uso interno, para tu hermana o para los organizadores del evento. Cambia el tono y el nivel de detalle del PDF.

## Cuando esté todo

Pasarle a Claude la carpeta `~/Downloads/reporte-testigos/` y las respuestas de arriba. Claude revisa qué trae cada archivo y recién entonces escribe la guía del informe y el script del PDF, sin suponer columnas que no existan.
