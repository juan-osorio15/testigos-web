# Plan de acción SEO · estado de las 37 tareas

Espejo de la columna Estado del Excel de Jorge (`Plan-accion-SEO-testigosdelamemoria.xlsx`, hoja "Plan de accion"). Lo mantiene el desarrollador; cuando haya que enviárselo a Jorge se vuelca a una copia del Excel (última copia: `Plan-accion-SEO-testigosdelamemoria-estado-2026-09-18.xlsx`, con una columna M de notas). Estados posibles, como en el Excel: Pendiente · En curso · Hecho · Descartado. Última actualización: 2026-09-18, día en que se publicó en `main` todo lo del sitio (medición, marcado, fichas, programación, charlas abiertas, cómo llegar).

| ID | Tarea | Responsable (Excel) | Estado | Nota |
|---|---|---|---|---|
| T01 | Instalar GA4 en el sitio | Desarrollador | Hecho | Publicado el 18 de septiembre con aviso de cookies y Consent Mode (dictamen legal). Se mide visita y clic a boletas (begin_checkout). Falta ver el informe en tiempo real. |
| T02 | Instalar píxel de Meta | Desarrollador | Hecho | Publicado el 18 de septiembre. Se usa el dataset ya existente en el portafolio "Que Hacer en Villa de Leyva". Carga solo tras Aceptar en el aviso de cookies. Falta ver PageView en Events Manager. |
| T03 | Verificar Google Search Console | Desarrollador | Hecho | Propiedad de dominio por DNS, sitemap enviado; indexado desde el 14 de septiembre. |
| T04 | Verificar Bing Webmaster Tools | Desarrollador | Pendiente | Lo hace Juan importando la propiedad desde Search Console. |
| T05 | Acortar el title a 60 caracteres | Desarrollador | Hecho | Título publicado: "Testigos de la Memoria · Villa de Leyva, 5 al 8 de noviembre" (60 caracteres). |
| T06 | Acortar la meta description a 155 caracteres | Desarrollador | Hecho | Descripción publicada tal como la propuso la auditoría (152 caracteres). |
| T07 | Unificar el dominio de compra de boletas | Desarrollador | Descartado | Falso positivo: el sitio no contiene pretix.eu; todo apunta a pretix.eventalist.co. |
| T08 | Bloquear la indexación de las páginas de Pretix | Desarrollador | Pendiente | Opción de la tienda en Pretix; la activa Juan. Opcional. |
| T09 | Poner noindex en términos y tratamiento de datos | Desarrollador | Hecho | Términos y tratamiento de datos con noindex, follow y fuera del sitemap. |
| T10 | Precargar la imagen LCP | Desarrollador | Hecho | Imagen del hero precargada con srcset responsive y fetchpriority=high. Falta medir el LCP en PageSpeed Insights tras el deploy. |
| T11 | Verificar que la imagen OG carga | Carolina | En curso | WhatsApp validado; faltan Facebook (Sharing Debugger) y LinkedIn (Post Inspector). |
| T12 | Separar las dos modalidades de boleta en offers | Desarrollador | Hecho | Cinco ofertas en el schema (pase completo y cuatro franjas) con disponibilidad automática por etapa de venta: hasta el 4 de octubre solo el pase; desde el 5 las franjas. |
| T13 | Añadir coordenadas geo a las dos sedes | Desarrollador | Hecho | GeoCoordinates en Hospedería Duruelo y Casa Museo Antonio Nariño. |
| T14 | Marcar cada charla y conversatorio como subEvent | Desarrollador | Hecho | subEvent por sesión con hora de inicio y fin, sede y panelistas. Pendiente que Jorge valide la programación publicada. |
| T15 | Validar y monitorear en Search Console | Desarrollador | Pendiente | Rich Results Test tras el deploy y revisión del informe de Eventos en Search Console a los 7 días. |
| T16 | Publicar 11 fichas de ponentes | Redacción + Desarrollador | Hecho | Son 12 fichas, no 11: /panelistas/<nombre>/ con biografía, foto, Person schema y sesiones. Publicadas el 18 de septiembre. |
| T17 | Publicar /charlas-abiertas/ | Redacción | Hecho | /charlas-abiertas/ publicada el 18 de septiembre, con evento propio en el marcado. |
| T18 | Publicar /programacion/ | Redacción + Desarrollador | Hecho | /programacion/ publicada el 18 de septiembre, en HTML con ancla por sesión y enlace a cada ficha. |
| T19 | Publicar 4 páginas por día del evento | Redacción | Descartado | Contenido delgado que compite con /programacion/. Reconsiderar para 2027. |
| T20 | Publicar /como-llegar/ | Redacción | Hecho | /como-llegar/ publicada el 18 de septiembre. |
| T21 | Publicar /donde-dormir/ | Carolina + Redacción | Pendiente | Solo con la lista de hoteles de Carolina (mínimo seis) antes del 10 de octubre. |
| T22 | Dar URL propia a las preguntas frecuentes | Desarrollador | Descartado | Google retiró el resultado enriquecido de FAQ en 2026; la portada conserva el bloque. |
| T23 | Añadir migas de pan y BreadcrumbList | Desarrollador | Hecho | Migas visibles y BreadcrumbList en todas las páginas interiores. |
| T24 | Regenerar y reenviar el sitemap | Desarrollador | En curso | Sitemap automático con 17 URL y aviso a Bing por IndexNow en cada deploy. Falta reenviar en Search Console y solicitar indexación de las prioritarias (Juan). |
| T25 | Pedir publicación y enlace a los 11 ponentes | Jorge | Pendiente | Las fichas ya existen: https://testigosdelamemoria.com/panelistas/<nombre>/. Son 12 ponentes. |
| T26 | Enviar nota de prensa a medios nacionales | Carolina | Pendiente |  |
| T27 | Dar de alta el evento en calendarios locales | Carolina | Pendiente | Carta a la Secretaría de Turismo de la Alcaldía de Villa de Leyva en borrador (agenda del portal y publicaciones colaborativas en Instagram). |
| T28 | Conseguir enlace desde las dos sedes | Carolina | Pendiente | Las dos sedes ya tienen logo en el sitio; falta el enlace desde sus canales. |
| T29 | Crear el evento en Facebook | Carolina | Pendiente |  |
| T30 | Reforzar la ficha en eventalist.co | Equipo Eventalist | Pendiente |  |
| T31 | Lanzar campañas sobre la audiencia del píxel | Carolina + Jorge | Pendiente | El píxel y GA4 ya acumulan audiencia desde el 18 de septiembre. Sin Google Ads (decisión del 16 de septiembre): solo Meta. |
| T32 | Publicar contenido por tema de conversatorio | Redacción | Pendiente | Fecha límite de contenido: 15 de octubre. |
| T33 | Revisar datos y ajustar mensajes | Carolina | Pendiente |  |
| T34 | Actualizar disponibilidad de boletas | Desarrollador | En curso | Automática: el 5 de octubre el schema pasa del pase completo a las franjas. Interruptor de agotado por boleta cuando Pretix lo reporte. |
| T35 | Publicar grabaciones y transcripciones | Redacción + Desarrollador | Pendiente | Post-evento. |
| T36 | Montar la estructura para la edición 2027 | Desarrollador | Pendiente | Post-evento. |
| T37 | Evaluar versión en inglés con hreflang | Jorge | Pendiente | Post-evento. |

Resumen: Hecho 15 · Descartado 3 · En curso 3 · Pendiente 16.
