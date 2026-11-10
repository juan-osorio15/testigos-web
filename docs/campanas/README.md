# Campañas

Lo que se le escribió a la gente para vender Testigos de la Memoria (del 12 de octubre al 8 de noviembre de 2026): qué vendió, qué aprendimos y la herramienta que arma las listas y envía (`scripts/campanas/campana.py`). Es el punto de partida para el próximo evento.

Los calendarios, los textos de cada día y los planes de cada campaña de este evento están en el historial de git, hasta el commit `685932c` (`git show 685932c:docs/campanas/grupos-villa/whatsapp/README.md`, por ejemplo).

```
docs/campanas/
  README.md            este documento: la regla, los resultados, las lecciones y la herramienta
  ejemplos.md          las piezas que mejor funcionaron, con su texto
  ejemplos/            sus imágenes
  checklist-diario.md  cómo se arma el día sin que las campañas se pisen
  reglas.md            guías de cómo se escribe y cómo se manda
  configuracion.md     llaves y permisos, una sola vez
```

## La regla que ordena todo

**Una comunicación por canal a cada persona, y un par de días entre intentos.** En la recta final llegamos a una diaria porque empezamos tarde; en el próximo evento se empieza con más tiempo. Si a una persona le llegan varios WhatsApp de venta desde el mismo número, es fácil que bloquee o reporte; con unos cuantos bloqueos baja la calidad del número y Meta deja de entregar las plantillas de marketing. Lo mismo, en menor medida, con el correo y Promociones de Gmail.

La excepción son los avisos de servicio importantes cerca del evento (horario de puertas, un cambio de sede o de hora) a quien ya compró: no venden y la persona los necesita.

De ahí sale lo demás: **pocas campañas, y cada público tiene una sola campaña dueña en cada canal.** En este evento llegamos a nueve campañas a la vez, con reglas de prioridad para decidir cuál ganaba cuando dos caían el mismo día. El checklist tenía diez o doce tareas diarias, era fácil que una pisara a otra y después no se podía saber cuál había movido la venta.

## Lo que vendió

Dos fuentes, las dos de Pretix, que miden cosas distintas:

- **Ventas por campaña** (la página del plugin en Pretix): el último enlace con UTM por el que entró el navegador que pagó. Sirve para comparar piezas que se comparten con enlace (pauta, grupos, biografías).
- **Compró después de recibirlo**: cruce de quién recibió cada correo de `campana.py` con quién pagó después, por correo o teléfono. No prueba que el mensaje causara la compra, pero dice qué públicos respondían. No cubre lo que salió por respond.io ni lo publicado a mano, porque ahí no queda quién lo recibió.

### Por enlace (ventas por campaña)

De los 177 pedidos pagados, 47 traen campaña (12,4 millones). Los otros 130 no, por tres razones: 44 son de antes del 16 de octubre, cuando la tienda todavía no guardaba la campaña; 46 se crearon en Pretix sin pasar por el sitio (escarapelas y venta en puerta del 6 al 8 de noviembre), y 42 pasaron por el sitio sin UTM, 24 de ellos desde una búsqueda en Google. Quien recibe un mensaje y después busca el nombre del evento en Google, o lo abre en otro aparato, queda sin campaña. **Estas cifras son un piso: que una campaña tenga cero aquí no quiere decir que no vendió.**

- **Pauta de Meta** (Facebook e Instagram): 15 pagados, 4,8 millones. Solo el anuncio del pase completo de la recta final (`ventas_recta-final_c1_c2`, `c1_pase-completo_ad`): 7 pagados, 2,5 millones. Es la pieza que más vendió.
- **Grupos de Villa de Leyva** (`grupos-villa`, publicado a mano): 8 pagados, 1,8 millones. Vendieron tres piezas: la llegada de María Alejandra Villamizar (4 pedidos, los 4 pagados), el afiche de las caras de "últimos días" (3) y un afiche del sábado en la tarde (1). Las demás, una charla por pieza, no tienen ventas por enlace.
- **Biografía de Instagram** (`permanente`, `bio`): 5 pagados, 1,4 millones.
- **Enlaces que da el chatbot** (`permanente` desde WhatsApp y `pase-fin-semana-release`): 6 pagados, 1,2 millones. Aquí caen también las ventas de quien respondió una plantilla de otra campaña: Catalina le da su propio enlace.
- **Enlace `ultimos-dias` con el afiche de las caras**, por WhatsApp: 5 pagados, 0,7 millones. Se armó de afán el 3 de noviembre y fue de lo más efectivo.
- **Soporte técnico por WhatsApp** a una persona que se quedó trabada pagando: 1 pagado, 0,6 millones.
- **Correo de aviso a interesados**, el de diseño con precio y botón: 2 pagados, 0,5 millones.
- **Inactivos** (respond.io): 1 pagado, 0,4 millones, y fue RC9, la de últimos días con todos los nombres y el afiche de las caras. RC1 a RC8, una charla por plantilla, sin ventas por enlace.
- **Google Ads, Búsqueda**: 1 pagado, 0,2 millones, con un presupuesto de 230.000 COP.
- **Historias de Instagram** de la diseñadora: 1 pagado, 0,2 millones.

