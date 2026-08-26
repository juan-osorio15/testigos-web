/**
 * Diccionario de UI. Todo microcopy visible vive aquí, en ambos idiomas.
 * `LocalizedString` exige es + en: contenido sin traducir no compila
 * (edge case del spec: nunca se publica mezcla de idiomas).
 */

export type Locale = 'es' | 'en';
export type LocalizedString = { es: string; en: string };

export const locales: Locale[] = ['es', 'en'];
export const defaultLocale: Locale = 'es';

const dict = {
  // --- Compra: ÚNICA fuente del texto del CTA (FR-010) ---
  'cta.buy': { es: 'Comprar boletas', en: 'Get tickets' },

  // --- Navegación ---
  'nav.opportunity': { es: 'El encuentro', en: 'The gathering' },
  'nav.speakers': { es: 'Panelistas', en: 'Speakers' },
  'nav.schedule': { es: 'Agenda', en: 'Schedule' },
  'nav.venue': { es: 'Lugar', en: 'Venue' },
  'nav.faq': { es: 'Preguntas', en: 'FAQ' },
  'nav.aria': { es: 'Navegación principal', en: 'Main navigation' },
  'nav.menuOpen': { es: 'Abrir menú', en: 'Open menu' },
  'nav.menuClose': { es: 'Cerrar menú', en: 'Close menu' },

  // --- Selector de idioma ---
  'lang.switch': { es: 'English', en: 'Español' },
  'lang.aria': {
    es: 'Read this page in English',
    en: 'Leer esta página en español',
  },

  // --- Hero ---
  'hero.tagline': { es: 'Periodistas en la Historia', en: 'Journalists in History' },
  'hero.dates': { es: '5 al 8 de noviembre de 2026', en: 'November 5–8, 2026' },
  'hero.place': { es: 'Villa de Leyva, Colombia', en: 'Villa de Leyva, Colombia' },
  'hero.scroll': { es: 'Desliza para conocer más', en: 'Scroll to learn more' },

  // --- Sección de compra ---
  'tickets.heading': { es: 'Asegura tu lugar', en: 'Reserve your seat' },
  'tickets.soon': {
    es: 'La venta de boletas abre pronto. Los talleres del 5 de noviembre son de entrada libre.',
    en: 'Ticket sales open soon. The November 5 workshops are free to attend.',
  },
  'tickets.widgetFallback': {
    es: 'Si el módulo de compra no carga, puedes comprar directamente en la tienda segura de Pretix:',
    en: "If the checkout module doesn't load, you can buy directly from the secure Pretix store:",
  },
  'tickets.widgetLink': { es: 'Comprar en Pretix', en: 'Buy on Pretix' },

  // --- Agenda ---
  'schedule.free': { es: 'Entrada libre', en: 'Free entry' },
  'schedule.ticketed': { es: 'Con boleta', en: 'Ticketed' },
  'schedule.tbd': { es: 'Horario por confirmar', en: 'Time to be announced' },
  'schedule.titleTbd': { es: 'Programación por confirmar', en: 'Program to be announced' },

  // --- Speakers ---
  'speakers.tbd': { es: 'Por confirmar', en: 'To be announced' },
  'speakers.tbdNote': {
    es: 'Más panelistas se anunciarán aquí.',
    en: 'More speakers will be announced here.',
  },
  'speakers.prev': { es: 'Panelista anterior', en: 'Previous speaker' },
  'speakers.next': { es: 'Panelista siguiente', en: 'Next speaker' },

  // --- Venue ---
  'venue.directions': { es: 'Cómo llegar', en: 'Get directions' },
  'venue.mapAria': {
    es: 'Mapa esquemático de Villa de Leyva con las dos sedes',
    en: 'Schematic map of Villa de Leyva showing both venues',
  },

  // --- Footer ---
  'footer.organizedBy': { es: 'Organizan', en: 'Organized by' },
  'footer.rights': {
    es: 'Testigos de la Memoria — Villa de Leyva, 2026',
    en: 'Testigos de la Memoria — Villa de Leyva, 2026',
  },

  // --- 404 ---
  'notfound.title': { es: 'Página no encontrada', en: 'Page not found' },
  'notfound.body': {
    es: 'La página que buscas no existe o cambió de lugar.',
    en: "The page you're looking for doesn't exist or has moved.",
  },
  'notfound.back': { es: 'Ir al inicio', en: 'Go to homepage' },
} as const satisfies Record<string, LocalizedString>;

export type UiKey = keyof typeof dict;

export const ui = dict;

export function t(key: UiKey, locale: Locale): string {
  return dict[key][locale];
}
