# Copias externas

Dónde está publicado un hecho del evento fuera del sitio. El sitio toma sus hechos de `src/data/` y `src/config.ts`; estos lugares no: se pegan a mano. Cuando cambia un hecho (precio, fecha, panelista, sesión, número de contacto), recorrer esta lista y volver a pegar lo que corresponda. Cada vez que se pegue algo, anotar la fecha aquí.

Antes de pegar un texto que vive en el repo: `npm run build` y `npm run verificar`.

## Pretix (tienda `testigos-memoria`)

- **Qué tiene**: textos de la tienda, nombre, precio y precio original de cada producto, descripción de cada boleta (sesiones y panelistas por medio día), boleta y escarapela en PDF (sede, fechas), correos automáticos.
- **Copia en el repo**: `docs/pretix/pretix-tienda-textos.md` (los bloques de código son lo que se pega).
- **Cambia si cambia**: precio o etapa (a mano el día del cambio: Pretix no programa precios), panelistas u horario de una sesión, sede, fechas.
- **Último pegado**: por confirmar (la copia del repo es del 2026-10-23).

## Chatbot (respond.io: WhatsApp, Instagram y Facebook)

- **Qué tiene**: la ficha (hechos) y el prompt (comportamiento). Los precios no: los consulta en vivo en la tienda.
- **Copia en el repo**: `docs/chatbot/ficha_testigos_de_la_memoria_v*.md` y `docs/chatbot/prompt_v*.md`, la versión más alta de cada uno. `docs/chatbot/legacy/` no se usa.
- **Cambia si cambia**: sesiones, panelistas, sedes, etapas, hoteles, políticas, canales.
- **Último pegado**: por confirmar (ficha v6 del 2026-10-26 sin Ricardo Ospina, pendiente de pegar; prompt v5 del 2026-10-26).

## Plantillas de WhatsApp en Meta

Aprobadas, **no se editan**: si un hecho fijo del cuerpo cambia, se crea una plantilla nueva. Por eso un cuerpo nuevo no lleva precio, fecha de etapa ni número; si los necesita, van como variables que llena `campana.py`.

- **Copia en el repo**: el texto de cada una en `docs/campanas/whatsapp/<campaña>/README.md` y `docs/campanas/whatsapp-ventas/plantillas.md`.
- **Programadas**: `ex1_pedido_vencido` y `in1_boletas_medio_dia` (martes 27 de octubre), `ex2_sabado_en_la_tarde` y `in2_domingo_en_la_manana` (martes 3 de noviembre). Estado de aprobación en Meta: por confirmar.
- **Cambia si cambia**: panelistas o sesión que nombren, fechas.

## Mensajes reenviados a mano

No se pueden corregir después de enviados; solo los que faltan por mandar.

- **Grupos de WhatsApp de Villa de Leyva**: `docs/campanas/whatsapp/grupos-villa/README.md`.
- **Lista de difusión de Fernando Cordovez**: `docs/campanas/whatsapp/lista-fernando/README.md`.

## Google Ads (campaña `buscador`)

- **Qué tiene**: títulos y descripciones de los anuncios, enlaces con UTM.
- **Copia en el repo**: `docs/campanas/google-ads/plan.md`.
- **Cambia si cambia**: precio, fechas, panelistas que nombre un anuncio.

## Por completar con el titular

Sin copia en el repo; no se sabe qué hecho tienen ni desde cuándo:

- Biografía y publicaciones fijas de Instagram @testigosdelamemoria.
- Anuncios de Meta (textos e imágenes).
- Material impreso con QR (afiches, volantes).
- Perfiles en otras plataformas o directorios de eventos.
