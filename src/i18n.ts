/**
 * Idioma por ruta. El sitio es en español; /en/ es una copia de la portada
 * en inglés para enlazar desde fuera (LinkedIn, hoja de vida), sin
 * selector de idioma y sin enlaces desde el resto del sitio. No está en
 * el sitemap y lleva noindex (src/seo/meta.ts, UNROUTED_PAGES).
 */
export type Lang = 'es' | 'en';

/** Ruta pública de la portada en inglés (con barra final, como en routes.ts) */
export const EN_PATH = '/en/';

/** Idioma de una ruta: solo /en (con o sin barra) es inglés */
export function langOf(pathname: string): Lang {
  return /^\/en\/?$/.test(pathname) ? 'en' : 'es';
}

/** Etiqueta BCP 47 para formatear fechas y para <html lang> */
export function localeOf(lang: Lang): string {
  return lang === 'en' ? 'en-US' : 'es-CO';
}
