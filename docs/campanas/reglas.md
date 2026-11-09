# Guías de las campañas

Cómo se escribe y cómo se manda un mensaje, por correo o por WhatsApp. Son guías, no leyes: en Testigos de la Memoria 2026 rompimos varias por correr en la recta final, y a veces toca. Se rompen con sentido común y sabiendo por qué. Lo que sí no se negocia es lo legal (la primera sección).

## Lo legal

- **Horario de la Ley 2300**, hora de Bogotá: lunes a viernes de 7:00 a.m. a 7:00 p.m. y sábados de 8:00 a.m. a 3:00 p.m.; nunca domingos ni festivos. `campana.py` se niega a enviar fuera de horario; respond.io y lo que se publica a mano no lo controlan, así que se programa dentro del horario.
- **Quién escribe y cómo darse de baja:** cada mensaje identifica a Eventalist S.A.S. y dice cómo darse de baja ("responde BAJA"). Quien la pida no vuelve a recibir nada por ningún canal: se marca en el admin del backend (**Opt out of email**, **Opt out of WhatsApp** o **Mark as do-not-contact**) y, en respond.io, con la casilla **Baja**.
- **Sin dirección física ni datos personales del titular.** Solo Eventalist S.A.S. y hola@eventalist.co.
- **Solo a quien autorizó ese canal.** Lo dice el backend; `campana.py` lo pregunta solo.

## Cuántos mensajes

- **Una comunicación por canal a cada persona, y un par de días entre un intento y el siguiente.** Varios WhatsApp de venta seguidos desde el mismo número traen bloqueos, bajan la calidad del número y Meta deja de entregar las plantillas. En 2026 llegamos a uno diario por persona porque empezamos tarde; la idea es empezar con mucho más tiempo para no tener que hacerlo.
- **Cuándo se rompe:** los avisos de servicio a quien ya compró (horario de puertas, un cambio) y, si hace falta, los últimos días antes de un cierre o del evento. Que sea una decisión, no la costumbre.
- **A quien compró no se le escriben campañas de venta.**
- Un mismo mensaje no se repite.

Cómo se arma el día para que las campañas no se pisen: [`checklist-diario.md`](checklist-diario.md).

## Qué vende

Lo de siempre, y simple ([`ejemplos.md`](ejemplos.md)):

- **Las caras, claras.** El afiche con los periodistas fue la pieza que más vendió en todos los canales. Primero los más conocidos.
- **La urgencia de verdad:** "últimos días", "este fin de semana", "hoy es el último día del precio". La fecha, no el tono: sin "últimos cupos", sin contadores ni mayúsculas.
- **Una noticia** (llega una invitada nueva) abre mejor que una pregunta.
- **El precio de hoy y el enlace para comprar**, claros y al final. Nunca el precio anterior ni tachado.
- **Termina en algo fácil de responder:** "¿Te ayudamos a escoger?".

Las piezas de una sola charla, con la pregunta que antoja ("¿Cómo se investiga a los narcos cuando ellos saben quién eres?"), son buenas para redes y para quien ya conoce el evento, pero casi no vendieron por mensaje. A una audiencia amplia, el evento completo.

## Cómo se escribe

- **Nombres públicos:** "boletas de medio día" (nunca "franjas") y "charlas abiertas" (nunca "talleres").
- **Panelistas** con la grafía de la fuente (`src/data/speakers.ts`). Nadie que ya no participe, y ningún gancho que incomode (en 2026, León Valencia nunca fue el gancho).
- **Nunca una muerte con nombre propio como gancho.** Los magnicidios, como patrón de la historia del país.
- **El aforo, sin número:** "el aforo es limitado" o "todavía hay cupo".
- **Hospedaje sin nombrar un hotel:** "Si vienes de fuera, tenemos hoteles aliados con descuentos para asistentes." Los hoteles están en la página (`#hospedaje`).
- **Enlaces:** siempre con `https://` (en Colombia el sitio no responde por http) y a la portada, con UTM de `docs/medicion/embudo/enlaces-y-nombres.md` (la campaña es la iniciativa y el contenido es la pieza). Sin `#boletas` ni `#speakers`; nunca a `/programacion`, que redirige y pierde los UTM. También los enlaces que da el chatbot y los de soporte.
- **Formato:** sin " — ", sin mayúsculas gritadas, sin signos de exclamación y sin tablas.
- **Antes de mandarlo:** `npm run verificar`, que coteja precios, nombres y enlaces con la fuente.

