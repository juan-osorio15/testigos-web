import type { VenueId } from './event';
import type { Lang } from '../i18n';

/**
 * Agenda oficial: conversatorios de la programación parcial del
 * 2026-08-26 más las charlas abiertas confirmadas por los organizadores el
 * 2026-09-07. REGLA DURA (FR-005): jamás un nombre, horario o sede
 * inventados; lo no confirmado se omite (nada de "por confirmar" visible).
 * Charlas abiertas: 5 y 6 de noviembre en Casa Museo Antonio Nariño,
 * entrada libre. Conversatorios: con boleta, Hospedería Duruelo.
 * El cóctel de bienvenida no es abierto al público: no se anuncia.
 */

export type EventDay = '2026-11-05' | '2026-11-06' | '2026-11-07' | '2026-11-08';

export interface AgendaSlot {
  day: EventDay;
  /** Identificador estable: ancla en /programacion/#slug y @id del subevento del JSON-LD */
  slug: string;
  /** Hora en formato de display ("3:00 p.m.", "9:00 – 10:30 a.m."); null → no se muestra */
  time: string | null;
  /**
   * Hora de inicio y de fin en 24 h ('HH:MM', zona de Bogotá), para el
   * marcado del evento. Deben coincidir con `time`. Sin `start` no hay
   * subevento; sin `end` el subevento va sin hora de fin (nunca inventada).
   */
  start: string | null;
  end: string | null;
  /** charla = abierta y gratuita; conversatorio = con boleta */
  type: 'charla' | 'conversatorio';
  title: string;
  /** null → la sede aún no está confirmada y no se muestra */
  venueId: VenueId | null;
  /** Solo nombres confirmados; los cupos sin nombre no se representan */
  speakerSlugs: string[];
  /** Invitados confirmados que no tienen tarjeta de panelista */
  guests?: string[];
  /** Nota breve bajo el título (sinopsis, credencial del invitado) */
  note?: string;
  /** Título y nota para la portada en inglés (/en/); `agendaFor('en')` los sustituye */
  en?: { title: string; note?: string };
}

export const dayLabels: Record<EventDay, string> = {
  '2026-11-05': 'Jueves 5 de noviembre',
  '2026-11-06': 'Viernes 6 de noviembre',
  '2026-11-07': 'Sábado 7 de noviembre',
  '2026-11-08': 'Domingo 8 de noviembre',
};

const dayLabelsEn: Record<EventDay, string> = {
  '2026-11-05': 'Thursday, November 5',
  '2026-11-06': 'Friday, November 6',
  '2026-11-07': 'Saturday, November 7',
  '2026-11-08': 'Sunday, November 8',
};

export function dayLabelsFor(lang: Lang): Record<EventDay, string> {
  return lang === 'en' ? dayLabelsEn : dayLabels;
}

