// Escarapela de pretix (Badges → Badge layouts). Genera: fondo.html (para
// imprimir a PDF), preview.html (fondo + datos de muestra en las mismas
// coordenadas) y layout.json (para el botón </> del editor de pretix). Lo común
// vive en ../lib.mjs.
//
// Formato A6 vertical (105 × 148 mm), el mismo de la boleta, de la plantilla
// por defecto de pretix y del porta-escarapela A6 corriente. Bloque principal
// de color con la categoría en píldora, el logo completo y el nombre grande;
// abajo, crema pequeño con el logo de Conexión Zaquencipa, y terracota con los
// datos. Sin QR: la escarapela identifica, no da entrada.
//
// La categoría cambia el rótulo y los colores (ver PRESETS):
//   node build.mjs staff
// Imprime el slug de la categoría (para nombrar el PDF) en la salida estándar.
import sharp from 'sharp';
import { C, piece } from '../lib.mjs';
import { conversatorios, hechos } from '../../../scripts/lib/hechos.mjs';

/* Sede, ciudad y fechas impresas: de la fuente (src/data, vía dist/datos/evento.json) */
const { sede, fechas } = conversatorios();
const ciudad = hechos().evento.ciudad.split(',')[0];

// main: bloque principal (la categoría); data: bloque de datos prácticos abajo.
// Staff va en terracota, el color más reconocible de la marca; su bloque de
// datos pasa a oliva para no fundirse con el principal.
// generica: se imprime igual para todos, sin nombre ni categoría.
const PRESETS = {
  panelista: { label: 'Panelista', main: C.olive, data: C.terracotta },
  staff: { label: 'Staff', main: C.terracotta, data: C.olive },
  invitados: { main: C.sky, data: C.terracotta, generica: true },
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
const { text, block, logo, write } = piece({ PAGE_W, PAGE_H, extraCss });
const mm = (n) => `${n}mm`;

/* --- Bloques (x, y desde arriba, ancho, alto) --- */
const P = { x: 0, y: 0, w: PAGE_W, h: 118 };       // color de la categoría: logo y nombre (baja hasta el terracota)
// El crema del aliado sube 5 mm más que el terracota: dos planos superpuestos,
// no una grilla (ver brand/formula-visual.md, punto 1).
const Q = { x: 0, y: 113, w: 38, h: 35 };          // crema: logo de Conexión Zaquencipa
const D = { x: 38, y: 118, w: 67, h: 30 };         // datos prácticos (terracota u oliva, según la categoría)

/* --- Elementos dinámicos de pretix (sobre el fondo) --- */
// Solo el nombre, sin cargo ni medio: abajo del bloque de color, con el aire
// arriba. Un nombre largo baja a dos o tres líneas y, si aún no cabe, se encoge.
const elements = preset.generica ? [] : [
  text('attendee_name', 'María Fernanda Gómez', { left: M, top: 60, width: PAGE_W - 2 * M, height: 50, size: 35, bold: true, valign: 'bottom', lineheight: 1.0 }),
];

/* --- Logo del aliado --- */
// El PNG es crema con transparencia (para el pie del sitio): aquí, sobre crema,
// va en tinta, conservando su alfa.
const original = new URL('../../../src/assets/partners/conexion-zaquencipa.png', import.meta.url).pathname;
const { width: aliadoW, height: aliadoH } = await sharp(original).metadata();
const alfa = await sharp(original).extractChannel('alpha').toBuffer();
const aliadoPng = await sharp({ create: { width: aliadoW, height: aliadoH, channels: 3, background: C.ink } }).joinChannel(alfa).png().toBuffer();
const aliadoAncho = Q.w - 8;
const aliadoAlto = aliadoAncho * aliadoH / aliadoW;
const aliado = `<img class="blk" alt="" src="data:image/png;base64,${aliadoPng.toString('base64')}" style="left:${mm(Q.x + 4)};top:${mm(Q.y + (Q.h - aliadoAlto) / 2)};width:${mm(aliadoAncho)};height:${mm(aliadoAlto)}">`;

/* --- Fondo --- */
const datos = `<div class="data" style="left:${mm(D.x + 6)};top:${mm(D.y)};width:${mm(D.w - 6 - 4)};height:${mm(D.h)}"><b>${sede.nombre}</b><span>${ciudad}</span><span>${fechas}</span><span style="font-weight:700">testigosdelamemoria.com</span></div>`;
// Genérica: sin nombre, el logo completo crece y se centra en el bloque de color.
const background = preset.generica ? `
${block(P, preset.main)}
${block(Q, C.cream)}
${block(D, preset.data)}
${logo(6, 28, 93)}
${aliado}
${datos}
` : `
${block(P, preset.main)}
${block(Q, C.cream)}
${block(D, preset.data)}
<div class="pill" style="right:${mm(M + 0.5)};top:${mm(6)};height:${mm(7)}">${preset.label}</div>
${logo(6, 9, 70)}
${aliado}
${datos}
`;

write(import.meta.url, background, elements);
console.log(slug);
