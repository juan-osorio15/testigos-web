/**
 * Hechos del evento en JSON, generados en el build desde src/data/ y
 * src/config.ts (feature 004). Es la puerta de la fuente para lo que no
 * puede importar los .ts del sitio: las campañas en Python, los generadores
 * de imágenes, el informe y la comprobación de vigencia leen
 * dist/datos/evento.json. Queda publicado en /datos/evento.json: solo datos
 * públicos, sin llaves ni datos de personas. No va en el sitemap.
 *
 * Lo que depende de la fecha (etapa, disponibilidad) se calcula con el día
 * del build (`generado`): quien lo lea debe negarse si es de otro día.
 */
import type { APIRoute } from 'astro';
import {
  DATA_CONTACT_EMAIL,
  EVENTALIST_BACKEND,
  EVENTALIST_CAMPAIGN,
  INSTAGRAM_DM_URL,
  PRETIX_EVENT_URL,
  SITE_URL,
  WHATSAPP_URL,
  CONTACT_CHANNEL,
  pretixReady,
} from '../../config';
import { agenda } from '../../data/agenda';
import { doorSales, event, salesStages, ticketOffers, venues, type TicketOffer } from '../../data/event';
import { speakers, speakerBySlug } from '../../data/speakers';
import { halfDayOffers, halfOfOffer, sessionsOf, speakerNamesOf, thematicSessionsOf } from '../../data/boletas';
import { availabilityOf, todayBogota } from '../../seo/offers';

const today = todayBogota();

function stageOf(day: string): 1 | 2 | 3 {
  if (day <= salesStages.stage1End) return 1;
  if (day <= salesStages.stage2End) return 2;
  return 3;
}

/* Lo que costarían por separado las boletas de medio día que cubre un pase */
function separately(offer: TicketOffer): number | null {
  if (halfOfOffer(offer) !== null) return null;
  return halfDayOffers
    .filter((h) => sessionsOf(h).some((s) => sessionsOf(offer).includes(s)))
    .reduce((sum, h) => sum + h.price, 0);
}

const [, pretixOrganizer, pretixEvent] = new URL(PRETIX_EVENT_URL).pathname.split('/');

const facts = {
  generado: today,
  evento: {
    nombre: event.name,
    lema: event.tagline,
    inicio: event.startDate,
    fin: event.endDate,
    ciudad: event.city,
    organizadores: event.organizers,
    sitio: SITE_URL,
  },
  etapas: { ...salesStages, actual: stageOf(today) },
  tiendaAbierta: pretixReady,
  ventaEnPuerta: doorSales,
  boletas: ticketOffers.map((o) => ({
    id: o.id,
    nombre: o.name,
    productoPretix: o.pretixProduct,
    precio: o.price,
    moneda: o.currency,
    precioPorSeparado: separately(o),
    mitad: halfOfOffer(o),
    disponibilidad: availabilityOf(o, today),
    desde: o.validFrom,
    hasta: o.validThrough,
    sesiones: sessionsOf(o).map((s) => s.slug),
    conversatoriosTematicos: thematicSessionsOf(o).length,
    panelistas: speakerNamesOf(o),
  })),
  sedes: venues.map((v) => ({
    id: v.id,
    nombre: v.name,
    direccion: v.address,
    aforo: v.capacity,
    papel: v.role,
    mapa: v.mapsUrl,
  })),
  sesiones: agenda.map((s) => ({
    slug: s.slug,
    dia: s.day,
    hora: s.time,
    inicio: s.start,
    fin: s.end,
    tipo: s.type,
    papel: s.role ?? null,
    titulo: s.title,
    sede: s.venueId,
    panelistas: s.speakerSlugs.map((slug) => speakerBySlug(slug).name),
    invitados: s.guests ?? [],
  })),
  panelistas: speakers.map((s) => ({ slug: s.slug, nombre: s.name, credencial: s.credential })),
  conteos: {
    conversatoriosTematicos: agenda.filter((s) => s.type === 'conversatorio' && !s.role).length,
    charlasAbiertas: agenda.filter((s) => s.type === 'charla').length,
    panelistas: speakers.length,
    diasDelEncuentro: new Set(agenda.map((s) => s.day)).size,
  },
  contacto: {
    correo: DATA_CONTACT_EMAIL,
    whatsapp: WHATSAPP_URL,
    instagram: INSTAGRAM_DM_URL,
    canalDeLosBotones: CONTACT_CHANNEL,
  },
  integraciones: {
    tienda: PRETIX_EVENT_URL,
    pretixOrganizador: pretixOrganizer,
    pretixEvento: pretixEvent,
    backend: EVENTALIST_BACKEND,
    campanaBackend: EVENTALIST_CAMPAIGN,
  },
};

export const GET: APIRoute = () =>
  new Response(`${JSON.stringify(facts, null, 2)}\n`, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
