// Boleta de pretix. Genera: fondo.html (para imprimir a PDF), preview.html
// (fondo + datos de muestra en las mismas coordenadas) y layout.json (para el
// botón </> del editor de pretix).
//
// Formato A6 vertical (105 × 148 mm): en el celular la página se ajusta al
// ancho de la pantalla, así que el QR ocupa más de la mitad del ancho y se
// escanea sin hacer zoom. Impresa en A4 sale centrada al tamaño real.
//
// Todas las medidas en mm. Pretix usa origen abajo-izquierda:
// bottom = PAGE_H - top - height.
import { readFileSync, writeFileSync } from 'node:fs';

const PAGE_W = 105;
const PAGE_H = 148;
const INK = [33, 8, 4, 1];
const C = { ink: '#210804', cream: '#efe8df', brick: '#7d290d', terracotta: '#d45b30', sky: '#74b3d6', olive: '#757522' };

const logo = readFileSync(new URL('../../../src/assets/logo/logo-lockup.svg', import.meta.url), 'utf8')
  .replace('<svg ', '<svg class="logo" ');

/* --- Bloques (x, y desde arriba, ancho, alto) --- */
const A = { x: 0, y: 0, w: PAGE_W, h: 30 };        // terracota: logo y fechas
const Q = { x: 0, y: 30, w: PAGE_W, h: 66 };       // blanco: QR
const B = { x: 0, y: 96, w: PAGE_W, h: 41 };       // crema: datos
const D = { x: 0, y: 137, w: PAGE_W, h: 11 };      // cielo: pedido y precio

const M = 7; // margen lateral del texto

/* --- Elementos dinámicos de pretix (sobre el fondo) --- */
const text = (content, sample, { left, top, width, height, size, bold = false, align = 'left', valign = 'top', color = INK }) => ({
  type: 'textcontainer', page: 1, locale: '',
  left: left.toFixed(2), bottom: (PAGE_H - top - height).toFixed(2),
  fontsize: size.toFixed(1), lineheight: '1.15', color,
  fontfamily: 'Open Sans', bold, italic: false,
  width: width.toFixed(2), height: height.toFixed(2),
  content, text: sample, text_i18n: {}, rotation: 0,
  align, verticalalign: valign, autoresize: true, splitlongwords: true,
});

const qrSize = 52;                    // la mitad del ancho de la página
const qrLeft = (PAGE_W - qrSize) / 2;
const qrTop = Q.y + 3;

const elements = [
  { type: 'barcodearea', page: 1, left: qrLeft.toFixed(2), bottom: (PAGE_H - qrTop - qrSize).toFixed(2), size: qrSize.toFixed(2), content: 'secret', text: '', text_i18n: {}, nowhitespace: false, color: [0, 0, 0, 1] },
  text('secret', 'tdmruoekvkpbv1o2mv8xccvqcikvr58u', { left: M, top: qrTop + qrSize + 1, width: PAGE_W - 2 * M, height: 4, size: 6, align: 'center' }),
  text('itemvar', 'Franja · Sábado 7, mañana', { left: M, top: 102.5, width: PAGE_W - 2 * M, height: 11, size: 14, bold: true }),
  text('attendee_name', 'Juan Pérez', { left: M, top: 118.5, width: PAGE_W - 2 * M, height: 6.5, size: 11 }),
  text('event_location', 'Hospedería Duruelo, Villa de Leyva, Boyacá', { left: M, top: 129.5, width: PAGE_W - 2 * M, height: 6, size: 9 }),
  text('order', 'A1B2C', { left: M + 14, top: 139.5, width: 36, height: 6, size: 11, bold: true, valign: 'middle' }),
  text('price', '$ 90.000', { left: PAGE_W - M - 36, top: 139.5, width: 36, height: 6, size: 10, align: 'right', valign: 'middle' }),
];

/* --- Fondo (HTML → PDF con Chrome) --- */
const mm = (n) => `${n}mm`;
const block = (r, bg) => `<div class="blk" style="left:${mm(r.x)};top:${mm(r.y)};width:${mm(r.w)};height:${mm(r.h)};background:${bg}"></div>`;
const label = (txt, x, y, color = C.brick) => `<div class="label" style="left:${mm(x)};top:${mm(y)};color:${color}">${txt}</div>`;
const note = (txt, x, y, w, extra = '') => `<div class="note" style="left:${mm(x)};top:${mm(y)};width:${mm(w)};${extra}">${txt}</div>`;

const background = `
${block(A, C.terracotta)}
${block(Q, '#ffffff')}
${block(B, C.cream)}
${block(D, C.sky)}
<div class="logo-wrap" style="left:${mm(M)};top:${mm(5)};width:${mm(34)}">${logo}</div>
${note('Conversatorios<br>6 al 8 de noviembre de 2026<br>Villa de Leyva', 48, 9.5, PAGE_W - 48 - M, `color:${C.ink};font-weight:700;font-size:8pt;line-height:1.35;text-align:right`)}
${note('Presenta este código en la entrada, impreso o en el celular. Válido para una sola persona.', M, qrTop + qrSize + 6, PAGE_W - 2 * M, `color:${C.ink};font-size:6.5pt;line-height:1.3;text-align:center;white-space:nowrap`)}
${label('Boleta', M, 98.5)}
${label('Asistente', M, 114.5)}
${label('Lugar', M, 125.5)}
${label('Pedido', M, 139.7, C.ink)}
`;

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

const page = (extra = '') => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${background}${extra}</body></html>`;

/* Vista previa: los elementos dinámicos con datos de muestra, en sus cajas */
const rgba = (c) => `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
const dyn = elements.map((e) => {
  if (e.type === 'textcontainer') {
    const top = PAGE_H - parseFloat(e.bottom) - parseFloat(e.height);
    const jc = { left: 'flex-start', center: 'center', right: 'flex-end' }[e.align];
    const ai = { top: 'flex-start', middle: 'center', bottom: 'flex-end' }[e.verticalalign];
    return `<div class="dyn" style="left:${mm(e.left)};top:${mm(top)};width:${mm(e.width)};height:${mm(e.height)};font-size:${e.fontsize}pt;font-weight:${e.bold ? 700 : 400};color:${rgba(e.color)};justify-content:${jc};align-items:${ai};text-align:${e.align}">${e.text}</div>`;
  }
  if (e.type === 'barcodearea') {
    const top = PAGE_H - parseFloat(e.bottom) - parseFloat(e.size);
    return `<div class="dyn" style="left:${mm(e.left)};top:${mm(top)};width:${mm(e.size)};height:${mm(e.size)};background:repeating-conic-gradient(#000 0 25%, #fff 0 50%) 0 0/4mm 4mm;outline:none"></div>`;
  }
  return '';
}).join('\n');

writeFileSync(new URL('./fondo.html', import.meta.url), page());
writeFileSync(new URL('./preview.html', import.meta.url), page(dyn));
writeFileSync(new URL('./layout.json', import.meta.url), JSON.stringify(elements));
console.log('ok', elements.length, 'elementos,', `${PAGE_W}×${PAGE_H} mm`);
