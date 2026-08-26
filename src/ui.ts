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
    'La venta de boletas abre pronto. Los talleres del 5 de noviembre son de entrada libre.',
  'tickets.widgetFallback':
    'Si el módulo de compra no carga, puedes comprar directamente en la tienda segura de Pretix:',
  'tickets.widgetLink': 'Comprar en Pretix',
  'waitlist.lead': '¿Quieres que te avisemos cuando abra la venta?',
  'waitlist.name': 'Nombre',
  'waitlist.email': 'Correo electrónico',
  'waitlist.phone': 'Teléfono (opcional)',
  'waitlist.submit': 'Avisarme cuando abra la venta',
  'waitlist.privacy': 'Solo usaremos tus datos para contarte novedades del evento.',
  'waitlist.pending': 'El registro se activará muy pronto.',
  'waitlist.success': 'Listo. Te escribiremos en cuanto abra la venta.',
  'waitlist.error': 'No pudimos guardar tus datos. Intenta de nuevo en un momento.',

  // --- Agenda ---
  'schedule.free': 'Entrada libre',
  'schedule.ticketed': 'Con boleta',
  'schedule.tbd': 'Horario por confirmar',
  'schedule.titleTbd': 'Programación por confirmar',

  // --- Speakers ---
  'speakers.tbd': 'Por confirmar',
  'speakers.tbdNote': 'Más panelistas se anunciarán aquí.',
  'speakers.prev': 'Panelista anterior',
  'speakers.next': 'Panelista siguiente',

  // --- Venue ---
  'venue.directions': 'Cómo llegar',
  'venue.mapTitle': 'Mapa de Google de Villa de Leyva con la Hospedería Duruelo',

  // --- Footer ---
  'footer.organizedBy': 'Organizan',
  'footer.rights': 'Testigos de la Memoria · Villa de Leyva, 2026',

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