export const agenda: AgendaSlot[] = [
  /* --- Jueves 5: charlas abiertas, entrada libre --- */
  {
    day: '2026-11-05',
    slug: 'reporteria',
    time: '10:00 a.m. – 12:00 m.',
    start: '10:00',
    end: '12:00',
    type: 'charla',
    title: 'Charla de reportería',
    venueId: 'casa-museo',
    speakerSlugs: [],
    guests: ['Daniel Esteban Alvarado'],
    note: 'Docente del programa de Comunicación Social de la Universidad de Boyacá.',
    en: {
      title: 'Reporting workshop talk',
      note: 'Lecturer in the Social Communication program at Universidad de Boyacá.',
    },
  },
  {
    day: '2026-11-05',
    slug: 'documental-sady-gonzalez',
    time: '3:00 p.m.',
    start: '15:00',
    end: null,
    type: 'charla',
    title: 'Documental: Sady González, una luz en la memoria',
    venueId: 'casa-museo',
    speakerSlugs: ['guillermo-gonzalez'],
    note: 'La historia del fotógrafo Sady González, pionero de la reportería gráfica en Colombia, y de Esperanza Uribe, creadora del archivo Foto Sady. La Bogotá de los años cuarenta y cincuenta, con las imágenes del 9 de abril de 1948. Presenta Guillermo González Uribe, codirector.',
    en: {
      title: 'Documentary: Sady González, a light in memory',
      note: 'The story of photographer Sady González, a pioneer of photojournalism in Colombia, and of Esperanza Uribe, creator of the Foto Sady archive. Bogotá in the 1940s and 1950s, with the images of April 9, 1948. Presented by co-director Guillermo González Uribe.',
    },
  },

  /* --- Viernes 6: charla abierta en la mañana + apertura de conversatorios --- */
  {
    day: '2026-11-06',
    slug: 'periodismo-digital',
    time: '10:00 a.m.',
    start: '10:00',
    /* Duración de dos horas asumida por el organizador (2026-09-16); la hora visible sigue sin fin */
    end: '12:00',
    type: 'charla',
    title: 'Charla de periodismo digital',
    venueId: 'casa-museo',
    speakerSlugs: [],
    en: { title: 'Digital journalism talk' },
  },
  {
    day: '2026-11-06',
    slug: 'bienvenida',
    time: '3:00 p.m.',
    start: '15:00',
    end: null,
    type: 'conversatorio',
    title: 'Bienvenida y presentación',
    venueId: 'duruelo',
    speakerSlugs: ['dario-restrepo'],
    en: { title: 'Welcome and introduction' },
  },
  {
    day: '2026-11-06',
    slug: 'bogotazo-frente-nacional',
    time: '3:30 – 6:00 p.m.',
    start: '15:30',
    end: '18:00',
    type: 'conversatorio',
    title: 'Bogotazo, dictadura y Frente Nacional (1958-1974)',
    venueId: 'duruelo',
    speakerSlugs: ['daniel-samper-pizano', 'dario-restrepo'],
    en: { title: 'The Bogotazo, dictatorship and the National Front (1958-1974)' },
  },

  /* --- Sábado 7: conversatorios --- */
  {
    day: '2026-11-07',
    slug: 'guerrillas',
    time: '9:00 – 10:30 a.m.',
    start: '09:00',
    end: '10:30',
    type: 'conversatorio',
    title: 'Surgimiento de las guerrillas',
    venueId: 'duruelo',
    /* Ana María Echeverri entró el 2026-09-15 (organizadores) */
    speakerSlugs: ['leon-valencia', 'ana-maria-echeverri'],
    en: { title: 'The rise of the guerrillas' },
  },
  {
    day: '2026-11-07',
    slug: 'negociaciones-de-paz',
    time: '11:00 a.m. – 12:30 p.m.',
    start: '11:00',
    end: '12:30',
    type: 'conversatorio',
    title: 'Negociaciones de paz, el Caguán y La Habana',
    venueId: 'duruelo',
    speakerSlugs: ['marisol-gomez'],
    en: { title: 'Peace negotiations: Caguán and Havana' },
  },
  {
    day: '2026-11-07',
    slug: 'narcotrafico-paramilitarismo',
    time: '3:00 – 4:30 p.m.',
    start: '15:00',
    end: '16:30',
    type: 'conversatorio',
    title: 'Narcotráfico y paramilitarismo',
    venueId: 'duruelo',
    /* Martha Soto entró a esta franja el 2026-09-15 (organizadores) */
    speakerSlugs: ['luz-maria-sierra', 'martha-soto'],
    en: { title: 'Drug trafficking and paramilitarism' },
  },
  {
    day: '2026-11-07',
    slug: 'reelecciones',
    time: '5:00 – 6:30 p.m.',
    start: '17:00',
    end: '18:30',
    type: 'conversatorio',
    title: 'Reelecciones',
    venueId: 'duruelo',
    speakerSlugs: ['cecilia-orozco'],
    en: { title: 'Presidential re-elections' },
  },

  /* --- Domingo 8: conversatorios y cierre --- */
  {
    day: '2026-11-08',
    slug: 'magnicidios-victimas',
    time: '9:00 – 10:30 a.m.',
    start: '09:00',
    end: '10:30',
    type: 'conversatorio',
    title: 'Magnicidios y víctimas de la violencia',
    venueId: 'duruelo',
    speakerSlugs: ['marta-ruiz', 'guillermo-gonzalez'],
    en: { title: 'Assassinations and victims of the violence' },
  },
  {
    day: '2026-11-08',
    slug: 'mujeres-periodistas',
    time: '11:00 a.m. – 12:30 p.m.',
    start: '11:00',
    end: '12:30',
    type: 'conversatorio',
    title: 'Mujeres periodistas y conflicto',
    venueId: 'duruelo',
    speakerSlugs: ['yolanda-ruiz', 'maria-elvira-samper'],
    en: { title: 'Women journalists and the conflict' },
  },
  {
    day: '2026-11-08',
    slug: 'cierre',
    time: '12:30 – 1:00 p.m.',
    start: '12:30',
    end: '13:00',
    type: 'conversatorio',
    title: 'Cierre',
    venueId: 'duruelo',
    speakerSlugs: [],
    en: { title: 'Closing session' },
  },
];

/** Agenda con los textos del idioma pedido; en español, el array tal cual */
export function agendaFor(lang: Lang): AgendaSlot[] {
  if (lang === 'es') return agenda;
  return agenda.map((slot) => {
    if (!slot.en) throw new Error(`agenda: "${slot.slug}" sin textos en inglés`);
    return { ...slot, title: slot.en.title, note: slot.en.note ?? slot.note };
  });
}

/**
 * Comprobación en el build (feature 002): `time` visible sin `start`,
 * `start` sin `end` cuando el texto muestra un rango, o `slug` repetido.
 */
export function assertAgenda(): void {
  const seen = new Set<string>();
  for (const slot of agenda) {
    if (seen.has(slot.slug)) throw new Error(`agenda: slug repetido "${slot.slug}"`);
    seen.add(slot.slug);
    if (slot.time && !slot.start) throw new Error(`agenda: "${slot.slug}" tiene hora visible sin start`);
    if (slot.time && /[–-]/.test(slot.time) && !slot.end) {
      throw new Error(`agenda: "${slot.slug}" muestra un rango pero no tiene end`);
    }
    for (const h of [slot.start, slot.end]) {
      if (h && !/^\d{2}:\d{2}$/.test(h)) throw new Error(`agenda: "${slot.slug}" hora mal formada "${h}"`);
    }
  }
}
