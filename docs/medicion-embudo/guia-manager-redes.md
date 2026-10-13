# Guía del manager de redes

Fecha: 2026-10-13 (antes "Guía de enlaces con UTM", 2026-10-12). Para quien crea y maneja las redes sociales, publica, arma los anuncios o manda mensajes que lleven al sitio del evento. Es parte del estándar de medición de Eventalist (`estandar-medicion.md`).

## Por qué importa

Cada venta y cada interesado guarda **de dónde vino la persona**. Eso lo dice el enlace con el que llegó. Con esa información el informe le muestra al cliente qué publicación, anuncio o mensaje trajo gente que compró o dejó sus datos, también en las semanas en que hay pocas ventas.

Un enlace sin las etiquetas de campaña (las UTM) hace invisible ese trabajo: la venta queda como "sin campaña" y no se le puede atribuir a nadie. **Ningún enlace al sitio sale sin UTM.**

Una UTM es un pedazo que se agrega al final del enlace, después de un `?`:

```
https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=social&utm_campaign=bio
```

No cambia la página que se abre. Solo le dice al sitio de dónde viene la visita.

## Al crear las redes del evento

- [ ] **Enlace de la bio de Instagram** con UTM (ver "Enlaces fijos" abajo). Si se usa una página de varios enlaces (tipo Linktree), cada enlace que lleve al sitio lleva su UTM.
- [ ] **Botón y enlace de la página de Facebook** con `utm_source=facebook&utm_medium=social&utm_campaign=bio`.
- [ ] **Perfil de WhatsApp Business** (sitio web del perfil y catálogo) con `utm_source=whatsapp&utm_medium=social&utm_campaign=bio`.
- [ ] **Chatbot** de Instagram y WhatsApp con sus enlaces propios (ver "Enlaces fijos").
- [ ] Mandar al encargado técnico la lista de todos estos enlaces el mismo día.

## En cada publicación, historia o mensaje con enlace

- Sticker de enlace en historias, enlace en descripción de Facebook, enlace en un mensaje de difusión: cada uno con UTM.
- Plantilla:

```
https://testigosdelamemoria.com/?utm_source=FUENTE&utm_medium=social&utm_campaign=CAMPAÑA&utm_content=PIEZA
```

- `FUENTE`: `instagram`, `facebook` o `whatsapp`.
- `CAMPAÑA`: una de la lista de "Valores permitidos".
- `PIEZA`: nombre corto de la publicación, por ejemplo `historia-panelistas`, `reel-sede`.
- `#boletas` al final si el enlace debe bajar directo a la tienda.

## En cada anuncio de Meta

1. Antes de publicar, ponerle a la campaña y a cada anuncio un nombre con el formato de esta guía: minúsculas, guiones, sin espacios ni tildes. Ejemplo: campaña `etapa2-2026`, anuncio `reel-panelistas`.
2. En "URL del sitio web": solo `https://testigosdelamemoria.com/`.
3. En "Parámetros de URL" (a nivel de anuncio), copiar exacto:

```
utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}
```

4. Si los nombres en Meta no siguen el formato, usar valores fijos en su lugar:

```
utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign=etapa2-2026&utm_content=reel-panelistas
```

Detalles en "Anuncios de Meta" más abajo.

## En afiches, volantes y QR

El QR lleva el enlace con UTM, no el enlace limpio:

```
https://testigosdelamemoria.com/?utm_source=afiche&utm_medium=qr&utm_campaign=CAMPAÑA&utm_content=LUGAR
```

`LUGAR`: dónde se pegó o repartió (`villa-de-leyva`, `universidad-x`). Así se sabe qué afiche funcionó. (Propuesto; GA4 pone estas visitas en el canal "Unassigned", pero la campaña y la venta se ven bien en Pretix y en el backend).

## Cada semana

- [ ] Mandar al encargado técnico la lista de enlaces nuevos usados esa semana: fecha, red, pieza y enlace completo. Sin esa lista, el informe no puede explicar los picos de visitas.
- [ ] Avisar las fechas de inicio y fin de cada anuncio y de las publicaciones grandes.

## Reglas para todos los enlaces

- Siempre `https://`. Nunca `http://`: en Colombia el sitio no responde por http.
- Todo en minúsculas, sin tildes, sin espacios. Palabras separadas con guion.
- Los cinco nombres de parámetro van exactos: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.
- **Nunca datos de una persona en un enlace**: ni correo, ni teléfono, ni nombre.
- Antes de publicar, abrir el enlace una vez desde el celular y comprobar que abre la página correcta. El encargado técnico puede confirmar en GA4 (Tiempo real) que llegó con su campaña.

## Valores permitidos

### utm_source (de dónde viene la persona)

- `ig` y `fb`: anuncios de Meta. Los pone Meta solo, con `{{site_source_name}}`.
- `instagram`: publicaciones, historias, enlace de la bio y chatbot de Instagram.
- `facebook`: publicaciones orgánicas de Facebook.
- `whatsapp`: mensajes, perfil y chatbot de WhatsApp.
- `email`: correos.
- `afiche`: QR de material impreso (propuesto).
- `prueba`: solo para pruebas del equipo. Se filtra en los informes.

