/**
 * Qué cubre cada boleta, como dato (feature 004). Antes la regla vivía dentro
 * de TicketSection.astro y repetida en jsonld.ts; ahora la leen los dos y la
 * exportación de hechos (src/pages/datos/evento.json.ts), para que campañas,
 * chatbot y textos de Pretix cuenten lo mismo que el sitio.
 *
 * Una boleta de medio día es una mañana o una tarde de conversatorios: su día
 * (`covers`) y su mitad (el final de su id, "sabado-manana"). Una sesión es de
 * la tarde si empieza a las 2 p.m. o después; el cierre del domingo a las
 * 12:30 p.m. es de la mañana. Los pases cubren sus días enteros.
 */
import { agenda, type AgendaSlot } from './agenda';
import { speakers } from './speakers';
import { ticketOffers, type TicketOffer } from './event';

export type Half = 'manana' | 'tarde';

/** Mitad del día de una sesión, por su hora de inicio */
export function halfOf(slot: Pick<AgendaSlot, 'start'>): Half {
  return slot.start && Number(slot.start.slice(0, 2)) >= 14 ? 'tarde' : 'manana';
}

/** Boletas de medio día: cubren un solo día */
export const halfDayOffers = ticketOffers.filter((o) => o.covers !== 'all' && o.covers.length === 1);

/** Mitad de una boleta de medio día; null para los pases */
export function halfOfOffer(offer: TicketOffer): Half | null {
  if (!halfDayOffers.includes(offer)) return null;
  return offer.id.endsWith('-tarde') ? 'tarde' : 'manana';
}

/** ¿La boleta da entrada a esta sesión? Las charlas abiertas no llevan boleta. */
export function offerCovers(offer: TicketOffer, slot: AgendaSlot): boolean {
  if (slot.type !== 'conversatorio') return false;
  if (offer.covers === 'all') return true;
  if (!offer.covers.includes(slot.day)) return false;
  const half = halfOfOffer(offer);
  return half === null || half === halfOf(slot);
}

/** Sesiones con boleta que cubre, en el orden de la agenda */
export function sessionsOf(offer: TicketOffer): AgendaSlot[] {
  return agenda.filter((slot) => offerCovers(offer, slot));
}

/** Panelistas de las sesiones que cubre, en el orden del carrusel (el del afiche) */
export function speakerNamesOf(offer: TicketOffer): string[] {
  const slugs = new Set(sessionsOf(offer).flatMap((s) => s.speakerSlugs));
  return speakers.filter((s) => slugs.has(s.slug)).map((s) => s.name);
}

/**
 * Conversatorios temáticos: los que no son la bienvenida ni el cierre
 * (`role` en agenda.ts). Así "siete conversatorios" sale de contar.
 */
export function thematicSessionsOf(offer: TicketOffer): AgendaSlot[] {
  return sessionsOf(offer).filter((s) => !s.role);
}