### Por persona (compró después de recibirlo)

- **Expirados** (quien dejó vencer un pedido), unas 14 personas: 6 compraron después del correo de cierre de etapa del 27 de octubre (2,4 millones), y entre los tres correos propios de expirados, 3 de 13. Es el público que más responde, con diferencia.
- **Interesados del sitio**, el aviso de que abrieron las boletas de medio día: 4 de 18 compraron después (0,7 millones).
- **Lista amplia** (interesados del sitio y contactos de Fernando, unas 309 personas), con los correos de cierre de etapa: 7 compraron después (1,2 millones), un 2 %.
- **Cartas de Fernando** de los días del evento, unas 300 personas: 1 compra después de cada una.
- **Familia** (el código para que la familia del comprador comprara a su mismo precio): 40 vales creados y **ninguno se usó**.

## Lo que aprendimos

1. **Lo que vendió fue lo de siempre: las caras, claras, y la urgencia de "últimos días".** El afiche de las caras vendió en grupos, en inactivos y por su propio enlace; la noticia de una invitada nueva, también. Las piezas de una sola charla casi no tienen ventas por enlace. Simple gana.
2. **La pauta de Meta es el canal medido que más vende**, y lo que más funcionó fue un anuncio simple del pase completo en la recta final.
3. **Quien ya intentó comprar es el mejor público.** Expirados respondió a casi todo. Vale la pena escribirles pronto, con lo que les faltó (el enlace, el método de pago, ayuda) y con una persona detrás. Una conversación de soporte vendió lo mismo que una campaña entera.
4. **Los correos que vendieron llevaban precio y botón**: el aviso a interesados y el cierre de etapa. Los conversacionales, sin precio ni botón, no tienen ventas medidas y aun así caían en Promociones. La causa más probable de Promociones es el dominio nuevo, no el texto.
5. **Nueve campañas a la vez se volvió inmanejable**, con tres herramientas de envío (campana.py, respond.io y a mano) y un checklist de diez tareas al día. Empezamos tarde y compensamos con más mensajes; lo de la regla de arriba.
6. **Las plantillas de Meta con la imagen de las caras vendieron, pero Meta las aprueba a veces sí y a veces no.** Se crean al menos un día antes, con una versión sin imagen de respaldo, y una aprobada no se edita.
7. **El retargeting de Google necesita semanas:** los públicos de GA4 no se llenan con días pasados. Se arma al abrir la venta, no al final.
8. **Medir desde el primer día y con UTM en todo enlace**, también en los que da el chatbot y en los de soporte. Los vales con código sí se pueden medir sin UTM: en Pretix, Vales, por etiqueta.
9. **Familia no funcionó.** Un precio especial para la familia de quien ya compró, cuatro días antes del evento, no movió a nadie.

## Para el próximo evento

Pocas campañas, cada una con su público y su canal, para que se puedan manejar y medir:

- **Pauta** (Meta, y Google si se monta temprano): el público nuevo. Las piezas generales, con las caras.
- **Calientes**: quien dejó vencer un pedido, se inscribió en el sitio o le escribió al chatbot y no compró. Un solo público y una sola secuencia por WhatsApp, con el correo como segundo canal. Expirados primero.
- **Comunidad local y aliados** (grupos del pueblo, listas de los organizadores): publicado a mano, una pieza por día como máximo.
- **Compradores**: solo avisos de servicio.

Y los momentos que movieron la venta: el lanzamiento, cada cambio de etapa (la fecha límite), la llegada de un invitado nuevo y los últimos días.

## La herramienta: `campana.py`

Desde el 19 de octubre de 2026 todas las campañas de correo y de WhatsApp por la API pasan por un solo comando. Lo que se manda por respond.io o a mano no pasa por aquí.

### Sus partes

Cada parte hace una sola cosa y no sabe de las demás:

