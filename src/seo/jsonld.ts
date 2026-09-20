/**
 * JSON-LD por página (feature 002, contrato jsonld.md). Todo sale de
 * src/data; ninguna página escribe marcado a mano. Un solo @graph por
 * página. Los @id son estables (se enlazan entre páginas).
 *
 * Decisiones (research R-06): Google exige una URL por evento, así que el
 * evento principal vive en la portada con `location` en UNA sede (la de
 * los conversatorios) y las sesiones como subEvent; las charlas abiertas
 * tienen evento propio en /charlas-abiertas/. `geo` y `subEvent` los
 * ignora Google sin error y los usan los asistentes de IA.
 */
import { PRETIX_EVENT_URL, SITE_URL, pretixReady } from '../config';
import { agenda, type AgendaSlot, type EventDay } from '../data/agenda';
import { event, venues, type Venue } from '../data/event';
import { speakers, speakerBySlug, type Speaker } from '../data/speakers';
import { faqs } from '../data/faqs';
import { absoluteUrl, breadcrumbsFor, routeByPath, speakerPath, type Route } from '../routes';
import { activeOffers, bogotaEnd, bogotaStart, todayBogota } from './offers';

type Node = Record<string, unknown>;

export const ids = {
  organization: `${SITE_URL}/#organizacion`,
  site: `${SITE_URL}/#sitio`,
  event: `${SITE_URL}/#evento`,
  talks: `${SITE_URL}/charlas-abiertas/#evento`,
  venue: (v: Pick<Venue, 'id'>) => `${SITE_URL}/#sede-${v.id}`,
  session: (slot: Pick<AgendaSlot, 'slug'>) => `${SITE_URL}/programacion/#${slot.slug}`,
  person: (sp: Pick<Speaker, 'slug'>) => `${SITE_URL}${speakerPath(sp.slug)}#persona`,
};

const HOME_IMAGE = `${SITE_URL}/og/og-image-v3.png`;
const TALKS_IMAGE = `${SITE_URL}/og/paginas/charlas-abiertas-v1.jpg`;

/** '2026-11-06' + '15:30' → '2026-11-06T15:30:00-05:00' */
function bogotaDateTime(day: EventDay, hhmm: string): string {
  return `${day}T${hhmm}:00-05:00`;
}

function postalAddress(street: string): Node {
  return {
    '@type': 'PostalAddress',
    streetAddress: street,
    addressLocality: 'Villa de Leyva',
    addressRegion: 'Boyacá',
    addressCountry: 'CO',
  };
}

export function organizationLd(): Node {
  return {
    '@type': 'Organization',
    '@id': ids.organization,
    name: event.name,
    alternateName: event.tagline,
    url: `${SITE_URL}/`,
    logo: HOME_IMAGE,
    sameAs: [...event.socialProfiles],
    founder: event.organizers.map((name) => ({ '@type': 'Person', name })),
  };
}

export function webSiteLd(): Node {
  return {
    '@type': 'WebSite',
    '@id': ids.site,
    name: event.name,
    alternateName: event.tagline,
    url: `${SITE_URL}/`,
    inLanguage: 'es',
    publisher: { '@id': ids.organization },
  };
}

export function placeLd(venue: Venue): Node {
  return {
    '@type': 'Place',
    '@id': ids.venue(venue),
    name: venue.name,
    address: postalAddress(venue.address.replace(/, Villa de Leyva, Boyacá$/, '')),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: venue.geo.latitude,
      longitude: venue.geo.longitude,
    },
    hasMap: venue.mapsUrl,
  };
}

/** Person completo para el performer del evento principal */
export function performerLd(sp: Speaker): Node {
  return {
    '@type': 'Person',
    '@id': ids.person(sp),
    name: sp.name,
    description: sp.credential,
    url: absoluteUrl(speakerPath(sp.slug)),
    ...(sp.links ? { sameAs: Object.values(sp.links) } : {}),
  };
}

