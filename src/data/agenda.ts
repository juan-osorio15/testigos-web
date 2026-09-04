import type { VenueId } from './event';

/**
 * Agenda oficial (parcial) entregada el 2026-08-26. REGLA DURA (FR-005):
 * jamás un nombre, horario o sede inventados. Lo que no está confirmado
 * simplemente se omite (decisión del usuario 2026-09-03: nada de
 * "por confirmar" visible, la venta ya está en marcha).
 * Talleres: 5 Y 6 de noviembre en Casa Museo Antonio Nariño, entrada libre.
 */

export type EventDay = '2026-11-05' | '2026-11-06' | '2026-11-07' | '2026-11-08';

export interface AgendaSlot {
  day: EventDay;
  /** Hora en formato de display ("3:00 p.m.", "9:00 – 10:30 a.m."); null → no se muestra */
  time: string | null;
  type: 'taller' | 'conversatorio';
  title: string;
  /** null → la sede aún no está confirmada y no se muestra */
  venueId: VenueId | null;
  /** Solo nombres confirmados; los cupos sin nombre no se representan */
  speakerSlugs: string[];
}

export const dayLabels: Record<EventDay, string> = {
  '2026-11-05': 'Jueves 5 de noviembre',
  '2026-11-06': 'Viernes 6 de noviembre',
  '2026-11-07': 'Sábado 7 de noviembre',
  '2026-11-08': 'Domingo 8 de noviembre',
};

export const agenda: AgendaSlot[] = [
  /* --- Jueves 5: talleres, entrada libre --- */
  {
    day: '2026-11-05',
    time: null,
    type: 'taller',
    title: 'Talleres de periodismo',
    venueId: 'casa-museo',
    speakerSlugs: [],
  },

  /* --- Viernes 6: talleres en la mañana + apertura de conversatorios --- */
  {
    day: '2026-11-06',
    time: null,
    type: 'taller',
    title: 'Talleres de periodismo',
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
  {
    day: '2026-11-06',
    time: '6:00 p.m.',
    type: 'conversatorio',
    title: 'Cóctel de bienvenida',
    venueId: null,
    speakerSlugs: [],
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
