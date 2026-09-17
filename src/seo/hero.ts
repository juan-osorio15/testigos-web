/**
 * Imagen principal de la portada (LCP). Una sola definición de `widths` y
 * `sizes` para que el <link rel="preload"> del layout y la <Image> del hero
 * generen exactamente el mismo srcset: si difieren, el navegador descarga
 * dos variantes (contrato pages-seo.md).
 */
import streetPhoto from '../assets/photos/pexels-enzo-renz-424999667-33786545.jpg';

export const heroImage = {
  src: streetPhoto,
  alt: 'Calle empedrada de Villa de Leyva, con muros blancos y balcones coloniales',
  width: 1280,
  height: 853,
  widths: [480, 768, 1080, 1280],
  sizes: '(max-width: 63.9rem) 100vw, 42vw',
} as const;
