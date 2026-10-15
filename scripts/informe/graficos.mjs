// Gráficos del informe en SVG y HTML, sin librerías. Una sola serie en
// terracota; el énfasis se logra atenuando el resto, no con más colores (la
// paleta de marca no pasa el validador como paleta categórica: cielo y
// ladrillo fallan). Esquinas rectas por la fórmula visual de la marca.
import { esc, fechaCorta, entero, pct } from './formato.mjs';

const DIA = 86400000;
const t = (iso) => Date.parse(`${iso}T00:00:00Z`);
const iso = (ms) => new Date(ms).toISOString().slice(0, 10);

/**
 * Barras diarias con los tramos del periodo como bandas de fondo.
 * dias: Map iso → valor. tramos: [{ desde, hasta, nombre, pauta }].
 */
export function ritmoDiario({ dias, desde, hasta, tramos, destacar = [], ancho = 708, alto = 300, unidad = 'boletas' }) {
  const n = Math.round((t(hasta) - t(desde)) / DIA) + 1;
  const max = Math.max(1, ...dias.values());
  const top = 64, bottom = 28, left = 28, right = 4;
  const w = (ancho - left - right) / n;
  const h = alto - top - bottom;
  const y = (v) => top + h - (v / max) * h;
  const x = (d) => left + Math.round((t(d) - t(desde)) / DIA) * w;
  const paso = max > 12 ? 5 : max > 6 ? 2 : 1;

  let svg = `<svg class="ritmo" viewBox="0 0 ${ancho} ${alto}" width="${ancho}" height="${alto}" role="img" aria-label="${esc(unidad)} por día">`;
  for (const tr of tramos) {
    const x0 = x(tr.desde), x1 = x(tr.hasta) + w;
    if (tr.pauta) svg += `<rect class="banda" x="${x0}" y="${top - 24}" width="${x1 - x0}" height="${h + 24}"/>`;
    svg += `<line class="sep" x1="${x0}" x2="${x0}" y1="${top - 56}" y2="${top + h}"/>`;
    // Los tramos angostos (un día o dos) no caben con nombre: los explica la tabla.
    if (x1 - x0 < 80) continue;
    svg += `<text class="tramo" x="${x0 + 5}" y="${top - 44}">${esc(tr.nombre)}</text>`;
    svg += `<text class="tramo-fecha" x="${x0 + 5}" y="${top - 31}">${esc(rango(tr.desde, tr.hasta))}</text>`;
  }
  for (let v = paso; v <= max; v += paso) {
    svg += `<line class="grid" x1="${left}" x2="${ancho - right}" y1="${y(v)}" y2="${y(v)}"/><text class="eje" x="${left - 6}" y="${y(v) + 4}" text-anchor="end">${v}</text>`;
  }
  for (let k = 0; k < n; k++) {
    const d = iso(t(desde) + k * DIA);
    const v = dias.get(d) ?? 0;
    if (!v) continue;
    const bx = x(d) + 1, bw = Math.max(1, w - 2);
    svg += `<rect class="barra${destacar.includes(d) ? ' fuerte' : ''}" x="${bx}" y="${y(v)}" width="${bw}" height="${top + h - y(v)}"><title>${esc(fechaCorta(d))}: ${entero(v)} ${esc(unidad)}</title></rect>`;
    if (destacar.includes(d)) svg += `<text class="valor" x="${bx + bw / 2}" y="${y(v) - 6}" text-anchor="middle">${entero(v)}</text>`;
  }
  svg += `<line class="base" x1="${left}" x2="${ancho - right}" y1="${top + h}" y2="${top + h}"/>`;
  // Etiquetas del eje x: el primer día de cada tramo y el último del periodo.
  const marcas = [...new Set([...tramos.map((tr) => tr.desde), hasta])];
  let ultimo = -Infinity;
  for (const d of marcas) {
    const cx = x(d) + w / 2;
    if (cx - ultimo < 44) continue;
    svg += `<text class="eje" x="${cx}" y="${alto - 8}" text-anchor="middle">${esc(fechaCorta(d))}</text>`;
    ultimo = cx;
  }
  return svg + '</svg>';
}

function rango(a, b) {
  return a === b ? fechaCorta(a) : `${fechaCorta(a)} a ${fechaCorta(b)}`;
}

/**
 * Tabla con barra en la columna principal. cols: [{ titulo, clave, tipo:
 * 'txt' | 'num' | 'barra', formato }]. Filas con `grupo: true` van en negrita;
 * con `tenue: true`, atenuadas; con `sangria: true`, indentadas.
 */
export function tabla({ cols, filas, nota }) {
  const maxes = Object.fromEntries(cols.filter((c) => c.tipo === 'barra').map((c) => [c.clave, Math.max(1, ...filas.map((f) => f[c.clave] ?? 0))]));
  let html = '<table class="tabla"><thead><tr>';
  for (const c of cols) html += `<th class="${c.tipo}">${esc(c.titulo)}</th>`;
  html += '</tr></thead><tbody>';
  for (const f of filas) {
    const cls = [f.grupo && 'grupo', f.tenue && 'tenue', f.sangria && 'sangria'].filter(Boolean).join(' ');
    html += `<tr${cls ? ` class="${cls}"` : ''}>`;
    for (const c of cols) {
      const v = f[c.clave];
      const txt = v === '' ? '' : v == null ? '·' : esc(c.formato ? c.formato(v, f) : String(v));
      if (c.tipo === 'barra') {
        const pct = v == null ? 0 : (v / maxes[c.clave]) * 100;
        html += `<td class="barra"><span class="b" style="width:${pct.toFixed(1)}%"></span><span class="v">${txt}</span></td>`;
      } else html += `<td class="${c.tipo}">${txt}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  if (nota) html += `<p class="nota">${esc(nota)}</p>`;
  return html;
}

/** Pasos de un recorrido, de izquierda a derecha, cada uno con su fuente. */
export function pasos(lista) {
  // Misma escala para todos, también el paso aparte (otra fuente): una barra
  // más alta que su vecina diría que hay más pagos que clics.
  // Cada paso lleva el porcentaje del anterior que llega a él: dentro de la
  // barra si cabe, encima si la barra es muy baja.
  const max = Math.max(...lista.map((p) => p.valor));
  let html = '<div class="pasos">';
  lista.forEach((p, i) => {
    const alto = Math.max(1.5, (p.valor / max) * 100);
    const paso = i > 0 && lista[i - 1].valor ? `<span class="tasa">${esc(pct(p.valor / lista[i - 1].valor))}</span>` : '';
    const dentro = alto >= 12;
    html += `<div class="paso${p.aparte ? ' aparte' : ''}"><div class="col">${dentro ? '' : paso}<span class="b" style="height:${alto.toFixed(1)}%">${dentro ? paso : ''}</span></div><p class="cifra-paso">${esc(entero(p.valor))}</p><p class="nombre">${esc(p.nombre)}</p><p class="fuente">${esc(p.fuente)}</p></div>`;
  });
  return html + '</div>';
}
