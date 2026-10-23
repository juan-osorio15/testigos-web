# Guía del manager de redes

Fecha: 2026-10-13 (antes "Guía de enlaces con UTM", 2026-10-12). Para quien crea y maneja las redes sociales, publica, arma los anuncios o manda mensajes que lleven al sitio del evento. Es parte del estándar de medición de Eventalist (`estandar-medicion.md`).

**Los valores de cada etiqueta y los enlaces listos para copiar están en `enlaces-y-nombres.md`** (2026-10-13). Esta guía dice cuándo usar cada uno; si algo de aquí no coincide con ese documento, manda el documento.

## Por qué importa

Cada venta y cada interesado guarda **de dónde vino la persona**. Eso lo dice el enlace con el que llegó. Con esa información el informe le muestra al cliente qué publicación, anuncio o mensaje trajo gente que compró o dejó sus datos, también en las semanas en que hay pocas ventas.

Un enlace sin las etiquetas de campaña (las UTM) hace invisible ese trabajo: la venta queda como "sin campaña" y no se le puede atribuir a nadie. **Ningún enlace al sitio sale sin UTM.**

Una UTM es un pedazo que se agrega al final del enlace, después de un `?`:

```
https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=social&utm_campaign=permanente&utm_content=bio
```

No cambia la página que se abre. Solo le dice al sitio de dónde viene la visita.

## Al crear las redes del evento

- [ ] **Bio de Instagram, página de Facebook, perfil de WhatsApp Business y firma de correo** con sus enlaces de `enlaces-y-nombres.md`, sección "Permanentes". Si se usa una página de varios enlaces (tipo Linktree), cada enlace que lleve al sitio lleva el suyo.
- [ ] **Chatbot** de Instagram y WhatsApp con los enlaces de la sección "Chatbot" del mismo documento.
- [ ] Mandar al encargado técnico la lista de todos estos enlaces el mismo día.

## En cada publicación, historia o mensaje con enlace

- Sticker de enlace en historias, enlace en una publicación de Facebook, estado o mensaje de WhatsApp: cada uno con su enlace, armado con las plantillas de `enlaces-y-nombres.md` ("Por campaña").
- `#boletas` al final si el enlace debe bajar directo a la tienda.

## En cada anuncio de Meta

1. Antes de publicar, nombrar la campaña y cada anuncio con la filosofía de `enlaces-y-nombres.md`: la campaña con su nombre corto y el anuncio con la pieza y lo que la distingue de las demás (por ejemplo, la audiencia: `reel-panelistas_frio`).
2. En "URL del sitio web": solo `https://testigosdelamemoria.com/`.
3. En "Parámetros de URL" (a nivel de anuncio), copiar exacto:

```
utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}
```

4. Revisar que **todos** los anuncios activos tengan el campo lleno. Un anuncio sin parámetros llega sin campaña.

Detalles en "Anuncios de Meta" más abajo.

## En afiches, volantes y QR

El QR lleva el enlace con UTM, no el enlace limpio, y uno distinto por lugar. Plantilla y ejemplo en `enlaces-y-nombres.md`, sección "Impresos". Así se sabe qué afiche funcionó.

## Cada semana

- [ ] Mandar al encargado técnico la lista de enlaces nuevos usados esa semana: fecha, red, pieza y enlace completo. Sin esa lista, el informe no puede explicar los picos de visitas.
- [ ] Avisar las fechas de inicio y fin de cada anuncio y de las publicaciones grandes.

## Reglas, valores y enlaces

Las reglas de escritura, los valores permitidos de cada etiqueta, los enlaces fijos y los valores anteriores están en `enlaces-y-nombres.md`. Antes de publicar un enlace, abrirlo una vez desde el celular; el encargado técnico puede confirmar en GA4 (Tiempo real) que llegó con su campaña.

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
- **Unassigned:** nada coincide. Es el caso de `utm_source=impreso&utm_medium=qr`.

En la lista de redes sociales de GA4 están `facebook`, `fb`, `instagram`, `ig`, `whatsapp`, `messenger`, `l.instagram.com` y `l.facebook.com`; `meta` no. Cualquier medio que contenga `cp` o empiece por `paid` cuenta como pagado.

Fuentes: [Grupos de canales predeterminados de GA4](https://support.google.com/analytics/answer/9756891) y la lista "GA4 Source Categories" enlazada desde esa página.

## Qué guarda el sitio

El sitio guarda la campaña de la visita y la pasa a la tienda con el pedido. Desde el 2026-10-13 la recuerda hasta 30 días (y nunca después del 8 de noviembre): quien llega por un anuncio y compra días después en el mismo navegador conserva la campaña. Quien sale del navegador interno de Instagram a Safari o Chrome la pierde; eso no lo arregla ningún almacenamiento.
