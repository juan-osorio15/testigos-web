/**
 * Sitemap generado en el build desde src/routes.ts (feature 002, FR-029):
 * una <url> por ruta indexable con el <lastmod> de contenido. Las legales
 * y la 404 no van (noindex). Antes de emitir, comprueba que toda página
 * pública del proyecto esté registrada en routes.ts.
 */
import type { APIRoute } from 'astro';
import { SITE_URL } from '../config';
import { routes, speakerPath } from '../routes';
import { speakers } from '../data/speakers';
import { assertRoutesCoverPages, pagePathFromFile } from '../seo/meta';

/* Todas las páginas .astro del proyecto; las dinámicas se expanden. */
const pageFiles = Object.keys(import.meta.glob('./**/*.astro'));
const pagePaths = pageFiles.flatMap((file) => {
  const p = pagePathFromFile(file);
  if (p === '/panelistas/[slug]/') return speakers.map((s) => speakerPath(s.slug));
  return [p];
});

export const GET: APIRoute = () => {
  assertRoutesCoverPages(pagePaths);
  const urls = routes
    .map((r) => `  <url>\n    <loc>${SITE_URL}${r.path}</loc>\n    <lastmod>${r.lastmod}</lastmod>\n  </url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
