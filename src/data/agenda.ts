import type { LocalizedString } from '../i18n/ui';
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
  title: LocalizedString | null;
  venueId: VenueId;
  speakerSlugs: string[];
}

export const dayLabels: Record<EventDay, LocalizedString> = {
  '2026-11-05': { es: 'Jueves 5 de noviembre', en: 'Thursday, November 5' },
  '2026-11-06': { es: 'Viernes 6 de noviembre', en: 'Friday, November 6' },
  '2026-11-07': { es: 'Sábado 7 de noviembre', en: 'Saturday, November 7' },
  '2026-11-08': { es: 'Domingo 8 de noviembre', en: 'Sunday, November 8' },
};

export const agenda: AgendaSlot[] = [
  {
    day: '2026-11-05',
    time: null,
    type: 'taller',
    title: { es: 'Talleres de periodismo', en: 'Journalism workshops' },
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
