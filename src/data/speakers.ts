/**
 * REGLA DURA (FR-005): este array SOLO admite panelistas confirmados
 * explícitamente por el usuario o por el archivo de programación vigente.
 * Grafía exacta. Nada de horarios aquí: eso vive en agenda.ts.
 *
 * Fuente: agenda parcial entregada el 2026-08-26 (todos los nombres que
 * aparecen en ella están confirmados).
 * Pendiente del organizador: credencial/medio y foto de cada panelista.
 */

export interface Speaker {
  slug: string;
  name: string;
  credential: string;
  bio: string;
  /** import de astro:assets; null → placeholder de marca con el símbolo */
  photo: ImageMetadata | null;
  confirmed: true;
}

export const speakers: Speaker[] = [
  {
    slug: 'daniel-samper-pizano',
    name: 'Daniel Samper Pizano',
    credential: 'Periodista y escritor · El Tiempo',
    bio: 'Pionero del periodismo investigativo en Colombia. Abre los conversatorios con el Bogotazo, la dictadura y el Frente Nacional.',
    photo: null,
    confirmed: true,
  },
  {
    slug: 'dario-restrepo',
    name: 'Darío Restrepo',
    credential: 'Periodista · codirector del encuentro',
    bio: 'Codirige Testigos de la Memoria junto a Fernando Cordovez. Da la bienvenida y conversa sobre el Bogotazo y el Frente Nacional.',
    photo: null,
    confirmed: true,
  },
  {
    slug: 'jorge-cardona',
    name: 'Jorge Cardona',
    credential: 'Periodista',
    bio: 'Presenta el encuentro en la sesión inaugural del viernes 6.',
    photo: null,
    confirmed: true,
  },
  {
    slug: 'marisol-gomez',
    name: 'Marisol Gómez',
    credential: 'Periodista',
    bio: 'Conversatorio: negociaciones de paz, el Caguán y La Habana.',
    photo: null,
    confirmed: true,
  },
  {
    slug: 'luz-maria-sierra',
    name: 'Luz María Sierra',
    credential: 'Periodista',
    bio: 'Conversatorio: narcotráfico y paramilitarismo.',
    photo: null,
    confirmed: true,
  },
  {
    slug: 'cecilia-orozco',
    name: 'Cecilia Orozco',
    credential: 'Periodista',
    bio: 'Conversatorio: reelecciones.',
    photo: null,
    confirmed: true,
  },
  {
    slug: 'martha-ruiz',
    name: 'Martha Ruiz',
    credential: 'Periodista',
    bio: 'Conversatorio: magnicidios y víctimas de la violencia.',
    photo: null,
    confirmed: true,
  },
  {
    slug: 'guillermo-gonzalez',
    name: 'Guillermo González',
    credential: 'Periodista',
    bio: 'Conversatorio: magnicidios y víctimas de la violencia.',
    photo: null,
    confirmed: true,
  },
  {
    slug: 'yolanda-ruiz',
    name: 'Yolanda Ruiz',
    credential: 'Periodista',
    bio: 'Conversatorio: mujeres periodistas y conflicto.',
    photo: null,
    confirmed: true,
  },
  {
    slug: 'maria-elvira-samper',
    name: 'María Elvira Samper',
    credential: 'Periodista',
    bio: 'Conversatorio: mujeres periodistas y conflicto.',
    photo: null,
    confirmed: true,
  },
];

/** Cupos anunciados pero aún sin nombre: se muestran como "Por confirmar". */
export const tbdSlots = 2;

export function speakerBySlug(slug: string): Speaker {
  const s = speakers.find((s) => s.slug === slug);
  if (!s) throw new Error(`Speaker desconocido: ${slug}`);
  return s;
}
