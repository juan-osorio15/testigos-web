# Enlaces y nombres de campañas

Fecha: 2026-10-13. Para el equipo de mercadeo: quien publica, arma anuncios, manda mensajes o reparte material impreso. Es la fuente única de los valores de UTM y de los enlaces listos para copiar. `guia-manager-redes.md` dice cuándo usar cada enlace; este documento dice cómo se escribe.

## La idea

Cada enlace al sitio responde cinco preguntas, una por etiqueta. En GA4 cada etiqueta es una columna, así que una fila de la tabla se lee como una frase:

- **Dónde** se tocó el enlace: `utm_source`.
- **Cómo** llegó: `utm_medium`.
- **Por qué** existe el enlace (la campaña): `utm_campaign`.
- **Qué pieza** se tocó: `utm_content`.
- **A quién** se le mostró: `utm_term`.

Ejemplo de fila:

`ig / paid_social` · `etapa2_venta` · `reel_panelistas_a` · `similares_compradores`

Se lee: "anuncio en Instagram, campaña de venta de la etapa 2, reel de panelistas en su versión A, mostrado a personas parecidas a los compradores". Si una fila no se puede leer así de rápido, el nombre está mal.

## Reglas de escritura

- Todo en minúsculas, sin tildes, sin ñ, sin espacios.
- **`_` separa bloques** y **`-` une palabras dentro de un bloque**: `etapa2_venta`, `reel_maria-elvira-samper_b`.
- Cada valor sale de las listas de este documento. Un valor nuevo se agrega aquí **antes** de usarlo.
- Valores cortos: máximo unos 40 caracteres cada uno.
- Nunca números de Meta (`{{ad.id}}`, `{{campaign.id}}`): en la tabla salen como `52647134201092` y nadie sabe qué son.
- Nunca datos de una persona (correo, teléfono, nombre de un cliente). Los nombres de panelistas y aliados sí, porque son figuras públicas del evento.
- Siempre `https://` (en Colombia el sitio no responde por http).
- Si el enlace baja a la tienda, `#boletas` va **al final**, después de las etiquetas.
- `utm_campaign` es obligatoria. Sin ella la fila sale `(not set)`, como pasó con la bio el 12 de octubre.

## Las cinco etiquetas

### utm_source: dónde se tocó

- `ig` y `fb`: anuncios de Meta. Los pone Meta solo con `{{site_source_name}}`. Ver "Anuncios de Meta".
- `instagram`: publicaciones, historias, bio, mensajes directos y chatbot de Instagram.
- `facebook`: publicaciones, página y mensajes de Facebook.
- `whatsapp`: mensajes, estados, grupos, perfil y chatbot de WhatsApp.
- `email`: cualquier correo.
- `impreso`: QR de afiches, volantes, pendones y escenario.
- `google`: perfil de Google y anuncios de Google (futuro).
- Prensa y páginas de terceros: el nombre del medio o del sitio, con guiones (`el-espectador`, `revista-arcadia`).
- `prueba`: solo pruebas del equipo. Se filtra en los informes.

Canales futuros, con el mismo criterio de nombrar la plataforma: `tiktok`, `youtube`, `linkedin`, `x`. Para agregar un canal, ver "Canal nuevo".

### utm_medium: cómo llegó

- `paid_social`: anuncios pagados en redes.
- `paid_search`: anuncios pagados en Google (futuro).
- `social`: lo que publican las cuentas del evento (publicaciones, historias, bio, perfiles).
- `aliados`: lo que comparten panelistas, organizadores y patrocinadores desde sus cuentas o su WhatsApp.
- `mensaje`: mensajes del equipo, uno a uno, por lista de difusión o por plantilla.
- `chatbot`: enlaces que da el chatbot.
- `email`: correos.
- `qr`: material impreso.
- `organic`: solo el perfil de Google (así GA4 lo cuenta como búsqueda orgánica).
- `referral`: artículos de prensa y páginas de terceros.

### utm_campaign: por qué existe el enlace

Formato: `{momento}_{objetivo}`.

