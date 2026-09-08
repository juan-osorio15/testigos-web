import type { VenueId } from './event';

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
  /** Hora en formato de display ("3:00 p.m.", "9:00 – 10:30 a.m."); null → no se muestra */
  time: string | null;
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
}

export const dayLabels: Record<EventDay, string> = {
  '2026-11-05': 'Jueves 5 de noviembre',
  '2026-11-06': 'Viernes 6 de noviembre',
  '2026-11-07': 'Sábado 7 de noviembre',
  '2026-11-08': 'Domingo 8 de noviembre',
};

export const agenda: AgendaSlot[] = [
  /* --- Jueves 5: charlas abiertas, entrada libre --- */
  {
    day: '2026-11-05',
    time: '10:00 a.m. – 12:00 m.',
    type: 'charla',
    title: 'Charla de reportería',
    venueId: 'casa-museo',
    speakerSlugs: [],
    guests: ['Daniel Esteban Alvarado'],
    note: 'Docente del programa de Comunicación Social de la Universidad de Boyacá.',
  },
  {
    day: '2026-11-05',
    time: '3:00 p.m.',
    type: 'charla',
    title: 'Documental: Sady González, una luz en la memoria',
    venueId: 'casa-museo',
    speakerSlugs: ['guillermo-gonzalez'],
    note: 'La historia del fotógrafo Sady González, pionero de la reportería gráfica en Colombia, y de Esperanza Uribe, creadora del archivo Foto Sady. La Bogotá de los años cuarenta y cincuenta, con las imágenes del 9 de abril de 1948. Presenta Guillermo González Uribe, codirector.',
  },

  /* --- Viernes 6: charla abierta en la mañana + apertura de conversatorios --- */
  {
    day: '2026-11-06',
    time: '10:00 a.m.',
    type: 'charla',
    title: 'Charla de periodismo digital',
    venueId: 'casa-museo',
    speakerSlugs: [],
  },
  {
    day: '2026-11-06',
    time: '3:00 p.m.',
    type: 'conversatorio',
    title: 'Bienvenida y presentación',
    venueId: 'duruelo',
    speakerSlugs: ['dario-restrepo', 'jorge-cardona'],
  },
  {
    day: '2026-11-06',
    time: '3:30 – 6:00 p.m.',
    type: 'conversatorio',
    title: 'Bogotazo, dictadura y Frente Nacional (1958-1974)',
    venueId: 'duruelo',
    speakerSlugs: ['daniel-samper-pizano', 'dario-restrepo'],
  },

  /* --- Sábado 7: conversatorios --- */
  {
    day: '2026-11-07',
    time: '9:00 – 10:30 a.m.',
    type: 'conversatorio',
    title: 'Surgimiento de las guerrillas',
    venueId: 'duruelo',
    speakerSlugs: [],
  },
  {
    day: '2026-11-07',
    time: '11:00 a.m. – 12:30 p.m.',
    type: 'conversatorio',
    title: 'Negociaciones de paz, el Caguán y La Habana',
    venueId: 'duruelo',
    speakerSlugs: ['marisol-gomez'],
  },
  {
    day: '2026-11-07',
    time: '3:00 – 4:30 p.m.',
    type: 'conversatorio',
    title: 'Narcotráfico y paramilitarismo',
    venueId: 'duruelo',
    speakerSlugs: ['luz-maria-sierra'],
  },
  {
    day: '2026-11-07',
    time: '5:00 – 6:30 p.m.',
    type: 'conversatorio',
    title: 'Reelecciones',
    venueId: 'duruelo',
    speakerSlugs: ['cecilia-orozco'],
  },

  /* --- Domingo 8: conversatorios y cierre --- */
  {
    day: '2026-11-08',
    time: '9:00 – 10:30 a.m.',
    type: 'conversatorio',
    title: 'Magnicidios y víctimas de la violencia',
    venueId: 'duruelo',
    speakerSlugs: ['marta-ruiz', 'guillermo-gonzalez'],
  },
  {
    day: '2026-11-08',
    time: '11:00 a.m. – 12:30 p.m.',
    type: 'conversatorio',
    title: 'Mujeres periodistas y conflicto',
    venueId: 'duruelo',
    speakerSlugs: ['yolanda-ruiz', 'maria-elvira-samper'],
  },
  {
    day: '2026-11-08',
    time: '12:30 – 1:00 p.m.',
    type: 'conversatorio',
    title: 'Cierre',
    venueId: 'duruelo',
    speakerSlugs: [],
  },
];
