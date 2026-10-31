/**
 * Hechos del evento. Fuente: spec (Clarifications 2026-08-25).
 * Fechas de comunicación: 5 al 8 de noviembre (charlas abiertas el 5 y 6;
 * conversatorios con boleta del 6 al 8). FR-001.
 */
import photoDuruelo from '../assets/venues/duruelo.jpg';
import photoCasaMuseo from '../assets/venues/casa-museo-patio.jpg';
import logoDuruelo from '../assets/partners/duruelo.png';
import logoCasaMuseo from '../assets/partners/casa-museo.png';
import type { EventDay } from './agenda';
import type { Lang } from '../i18n';

export const event = {
  name: 'Testigos de la Memoria',
  /** Subtítulo de marca; nombre alternativo de la entidad en los buscadores */
  tagline: 'Periodistas en la Historia',
  startDate: '2026-11-05',
  endDate: '2026-11-08',
  /* Hora de la primera y de la última sesión (agenda.ts), con zona horaria de
     Bogotá: el JSON-LD de Google pide ISO-8601 con desfase. */
  startDateTime: '2026-11-05T10:00:00-05:00',
  endDateTime: '2026-11-08T13:00:00-05:00',
  city: 'Villa de Leyva, Colombia',
  organizers: ['Fernando Cordovez', 'Darío Restrepo'],
  description:
    'Los periodistas que cubrieron los últimos cincuenta años de Colombia cuentan y analizan, en persona, los hechos que vivieron de frente. Conversatorios y charlas abiertas en Villa de Leyva, del 5 al 8 de noviembre de 2026.',
  /** Perfiles públicos del encuentro (sameAs del JSON-LD; solo los verificados) */
  socialProfiles: ['https://www.instagram.com/testigosdelamemoria/'],
} as const;

/**
 * Etapas de venta (decisión del organizador, 2026-09-15). La etapa 1 vende
 * solo el pase completo, con su mayor descuento; el martes 13 de octubre
 * abre la etapa 2 con las boletas por franja y el pase SIGUE a la venta con
 * un descuento menor (usuario, 2026-09-30: la etapa 1 va hasta el lunes 12
 * de octubre, no hasta el 4, y el pase ya no se retira). El 2026-10-22 la
 * etapa 2 pasa a ser la del pase de fin de semana con su mejor precio, hasta
 * el jueves 29 de octubre inclusive; desde el viernes 30 (etapa 3) todo
 * sigue a la venta, con menos descuento. Fechas en calendario de Bogotá; los
 * finales son inclusivos y cada cambio ocurre a las 0:00 del primer día de
 * la etapa siguiente. Pretix es quien abre y cierra los productos y cambia
 * los precios: aquí solo se cuenta al público.
 */
export const salesStages = {
  stage1End: '2026-10-12',
  stage2Start: '2026-10-13',
  stage2End: '2026-10-29',
  stage3Start: '2026-10-30',
} as const;

/**
 * Promoción "compra 5, la sexta gratis" (titular, 2026-10-30): con seis
 * boletas del mismo tipo en una orden, una sale gratis, y como máximo una
 * por orden. La aplica Pretix con un descuento automático por boleta y un
 * tope de 11 por orden (docs/pretix/descuento-sexta-gratis.md); aquí solo
 * se cuenta al público. Para apagarla en el sitio, `active: false`.
 */
export const sixthFree = {
  active: true,
  since: '2026-10-30',
  paid: 5,
  free: 1,
  maxFreePerOrder: 1,
} as const;

export type TicketOfferId =
  | 'pase-completo'
  | 'fin-de-semana'
  | 'viernes-tarde'
  | 'sabado-manana'
  | 'sabado-tarde'
  | 'domingo-manana';

export interface TicketOffer {
  id: TicketOfferId;
  /** Nombre visible y del marcado */
  name: string;
  /**
   * Nombre literal del producto en Pretix (leído en la API el 2026-10-17).
   * Es la clave con la que TicketSection y la intención de
   * compra reconocen el producto en el widget.
   */
  pretixProduct: string;
  /** COP, entero */
  price: number;
  currency: 'COP';
  /** Primer día de venta (inclusive, calendario de Bogotá) */
  validFrom: string;
  /** Último día de venta (inclusive) o null si vende hasta el evento */
  validThrough: string | null;
  /**
   * INTERRUPTOR DE AGOTADO (FR-014). Se pone en true a mano cuando Pretix
   * reporta la boleta agotada, se publica, y el marcado pasa a SoldOut.
   * Nunca se infiere del widget.
   */
  soldOut: boolean;
  /**
   * Días de la agenda que cubre; el pase cubre todos los conversatorios.
   * Con un solo día es una boleta de medio día (su id dice qué mitad); con
   * varios, cubre los días enteros.
   */
  covers: 'all' | EventDay[];
}

