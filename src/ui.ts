/**
 * Diccionario de UI. Todo microcopy visible vive aquí — una sola fuente
 * para textos repetidos. Sitio solo en español (spec · Clarifications
 * 2026-08-25: el evento es íntegramente en español).
 */

const dict = {
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
  'hero.pitch': 'Cuatro días. Más de diez periodistas. Una conversación que no se repite.',
  /* Línea de datos bajo el remate: edición, formato y escasez, separados por "·" */
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

  // --- Sección de compra ---
  /* Junto a la tienda: explicar sin adornos las dos formas de comprar */
  'tickets.heading': 'Asegura tu lugar',
  'tickets.title': 'Hay dos formas de comprar.',
  'tickets.passName': 'Pase completo',
  'tickets.passText':
    'Una sola boleta para los siete conversatorios: viernes en la tarde, sábado todo el día y domingo en la mañana. Incluye la bienvenida y el cierre. Sale más barato que comprar las cuatro franjas.',
  'tickets.slotName': 'Boleta por franja',
  'tickets.slotText':
    'Cada franja es media jornada, una mañana o una tarde, con sus conversatorios. Hay cuatro: viernes tarde, sábado mañana, sábado tarde y domingo mañana. Compras solo las que quieras.',
  'tickets.freeNote':
    'Las charlas abiertas del jueves 5 y del viernes 6 en la mañana no necesitan boleta: la entrada es libre.',
  'tickets.soon':
    'La venta de boletas abre pronto. Aforo limitado, con pase completo o boletas por franja. Las charlas abiertas del 5 y 6 de noviembre son de entrada libre.',
  'tickets.widgetFallback':
    'Si el módulo de compra no carga, puedes comprar directamente en la tienda segura de Pretix:',
  'tickets.widgetLink': 'Comprar en Pretix',
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

  // --- Speakers ---
  'speakers.prev': 'Panelista anterior',
  'speakers.next': 'Panelista siguiente',
  'speakers.links': 'Redes y enlaces de',
  'speakers.more': 'Leer más',
  'speakers.less': 'Leer menos',

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

  // --- Footer ---
  'footer.organizedBy': 'Organizan',
  'footer.supportedBy': 'Con el apoyo de',
  'footer.supporters': 'Aliados',
  'footer.rights': 'Testigos de la Memoria · Villa de Leyva, 2026',
  'footer.privacy': 'Tratamiento de datos personales',

  // --- 404 ---
  'notfound.title': 'Página no encontrada',
  'notfound.body': 'La página que buscas no existe o cambió de lugar.',
  'notfound.back': 'Ir al inicio',
} as const satisfies Record<string, string>;

export type UiKey = keyof typeof dict;

export const ui = dict;

export function t(key: UiKey): string {
  return dict[key];
}
