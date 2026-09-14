// Escarapela de pretix (Badges → Layout). Genera: fondo.html (para imprimir a
// PDF), preview.html (fondo + datos de muestra en las mismas coordenadas) y
// layout.json (para el botón </> del editor de pretix). Lo común vive en
// ../lib.mjs.
//
// Formato A6 vertical (105 × 148 mm), el mismo de la boleta y de la plantilla
// por defecto de pretix, y el del porta-escarapela A6 estándar. Cuatro bloques
// según la fórmula visual: crema con el logo (identidad), terracota con el
// nombre y el cargo (el mensaje), oliva con la categoría y una franja cielo con
// los datos prácticos.
//
// La categoría va fija en el fondo, en Archivo. Cambia con el argumento:
//   node build.mjs Organización
// Imprime el slug de la categoría (para nombrar el PDF) en la salida estándar.
import { C, piece } from '../lib.mjs';

const PAGE_W = 105;
const PAGE_H = 148;
const { text, block, note, logo, write } = piece({ PAGE_W, PAGE_H });

const CATEGORY = process.argv[2] || 'Panelista';
const slug = CATEGORY.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* --- Bloques (x, y desde arriba, ancho, alto) --- */
const A = { x: 0, y: 0, w: PAGE_W, h: 38 };        // crema: logo con aire
const N = { x: 0, y: 38, w: PAGE_W, h: 77 };       // terracota: nombre y cargo
const K = { x: 0, y: 115, w: PAGE_W, h: 18 };      // oliva: categoría
const D = { x: 0, y: 133, w: PAGE_W, h: 15 };      // cielo: fechas y lugar

const M = 7; // margen lateral del texto

/* --- Elementos dinámicos de pretix (sobre el fondo) --- */
// El nombre, grande y pegado al cargo; el aire queda arriba, entre el logo y
// el nombre. Un nombre largo baja a dos líneas y, si aún no cabe, se encoge.
// El cargo y el medio van en el campo Company de pretix: "Directora · El Colombiano".
const elements = [
  text('attendee_name', 'Luz María Sierra', { left: M, top: N.y + 8, width: PAGE_W - 2 * M, height: 44, size: 28, bold: true, valign: 'bottom', lineheight: 1.05 }),
  text('attendee_company', 'Directora · El Colombiano', { left: M, top: N.y + 55, width: PAGE_W - 2 * M, height: 14, size: 12 }),
];

/* --- Fondo --- */
const background = `
${block(A, C.cream)}
${block(N, C.terracotta)}
${block(K, C.olive)}
${block(D, C.sky)}
${logo(M, 6, 42)}
${note(CATEGORY, M, K.y, PAGE_W - 2 * M, `height:${K.h}mm;display:flex;align-items:center;color:${C.ink};font-weight:800;font-size:20pt;letter-spacing:0.12em;text-transform:uppercase;line-height:1`)}
${note('Conversatorios · 6 al 8 de noviembre de 2026', M, D.y, 60, `height:${D.h}mm;display:flex;align-items:center;color:${C.ink};font-weight:700;font-size:7.5pt;line-height:1`)}
${note('Villa de Leyva', PAGE_W - M - 30, D.y, 30, `height:${D.h}mm;display:flex;align-items:center;justify-content:flex-end;color:${C.ink};font-weight:700;font-size:7.5pt;line-height:1;text-align:right`)}
`;

write(import.meta.url, background, elements);
console.log(slug);