/**
 * Boletas a la venta (docs/pretix/pretix-tienda-textos.md). Alimentan el JSON-LD y
 * el texto plano de precios; el precio que se cobra lo pinta el widget de
 * Pretix. La disponibilidad de cada una se calcula en el build a partir de
 * las etapas y de `soldOut` (src/seo/offers.ts).
 *
 * OPERACIÓN: el 13 de octubre (stage2Start) hay que publicar el sitio para
 * que el build ponga las franjas en venta, y ANTES cambiar `price` del pase
 * al precio de la etapa 2 (el mismo que se ponga en Pretix). Al agotarse una
 * boleta: `soldOut: true`, commit y publicación con visto bueno.
 *
 * El 30 de octubre (stage3Start) el pase de fin de semana subió en Pretix a
 * 255.000 (titular, 2026-10-30) y aquí se cambió `price` al mismo valor.
 */
export const ticketOffers: TicketOffer[] = [
  {
    id: 'pase-completo',
    name: 'Pase completo',
    pretixProduct: 'Pase Completo',
    /* Precio de la etapa 2, el mismo de Pretix (leído en la API el 2026-10-17) */
    price: 340000,
    currency: 'COP',
    /** Día en que la tienda quedó a la venta en la portada (commit 74f7049) */
    validFrom: '2026-09-09',
    /* Sigue a la venta en la etapa 2, con menos descuento (2026-09-30) */
    validThrough: null,
    soldOut: false,
    covers: 'all',
  },
  {
    id: 'fin-de-semana',
    name: 'Pase de fin de semana',
    /* Nombre que se le da en Pretix al crearlo (2026-10-22) */
    pretixProduct: 'Pase Fin de Semana',
    /* Precio de la etapa 3 (titular, 2026-10-30; en la 2 fue 240.000). Sigue
       con descuento: en Pretix y en el sitio va con el de las tres boletas de
       medio día del sábado y el domingo tachado */
    price: 255000,
    currency: 'COP',
    validFrom: '2026-10-22',
    /* Sigue a la venta en la etapa 3, con menos descuento */
    validThrough: null,
    soldOut: false,
    covers: ['2026-11-07', '2026-11-08'],
  },
  {
    id: 'viernes-tarde',
    name: 'Viernes en la tarde',
    pretixProduct: 'Viernes Tarde',
    price: 90000,
    currency: 'COP',
    validFrom: salesStages.stage2Start,
    validThrough: null,
    soldOut: false,
    covers: ['2026-11-06'],
  },
  {
    id: 'sabado-manana',
    name: 'Sábado en la mañana',
    pretixProduct: 'Sábado Mañana',
    price: 90000,
    currency: 'COP',
    validFrom: salesStages.stage2Start,
    validThrough: null,
    soldOut: false,
    covers: ['2026-11-07'],
  },
  {
    id: 'sabado-tarde',
    name: 'Sábado en la tarde',
    pretixProduct: 'Sábado Tarde',
    price: 90000,
    currency: 'COP',
    validFrom: salesStages.stage2Start,
    validThrough: null,
    soldOut: false,
    covers: ['2026-11-07'],
  },
  {
    id: 'domingo-manana',
    name: 'Domingo en la mañana',
    pretixProduct: 'Domingo Mañana',
    price: 90000,
    currency: 'COP',
    validFrom: salesStages.stage2Start,
    validThrough: null,
    soldOut: false,
    covers: ['2026-11-08'],
  },
];

/**
 * Venta en la puerta (titular, 2026-10-19): existe, dentro del hotel y para
 * casos puntuales, pero no se publicita. Si alguien pregunta, se confirma
 * sin prometer cupo.
 */
export const doorSales = { available: true, advertised: false } as const;

/** Formato de precio en texto plano: "340.000 COP" (en inglés, "340,000 COP") */
export function formatPrice(offer: Pick<TicketOffer, 'price' | 'currency'>, lang: Lang = 'es'): string {
  return `${offer.price.toLocaleString(lang === 'en' ? 'en-US' : 'es-CO')} ${offer.currency}`;
}

export type VenueId = 'casa-museo' | 'duruelo';

export interface Venue {
  id: VenueId;
  name: string;
  /* Dirección en texto plano (FR-006). Verificar con el organizador antes del deploy final. */
  address: string;
  role: string;
  mapsUrl: string;
  /**
   * Coordenadas del pin del mapa (decimales, WGS84) para el marcado del
   * evento y la página de cómo llegar. Autorizado por el usuario el
   * 2026-09-16 tomarlas de los pines públicos.
   */
  geo: { latitude: number; longitude: number };
  /**
   * Aforo máximo de asistentes; null mientras no esté confirmado. No se
   * muestra en el sitio: lo usan el chatbot y los textos (evento.json).
   */
  capacity: number | null;
  /** Etiqueta corta del bloque de presentación ("Sede de los conversatorios") */
  kicker: string;
  /** Reseña breve y atractiva del lugar (3-4 frases, con fuente en docs/evento/sedes.md) */
  summary: string;
  /** Foto del lugar (astro:assets); null → sin bloque de foto */
  photo: ImageMetadata | null;
  /** Texto alternativo de la foto */
  photoAlt: string;
  /** Logo de la sede (crema monocromo, el mismo del pie); null → sin logo */
  logo: ImageMetadata | null;
  /** Alto relativo del logo en el bloque de la sede (1 = base); los logos verticales necesitan más */
  logoScale: number;
  /** Textos para la portada en inglés (/en/); `venuesFor('en')` los sustituye */
  en?: Pick<Venue, 'role' | 'kicker' | 'summary' | 'photoAlt'>;
}

