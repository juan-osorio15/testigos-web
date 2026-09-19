/**
 * Fuente única de rutas indexables (feature 002, contrato pages-seo.md).
 * De aquí salen el sitemap, las migas de pan, los metadatos por página y la
 * lista que se envía a IndexNow. Las páginas legales y la 404 no están:
 * llevan noindex.
 *
 * Cada ruta nueva se registra aquí en el mismo commit en que se crea la
 * página; `assertRoutesCoverPages` (src/seo/meta.ts) falla en el build si
 * una página pública no está registrada.
 */
import { SITE_URL } from './config';
import { speakers, type Speaker } from './data/speakers';

export interface Route {
  /** Ruta absoluta con barra final ('/panelistas/daniel-samper-pizano/') */
  path: string;
  /** ≤ 60 caracteres, con marca */
  title: string;
  /** ≤ 155 caracteres */
  description: string;
  /** Etiqueta para las migas de pan */
  crumb: string;
  /** Ruta del padre en las migas ('/' o '/panelistas/'); la portada no tiene */
  parent?: string;
  /** URL absoluta de la imagen de vista previa (1200×630) */
  ogImage: string;
  /** Fecha de última modificación del contenido (ISO), para el sitemap */
  lastmod: string;
  /** Prioridad de indexación (informativa: Search Console e IndexNow) */
  priority: 'alta' | 'media';
}

const BRAND = 'Testigos de la Memoria';
const PLACE_DATES = 'Villa de Leyva, 5 al 8 de noviembre de 2026';
const HOME_OG = `${SITE_URL}/og/og-image-v3.png`;

/** Fecha de contenido de las fichas y páginas creadas en la feature 002 */
const CONTENT_DATE = '2026-09-17';

export const HOME_TITLE = 'Testigos de la Memoria · Villa de Leyva, 5 al 8 de noviembre';
export const HOME_DESCRIPTION =
  'Cuatro días de periodismo e historia en Villa de Leyva, del 5 al 8 de noviembre de 2026. Charlas abiertas y conversatorios. Boletas disponibles.';

export function speakerPath(slug: string): string {
  return `/panelistas/${slug}/`;
}

/** Versión de la imagen de vista previa de cada panelista (subir al regenerar) */
export function speakerOgImage(speaker: Pick<Speaker, 'slug' | 'ogVersion'>): string {
  return `${SITE_URL}/og/panelistas/${speaker.slug}-v${speaker.ogVersion ?? 1}.jpg`;
}

function speakerTitle(sp: Speaker): string {
  const full = `${sp.name} · ${BRAND} 2026`;
  return full.length <= 60 ? full : `${sp.name} · ${BRAND}`;
}

function speakerDescription(sp: Speaker): string {
  const full = `${sp.name}, ${sp.credential.toLowerCase()}. Participa en ${BRAND}, ${PLACE_DATES}.`;
  if (full.length <= 155) return full;
  return `${sp.name} participa en ${BRAND}, encuentro de periodismo e historia en Villa de Leyva, del 5 al 8 de noviembre de 2026.`;
}

const speakerRoutes: Route[] = speakers.map((sp) => ({
  path: speakerPath(sp.slug),
  title: speakerTitle(sp),
  description: speakerDescription(sp),
  crumb: sp.name,
  parent: '/panelistas/',
  ogImage: speakerOgImage(sp),
  lastmod: CONTENT_DATE,
  priority: 'alta',
}));

export const routes: Route[] = [
  {
    path: '/',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    crumb: 'Inicio',
    ogImage: HOME_OG,
    lastmod: CONTENT_DATE,
    priority: 'alta',
  },
  {
    path: '/panelistas/',
    title: `Panelistas · ${BRAND} 2026`,
    description: `Los doce periodistas que cubrieron la Colombia reciente, reunidos en ${BRAND}, ${PLACE_DATES}.`,
    crumb: 'Panelistas',
    parent: '/',
    ogImage: HOME_OG,
    lastmod: CONTENT_DATE,
    priority: 'alta',
  },
  ...speakerRoutes,
  {
    path: '/programacion/',
    title: `Programación · ${BRAND}, Villa de Leyva 2026`,
    description: `Programación de ${BRAND}: charlas abiertas y conversatorios del 5 al 8 de noviembre de 2026 en Villa de Leyva, con horas, sedes y panelistas.`,
    crumb: 'Programación',
    parent: '/',
    ogImage: `${SITE_URL}/og/paginas/programacion-v1.jpg`,
    lastmod: CONTENT_DATE,
    priority: 'alta',
  },
  {
    path: '/charlas-abiertas/',
    title: `Charlas abiertas gratis · ${BRAND} 2026`,
    description: `Charlas de entrada libre el 5 y 6 de noviembre de 2026 en la Casa Museo Antonio Nariño de Villa de Leyva, dentro de ${BRAND}. Sin boleta.`,
    crumb: 'Charlas abiertas',
    parent: '/',
    ogImage: `${SITE_URL}/og/paginas/charlas-abiertas-v1.jpg`,
    lastmod: CONTENT_DATE,
    priority: 'alta',
  },
  {
    path: '/como-llegar/',
    title: `Cómo llegar a Villa de Leyva · ${BRAND}`,
    description: `Cómo llegar a Villa de Leyva desde Bogotá y Tunja para ${BRAND}, 5 al 8 de noviembre de 2026: carretera, bus, parqueaderos y las dos sedes.`,
    crumb: 'Cómo llegar',
    parent: '/',
    ogImage: HOME_OG,
    lastmod: CONTENT_DATE,
    priority: 'media',
  },
];

export function routeByPath(path: string): Route {
  const normalized = path.endsWith('/') ? path : `${path}/`;
  const r = routes.find((r) => r.path === normalized);
  if (!r) throw new Error(`Ruta no registrada en src/routes.ts: ${path}`);
  return r;
}

/** Cadena de migas desde la portada hasta la ruta dada */
export function breadcrumbsFor(path: string): Route[] {
  const chain: Route[] = [];
  let current: Route | undefined = routeByPath(path);
  while (current) {
    chain.unshift(current);
    current = current.parent ? routeByPath(current.parent) : undefined;
  }
  return chain;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
