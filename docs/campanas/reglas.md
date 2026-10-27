# Reglas de las campañas

Cómo se escribe y cómo se manda cualquier mensaje de cualquier campaña, por correo o por WhatsApp. Vigentes al 27 de octubre de 2026. Cada campaña puede tener una excepción, y si la tiene la dice su README.

## Para todos los mensajes

- **Horario de la Ley 2300**, hora de Bogotá: lunes a viernes de 7:00 a.m. a 7:00 p.m. y sábados de 8:00 a.m. a 3:00 p.m.; nunca domingos ni festivos. El lunes 2 de noviembre de 2026 es festivo. `campana.py` se niega a enviar fuera de horario; respond.io y lo que se publica a mano no lo controlan, así que se programa dentro del horario.
- **Quién escribe y cómo darse de baja:** cada mensaje identifica a Eventalist S.A.S. y dice cómo darse de baja ("responde BAJA"). Quien la pida no vuelve a recibir nada por ningún canal: se marca en el admin del backend (**Opt out of email**, **Opt out of WhatsApp** o **Mark as do-not-contact**) y, en respond.io, con la casilla **Baja**.
- **Sin dirección física ni datos personales del titular.** Solo Eventalist S.A.S. y hola@eventalist.co.
- **Sin límite de mensajes por persona** (titular, 2026-10-19), **pero un solo WhatsApp por persona al día** (titular, 2026-10-27): todos salen del mismo número, y varios mensajes de venta apilados en un chat traen bloqueos, bajan la calidad del número y Meta puede dejar de entregar las plantillas de marketing. Si dos campañas caen el mismo día, gana la de fecha límite (CD), después EX y después RC. Los interesados son la excepción: un recordatorio más a quien pidió información sí va. El correo va aparte. Un mismo mensaje no se repite, y la insistencia es en la frecuencia, no en el tono.
- **Nombres públicos:** "boletas de medio día" (nunca "franjas") y "charlas abiertas" (las gratuitas del 5 y 6 en la Casa Museo, nunca "talleres").
- **Panelistas** con la grafía de `src/data/speakers.ts`.
  - Daniel Samper Pizano va de primero cuando se lista a los invitados, pero ninguna pieza ni anuncio pago se centra en él (como el afiche del Bogotazo).
  - León Valencia nunca es el gancho: su nombre puede estar en el programa, pero ningún mensaje se apoya en él. Por eso no se usa el afiche de Guerrillas.
  - Ricardo Ospina ya no participa. Las piezas que lo tienen no se usan, y eso incluye el afiche general con todas las caras.
  - Se prioriza a los de más alto perfil: Yolanda Ruiz, María Elvira Samper, Fidel Cano, Cecilia Orozco, Luz María Sierra, Martha Soto y Marta Ruiz.
- **El aforo, sin número:** "el aforo es limitado" o "todavía hay cupo". Ni el número de sillas, ni "últimos cupos", ni contadores.
- **Hospedaje sin nombrar un hotel**, alternando estas frases: "¿Ya sabes dónde quedarte? Tenemos varios hoteles aliados con descuentos especiales para asistentes." · "Si todavía no sabes dónde quedarte, tenemos…" · "Para que no tengas que preocuparte por el hospedaje, tenemos…" · "Si vienes de fuera, tenemos…". Los hoteles están en la página (`#hospedaje`).
- **Enlaces:** siempre con `https://` (en Colombia el sitio no responde por http) y a la portada, sin `#boletas` ni `#speakers` (solo `#agenda` o `#hospedaje` si el enlace es de eso). Nunca a `/programacion`, que redirige y pierde los UTM. Los UTM salen de `docs/medicion/embudo/enlaces-y-nombres.md`: la campaña es la iniciativa y el contenido es la pieza. Una campaña nueva se anota allá el mismo día.
- **Formato:** sin " — ", sin mayúsculas gritadas, sin signos de exclamación y sin tablas.
- **Antes de mandarlo:** `npm run verificar`, que coteja precios, nombres y enlaces con la fuente.

## Cómo se escribe

Correcciones del titular del 22, el 26 y el 27 de octubre.

**Primero, a quién va** (titular, 2026-10-27):

- **Promoción o audiencia amplia** (fecha límite, descuento, broadcast a todos, anuncios, correos masivos): primero la oportunidad y después el evento completo, con los nombres más famosos (Daniel Samper Pizano de primero) y todos los temas. Puede llegarle a gente nueva, que no conoce el encuentro, y una sola charla no le alcanza para entender por qué ir.
- **Público caliente** (inactivos, interesados, expirados, grupos donde ya se presentó el evento): una charla o un periodista por pieza, con las reglas de abajo.

1. **Primero lo que antoja:** el periodista y el tema. El saludo y el contexto pueden ir antes, pero nunca el precio ni la logística.
2. **La apertura cambia en cada mensaje:** un dato del periodista, una pregunta con intriga sobre lo que no se vio ("¿Qué pasó de verdad en las mesas del Caguán y de La Habana?") o una noticia ("hoy es el último día…"). "¿Te imaginas…?" puede aparecer alguna vez, pero ya no es la apertura por defecto: cansa cuando todos los mensajes lo usan. Si van varios mensajes a la misma persona, cada uno abre distinto.
3. **Una conversación por mensaje:** un periodista o una pareja, un tema. Si se nombra a varios, es para hablar del recorrido completo. Para elegir entre varias conversaciones se dan los temas, no los horarios.
4. **Nunca una muerte con nombre propio como gancho.** Los magnicidios se tratan como fenómeno de la historia del país ("por doloroso que sea, es un patrón que hay que entender").
5. **El día y la hora, solo cuando el mensaje es de una conversación.**
6. **Al final, lo que puede alejar:** el precio, la logística y el cupo. El pase de fin de semana va con su descuento "por tiempo limitado".
7. **Termina en algo fácil de responder:** una pregunta ("¿Te ayudamos a escoger?").

