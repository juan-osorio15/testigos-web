/**
 * Sitemap generado en el build: el <lastmod> es la fecha del despliegue,
 * y cada push a main cambia contenido. Sustituye al archivo estático de
 * public/, cuya fecha se quedaba atrás. La 404 no va (noindex).
 */
import type { APIRoute } from 'astro';
import { SITE_URL } from '../config';

const pages = ['/', '/tratamiento-de-datos/', '/terminos-y-condiciones/'];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map((path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
