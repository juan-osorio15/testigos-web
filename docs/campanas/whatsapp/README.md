# Campaña de WhatsApp · Testigos de la Memoria

Plan del 22 de octubre de 2026 para las dos últimas semanas antes del evento (5 al 8 de noviembre). Reemplaza a `docs/campanas/whatsapp-ventas/`, que quedó desactualizado.

## Para qué

1. **Volver a escribirles, ahora por WhatsApp, a quienes ya conocen el evento:** interesados del sitio y personas que no terminaron su compra. Antes se les escribió por correo.
2. **Llegar a público nuevo de la zona:** los grupos de planes y eventos de Villa de Leyva y los contactos de Fernando Cordovez, gente que vive allá y comparte los intereses del evento.
3. **Que todo termine en una conversación con el agente** del número colombiano, que resuelve dudas y lleva a la compra.
4. **Contenido distinto en cada envío**, con presión que crece con el tiempo sin volverse insistente.
5. **Saber qué funciona:** cada campaña tiene su propio enlace, así se sabe de dónde viene cada conversación.

## Lo que aprendimos en los informes y cómo se usa aquí

- **Boyacá tiene la mayor intención de compra:** 26 clics en Comprar por cada 100 personas, frente a 5 en Bogotá. Por eso esta campaña apuesta por la gente de la zona.
- **Las boletas de medio día ya son la mayoría de la venta semanal.** Para alguien que vive en Villa de Leyva son la forma más fácil de venir, así que son la oferta principal.
- **Las colaboraciones funcionan:** el video con influencers fue lo más visto, y los de la nueva línea (historia y Casa Boutique) superaron a los anteriores. Se usan en los grupos y en la lista de Fernando.
- **El afiche general fue el anuncio que más clics en Comprar trajo.** Es la primera publicación de las dos campañas locales.
- **Una fecha límite mueve la venta:** el 12 de octubre, último día del Pase a precio de etapa 1, fue el mejor día de ventas. Si se lanza el pase de fin de semana con fecha límite, entra como el pico del calendario.
- **Quien pulsa Comprar casi siempre termina.** El trabajo del WhatsApp es llevar a la gente a la conversación y al botón.

## Las campañas

- [`grupos-villa/`](grupos-villa/) · **GV** · grupos de planes y eventos de Villa de Leyva. Tres publicaciones por semana. Se publican a mano.
- [`lista-fernando/`](lista-fernando/) · **LF** · lista de difusión y contactos de Fernando. Un mensaje por día hábil, en su voz. Él los reenvía.
- [`interesados/`](interesados/) · **IN** · quienes pidieron aviso en el sitio. Una vez por semana, con plantilla de Meta por la API.
- [`expirados/`](expirados/) · **EX** · quienes empezaron una compra y no la terminaron. Una vez por semana, con plantilla de Meta por la API.
- [`respondio/`](respondio/) · broadcasts desde respond.io a contactos de Catalina: qué lleva cada plantilla y cómo se manda. Hoy: **RC**, conversaciones cerradas por inactividad sin compra, una plantilla por día hasta el evento.
- [`cierre-descuento/`](cierre-descuento/) · **CD** · broadcasts de respond.io de los tres últimos días de la etapa 2 (27 al 29 de octubre), con pieza.

Cada carpeta tiene su `README.md` con lo que toca cada día.

## Nomenclatura

- Cada publicación lleva la sigla de la campaña y su número: `GV1`, `GV2`, `LF1`… Las plantillas de Meta usan la misma sigla: `in1_…`, `ex1_…`.
- Si una publicación lleva varias imágenes, van numeradas en el orden en que se envían: `LF2-1.png`, `LF2-2.png`, `LF2-3.png`.
- Las piezas están en `piezas/` dentro de cada carpeta. No se suben al repo (están en `.gitignore`); los originales están en Descargas, en `Charlas_Afiches` y `Periodistas_Publicaciones`.

## Enlaces al agente

Número colombiano: +57 323 923 6021. Cada campaña local tiene su mensaje ya escrito, para que el agente sepa de dónde viene la persona:

- **GV:** https://wa.me/573239236021?text=Hola%2C%20vi%20Testigos%20de%20la%20Memoria%20en%20un%20grupo%20de%20Villa%20de%20Leyva
- **LF:** https://wa.me/573239236021?text=Hola%2C%20Fernando%20me%20cont%C3%B3%20de%20Testigos%20de%20la%20Memoria

Cada publicación de GV y LF lleva dos enlaces: el del agente, para preguntar, y el de la página con UTM, para comprar directo. Los UTM siguen la guía del repo (`docs/medicion/embudo/enlaces-y-nombres.md`): la campaña es la iniciativa y el contenido es la pieza, así en Google Analytics se ve qué pieza trajo visitas y clics en Comprar.

- **GV:** `utm_source=whatsapp&utm_medium=mensaje&utm_campaign=grupos-villa&utm_content=PIEZA` (lo publica el equipo).
- **LF:** `utm_source=whatsapp&utm_medium=aliados&utm_campaign=lista-fernando&utm_content=PIEZA` (lo comparte un organizador desde su WhatsApp).
- **IN y EX:** `utm_source=whatsapp&utm_medium=mensaje&utm_campaign=interesados` (o `expirados`) `&utm_content=plantilla-…`.
- La pieza se nombra por lo que es: `afiche-general`, `carrusel-fidel-cano`, `afiches-domingo`. Cada bloque ya trae su enlace completo.
- Los enlaces van siempre a la portada (`https://testigosdelamemoria.com/?…`), sin ancla para comprar o ver panelistas: la portada muestra primero a los panelistas y tiene varios botones de compra. Solo `#agenda` o `#hospedaje` al final cuando el enlace es de eso (decisión del titular, 2026-10-26). Nunca a `/programacion`: es una redirección vieja que muestra un aviso y pierde los UTM.

