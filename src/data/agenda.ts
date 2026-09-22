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
  /**
   * Página propia de la sesión (/programacion/<slug>/): un resumen de una o
   * dos frases del tema para quien no sabe nada de él, y preguntas que den
   * ganas de ir. Texto editorial, no del panelista: nada de conclusiones
   * ni de anticipar qué dirán; solo hechos públicos y preguntas. Sin
   * `intro`, la sesión no tiene página y sus enlaces van al ancla de
   * /programacion/ (bienvenida, cierre).
   */
  intro?: { summary: string; questions: string[] };
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
    intro: {
      summary:
        'La reportería es el trabajo de campo del periodismo: ir al lugar, hablar con la gente, confirmar cada dato y contrastar las versiones antes de escribir una sola línea. Una charla abierta sobre ese oficio.',
      questions: [
        '¿Qué distingue una noticia reporteada de una opinión bien escrita?',
        '¿Cómo se confirma un dato cuando las fuentes se contradicen?',
        '¿Sigue haciendo falta ir al lugar de los hechos cuando todo parece estar en internet?',
        '¿Qué le debe la memoria de un país a los reporteros que estuvieron ahí?',
      ],
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
    intro: {
      summary:
        'Sady González fotografió Bogotá en los años cuarenta y cincuenta, y entre sus imágenes están las del 9 de abril de 1948. El documental cuenta su historia y la de Esperanza Uribe, que creó el archivo Foto Sady.',
      questions: [
        '¿Qué muestra una fotografía que no alcanza a contar la crónica escrita?',
        '¿Cómo sobrevive un archivo fotográfico durante más de setenta años, y quién decide qué se guarda?',
        '¿Cómo cambia la memoria del 9 de abril el hecho de que alguien estuviera ahí con una cámara?',
        '¿Qué papel tuvo Esperanza Uribe en que esas imágenes llegaran hasta hoy?',
      ],
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
    intro: {
      summary:
        'Las redes sociales, los buscadores y los teléfonos cambiaron la manera de hacer, distribuir y leer el periodismo. Una charla abierta sobre el oficio en su versión digital.',
      questions: [
        '¿Qué se gana y qué se pierde cuando la noticia llega primero por una red social?',
        '¿Cómo compite un medio con la velocidad de lo viral sin renunciar a verificar?',
        '¿Quién decide hoy qué se lee: el editor o el algoritmo?',
        '¿Cómo se sostiene el periodismo en internet?',
      ],
    },
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
    intro: {
      summary:
        'El 9 de abril de 1948 fue asesinado en Bogotá Jorge Eliécer Gaitán y la ciudad estalló. Siguieron años de violencia entre liberales y conservadores, el gobierno militar de Gustavo Rojas Pinilla y, desde 1958, el Frente Nacional: dieciséis años en que los dos partidos se alternaron la presidencia.',
      questions: [
        '¿Por qué la muerte de un solo hombre pudo encender a todo un país?',
        '¿Qué pesó más en el pacto del Frente Nacional: la necesidad de paz o el reparto del poder?',
        '¿Quiénes quedaron por fuera de ese acuerdo, y qué hicieron entonces?',
        '¿Cómo se contaba la noticia cuando los propios periódicos tenían color político?',
      ],
    },
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
    intro: {
      summary:
        'En los años sesenta nacieron en Colombia las primeras guerrillas de izquierda, entre ellas las Farc, el ELN y el EPL. En los setenta apareció el M-19. Algunas siguieron en armas más de medio siglo.',
      questions: [
        '¿Qué llevaba a un estudiante, a un campesino o a un sacerdote a tomar las armas en esos años?',
        '¿Qué tuvieron que ver la Revolución cubana y la Guerra Fría con lo que pasaba en el monte colombiano?',
        '¿Cómo se informa sobre un grupo armado sin convertirse en su altavoz?',
        '¿Por qué una guerra que empezó en los sesenta seguía viva en el siglo XXI?',
      ],
    },
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
    intro: {
      summary:
        'Entre 1998 y 2002 el gobierno de Andrés Pastrana negoció con las Farc en una zona de distensión con centro en San Vicente del Caguán, y el proceso terminó roto. En 2016, tras cuatro años de conversaciones en La Habana, el gobierno de Juan Manuel Santos y las Farc firmaron un acuerdo de paz.',
      questions: [
        '¿Qué cambió entre el fracaso del Caguán y la firma en La Habana?',
        '¿Qué pasa en una mesa de negociación que nunca llega a los titulares?',
        '¿Qué reveló el plebiscito de 2016 sobre la manera en que el país miraba la paz?',
        '¿Cómo se cubre una negociación en la que una sola palabra puede romperla?',
      ],
    },
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
    intro: {
      summary:
        'Desde los años ochenta el narcotráfico transformó la economía, la política y la violencia en Colombia. En los noventa crecieron los grupos paramilitares, que en 1997 se agruparon en las Autodefensas Unidas de Colombia y se desmovilizaron entre 2003 y 2006.',
      questions: [
        '¿Hasta dónde llegó el dinero del narcotráfico: la política, el deporte, los medios?',
        '¿Cómo se investiga a quien puede mandar a matar al investigador?',
        '¿Qué significó para la prensa el asesinato de Guillermo Cano, director de El Espectador, en 1986?',
        '¿Qué se supo gracias a las investigaciones de la parapolítica, y qué sigue sin saberse?',
      ],
    },
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
    intro: {
      summary:
        'La Constitución de 1991 prohibió la reelección presidencial. Una reforma de 2004 la permitió, Álvaro Uribe fue reelegido en 2006 y Juan Manuel Santos en 2014. En 2015 el Congreso volvió a prohibirla.',
      questions: [
        '¿Qué se gana y qué se arriesga cuando un presidente puede quedarse cuatro años más?',
        '¿Cómo se reformó la Constitución para permitirla, y qué se supo después de ese trámite?',
        '¿Qué pasó cuando se intentó abrir la puerta a un tercer periodo?',
        '¿Qué papel tienen las cortes y la prensa cuando el poder quiere extenderse?',
      ],
    },
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
    intro: {
      summary:
        'Entre 1989 y 1990 fueron asesinados tres candidatos presidenciales: Luis Carlos Galán, Bernardo Jaramillo Ossa y Carlos Pizarro. Detrás de esos nombres hay millones de víctimas del conflicto armado, que el Estado empezó a reconocer por ley en 2011.',
      questions: [
        '¿Por qué tantos de esos crímenes tardaron décadas en esclarecerse, o nunca se esclarecieron?',
        '¿Cómo se cuenta la historia de una víctima sin reducirla a una cifra?',
        '¿Qué le toca a la prensa cuando la verdad judicial llega tarde?',
        '¿Qué cambia en un país cuando sus víctimas empiezan a tener nombre?',
      ],
    },
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
    intro: {
      summary:
        'Las mujeres periodistas han cubierto el conflicto colombiano desde las zonas de guerra, las salas de redacción y la dirección de medios, y varias lo sufrieron en carne propia, como Diana Turbay, secuestrada en 1990 y muerta en el intento de rescate en 1991.',
      questions: [
        '¿Qué vieron las mujeres periodistas que a otros se les escapaba?',
        '¿Qué costos personales pagaron por cubrir la guerra y el poder?',
        '¿Cómo era llegar a dirigir un noticiero o una revista en esos años?',
        '¿Qué ha cambiado en el oficio para las periodistas de hoy, y qué no?',
      ],
    },
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
