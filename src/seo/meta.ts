/**
 * Metadatos por página (feature 002, contrato pages-seo.md) y aserciones
 * que fallan en el build: título ≤ 60, descripción ≤ 155, toda página
 * pública registrada en src/routes.ts.
 */
import { SITE_URL } from '../config';
import { routes, type Route } from '../routes';

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogImage: string;
}

const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1';
const ROBOTS_NOINDEX = 'noindex, follow';

export function assertMetaLengths(title: string, description: string, where: string): void {
  if (title.length > TITLE_MAX) {
    throw new Error(`Título de ${title.length} caracteres (máximo ${TITLE_MAX}) en ${where}: "${title}"`);
  }
  if (description.length > DESCRIPTION_MAX) {
    throw new Error(
      `Descripción de ${description.length} caracteres (máximo ${DESCRIPTION_MAX}) en ${where}: "${description}"`,
    );
  }
}

export function pageMeta(route: Route): PageMeta {
  assertMetaLengths(route.title, route.description, route.path);
  return {
    title: route.title,
    description: route.description,
    canonical: `${SITE_URL}${route.path}`,
    robots: ROBOTS_INDEX,
    ogImage: route.ogImage,
  };
}

/** Páginas utilitarias y legales: fuera del índice, enlaces seguidos */
export function noindexMeta(title: string, description: string, pathname: string, ogImage: string): PageMeta {
  return {
    title,
    description,
    canonical: `${SITE_URL}${pathname}`,
    robots: ROBOTS_NOINDEX,
    ogImage,
  };
}

/** Páginas que existen sin estar en `routes` (llevan noindex) */
export const UNROUTED_PAGES = ['/404/', '/tratamiento-de-datos/', '/terminos-y-condiciones/'];

/**
 * Recibe las rutas de todas las páginas .astro públicas (derivadas de
 * import.meta.glob en el sitemap) y falla si alguna no está registrada ni
 * en la lista de excluidas. Las rutas dinámicas ([slug]) se expanden por
 * quien llama.
 */
export function assertRoutesCoverPages(pagePaths: string[]): void {
  const registered = new Set(routes.map((r) => r.path));
  const excluded = new Set(UNROUTED_PAGES);
  const missing = pagePaths.filter((p) => !registered.has(p) && !excluded.has(p));
  if (missing.length) {
    throw new Error(`Páginas sin registrar en src/routes.ts: ${missing.join(', ')}`);
  }
}

/**
 * Convierte la clave de import.meta.glob ('./charlas-abiertas.astro',
 * './panelistas/index.astro', 'src/pages/x.astro') en su ruta pública.
 */
export function pagePathFromFile(file: string): string {
  const rel = file
    .replace(/^.*\/src\/pages\//, '')
    .replace(/^\.\//, '')
    .replace(/\.astro$/, '');
  if (rel === 'index') return '/';
  return `/${rel.replace(/\/index$/, '')}/`;
}
