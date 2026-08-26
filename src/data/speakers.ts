import type { LocalizedString } from '../i18n/ui';

/**
 * REGLA DURA (FR-005): este array SOLO admite panelistas confirmados
 * explícitamente por el usuario o por el archivo de programación vigente.
 * Grafía exacta. Nada de horarios aquí: eso vive en agenda.ts.
 * Confirmados el 2026-08-25 (spec · Clarifications), sin horario.
 */

export interface Speaker {
  slug: string;
  name: string; // no se traduce
  credential: LocalizedString;
  bio: LocalizedString;
  /** import de astro:assets; null → placeholder de marca con el símbolo */
  photo: ImageMetadata | null;
  confirmed: true;
}

export const speakers: Speaker[] = [
  {
    slug: 'daniel-samper-pizano',
    name: 'Daniel Samper Pizano',
    credential: {
      es: 'Periodista y escritor · El Tiempo',
      en: 'Journalist and author · El Tiempo',
    },
    bio: {
      es: 'Pionero del periodismo investigativo en Colombia. Cronista y columnista durante más de cinco décadas.',
      en: 'A pioneer of investigative journalism in Colombia. Reporter and columnist for over five decades.',
    },
    photo: null,
    confirmed: true,
  },
  {
    slug: 'maria-jimena-duzan',
    name: 'María Jimena Duzán',
    credential: {
      es: 'Periodista y columnista',
      en: 'Journalist and columnist',
    },
    bio: {
      es: 'Ha cubierto el poder y el conflicto colombiano por más de cuarenta años, de El Espectador a Semana y su pódcast A Fondo.',
      en: 'She has covered Colombian power and conflict for over forty years, from El Espectador to Semana and her podcast A Fondo.',
    },
    photo: null,
    confirmed: true,
  },
  {
    slug: 'dario-restrepo',
    name: 'Darío Restrepo',
    credential: {
      es: 'Periodista · codirector del encuentro',
      en: 'Journalist · event co-director',
    },
    bio: {
      es: 'Codirige Testigos de la Memoria junto a Fernando Restrepo.',
      en: 'Co-directs Testigos de la Memoria alongside Fernando Restrepo.',
    },
    photo: null,
    confirmed: true,
  },
];

/** Cupos anunciados pero aún sin nombre: se muestran como "Por confirmar". */
export const tbdSlots = 3;

export function speakerBySlug(slug: string): Speaker {
  const s = speakers.find((s) => s.slug === slug);
  if (!s) throw new Error(`Speaker desconocido: ${slug}`);
  return s;
}