/* Orden de presentación: la sede principal (conversatorios) primero. */
export const venues: Venue[] = [
  {
    id: 'duruelo',
    name: 'Hospedería Duruelo',
    address: 'Carrera 3 n.º 12-88, Villa de Leyva, Boyacá',
    role: 'Conversatorios · con boleta · 6 al 8 de noviembre',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Hospeder%C3%ADa+Duruelo+Villa+de+Leyva',
    /* Pin de OpenStreetMap "Duruelo" (hotel), 2026-09-17 */
    geo: { latitude: 5.62874, longitude: -73.51792 },
    /* Capacidad máxima confirmada por el titular el 2026-10-19 */
    capacity: 300,
    kicker: 'Sede de los conversatorios',
    summary:
      'Un hotel en lo alto del pueblo, abierto en 1973 y concebido como las hospederías de los antiguos monasterios europeos: corredores, balcones y jardines desde donde se ve todo Villa de Leyva y el valle. Su nombre recuerda a Duruelo, el pueblo castellano donde San Juan de la Cruz fundó el primer convento de carmelitas descalzos.',
    photo: photoDuruelo,
    photoAlt: 'Fachada de la Hospedería Duruelo, con sus arcos y balcones cubiertos de buganvilias',
    logo: logoDuruelo,
    logoScale: 1,
    en: {
      role: 'Panel conversations · ticket required · November 6–8',
      kicker: 'Venue for the panel conversations',
      summary:
        'A hotel at the top of the town, opened in 1973 and conceived like the guesthouses of the old European monasteries: corridors, balconies and gardens overlooking all of Villa de Leyva and the valley. Its name recalls Duruelo, the Castilian village where Saint John of the Cross founded the first convent of the Discalced Carmelites.',
      photoAlt: 'Facade of Hospedería Duruelo, with its arches and balconies covered in bougainvillea',
    },
  },
  {
    id: 'casa-museo',
    name: 'Casa Museo Antonio Nariño',
    address: 'Carrera 9 n.º 10-25, Villa de Leyva, Boyacá',
    role: 'Charlas abiertas · entrada libre · 5 y 6 de noviembre',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Casa+Museo+Antonio+Nari%C3%B1o+Villa+de+Leyva',
    /* Pin de OpenStreetMap "Casa museo Antonio Nariño" (museum), 2026-09-17 */
    geo: { latitude: 5.63209, longitude: -73.52497 },
    /* Pendiente: el titular lo averigua (2026-10-19) */
    capacity: null,
    kicker: 'Sede de las charlas abiertas',
    summary:
      'Una casona colonial construida a finales del siglo XVII. Desde su creación ha tenido diversos usos y se considera que fue la última morada del precursor Antonio Nariño y el lugar de su fallecimiento en diciembre de 1823. Fue declarada Monumento Nacional en 1961. Actualmente es una institución museal, dedicada a conservar la memoria y el legado del traductor de los Derechos del Hombre.',
    photo: photoCasaMuseo,
    photoAlt: 'Patio central de la Casa Museo Antonio Nariño: la fuente de piedra sobre el empedrado y la arcada de columnas alrededor',
    logo: logoCasaMuseo,
    logoScale: 1.5,
    en: {
      role: 'Open talks · free admission · November 5 and 6',
      kicker: 'Venue for the open talks',
      summary:
        'A colonial mansion built in the late 17th century. It has served many purposes over the years and is considered the last home of independence precursor Antonio Nariño, who died there in December 1823. Declared a National Monument in 1961, it is now a museum dedicated to preserving the memory and legacy of the man who translated the Declaration of the Rights of Man into Spanish.',
      photoAlt: 'Central courtyard of Casa Museo Antonio Nariño: the stone fountain on the cobblestones and the colonnaded arcade around it',
    },
  },
];

/** Sedes con los textos del idioma pedido; en español, el array tal cual */
export function venuesFor(lang: Lang): Venue[] {
  if (lang === 'es') return venues;
  return venues.map((v) => {
    if (!v.en) throw new Error(`Venue sin textos en inglés: ${v.id}`);
    return { ...v, ...v.en };
  });
}

export function venueById(id: VenueId, lang: Lang = 'es'): Venue {
  const v = venuesFor(lang).find((v) => v.id === id);
  if (!v) throw new Error(`Venue desconocida: ${id}`);
  return v;
}
