import type { VenueId } from './event';

/**
 * Agenda de los 4 días. REGLA DURA (FR-005): `time: null` = "por confirmar";
 * jamás un horario inventado. Hoy TODOS los horarios están sin confirmar.
 * Cuando llegue el archivo de programación, esta estructura lo absorbe.
 */

export type EventDay = '2026-11-05' | '2026-11-06' | '2026-11-07' | '2026-11-08';

export interface AgendaSlot {
  day: EventDay;
  /** 'HH:MM' solo cuando la programación lo confirme */
  time: string | null;
  type: 'taller' | 'conversatorio';
  /** null → "programación por confirmar" */
  title: string | null;
  venueId: VenueId;
  speakerSlugs: string[];
}

export const dayLabels: Record<EventDay, string> = {
  '2026-11-05': 'Jueves 5 de noviembre',
  '2026-11-06': 'Viernes 6 de noviembre',
  '2026-11-07': 'Sábado 7 de noviembre',
  '2026-11-08': 'Domingo 8 de noviembre',
};

export const agenda: AgendaSlot[] = [
  {
    day: '2026-11-05',
    time: null,
    type: 'taller',
    title: 'Talleres de periodismo',
    venueId: 'casa-museo',
    speakerSlugs: [],
  },
  {
    day: '2026-11-06',
    time: null,
    type: 'conversatorio',
    title: null,
    venueId: 'duruelo',
    speakerSlugs: [],
  },
  {
    day: '2026-11-07',
    time: null,
    type: 'conversatorio',
    title: null,
    venueId: 'duruelo',
    speakerSlugs: [],
  },
  {
    day: '2026-11-08',
    time: null,
    type: 'conversatorio',
    title: null,
    venueId: 'duruelo',
    speakerSlugs: [],
  },
];