Excepción: en las campañas de fecha límite (`cierre-descuento`) la urgencia va en la primera línea y en la imagen.

## Correo

Los correos salen con `campana.py` y Resend (100 al día en el plan gratis). Las plantillas están en `scripts/campanas/plantillas/`, y los precios van como variables (`{{precio_fin_de_semana}}`), nunca escritos a mano.

Desde el 26 de octubre los correos se escriben como un correo personal, para que Gmail los lea como conversación y no como promoción:

- Sin precios, descuentos, fechas límite ni las palabras "boletas", "venta" o "tienda". El correo antoja con el contenido y lo comercial queda en la página.
- Sin más imagen que el logo sobre terracota, sin botones y con un solo enlace dentro del texto, con UTM.
- Asunto neutro, sin palabras de oferta. Remitente con nombre de persona (`Juan de Testigos de la Memoria <direccion@testigosdelamemoria.com>`), y las respuestas llegan a manager@eventalist.co.
- Una pregunta para responder y la firma de Juan.

Aun así, con todo esto los correos siguieron cayendo en Promociones; la causa más probable es el dominio nuevo y no el texto. **Excepción:** `cierre-descuento` va con diseño, precios y botón, porque una fecha límite no se puede esconder.

## WhatsApp

Todo sale del número colombiano (+57 323 923 6021), donde atiende Catalina, el agente de respond.io. Hay tres formas de mandar:

- **Broadcast de respond.io** (`inactivos`, `cierre-descuento`): una plantilla aprobada por Meta, a un grupo de contactos de respond.io filtrado por Lifecycle, etiquetas o campos. Se arma a mano en respond.io.
- **Por la API de Meta con `campana.py`** (`interesados`, `expirados`): una plantilla aprobada, número por número, con las listas que arma el comando. Pide las llaves de `configuracion.md`.
- **A mano** (`grupos-villa`, `lista-fernando`): texto, imagen y enlaces pegados desde el celular. No existen los botones. Lleva dos enlaces: primero "Boletas en la página:" con el de compra, y al final "¿Dudas? Escríbannos:" con el del agente, que trae un mensaje ya escrito para que Catalina sepa de dónde viene la persona.

A quien no nos ha escrito en las últimas 24 horas solo se le puede mandar una plantilla aprobada. Si la persona responde, la conversación se abre y la toma Catalina.

### Qué lleva cada plantilla de Meta

Se crean en WhatsApp Manager, en la cuenta del número colombiano, al menos un día antes del envío. respond.io las trae solas cuando Meta las aprueba. Cada ficha de plantilla dice, en este orden:

- **Nombre:** minúsculas y guion bajo, con la sigla y el número (`cd1_quedan_dos_dias`). Una plantilla aprobada no se puede editar: si cambia un dato, se crea otra con `_v2`.
- **Categoría:** Marketing. Todo lo que invita a comprar es Marketing; si se marca Utilidad, Meta la cambia o la rechaza.
- **Idioma:** español (`es`).
- **Encabezado:** opcional. Si la ficha nombra una pieza, se elige Imagen y se sube. Esa imagen es solo una muestra para Meta: **al mandar el broadcast en respond.io hay que volver a subirla**, o el mensaje sale sin imagen o no sale.
- **Cuerpo:** el bloque de texto, exacto, de máximo 1.024 caracteres. No puede empezar ni terminar con una variable.
- **Variables:** `{{1}}` suele ser el nombre. Meta pide un ejemplo (`Ana`); en respond.io se llena con First Name y en `campana.py` con la columna que diga la configuración.
- **Pie:** máximo 60 caracteres.
- **Botones:** de respuesta rápida (abre la conversación con Catalina) y de enlace (URL estática con los UTM de la ficha). Máximo 25 caracteres por texto de botón.

### Cómo se manda un broadcast en respond.io

1. Broadcasts → nuevo broadcast → canal WhatsApp del número colombiano → la plantilla.
2. Si tiene encabezado de imagen, subir la pieza. En `{{1}}`, First Name.
3. Audiencia: la que diga la campaña, siempre con la casilla **Baja** sin marcar y Lifecycle distinto de **Customer**. Antes, importar los compradores del día (`campana.py respondio compradores`) para que quien compró ayer quede como Customer.
4. Programarlo dentro del horario, mejor entre 9:00 y 11:00 a.m.

### Nombres y piezas

- Cada mensaje lleva la sigla de su campaña y un número (`GV1`, `LF2`, `RC3`, `CD1`), y la plantilla de Meta empieza igual (`rc3_…`, `cd1_…`).
- Las piezas están en `piezas/`, dentro del canal de cada campaña, con el mismo nombre (`GV3.png`). Si un mensaje lleva varias, van numeradas en el orden de envío (`LF2-1.png`, `LF2-2.png`). Si llega un video, entra con el mismo número (`GV3.mp4`).
- Las piezas no se suben al repo (`.gitignore`). Los originales están en Descargas, en `Charlas_Afiches` y `Periodistas_Publicaciones`.
