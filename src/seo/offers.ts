/**
 * Disponibilidad de cada boleta para el marcado (feature 002, FR-014).
 * Se calcula en el build con la fecha de Bogotá: por eso el 5 de octubre
 * hay que publicar el sitio, y al agotarse una boleta se pone `soldOut`.
 * Google solo acepta InStock, SoldOut y PreOrder.
 */
import { ticketOffers, type TicketOffer } from '../data/event';

export type Availability = 'InStock' | 'SoldOut' | 'PreOrder';

/** Fecha de hoy en el calendario de Bogotá, 'YYYY-MM-DD' */
export function todayBogota(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(now);
}

/**
 * null → la oferta ya venció y se omite del marcado (Google pide retirar
 * ofertas vencidas, no dejarlas en InStock).
 */
export function availabilityOf(offer: TicketOffer, today: string = todayBogota()): Availability | null {
  if (offer.soldOut) return 'SoldOut';
  if (today < offer.validFrom) return 'PreOrder';
  if (offer.validThrough !== null && today > offer.validThrough) return null;
  return 'InStock';
}

export interface OfferStatus {
  offer: TicketOffer;
  availability: Availability | null;
}

/** Todas las boletas con su estado de hoy, en el orden de venta */
export function offerStatuses(today: string = todayBogota()): OfferStatus[] {
  return ticketOffers.map((offer) => ({ offer, availability: availabilityOf(offer, today) }));
}

/** Solo las que van al marcado (las vencidas se omiten) */
export function activeOffers(today: string = todayBogota()): OfferStatus[] {
  return offerStatuses(today).filter((s) => s.availability !== null);
}

/** Fecha ISO con hora y desfase de Bogotá para validFrom/validThrough */
export function bogotaStart(date: string): string {
  return `${date}T00:00:00-05:00`;
}
export function bogotaEnd(date: string): string {
  return `${date}T23:59:59-05:00`;
}
