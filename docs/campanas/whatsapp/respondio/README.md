# respond.io · Broadcasts

respond.io es la plataforma donde vive Catalina, el agente del número colombiano (+57 323 923 6021) y de Instagram. Desde ahí se mandan los **broadcasts**: un mismo mensaje a un grupo de contactos, filtrados por su Lifecycle, sus etiquetas o sus campos.

Un broadcast siempre es una **plantilla aprobada por Meta**: a quien no nos ha escrito en las últimas 24 horas no se le puede mandar texto libre. Por eso cada broadcast de este documento es una plantilla, y cada plantilla tiene su ficha con todo lo que hay que llenar.

## Los broadcasts

- [`inactivos/`](inactivos/) · **RC** · conversaciones que se cerraron por inactividad sin compra. Una plantilla por día hasta el evento.
- [`../cierre-descuento/`](../cierre-descuento/) · **CD** · los tres últimos días de la etapa 2 (27 al 29 de octubre), a todos los contactos sin compra.

Lo que toca cada día, de todas las campañas, está en [`../../dia-a-dia.md`](../../dia-a-dia.md).

## Qué lleva cada plantilla

Se crean en WhatsApp Manager, en la cuenta del número colombiano. respond.io las trae solas cuando Meta las aprueba. Cada ficha dice, en este orden:

- **Nombre:** minúsculas y guion bajo, con la sigla y el número del broadcast (`cd1_quedan_dos_dias`). Una plantilla aprobada no se puede editar: si cambia un dato, se crea otra con `_v2` al final.
- **Categoría:** Marketing. Todo lo que invita a comprar es Marketing; si se marca Utilidad, Meta la cambia o la rechaza.
- **Idioma:** español (`es`).
- **Encabezado:** opcional. Si la ficha nombra una pieza, se elige Imagen y se sube. Esa imagen es solo una muestra para Meta: **en respond.io hay que volver a subirla al armar el broadcast**, o el mensaje sale sin imagen o no sale.
- **Cuerpo:** el bloque de texto, exacto. Máximo 1.024 caracteres.
- **Variable `{{1}}`:** el nombre del contacto. Meta pide un ejemplo (`Ana`); en respond.io se llena con First Name. El cuerpo no puede empezar ni terminar con una variable.
- **Pie:** máximo 60 caracteres.
- **Botones:** de respuesta rápida (abre la conversación con Catalina) y de enlace (URL estática, con los UTM de la ficha). Máximo 25 caracteres por texto de botón.

## Cómo se manda un broadcast

1. Broadcasts → nuevo broadcast → canal WhatsApp del número colombiano → la plantilla.
2. Si tiene encabezado de imagen, subir la pieza. En `{{1}}`, First Name.
3. Audiencia: la que diga la ficha. Siempre con la casilla **Baja** sin marcar y Lifecycle distinto de **Customer**.
4. Programarlo dentro del horario de la Ley 2300, mejor entre 9:00 y 11:00 a.m.

Si la persona responde, la conversación se abre otra vez y la toma Catalina.

## Reglas para escribir las plantillas

Vigentes al 27 de octubre de 2026. Son las mismas de todo WhatsApp (`../README.md`).

- **Horario de la Ley 2300:** lunes a viernes de 7:00 a.m. a 7:00 p.m. y sábados de 8:00 a.m. a 3:00 p.m.; nunca domingos ni festivos (el lunes 2 de noviembre es festivo). respond.io no lo controla: se programa a mano.
- **Eventalist S.A.S. siempre aparece**, en el cuerpo o en el pie, y la plantilla dice cómo darse de baja ("responde BAJA"). Nunca una dirección ni datos personales.
- **Una conversación por plantilla.** Un periodista o una pareja, un tema. Si se nombra a varios, es para hablar del recorrido completo.
- **La apertura cambia en cada plantilla:** un dato del periodista, una pregunta con intriga sobre lo que no se vio ("¿Qué pasó de verdad en las mesas del Caguán y de La Habana?") o una noticia ("Hoy es el último día…"). "¿Te imaginas…?" ya no es la apertura por defecto: cansa cuando todas lo usan.
- **Nunca una muerte con nombre propio como gancho.** Los magnicidios se tratan como fenómeno de la historia del país.
- **Primero lo que antoja, al final el precio.** El día y la hora solo cuando la plantilla es de una conversación. Excepción: en las campañas de fecha límite (CD) la urgencia va en la primera línea.
- **Panelistas:** con la grafía de `src/data/speakers.ts`. Daniel Samper Pizano de primero cuando se lista a los invitados, pero ninguna pieza centrada en él. León Valencia nunca como gancho. Ricardo Ospina ya no participa.
- **Aforo sin número:** "el aforo es limitado" o "todavía hay cupo". Nada de "últimos cupos" ni contadores.
- **Hospedaje sin nombrar un hotel:** "tenemos varios hoteles aliados con descuentos especiales para asistentes", con el botón a `#hospedaje`.
- **Nombres públicos:** "boletas de medio día" (nunca "franjas") y "charlas abiertas".
- **Enlaces:** siempre a la portada con `https://`, sin `#boletas` ni `#speakers` (solo `#agenda` o `#hospedaje`), con los UTM de `docs/medicion/embudo/enlaces-y-nombres.md`. RC usa `utm_campaign=recuperacion`; CD, `cierre-descuento`.
- Sin " — ", sin mayúsculas gritadas, sin signos de exclamación.

Antes de mandar una plantilla a Meta: `npm run verificar`, que revisa precios, nombres y enlaces de los textos de esta carpeta.
