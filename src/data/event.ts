/**
 * Hechos del evento. Fuente: spec (Clarifications 2026-08-25).
 * Fechas de comunicación: 5 al 8 de noviembre (talleres gratuitos el 5;
 * conversatorios con boleta del 6 al 8). FR-001.
 */
import photoDuruelo from '../assets/venues/duruelo.jpg';
import photoCasaMuseo from '../assets/venues/casa-museo.jpg';

export const event = {
  name: 'Testigos de la Memoria',
  startDate: '2026-11-05',
  endDate: '2026-11-08',
  city: 'Villa de Leyva, Colombia',
  organizers: ['Fernando Cordovez', 'Darío Restrepo'],
  description:
    'Los periodistas que cubrieron los últimos cincuenta años de Colombia cuentan y analizan, en persona, los hechos que vivieron de frente. Conversatorios y talleres en Villa de Leyva, del 5 al 8 de noviembre de 2026.',
} as const;

export type VenueId = 'casa-museo' | 'duruelo';

export interface Venue {
  id: VenueId;
  name: string;
  /* Dirección en texto plano (FR-006). Verificar con el organizador antes del deploy final. */
  address: string;
  role: string;
  mapsUrl: string;
  /** Etiqueta corta del bloque de presentación ("Sede de los conversatorios") */
  kicker: string;
  /** Reseña breve y atractiva del lugar (3-4 frases, con fuente en docs/sedes.md) */
  summary: string;
  /** Foto del lugar (astro:assets); null → sin bloque de foto */
  photo: ImageMetadata | null;
  /** Texto alternativo de la foto */
  photoAlt: string;
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
    kicker: 'Sede de los conversatorios',
    summary:
      'Un hotel en lo alto del pueblo, abierto en 1973 y concebido como las hospederías de los antiguos monasterios europeos: corredores, balcones y jardines desde donde se ve todo Villa de Leyva y el valle. Su nombre recuerda a Duruelo, el pueblo castellano donde San Juan de la Cruz fundó el primer convento de carmelitas descalzos.',
    photo: photoDuruelo,
    photoAlt: 'Fachada de la Hospedería Duruelo, con sus arcos y balcones cubiertos de buganvilias',
  },
  {
    id: 'casa-museo',
    name: 'Casa Museo Antonio Nariño',
    address: 'Carrera 9 n.º 10-25, Villa de Leyva, Boyacá',
    role: 'Talleres de periodismo · entrada libre · 5 y 6 de noviembre',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Casa+Museo+Antonio+Nari%C3%B1o+Villa+de+Leyva',
    kicker: 'Sede de los talleres',
    summary:
      'Una casona colonial de finales del siglo XVII, con balcón de madera y patio empedrado en torno a una fuente de piedra. Aquí pasó sus últimos meses y murió, en diciembre de 1823, Antonio Nariño, el precursor que tradujo los Derechos del Hombre. Es Monumento Nacional desde 1961 y hoy un museo de cuatro salas sobre la vida de la Colonia y la República.',
    photo: photoCasaMuseo,
    photoAlt: 'Jardín de la Casa Museo Antonio Nariño, con su fuente de piedra y la casa de tejas al fondo',
  },
];

export function venueById(id: VenueId): Venue {
  const v = venues.find((v) => v.id === id);
  if (!v) throw new Error(`Venue desconocida: ${id}`);
  return v;
}
