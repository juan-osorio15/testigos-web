# De dónde vinieron las primeras ventas

Investigación del 27 de octubre de 2026, a pedido del jefe: visitas diarias y su origen del 16 de septiembre al 25 de octubre, cruzadas con las ventas, para saber de dónde salieron las primeras compras. Cubre el tiempo en que los pedidos de Pretix todavía no guardaban la campaña (UTM).

## Preguntas que responde

1. ¿Por qué canal llegaba la gente al sitio en los días en que entraron las primeras ventas?
2. ¿Las primeras ventas llegaron antes o después de los anuncios de Meta?
3. ¿Qué pasó el 12 de octubre, el día con más ventas?
4. ¿Cambió la relación entre visitas y ventas cuando creció la pauta?

## Lo que no responde

- **Qué canal trajo cada pedido.** Las conclusiones salen de la coincidencia en el tiempo entre visitas y ventas, no de seguir a cada comprador. Es una lectura de tendencia, no una atribución pedido por pedido.
- **Las visitas de quien no aceptó cookies.** GA4 solo muestra en sus informes a quien aceptó. Las cifras son una muestra grande, no el total.
- **La primera venta (16 de septiembre).** GA4 entró en el sitio el 17 de septiembre; de ese día no hay visitas registradas.

## Fuentes y por qué no otras

- **Hosting:** descartado. El sitio está en GitHub Pages, que no guarda registros de visitas del sitio (sus estadísticas de tráfico son del repositorio, no de la página). El DNS de GoDaddy solo resuelve el dominio y no hay Cloudflare delante. Ese dato nunca existió.
- **respond.io:** descartado para el origen. El export de contactos no trae si el contacto llegó por un anuncio ni de qué campaña; solo nombre, canal, correo, teléfono, etiquetas propias y fecha de alta.
- **GA4 (usada):** sesiones por día y por grupo de canales, y por fuente, medio y campaña, del 16 de septiembre al 25 de octubre. Consulta directa a la Data API, propiedad `properties/554842243`, con la cuenta de solo lectura (acceso en `docs/medicion/embudo/estado.md`). Total: 3.582 sesiones; el informe de Adquisición de tráfico de la interfaz da 3.553 para el mismo rango.
- **Pretix (usada):** pedidos pagados por día de creación del pedido, leídos de la API con `scripts/campanas/fuentes/pretix.py`. Solo conteos; ningún dato de personas sale del computador. Total: 61 pedidos pagados en el rango.
- **Search Console (control):** 202 clics desde Google en el rango, contra 297 sesiones de Organic Search en GA4. GA4 ve más que Search Console (suma Bing y visitas repetidas), así que el aviso de cookies no le quita una parte que cambie las conclusiones.

## Método

1. Se separó el rango en cuatro tramos según lo que cambió en la venta: antes de los anuncios (16 de septiembre al 1 de octubre), primeros anuncios (2 al 11 de octubre), cierre de la etapa 1 (12 de octubre) y etapa 2 con más pauta (13 al 25 de octubre).
2. Para cada tramo se sumaron las ventas pagadas y las sesiones por canal, y se calculó cuántas sesiones hubo por cada venta.
3. Se revisaron los días con picos de ventas contra los picos de cada canal.
4. Dentro de cada tramo se miraron las campañas (`utm_campaign`) con más sesiones.

Cómo leer los canales de GA4:

- **Direct:** visitas sin origen. Ahí cae casi todo lo que se abre desde WhatsApp, correos personales y quien escribe la dirección. Es la huella del voz a voz y de los contactos propios.
- **Paid Social:** anuncios de Meta (Facebook e Instagram).
- **Organic Social:** publicaciones y biografías de Facebook e Instagram, sin pauta.
- **Organic Search:** Google y otros buscadores, sin pauta.

## Resultados por tramo

### Del 16 de septiembre al 1 de octubre: antes de los anuncios

- 17 ventas y 540 sesiones: 32 sesiones por venta.
- Direct 381, Organic Search 86, Organic Social 45, Paid Social 7 (este último solo desde el 29 de septiembre).
- El 27 y el 28 de septiembre Direct subió a 39 y 96 sesiones, y entraron 6 ventas en esos dos días. GA4 no dice qué se compartió; falta confirmar qué se mandó esos días.

### Del 2 al 11 de octubre: primeros anuncios

- 10 ventas y 629 sesiones: 63 sesiones por venta.
- Direct 242, Paid Social 206, Organic Search 97, Organic Social 63.
- La campaña de Meta "preventa" empieza el 2 de octubre. Ese día hubo 4 ventas, pero Direct también subió (51 sesiones), así que no se puede separar el efecto.

### 12 de octubre: cierre de la etapa 1

- 11 ventas y 92 sesiones: 8 sesiones por venta.
- Direct 31, sin origen 19, Paid Social 15 (campaña "preventa_cierre"), Organic Search 13, Organic Social 11.
- El tráfico no se disparó. Compraron personas que ya conocían el evento y decidieron por el fin del precio de la etapa.

### Del 13 al 25 de octubre: etapa 2 con más pauta

- 23 ventas y 2.321 sesiones: 101 sesiones por venta.
- Paid Social 1.589 (campañas "trafico_2", "trafico" y "ventas"), Organic Social 249, Direct 220, Organic Search 103.
- Paid Social pasó de unas 15 a casi 300 sesiones al día; las ventas siguieron entre 1 y 3 por día, igual que antes.

## Conclusiones

1. **Las primeras ventas no vinieron de los anuncios.** Antes del 2 de octubre se vendieron 17 pedidos casi sin pauta, con el tráfico concentrado en Direct: voz a voz, WhatsApp y contactos propios, más Google y redes orgánicas en menor medida.
2. **El público cercano convierte mucho mejor que el pagado.** Antes de la pauta hacían falta 32 sesiones por venta; con la pauta fuerte de la etapa 2, 101.
3. **La fecha límite movió más que el tráfico.** El 12 de octubre se vendió lo de casi dos semanas con un tráfico normal, sobre todo de gente que ya había visitado o conocía el evento.
4. **Las campañas de tráfico trajeron visitas, no ventas al mismo ritmo.** Multiplicaron las sesiones del sitio sin cambiar las ventas diarias en ese tramo. Lo que sí pudieron hacer es llenar de gente nueva los públicos de retargeting y las listas de WhatsApp; eso no se ve en esta comparación.

## Preguntas abiertas

- ¿Qué se compartió el 27 y el 28 de septiembre? Fue el primer empujón fuerte de ventas y salió por Direct.
- La venta del 16 de septiembre no tiene registro de origen.