- **Momento:** `preventa`, `etapa1`, `etapa2`, `franjas`, `semana-evento`, `evento`, `post-evento`.
- **Objetivo:**
  - `venta`: vender;
  - `lanzamiento`: anunciar algo nuevo;
  - `remarketing`: volver a mostrarle algo a quien ya visitó;
  - `recuperacion`: quien empezó una compra y no la terminó;
  - `interesados`: sumar a la lista de interesados;
  - `cierre`: fin de una etapa o de un precio;
  - `recordatorio`: logística, para quien ya compró.
- **`permanente`**, sola, para los enlaces que no cambian con las campañas: bios, perfiles, chatbot, firma de correo y QR genéricos.

En uso desde el 13 de octubre (el titular confirma o ajusta):

- `permanente`
- `etapa2_venta`
- `etapa2_remarketing`
- `franjas_lanzamiento`: apertura de las boletas de medio día.
- `etapa2_recuperacion`: correos y WhatsApp a pedidos vencidos.

No lleva el año: cada evento tiene su propia propiedad de GA4 y su evento en Pretix. Si una edición futura de Testigos usa la misma propiedad, se antepone el año (`2027_etapa1_venta`).

### utm_content: qué pieza

**Piezas** (publicaciones, anuncios, mensajes, impresos): `{formato}_{tema}`, y `_{variante}` al final si se compara con otra versión.

- **Formato:**
  - redes: `reel`, `historia`, `post`, `carrusel`, `video`, `imagen`, `en-vivo`;
  - mensajes y correos: `mensaje`, `plantilla`, `estado`, `correo`;
  - impresos: `afiche`, `volante`, `pendon`;
  - otros: `articulo`, `repost`, `persona`.
- **Tema:** `panelistas`, el nombre del panelista como en `src/data/speakers.ts` (`maria-elvira-samper`, `daniel-samper-pizano`), `agenda`, `sede`, `precio`, `cuenta-regresiva`, `testimonio`, `hospedaje`, `ultimos-cupos`. Un tema nuevo se agrega aquí.
- **Variante:** `a`, `b`, `c`. Las variantes de una prueba comparten formato y tema, y solo cambia la letra: `reel_panelistas_a` y `reel_panelistas_b`.
- **Lugar, en impresos:** el lugar va como tema: `afiche_plaza-villa-de-leyva`, `volante_universidad-javeriana`.

**Puntos fijos** (bios, perfiles, chatbot, firmas): `{punto}_{canal}`, y `_{seccion}` si hay varios enlaces en el mismo punto.

- `bio_instagram`, `bio_facebook`, `perfil_whatsapp`, `perfil_google`, `firma_correo`.
- `chatbot_instagram_boletas`, `chatbot_whatsapp_agenda`.
- Página de varios enlaces (tipo Linktree): `bio_instagram_boletas`, `bio_instagram_agenda`.

### utm_term: a quién se le mostró

Solo cuando se eligió un público: anuncios, listas, grupos. En publicaciones abiertas a cualquiera se omite.

Formato: `{tipo}_{detalle}`.

- `frio_{interes}`: gente nueva, por intereses (`frio_historia-colombia`, `frio_periodismo`).
- `similares_{base}`: parecidos a una lista (`similares_compradores`).
- `remarketing_{base}`: quien ya pasó por el sitio (`remarketing_visitantes`, `remarketing_pulso-comprar`).
- `lista_{nombre}`: listas propias (`lista_interesados`, `lista_expirados`, `lista_compradores`).
- `grupo_{nombre}`: grupos de WhatsApp o comunidades (`grupo_periodistas-bogota`).
- `seguidores`: anuncio mostrado solo a los seguidores de la cuenta.

Si el público tiene un lugar, se agrega como bloque final: `frio_historia-colombia_bogota`.

Dónde se ve: en GA4 es la columna "Término manual de la sesión" (se agrega a la exploración junto a campaña y contenido). Pretix, en "Ventas por campaña", no la muestra; la exportación del backend sí.

## Anuncios de Meta

El truco es nombrar **una sola vez, en Meta**, y que GA4 copie los nombres solos:

- Nombre de la **campaña** en Meta = un valor de `utm_campaign` (`etapa2_venta`).
- Nombre del **conjunto de anuncios** = un valor de `utm_term` (`similares_compradores`).
- Nombre del **anuncio** = un valor de `utm_content` (`reel_panelistas_a`).

