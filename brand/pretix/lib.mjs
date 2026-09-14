// Utilidades compartidas por las piezas de pretix (boleta, escarapela). Cada
// pieza define sus bloques y sus elementos dinámicos; aquí va lo común:
// colores, tipografía, el fondo (HTML → PDF con Chrome), la vista previa con
// datos de muestra y el layout.json para el botón </> del editor.
//
// Todas las medidas en mm. Pretix usa origen abajo-izquierda:
// bottom = PAGE_H - top - height.
import { readFileSync, writeFileSync } from 'node:fs';

export const INK = [33, 8, 4, 1];
export const C = { ink: '#210804', cream: '#efe8df', brick: '#7d290d', terracotta: '#d45b30', sky: '#74b3d6', olive: '#757522' };

export const mm = (n) => `${n}mm`;

export const logoLockup = () =>
  readFileSync(new URL('../../src/assets/logo/logo-lockup.svg', import.meta.url), 'utf8').replace('<svg ', '<svg class="logo" ');

export function piece({ PAGE_W, PAGE_H }) {
  /* --- Elementos dinámicos de pretix (sobre el fondo) --- */
  const text = (content, sample, { left, top, width, height, size, bold = false, align = 'left', valign = 'top', color = INK, lineheight = 1.15 }) => ({
    type: 'textcontainer', page: 1, locale: '',
    left: left.toFixed(2), bottom: (PAGE_H - top - height).toFixed(2),
    fontsize: size.toFixed(1), lineheight: String(lineheight), color,
    fontfamily: 'Open Sans', bold, italic: false,
    width: width.toFixed(2), height: height.toFixed(2),
    content, text: sample, text_i18n: {}, rotation: 0,
    align, verticalalign: valign, autoresize: true, splitlongwords: true,
  });

  const barcode = (content, { left, top, size }) => ({
    type: 'barcodearea', page: 1, left: left.toFixed(2), bottom: (PAGE_H - top - size).toFixed(2), size: size.toFixed(2),
    content, text: '', text_i18n: {}, nowhitespace: false, color: [0, 0, 0, 1],
  });

  /* --- Piezas del fondo --- */
  const block = (r, bg) => `<div class="blk" style="left:${mm(r.x)};top:${mm(r.y)};width:${mm(r.w)};height:${mm(r.h)};background:${bg}"></div>`;
  const label = (txt, x, y, color = C.brick) => `<div class="label" style="left:${mm(x)};top:${mm(y)};color:${color}">${txt}</div>`;
  const note = (txt, x, y, w, extra = '') => `<div class="note" style="left:${mm(x)};top:${mm(y)};width:${mm(w)};${extra}">${txt}</div>`;
  const logo = (x, y, w) => `<div class="logo-wrap" style="left:${mm(x)};top:${mm(y)};width:${mm(w)}">${logoLockup()}</div>`;

  const css = `
@page { size: ${PAGE_W}mm ${PAGE_H}mm; margin: 0; }
@font-face { font-family: 'Archivo'; src: url('../../../src/assets/fonts/archivo-var.woff2') format('woff2-variations'); font-weight: 100 900; }
html, body { margin: 0; padding: 0; }
body { width: ${PAGE_W}mm; height: ${PAGE_H}mm; position: relative; background: #fff; font-family: 'Archivo', sans-serif; color: ${C.ink}; -webkit-print-color-adjust: exact; print-color-adjust: exact; overflow: hidden; }
.blk, .label, .note, .logo-wrap, .dyn { position: absolute; }
.logo-wrap { color: ${C.ink}; }
.logo { display: block; width: 100%; height: auto; }
.label { font-size: 6pt; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; line-height: 1; }
.dyn { font-family: 'Open Sans', 'Helvetica Neue', Arial, sans-serif; line-height: 1.15; outline: 0.2mm dashed rgba(116,179,214,.9); box-sizing: border-box; display: flex; }
`;

  const page = (background, extra = '') => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${background}${extra}</body></html>`;

  /* Vista previa: los elementos dinámicos con datos de muestra, en sus cajas */
  const rgba = (c) => `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
  const preview = (elements) => elements.map((e) => {
    if (e.type === 'textcontainer') {
      const top = PAGE_H - parseFloat(e.bottom) - parseFloat(e.height);
      const jc = { left: 'flex-start', center: 'center', right: 'flex-end' }[e.align];
      const ai = { top: 'flex-start', middle: 'center', bottom: 'flex-end' }[e.verticalalign];
      return `<div class="dyn" style="left:${mm(e.left)};top:${mm(top)};width:${mm(e.width)};height:${mm(e.height)};font-size:${e.fontsize}pt;font-weight:${e.bold ? 700 : 400};color:${rgba(e.color)};justify-content:${jc};align-items:${ai};text-align:${e.align};line-height:${e.lineheight}">${e.text}</div>`;
    }
    if (e.type === 'barcodearea') {
      const top = PAGE_H - parseFloat(e.bottom) - parseFloat(e.size);
      return `<div class="dyn" style="left:${mm(e.left)};top:${mm(top)};width:${mm(e.size)};height:${mm(e.size)};background:repeating-conic-gradient(#000 0 25%, #fff 0 50%) 0 0/4mm 4mm;outline:none"></div>`;
    }
    return '';
  }).join('\n');

  /* Escribe fondo.html, preview.html y layout.json junto al script que llama */
  const write = (dirUrl, background, elements) => {
    writeFileSync(new URL('./fondo.html', dirUrl), page(background));
    writeFileSync(new URL('./preview.html', dirUrl), page(background, preview(elements)));
    writeFileSync(new URL('./layout.json', dirUrl), JSON.stringify(elements));
    console.error('ok', elements.length, 'elementos,', `${PAGE_W}×${PAGE_H} mm`);
  };

  return { text, barcode, block, label, note, logo, write };
}
