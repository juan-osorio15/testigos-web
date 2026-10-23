// Lectores de las exportaciones del informe (feature 003). Cada lector
// reconoce su archivo por las columnas, no por el nombre: GA4 y Meta los
// descargan como "download (7).csv" o con el nombre del anuncio.
//
// Regla de datos personales: el Excel de pedidos de Pretix trae nombre,
// correo, teléfono y dirección. Aquí solo se leen producto, precio, estado,
// fecha y comisión; nada más sale de esta función.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// ---------- CSV ----------

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const num = (s) => (s === '' || s == null ? null : Number(s));

// ---------- GA4 ----------

// Nombre de la métrica en la exportación en español → clave interna.
const METRICAS = {
  'Sesiones': 'sesiones',
  'Sesiones con interacción': 'sesionesInt',
  'Porcentaje de interacciones': 'pctInt',
  'Usuarios nuevos': 'nuevos',
  'Usuarios activos': 'activos',
  'Compras iniciadas': 'comprar',
  'Compras': 'compras',
  'Vistas': 'vistas',
  'Tiempo de interacción medio por sesión': 'tiempo',
  'Número de eventos': 'eventos',
};

// Dimensiones que identifican cada tabla de la guía de GA4.
const TIPOS = [
  { tipo: 'contenidos', dims: ['Campaña de la sesión', 'Contenido de anuncio manual de la sesión'] },
  { tipo: 'campanas', dims: ['Campaña de la sesión'] },
  { tipo: 'canales', dims: ['Grupo de canales predeterminado de la sesión'] },
  { tipo: 'diario', dims: ['Fecha'] },
  { tipo: 'regiones', dims: ['Región'] },
  { tipo: 'ciudades', dims: ['Ciudad'] },
  { tipo: 'dispositivos', dims: ['Categoría de dispositivo'] },
  { tipo: 'paginas', dims: ['Ruta de página y clase de pantalla'] },
];

const DIMS = new Set(TIPOS.flatMap((t) => t.dims));