## Correo

Salen con `campana.py` y Resend (100 al día en el plan gratis). Las plantillas están en `scripts/campanas/plantillas/`, y los precios van como variables (`{{precio_fin_de_semana}}`), nunca escritos a mano.

- **Cuando hay algo que vender, con precio y botón.** Los correos que vendieron fueron así: el aviso a interesados y el de fecha límite. Los conversacionales, sin precio ni botón, no vendieron, y aun así caían en Promociones (la causa más probable es el dominio nuevo, no el texto).
- Asunto claro, que diga lo que hay ("Quedan 2 días con los precios de la etapa 2").
- Remitente con nombre de persona (`Juan de Testigos de la Memoria <direccion@testigosdelamemoria.com>`); las respuestas llegan a manager@eventalist.co. Una pregunta para responder al final.

## WhatsApp

Todo sale del número colombiano (+57 323 923 6021), donde atiende Catalina, el agente de respond.io. Tres formas de mandar:

- **Broadcast de respond.io:** una plantilla aprobada por Meta, a un grupo de contactos filtrado por Lifecycle, etiquetas o campos.
- **Por la API de Meta con `campana.py`:** una plantilla aprobada, número por número, con la lista que arma el comando. Pide las llaves de `configuracion.md`.
- **A mano** (grupos, listas de aliados): imagen, texto y enlaces pegados desde el celular. Dos enlaces: primero "Boletas en la página:" y al final "¿Dudas? Escríbannos:" con el del agente, que trae un mensaje ya escrito para que Catalina sepa de dónde viene la persona.

A quien no nos ha escrito en las últimas 24 horas solo se le puede mandar una plantilla aprobada. Si responde, la conversación se abre y la toma Catalina.

### Qué lleva cada plantilla de Meta

Se crean en WhatsApp Manager, en la cuenta del número colombiano, **al menos un día antes**; respond.io las trae solas cuando Meta las aprueba.

- **Nombre:** minúsculas y guion bajo (`pase_finde_05_11_2026`). Una plantilla aprobada no se edita: si cambia un dato, se crea otra.
- **Categoría:** Marketing si invita a comprar; Utilidad solo para avisos de servicio.
- **Idioma:** español (`es`).
- **Encabezado:** la imagen con las caras vende, pero Meta a veces la aprueba y a veces no, y en respond.io hay que volver a subirla en cada broadcast. Se manda con tiempo y con una versión sin imagen de respaldo. El mensaje tiene que entenderse sin la imagen.
- **Cuerpo:** máximo 1.024 caracteres; no puede empezar ni terminar con una variable.
- **Variables:** el nombre solo donde tiene que sonar personal (un pedido vencido, una carta firmada). Lo demás, sin variables.
- **Pie:** máximo 60 caracteres (`Eventalist S.A.S. · Responde BAJA para no recibir más`).
- **Botones:** de enlace (URL con UTM) y de respuesta rápida, que abre la conversación con Catalina. Máximo 25 caracteres por botón.

### Cómo se manda un broadcast en respond.io

1. Antes, importar los compradores del día (`campana.py respondio compradores`) para que quien compró quede como Customer.
2. Broadcasts → nuevo broadcast → canal WhatsApp del número colombiano → la plantilla.
3. Audiencia: la de la campaña, siempre con la casilla **Baja** sin marcar y Lifecycle distinto de **Customer**.
4. Programarlo dentro del horario, mejor entre 9:00 y 11:00 a.m.

### Piezas

Las imágenes no se suben al repo (`.gitignore`), salvo las de [`ejemplos/`](ejemplos/). Cada pieza se nombra por lo que es, igual que su `utm_content` (`afiche-caras_ultimos-dias`).
