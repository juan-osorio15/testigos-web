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
 * Líneas por periodo con el nombre y la cifra al final de cada serie.
 * series: [{ nombre, clase, valores }] (null: ese periodo no se dibuja);
 * clase da el color en plantilla.css; las marcas siguen a la identidad, no al orden.
 */
export function lineas({ periodos, series, formato = entero, ancho = 356, alto = 300 }) {
  const top = 14, bottom = 28, left = 34, right = 116;
  const max = Math.max(1, ...series.flatMap((s) => s.valores.filter((v) => v != null)));
  const inicio = Math.min(...series.map((s) => s.valores.findIndex((v) => v != null)));
  const x = (i) => left + ((i - inicio) / Math.max(1, periodos.length - 1 - inicio)) * (ancho - left - right);
  const y = (v) => alto - bottom - (v / max) * (alto - top - bottom);
  // Separa las etiquetas de un mismo costado para que no se monten.
  const acomodar = (items) => {
    const orden = [...items].sort((a, b) => a.y - b.y);
    for (let k = 1; k < orden.length; k++) orden[k].y = Math.max(orden[k].y, orden[k - 1].y + 15);
    const exceso = orden.at(-1).y - (alto - bottom + 4);
    if (exceso > 0) { orden.at(-1).y -= exceso; for (let k = orden.length - 2; k >= 0; k--) orden[k].y = Math.min(orden[k].y, orden[k + 1].y - 15); }
    return orden;
  };
  let svg = `<svg class="lineas" viewBox="0 0 ${ancho} ${alto}" width="${ancho}" height="${alto}" role="img">`;
  svg += `<line class="base" x1="${left}" x2="${ancho - right}" y1="${alto - bottom}" y2="${alto - bottom}"/>`;
  for (let i = inicio; i < periodos.length; i++) {
    svg += `<line class="grid" x1="${x(i)}" x2="${x(i)}" y1="${top}" y2="${alto - bottom}"/><text class="eje" x="${x(i)}" y="${alto - 10}" text-anchor="middle">${esc(periodos[i])}</text>`;
  }
  for (const s of series) {
    const puntos = s.valores.map((v, i) => (v == null ? null : [x(i), y(v), v, i])).filter(Boolean);
    svg += `<polyline class="serie ${s.clase}" points="${puntos.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}"/>`;
    for (const p of puntos) svg += `<circle class="punto ${s.clase}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="5"><title>${esc(s.nombre)}, ${esc(periodos[p[3]])}: ${esc(formato(p[2]))}</title></circle>`;
    // La serie destacada lleva también la cifra de los puntos intermedios.
    if (s.destacar) for (const p of puntos.slice(1, -1)) svg += `<text class="cifra-linea" x="${p[0].toFixed(1)}" y="${(p[1] - 10).toFixed(1)}" text-anchor="middle">${esc(formato(p[2]))}</text>`;
  }
  const extremos = (lado) => acomodar(series.map((s) => {
    const i = lado === 'fin' ? s.valores.length - 1 : s.valores.findIndex((v) => v != null);
    return { s, v: s.valores[i], y: y(s.valores[i]) + 4, x: x(i) };
  }));
  for (const e of extremos('inicio')) svg += `<text class="cifra-linea" x="${e.x - 9}" y="${e.y}" text-anchor="end">${esc(formato(e.v))}</text>`;
  for (const e of extremos('fin')) svg += `<text class="cifra-linea" x="${e.x + 9}" y="${e.y}">${esc(formato(e.v))}<tspan class="nombre-linea" dx="5">${esc(e.s.nombre)}</tspan></text>`;
  return svg + '</svg>';
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