function fechaGa(s) {
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

/** Lee un CSV exportado de una exploración de GA4. Devuelve null si no lo es. */
export function leerGa4(path) {
  const text = readFileSync(path, 'utf8').replace(/^﻿/, '');
  const lines = text.split(/\r?\n/);
  const comentario = lines.filter((l) => l.startsWith('#')).map((l) => l.slice(1).trim());
  const rango = comentario.find((l) => /^\d{8}-\d{8}$/.test(l));
  if (!rango) return null;
  // Cabecera: propiedad, nombre de la pestaña y rango.
  const titulo = comentario.filter((l) => l && !/^-+$/.test(l))[1] ?? '';
  const periodo = { desde: fechaGa(rango.slice(0, 8)), hasta: fechaGa(rango.slice(9)) };
  const rows = parseCsv(lines.filter((l) => !l.startsWith('#')).join('\n')).filter((r) => r.some((c) => c !== ''));

  // Embudos: la fila 1 trae "Nombre del evento" y los eventos como columnas;
  // la fila 2, las dimensiones de las filas y la métrica repetida.
  const iEv = rows[0].indexOf('Nombre del evento');
  if (iEv >= 0) {
    const dims = rows[1].filter((d) => DIMS.has(d));
    const nd = dims.length;
    const eventos = rows[0].slice(nd).filter((e) => e !== 'Total');
    const filas = [];
    let total = null;
    for (const r of rows.slice(2)) {
      const vals = Object.fromEntries(eventos.map((e, k) => [e, num(r[nd + k]) ?? 0]));
      if (r[r.length - 1] === 'Total' && r.slice(0, nd).every((c) => c === '')) { total = vals; continue; }
      filas.push({ dims: r.slice(0, nd), ...vals });
    }
    return { tipo: nd === 2 ? 'embudoContenidos' : 'embudoCampanas', titulo, periodo, eventos, filas, total, path };
  }

  const header = rows[0];
  const dims = header.filter((h) => DIMS.has(h));
  const tipo = TIPOS.find((t) => t.dims.length === dims.length && t.dims.every((d, k) => dims[k] === d))?.tipo;
  if (!tipo) return null;
  const metricas = header.slice(dims.length).map((h) => METRICAS[h] ?? h);
  const filas = [];
  let total = null;
  for (const r of rows.slice(1)) {
    const vals = Object.fromEntries(metricas.map((m, k) => [m, num(r[dims.length + k])]));
    if (r[r.length - 1] === 'Total' && r.slice(0, dims.length).every((c) => c === '')) { total = vals; continue; }
    filas.push({ dims: r.slice(0, dims.length), ...vals });
  }
  return { tipo, titulo, periodo, metricas, filas, total, path };
}

// ---------- Meta (Administrador de anuncios) ----------

// La exportación sale en el idioma de la cuenta; se aceptan ambos.
const META_COLS = {
  inicioInforme: /^(Reporting starts|Inicio del informe)$/i,
  finInforme: /^(Reporting ends|Fin del informe)$/i,
  anuncio: /^(Ad name|Nombre del anuncio)$/i,
  campana: /^(Campaign name|Nombre de la campaña)$/i,
  conjunto: /^(Ad set name|Nombre del conjunto de anuncios)$/i,
  inicio: /^(Starts|Inicio)$/i,
  fin: /^(Ends|Finalización|Fin)$/i,
  gasto: /^(Amount spent|Importe gastado)/i,
  // Desde octubre de 2026 Meta exporta "Views" y "Viewers" en lugar de
  // impresiones y alcance.
  alcance: /^(Reach|Alcance|Viewers|Espectadores)$/i,
  impresiones: /^(Impressions|Impresiones|Views|Visualizaciones)$/i,
  // Resultado según el objetivo de cada campaña (compras, visitas, mensajes…).
  resultados: /^(Results|Resultados)$/i,
  indicador: /^(Result indicator|Indicador de resultados)$/i,
  frecuencia: /^(Frequency|Frecuencia)$/i,
  clics: /^(Link clicks|Clics en el enlace)$/i,
  ctr: /^CTR \((link|porcentaje de clics en el enlace)/i,
  cpc: /^CPC \((cost per link click|costo por clic en el enlace)/i,
  visitas: /^(Landing page views|Visitas a la página de destino)$/i,
};

/** Lee la exportación de la pestaña Anuncios. Devuelve null si no lo es. */
export function leerMeta(path) {
  const rows = parseCsv(readFileSync(path, 'utf8').replace(/^﻿/, '')).filter((r) => r.some((c) => c !== ''));
  const header = rows[0] ?? [];
  const idx = {};
  for (const [k, re] of Object.entries(META_COLS)) {
    const i = header.findIndex((h) => re.test(h.trim()));
    if (i >= 0) idx[k] = i;
  }
  if (idx.anuncio == null) return null;
  const texto = new Set(['inicioInforme', 'finInforme', 'anuncio', 'campana', 'conjunto', 'inicio', 'fin', 'indicador']);
  const anuncios = rows.slice(1).map((r) => {
    const a = {};
    for (const [k, i] of Object.entries(idx)) a[k] = texto.has(k) ? r[i] : num(r[i]);
    return a;
  });
  const columnas = Object.keys(idx);
  const periodo = { desde: anuncios[0]?.inicioInforme, hasta: anuncios[0]?.finInforme };
  // Las compras de Meta solo se leen como resultado de una campaña de ventas
  // (columna "Results"); la columna "Purchases" no se usa.
  return { tipo: 'meta', periodo, columnas, anuncios, path };
}

// ---------- Pretix (Excel "Lista de pedidos") ----------

function xml(path, entry) {
  return execFileSync('unzip', ['-p', path, entry], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

const ent = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

function hojas(path) {
  const entradas = execFileSync('unzip', ['-Z1', path], { encoding: 'utf8' }).split('\n');
  const lista = entradas.filter((n) => /^xl\/worksheets\/sheet\d+\.xml$/.test(n));
  const ss = [];
  const sst = entradas.includes('xl/sharedStrings.xml') ? xml(path, 'xl/sharedStrings.xml') : null;
  if (sst) for (const m of sst.matchAll(/<si>([\s\S]*?)<\/si>/g)) ss.push(ent([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join('')));
  return lista.map((entry) => {
    const rows = [];
    for (const rm of xml(path, entry).matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
      const row = [];
      for (const cm of rm[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        let col = 0;
        for (const ch of cm[1]) col = col * 26 + ch.charCodeAt(0) - 64;
        const tipo = /t="(\w+)"/.exec(cm[2])?.[1];
        const body = cm[3] ?? '';
        let val = null;
        if (tipo === 's') val = ss[Number(/<v>(.*?)<\/v>/.exec(body)?.[1])];
        else if (tipo === 'inlineStr') val = ent([...body.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join(''));
        else { const v = /<v>(.*?)<\/v>/.exec(body)?.[1]; val = v == null ? null : ent(v); }
        row[col - 1] = val;
      }
      rows.push(row);
    }
    return rows;
  });
}

/** Lee la exportación de pedidos de Pretix. Devuelve solo lo que el informe necesita. */
export function leerPretix(path) {
  const hs = hojas(path);
  const posiciones = hs.find((h) => h[0]?.includes('Producto') && h[0]?.includes('Precio') && h[0]?.includes('ID de posición'));
  const ordenes = hs.find((h) => h[0]?.includes('Total del pedido'));
  if (!posiciones || !ordenes) return null;

  const col = (h, nombre) => h[0].indexOf(nombre);
  const P = { codigo: col(posiciones, 'Código del pedido'), estado: col(posiciones, 'Estado'), fecha: col(posiciones, 'Fecha del pedido'), producto: col(posiciones, 'Producto'), precio: col(posiciones, 'Precio'), addon: col(posiciones, 'Add-on al ID de posición') };
  const O = { codigo: col(ordenes, 'Código del pedido'), estado: col(ordenes, 'Estado'), fecha: col(ordenes, 'Fecha del pedido'), total: col(ordenes, 'Total del pedido'), tasas: col(ordenes, 'Tasas') };

  const pedidos = ordenes.slice(1).filter((r) => r[O.codigo]).map((r) => ({
    codigo: r[O.codigo], estado: r[O.estado], fecha: r[O.fecha], total: Number(r[O.total] ?? 0), tasas: Number(r[O.tasas] ?? 0),
  }));
  const boletas = posiciones.slice(1).filter((r) => r[P.codigo] && !r[P.addon]).map((r) => ({
    codigo: r[P.codigo], estado: r[P.estado], fecha: r[P.fecha], producto: r[P.producto], precio: Number(r[P.precio] ?? 0),
  }));
  return { tipo: 'pretix', pedidos, boletas, path };
}
