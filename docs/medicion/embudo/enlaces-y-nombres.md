# Enlaces y nombres de campañas

Fecha: 2026-10-13. Para el equipo de mercadeo y para la IA que le ayuda a nombrar: quien publica, arma anuncios, manda mensajes o reparte material impreso. Es la fuente única de los valores de UTM y de los enlaces listos para copiar. `guia-manager-redes.md` dice cuándo usar cada enlace; este documento dice cómo se escribe.

## La filosofía de los nombres

Los nombres existen para **decidir rápido**: mirar la tabla de GA4 o del Administrador de anuncios y saber qué funcionó mejor y por qué. Por eso un nombre lleva **solo lo que distingue** a una pieza de las demás, y nada más.

**Lleva:**
- Qué es la pieza, en las palabras con que el equipo la reconoce: `reel-panelistas`, `carrusel-agenda`, `historia-sede`.
- **Las variables que se están comparando.** Si dos reels iguales se mostraron a audiencias distintas, la audiencia es la variable y va en el nombre: `reel-panelistas_frio` y `reel-panelistas_caliente`. Si cambia el gancho, va el gancho: `reel-panelistas_precio` y `reel-panelistas_cupos`. Quien crea la pieza es quien sabe qué cambió entre una versión y otra, así que es quien escribe la variable.

**No lleva** (es ruido: ya está en otra columna, o el equipo ya lo sabe):
- La plataforma o el canal (`instagram`, `ig`, `whatsapp`): ya está en la columna Fuente.
- El tipo de enlace (`pagado`, `organico`, `ad`, `post`): ya está en la columna Medio.
- La etapa, el mes o el año (`etapa2`, `octubre`, `2026`): el equipo sabe en qué momento está, y la fecha ya está en GA4.
- El nombre de la campaña repetido dentro del contenido.
- Palabras de relleno: `campana`, `utm`, `link`, `version`, `nuevo`, `final`.
- Números de Meta (`{{ad.id}}`, `{{campaign.id}}`): en la tabla salen como `52647134201092` y nadie sabe qué son.
- Datos de una persona (correo, teléfono, nombre de un cliente). Los nombres de panelistas y aliados sí, porque son figuras públicas del evento.

**La prueba del nombre:** se pone al lado de sus hermanos (las otras piezas de la misma campaña) y se pregunta "¿se ve de un vistazo en qué se diferencian?". Si sobra una palabra que todos comparten, se quita. Si dos nombres se ven iguales, falta la variable.

Ejemplo de una campaña con cuatro anuncios:

- Bien: `reel-panelistas_frio`, `reel-panelistas_caliente`, `carrusel-agenda_frio`, `carrusel-agenda_caliente`. Se lee la pieza y la audiencia, y se compara en dos ejes.
- Mal: `etapa2_ig_reel_panelistas_frio_v1`. Repite la etapa, la plataforma y una versión que nadie compara.
- Mal: `reel1`, `reel2`. No dice qué es ni en qué se diferencian.

## Cómo se escriben

- Todo en minúsculas, sin tildes, sin ñ, sin espacios.
- **`-` une las palabras de una misma idea** y **`_` separa la pieza de cada variable**: `reel-panelistas_frio`, `historia-maria-elvira-samper_cuenta-regresiva`.
- Cortos: dos a cuatro palabras en total suelen bastar.
- Una pieza sin variantes no lleva variable: `afiche-plaza-villa-de-leyva`.
- Siempre `https://` (en Colombia el sitio no responde por http).
- **Sin `#boletas` ni `#speakers`** (titular, 2026-10-26): la portada muestra primero a los panelistas y tiene varios botones de compra. Solo `#agenda` o `#hospedaje`, **al final** y después de las etiquetas, cuando el enlace es de la programación o de los hoteles.
- `utm_campaign` es obligatoria. Sin ella la fila sale `(not set)`, como pasó con la bio el 12 de octubre.

## Las cuatro etiquetas

En GA4 cada etiqueta es una columna. Fuente y medio son listas cerradas y técnicas, y casi nunca se piensan. Campaña y contenido son los nombres que el equipo inventa con la filosofía de arriba.

### utm_source: dónde se tocó (lista cerrada)

