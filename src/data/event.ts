/**
 * Hechos del evento. Fuente: spec (Clarifications 2026-08-25).
 * Fechas de comunicación: 5 al 8 de noviembre (charlas abiertas el 5 y 6;
 * conversatorios con boleta del 6 al 8). FR-001.
 */
import photoDuruelo from '../assets/venues/duruelo.jpg';
import photoCasaMuseo from '../assets/venues/casa-museo.jpg';
import logoDuruelo from '../assets/partners/duruelo.png';
import logoCasaMuseo from '../assets/partners/casa-museo.png';
import type { EventDay } from './agenda';

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
 * Etapas de venta (decisión del organizador, 2026-09-15). La etapa 1 dura
 * tres semanas desde la del 14 de septiembre y vende solo el pase completo;
 * el lunes 5 de octubre abre la etapa 2 con las boletas por franja y el
 * pase completo se retira. Fechas en calendario de Bogotá; la primera es
 * inclusiva y el cambio ocurre a las 0:00 de `stage2Start`. Pretix es quien
 * abre y cierra los productos: aquí solo se cuenta al público.
 */
export const salesStages = {
  stage1End: '2026-10-04',
  stage2Start: '2026-10-05',
} as const;

export type TicketOfferId =
  | 'pase-completo'
  | 'viernes-tarde'
  | 'sabado-manana'
  | 'sabado-tarde'
  | 'domingo-manana';

export interface TicketOffer {
  id: TicketOfferId;
  /** Nombre visible y del marcado */
  name: string;
  /**
   * Nombre literal del producto en Pretix (confirmado por el usuario el
   * 2026-09-16). Es la clave con la que TicketSection y la intención de
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
  /** Días de la agenda que cubre; el pase cubre todos los conversatorios */
  covers: 'all' | EventDay[];
}

/**
 * Boletas a la venta (docs/pretix-tienda-textos.md). Alimentan el JSON-LD y
 * el texto plano de precios; el precio que se cobra lo pinta el widget de
 * Pretix. La disponibilidad de cada una se calcula en el build a partir de
 * las etapas y de `soldOut` (src/seo/offers.ts).
 *
 * OPERACIÓN: el 5 de octubre (stage2Start) hay que publicar el sitio para
 * que el build retire el pase y ponga las franjas en venta. Al agotarse una
 * boleta: `soldOut: true`, commit y publicación con visto bueno.
 */
export const ticketOffers: TicketOffer[] = [
  {
    id: 'pase-completo',
    name: 'Pase completo',
    pretixProduct: 'Pase completo',
    price: 310000,
    currency: 'COP',
    /** Día en que la tienda quedó a la venta en la portada (commit 74f7049) */
    validFrom: '2026-09-09',
    validThrough: salesStages.stage1End,
    soldOut: false,
    covers: 'all',
  },
  {
    id: 'viernes-tarde',
    name: 'Viernes en la tarde',
    pretixProduct: 'Viernes tarde',
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
    pretixProduct: 'Sábado mañana',
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
    pretixProduct: 'Sábado tarde',
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
    pretixProduct: 'Domingo mañana',
    price: 90000,
    currency: 'COP',
    validFrom: salesStages.stage2Start,
    validThrough: null,
    soldOut: false,
    covers: ['2026-11-08'],
  },
];

/** Formato de precio en texto plano: "310.000 COP" */
export function formatPrice(offer: Pick<TicketOffer, 'price' | 'currency'>): string {
  return `${offer.price.toLocaleString('es-CO')} ${offer.currency}`;
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
  /** Etiqueta corta del bloque de presentación ("Sede de los conversatorios") */
  kicker: string;
  /** Reseña breve y atractiva del lugar (3-4 frases, con fuente en docs/sedes.md) */
  summary: string;
  /** Foto del lugar (astro:assets); null → sin bloque de foto */
  photo: ImageMetadata | null;
  /** Texto alternativo de la foto */
  photoAlt: string;
  /** Logo de la sede (crema monocromo, el mismo del pie); null → sin logo */
  logo: ImageMetadata | null;
  /** Alto relativo del logo en el bloque de la sede (1 = base); los logos verticales necesitan más */
  logoScale: number;
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
    kicker: 'Sede de los conversatorios',
    summary:
      'Un hotel en lo alto del pueblo, abierto en 1973 y concebido como las hospederías de los antiguos monasterios europeos: corredores, balcones y jardines desde donde se ve todo Villa de Leyva y el valle. Su nombre recuerda a Duruelo, el pueblo castellano donde San Juan de la Cruz fundó el primer convento de carmelitas descalzos.',
    photo: photoDuruelo,
    photoAlt: 'Fachada de la Hospedería Duruelo, con sus arcos y balcones cubiertos de buganvilias',
    logo: logoDuruelo,
    logoScale: 1,
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
    kicker: 'Sede de las charlas abiertas',
    summary:
      'Una casona colonial construida a finales del siglo XVII. Desde su creación ha tenido diversos usos y se considera que fue la última morada del precursor Antonio Nariño y el lugar de su fallecimiento en diciembre de 1823. Fue declarada Monumento Nacional en 1961. Actualmente es una institución museal, dedicada a conservar la memoria y el legado del traductor de los Derechos del Hombre.',
    photo: photoCasaMuseo,
    photoAlt: 'Jardín de la Casa Museo Antonio Nariño, con su fuente de piedra y la casa de tejas al fondo',
    logo: logoCasaMuseo,
    logoScale: 1.5,
  },
];

export function venueById(id: VenueId): Venue {
  const v = venues.find((v) => v.id === id);
  if (!v) throw new Error(`Venue desconocida: ${id}`);
  return v;
}