No se pueden poner botones: en WhatsApp solo existen en los mensajes enviados por la API (las plantillas de IN y EX). Lo que se publica a mano, desde el celular o desde WhatsApp Web, es texto, imagen y enlaces.

Las plantillas de IN y EX no necesitan el enlace del agente: la persona responde en el mismo chat, y el botón "Ver boletas" lleva a la página.

## Cómo se escribe cada mensaje

Correcciones del 22 de octubre, para esta campaña y las que vengan:

1. **Primero lo que antoja:** el periodista y el tema, abiertos con un dato, una pregunta con intriga o una noticia. El saludo y el contexto pueden ir antes, pero nunca el precio ni la logística. Excepción: en las campañas de fecha límite (CD) la urgencia va en la primera línea.
2. **El día y la hora solo cuando el mensaje es sobre una conversación en particular.** Un mensaje que mezcla varios periodistas y varios días no ayuda a decidir: la gente no lee la información así.
3. **Un mensaje, una idea.** Si son varias conversaciones, mejor varios mensajes.
4. **Lo que puede alejar va al final:** el precio, la logística y el cupo.
5. **Para elegir entre varias, los temas y no el horario:** "Yolanda Ruiz y María Elvira Samper sobre las mujeres periodistas y el conflicto", no "el domingo en la mañana". La agenda completa queda en el botón o en el enlace.

## Reglas para todos los textos

- **Daniel Samper Pizano va de primero cuando se lista a los invitados** (decisión del titular, 2026-10-26). Lo que le molestó fue que su cara fuera el centro de anuncios pagos; en WhatsApp, nombrarlo entre los panelistas no es problema, y no se trata de esconder su participación. Lo que sigue sin hacerse es una pieza centrada en él, como el afiche del Bogotazo.
- **León Valencia no se usa como gancho** (el público responde mal). Su nombre puede aparecer en el programa, pero ninguna pieza ni mensaje se apoya en él. Por eso no se usa el afiche de Guerrillas.
- **Priorizar a los de más alto perfil:** Yolanda Ruiz, María Elvira Samper, Fidel Cano, Cecilia Orozco, Luz María Sierra, Martha Soto y Marta Ruiz.
- **Variar la apertura** (titular, 2026-10-26): un dato del panelista, una pregunta con intriga sobre lo que no se vio ("¿Qué pasó de verdad en las mesas del Caguán y de La Habana?") o una noticia ("hoy es el último día…"). "¿Te imaginas…?" puede aparecer alguna vez, pero ya no es la apertura por defecto. Si van varios mensajes a la misma persona, cada uno abre distinto.
- **Una conversación por mensaje** y **nunca una muerte con nombre propio como gancho**: los magnicidios se tratan como fenómeno.
- **Hospedaje sin nombrar un hotel** (titular, 2026-10-26), con una de estas frases, alternándolas: "¿Ya sabes dónde quedarte? Tenemos varios hoteles aliados con descuentos especiales para asistentes." · "Si todavía no sabes dónde quedarte, tenemos…" · "Para que no tengas que preocuparte por el hospedaje, tenemos…" · "Si vienes de fuera, tenemos…". Los hoteles y sus descuentos están en la página (`#hospedaje`).
- **El pase de fin de semana con su descuento por tiempo limitado** en los mensajes de venta.
- **El aforo, sin número** (titular, 2026-10-26): "El aforo es limitado" o "todavía hay cupo". Ni el número de sillas, ni "últimos cupos", ni contadores.
- **Compra antes que contacto** (titular, 2026-10-26): en los textos con dos enlaces va primero "Boletas en la página:" con el enlace de compra, y al final "¿Dudas? Escríbannos:" con el del agente.
- **Nombres públicos:** "boletas de medio día" (nunca "franjas") y "charlas abiertas" (las gratuitas del 5 y 6 en la Casa Museo).
- **Horario de la Ley 2300:** lunes a viernes de 7:00 a.m. a 7:00 p.m. y sábados de 8:00 a.m. a 3:00 p.m.; nunca domingos ni festivos. El lunes 2 de noviembre es festivo. El calendario ya lo respeta.

## Pendientes

- [ ] **Videos** (historia, Casa Boutique y, cuando exista, Relato): el calendario no depende de ellos. Cuando lleguen, cada uno entra en lugar de la siguiente publicación que todavía no haya salido, en GV y en LF, con el mismo número (por ejemplo, `GV3.mp4` en vez de `GV3.png`). Son lo más efectivo que tenemos, así que van apenas estén.
- [ ] **Pase de fin de semana:** en GV ya está (`GV8`, antes del jueves 29 de octubre, mientras está a $240.000). Falta en LF.
- [ ] **Plantillas IN y EX:** son los textos de los mensajes de WhatsApp que se envían por la API a interesados y expirados. Meta tiene que aprobarlos antes de enviarlos; se crean en WhatsApp Manager, en la cuenta del número colombiano (ver cada carpeta). GV y LF no las necesitan.