En "URL del sitio web": `https://testigosdelamemoria.com/`

En "Parámetros de URL" de cada anuncio, exacto:

```
utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```

- Los nombres quedan bien escritos **antes de publicar**. Meta puede seguir mandando el nombre viejo si se renombra después.
- Así, el Administrador de anuncios y GA4 muestran los mismos nombres, y se comparan sin traducir.
- Revisar **cada** anuncio activo. Un anuncio sin parámetros llega como `l.instagram.com / referral`, sin campaña (le pasó a `Z9UMQ` el 12 de octubre).

## Enlaces listos para copiar

### Permanentes

- Bio de Instagram:
  `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=social&utm_campaign=permanente&utm_content=bio_instagram`
- Bio y botón de la página de Facebook:
  `https://testigosdelamemoria.com/?utm_source=facebook&utm_medium=social&utm_campaign=permanente&utm_content=bio_facebook`
- Perfil y catálogo de WhatsApp Business:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=social&utm_campaign=permanente&utm_content=perfil_whatsapp`
- Firma de correo del equipo:
  `https://testigosdelamemoria.com/?utm_source=email&utm_medium=email&utm_campaign=permanente&utm_content=firma_correo`
- Perfil de Google, si se crea:
  `https://testigosdelamemoria.com/?utm_source=google&utm_medium=organic&utm_campaign=permanente&utm_content=perfil_google`

### Chatbot

Desde el 2026-10-13, `docs/system-prompt-atencion.md` y `docs/chatbot-conocimiento.md` llevan la versión general (`utm_source=chatbot`, al final de esta sección), que sirve con un solo prompt para los dos canales. **El chatbot desplegado sigue con los enlaces anteriores hasta que se copien el prompt y la base de conocimiento en su plataforma.** Si la plataforma permite un prompt por canal, se usan estos:

Instagram:

- Comprar: `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=chatbot&utm_campaign=permanente&utm_content=chatbot_instagram_boletas#boletas`
- Programación: `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=chatbot&utm_campaign=permanente&utm_content=chatbot_instagram_agenda#agenda`
- Panelistas: `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=chatbot&utm_campaign=permanente&utm_content=chatbot_instagram_panelistas#speakers`
- Hoteles: `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=chatbot&utm_campaign=permanente&utm_content=chatbot_instagram_hospedaje#hospedaje`
- Sedes: `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=chatbot&utm_campaign=permanente&utm_content=chatbot_instagram_lugar#lugar`

WhatsApp: los mismos, cambiando `utm_source=instagram` por `utm_source=whatsapp` e `instagram` por `whatsapp` dentro de `utm_content` (`chatbot_whatsapp_boletas`).

Si la plataforma usa un solo prompt para los dos canales: `utm_source=chatbot` y `utm_content=chatbot_general_boletas` (y así con cada sección). GA4 pondrá esas visitas en "Unassigned", pero la campaña y el contenido se leen igual.

### Por campaña (plantillas)

Se cambia lo que está en MAYÚSCULAS por valores de las listas.

- Historia con sticker de enlace:
  `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=social&utm_campaign=CAMPAÑA&utm_content=historia_TEMA`
- Publicación de Facebook con enlace:
  `https://testigosdelamemoria.com/?utm_source=facebook&utm_medium=social&utm_campaign=CAMPAÑA&utm_content=post_TEMA`
- Estado de WhatsApp:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=social&utm_campaign=CAMPAÑA&utm_content=estado_TEMA`
- Mensaje del equipo por WhatsApp o lista de difusión:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=CAMPAÑA&utm_content=mensaje_TEMA&utm_term=PUBLICO`
- Mensaje directo de Instagram enviado por el equipo:
  `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=mensaje&utm_campaign=CAMPAÑA&utm_content=mensaje_TEMA`
- Correo masivo (Resend):
  `https://testigosdelamemoria.com/?utm_source=email&utm_medium=email&utm_campaign=CAMPAÑA&utm_content=correo_TEMA&utm_term=lista_NOMBRE#boletas`
- Plantilla de WhatsApp a una lista:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=CAMPAÑA&utm_content=plantilla_TEMA&utm_term=lista_NOMBRE#boletas`