- `ig` y `fb`: anuncios de Meta. Los pone Meta solo con `{{site_source_name}}`. Ver "Anuncios de Meta".
- `instagram`: publicaciones, historias, bio y mensajes directos de Instagram.
- `facebook`: publicaciones, página y mensajes de Facebook.
- `whatsapp`: mensajes, estados, grupos y perfil de WhatsApp.
- `chatbot`: el chatbot, cuando un solo prompt atiende Instagram y WhatsApp.
- `email`: cualquier correo.
- `impreso`: QR de afiches, volantes, pendones y escenario.
- `google`: perfil de Google y anuncios de Google.
- Prensa y páginas de terceros: el nombre del medio o del sitio, con guiones (`el-espectador`).
- `prueba`: solo pruebas del equipo. Se filtra en los informes.

Canales futuros, con el mismo criterio de nombrar la plataforma: `tiktok`, `youtube`, `linkedin`, `x`. Para agregar un canal, ver "Canal nuevo".

### utm_medium: cómo llegó (lista cerrada)

- `paid_social`: anuncios pagados en redes.
- `paid_search`: anuncios pagados en Google.
- `social`: lo que publican las cuentas del evento (publicaciones, historias, bio, perfiles).
- `aliados`: lo que comparten panelistas, organizadores y patrocinadores desde sus cuentas o su WhatsApp. Un correo nunca es `aliados`, aunque lo firme Fernando u otro organizador.
- `mensaje`: mensajes del equipo, uno a uno, por lista de difusión o por plantilla.
- `chatbot`: enlaces que da el chatbot.
- `email`: todo correo, también los firmados por un organizador (titular, 2026-10-28: la guía manda sobre formatos pedidos desde afuera, siempre que se pueda medir).
- `qr`: material impreso.
- `organic`: solo el perfil de Google (así GA4 lo cuenta como búsqueda orgánica).
- `referral`: artículos de prensa y páginas de terceros.

### utm_campaign: la iniciativa

El nombre corto con que el equipo se refiere a la campaña, sin etapa ni fecha: `cierre-preventa`, `lanzamiento-franjas`, `panelistas`, `expirados`, `remarketing`. Si la campaña se crea en Meta, es el mismo nombre de la campaña en Meta.

- `permanente` para los enlaces que no cambian con las campañas: bios, perfiles, chatbot, firma de correo y QR genéricos.
- Si dos campañas de momentos distintos se llamarían igual, se agrega solo lo que las distingue (`cierre-preventa` y `cierre-venta`), no la etapa por costumbre.
- Una campaña nueva se anota en la lista de abajo el día en que se crea, para que todo el equipo use la misma grafía.

Campañas en uso (el equipo agrega aquí las suyas):

- `permanente`
- `expirados`: correos y WhatsApp a pedidos vencidos.
- `interesados`: correo y WhatsApp a quien pidió aviso de las boletas de medio día en el sitio (desde el 19 de octubre).
- `buscador`: anuncios de Búsqueda en Google (prueba del 16 de octubre al 7 de noviembre de 2026).
- `recuperacion`: broadcasts de respond.io a conversaciones de Catalina que se cerraron sin compra (desde el 26 de octubre de 2026), y los enlaces que da Catalina a quien responde.
- `pase-fin-semana-release`: lanzamiento del pase de fin de semana (desde el 23 de octubre de 2026; primer enlace, el mensaje del chatbot `combo-fin-de-semana`).
- `cierre-descuento`: correos, broadcasts de respond.io y publicaciones en grupos de los tres últimos días de la etapa 2 (27 al 29 de octubre de 2026). Plan en `docs/campanas/cierre-descuento/README.md`.
- `historias-diarias`: historias diarias de Instagram que hace Paula, la diseñadora, todas con el mismo enlace y `utm_content=paula-disenadora` (desde el 26 de octubre de 2026).
- `sexta-gratis`: compra 5 boletas del mismo tipo y la sexta es gratis, máximo una por orden (en estudio desde el 30 de octubre de 2026). Configuración y enlaces en `docs/pretix/descuento-sexta-gratis.md`.

### utm_content: la pieza y sus variables

`{pieza}` o `{pieza}_{variable}`, con la filosofía de arriba.

- **Pieza:** lo que es, como lo llama el equipo: `reel-panelistas`, `carrusel-agenda`, `historia-sede`, `afiche-plaza-villa-de-leyva`, `correo-pedido`, `plantilla-ultimo-dia`.
- **Variable:** lo que cambia entre versiones que se comparan:
  - audiencia: `frio`, `caliente`, `seguidores`, `compradores`;
  - gancho o mensaje: `precio`, `cupos`, `testimonio`;
  - formato, si se compara: `vertical`, `cuadrado`;
  - con dos variables, una tras otra: `reel-panelistas_frio_precio`.
