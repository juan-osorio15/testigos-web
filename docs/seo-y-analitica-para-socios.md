# SEO y analítica de testigosdelamemoria.com

Qué se hizo, por qué funcionó y cómo leer los números. Para los socios del encuentro. Corte: 21 de septiembre de 2026.

---

## 1. El resultado

- **"testigos de la memoria"**: el sitio es el primer resultado orgánico de Google (desde el 20 de septiembre). Antes ni aparecía: ganaban el Instagram del evento, un libro español del mismo nombre y un programa de radio.
- **17 páginas indexables** en lugar de 1: portada, programación, charlas abiertas, cómo llegar y una ficha por cada uno de los 12 panelistas.
- **Google reconoce el sitio como un evento**: nombre, fechas, sedes con coordenadas, precios y sesiones, todo validado en Search Console sin errores (solo avisos opcionales, ya cubiertos).
- **Medición funcionando desde el 18 de septiembre**: Google Analytics 4 y el píxel de Meta, con aviso de cookies conforme a la ley colombiana. Ya se acumula audiencia para la campaña de Instagram.

## 2. Qué había antes y por qué no funcionaba

La primera versión del sitio (agosto) tenía "SEO" en el sentido en que casi todo el mundo lo entiende: un título, una descripción, etiquetas correctas. La auditoría externa del 15 de septiembre lo calificó con **57/100**, y fue justa: la parte técnica estaba bien (82/100), pero eso no sirve de nada cuando:

1. **Todo el contenido vivía en una sola URL.** Google no tenía nada que indexar para "Daniel Samper Pizano Villa de Leyva", "charlas abiertas Villa de Leyva noviembre" o "cómo llegar a Villa de Leyva desde Bogotá". Una página no puede posicionar por veinte búsquedas distintas.
2. **Google no sabía que era un evento.** Sin datos estructurados, el buscador veía una página con texto; no un evento con fecha, lugar y boletas, que es lo que muestra en su módulo de eventos y lo que necesita para contestar "qué hay en Villa de Leyva en noviembre".
3. **Un título de 73 caracteres** que Google recortaba en los resultados.
4. **Cero medición.** No se sabía cuánta gente entraba ni de dónde.
5. **Cero presencia fuera del dominio** (18/100 en autoridad): nadie enlazaba al sitio.

El punto 5 sigue siendo el trabajo pendiente del equipo (sección 6). Los otros cuatro son los que se resolvieron.

## 3. Lo que se hizo distinto

### 3.1 Contenido que responde a lo que la gente busca

El cambio de fondo fue pasar de una página a un sitio. Cada cosa que alguien puede buscar tiene ahora su propia URL, con texto real y no relleno:

| Página | Para qué búsqueda | Qué tiene |
|---|---|---|
| `/panelistas/<nombre>/` (12 fichas) | El nombre del periodista | Biografía verificada con fuentes, foto, redes y enlaces oficiales, y las sesiones en las que participa. Cada panelista puede enlazar a **su** página desde sus redes, que es lo que construye autoridad. |
| `/programacion/` | "programación", "agenda", nombres de los conversatorios | Las 12 sesiones en texto, con ancla por día y por sesión, hora, sede y panelistas. |
| `/charlas-abiertas/` | "entrada libre", "gratis" (la búsqueda de mayor volumen según la auditoría) | Las charlas del 5 y 6 de noviembre en la Casa Museo Antonio Nariño, con su propio evento para Google. |
| `/como-llegar/` | Turismo: "cómo llegar a Villa de Leyva" | Rutas desde Bogotá y Tunja, las dos sedes con mapa y dirección. |

Y lo que **no** se hizo, aunque la auditoría lo pedía, porque habría perjudicado: cuatro páginas por día (contenido delgado que compite con la programación) y una URL aparte para preguntas frecuentes (Google retiró ese resultado enriquecido; sacar el bloque de la portada le quitaba texto útil a la página que más posiciona). Una auditoría se lee con criterio, no se ejecuta entera: de 37 tareas, 3 se descartaron con argumento y 1 resultó ser un falso positivo (la "trampa" del dominio de compra que el auditor vio no existía).

### 3.2 Datos estructurados: el sitio le habla a Google en su idioma

Es la parte que la mayoría de implementaciones "básicas" omite o hace a medias, y la que explica que Google ahora trate al sitio como **la fuente oficial del evento**. Todas las páginas llevan un grafo de datos en formato schema.org (el estándar que Google, Bing y los asistentes de IA leen):