En Instagram, el texto de una publicación o de un reel no admite enlaces. Ahí el llamado es "enlace en la bio", y la visita se cuenta como `bio_instagram`. Si se quiere medir una publicación en particular, se acompaña con una historia que tenga su sticker.

### Panelistas, organizadores y aliados

Cada persona recibe **su** enlace, uno para WhatsApp y otro para sus redes. Es lo que hoy llega como "directo".

- WhatsApp:
  `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=aliados&utm_campaign=CAMPAÑA&utm_content=persona_NOMBRE`
- Historias o publicaciones en sus redes:
  `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=aliados&utm_campaign=CAMPAÑA&utm_content=persona_NOMBRE`

`NOMBRE` va como en `src/data/speakers.ts` (`maria-elvira-samper`). Para un organizador o patrocinador, su nombre o el de la entidad con el mismo formato. Si comparten una pieza nuestra, se usa `repost_NOMBRE` en vez de `persona_NOMBRE`.

### Impresos

`https://testigosdelamemoria.com/?utm_source=impreso&utm_medium=qr&utm_campaign=CAMPAÑA&utm_content=FORMATO_LUGAR`

Ejemplo: `utm_content=afiche_plaza-villa-de-leyva`. Un QR distinto por lugar. El QR se genera **estático**, con el enlace completo: los QR "dinámicos" pasan por otra página y pueden perder las etiquetas. Si el impreso no tiene campaña, se usa `permanente`.

### Prensa y páginas de terceros

`https://testigosdelamemoria.com/?utm_source=MEDIO&utm_medium=referral&utm_campaign=CAMPAÑA&utm_content=articulo_TEMA`

Se le manda al medio el enlace ya armado, junto con el comunicado.

## Canal nuevo

Antes de publicar el primer enlace en un canal nuevo (TikTok, LinkedIn, un grupo, un aliado nuevo):

- [ ] Agregar su `utm_source` a la lista de arriba, con el nombre de la plataforma.
- [ ] Si tiene perfil o bio, crear su enlace permanente `bio_CANAL` o `perfil_CANAL` y agregarlo a "Permanentes".
- [ ] Si tiene un público propio (un grupo, una lista), agregar su `utm_term`.
- [ ] Abrir el enlace desde el celular y comprobarlo en GA4 → Informes → Tiempo real.

## Antes de publicar cualquier enlace

- [ ] Las cinco etiquetas salen de las listas de este documento, o se agregaron aquí antes.
- [ ] Se abre desde el celular y llega a la página correcta.
- [ ] En GA4 → Tiempo real aparece con su campaña.
- [ ] Si pasa por un acortador, la URL final conserva las etiquetas.
- [ ] Queda en la lista semanal que se le manda al encargado técnico: fecha, canal, pieza y enlace completo.

Para armar enlaces sin errores sirve el constructor oficial de Google: https://ga-dev-tools.google/campaign-url-builder/

## Valores anteriores (para leer las tablas viejas)

No se renombran: el histórico queda como está. Así se leen:

- `link_in_bio` sin campaña: la bio de Instagram antes del enlace con UTM. Equivale a `bio_instagram`.
- `bio`: campaña de la bio en la versión anterior de esta guía. Equivale a `permanente`.
- `boletas-2026`: enlace del chatbot en la versión anterior. Equivale a `permanente`; el chatbot no lo llegó a usar.
- `preventa_cierre`: anuncios del cierre de la etapa 1 (12 de octubre). Equivale a `etapa1_cierre`.
- `mariaelvira_rt`: repost de María Elvira Samper el 12 de octubre. Equivale a `repost_maria-elvira-samper`.
- `52647134201092` / `52646620091692`: anuncio con los números de Meta en vez de nombres. Se identifica en el Administrador de anuncios buscando ese id.
- `expirados-2026` con medio `recuperacion`: correo a pedidos vencidos del 12 de octubre. Equivale a `etapa1_recuperacion` con medio `email`.
- `ensayo`, `verificacion`, `prueba`, `diag_claude`, `diag_fresh`: pruebas del equipo. Se filtran.
- El afiche y el reel con UTM que ya circulan: anotar aquí sus valores cuando el titular los confirme.
