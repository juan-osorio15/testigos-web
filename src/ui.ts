/**
 * Diccionario de UI. Todo microcopy visible vive aquí — una sola fuente
 * para textos repetidos. El sitio es en español (spec · Clarifications
 * 2026-08-25: el evento es íntegramente en español); la tabla `en` solo
 * alimenta la portada /en/ (src/i18n.ts) y TypeScript exige que tenga
 * exactamente las mismas claves que `es`.
 *
 * Los hechos no se escriben aquí: fechas, sedes y conteos van como
 * {variable} y `t` los llena con src/data/ (`facts`, abajo). Las variables
 * que no son hechos ({n}, {date}) las reemplaza quien llama.
 */
import { langOf, localeOf, type Lang } from './i18n';
import { agenda } from './data/agenda';
import { event, venues } from './data/event';
import { speakers } from './data/speakers';

const es = {
  // --- Compra: un solo texto para todos los botones de compra, que llevan
  //     a #boletas (2026-10-17: nada de variantes creativas). ---
  'cta.buy': 'Comprar boletas',

  // --- Navegación ---
  /* Etiquetas estándar (2026-10-15): las preguntas de la prueba del
     2026-09-09 interrumpían; la gente busca las palabras de siempre. */
  'nav.opportunity': 'El encuentro',
  'nav.speakers': 'Panelistas',
  'nav.schedule': 'Programación',
  'nav.venue': 'Lugar',
  'nav.faq': 'Preguntas',
  'nav.lodging': 'Hospedaje',
  'nav.contact': 'Contáctanos',
  'nav.aria': 'Navegación principal',
  'nav.menu': 'Menú',
  'nav.close': 'Cerrar menú',

  // --- Hero ---
  'hero.tagline': 'Periodistas en la Historia',
  'hero.dates': '{fechas}',
  'hero.place': 'Villa de Leyva, Colombia',
  /* Línea de datos bajo el remate: edición, formato y escasez, separados por "·" */
  'hero.tileCta': 'Ver ficha',
  /* El lugar va dentro de la frase (2026-09-19): sin la foto de la casa en
     el hero, nada decía Villa de Leyva antes de las boletas */
  'hero.speakersAll': 'Ver todos',
  'hero.pitch': 'Cuatro días en Villa de Leyva con los reporteros que estuvieron ahí: se sientan a contar lo que vieron y a responder preguntas.',
  'hero.edition': 'Primera edición',
  'hero.format': 'Charlas abiertas y conversatorios',
  'hero.capacity': 'Aforo limitado',
  /* Contador en vivo: unidad en singular y plural */
  'hero.unitDay': 'día',
  'hero.unitDays': 'días',
  'hero.unitHour': 'hora',
  'hero.unitHours': 'horas',
  'hero.unitMinute': 'minuto',
  'hero.unitMinutes': 'minutos',
  'hero.unitSecond': 'segundo',
  'hero.unitSeconds': 'segundos',
  'hero.countdownAria': 'Tiempo que falta para el encuentro',
  'hero.countdownToday': 'Hoy empieza el encuentro',
  'hero.countdownLive': 'El encuentro está en curso',
  /* Slogan aprobado (spec §2), una línea por salto; el nombre va en el h1 */
  'hero.slogan': 'La historia reciente\nde Colombia, contada\npor quienes\nla viven de frente.',
  'hero.month': '{mes}',

  // --- El encuentro en tres datos (KeyFacts) ---
  'keyfacts.aria': 'El encuentro en tres datos',
  'keyfacts.days': 'días',
  'keyfacts.daysDetail': '{fechasConDia}, en Villa de Leyva.',
  'keyfacts.speakers': 'periodistas',
  'keyfacts.speakersDetail': 'Los que cuentan la historia reciente del país, en persona y con derecho a preguntas.',
  'keyfacts.formats': 'formatos',
  'keyfacts.formatsDetail':
    'Charlas abiertas de entrada libre en la {sedeCharlas} y conversatorios con boleta en la {sedeConversatorios}.',

  // --- Sección de compra ---
  /* Junto a la tienda: explicar sin adornos las formas de comprar */
  'tickets.heading': 'Boletas',
  'tickets.title': 'Hay tres formas de comprar.',
  'tickets.passName': 'Pase completo',
  /* "Medio día" en vez de "franja" (2026-09-18): la palabra franja no se
     entendía; una mañana o una tarde sí. */
  'tickets.passText':
    'Los {conversatorios} conversatorios, del viernes en la tarde al domingo en la mañana, en una sola boleta.',
  /* Pase de fin de semana (2026-10-22): para quien quería el pase completo
     y no puede faltar al trabajo el viernes */
  'tickets.weekendName': 'Pase de fin de semana',
  'tickets.weekendText':
    'Los seis conversatorios del sábado y el domingo, en una sola boleta. Para quienes solo pueden venir el fin de semana y no se quieren perder de nada.',
  'tickets.was': 'Antes',
  'tickets.slotName': 'Boleta de medio día',
  'tickets.slotText':
    'Una mañana o una tarde, con sus dos o tres conversatorios: viernes en la tarde, sábado en la mañana, sábado en la tarde o domingo en la mañana. Compra solo las que quieras.',
  /* Etapas de venta (2026-09-15): en la etapa 1 solo el pase completo.
     El widget muestra las franjas con "Aún no disponible"; las fechas las
     cuenta el bloque de etapas (SalesStages). */
  'tickets.slotSoon': 'Todavía no está a la venta.',
  /* Bloque de etapas: tres planos que se tocan, cielo el vigente y crema
     los demás (fórmula visual §6: los datos van en franja). Desde el
     2026-10-22: la etapa 1 sin contar qué se vendió ni con qué cifra; la 3,
     todo a la venta con menos descuento. La 2 (corregida el 2026-10-27):
     desde el 13 de octubre se vende todo, no solo el pase de fin de semana,
     que llegó el 22. */
  'stages.heading': 'Calendario de venta',
  'stages.stage1': 'Etapa 1',
  'stages.stage2': 'Etapa 2',
  'stages.stage3': 'Etapa 3',
  'stages.now': 'En curso',
  'stages.closed': 'Cerrada',
  'stages.until': 'Hasta el',
  'stages.from': 'Desde el',
  'stages.stage1Product': 'Pase completo',
  'stages.stage2Product': 'Todas las boletas',
  'stages.stage3Product': 'Todas las boletas',
  'stages.stage1Note': 'Abrió la venta con su mayor descuento.',
  'stages.stage2Note': 'Llegan las boletas de medio día y el pase de fin de semana.',
  'stages.stage3Note': 'Todo sigue a la venta, con menos descuento.',
  'stages.daysLeft': 'Quedan {n} días con el precio de la etapa 2',
  'stages.lastDay': 'Último día con el precio de la etapa 2',
  'tickets.stagePrice': 'Precio de la etapa 2, hasta el {date}.',
  'tickets.notify': 'Avísame cuando abra',
  /* Modal "avísame" de las franjas; la franja escogida va como eyebrow */
  'notify.title': 'Te avisamos cuando salga a la venta',
  'notify.intro':
    'Déjanos tus datos y te escribimos en cuanto esté a la venta.',
  'notify.submit': 'Avisarme',
  'notify.success': 'Listo. Te escribiremos en cuanto salga a la venta.',
  'notify.close': 'Cerrar',
  'tickets.soon':
    'La venta de boletas abre pronto. Aforo limitado. Las charlas abiertas son de entrada libre.',
  'tickets.widgetFallback':
    'Si el módulo de compra no carga, puedes comprar directamente en la tienda segura de Pretix:',
  'tickets.widgetLink': 'Comprar en Pretix',
  /* Bajo la tienda (2026-10-27). La tarifa de Wompi es 3,1535 % + 833 pesos
     (IVA incluido); el titular pidió solo el porcentaje, redondeado. */
  'tickets.pay':
    'Pagas con Wompi: tarjeta, Nequi, Daviplata o PSE (elige Transferencia y luego tu banco). Tarifa de pago: 3,3 %.',
  /* Aviso del widget de Pretix para lo que aún no se vende (texto fijo del
     propio widget en cada idioma); el script lo reemplaza por "avísame" */
  'tickets.notYet': 'Aún no disponible',
  'waitlist.name': 'Nombre',
  'waitlist.email': 'Correo electrónico',
  'waitlist.phone': 'Teléfono',
  'waitlist.submit': 'Avisarme cuando abra la venta',
  /* Casilla de autorización, corta como es habitual en sitios colombianos:
     quién, para qué, por qué canales (Ley 2300) y enlace a la política, que
     detalla datos, derechos y cómo revocar (Ley 1581 y Decreto 1377). */
  'waitlist.consent':
    'Soy mayor de edad y autorizo a Eventalist a tratar mis datos para enviarme información del encuentro y de otros eventos por correo electrónico y WhatsApp, según la',
  'waitlist.consentLink': 'política de tratamiento de datos',
  'waitlist.privacy': 'Los datos no se comparten ni se venden a terceros.',
  'waitlist.noscript': 'Para registrarte necesitas activar JavaScript en tu navegador.',
  'waitlist.sending': 'Enviando…',
  'waitlist.success': 'Listo. Te escribiremos en cuanto abra la venta.',
  'waitlist.error': 'No pudimos guardar tus datos. Inténtalo de nuevo más tarde.',
  'waitlist.errorNetwork': 'No pudimos guardar tus datos. Revisa tu conexión e inténtalo de nuevo.',
  'waitlist.errorTooMany': 'Demasiados intentos. Inténtalo de nuevo en un rato.',
  'waitlist.errorConsent': 'Necesitamos tu autorización para guardar tus datos.',
  'waitlist.fieldEmail': 'Correo electrónico',
  'waitlist.fieldPhone': 'Teléfono',
  'waitlist.fieldName': 'Nombre',
  'waitlist.fieldConsent': 'Autorización',

  // --- Agenda ---
  'schedule.free': 'Entrada libre',
  'schedule.heading': 'Cuatro días en Villa de Leyva',

  // --- Speakers ---
  'speakers.prev': 'Panelista anterior',
  'speakers.next': 'Panelista siguiente',
  'speakers.links': 'Redes y enlaces de',
  'speakers.more': 'Leer más',
  'speakers.less': 'Leer menos',
  /* Subtítulo del banco aprobado (spec §2) y remate de urgencia del carrusel */
  'speakers.subtitle': '¿Qué pasa cuando quienes contaron la historia vuelven a contarla?',
  'speakers.lead':
    'Esta vez no los vas a leer: vas a escucharlos hablar de lo que vieron, lo que no pudieron contar y lo que hoy entienden de otra manera.',
  'speakers.ctaLead': 'Aforo limitado.',
  'speakers.ctaNote': 'Los conversatorios más esperados se agotan primero.',
  'speakers.viewProfile': 'ver ficha',
  /* "{name} en {red}" en el aria de los iconos de redes */
  'speakers.on': 'en',

  // --- Enlaces de panelistas ---
  'links.x': 'X',
  'links.instagram': 'Instagram',
  'links.linkedin': 'LinkedIn',
  'links.facebook': 'Facebook',
  'links.web': 'Sitio web',
  'links.wikipedia': 'Wikipedia',

  // --- Venue ---
  'venue.directions': 'Cómo llegar',
  'stay.heading': 'Hospedaje',
  'stay.intro':
    'Si vienes de Bogotá o de más lejos, no tienes que buscar hotel. Estos cuatro aliados tienen una oferta solo para asistentes: escríbeles por WhatsApp o reserva en línea con el código.',
  'stay.onlyAttendees': 'Solo para asistentes',
  'stay.askFor': 'Pregunta por',
  'stay.writeTo': 'Te atienden directamente en recepción.',
  'stay.whatsapp': 'Escribir por WhatsApp',
  'stay.call': 'Llamar',
  'stay.email': 'Escribir por correo',
  'stay.useCode': 'Reserva en línea y pon el código',
  'stay.bookOnline': 'Reservar en línea',
  'stay.note':
    'Di que vas a Testigos de la Memoria para acceder a la oferta, o usa el código en la reserva en línea. La reserva y el pago se hacen directamente con cada hotel.',
  'venue.mapTitle': 'Mapa de Google de Villa de Leyva con la {sedeConversatorios}',
  'venue.heading': 'Dos sedes, a pocas cuadras',
  'venue.intro':
    'Un encuentro sobre Colombia en un lugar que parece hecho para conversar. Después de cada sesión puedes caminar por la plaza de Villa de Leyva, sentarte a tomar algo y quedarte conversando. Las dos sedes están a unas cuadras de la Plaza Mayor.',
  'venue.logoAlt': 'Logo de',
  'venue.mapOf': 'Mapa de Google:',

  // --- "Qué es" (Opportunity) ---
  /* Igual que su enlace del menú (2026-10-15) */
  'opp.eyebrow': 'El encuentro',
  /* Pregunta del banco aprobado (spec §2) */
  'opp.heading': 'Una oportunidad de escuchar de primera mano a quienes estuvieron allí cuando la historia estaba ocurriendo.',
  'opp.lead':
    'Los hechos que marcaron al país tienen testigos de primera fila: los reporteros que los cubrieron. Durante {dias} días, algunos de los grandes nombres del periodismo colombiano se sientan a contar lo que vieron, cómo lo contaron y qué nos enseña ese pasado para lo que viene.',
  'opp.point1':
    'Lo que estaba detrás de las noticias, lo que no salió en televisión, las decisiones que tuvieron que tomar y las historias que quedaron fuera.',
  'opp.point2': 'Conversatorios cercanos, sin tarima lejana: preguntas y desacuerdos incluidos.',
  'opp.point3': 'Historia y oficio de primera mano, con nombres, fechas y medios sobre la mesa.',
  'opp.point4': 'Villa de Leyva: un pueblo que invita a quedarse conversando después de cada sesión.',
  'opp.closing': 'Es la primera edición. Nadie te lo va a contar: ¡hay que estar!',

  // --- Banda intermedia (Interlude) ---
  'interlude.alt': 'Calle empedrada de Villa de Leyva con las casas blancas y la montaña al fondo',
  /* Pregunta del banco aprobado (spec §2) */
  'interlude.quote': 'Villa de Leyva se reúne para conversar sobre el país que hemos vivido.',

  // --- Preguntas frecuentes ---
  'faq.heading': 'Preguntas frecuentes',
  'faq.closing': 'Que no te lo cuenten. Ven y sé testigo.',
  'faq.photoAlt': 'Campanario de piedra de la iglesia de Villa de Leyva',

  // --- Layout ---
  'layout.skip': 'Saltar al contenido',

  // --- Footer ---
  'footer.organizedBy': 'Organizan',
  'footer.partners': 'Aliados',
  'footer.supportedBy': 'Con el apoyo de',
  'footer.contact': 'Contacto',
  'footer.contactLink.whatsapp': 'Escríbenos por WhatsApp',
  'footer.contactLink.instagram': 'Escríbenos por Instagram',
  'tickets.bubbleTitle': '¿Tienes alguna pregunta sobre la compra?',
  'tickets.bubbleText.whatsapp': 'Te podemos ayudar por WhatsApp.',
  'tickets.bubbleText.instagram': 'Te podemos ayudar por Instagram.',
  'tickets.helpLink': '¿Dudas? Escríbenos',
  'footer.rights': 'Testigos de la Memoria · Villa de Leyva, 2026',
  /* Relación del evento con Eventalist, visible para Meta (activos comerciales, 2026-10-18) */
  'footer.producedBy': 'Testigos de la Memoria es un evento producido por',
  'footer.privacy': 'Tratamiento de datos personales',
  'footer.terms': 'Términos y condiciones',
  'footer.pagesAria': 'Páginas del sitio',

  // --- Aviso de cookies y preferencias (dictamen legal 2026-09-15) ---
  /* Panel al pie desde el 2026-10-26, en dos capas: aquí el texto estándar
     con el responsable y tres frases cortas que tranquilizan; en
     "Configurar" esas frases explicadas y los proveedores (Google y Meta),
     y el detalle en la sección 10 de la política (arts. 14 y 15 del
     Decreto 1377). */
  'consent.title': 'Usamos cookies',
  'consent.text': 'Eventalist las usa para mejorar tu experiencia en el sitio.',
  'consent.point1': 'No vendemos tus datos',
  'consent.point1Text': 'No los vendemos ni los cedemos para que otros te ofrezcan cosas.',
  'consent.point2': 'Solo para mejorar el sitio',
  'consent.point2Text': 'Vemos qué páginas sirven y de dónde llega la gente, para saber qué arreglar.',
  'consent.point3': 'Sin anuncios si ya compraste',
  'consent.point3Text': 'Si ya tienes tu boleta, dejamos de mostrarte anuncios para comprarla.',
  'consent.more': 'Política de datos',
  'consent.accept': 'Aceptar',
  'consent.configure': 'Configurar',
  /* Paso "Configurar": las dos categorías vienen activadas */
  'consent.optionsTitle': 'Configurar cookies',
  'consent.analytics': 'Analítica',
  'consent.analyticsText': 'Google Analytics. Cuenta las visitas y de dónde llegan.',
  'consent.advertising': 'Publicidad',
  'consent.advertisingText': 'Meta y Google. Evita que veas anuncios repetidos o que ya no te sirven.',
  'consent.acceptAll': 'Aceptar todas',
  'consent.save': 'Guardar',
  'consent.close': 'Cerrar el aviso',
  'consent.prefsLink': 'Cookies y preferencias',
  'consent.prefsTitle': 'Cookies y preferencias',
  'consent.prefsAccepted': 'Guardaste tus preferencias de cookies el {date}',
  'consent.prefsNone': 'No has aceptado cookies de analítica ni de publicidad en este navegador.',
  'consent.prefsId': 'Identificador de tu aceptación (para consultas o reclamos):',
  'consent.saved': 'Listo. Guardamos tus preferencias en este navegador.',
  'consent.policy': 'Leer la política de tratamiento de datos',

  // --- Migas de pan y páginas interiores ---
  'crumb.home': 'Inicio',
  'crumb.speakers': 'Panelistas',
  'crumb.talks': 'Charlas abiertas',
  'crumb.directions': 'Cómo llegar',
  'crumb.lodging': 'Dónde dormir',
  'crumb.aria': 'Ruta de navegación',

  // --- Fichas de panelistas ---
  'speaker.sessions': 'En el encuentro',
  'speaker.works': 'Obras y enlaces',
  'speaker.all': 'Todos los panelistas',
  'speaker.indexLead':
    'Los periodistas que cubrieron los últimos cincuenta años de Colombia, reunidos en Villa de Leyva del {fechas}.',
  'speaker.readProfile': 'Ver ficha',

  // --- Páginas de sesión ---
  'session.people': 'En la mesa',
  'session.guest': 'Invitado',
  'session.details': 'Cuándo y dónde',
  'session.read': 'Ver la sesión',
  'session.talk': 'Charla abierta',
  'session.panel': 'Conversatorio',

  // --- Programación ---
  'schedule.paid': 'Con boleta',
  'schedule.full': 'Ver la programación completa',
  'schedule.freeCta': 'Más información',
  'schedule.legendTalks': 'Charlas abiertas · Entrada libre',
  'schedule.legendPanels': 'Conversatorios · Con boleta',
  'schedule.venueMap': 'Ver en el mapa',
  'schedule.pricesHeading': 'Boletas',

  // --- Bloque de hechos del encuentro (texto plano en toda página interior) ---
  'facts.heading': 'El encuentro en pocas líneas',
  'facts.where': 'Villa de Leyva, Boyacá, Colombia',
  'facts.when': '{fechas}',
  'facts.talks': 'Charlas abiertas de entrada libre el jueves 5 y el viernes 6 en la mañana, en la {sedeCharlas}.',
  'facts.panels': 'Conversatorios con boleta del viernes 6 en la tarde al domingo 8, en la {sedeConversatorios}.',
  'facts.onSale': 'A la venta',
  'facts.soon': 'Desde el',
  'facts.soldOut': 'Agotado',
  'facts.closed': 'Venta cerrada',
  'facts.buy': 'Comprar boletas',

  // --- Pie: enlaces a páginas interiores ---
  'footer.speakers': 'Panelistas',
  'footer.schedule': 'Programación',
  'footer.talks': 'Charlas abiertas',
  'footer.directions': 'Cómo llegar',

  // --- 404 ---
  'notfound.title': 'Página no encontrada',
  'notfound.body': 'La página que buscas no existe o cambió de lugar.',
  'notfound.back': 'Ir al inicio',
} as const satisfies Record<string, string>;