- **Fuentes** (`scripts/campanas/fuentes/`): leen un sistema y devuelven sus datos normalizados (correo en minúscula, teléfono en +57…). Hoy: `pretix.py` (pedidos) y `backend.py` (contactos de una campaña del backend de Eventalist, con su autorización por canal).
- **Personas** (`personas.py`): une registros de una misma persona cuando comparten correo o teléfono.
- **Audiencias** (`audiencias/`): las reglas de quién entra en una campaña y por qué canal se le puede escribir. Usan las fuentes y entregan una lista. No envían nada. Hoy: `expirados.py`, `interesados.py`, `compradores.py` (quien tiene un pedido pagado, solo para marcarlo como Customer en respond.io; sin canales), `familia.py` (quien compró un pase en una etapa, con un voucher por persona) y `agenda.py` (los contactos personales de alguien del equipo, solo por correo, firmados y enviados desde su dirección; los CSV de Google Contacts van en `~/Documents/eventalist/datos/<evento>/<carpeta>/` y no entran al backend; la de Fernando estaba en `config/agenda-fernando.json`, hoy en git: `git show f1f047c:scripts/campanas/config/agenda-fernando.json`).
- **Lista** (`lista.py`): el formato único entre audiencias y canales. Columnas fijas `saludo`, `nombre`, `correo`, `whatsapp`, `tipo`; después las variables de las plantillas (como `codigo`) y el detalle para revisar a mano. Un correo o un WhatsApp vacío es un canal cerrado para esa persona.
- **Canales** (`canales/`): solo envían. `correo.py` (Resend) y `whatsapp.py` (Cloud API de Meta). Reciben la lista y la configuración del canal.
- **Reglas** (`reglas.py`): las mismas para toda campaña y canal. Horario de la Ley 2300 y no repetir un mismo mensaje. Sin límite de mensajes por persona ni por día (decisión del titular del 2026-10-19); una campaña puede ponerse límites en su configuración con `"reglas": {"maximo_por_persona": 2, "uno_por_dia": true}`.
- **Registro** (`registro.py`): un solo archivo con cada envío de todas las campañas, `~/Documents/eventalist/datos/registro-envios.csv`. Con él funcionan las reglas. Cuando el backend tenga el registro central de envíos, este archivo se importa allá.
- **Hechos del evento** (`scripts/lib/hechos.py`): el evento de Pretix, la campaña del backend, las URL y los precios no se escriben en las campañas. Salen de la fuente del sitio (`src/data/` y `src/config.ts`), que `npm run build` exporta en `dist/datos/evento.json`. Si la exportación falta o es más vieja que la fuente, el comando se detiene y pide `npm run build`.
- **Configuración** (`scripts/campanas/config/<campaña>.json`): una campaña es un archivo, no un script. Dice la audiencia y sus parámetros, y por cada canal la plantilla, el asunto, el remitente o las variables, y si está activo.

Las plantillas de correo y el logo están en `scripts/campanas/plantillas/`. Los precios van como variables (`{{precio_pase_completo}}`, `{{precio_fin_de_semana}}`, `{{precio_medio_dia}}`), que se llenan con la fuente; la redacción queda en la plantilla. Las de WhatsApp viven en Meta; el texto aprobado se guarda como referencia en `whatsapp/README.md` de cada campaña.

Nada de esto guarda datos personales en el repositorio (es público). Las listas, las vistas previas y el registro quedan en `~/Documents/eventalist/datos/`. El equipo que recibe cada envío real está en `scripts/campanas/incluir.local.csv` (columnas `nombre,correo,telefono`), que git ignora.

### Los comandos

Siempre en la carpeta `testigos-web`. Todos, listos para copiar, en `scripts/campanas/comandos.sh`:

```sh
python3 scripts/campanas/campana.py lista interesados
python3 scripts/campanas/campana.py correo interesados
python3 scripts/campanas/campana.py correo interesados --prueba j.a.oso15@gmail.com --enviar
python3 scripts/campanas/campana.py correo interesados --enviar
python3 scripts/campanas/campana.py whatsapp interesados --prueba 57XXXXXXXXXX --enviar
python3 scripts/campanas/campana.py respondio expirados
python3 scripts/campanas/campana.py registro
```

