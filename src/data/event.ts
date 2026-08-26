/**
 * Hechos del evento. Fuente: spec (Clarifications 2026-08-25).
 * Fechas de comunicación: 5 al 8 de noviembre (talleres gratuitos el 5;
 * conversatorios con boleta del 6 al 8). FR-001.
 */
export const event = {
  name: 'Testigos de la Memoria',
  startDate: '2026-11-05',
  endDate: '2026-11-08',
  city: 'Villa de Leyva, Colombia',
  organizers: ['Fernando Restrepo', 'Darío Restrepo'],
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
}

export const venues: Venue[] = [
  {
    id: 'casa-museo',
    name: 'Casa Museo Antonio Nariño',
    address: 'Carrera 9 n.º 10-25, Villa de Leyva, Boyacá',
    role: 'Talleres de periodismo · entrada libre · 5 de noviembre',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Casa+Museo+Antonio+Nari%C3%B1o+Villa+de+Leyva',
  },
  {
    id: 'duruelo',
    name: 'Hospedería Duruelo',
    address: 'Carrera 3 n.º 12-88, Villa de Leyva, Boyacá',
    role: 'Conversatorios · con boleta · 6 al 8 de noviembre',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Hospeder%C3%ADa+Duruelo+Villa+de+Leyva',
  },
];

export function venueById(id: VenueId): Venue {
  const v = venues.find((v) => v.id === id);
  if (!v) throw new Error(`Venue desconocida: ${id}`);
  return v;
}
