/**
 * Diccionario de UI. Todo microcopy visible vive aquí — una sola fuente
 * para textos repetidos. Sitio solo en español (spec · Clarifications
 * 2026-08-25: el evento es íntegramente en español).
 */

const dict = {
  // --- Compra: ÚNICA fuente del texto del CTA (FR-010) ---
  'cta.buy': 'Comprar boletas',

  // --- Navegación ---
  'nav.opportunity': 'El encuentro',
  'nav.speakers': 'Panelistas',
  'nav.schedule': 'Agenda',
  'nav.venue': 'Lugar',
  'nav.faq': 'Preguntas',
  'nav.aria': 'Navegación principal',

  // --- Hero ---
  'hero.tagline': 'Periodistas en la Historia',
  'hero.dates': '5 al 8 de noviembre de 2026',
  'hero.place': 'Villa de Leyva, Colombia',

  // --- Sección de compra ---
  'tickets.heading': 'Asegura tu lugar',
  'tickets.soon':
    'La venta de boletas abre pronto. Los talleres del 5 y 6 de noviembre son de entrada libre.',
  'tickets.widgetFallback':
    'Si el módulo de compra no carga, puedes comprar directamente en la tienda segura de Pretix:',
  'tickets.widgetLink': 'Comprar en Pretix',
  'waitlist.name': 'Nombre',
  'waitlist.email': 'Correo electrónico',
  'waitlist.phone': 'Teléfono',
  'waitlist.submit': 'Avisarme cuando abra la venta',
  /* Casilla de autorización (Ley 1581 de 2012 y Ley 2300 de 2023): quién,
     qué datos, para qué, por qué canales, cómo retirarla y enlace a la
     política. Se arma en TicketSection con el correo y el enlace. */
  'waitlist.consent1':
    'Declaro ser mayor de edad y autorizo a Eventalist a tratar mis datos personales (nombre, correo electrónico y número de teléfono) para enviarme información sobre este encuentro, sus futuras ediciones y otros eventos culturales en Villa de Leyva gestionados por Eventalist, por correo electrónico y WhatsApp. Puedo conocer, actualizar, rectificar y suprimir mis datos y retirar esta autorización en cualquier momento escribiendo a',
  'waitlist.consent2': 'He leído la',
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