- **Puntos fijos:** el punto, sin el canal, porque el canal ya está en la Fuente: `bio`, `perfil`, `firma`. Si un punto tiene varios enlaces, lo que lleva cada uno: `boletas`, `agenda`, `panelistas` (chatbot, página de varios enlaces).
- **Personas:** `persona-NOMBRE` o `repost-NOMBRE`, con el nombre como en `src/data/speakers.ts` (`repost-maria-elvira-samper`).

`utm_term` no se usa: la audiencia, cuando importa, ya va como variable en el contenido. La excepción es Google Ads, donde lo pone el sufijo de la campaña (abajo).

## Anuncios de Meta

El truco es nombrar **una sola vez, en Meta**, y que GA4 copie los nombres solos:

- Nombre de la **campaña** en Meta = `utm_campaign` (`cierre-preventa`).
- Nombre del **anuncio** = `utm_content`: la pieza y sus variables (`reel-panelistas_frio`). Si el mismo video va en dos conjuntos con audiencias distintas, cada anuncio lleva su audiencia en el nombre.
- El conjunto de anuncios se nombra como el equipo quiera; no viaja al sitio.

En "URL del sitio web": `https://testigosdelamemoria.com/`

En "Parámetros de URL" de cada anuncio, exacto:

```
utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}
```

- Los nombres quedan bien escritos **antes de publicar**. Meta puede seguir mandando el nombre viejo si se renombra después.
- Así, el Administrador de anuncios y GA4 muestran los mismos nombres, y se comparan sin traducir.
- Revisar **cada** anuncio activo. Un anuncio sin parámetros llega como `l.instagram.com / referral`, sin campaña (le pasó a `Z9UMQ` el 12 de octubre).

## Anuncios de Google

Cada URL final va **completa, con sus UTM**, y se pega tal cual en Google Ads. La plantilla de seguimiento queda vacía, y el sufijo de URL final de la campaña lleva solo `utm_term={keyword}` (desde el 2026-10-28), que Google cambia por la palabra clave del clic; así Pretix sabe qué palabra vendió sin repetir las UTM de la URL. El etiquetado automático (`gclid`) va activado y se suma solo; no reemplaza las UTM, porque el `gclid` solo lo lee Google y Pretix guarda la campaña por las UTM.

- Nombre de la **campaña** en Google Ads = `utm_campaign` (`buscador`).
- Nombre del **grupo de anuncios** = `utm_content` (`plan-villa-de-leyva`, `periodismo`, `panelistas`).
- **Sitelinks:** `utm_content=sitelink-` y el tema (`sitelink-bogotazo-frente-nacional`).
- Siempre `?` antes de la primera etiqueta. Sin él (`.com/utm_source=...`) la página no existe y Google rechaza el anuncio por "Destino que no funciona", como pasó el 16 de octubre.
- Las URL finales van **sin `#boletas`**.

Anuncio de cada grupo:

- `plan-villa-de-leyva`: `https://testigosdelamemoria.com/?utm_source=google&utm_medium=paid_search&utm_campaign=buscador&utm_content=plan-villa-de-leyva`
- `periodismo`: `https://testigosdelamemoria.com/?utm_source=google&utm_medium=paid_search&utm_campaign=buscador&utm_content=periodismo`
- `panelistas`: `https://testigosdelamemoria.com/panelistas/daniel-samper-pizano/?utm_source=google&utm_medium=paid_search&utm_campaign=buscador&utm_content=panelistas`

Las URL de las palabras con página propia y de los nueve sitelinks están completas en `docs/campanas/google-ads/README.md`, sección "Anuncios".

Para el ensayo antes de lanzar se abre a mano la URL con `utm_source=prueba` en vez de `google`, por ejemplo:
`https://testigosdelamemoria.com/?utm_source=prueba&utm_medium=paid_search&utm_campaign=buscador&utm_content=plan-villa-de-leyva`

## Enlaces listos para copiar

### Permanentes

- Bio de Instagram:
  `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=social&utm_campaign=permanente&utm_content=bio`
- Bio y botón de la página de Facebook:
  `https://testigosdelamemoria.com/?utm_source=facebook&utm_medium=social&utm_campaign=permanente&utm_content=bio`
- Perfil y catálogo de WhatsApp Business:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=social&utm_campaign=permanente&utm_content=perfil`
- Firma de correo del equipo:
  `https://testigosdelamemoria.com/?utm_source=email&utm_medium=email&utm_campaign=permanente&utm_content=firma`
- Perfil de Google, si se crea:
  `https://testigosdelamemoria.com/?utm_source=google&utm_medium=organic&utm_campaign=permanente&utm_content=perfil`
