/**
 * Imágenes principales de la portada (LCP): el mosaico de caras del hero.
 * Una sola definición de `widths` y `sizes` para que el <link rel="preload">
 * del layout y las <Image> de los tiles generen exactamente el mismo
 * srcset: si difieren, el navegador descarga dos variantes (contrato
 * pages-seo.md). Se precarga solo el primer retrato: los demás salen del
 * mismo lote y llegan con `priority` desde el HTML.
 */
import { speakers } from '../data/speakers';

const first = speakers.find((s) => s.photo !== null);
if (!first?.photo) throw new Error('hero.ts: el mosaico del hero necesita al menos un panelista con foto');

export const heroTile = {
  /* Tile: 4 columnas del 55 % del ancho en escritorio; 4 columnas a lo
     ancho en móvil. Los anchos cubren 1x y 2x de esos tamaños. */
  widths: [200, 320, 480],
  sizes: '(max-width: 63.9rem) 25vw, 14vw',
} as const;

export const heroImage = {
  src: first.photo,
  widths: heroTile.widths,
  sizes: heroTile.sizes,
} as const;