/** Ofertas vigentes hoy, una por boleta (Google: "one Offer for each ticket type") */
export function offersLd(today: string = todayBogota()): Node[] {
  if (!pretixReady) return [];
  return activeOffers(today).map(({ offer, availability }) => ({
    '@type': 'Offer',
    name: offer.name,
    url: PRETIX_EVENT_URL,
    price: String(offer.price),
    priceCurrency: offer.currency,
    availability: `https://schema.org/${availability}`,
    validFrom: bogotaStart(offer.validFrom),
    ...(offer.validThrough ? { validThrough: bogotaEnd(offer.validThrough) } : {}),
  }));
}

/** Solo sesiones con hora de inicio y sede confirmadas (FR-012) */
export function sessionsForMarkup(): AgendaSlot[] {
  return agenda.filter((s) => s.start && s.venueId);
}

/**
 * Ofertas de una sesión (Search Console las pide, aunque sean opcionales):
 * las charlas abiertas, gratis; los conversatorios, las boletas vigentes
 * que cubren ese día (el pase y, desde la etapa 2, la de ese medio día).
 * Sin tienda o sin boleta vigente que lo cubra, ninguna.
 */
function sessionOffersLd(slot: AgendaSlot, today: string): Node[] {
  if (slot.type === 'charla') {
    return [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'COP',
        availability: 'https://schema.org/InStock',
        url: absoluteUrl('/charlas-abiertas/'),
        validFrom: bogotaStart('2026-09-15'),
      },
    ];
  }
  if (!pretixReady) return [];
  const half = slot.start && Number(slot.start.slice(0, 2)) >= 14 ? 'tarde' : 'manana';
  return activeOffers(today)
    .filter(({ offer }) => {
      if (offer.covers === 'all') return true;
      /* La boleta de medio día cubre su día y su mitad (id "sabado-manana") */
      return offer.covers.includes(slot.day) && offer.id.endsWith(half);
    })
    .map(({ offer, availability }) => ({
      '@type': 'Offer',
      name: offer.name,
      url: PRETIX_EVENT_URL,
      price: String(offer.price),
      priceCurrency: offer.currency,
      availability: `https://schema.org/${availability}`,
      validFrom: bogotaStart(offer.validFrom),
      ...(offer.validThrough ? { validThrough: bogotaEnd(offer.validThrough) } : {}),
    }));
}