export type UiKey = keyof typeof es;

/**
 * Portada en inglés (/en/). Mismas claves que `es`, exigidas por el tipo.
 * Nombres propios (sedes, Villa de Leyva, marca) se quedan como están.
 * "Conversatorio" → "panel conversation" (o "panel" en corto); "charla
 * abierta" → "open talk"; "boleta de medio día" → "half-day ticket".
 */
const en: Record<UiKey, string> = {
  'cta.buy': 'Buy tickets',

  'nav.opportunity': 'About',
  'nav.speakers': 'Speakers',
  'nav.schedule': 'Program',
  'nav.venue': 'Venue',
  'nav.faq': 'FAQ',
  'nav.lodging': 'Where to stay',
  'nav.contact': 'Contact us',
  'nav.aria': 'Main navigation',
  'nav.menu': 'Menu',
  'nav.close': 'Close menu',

  'hero.tagline': 'Journalists in History',
  'hero.dates': '{fechas}',
  'hero.place': 'Villa de Leyva, Colombia',
  'hero.tileCta': 'View profile',
  'hero.speakersAll': 'See all',
  'hero.pitch':
    'Four days in Villa de Leyva with the reporters who were there: they sit down to tell what they saw and take your questions.',
  'hero.edition': 'First edition',
  'hero.format': 'Open talks and panel conversations',
  'hero.capacity': 'Limited seating',
  'hero.unitDay': 'day',
  'hero.unitDays': 'days',
  'hero.unitHour': 'hour',
  'hero.unitHours': 'hours',
  'hero.unitMinute': 'minute',
  'hero.unitMinutes': 'minutes',
  'hero.unitSecond': 'second',
  'hero.unitSeconds': 'seconds',
  'hero.countdownAria': 'Time until the event begins',
  'hero.countdownToday': 'The event begins today',
  'hero.countdownLive': 'The event is underway',
  'hero.slogan': "Colombia's recent\nhistory, told by\nthe people who\nlived it up close.",
  'hero.month': '{mes}',

  'keyfacts.aria': 'The event in three facts',
  'keyfacts.days': 'days',
  'keyfacts.daysDetail': '{fechasConDia}, in Villa de Leyva.',
  'keyfacts.speakers': 'journalists',
  'keyfacts.speakersDetail': "The people who tell the country's recent history, in person and open to questions.",
  'keyfacts.formats': 'formats',
  'keyfacts.formatsDetail':
    'Free open talks at {sedeCharlas} and ticketed panel conversations at {sedeConversatorios}.',

  'tickets.heading': 'Tickets',
  'tickets.title': 'There are three ways to buy.',
  'tickets.passName': 'Full pass',
  'tickets.passText': 'All {conversatorios} panel conversations, from Friday afternoon to Sunday morning, on a single ticket.',
  'tickets.weekendName': 'Weekend pass',
  'tickets.weekendText':
    "All six panels on Saturday and Sunday, on a single ticket. For those who can only come on the weekend and don't want to miss a thing.",
  'tickets.was': 'Was',
  'tickets.slotName': 'Half-day ticket',
  'tickets.slotText':
    'One morning or one afternoon, with its two or three panels: Friday afternoon, Saturday morning, Saturday afternoon or Sunday morning. Buy only the ones you want.',
  'tickets.slotSoon': 'Not on sale yet.',
  'stages.heading': 'Sales calendar',
  'stages.stage1': 'Stage 1',
  'stages.stage2': 'Stage 2',
  'stages.stage3': 'Stage 3',
  'stages.now': 'Now open',
  'stages.closed': 'Closed',
  'stages.until': 'Until',
  'stages.from': 'From',
  'stages.stage1Product': 'Full pass',
  'stages.stage2Product': 'All tickets',
  'stages.stage3Product': 'All tickets',
  'stages.stage1Note': 'Opened sales at its biggest discount.',
  'stages.stage2Note': 'Half-day tickets and the weekend pass arrive.',
  'stages.stage3Note': 'Everything stays on sale, at a smaller discount.',
  'stages.daysLeft': '{n} days left at the stage 2 price',
  'stages.lastDay': 'Last day at the stage 2 price',
  'tickets.stagePrice': 'Stage 2 price, until {date}.',
  'tickets.notify': 'Notify me when it opens',
  'notify.title': "We'll let you know when it goes on sale",
  'notify.intro': "Leave us your details and we'll write to you as soon as it goes on sale.",
  'notify.submit': 'Notify me',
  'notify.success': "Done. We'll write to you as soon as it goes on sale.",
  'notify.close': 'Close',
  'tickets.soon':
    'Ticket sales open soon. Limited seating. The open talks are free to attend.',
  'tickets.widgetFallback': 'If the checkout module does not load, you can buy directly from the secure Pretix shop:',
  'tickets.widgetLink': 'Buy on Pretix',
  'tickets.pay':
    'You pay through Wompi: card, Nequi, Daviplata or PSE (choose Transferencia, then your bank). Payment fee: 3.3%.',
  'tickets.notYet': 'Not yet available',
  'waitlist.name': 'Name',
  'waitlist.email': 'Email address',
  'waitlist.phone': 'Phone',
  'waitlist.submit': 'Notify me when sales open',
  'waitlist.consent':
    'I am of legal age and I authorize Eventalist to process my data to send me information about this event and other events by email and WhatsApp, in accordance with the',
  'waitlist.consentLink': 'personal data policy',
  'waitlist.privacy': 'Your data is never shared or sold to third parties.',
  'waitlist.noscript': 'You need to enable JavaScript in your browser to sign up.',
  'waitlist.sending': 'Sending…',
  'waitlist.success': "Done. We'll write to you as soon as sales open.",
  'waitlist.error': "We couldn't save your details. Please try again later.",
  'waitlist.errorNetwork': "We couldn't save your details. Check your connection and try again.",
  'waitlist.errorTooMany': 'Too many attempts. Please try again in a little while.',
  'waitlist.errorConsent': 'We need your authorization to save your details.',
  'waitlist.fieldEmail': 'Email address',
  'waitlist.fieldPhone': 'Phone',
  'waitlist.fieldName': 'Name',
  'waitlist.fieldConsent': 'Authorization',

  'schedule.free': 'Free admission',
  'schedule.heading': 'Four days in Villa de Leyva',

  'speakers.prev': 'Previous speaker',
  'speakers.next': 'Next speaker',
  'speakers.links': 'Social media and links for',
  'speakers.more': 'Read more',
  'speakers.less': 'Read less',
  'speakers.subtitle': 'What happens when the people who told the story tell it again?',
  'speakers.lead':
    "This time you won't read them: you'll hear them talk about what they saw, what they couldn't tell and what they understand differently today.",
  'speakers.ctaLead': 'Limited seating.',
  'speakers.ctaNote': 'The most anticipated panels sell out first.',
  'speakers.viewProfile': 'view profile',
  'speakers.on': 'on',

  'links.x': 'X',
  'links.instagram': 'Instagram',
  'links.linkedin': 'LinkedIn',
  'links.facebook': 'Facebook',
  'links.web': 'Website',
  'links.wikipedia': 'Wikipedia',

  'venue.directions': 'Get directions',
  'stay.heading': 'Where to stay',
  'stay.intro':
    'Coming from Bogotá or farther away? No need to hunt for a hotel. These four partners have an offer for attendees only: message them on WhatsApp or book online with the code.',
  'stay.onlyAttendees': 'Attendees only',
  'stay.askFor': 'Ask for',
  'stay.writeTo': 'The front desk will help you directly.',
  'stay.whatsapp': 'Message on WhatsApp',
  'stay.call': 'Call',
  'stay.email': 'Send an email',
  'stay.useCode': 'Book online and enter the code',
  'stay.bookOnline': 'Book online',
  'stay.note':
    'Mention that you are attending Testigos de la Memoria to get the offer, or use the code when booking online. Booking and payment are handled directly with each hotel.',
  'venue.mapTitle': 'Google map of Villa de Leyva showing {sedeConversatorios}',
  'venue.heading': 'Two venues, a few blocks apart',
  'venue.intro':
    "A gathering about Colombia in a place that seems made for conversation. After each session you can walk across Villa de Leyva's main square, sit down for a drink and keep talking. Both venues are a few blocks from the Plaza Mayor.",
  'venue.logoAlt': 'Logo of',
  'venue.mapOf': 'Google map:',

  'opp.eyebrow': 'About',
  'opp.heading': 'A chance to hear first-hand from the people who were there while history was happening.',
  'opp.lead':
    "The events that shaped the country have front-row witnesses: the reporters who covered them. Over {dias} days, some of the biggest names in Colombian journalism sit down to tell what they saw, how they reported it and what that past teaches us about what's ahead.",
  'opp.point1':
    "What was behind the news, what never made it to television, the decisions they had to make and the stories that were left out.",
  'opp.point2': 'Intimate panel conversations, no distant stage: questions and disagreements included.',
  'opp.point3': 'History and craft first-hand, with names, dates and newsrooms on the table.',
  'opp.point4': 'Villa de Leyva: a town that invites you to keep the conversation going after every session.',
  'opp.closing': "It's the first edition. No one will tell you about it afterwards: you have to be there!",

  'interlude.alt': 'Cobblestone street in Villa de Leyva with white houses and the mountain in the background',
  'interlude.quote': "Villa de Leyva gathers to talk about the country we've lived through.",

  'faq.heading': 'Frequently asked questions',
  'faq.closing': "Don't let them tell you about it. Come and be a witness.",
  'faq.photoAlt': 'Stone bell tower of the church in Villa de Leyva',

  'layout.skip': 'Skip to content',

  'footer.organizedBy': 'Organized by',
  'footer.partners': 'Partners',
  'footer.supportedBy': 'With the support of',
  'footer.contact': 'Contact',
  'footer.contactLink.whatsapp': 'Message us on WhatsApp',
  'footer.contactLink.instagram': 'Message us on Instagram',
  'tickets.bubbleTitle': 'Any questions about your purchase?',
  'tickets.bubbleText.whatsapp': 'We can help you on WhatsApp.',
  'tickets.bubbleText.instagram': 'We can help you on Instagram.',
  'tickets.helpLink': 'Questions? Message us',
  'footer.rights': 'Testigos de la Memoria · Villa de Leyva, 2026',
  'footer.producedBy': 'Testigos de la Memoria is an event produced by',
  'footer.privacy': 'Personal data policy',
  'footer.terms': 'Terms and conditions',
  'footer.pagesAria': 'Site pages',

  'consent.title': 'We use cookies',
  'consent.text': 'Eventalist uses them to improve your experience on the site.',
  'consent.point1': "We don't sell your data",
  'consent.point1Text': "We don't sell it or hand it over so others can offer you things.",
  'consent.point2': 'Only to improve the site',
  'consent.point2Text': 'We see which pages work and where people come from, so we know what to fix.',
  'consent.point3': 'No ads once you buy',
  'consent.point3Text': 'Once you have your ticket, we stop showing you ads to buy one.',
  'consent.more': 'Data policy',
  'consent.accept': 'Accept',
  'consent.configure': 'Settings',
  'consent.optionsTitle': 'Cookie settings',
  'consent.analytics': 'Analytics',
  'consent.analyticsText': 'Google Analytics. Counts visits and where they come from.',
  'consent.advertising': 'Advertising',
  'consent.advertisingText': "Meta and Google. Keeps you from seeing repeated ads or ones you no longer need.",
  'consent.acceptAll': 'Accept all',
  'consent.save': 'Save',
  'consent.close': 'Close this notice',
  'consent.prefsLink': 'Cookies and preferences',
  'consent.prefsTitle': 'Cookies and preferences',
  'consent.prefsAccepted': 'You saved your cookie preferences on {date}',
  'consent.prefsNone': 'You have not accepted analytics or advertising cookies in this browser.',
  'consent.prefsId': 'Your acceptance ID (for inquiries or claims):',
  'consent.saved': 'Done. Your preferences are saved in this browser.',
  'consent.policy': 'Read the personal data policy',

  'crumb.home': 'Home',
  'crumb.speakers': 'Speakers',
  'crumb.talks': 'Open talks',
  'crumb.directions': 'Getting there',
  'crumb.lodging': 'Where to stay',
  'crumb.aria': 'Breadcrumb',

  'speaker.sessions': 'At the event',
  'speaker.works': 'Works and links',
  'speaker.all': 'All speakers',
  'speaker.indexLead':
    "The journalists who covered Colombia's last fifty years, gathered in Villa de Leyva, {fechas}.",
  'speaker.readProfile': 'View profile',

  'session.people': 'At the table',
  'session.guest': 'Guest',
  'session.details': 'When and where',
  'session.read': 'View session',
  'session.talk': 'Open talk',
  'session.panel': 'Panel conversation',

  'schedule.paid': 'Ticket required',
  'schedule.full': 'See the full program',
  'schedule.freeCta': 'More information',
  'schedule.legendTalks': 'Open talks · Free admission',
  'schedule.legendPanels': 'Panel conversations · Ticket required',
  'schedule.venueMap': 'See on the map',
  'schedule.pricesHeading': 'Tickets',

  'facts.heading': 'The event in a few lines',
  'facts.where': 'Villa de Leyva, Boyacá, Colombia',
  'facts.when': '{fechas}',
  'facts.talks': 'Free open talks on Thursday, November 5 and Friday morning, November 6, at {sedeCharlas}.',
  'facts.panels':
    'Ticketed panel conversations from Friday afternoon, November 6, through Sunday, November 8, at {sedeConversatorios}.',
  'facts.onSale': 'On sale',
  'facts.soon': 'From',
  'facts.soldOut': 'Sold out',
  'facts.closed': 'Sales closed',
  'facts.buy': 'Buy tickets',

  'footer.speakers': 'Speakers',
  'footer.schedule': 'Program',
  'footer.talks': 'Open talks',
  'footer.directions': 'Getting there',

  'notfound.title': 'Page not found',
  'notfound.body': "The page you're looking for doesn't exist or has moved.",
  'notfound.back': 'Go to the homepage',
};

