// Escarapela de pretix (Badges → Badge layouts). Genera: fondo.html (para
// imprimir a PDF), preview.html (fondo + datos de muestra en las mismas
// coordenadas) y layout.json (para el botón </> del editor de pretix). Lo común
// vive en ../lib.mjs.
//
// Formato A6 vertical (105 × 148 mm), el mismo de la boleta, de la plantilla
// por defecto de pretix y del porta-escarapela A6 corriente. Sigue la pieza de
// la diseñadora: bloque principal de color con la categoría en píldora, el
// cuadro crema con las comillas en la esquina, el nombre grande y el cargo;
// abajo, crema con el QR y el código del pedido, y terracota con los datos.
//
// La categoría cambia el rótulo y el color del bloque principal:
//   node build.mjs staff
// Imprime el slug de la categoría (para nombrar el PDF) en la salida estándar.
import { C, INK, piece, logoSymbol } from '../lib.mjs';

const PRESETS = {
  panelista: { label: 'Panelista', main: C.olive },
  staff: { label: 'Staff', main: C.sky },
};
const slug = process.argv[2] || 'panelista';
const preset = PRESETS[slug];
if (!preset) { console.error(`categoría desconocida: ${slug} (hay: ${Object.keys(PRESETS).join(', ')})`); process.exit(1); }

const PAGE_W = 105;
const PAGE_H = 148;
const M = 8; // margen lateral del texto

const extraCss = `
.pill { position: absolute; display: flex; align-items: center; justify-content: center; box-sizing: border-box; border: 0.35mm solid ${C.ink}; border-radius: 99mm; padding: 0 3mm; font-size: 6pt; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; line-height: 1; }
.data { position: absolute; display: flex; flex-direction: column; justify-content: center; font-size: 7.5pt; font-weight: 500; line-height: 1.7; }
.data b { font-size: 9pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.02em; }
`;
const { text, barcode, block, logo, write } = piece({ PAGE_W, PAGE_H, extraCss });
const mm = (n) => `${n}mm`;

/* --- Bloques (x, y desde arriba, ancho, alto) --- */
const P = { x: 0, y: 0, w: PAGE_W, h: 102 };       // color de la categoría: nombre y cargo (baja hasta el terracota)
const E = { x: 78, y: 0, w: 27, h: 25 };           // crema: las comillas, mirando desde la esquina
// El crema del QR sube 5 mm más que el terracota: dos planos superpuestos,
// no una grilla (ver brand/formula-visual.md, punto 1).
const Q = { x: 0, y: 97, w: 45, h: 51 };           // crema: QR y código del pedido
const D = { x: 45, y: 102, w: 60, h: 46 };         // terracota: datos prácticos

/* --- Elementos dinámicos de pretix (sobre el fondo) --- */
// El nombre va pegado al cargo, con el aire arriba. Un nombre largo baja a
// dos o tres líneas y, si aún no cabe, se encoge. El cargo y el medio van en el
// campo Company de pretix: "Periodista · El Espectador".
const qrSize = 24;
const qrLeft = Q.x + (Q.w - qrSize) / 2;
const qrTop = Q.y + 7;
const pill = { w: 22, h: 7 };
const pillLeft = Q.x + (Q.w - pill.w) / 2;
const pillTop = qrTop + qrSize + 5;

const elements = [
  text('attendee_name', 'María Fernanda Gómez', { left: M, top: 27, width: PAGE_W - 2 * M, height: 46, size: 30, bold: true, valign: 'bottom', lineheight: 1.0 }),
  text('attendee_company', 'Periodista · El Espectador', { left: M, top: 75, width: PAGE_W - 2 * M, height: 12, size: 11 }),
  barcode('secret', { left: qrLeft, top: qrTop, size: qrSize }),
  text('order', 'A1B2C', { left: pillLeft, top: pillTop, width: pill.w, height: pill.h, size: 7, bold: true, align: 'center', valign: 'middle' }),
];

/* --- Fondo --- */
const background = `
${block(P, preset.main)}
${block(E, C.cream)}
${block(Q, C.cream)}
${block(D, C.terracotta)}
<div class="pill" style="left:${mm(M)};top:${mm(8)};height:${mm(7)}">${preset.label}</div>
${logo(E.x + 4, E.y + 13, 20, logoSymbol())}
<div class="pill" style="left:${mm(pillLeft)};top:${mm(pillTop)};width:${mm(pill.w)};height:${mm(pill.h)}"></div>
<div class="data" style="left:${mm(D.x + 6)};top:${mm(D.y)};width:${mm(D.w - 6 - 4)};height:${mm(D.h)}"><b>Hospedería Duruelo</b><span>Villa de Leyva</span><span>6 al 8 de noviembre de 2026</span><span style="font-weight:700">testigosdelamemoria.com</span></div>
`;

write(import.meta.url, background, elements);
console.log(slug);