export function subEventLd(
  slot: AgendaSlot,
  superEventId: string = ids.event,
  today: string = todayBogota(),
): Node {
  const venue = venues.find((v) => v.id === slot.venueId)!;
  const performers: Node[] = [
    ...slot.speakerSlugs.map((slug) => ({ '@id': ids.person(speakerBySlug(slug)) })),
    ...(slot.guests ?? []).map((name) => ({ '@type': 'Person', name })),
  ];
  const free = slot.type === 'charla';
  const offers = sessionOffersLd(slot, today);
  /* Descripción: la nota de la agenda o, si no hay, una genérica con el
     tipo de sesión, la sede y el encuentro */
  const description =
    slot.note ??
    (free
      ? `Charla abierta de entrada libre en la ${venue.name}, dentro de ${event.name}, Villa de Leyva.`
      : `Conversatorio con boleta en la ${venue.name}, dentro de ${event.name}, Villa de Leyva.`);
  return {
    '@type': 'Event',
    '@id': ids.session(slot),
    name: slot.title,
    description,
    url: ids.session(slot),
    startDate: bogotaDateTime(slot.day, slot.start!),
    ...(slot.end ? { endDate: bogotaDateTime(slot.day, slot.end) } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    inLanguage: 'es',
    image: [free ? TALKS_IMAGE : HOME_IMAGE],
    location: { '@id': ids.venue(venue) },
    organizer: { '@id': ids.organization },
    superEvent: { '@id': superEventId },
    ...(performers.length ? { performer: performers } : {}),
    ...(free ? { isAccessibleForFree: true } : {}),
    ...(offers.length ? { offers } : {}),
  };
}

export function eventLd(today: string = todayBogota()): Node {
  const mainVenue = venues.find((v) => v.id === 'duruelo')!;
  const offers = offersLd(today);
  return {
    '@type': 'Event',
    '@id': ids.event,
    name: event.name,
    alternateName: `${event.name} · ${event.tagline}`,
    description: event.description,
    url: `${SITE_URL}/`,
    startDate: event.startDateTime,
    endDate: event.endDateTime,
    eventStatus: 'https://schema.org/EventScheduled',
    inLanguage: 'es',
    image: [HOME_IMAGE],
    location: { '@id': ids.venue(mainVenue) },
    organizer: { '@id': ids.organization },
    performer: speakers.map(performerLd),
    ...(offers.length ? { offers } : {}),
    subEvent: sessionsForMarkup().map((slot) => subEventLd(slot)),
  };
}

export function faqPageLd(): Node {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/** Evento propio de las charlas abiertas (URL propia, entrada libre) */
export function talksEventLd(): Node {
  const casaMuseo = venues.find((v) => v.id === 'casa-museo')!;
  const talks = sessionsForMarkup().filter((s) => s.type === 'charla');
  const first = talks[0]!;
  const withEnd = talks.filter((s) => s.end);
  const last = withEnd[withEnd.length - 1];
  const talksRoute = routeByPath('/charlas-abiertas/');
  return {
    '@type': 'Event',
    '@id': ids.talks,
    name: `Charlas abiertas · ${event.name}`,
    description: talksRoute.description,
    url: absoluteUrl('/charlas-abiertas/'),
    startDate: bogotaDateTime(first.day, first.start!),
    ...(last ? { endDate: bogotaDateTime(last.day, last.end!) } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    inLanguage: 'es',
    image: [TALKS_IMAGE],
    location: { '@id': ids.venue(casaMuseo) },
    organizer: { '@id': ids.organization },
    superEvent: { '@id': ids.event },
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'COP',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl('/charlas-abiertas/'),
      validFrom: bogotaStart('2026-09-15'),
    },
    subEvent: talks.map((slot) => subEventLd(slot, ids.talks)),
  };
}

export function breadcrumbLd(path: string): Node {
  const chain = breadcrumbsFor(path);
  return {
    '@type': 'BreadcrumbList',
    itemListElement: chain.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.crumb,
      ...(i < chain.length - 1 ? { item: absoluteUrl(r.path) } : {}),
    })),
  };
}

export function webPageLd(route: Route): Node {
  return {
    '@type': 'WebPage',
    '@id': absoluteUrl(route.path),
    url: absoluteUrl(route.path),
    name: route.title,
    description: route.description,
    inLanguage: 'es',
    isPartOf: { '@id': ids.site },
    about: { '@id': ids.event },
    dateModified: route.lastmod,
  };
}

export function personLd(sp: Speaker, imageUrl: string): Node {
  const sessions = agenda.filter((s) => s.speakerSlugs.includes(sp.slug) && s.start && s.venueId);
  return {
    '@type': 'Person',
    '@id': ids.person(sp),
    name: sp.name,
    description: sp.credential,
    image: imageUrl,
    url: absoluteUrl(speakerPath(sp.slug)),
    ...(sp.links ? { sameAs: Object.values(sp.links) } : {}),
    performerIn: [{ '@id': ids.event }, ...sessions.map((s) => ({ '@id': ids.session(s) }))],
  };
}

export function profilePageLd(sp: Speaker, route: Route, imageUrl: string): Node {
  return {
    '@type': 'ProfilePage',
    '@id': absoluteUrl(route.path),
    url: absoluteUrl(route.path),
    dateModified: route.lastmod,
    isPartOf: { '@id': ids.site },
    mainEntity: personLd(sp, imageUrl),
  };
}

/* ------------------------------------------------------------------ */
/* Grafos por página                                                   */
/* ------------------------------------------------------------------ */

function graph(nodes: Node[]): Node {
  const g = { '@context': 'https://schema.org', '@graph': nodes };
  assertJsonLd(g);
  return g;
}