const dicts: Record<Lang, Record<UiKey, string>> = { es, en };

export const ui = es;

/* Números en letra para los conteos de los textos */
const words: Record<Lang, string[]> = {
  es: ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
    'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte'],
  en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'],
};
function inWords(n: number, lang: Lang): string {
  return words[lang][n] ?? String(n);
}

/* Partes de una fecha 'YYYY-MM-DD' en el idioma, sin depender de la zona del build */
function dateParts(iso: string, lang: Lang) {
  const date = new Date(`${iso}T12:00:00Z`);
  const part = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(localeOf(lang), { timeZone: 'UTC', ...o }).format(date);
  return { day: date.getUTCDate(), month: part({ month: 'long' }), weekday: part({ weekday: 'long' }), year: date.getUTCFullYear() };
}

/** Hechos que los textos usan como {variable}, desde src/data/ */
function factsFor(lang: Lang) {
  const a = dateParts(event.startDate, lang);
  const b = dateParts(event.endDate, lang);
  const sameMonth = a.month === b.month;
  const venueOf = (type: 'charla' | 'conversatorio') =>
    venues.find((v) => v.id === agenda.find((s) => s.type === type)?.venueId)!.name;
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const talkDays = [...new Set(agenda.filter((s) => s.type === 'charla').map((s) => s.day))].map((d) => dateParts(d, lang));
  const last = talkDays.at(-1)!;
  const talkDayList = talkDays.map((d) => d.day).join(lang === 'es' ? ' y ' : ' and ');
  return {
    fechas:
      lang === 'es'
        ? sameMonth
          ? `${a.day} al ${b.day} de ${b.month} de ${b.year}`
          : `${a.day} de ${a.month} al ${b.day} de ${b.month} de ${b.year}`
        : sameMonth
          ? `${capitalize(b.month)} ${a.day}–${b.day}, ${b.year}`
          : `${capitalize(a.month)} ${a.day} – ${capitalize(b.month)} ${b.day}, ${b.year}`,
    fechasConDia:
      lang === 'es'
        ? `Del ${a.weekday} ${a.day}${sameMonth ? '' : ` de ${a.month}`} al ${b.weekday} ${b.day} de ${b.month} de ${b.year}`
        : `From ${a.weekday}, ${capitalize(a.month)} ${a.day} to ${b.weekday}, ${capitalize(b.month)} ${b.day}, ${b.year}`,
    fechasSinAno:
      lang === 'es'
        ? `${a.day} al ${b.day} de ${b.month}`
        : `${capitalize(b.month)} ${a.day}–${b.day}`,
    diasCharlas:
      lang === 'es'
        ? `${talkDayList} de ${last.month} de ${last.year}`
        : `${capitalize(last.month)} ${talkDayList}, ${last.year}`,
    mes: lang === 'es' ? `${b.month} ${b.year}` : `${capitalize(b.month)} ${b.year}`,
    panelistas: inWords(speakers.length, lang),
    dias: inWords(new Set(agenda.map((s) => s.day)).size, lang),
    conversatorios: inWords(agenda.filter((s) => s.type === 'conversatorio' && !s.role).length, lang),
    sedeCharlas: venueOf('charla'),
    sedeConversatorios: venueOf('conversatorio'),
  };
}
export type FactName = keyof ReturnType<typeof factsFor>;
const facts: Record<Lang, Record<string, string>> = { es: factsFor('es'), en: factsFor('en') };

/** Un hecho ya escrito para el texto (títulos y descripciones de routes.ts, por ejemplo) */
export function fact(name: FactName, lang: Lang = 'es'): string {
  return facts[lang][name]!;
}

export function t(key: UiKey, lang: Lang = 'es'): string {
  return dicts[lang][key].replace(/\{(\w+)\}/g, (whole, name: string) => facts[lang][name] ?? whole);
}

/**
 * `t` ligado al idioma de la página: en los componentes,
 * `const t = tFor(Astro.url.pathname)`.
 */
export function tFor(pathname: string): (key: UiKey) => string {
  const lang = langOf(pathname);
  return (key) => t(key, lang);
}