- Página de varios enlaces en la bio (tipo Linktree): un enlace por botón, con lo que lleva cada uno en el contenido (`utm_content=boletas`, `utm_content=agenda`).

### Chatbot

`docs/chatbot/legacy/system-prompt-atencion.md` y `docs/chatbot/legacy/chatbot-conocimiento.md` llevan la versión de un solo prompt para los dos canales. **El chatbot desplegado sigue con los enlaces anteriores hasta que se copien el prompt y la base de conocimiento en su plataforma.**

Un solo prompt para Instagram y WhatsApp:

- Inicio: `https://testigosdelamemoria.com/?utm_source=chatbot&utm_medium=chatbot&utm_campaign=permanente&utm_content=inicio`
- Comprar: `https://testigosdelamemoria.com/?utm_source=chatbot&utm_medium=chatbot&utm_campaign=permanente&utm_content=boletas`
- Programación: `https://testigosdelamemoria.com/?utm_source=chatbot&utm_medium=chatbot&utm_campaign=permanente&utm_content=agenda#agenda`
- Panelistas: `https://testigosdelamemoria.com/?utm_source=chatbot&utm_medium=chatbot&utm_campaign=permanente&utm_content=panelistas`
- Hoteles: `https://testigosdelamemoria.com/?utm_source=chatbot&utm_medium=chatbot&utm_campaign=permanente&utm_content=hospedaje#hospedaje`
- Sedes: `https://testigosdelamemoria.com/?utm_source=chatbot&utm_medium=chatbot&utm_campaign=permanente&utm_content=lugar#lugar`
- Términos (solo si preguntan): `https://testigosdelamemoria.com/terminos-y-condiciones/?utm_source=chatbot&utm_medium=chatbot&utm_campaign=permanente&utm_content=terminos`
- Política de datos (solo si preguntan): `https://testigosdelamemoria.com/tratamiento-de-datos/?utm_source=chatbot&utm_medium=chatbot&utm_campaign=permanente&utm_content=datos`
- Sitio en inglés (solo si preguntan): `https://testigosdelamemoria.com/en/?utm_source=chatbot&utm_medium=chatbot&utm_campaign=permanente&utm_content=en`

GA4 pone `chatbot` en "Unassigned", pero la campaña y el contenido se leen igual. Si la plataforma permite un prompt por canal, en cada uno se cambia `utm_source=chatbot` por `utm_source=instagram` o `utm_source=whatsapp`, y lo demás queda igual.

### Plantillas por campaña

Se cambia lo que está en MAYÚSCULAS: `CAMPAÑA` por el nombre de la campaña y `PIEZA` por la pieza con sus variables, según la filosofía de arriba.

- Historia con sticker de enlace:
  `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=social&utm_campaign=CAMPAÑA&utm_content=PIEZA`
- Publicación de Facebook con enlace:
  `https://testigosdelamemoria.com/?utm_source=facebook&utm_medium=social&utm_campaign=CAMPAÑA&utm_content=PIEZA`
- Estado de WhatsApp:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=social&utm_campaign=CAMPAÑA&utm_content=PIEZA`
- Mensaje del equipo por WhatsApp o lista de difusión:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=CAMPAÑA&utm_content=PIEZA`
- Mensaje directo de Instagram enviado por el equipo:
  `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=mensaje&utm_campaign=CAMPAÑA&utm_content=PIEZA`
- Correo masivo (Resend):
  `https://testigosdelamemoria.com/?utm_source=email&utm_medium=email&utm_campaign=CAMPAÑA&utm_content=PIEZA`
- Plantilla de WhatsApp a una lista:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=CAMPAÑA&utm_content=PIEZA`

Ejemplos de `PIEZA`: `historia-sede`, `historia-panelistas_cuenta-regresiva`, `estado-ultimo-dia`, `correo-pedido`, `plantilla-ultimo-dia_frio` y `plantilla-ultimo-dia_caliente` si la misma plantilla va a dos listas distintas.

En Instagram, el texto de una publicación o de un reel no admite enlaces. Ahí el llamado es "enlace en la bio", y la visita se cuenta como la bio. Si se quiere medir una publicación en particular, se acompaña con una historia que tenga su sticker.

### Panelistas, organizadores y aliados

Cada persona recibe **su** enlace, uno para WhatsApp y otro para sus redes. Es lo que hoy llega como "directo".

- WhatsApp:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=aliados&utm_campaign=CAMPAÑA&utm_content=persona-NOMBRE`
- Historias o publicaciones en sus redes:
  `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=aliados&utm_campaign=CAMPAÑA&utm_content=persona-NOMBRE`

