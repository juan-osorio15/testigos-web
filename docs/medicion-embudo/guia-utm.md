# Guía de enlaces con UTM

Fecha: 2026-10-12. Para quien arma anuncios, publicaciones, correos o mensajes que lleven al sitio de Testigos de la Memoria.

Cada pedido de la tienda guarda la campaña con la que llegó la persona (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`). Con eso salen el informe "Ventas por campaña" de Pretix, el del backend y el informe en PDF. Si el enlace no lleva UTM, o las lleva mal escritas, la venta queda como "sin campaña" o en el canal equivocado de GA4.

Cuando se publique el cambio aprobado el 2026-10-12, el sitio recordará la campaña de la última visita hasta 30 días (y nunca después del 8 de noviembre). Quien llegue por un anuncio y compre días después en el mismo navegador conservará la campaña. Quien sale del navegador interno de Instagram a Safari o Chrome la pierde: eso no lo arregla ningún almacenamiento.

## Reglas para todos los enlaces

- Siempre `https://testigosdelamemoria.com/`. Nunca `http://`: en Colombia el sitio no responde por http.
- Todo en minúsculas, sin tildes, sin espacios. Palabras separadas con guion: `reel-panelistas`.
- Los cinco nombres de parámetro van exactos: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.
- `#boletas` al final si el enlace debe bajar directo a la tienda. Va después de los parámetros.
- Antes de publicar, abrir el enlace una vez y ver en GA4, Informes, Tiempo real, que llegue con la fuente y el medio esperados.

## Valores permitidos

### utm_source (de dónde viene la persona)

- `ig` y `fb`: anuncios de Meta. Los pone Meta solo, con `{{site_source_name}}` (ver más abajo).
- `instagram`: publicaciones, historias, enlace de la bio y chatbot de Instagram.
- `facebook`: publicaciones orgánicas de Facebook.
- `whatsapp`: mensajes y chatbot de WhatsApp.
- `email`: correos.
- `prueba`: solo para pruebas del equipo. Se filtra en los informes.

**No usar `meta`.** GA4 no lo reconoce como red social y manda esas visitas a "Paid Other" o "Unassigned". `facebook`, `fb`, `instagram`, `ig`, `whatsapp`, `l.instagram.com` y `l.facebook.com` sí están en su lista de redes sociales.

### utm_medium (qué tipo de enlace es)

- `paid_social`: todo lo pagado en Meta.
- `social`: publicaciones orgánicas, historias y enlace de la bio.
- `chatbot`: enlaces que entrega el chatbot de Instagram o WhatsApp.
- `recuperacion`: correos y WhatsApp a quien empezó una compra y no la terminó.

### utm_campaign (qué campaña)

En uso:

- `expirados-2026`: campaña a pedidos vencidos (correo y WhatsApp).
- `boletas-2026`: enlace general del chatbot.
- `bio`: enlace de la bio de Instagram.

Propuestos para los anuncios (por confirmar con el titular):

- `etapa2-2026`: anuncios de la segunda etapa de precios (desde el 13 de octubre).
- `remarketing-2026`: anuncios a quien visitó el sitio o empezó una compra.

Una campaña nueva se agrega aquí antes de usarla, con el mismo formato: `nombre-2026`.

### utm_content (qué pieza)

Nombre corto de la pieza o del anuncio: `reel-panelistas`, `afiche-sede`, `carrusel-agenda`. Sirve para comparar piezas dentro de una misma campaña.

### utm_term

No se usa. En anuncios se puede dejar vacío.

## Cómo GA4 clasifica el canal

Según la definición vigente de los grupos de canales predeterminados de GA4 (consultada el 2026-10-12):

- **Paid Social:** la fuente está en la lista de redes sociales de GA4 **y** el medio cumple la expresión de pago `^(.*cp.*|ppc|retargeting|paid.*)$`. Ejemplo: `utm_source=ig&utm_medium=paid_social`.
- **Organic Social:** la fuente está en la lista de redes sociales **o** el medio es `social`, `social-network`, `social-media`, `sm`, `social network` o `social media`. Ejemplo: `utm_source=instagram&utm_medium=social`.
- **Paid Other:** el medio es de pago pero la fuente no es una red social conocida. Es lo que pasa con `utm_source=meta&utm_medium=paid`.
- **Email:** la fuente o el medio es `email`, `e-mail`, `e_mail` o `e mail`.

Ojo con el medio: cualquier valor que contenga `cp` o empiece por `paid` cuenta como pagado.

Fuentes: [Grupos de canales predeterminados de GA4](https://support.google.com/analytics/answer/9756891) y la lista "GA4 Source Categories" enlazada desde esa página.

## Anuncios de Meta: campo "Parámetros de URL"

En el Administrador de anuncios, a nivel de **anuncio**: "Destino" o "Seguimiento", campo "Parámetros de URL". En "URL del sitio web" va solo `https://testigosdelamemoria.com/`, sin parámetros. Las UTM van únicamente en el campo de parámetros, nunca en los dos sitios.

### Opción 1: nombres dinámicos (solo si los nombres siguen el formato)

Copiar exacto:

```
utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}
```

Solo sirve si **antes de publicar** el nombre de la campaña en Meta es uno de los valores de `utm_campaign` de esta guía (por ejemplo `etapa2-2026`) y el nombre del anuncio sigue el formato de `utm_content` (por ejemplo `reel-panelistas`). Todo en minúsculas, con guiones, sin espacios ni tildes. Hay fuentes que dicen que Meta sigue enviando el nombre original si la campaña se renombra después: el nombre correcto va desde el principio.

### Opción 2: valores fijos (si los nombres en Meta no siguen el formato)

```
utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign=etapa2-2026&utm_content=reel-panelistas
```

Cambiando `etapa2-2026` y `reel-panelistas` por los valores de cada anuncio.

### Lo que no va

- `{{campaign.id}}`, `{{adset.id}}` ni `{{ad.id}}`: mandan números como `52647134201092` que nadie puede leer en el informe.
- `utm_source=meta` ni `utm_medium=paid` (ver arriba).

### Qué devuelve `{{site_source_name}}`

`fb` (Facebook), `ig` (Instagram), `msg` (Messenger) o `an` (Audience Network). `fb` e `ig` cuentan como red social en GA4; `msg` y `an` no, y caerían en "Paid Other". Si la campaña se publica en Messenger o Audience Network, conviene quitar esas ubicaciones o aceptar que esas visitas queden en otro canal.

## Enlaces fijos ya publicados

- Bio de Instagram: `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=social&utm_campaign=bio`. Con el enlace anterior, sin UTM, Instagram agregaba por su cuenta `utm_content=link_in_bio`; falta comprobar en Tiempo real qué llega con el nuevo.
- Chatbot de Instagram: `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=chatbot&utm_campaign=boletas-2026#boletas` (`docs/system-prompt-atencion.md`).
- Chatbot de WhatsApp: `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=chatbot&utm_campaign=boletas-2026#boletas`.
- Correo a expirados: `https://testigosdelamemoria.com/?utm_source=email&utm_medium=recuperacion&utm_campaign=expirados-2026#boletas` (`scripts/correo/plantillas/`).
- WhatsApp a expirados: `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=recuperacion&utm_campaign=expirados-2026#boletas` (`docs/campana-expirados/`).