/** Portada: Organization, WebSite, las dos sedes, el evento y las FAQ */
export function homeGraph(today?: string): Node {
  return graph([organizationLd(), webSiteLd(), ...venues.map(placeLd), eventLd(today), faqPageLd()]);
}

/** Ficha de panelista: migas + ProfilePage (con el evento y las sedes por @id) */
export function speakerGraph(sp: Speaker, imageUrl: string): Node {
  const route = routeByPath(speakerPath(sp.slug));
  return graph([
    organizationLd(),
    webSiteLd(),
    breadcrumbLd(route.path),
    profilePageLd(sp, route, imageUrl),
    eventStubLd(),
  ]);
}

/** Charlas abiertas: migas + evento propio + sede */
export function talksGraph(): Node {
  const casaMuseo = venues.find((v) => v.id === 'casa-museo')!;
  return graph([
    organizationLd(),
    webSiteLd(),
    breadcrumbLd('/charlas-abiertas/'),
    placeLd(casaMuseo),
    talksEventLd(),
    eventStubLd(),
  ]);
}

/** Páginas interiores sin entidad propia: migas + WebPage */
export function pageGraph(path: string): Node {
  return graph([organizationLd(), webSiteLd(), breadcrumbLd(path), webPageLd(routeByPath(path)), eventStubLd()]);
}

/**
 * Referencia mínima al evento principal para que los @id enlazados desde
 * otras páginas resuelvan (name, url, fechas y sede: lo que Google pide
 * como obligatorio si decidiera leerlo aquí).
 */
function eventStubLd(): Node {
  const mainVenue = venues.find((v) => v.id === 'duruelo')!;
  return {
    '@type': 'Event',
    '@id': ids.event,
    name: event.name,
    url: `${SITE_URL}/`,
    startDate: event.startDateTime,
    endDate: event.endDateTime,
    eventStatus: 'https://schema.org/EventScheduled',
    location: placeLd(mainVenue),
    organizer: { '@type': 'Organization', name: event.name, url: `${SITE_URL}/` },
  };
}

/* ------------------------------------------------------------------ */
/* Aserciones de build                                                 */
/* ------------------------------------------------------------------ */

const AVAILABILITY = new Set(['InStock', 'SoldOut', 'PreOrder'].map((a) => `https://schema.org/${a}`));

/**
 * Todo @id referenciado existe en el grafo (o es un ancla de sesión, que
 * vive en el grafo de la portada); ningún subevento sin startDate y
 * location; ninguna Offer con availability fuera de la lista de Google.
 */
export function assertJsonLd(g: Node): void {
  const nodes = g['@graph'] as Node[];
  const defined = new Set<string>();
  const referenced = new Set<string>();
  const walk = (n: unknown, parentType?: string): void => {
    if (Array.isArray(n)) return n.forEach((x) => walk(x, parentType));
    if (!n || typeof n !== 'object') return;
    const o = n as Node;
    const keys = Object.keys(o);
    if (keys.length === 1 && typeof o['@id'] === 'string') {
      referenced.add(o['@id'] as string);
      return;
    }
    if (typeof o['@id'] === 'string') defined.add(o['@id'] as string);
    if (o['@type'] === 'Event' && parentType === 'Event') {
      if (!o.startDate || !o.location) throw new Error(`Subevento sin startDate o location: ${o['@id']}`);
    }
    if (o['@type'] === 'Offer' && typeof o.availability === 'string' && !AVAILABILITY.has(o.availability)) {
      throw new Error(`Offer con availability no admitida por Google: ${o.availability}`);
    }
    for (const [k, v] of Object.entries(o)) {
      if (k.startsWith('@')) continue;
      walk(v, o['@type'] as string | undefined);
    }
  };
  walk(nodes);
  const missing = [...referenced].filter(
    (id) => !defined.has(id) && !id.includes('/programacion/#') && !id.includes('/panelistas/'),
  );
  if (missing.length) throw new Error(`JSON-LD: @id referenciados sin definir: ${missing.join(', ')}`);
}
