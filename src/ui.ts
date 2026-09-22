/**
 * Diccionario de UI. Todo microcopy visible vive aquí — una sola fuente
 * para textos repetidos. El sitio es en español (spec · Clarifications
 * 2026-08-25: el evento es íntegramente en español); la tabla `en` solo
 * alimenta la portada /en/ (src/i18n.ts) y TypeScript exige que tenga
 * exactamente las mismas claves que `es`.
 */
import { langOf, type Lang } from './i18n';

const es = {
  // --- Compra: textos del CTA (FR-010, ajuste 2026-09-09). Todos llevan a
  //     #boletas; el header y la franja del hero usan siempre 'cta.buy'. ---
  'cta.buy': 'Comprar boletas',
  'cta.beThere': 'Quiero estar ahí',
  'cta.secure': 'Asegurar mi boleta',
  'cta.live': 'Vivir Testigos de la Memoria',

  // --- Navegación ---
  /* Prueba 2026-09-09 (sugerencia externa): etiquetas en pregunta. Para
     volver: 'El encuentro', 'Panelistas', 'Agenda', 'Lugar', 'Preguntas'. */
  'nav.opportunity': '¿Qué voy a vivir?',
  'nav.speakers': '¿Quiénes estarán?',
  'nav.schedule': '¿Qué voy a escuchar?',
  'nav.venue': '¿Dónde?',
  'nav.faq': 'Preguntas',
  'nav.aria': 'Navegación principal',

  // --- Hero ---
  'hero.tagline': 'Periodistas en la Historia',
  'hero.dates': '5 al 8 de noviembre de 2026',
  'hero.place': 'Villa de Leyva, Colombia',
  /* Línea de datos bajo el remate: edición, formato y escasez, separados por "·" */
  'hero.tileCta': 'Ver ficha',
  /* El lugar va dentro de la frase (2026-09-19): sin la foto de la casa en
     el hero, nada decía Villa de Leyva antes de las boletas */
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
  'hero.month': 'noviembre 2026',

  // --- El encuentro en tres datos (KeyFacts) ---
  'keyfacts.aria': 'El encuentro en tres datos',
  'keyfacts.days': 'días',
  'keyfacts.daysDetail': 'Del jueves 5 al domingo 8 de noviembre de 2026, en Villa de Leyva.',
  'keyfacts.speakers': 'periodistas',
  'keyfacts.speakersDetail': 'Los que cuentan la historia reciente del país, en persona y con derecho a preguntas.',
  'keyfacts.formats': 'formatos',
  'keyfacts.formatsDetail':
    'Charlas abiertas de entrada libre en la Casa Museo Antonio Nariño y conversatorios con boleta en la Hospedería Duruelo.',

  // --- Sección de compra ---
  /* Junto a la tienda: explicar sin adornos las dos formas de comprar */
  'tickets.heading': 'Asegura tu lugar',
  'tickets.title': 'Hay dos formas de comprar.',
  'tickets.passName': 'Pase completo',
  /* "Medio día" en vez de "franja" (2026-09-18): la palabra franja no se
     entendía; una mañana o una tarde sí. */
  'tickets.passText':
    'Los siete conversatorios, del viernes en la tarde al domingo en la mañana, en una sola boleta.',
  'tickets.slotName': 'Boleta de medio día',
  'tickets.slotText':
    'Una mañana o una tarde, con sus dos o tres conversatorios: viernes en la tarde, sábado en la mañana, sábado en la tarde o domingo en la mañana. Compra solo las que quieras.',
  /* Etapas de venta (2026-09-15): en la etapa 1 solo el pase completo.
     El widget muestra las franjas con "Aún no disponible"; las fechas las
     cuenta el bloque de etapas (SalesStages). */
  'tickets.slotSoon': 'Se venden desde la etapa 2.',
  /* Bloque de etapas: dos planos que se tocan, cielo el vigente y crema el
     que viene (fórmula visual §6: los datos van en franja) */
  'stages.heading': 'Calendario de venta',
  'stages.stage1': 'Etapa 1',
  'stages.stage2': 'Etapa 2',
  'stages.now': 'En curso',
  'stages.until': 'Hasta el',
  'stages.from': 'Desde el',
  'stages.stage1Product': 'Pase completo',
  'stages.stage2Product': 'Boletas de medio día',
  'stages.stage1Note': 'Solo el pase, con los siete conversatorios.',
  'stages.stage2Note': 'Mañanas y tardes sueltas. El pase completo se retira.',
  'stages.daysLeft': 'Quedan {n} días para comprar el pase',
  'stages.lastDay': 'Último día para comprar el pase',
  'tickets.notify': 'Avísame cuando abra',
  /* Modal "avísame" de las franjas; la franja escogida va como eyebrow */
  'notify.title': 'Te avisamos cuando abra la etapa 2',
  'notify.intro':
    'Déjanos tus datos y te escribimos en cuanto las boletas de medio día estén a la venta.',
  'notify.submit': 'Avisarme',
  'notify.success': 'Listo. Te escribiremos en cuanto abran las boletas de medio día.',
  'notify.close': 'Cerrar',
  'tickets.soon':
    'La venta de boletas abre pronto. Aforo limitado. En la etapa 1, hasta el 4 de octubre, se vende solo el pase completo; las boletas de medio día se abren en la etapa 2, desde el 5 de octubre. Las charlas abiertas del 5 y 6 de noviembre son de entrada libre.',
  'tickets.widgetFallback':
    'Si el módulo de compra no carga, puedes comprar directamente en la tienda segura de Pretix:',
  'tickets.widgetLink': 'Comprar en Pretix',
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
  'venue.mapTitle': 'Mapa de Google de Villa de Leyva con la Hospedería Duruelo',
  'venue.heading': 'Dos sedes, a pocas cuadras',
  'venue.intro':
    'Un encuentro sobre Colombia en un lugar que parece hecho para conversar. Después de cada sesión puedes caminar por la plaza de Villa de Leyva, sentarte a tomar algo y quedarte conversando. Las dos sedes están a unas cuadras de la Plaza Mayor.',
  'venue.logoAlt': 'Logo de',
  'venue.mapOf': 'Mapa de Google:',

  // --- "Qué es" (Opportunity) ---
  'opp.eyebrow': 'Primera edición',
  /* Pregunta del banco aprobado (spec §2) */
  'opp.heading': 'Una oportunidad de escuchar de primera mano a quienes estuvieron allí cuando la historia estaba ocurriendo.',
  'opp.lead':
    'Los hechos que marcaron al país tienen testigos de primera fila: los reporteros que los cubrieron. Durante cuatro días, algunos de los grandes nombres del periodismo colombiano se sientan a contar lo que vieron, cómo lo contaron y qué nos enseña ese pasado para lo que viene.',
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
  'footer.rights': 'Testigos de la Memoria · Villa de Leyva, 2026',
  'footer.privacy': 'Tratamiento de datos personales',
  'footer.terms': 'Términos y condiciones',
  'footer.pagesAria': 'Páginas del sitio',

  // --- Aviso de cookies y preferencias (dictamen legal 2026-09-15) ---
  /* Corto y sin énfasis, como es habitual: nombra al responsable, los
     proveedores y la finalidad, y enlaza la política (arts. 14 y 15 del
     Decreto 1377). El detalle vive en la sección 10 de la política. */
  'consent.text':
    'Eventalist usa cookies de analítica y publicidad (Google y Meta) para medir las visitas y la campaña de boletas. Al aceptar autorizas ese uso según la política de datos.',
  'consent.more': 'Política de datos',
  'consent.accept': 'Aceptar',
  'consent.modalEyebrow': 'Cookies',
  'consent.modalTitle': 'Usamos cookies para medir el sitio y la campaña',
  'consent.modalAccept': 'Aceptar y continuar',
  'consent.modalSkip': 'Seguir sin aceptar',
  'consent.close': 'Cerrar el aviso',
  'consent.prefsLink': 'Cookies y preferencias',
  'consent.prefsTitle': 'Cookies y preferencias',
  'consent.prefsAccepted': 'Aceptaste el uso de cookies de analítica y publicidad el {date}',
  'consent.prefsNone': 'No has aceptado el uso de cookies de analítica y publicidad en este navegador.',
  'consent.prefsId': 'Identificador de tu aceptación (para consultas o reclamos):',
  'consent.revoke': 'Retirar la aceptación',
  'consent.revoked': 'Listo. Las cookies de analítica y publicidad quedaron desactivadas en este navegador.',
  'consent.policy': 'Leer la política de tratamiento de datos',

  // --- Migas de pan y páginas interiores ---
  'crumb.home': 'Inicio',
  'crumb.speakers': 'Panelistas',
  'crumb.schedule': 'Programación',
  'crumb.talks': 'Charlas abiertas',
  'crumb.directions': 'Cómo llegar',
  'crumb.lodging': 'Dónde dormir',
  'crumb.aria': 'Ruta de navegación',

  // --- Fichas de panelistas ---
  'speaker.sessions': 'En el encuentro',
  'speaker.works': 'Obras y enlaces',
  'speaker.all': 'Todos los panelistas',
  'speaker.indexLead':
    'Los periodistas que cubrieron los últimos cincuenta años de Colombia, reunidos en Villa de Leyva del 5 al 8 de noviembre de 2026.',
  'speaker.readProfile': 'Ver ficha',

  // --- Programación ---
  'schedule.updated': 'Actualizado el',
  'schedule.paid': 'Con boleta',
  'schedule.full': 'Ver la programación completa',
  'schedule.freeCta': 'Quiero saber más',
  'schedule.legendTalks': 'Charlas abiertas · Entrada libre',
  'schedule.legendPanels': 'Conversatorios · Con boleta',
  'schedule.venueMap': 'Ver en el mapa',
  'schedule.pricesHeading': 'Boletas',

  // --- Bloque de hechos del encuentro (texto plano en toda página interior) ---
  'facts.heading': 'El encuentro en pocas líneas',
  'facts.where': 'Villa de Leyva, Boyacá, Colombia',
  'facts.when': '5 al 8 de noviembre de 2026',
  'facts.talks': 'Charlas abiertas de entrada libre el jueves 5 y el viernes 6 en la mañana, en la Casa Museo Antonio Nariño.',
  'facts.panels': 'Conversatorios con boleta del viernes 6 en la tarde al domingo 8, en la Hospedería Duruelo.',
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
  'cta.beThere': 'I want to be there',
  'cta.secure': 'Secure my ticket',
  'cta.live': 'Experience Testigos de la Memoria',

  'nav.opportunity': 'What will I experience?',
  'nav.speakers': 'Who will be there?',
  'nav.schedule': 'What will I hear?',
  'nav.venue': 'Where?',
  'nav.faq': 'FAQ',
  'nav.aria': 'Main navigation',

  'hero.tagline': 'Journalists in History',
  'hero.dates': 'November 5–8, 2026',
  'hero.place': 'Villa de Leyva, Colombia',
  'hero.tileCta': 'View profile',
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
  'hero.month': 'November 2026',

  'keyfacts.aria': 'The event in three facts',
  'keyfacts.days': 'days',
  'keyfacts.daysDetail': 'From Thursday, November 5 to Sunday, November 8, 2026, in Villa de Leyva.',
  'keyfacts.speakers': 'journalists',
  'keyfacts.speakersDetail': "The people who tell the country's recent history, in person and open to questions.",
  'keyfacts.formats': 'formats',
  'keyfacts.formatsDetail':
    'Free open talks at Casa Museo Antonio Nariño and ticketed panel conversations at Hospedería Duruelo.',

  'tickets.heading': 'Secure your seat',
  'tickets.title': 'There are two ways to buy.',
  'tickets.passName': 'Full pass',
  'tickets.passText': 'All seven panel conversations, from Friday afternoon to Sunday morning, on a single ticket.',
  'tickets.slotName': 'Half-day ticket',
  'tickets.slotText':
    'One morning or one afternoon, with its two or three panels: Friday afternoon, Saturday morning, Saturday afternoon or Sunday morning. Buy only the ones you want.',
  'tickets.slotSoon': 'On sale from stage 2.',
  'stages.heading': 'Sales calendar',
  'stages.stage1': 'Stage 1',
  'stages.stage2': 'Stage 2',
  'stages.now': 'Now open',
  'stages.until': 'Until',
  'stages.from': 'From',
  'stages.stage1Product': 'Full pass',
  'stages.stage2Product': 'Half-day tickets',
  'stages.stage1Note': 'The pass only, with all seven panels.',
  'stages.stage2Note': 'Individual mornings and afternoons. The full pass is withdrawn.',
  'stages.daysLeft': '{n} days left to buy the pass',
  'stages.lastDay': 'Last day to buy the pass',
  'tickets.notify': 'Notify me when it opens',
  'notify.title': "We'll let you know when stage 2 opens",
  'notify.intro': "Leave us your details and we'll write to you as soon as half-day tickets go on sale.",
  'notify.submit': 'Notify me',
  'notify.success': "Done. We'll write to you as soon as half-day tickets go on sale.",
  'notify.close': 'Close',
  'tickets.soon':
    'Ticket sales open soon. Limited seating. During stage 1, until October 4, only the full pass is sold; half-day tickets open in stage 2, from October 5. The open talks on November 5 and 6 are free to attend.',
  'tickets.widgetFallback': 'If the checkout module does not load, you can buy directly from the secure Pretix shop:',
  'tickets.widgetLink': 'Buy on Pretix',
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
  'venue.mapTitle': 'Google map of Villa de Leyva showing Hospedería Duruelo',
  'venue.heading': 'Two venues, a few blocks apart',
  'venue.intro':
    "A gathering about Colombia in a place that seems made for conversation. After each session you can walk across Villa de Leyva's main square, sit down for a drink and keep talking. Both venues are a few blocks from the Plaza Mayor.",
  'venue.logoAlt': 'Logo of',
  'venue.mapOf': 'Google map:',

  'opp.eyebrow': 'First edition',
  'opp.heading': 'A chance to hear first-hand from the people who were there while history was happening.',
  'opp.lead':
    "The events that shaped the country have front-row witnesses: the reporters who covered them. Over four days, some of the biggest names in Colombian journalism sit down to tell what they saw, how they reported it and what that past teaches us about what's ahead.",
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
  'footer.rights': 'Testigos de la Memoria · Villa de Leyva, 2026',
  'footer.privacy': 'Personal data policy',
  'footer.terms': 'Terms and conditions',
  'footer.pagesAria': 'Site pages',

  'consent.text':
    'Eventalist uses analytics and advertising cookies (Google and Meta) to measure visits and the ticket campaign. By accepting, you authorize that use under the data policy.',
  'consent.more': 'Data policy',
  'consent.accept': 'Accept',
  'consent.modalEyebrow': 'Cookies',
  'consent.modalTitle': 'We use cookies to measure the site and the campaign',
  'consent.modalAccept': 'Accept and continue',
  'consent.modalSkip': 'Continue without accepting',
  'consent.close': 'Close this notice',
  'consent.prefsLink': 'Cookies and preferences',
  'consent.prefsTitle': 'Cookies and preferences',
  'consent.prefsAccepted': 'You accepted analytics and advertising cookies on {date}',
  'consent.prefsNone': 'You have not accepted analytics and advertising cookies in this browser.',
  'consent.prefsId': 'Your acceptance ID (for inquiries or claims):',
  'consent.revoke': 'Withdraw acceptance',
  'consent.revoked': 'Done. Analytics and advertising cookies are now disabled in this browser.',
  'consent.policy': 'Read the personal data policy',

  'crumb.home': 'Home',
  'crumb.speakers': 'Speakers',
  'crumb.schedule': 'Program',
  'crumb.talks': 'Open talks',
  'crumb.directions': 'Getting there',
  'crumb.lodging': 'Where to stay',
  'crumb.aria': 'Breadcrumb',

  'speaker.sessions': 'At the event',
  'speaker.works': 'Works and links',
  'speaker.all': 'All speakers',
  'speaker.indexLead':
    "The journalists who covered Colombia's last fifty years, gathered in Villa de Leyva, November 5–8, 2026.",
  'speaker.readProfile': 'View profile',

  'schedule.updated': 'Updated on',
  'schedule.paid': 'Ticket required',
  'schedule.full': 'See the full program',
  'schedule.freeCta': 'Tell me more',
  'schedule.legendTalks': 'Open talks · Free admission',
  'schedule.legendPanels': 'Panel conversations · Ticket required',
  'schedule.venueMap': 'See on the map',
  'schedule.pricesHeading': 'Tickets',

  'facts.heading': 'The event in a few lines',
  'facts.where': 'Villa de Leyva, Boyacá, Colombia',
  'facts.when': 'November 5–8, 2026',
  'facts.talks': 'Free open talks on Thursday, November 5 and Friday morning, November 6, at Casa Museo Antonio Nariño.',
  'facts.panels':
    'Ticketed panel conversations from Friday afternoon, November 6, through Sunday, November 8, at Hospedería Duruelo.',
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

export function t(key: UiKey, lang: Lang = 'es'): string {
  return dicts[lang][key];
}

/**
 * `t` ligado al idioma de la página: en los componentes,
 * `const t = tFor(Astro.url.pathname)`.
 */
export function tFor(pathname: string): (key: UiKey) => string {
  const lang = langOf(pathname);
  return (key) => dicts[lang][key];
}