- **Event** principal: nombre, del 5 al 8 de noviembre de 2026 con horas, sede (Hospedería Duruelo con coordenadas), organizador, descripción, imagen, los 12 panelistas como `performer`.
- **Una oferta por boleta**, con precio en COP y ventana de venta: el pase completo hasta el 4 de octubre; las cuatro boletas de medio día desde el 5. La disponibilidad cambia sola en la fecha, y hay un interruptor de "agotado" por boleta.
- **Cada sesión como subevento** (12), con hora de inicio y fin, sede, panelistas, precio y descripción. Solo sesiones confirmadas: nunca un horario o un nombre inventado.
- **Las charlas abiertas como evento propio**, gratuito, en la Casa Museo, con su URL. Google exige una URL por evento para mostrarlo en su módulo; por eso las charlas pueden aparecer por sí solas.
- **Una entidad Person por panelista** (ficha de perfil con foto, credencial y enlaces a sus redes y Wikipedia), conectada al evento.
- **Organización** (Eventalist) y **sitio web** como entidades, **migas de pan** en todas las páginas interiores.

Todo se genera desde los mismos datos que pintan la página: si cambia la agenda, cambia el marcado. No hay dos verdades que mantener.

### 3.3 Lo técnico que sí mueve la aguja

- **Título y descripción** en los límites de Google (60 y 155 caracteres): "Testigos de la Memoria · Villa de Leyva, 5 al 8 de noviembre".
- **Sitemap automático**: se genera en cada publicación a partir de las páginas reales, nunca de una lista a mano. Términos y política de datos quedan fuera y con `noindex`, para que una página legal no aparezca como resultado de marca.
- **Aviso a Bing en cada publicación** (protocolo IndexNow): Bing es el índice detrás de Copilot y de parte de ChatGPT, así que cada cambio les llega en minutos, no en semanas.
- **Rastreadores de IA permitidos por nombre** en `robots.txt` (OpenAI, Perplexity, Claude, Google-Extended, Bing). Quien los bloquea no aparece en las respuestas de esos asistentes.
- **Los hechos del evento en texto plano** en el pie de todas las páginas: nombre, lugar, fechas, sedes con dirección y estado de cada boleta con su precio. Es lo que un asistente de IA lee para contestar sin ejecutar nada.
- **Velocidad**: la imagen principal precargada con prioridad alta; las etiquetas de medición cargan después del contenido y no antes.
- **Favicon en los formatos que Google exige** (múltiplos de 48 px) e **imagen para compartir** en WhatsApp, Meta y X a 1200×630, con versión en el nombre para renovar la caché cuando cambia.
- **Rendimiento en móvil**: el sitio no usa ningún framework pesado; es HTML generado en el build, sin JavaScript salvo lo imprescindible.

### 3.4 Medición con base legal

- **Google Analytics 4**: visitas, origen del tráfico (Google, Instagram, WhatsApp, directo), páginas vistas y dos eventos propios: `consent_granted` (quién acepta cookies) y **`begin_checkout`** (quién pulsa comprar en la tienda). Este último es la intención de compra: el dato para optimizar la campaña.
- **Píxel de Meta**: `PageView` e `InitiateCheckout`, para construir la audiencia de retargeting de la campaña de Instagram. Se usa el dataset que ya existía en el portafolio de Meta que corre los anuncios.
- **Aviso de cookies como modal**, con un solo botón "Aceptar y continuar" y la opción de seguir sin aceptar. Dictamen del abogado interno (15 de septiembre): en Colombia las cookies que reconocen al navegador son datos personales; se exige autorización previa y expresa. GA4 carga sin cookies hasta que aceptan; el píxel de Meta solo después. La política de tratamiento de datos tiene una sección de cookies y un enlace permanente para retirar la aceptación.
- **Lo que se decidió no hacer**: conectar las compras de Pretix con GA4 y Meta por servidor (se investigó y diseñó, y se retiró por desproporcionado para un evento único a siete semanas). Las ventas se leen en Pretix; la campaña se optimiza por tráfico e intención de compra.

## 4. Por qué esto dio resultado y lo anterior no

Google no posiciona "optimizaciones"; posiciona **entidades**. Antes del 14 de septiembre el sitio era una página con un título largo; para Google, indistinguible de cualquier otra mención del nombre en la web. Lo que cambió:

1. Le dijimos exactamente **qué es** (un evento), **cuándo**, **dónde** y **cuánto cuesta**, en el formato que Google procesa por máquina, y lo validamos.
2. Le dimos **17 páginas** con contenido distinto y verificable, cada una respondiendo a una búsqueda concreta, en vez de una página intentando responder a todas.
3. Mantuvimos **una sola fuente de verdad**: agenda, panelistas y boletas viven en datos, y de ahí salen la página, el marcado, el sitemap y las imágenes para compartir. Nada se desincroniza.
4. **Se avisa a los buscadores** en cada publicación en vez de esperar a que pasen.
5. **Hubo criterio sobre la auditoría**: se hizo lo que sirve y se descartó lo que estorba.

Nada de esto es magia ni es caro; es hacer completo lo que la mayoría hace a medias. Y hay un matiz honesto: "testigos de la memoria" es una búsqueda de marca. El siguiente escalón, aparecer por "eventos Villa de Leyva noviembre" o "qué hacer en Villa de Leyva", depende ya de la sección 6.

## 5. Cómo leer los números

| Qué quiero saber | Dónde | Cómo |
|---|---|---|
| Cuánta gente entra y de dónde | **Google Analytics 4** (analytics.google.com, cuenta de Eventalist) | Informes → Adquisición → Adquisición de tráfico. Los informes tardan 24 a 48 h; "Tiempo real" es inmediato. |
| Qué páginas ven | GA4 | Informes → Interacción → Páginas y pantallas. |
| Cuántos intentan comprar | GA4 | Informes → Interacción → Eventos → `begin_checkout`. |
| Cuántos aceptan cookies | GA4 | Mismo informe → `consent_granted`. Solo quienes aceptan aparecen en el resto de informes. |
| Qué buscan en Google para llegar | **Search Console** (misma cuenta) | Rendimiento → Consultas. También: Indexación → Páginas, y Mejoras → Eventos. |
| Audiencia y costo por clic de la campaña | **Meta Events Manager y Administrador de anuncios** (portafolio "Que Hacer en Villa de Leyva") | Dataset "Testigos de la Memoria": `PageView` e `InitiateCheckout`. |
| Ventas reales | **Pretix** (pretix.eventalist.co) | Panel del evento → Pedidos. |

Dos advertencias para no leer mal: GA4 y Meta solo cuentan a quienes aceptan el aviso (por eso los números serán menores que las visitas reales), y las ventas no están conectadas a ninguna de las dos plataformas: se cruzan a mano con Pretix.

## 6. Lo que falta y de quién depende

Lo que el sitio podía hacer por sí solo está hecho. Lo que queda es **autoridad fuera del dominio**, que es exactamente donde la auditoría dio 18/100 y donde ningún desarrollo sustituye al equipo:

- **Que los 12 panelistas enlacen a su ficha** desde sus redes y columnas (Jorge). Es el activo de autoridad más valioso y ya está listo para usar: `testigosdelamemoria.com/panelistas/<nombre>/`.
- **Nota de prensa a medios** con enlace al sitio (Carolina).
- **Calendarios locales**: Alcaldía de Villa de Leyva, fondocultura.org, villadeleyva.com.co, terrojo.com, relatovilla.com. Son lo que un asistente de IA lee para "qué hay en Villa de Leyva en noviembre" (carta a la Secretaría de Turismo en borrador).
- **Enlace desde las dos sedes** y desde eventalist.co; **evento en Facebook**.
- **Bing Webmaster Tools**: dar de alta el sitio importándolo desde Search Console (5 minutos, Juan). Habilita el informe de citas en Copilot.
- **Página "dónde dormir"**: solo con la lista de hoteles de Carolina, antes del 10 de octubre.
- **Contenido por tema de conversatorio** antes del **15 de octubre**: lo que se publique después no alcanza a indexarse y posicionar antes del evento.
- **Hitos del sitio ya programados**: 5 de octubre (las boletas de medio día entran a la venta y el marcado cambia solo) y marcar "agotado" por boleta cuando Pretix lo reporte.

## 7. Referencias

- Auditoría externa: `Auditoria-SEO-testigosdelamemoria-sep2026.pdf` (15 de septiembre, 57/100) y plan de 37 tareas con su estado: `docs/plan-seo-estado.md` (15 hechas, 3 descartadas con argumento, 3 en curso, 16 pendientes del equipo).
- Especificación, investigación y decisiones: `specs/002-seo-medicion-visibilidad/`.
- Dictamen legal sobre medición: `docs/revision-legal-2026-09-15-medicion.md`.
- Identificadores de cuentas: `docs/credenciales.md` (fuera del repositorio público).