**No usar `meta`.** GA4 no lo reconoce como red social y manda esas visitas a "Paid Other" o "Unassigned".

### utm_medium (qué tipo de enlace es)

- `paid_social`: todo lo pagado en Meta.
- `social`: publicaciones orgánicas, historias, bio y perfiles.
- `chatbot`: enlaces que entrega el chatbot de Instagram o WhatsApp.
- `recuperacion`: correos y WhatsApp a quien empezó una compra y no la terminó.
- `qr`: material impreso (propuesto).

### utm_campaign (qué campaña)

En uso:

- `expirados-2026`: campaña a pedidos vencidos (correo y WhatsApp).
- `boletas-2026`: enlace general del chatbot.
- `bio`: enlaces fijos de los perfiles.

Propuestos para los anuncios (por confirmar con el titular):

- `etapa2-2026`: anuncios de la segunda etapa de precios (desde el 13 de octubre).
- `remarketing-2026`: anuncios a quien visitó el sitio o empezó una compra.

Una campaña nueva se agrega aquí antes de usarla, con el mismo formato: `nombre-2026`.

### utm_content (qué pieza)

Nombre corto de la pieza o del anuncio: `reel-panelistas`, `afiche-sede`, `carrusel-agenda`. Sirve para comparar piezas dentro de una misma campaña.

### utm_term

No se usa.

## Enlaces fijos ya publicados

- Bio de Instagram: `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=social&utm_campaign=bio`. Con el enlace anterior, sin UTM, Instagram agregaba por su cuenta `utm_content=link_in_bio`; falta comprobar en Tiempo real qué llega con el nuevo.
- Chatbot de Instagram: `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=chatbot&utm_campaign=boletas-2026#boletas` (`docs/system-prompt-atencion.md`).
- Chatbot de WhatsApp: `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=chatbot&utm_campaign=boletas-2026#boletas`.
- Correo a expirados: `https://testigosdelamemoria.com/?utm_source=email&utm_medium=recuperacion&utm_campaign=expirados-2026#boletas` (`scripts/correo/plantillas/`).
- WhatsApp a expirados: `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=recuperacion&utm_campaign=expirados-2026#boletas` (`docs/campana-expirados/`).

---

# Anexos para el encargado técnico

## Anuncios de Meta

El campo "Parámetros de URL" está a nivel de **anuncio**, en "Destino" o "Seguimiento". Las UTM van únicamente en ese campo, nunca también en la URL del sitio web.

- **Nombres dinámicos** (`{{campaign.name}}`, `{{ad.name}}`): solo si el nombre está bien escrito desde antes de publicar. Hay fuentes que dicen que Meta sigue enviando el nombre original si la campaña se renombra después.
- **Lo que no va:** `{{campaign.id}}`, `{{adset.id}}` ni `{{ad.id}}`, que mandan números como `52647134201092` que nadie puede leer en el informe; tampoco `utm_source=meta` ni `utm_medium=paid`.
- **Qué devuelve `{{site_source_name}}`:** `fb` (Facebook), `ig` (Instagram), `msg` (Messenger) o `an` (Audience Network). `fb` e `ig` cuentan como red social en GA4; `msg` y `an` no, y caerían en "Paid Other". Si la campaña se publica en Messenger o Audience Network, conviene quitar esas ubicaciones o aceptar que esas visitas queden en otro canal.

## Cómo GA4 clasifica el canal

Según la definición vigente de los grupos de canales predeterminados de GA4 (consultada el 2026-10-12):

- **Paid Social:** la fuente está en la lista de redes sociales de GA4 **y** el medio cumple la expresión de pago `^(.*cp.*|ppc|retargeting|paid.*)$`. Ejemplo: `utm_source=ig&utm_medium=paid_social`.
- **Organic Social:** la fuente está en la lista de redes sociales **o** el medio es `social`, `social-network`, `social-media`, `sm`, `social network` o `social media`. Ejemplo: `utm_source=instagram&utm_medium=social`.
- **Paid Other:** el medio es de pago pero la fuente no es una red social conocida. Es lo que pasa con `utm_source=meta&utm_medium=paid`.
- **Email:** la fuente o el medio es `email`, `e-mail`, `e_mail` o `e mail`.
- **Unassigned:** nada coincide. Es el caso de `utm_source=afiche&utm_medium=qr`.

En la lista de redes sociales de GA4 están `facebook`, `fb`, `instagram`, `ig`, `whatsapp`, `messenger`, `l.instagram.com` y `l.facebook.com`; `meta` no. Cualquier medio que contenga `cp` o empiece por `paid` cuenta como pagado.

Fuentes: [Grupos de canales predeterminados de GA4](https://support.google.com/analytics/answer/9756891) y la lista "GA4 Source Categories" enlazada desde esa página.

## Qué guarda el sitio

El sitio guarda la campaña de la visita y la pasa a la tienda con el pedido. Desde el 2026-10-13 la recuerda hasta 30 días (y nunca después del 8 de noviembre): quien llega por un anuncio y compra días después en el mismo navegador conserva la campaña. Quien sale del navegador interno de Instagram a Safari o Chrome la pierde; eso no lo arregla ningún almacenamiento.