- `lista` arma la lista con los datos de ese momento, la guarda y muestra cuántos quedaron y cuántos salieron y por qué.
- `correo` y `whatsapp` vuelven a armar la lista (alguien pudo comprar entretanto), aplican las reglas y muestran lo que saldría: vistas previas en `~/Documents/eventalist/datos/<evento>/previas-<campaña>/` para el correo, el texto en la terminal para WhatsApp. **Sin `--enviar` no se envía nada.**
- `--prueba` manda un solo mensaje de muestra, con los datos de tu fila, a ese correo o número.
- `--enviar` envía de verdad. Fuera del horario de la Ley 2300 se niega, salvo con `--ignorar-horario` por decisión explícita del titular.
- `--excluir correo-o-telefono` deja a alguien por fuera de la lista (se puede repetir).
- `--lista ARCHIVO` usa una lista ya guardada en vez de armarla.
- `--dias N` deja solo a las personas de los últimos N días: el último intento de compra en expirados, la inscripción en interesados. El equipo siempre queda.
- `respondio` arma la lista y la guarda en `~/Downloads` con el formato de importación de respond.io (First Name, Last Name, Phone Number, Email Address, Tags, Lifecycle, Assignee, boleta_de_interes), solo con quien autorizó WhatsApp. El nombre completo va en First Name y Last Name queda vacío, como está configurado respond.io. Las etiquetas, el Lifecycle y la boleta de interés se ponen en `"respondio"` dentro de la configuración de la campaña (`{"tags": ["expirados"]}`); sin eso, la etiqueta es el nombre de la campaña. A cada etiqueta se le pega la fecha del día, sin separadores (`expirados-23102026`). `--salida RUTA` lo guarda en otra parte.
- `registro` cuenta los envíos por día, campaña, canal y tipo, sin datos de personas. Con el nombre de una campaña, solo esa.

Si un envío falla por la persona (un número sin WhatsApp), queda anotado como fallido y sigue con los demás. Si falla por la llave, la plantilla o el límite diario de Resend (100 correos en el plan gratis), se detiene: se corrige y se vuelve a correr el mismo comando, que sigue con los que faltan.

### Llaves

Las de Pretix, el backend, Resend y WhatsApp están en el llavero. Cómo se sacan y dónde se guardan: [`configuracion.md`](configuracion.md).

### Una campaña nueva

1. Si la gente sale de una fuente que ya existe con reglas que ya existen (por ejemplo, interesados de otro evento): copiar `config/interesados.json` con otro nombre y cambiar los parámetros y las plantillas. El evento y la campaña del backend salen de la fuente; solo se ponen en la configuración (`"evento"`, `"parametros": {"campana_backend": ...}`) si la campaña es de otro evento. No hay código que escribir.
2. Si las reglas son nuevas (por ejemplo, compradores de una franja para ofrecerles el pase): un módulo en `audiencias/` con una función `armar(evento, parametros, excluir)` que devuelve un `Resultado`, y registrarlo en `audiencias/__init__.py`.
3. Si los datos salen de un sistema nuevo: un módulo en `fuentes/` que devuelva registros con `correo` y `telefono` normalizados.
4. Su plan corto en este README: a quién, por qué canal, qué días y con qué UTM, y comprobar que ese público no tenga ya otra campaña en ese canal. La plantilla de correo en `scripts/campanas/plantillas/`, según `reglas.md`. La de WhatsApp, a aprobación de Meta.
5. La campaña de UTM en `docs/medicion/embudo/enlaces-y-nombres.md` el mismo día.
6. Sus días en `checklist-diario.md`.
7. Antes del envío real: `lista`, la vista previa y la prueba al titular.

### Contrato del backend

`GET https://eventalist-backend-production.up.railway.app/api/v1/marketing/campaigns/<slug>/contacts/`, en producción desde el 2026-10-19. Solo lectura.

- `Authorization: Bearer <token>` (el de lectura; el de Pretix no sirve).
- Filtros opcionales: `source` (fuente del **primer** contacto de la persona: `website`, `ticket_shop`, …) y `stage` (`interested`, `order_pending`, `order_canceled`, `purchased`).
- 200 resultados por página; se sigue `next` hasta que sea `null`.
- Cada resultado: `first_name`, `email`, `phone` (E.164 o `null`), `source`, `joined_at` (UTC), `stage`, `email_reachable`, `whatsapp_reachable`. Los dos últimos usan la misma regla que el CSV del admin filtrado por la campaña: autorización vigente para la campaña, contacto activo, dato presente y sin baja de ese canal.
- Errores: 400 filtro inválido, 401 sin token o con token equivocado, 404 campaña inexistente.

Los compradores de Pretix desde el 2026-10-09 también están en la campaña, con la autorización de WhatsApp que dieron en la tienda. Por eso la audiencia de expirados pregunta al backend a quién se le puede escribir por WhatsApp.
