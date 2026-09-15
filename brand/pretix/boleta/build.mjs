// Boleta de pretix. Genera: fondo.html (para imprimir a PDF), preview.html
// (fondo + datos de muestra en las mismas coordenadas) y layout.json (para el
// botón </> del editor de pretix). Lo común vive en ../lib.mjs.
//
// Formato A6 vertical (105 × 148 mm): en el celular la página se ajusta al
// ancho de la pantalla, así que el QR ocupa más de la mitad del ancho y se
// escanea sin hacer zoom. Impresa en A4 sale centrada al tamaño real.
import { C, piece } from '../lib.mjs';

const PAGE_W = 105;
const PAGE_H = 148;
const { text, barcode, block, label, note, logo, write } = piece({ PAGE_W, PAGE_H });

/* --- Bloques (x, y desde arriba, ancho, alto) --- */
const A = { x: 0, y: 0, w: PAGE_W, h: 30 };        // terracota: logo y fechas
const Q = { x: 0, y: 30, w: PAGE_W, h: 66 };       // blanco: QR
const B = { x: 0, y: 96, w: PAGE_W, h: 41 };       // crema: datos
const D = { x: 0, y: 137, w: PAGE_W, h: 11 };      // cielo: pedido y precio

const M = 7; // margen lateral del texto

/* --- Elementos dinámicos de pretix (sobre el fondo) --- */
const qrSize = 52;                    // la mitad del ancho de la página
const qrLeft = (PAGE_W - qrSize) / 2;
const qrTop = Q.y + 3;

const elements = [
  barcode('secret', { left: qrLeft, top: qrTop, size: qrSize }),
  text('secret', 'tdmruoekvkpbv1o2mv8xccvqcikvr58u', { left: M, top: qrTop + qrSize + 1, width: PAGE_W - 2 * M, height: 4, size: 6, align: 'center' }),
  text('itemvar', 'Franja · Sábado 7, mañana', { left: M, top: 102.5, width: PAGE_W - 2 * M, height: 11, size: 14, bold: true }),
  text('attendee_name', 'Juan Pérez', { left: M, top: 118.5, width: PAGE_W - 2 * M, height: 6.5, size: 11 }),
  text('event_location', 'Hospedería Duruelo, Villa de Leyva, Boyacá', { left: M, top: 129.5, width: PAGE_W - 2 * M, height: 6, size: 9 }),
  text('order', 'A1B2C', { left: M + 14, top: 139.5, width: 36, height: 6, size: 11, bold: true, valign: 'middle' }),
  text('price', '$ 90.000', { left: PAGE_W - M - 36, top: 139.5, width: 36, height: 6, size: 10, align: 'right', valign: 'middle' }),
];

/* --- Fondo --- */
const background = `
${block(A, C.terracotta)}
${block(Q, '#ffffff')}
${block(B, C.cream)}
${block(D, C.sky)}
${logo(M, 5, 34)}
${note('Conversatorios<br>6 al 8 de noviembre de 2026<br>Villa de Leyva', 48, 9.5, PAGE_W - 48 - M, `color:${C.ink};font-weight:700;font-size:8pt;line-height:1.35;text-align:right`)}
${note('Presenta este código en la entrada, impreso o en el celular. Válido para una sola persona.', M, qrTop + qrSize + 6, PAGE_W - 2 * M, `color:${C.ink};font-size:6.5pt;line-height:1.3;text-align:center;white-space:nowrap`)}
${label('Boleta', M, 98.5)}
${label('Asistente', M, 114.5)}
${label('Lugar', M, 125.5)}
${label('Pedido', M, 139.7, C.ink)}
`;

write(import.meta.url, background, elements);