Ejemplo: Juan Osorio en la campaña `sexta-gratis`, `utm_content=persona-juan-osorio` (enlaces completos en `docs/pretix/descuento-sexta-gratis.md`).

`NOMBRE` va como en `src/data/speakers.ts` (`maria-elvira-samper`). Para un organizador o patrocinador, su nombre o el de la entidad con el mismo formato. Si comparten una pieza nuestra, `repost-NOMBRE`.

### Impresos

`https://testigosdelamemoria.com/?utm_source=impreso&utm_medium=qr&utm_campaign=CAMPAÑA&utm_content=PIEZA-LUGAR`

Ejemplo: `utm_content=afiche-plaza-villa-de-leyva`. Un QR distinto por lugar, porque el lugar es lo que se compara. El QR se genera **estático**, con el enlace completo: los QR "dinámicos" pasan por otra página y pueden perder las etiquetas. Si el impreso no tiene campaña, se usa `permanente`.

### Prensa y páginas de terceros

`https://testigosdelamemoria.com/?utm_source=MEDIO&utm_medium=referral&utm_campaign=CAMPAÑA&utm_content=PIEZA`

Ejemplo: `utm_source=el-espectador`, `utm_content=entrevista-daniel-samper-pizano`. Se le manda al medio el enlace ya armado, junto con el comunicado.

### Del sitio hacia Eventalist

El pie del sitio dice "Testigos de la Memoria es un evento producido por Eventalist" (2026-10-18) y enlaza al sitio de Eventalist con UTM, para que Eventalist vea las visitas que le llegan desde aquí:

- `https://www.eventalist.co/?utm_source=testigosdelamemoria&utm_medium=referral&utm_campaign=permanente&utm_content=pie`

Si otro evento enlaza a Eventalist, usa la misma forma con su dominio como fuente.

Y de vuelta, el enlace desde la página de eventos de Eventalist hacia el sitio:

- `https://testigosdelamemoria.com/?utm_source=eventalist&utm_medium=referral&utm_campaign=permanente&utm_content=eventos`

## Canal nuevo

Antes de publicar el primer enlace en un canal nuevo (TikTok, LinkedIn, un grupo, un aliado nuevo):

- [ ] Agregar su `utm_source` a la lista de arriba, con el nombre de la plataforma.
- [ ] Si tiene perfil o bio, crear su enlace permanente (`utm_campaign=permanente&utm_content=bio`) y agregarlo a "Permanentes".
- [ ] Abrir el enlace desde el celular y comprobarlo en GA4 → Informes → Tiempo real.

## Antes de publicar cualquier enlace

- [ ] Fuente y medio salen de las listas cerradas.
- [ ] Campaña y contenido pasan "la prueba del nombre": junto a sus hermanos, se ve de un vistazo en qué se diferencian, y no repiten canal, etapa ni fecha.
- [ ] Se abre desde el celular y llega a la página correcta.
- [ ] En GA4 → Tiempo real aparece con su campaña.
- [ ] Si pasa por un acortador, la URL final conserva las etiquetas.
- [ ] Queda en la lista semanal que se le manda al encargado técnico: fecha, canal, pieza y enlace completo.

Para armar enlaces sin errores sirve el constructor oficial de Google: https://ga-dev-tools.google/campaign-url-builder/

## Valores anteriores (para leer las tablas viejas)

No se renombran: el histórico queda como está. Así se leen:

- `link_in_bio` sin campaña: la bio de Instagram antes del enlace con UTM. Equivale a `permanente` / `bio`.
- `bio` como campaña: la bio en la versión anterior de la guía. Equivale a `permanente` / `bio`.
- `boletas-2026`: enlace del chatbot en la versión anterior. Equivale a `permanente`; el chatbot no lo llegó a usar.
- `preventa_cierre`: anuncios del cierre de la preventa (12 de octubre). Equivale a `cierre-preventa`.
- `mariaelvira_rt`: repost de María Elvira Samper el 12 de octubre. Equivale a `repost-maria-elvira-samper`.
- `52647134201092` / `52646620091692`: anuncio con los números de Meta en vez de nombres. Se identifica en el Administrador de anuncios buscando ese id.
- `expirados-2026` con medio `recuperacion`: correo a pedidos vencidos del 12 de octubre. Equivale a `expirados` con medio `email`.
- `ensayo`, `verificacion`, `prueba`, `diag_claude`, `diag_fresh`: pruebas del equipo. Se filtran.
- El afiche y el reel con UTM que ya circulan: anotar aquí sus valores cuando el titular los confirme.
