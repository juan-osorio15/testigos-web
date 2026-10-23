// Genera el informe de ventas y visitas (feature 003) como presentación
// horizontal: un HTML autocontenido para mostrar en el computador y el PDF
// impreso desde ese mismo HTML con Chrome sin cabeza.
//
//   node scripts/informe/generar.mjs informes/<carpeta>            → informe.html e informe.pdf
//   node scripts/informe/generar.mjs informes/<carpeta> --resumen  → cifras para escribir las lecturas
//   node scripts/informe/generar.mjs informes/<carpeta> --sin-pdf  → solo el HTML
//
// La carpeta (ignorada por git: el repositorio es público) lleva:
//   datos/          las exportaciones tal cual (GA4, Meta, Pretix); se reconocen por sus columnas
//   contenido.mjs   lo que no sale de los datos: nombres legibles, tramos, lecturas de cada diapositiva
// El procedimiento completo está en specs/003-embudo-sitio/informe.md.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { leerGa4, leerMeta, leerPretix } from './leer.mjs';
import { pasos, ritmoDiario, tabla } from './graficos.mjs';
import { entero, esc, fechaCorta, fechaLarga, periodo, pct, pesos, texto } from './formato.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const dir = resolve(process.argv[2] ?? '');
const flags = new Set(process.argv.slice(3));
if (!process.argv[2] || !existsSync(join(dir, 'contenido.mjs'))) {
  console.error('uso: node scripts/informe/generar.mjs informes/<carpeta> [--resumen] [--sin-pdf]\n(la carpeta debe tener contenido.mjs y datos/)');
  process.exit(1);
}
const C = (await import(pathToFileURL(join(dir, 'contenido.mjs')).href)).default;

// ---------- Lectura ----------

const fuentes = {};
for (const f of readdirSync(join(dir, 'datos')).sort()) {
  const p = join(dir, 'datos', f);
  if (/\.(jpe?g|png)$/i.test(f)) continue; // imágenes que usa contenido.mjs, no datos
  const r = f.endsWith('.xlsx') ? leerPretix(p) : f.endsWith('.csv') ? leerGa4(p) ?? leerMeta(p) : null;
  if (!r) { console.warn(`· sin reconocer: ${f}`); continue; }
  if (fuentes[r.tipo]) console.warn(`· ${f} repite la tabla "${r.tipo}" de ${fuentes[r.tipo].path.split('/').pop()}; se usa la última`);
  fuentes[r.tipo] = r;
}
const { pretix, meta, campanas, contenidos, canales, regiones, dispositivos, paginas, embudoCampanas } = fuentes;

const nombre = (k) => C.nombres?.[k] ?? k;
const excluida = (camp) => C.excluirCampanas?.test(camp) ?? false;

// ---------- Ventas (Pretix) ----------

let ventas = null;
if (pretix) {
  const pagados = pretix.pedidos.filter((p) => p.estado === 'pagado');
  const boletas = pretix.boletas.filter((b) => b.estado === 'pagado');
  const otros = {};
  for (const p of pretix.pedidos) if (p.estado !== 'pagado') otros[p.estado] = (otros[p.estado] ?? 0) + 1;
  const prod = new Map();
  for (const b of boletas) {
    const k = `${b.producto}|${b.precio}`;
    const x = prod.get(k) ?? { nombre: C.productos?.[k] ?? b.producto, producto: b.producto, precio: b.precio, boletas: 0, valor: 0 };
    x.boletas++; x.valor += b.precio;
    prod.set(k, x);
  }
  const dias = new Map();
  for (const b of boletas) dias.set(b.fecha, (dias.get(b.fecha) ?? 0) + 1);
  const fechas = boletas.map((b) => b.fecha).sort();
  ventas = {
    pedidos: pagados.length,
    boletas: boletas.length,
    valor: boletas.reduce((s, b) => s + b.precio, 0),
    comisiones: pagados.reduce((s, p) => s + p.tasas, 0),
    otros,
    // Por producto (el que más vende primero) y, dentro de cada uno, por precio.
    productos: [...prod.values()].sort((a, b) => {
      const t = (x) => boletas.filter((b) => b.producto === x.producto).length;
      return t(b) - t(a) || a.producto.localeCompare(b.producto) || a.precio - b.precio;
    }),
    dias,
    desde: fechas[0],
    hasta: fechas.at(-1),
  };
  ventas.tramos = (C.tramos ?? []).map((tr) => {
    let n = 0;
    for (const [d, v] of dias) if (d >= tr.desde && d <= tr.hasta) n += v;
    const ndias = Math.round((Date.parse(tr.hasta) - Date.parse(tr.desde)) / 86400000) + 1;
    return { ...tr, boletas: n, dias: ndias, porDia: n / ndias };
  });
}

// ---------- Anuncios (Meta) ----------

let anuncios = null;
if (meta) {
  // Un anuncio que corrió en varios conjuntos (públicos) va en una fila por
  // conjunto: el costo por visita cambia mucho de un público a otro.
  const conjuntos = new Map();
  for (const a of meta.anuncios) conjuntos.set(a.anuncio.trim(), new Set([...(conjuntos.get(a.anuncio.trim()) ?? []), a.conjunto?.trim()]));
  const porNombre = new Map();
  for (const a of meta.anuncios) {
    const base = a.anuncio.trim();
    const partir = conjuntos.get(base).size > 1;
    const k = partir ? `${base}|${a.conjunto.trim()}` : base;
    const etiqueta = partir ? `${nombre(base)} · ${nombre(a.conjunto.trim())}` : nombre(base);
    const x = porNombre.get(k) ?? { nombre: etiqueta, n: 0, inicio: a.inicio, fin: a.fin, visitas: null, gasto: null, alcance: null, clics: null, impresiones: null };
    x.n++;
    if (a.inicio && a.inicio < x.inicio) x.inicio = a.inicio;
    if (a.fin && a.fin > x.fin) x.fin = a.fin;
    for (const m of ['visitas', 'gasto', 'alcance', 'clics', 'impresiones']) if (a[m] != null) x[m] = (x[m] ?? 0) + a[m];
    porNombre.set(k, x);
  }
  // Los anuncios sin visitas registradas no se muestran: no hay nada que leer.
  const lista = [...porNombre.values()].filter((a) => a.visitas).sort((a, b) => b.visitas - a.visitas);
  for (const a of lista) a.tenue = a.visitas < (C.minVisitas ?? 20);
  const conGasto = meta.columnas.includes('gasto');
  anuncios = {
    lista,
    conGasto,
    visitas: lista.reduce((s, a) => s + (a.visitas ?? 0), 0),
    // La inversión total incluye los anuncios sin visitas.
    gasto: conGasto ? [...porNombre.values()].reduce((s, a) => s + (a.gasto ?? 0), 0) : null,
    desde: lista.map((a) => a.inicio).filter(Boolean).sort()[0],
    hasta: lista.map((a) => a.fin).filter(Boolean).sort().at(-1),
  };
}

// Pauta por objetivo: la exportación nueva de Meta trae el resultado de cada
// anuncio según el objetivo de su campaña, no las visitas a la página.
const RESULTADOS = {
  'actions:offsite_conversion.fb_pixel_purchase': ['compra', 'compras'],
  'actions:omni_landing_page_view': ['visita', 'visitas'],
  'actions:post_interaction_gross': ['interacción', 'interacciones'],
  'actions:onsite_conversion.messaging_conversation_started_7d': ['conversación', 'conversaciones'],
};
let pauta = null;
if (meta?.columnas.includes('resultados') && meta.columnas.includes('campana')) {
  const grupos = new Map();
  for (const a of meta.anuncios) {
    const camp = a.campana.trim();
    const g = grupos.get(camp) ?? { camp, indicador: null, gasto: 0, impresiones: 0, resultados: 0, anuncios: [] };
    g.gasto += a.gasto ?? 0; g.impresiones += a.impresiones ?? 0; g.resultados += a.resultados ?? 0;
    g.indicador ??= a.indicador || null;
    g.anuncios.push({ nombre: nombre(a.anuncio.trim()), gasto: a.gasto ?? 0, impresiones: a.impresiones ?? 0, resultados: a.resultados ?? 0, indicador: a.indicador || g.indicador });
    grupos.set(camp, g);
  }
  const lista = [...grupos.values()].sort((a, b) => b.gasto - a.gasto);
  for (const g of lista) g.anuncios.sort((a, b) => b.gasto - a.gasto);
  pauta = {
    lista,
    gasto: lista.reduce((s, g) => s + g.gasto, 0),
    impresiones: lista.reduce((s, g) => s + g.impresiones, 0),
    desde: meta.anuncios.map((a) => a.inicio).filter(Boolean).sort()[0],
    hasta: meta.periodo.hasta,
  };
}

// ---------- GA4 ----------

// Sesiones a partir de las sesiones con interacción y su porcentaje, cuando
// la exportación no trae la columna "Sesiones".
const ses = (f) => f.sesiones ?? (f.pctInt ? f.sesionesInt / f.pctInt : 0);

const CANALES = {
  'Paid Social': 'Redes · tráfico pagado',
  'Organic Social': 'Redes · tráfico orgánico',
  'Direct': 'Tráfico directo',
  'Organic Search': 'Google · tráfico orgánico',
  'Referral': 'Enlaces en otros sitios',
  'Email': 'Correo',
  'Paid Other': 'Otro tráfico pagado',
  'Paid Search': 'Google · tráfico pagado',
  'Unassigned': 'Sin clasificar',
};

let canalesM = null;
if (canales) {
  const ocultos = new Set(C.ocultarCanales ?? []);
  const filas = canales.filas
    .filter((f) => !ocultos.has(f.dims[0]))
    .map((f) => ({ nombre: CANALES[f.dims[0]] ?? f.dims[0], nuevos: f.nuevos, pctInt: f.pctInt, comprar: f.comprar, tenue: ses(f) < (C.minVisitas ?? 20) }))
    .sort((a, b) => b.nuevos - a.nuevos);
  canalesM = { periodo: canales.periodo, filas, nuevos: filas.reduce((s, f) => s + f.nuevos, 0) };
}

// Campañas propias (con UTM) y sus piezas, desde la tabla de contenidos.
const SIN_CAMPANA = new Set(['(direct)', '(organic)', '(referral)', '(not set)']);
let campanasM = null;
if (contenidos) {
  const grupos = new Map();
  for (const f of contenidos.filas) {
    let [camp, cont] = f.dims;
    if (excluida(camp)) continue;
    if (C.reasignarContenido?.[cont]) camp = C.reasignarContenido[cont];
    if (SIN_CAMPANA.has(camp)) continue;
    if (!f.sesionesInt && !f.nuevos) continue; // filas de compras sin visita
    const g = grupos.get(camp) ?? { camp, piezas: new Map() };
    const p = g.piezas.get(cont) ?? { cont, nuevos: 0, sesionesInt: 0, sesiones: 0, comprar: 0 };
    p.nuevos += f.nuevos ?? 0; p.sesionesInt += f.sesionesInt ?? 0; p.sesiones += ses(f); p.comprar += f.comprar ?? 0;
    g.piezas.set(cont, p);
    grupos.set(camp, g);
  }
  const lista = [...grupos.values()].map((g) => {
    const piezas = [...g.piezas.values()].sort((a, b) => b.nuevos - a.nuevos);
    const s = (k) => piezas.reduce((t, p) => t + p[k], 0);
    return { camp: g.camp, piezas, nuevos: s('nuevos'), sesionesInt: s('sesionesInt'), sesiones: s('sesiones'), comprar: s('comprar') };
  }).sort((a, b) => b.nuevos - a.nuevos);
  campanasM = { periodo: contenidos.periodo, lista };
}

// Embudo de la semana, todo en visitas: visitas, visitas con interacción y
// clics en Comprar. Sin las pruebas del equipo ni la fila "(not set)", que
// hasta el 12 de octubre eran sobre todo las compras del plugin sin visita.
let recorrido = null;
if (campanas) {
  const filas = campanas.filas.filter((f) => !excluida(f.dims[0]) && f.dims[0] !== '(not set)');
  const s = (k) => filas.reduce((t, f) => t + (f[k] ?? 0), 0);
  recorrido = { periodo: campanas.periodo, visitas: filas.reduce((t, f) => t + ses(f), 0), sesionesInt: s('sesionesInt'), comprar: s('comprar') };
  if (ventas) {
    const { desde, hasta } = campanas.periodo;
    recorrido.pedidos = pretix.pedidos.filter((p) => p.estado === 'pagado' && p.fecha >= desde && p.fecha <= hasta).length;
  }
}

// Regiones: departamentos de Colombia con nombre de GA4 (en inglés y sin tildes).
const COLOMBIA = new Set(['Bogota', 'Antioquia', 'Atlantico', 'Bolivar', 'Boyaca', 'Caldas', 'Caqueta', 'Cauca', 'Cesar', 'Cordoba', 'Cundinamarca', 'Choco', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Narino', 'North Santander', 'Quindio', 'Risaralda', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Arauca', 'Casanare', 'Putumayo', 'San Andres and Providencia', 'Amazonas', 'Guainia', 'Guaviare', 'Vaupes', 'Vichada']);
const DEPTOS = { Bogota: 'Bogotá', Boyaca: 'Boyacá', Atlantico: 'Atlántico', 'North Santander': 'Norte de Santander', Narino: 'Nariño', Quindio: 'Quindío', Cordoba: 'Córdoba', Caqueta: 'Caquetá', Bolivar: 'Bolívar' };
let audiencia = null;
if (regiones) {
  const filas = regiones.filas.filter((f) => f.dims[0] !== '(not set)');
  const total = filas.reduce((s, f) => s + (f.nuevos ?? 0), 0);
  const col = filas.filter((f) => COLOMBIA.has(f.dims[0])).sort((a, b) => b.nuevos - a.nuevos);
  const top = col.slice(0, C.regionesVisibles ?? 5);
  const resto = col.slice(top.length);
  const fuera = filas.filter((f) => !COLOMBIA.has(f.dims[0]));
  const agg = (nom, fs) => ({ nombre: nom, nuevos: fs.reduce((s, f) => s + (f.nuevos ?? 0), 0), comprar: fs.reduce((s, f) => s + (f.comprar ?? 0), 0), n: fs.length });
  const lista = [...top.map((f) => agg(DEPTOS[f.dims[0]] ?? f.dims[0], [f])), agg(`Resto de Colombia`, resto), agg('Fuera de Colombia', fuera)];
  for (const r of lista) { r.parte = r.nuevos / total; r.intencion = r.nuevos ? r.comprar / r.nuevos : 0; }
  audiencia = { periodo: regiones.periodo, total, lista, restoN: resto.length, fueraN: fuera.length };
}
let equipos = null;
if (dispositivos) {
  const total = dispositivos.filas.reduce((s, f) => s + ses(f), 0);
  const NOM = { mobile: 'Celular', desktop: 'Computador', tablet: 'Tableta' };
  equipos = { periodo: dispositivos.periodo, lista: dispositivos.filas.map((f) => ({ nombre: NOM[f.dims[0]] ?? f.dims[0], parte: ses(f) / total, pctInt: f.pctInt, comprar: f.comprar })).sort((a, b) => b.parte - a.parte) };
}

// Páginas por sección, con los nombres de panelistas y conversatorios del sitio.
function nombresDe(archivo, campo) {
  const src = readFileSync(join(root, 'src/data', archivo), 'utf8');
  const m = new Map();
  for (const x of src.matchAll(new RegExp(`slug: '([^']+)',[\\s\\S]*?${campo}: '((?:[^'\\\\]|\\\\.)+)'`, 'g'))) if (!m.has(x[1])) m.set(x[1], x[2].replace(/\\'/g, "'"));
  return m;
}
let lectura = null;
if (paginas) {
  const panel = nombresDe('speakers.ts', 'name');
  const charlas = nombresDe('agenda.ts', 'title');
  const SECC = [
    ['Portada', (r) => r === '/' || r === '/en/' || r === '/en'],
    ['Panelistas', (r) => r.startsWith('/panelistas/')],
    ['Programación', (r) => r.startsWith('/programacion/')],
    ['Charlas abiertas', (r) => r.startsWith('/charlas-abiertas/')],
    ['Cómo llegar', (r) => r.startsWith('/como-llegar/')],
    ['Textos legales', (r) => r.startsWith('/tratamiento-de-datos/') || r.startsWith('/terminos-y-condiciones/')],
  ];
  const filas = paginas.filas.filter((f) => f.dims[0].startsWith('/'));
  const total = filas.reduce((s, f) => s + f.vistas, 0);
  const secciones = SECC.map(([nom, ok]) => ({ nombre: nom, vistas: filas.filter((f) => ok(f.dims[0])).reduce((s, f) => s + f.vistas, 0) })).filter((s) => s.vistas);
  for (const s of secciones) s.parte = s.vistas / total;
  // Las tres fichas más vistas de una sección (una ruta por ficha, sin subpáginas).
  const fichas = (pref, mapa) => filas
    .filter((f) => f.dims[0].startsWith(pref))
    .map((f) => ({ slug: f.dims[0].slice(pref.length).replace(/\/$/, ''), vistas: f.vistas }))
    .filter((x) => x.slug && !x.slug.includes('/') && mapa.has(x.slug))
    .sort((a, b) => b.vistas - a.vistas).slice(0, 3)
    .map((x) => ({ nombre: mapa.get(x.slug), vistas: x.vistas }));
  lectura = {
    periodo: paginas.periodo, total, secciones,
    panelistas: fichas('/panelistas/', panel),
    conversatorios: fichas('/programacion/', charlas),
  };
}

// ---------- Resumen para escribir las lecturas ----------

if (flags.has('--resumen')) {
  const out = { ventas: ventas && { ...ventas, dias: Object.fromEntries([...ventas.dias].sort()) }, anuncios, pauta, canales: canalesM, campanas: campanasM && campanasM.lista.map((g) => ({ ...g, piezas: g.piezas })), recorrido, audiencia, equipos, lectura };
  console.log(JSON.stringify(out, (k, v) => (v instanceof Map ? Object.fromEntries(v) : v), 2));
  process.exit(0);
}

// ---------- Diapositivas ----------

const D = C.diapositivas ?? {};
const faltan = [];

function diapositiva(id, { eyebrow, pregunta, cuerpo, fuente, cifras = [] }) {
  const d = D[id] ?? {};
  if (d.omitir) return '';
  const lect = d.lectura ?? (faltan.push(id), 'Falta escribir la lectura de esta diapositiva en contenido.mjs.');
  const cs = d.cifras ?? cifras;
  return { id, html: (n) => `
<section class="slide contenido${cs.length ? '' : ' sin-cifras'}" id="${id}">
  <div class="datos">
    <p class="eyebrow">${String(n).padStart(2, '0')} · ${esc(eyebrow)}</p>
    <h2>${esc(d.pregunta ?? pregunta)}</h2>
    <div class="cuerpo">${cuerpo}</div>
    <p class="fuente">${esc(fuente)}</p>
  </div>
  ${cs.length ? `<div class="cifras">${cs.map((c) => `<div class="cifra"><p class="num">${esc(c.valor)}</p><p class="et">${esc(c.etiqueta)}</p></div>`).join('')}</div>` : ''}
  <div class="lectura">
    <p class="et">Lo que nos dice</p>
    <p class="texto">${texto(lect)}</p>
    ${d.accion ? `<p class="et">Qué hacer</p><p class="accion">${texto(d.accion)}</p>` : ''}
    <p class="pie">${esc(C.marca ?? 'Testigos de la Memoria')} · ${n}</p>
  </div>
</section>` };
}

const slides = [];

if (ventas) {
  slides.push(diapositiva('resultados', {
    eyebrow: 'Resultados',
    pregunta: '¿Cuánto hemos vendido hasta hoy?',
    cuerpo: tabla({
      cols: [
        { titulo: 'Boleta', clave: 'nombre', tipo: 'txt' },
        { titulo: 'Precio', clave: 'precio', tipo: 'num', formato: pesos },
        { titulo: 'Boletas', clave: 'boletas', tipo: 'barra', formato: entero },
        { titulo: 'Valor', clave: 'valor', tipo: 'num', formato: pesos },
      ],
      filas: [...ventas.productos, { nombre: 'Total', precio: '', boletas: ventas.boletas, valor: ventas.valor, grupo: true }],
      nota: `${entero(ventas.pedidos)} pedidos pagados. Valor de las boletas sin las comisiones de la tienda.${Object.keys(ventas.otros).length ? ` Además: ${Object.entries(ventas.otros).map(([k, v]) => `${v} ${k}`).join(', ')}.` : ''}`,
    }),
    fuente: `Fuente: Pretix, pedidos pagados del ${periodo({ desde: ventas.desde, hasta: ventas.hasta })}`,
    cifras: [
      { valor: entero(ventas.boletas), etiqueta: 'boletas vendidas' },
      { valor: pesos(ventas.valor), etiqueta: 'en boletas' },
    ],
  }));

  if (ventas.tramos.length) {
    const desde = ventas.tramos[0].desde;
    const hasta = ventas.tramos.at(-1).hasta;
    const top = [...ventas.dias].filter(([d]) => d >= desde && d <= hasta).sort((a, b) => b[1] - a[1])[0];
    slides.push(diapositiva('ritmo', {
      eyebrow: 'Ritmo de ventas',
      pregunta: '¿Qué movió las ventas?',
      cuerpo: ritmoDiario({ dias: ventas.dias, desde, hasta, tramos: ventas.tramos, destacar: C.destacarDias ?? (top ? [top[0]] : []) })
        + tabla({
          cols: [
            { titulo: 'Tramo', clave: 'nombre', tipo: 'txt' },
            { titulo: 'Días', clave: 'dias', tipo: 'num', formato: entero },
            { titulo: 'Boletas', clave: 'boletas', tipo: 'num', formato: entero },
            { titulo: 'Boletas por día', clave: 'porDia', tipo: 'barra', formato: (v) => v.toLocaleString('es-CO', { maximumFractionDigits: 1 }) },
          ],
          filas: ventas.tramos,
        }),
      fuente: `Fuente: Pretix (boletas por día) y Meta (fechas de los anuncios)`,
      cifras: top ? [{ valor: entero(top[1]), etiqueta: `boletas el ${fechaCorta(top[0])}` }] : [],
    }));
  }
}

// Redes en Meta: la parte de arriba del embudo, antes de la pauta y del
// sitio. Sin exportación: las cifras vienen de las capturas de Meta Business
// Suite y se copian en contenido.mjs (organico).
// Imágenes de datos/ (recortes de capturas), incrustadas en el HTML.
const incrustar = (archivo) => {
  const tipo = /\.png$/i.test(archivo) ? 'png' : 'jpeg';
  return `data:image/${tipo};base64,${readFileSync(join(dir, 'datos', archivo)).toString('base64')}`;
};

const O = C.organico;
if (O) {
  const filas = O.redes.map((r) => ({ ...r, pctOrg: r.organicas / r.vistas }));
  const lista = (titulo, xs) => `<div class="mini"><p class="et">${esc(titulo)}</p><ol>${xs.map((x) => `<li><span>${esc(x.nombre)}</span><span class="v">${entero(x.valor)}</span></li>`).join('')}</ol></div>`;
  // Miniatura del contenido más visto, recortada de la captura de Meta.
  const foto = (f) => {
    if (!f) return '';
    return `<figure class="foto"><img src="${incrustar(f.archivo)}" alt="${esc(f.pie)}"><figcaption>${texto(f.pie)}</figcaption></figure>`;
  };
  slides.push(diapositiva('organico', {
    eyebrow: 'Redes sociales',
    pregunta: '¿Cuánta gente nos ve en redes y cuánta llega sin pauta?',
    cuerpo: tabla({
      cols: [
        { titulo: 'Red', clave: 'nombre', tipo: 'txt' },
        { titulo: 'Reproducciones', clave: 'vistas', tipo: 'barra', formato: entero },
        { titulo: 'Sin pauta', clave: 'pctOrg', tipo: 'num', formato: pct },
        { titulo: 'Clics en enlaces', clave: 'clics', tipo: 'num', formato: entero },
        { titulo: 'Seguidores nuevos', clave: 'seguidores', tipo: 'num', formato: entero },
      ],
      filas,
      nota: 'Reproducciones: veces que se vio una publicación, historia o video. Sin pauta: parte de las reproducciones que no vino de anuncios.',
    }) + (O.listas?.length ? `<div class="minis${O.foto ? ' con-foto' : ''}">${foto(O.foto)}${O.listas.map((l) => lista(l.titulo, l.items)).join('')}</div>` : ''),
    fuente: `Fuente: Meta Business Suite, ${periodo(O.periodo)}`,
    cifras: O.cifras ?? [],
  }));
}

// Plan de contenido: lo que se publicó en la semana y lo que viene, con los
// aliados por los que se llega a públicos nuevos. Todo viene de contenido.mjs.
const P = C.plan;
if (P) {
  const pieza = (x) => `<li class="pieza">${x.foto ? `<img src="${incrustar(x.foto)}" alt="${esc(x.titulo)}">` : ''}<div><p class="t">${esc(x.titulo)}</p><p class="d">${texto(x.texto)}</p>${x.dato ? `<p class="dato">${texto(x.dato)}</p>` : ''}</div></li>`;
  slides.push(diapositiva('plan', {
    eyebrow: 'Plan de contenido',
    pregunta: '¿Qué contamos esta semana y qué viene?',
    cuerpo: `<div class="plan">${P.columnas.map((c) => `<div class="mini"><p class="et">${esc(c.titulo)}</p><ul>${c.items.map(pieza).join('')}</ul></div>`).join('')}</div>`
      + (P.aliados ? `<div class="aliados"><p class="et">${esc(P.aliados.titulo)}</p><ul>${P.aliados.items.map((a) => `<li${a.hecho ? ' class="hecho"' : ''}>${esc(a.nombre)}</li>`).join('')}</ul>${P.aliados.nota ? `<p class="nota">${texto(P.aliados.nota)}</p>` : ''}</div>` : ''),
    fuente: P.fuente ?? 'Fuente: equipo de contenido',
    cifras: P.cifras ?? [],
  }));
}

if (pauta) {
  const res = (v, f) => {
    const [uno, varios] = RESULTADOS[f.indicador] ?? ['resultado', 'resultados'];
    return `${entero(v)} ${v === 1 ? uno : varios}`;
  };
  const filas = [];
  for (const g of pauta.lista) {
    filas.push({ nombre: nombre(g.camp), gasto: g.gasto, impresiones: g.impresiones, resultados: g.resultados || null, indicador: g.indicador, costo: g.resultados ? g.gasto / g.resultados : null, grupo: true });
    // Los anuncios con inversión mínima no se muestran; sí cuentan en su campaña.
    for (const a of g.anuncios.filter((a) => a.gasto >= (C.minInversion ?? 1000))) {
      filas.push({ ...a, resultados: a.resultados || null, costo: a.resultados ? a.gasto / a.resultados : null, sangria: true });
    }
  }
  slides.push(diapositiva('pauta', {
    eyebrow: 'Pauta en Meta',
    pregunta: '¿Qué consiguió cada peso invertido en anuncios?',
    cuerpo: tabla({
      cols: [
        { titulo: 'Objetivo y anuncio', clave: 'nombre', tipo: 'txt' },
        { titulo: 'Inversión', clave: 'gasto', tipo: 'barra', formato: pesos },
        { titulo: 'Resultado', clave: 'resultados', tipo: 'num', formato: res },
        { titulo: 'Por resultado', clave: 'costo', tipo: 'num', formato: pesos },
      ],
      filas,
      nota: C.notaPauta ?? 'Cada campaña busca un resultado distinto: compras en la tienda, visitas al sitio, interacciones con la publicación o conversaciones por mensaje. Compras según el píxel de Meta.',
    }),
    fuente: `Fuente: Meta, Administrador de anuncios, ${periodo({ desde: pauta.desde, hasta: pauta.hasta })}`,
    cifras: [{ valor: pesos(pauta.gasto), etiqueta: 'invertidos' }, { valor: entero(pauta.impresiones), etiqueta: 'impresiones' }],
  }));
}

if (anuncios?.lista.length) {
  const cols = [
    { titulo: 'Anuncio', clave: 'nombre', tipo: 'txt', formato: (v, f) => (f.n > 1 ? `${v} (${f.n} anuncios)` : v) },
    { titulo: 'Fechas', clave: 'inicio', tipo: 'txt', formato: (v, f) => (f.inicio.slice(0, 7) === f.fin.slice(0, 7) ? `${Number(f.inicio.slice(8))} a ${fechaCorta(f.fin)}` : `${fechaCorta(f.inicio)} a ${fechaCorta(f.fin)}`) },
    { titulo: 'Visitas', clave: 'visitas', tipo: 'barra', formato: entero },
  ];
  if (anuncios.conGasto) cols.push({ titulo: 'Inversión', clave: 'gasto', tipo: 'num', formato: pesos }, { titulo: 'Por visita', clave: 'cpv', tipo: 'num', formato: pesos });
  for (const a of anuncios.lista) a.cpv = a.gasto && a.visitas ? a.gasto / a.visitas : null;
  slides.push(diapositiva('anuncios', {
    eyebrow: 'Anuncios',
    pregunta: '¿Qué trajo cada anuncio?',
    cuerpo: tabla({ cols, filas: anuncios.lista, nota: 'Visitas a la página: personas que tocaron el anuncio y alcanzaron a ver cargar el sitio. Retargeting: anuncios para quienes ya interactuaron con el evento. En gris, anuncios con muy pocas visitas para sacar conclusiones.' }),
    fuente: `Fuente: Meta, Administrador de anuncios, ${periodo({ desde: anuncios.desde, hasta: anuncios.hasta })}`,
    cifras: [{ valor: entero(anuncios.visitas), etiqueta: 'visitas a la página desde anuncios' }, ...(anuncios.conGasto ? [{ valor: pesos(anuncios.gasto), etiqueta: 'invertidos' }] : [])],
  }));
}

if (audiencia) {
  const eq = equipos ? `<div class="equipos">${equipos.lista.map((e) => `<div class="equipo"><p class="num">${pct(e.parte)}</p><p class="et">${esc(e.nombre)}</p></div>`).join('')}<p class="equipos-nota">de las visitas, por equipo</p></div>` : '';
  slides.push(diapositiva('audiencia', {
    eyebrow: 'Quién nos visita',
    pregunta: '¿Desde dónde nos visitan y con qué intención?',
    cuerpo: tabla({
      cols: [
        { titulo: 'Desde', clave: 'nombre', tipo: 'txt', formato: (v, f) => (f.n > 1 ? `${v} (${f.n})` : v) },
        { titulo: 'Personas nuevas', clave: 'nuevos', tipo: 'barra', formato: entero },
        { titulo: 'Del total', clave: 'parte', tipo: 'num', formato: pct },
        { titulo: 'Intención de compra', clave: 'intencion', tipo: 'num', formato: (v) => entero(v * 100) },
      ],
      filas: audiencia.lista,
      nota: 'Intención de compra: clics en Comprar por cada 100 personas nuevas.',
    }) + eq,
    fuente: `Fuente: Google Analytics, ${periodo(audiencia.periodo)}. Solo quienes aceptaron las cookies`,
    cifras: [audiencia.lista[0], audiencia.lista[1]].filter(Boolean).map((r) => ({ valor: pct(r.parte), etiqueta: `desde ${r.nombre}` })),
  }));
}

if (lectura) {
  const lista = (titulo, xs) => `<div class="mini"><p class="et">${esc(titulo)}</p><ol>${xs.map((x) => `<li><span>${esc(x.nombre)}</span><span class="v">${entero(x.vistas)}</span></li>`).join('')}</ol></div>`;
  slides.push(diapositiva('paginas', {
    eyebrow: 'Qué leen',
    pregunta: '¿Qué mira la gente en el sitio?',
    cuerpo: tabla({
      cols: [
        { titulo: 'Sección', clave: 'nombre', tipo: 'txt' },
        { titulo: 'Vistas', clave: 'vistas', tipo: 'barra', formato: entero },
        { titulo: 'Del total', clave: 'parte', tipo: 'num', formato: pct },
      ],
      filas: lectura.secciones,
    }) + `<div class="minis">${lista('Panelistas más consultados', lectura.panelistas)}${lista('Conversatorios más consultados', lectura.conversatorios)}</div>`,
    fuente: `Fuente: Google Analytics, ${periodo(lectura.periodo)}. Solo quienes aceptaron las cookies`,
    cifras: lectura.secciones[0] ? [{ valor: pct(lectura.secciones[0].parte), etiqueta: `de las vistas, en la ${lectura.secciones[0].nombre.toLowerCase()}` }] : [],
  }));
}

if (canalesM) {
  slides.push(diapositiva('canales', {
    eyebrow: 'Canales de adquisición',
    pregunta: '¿Por dónde llega la gente?',
    cuerpo: tabla({
      cols: [
        { titulo: 'Canal', clave: 'nombre', tipo: 'txt' },
        { titulo: 'Personas nuevas', clave: 'nuevos', tipo: 'barra', formato: entero },
        { titulo: 'Tasa de interacción', clave: 'pctInt', tipo: 'num', formato: pct },
        { titulo: 'Clics en Comprar', clave: 'comprar', tipo: 'num', formato: entero },
      ],
      filas: canalesM.filas,
      nota: `Tasa de interacción: parte de las visitas que duran más de 10 segundos, ven dos páginas o tienen alguna acción. En gris, menos de ${C.minVisitas ?? 20} visitas.`,
    }),
    fuente: `Fuente: Google Analytics, ${periodo(canalesM.periodo)}. Solo quienes aceptaron las cookies`,
    cifras: canalesM.filas[0] ? [{ valor: pct(canalesM.filas[0].nuevos / canalesM.nuevos), etiqueta: `de las personas nuevas: ${canalesM.filas[0].nombre.toLowerCase()}` }] : [],
  }));
}

if (recorrido) {
  const ps = [
    { nombre: 'Visitas', valor: recorrido.visitas, fuente: 'Google Analytics' },
    { nombre: 'Visitas con interacción', valor: recorrido.sesionesInt, fuente: 'Google Analytics' },
    { nombre: 'Intención de compra (clics en Comprar)', valor: recorrido.comprar, fuente: 'Google Analytics' },
    ...(recorrido.pedidos != null ? [{ nombre: 'Venta (pedidos pagados)', valor: recorrido.pedidos, fuente: 'Pretix, todos los compradores', aparte: true }] : []),
  ];
  slides.push(diapositiva('embudo', {
    eyebrow: 'Embudo de ventas',
    pregunta: '¿Cómo avanza la gente desde la visita hasta la compra?',
    cuerpo: pasos(ps),
    fuente: `Fuente: Google Analytics y Pretix, ${periodo(recorrido.periodo)}`,
    cifras: [],
  }));
}

if (campanasM) {
  const filas = [];
  // Con ocultarTenues, las campañas y piezas con muy pocas visitas no se
  // muestran (la campaña sigue sumando las suyas), para que la tabla quepa.
  const min = C.minVisitas ?? 20;
  for (const g of campanasM.lista) {
    if (C.ocultarTenues && g.sesiones < min) continue;
    const piezas = C.ocultarTenues ? g.piezas.filter((p) => p.sesiones >= min) : g.piezas;
    const una = piezas.length === 1;
    const pieza = una ? nombre(piezas[0].cont) : '';
    filas.push({ nombre: pieza ? `${nombre(g.camp)} · ${pieza}` : nombre(g.camp), nuevos: g.nuevos, pctInt: g.sesiones ? g.sesionesInt / g.sesiones : null, comprar: g.comprar, grupo: true, tenue: g.sesiones < (C.minVisitas ?? 20) });
    if (!una) for (const p of piezas) filas.push({ nombre: nombre(p.cont), nuevos: p.nuevos, pctInt: p.sesiones ? p.sesionesInt / p.sesiones : null, comprar: p.comprar, sangria: true, tenue: p.sesiones < (C.minVisitas ?? 20) });
  }
  slides.push(diapositiva('campanas', {
    eyebrow: 'Campañas y piezas',
    pregunta: '¿Qué campaña y qué pieza trae gente con intención de comprar?',
    cuerpo: tabla({
      cols: [
        { titulo: 'Campaña y pieza', clave: 'nombre', tipo: 'txt' },
        { titulo: 'Personas nuevas', clave: 'nuevos', tipo: 'barra', formato: entero },
        { titulo: 'Tasa de interacción', clave: 'pctInt', tipo: 'num', formato: pct },
        { titulo: 'Clics en Comprar', clave: 'comprar', tipo: 'num', formato: entero },
      ],
      filas,
      nota: `En gris, filas con menos de ${C.minVisitas ?? 20} visitas: muy pocas para sacar conclusiones.`,
    }),
    fuente: `Fuente: Google Analytics, ${periodo(campanasM.periodo)}. Solo enlaces con campaña`,
    cifras: [],
  }));
}

// Cierre y anexo.
const lista = (xs) => `<ol class="cierre-lista">${(xs ?? []).map((x) => `<li>${texto(x)}</li>`).join('')}</ol>`;
const cierre = (n) => `
<section class="slide cierre" id="cierre">
  <div class="aprendimos"><p class="eyebrow">${String(n).padStart(2, '0')} · En resumen</p><h2>Lo que aprendimos</h2>${lista(C.conclusiones)}</div>
  <div class="pasos-siguientes"><p class="eyebrow">Siguientes pasos</p>${lista(C.siguientes)}</div>
</section>`;
const anexo = (n) => C.comoLeer?.length ? `
<section class="slide anexo" id="como-leer">
  <div class="datos"><p class="eyebrow">${String(n).padStart(2, '0')} · Anexo</p><h2>Cómo leer estos números</h2>
  <div class="anexo-grid">${C.comoLeer.map((x) => `<div><p class="et">${esc(x.titulo)}</p><p>${texto(x.texto)}</p></div>`).join('')}</div></div>
</section>` : '';

const portada = `
<section class="slide portada" id="portada">
  <div class="titulo">
    <p class="eyebrow">${esc(C.eyebrowPortada ?? 'Informe')}</p>
    <h1>${esc(C.titulo)}<span class="remate">${esc(C.remate ?? '')}</span></h1>
  </div>
  <div class="identidad">${readFileSync(join(root, 'src/assets/logo/logo-lockup.svg'), 'utf8').replace('<svg ', '<svg class="logo" ')}</div>
  <div class="franja">
    ${C.portada ? `<p class="num">${esc(C.portada.desde.slice(0, 7) === C.portada.hasta.slice(0, 7) ? `${Number(C.portada.desde.slice(8))} al ${fechaCorta(C.portada.hasta)}` : `${fechaCorta(C.portada.desde)} a ${fechaCorta(C.portada.hasta)}`)}</p>` : ventas ? `<p class="num">${esc(fechaCorta(ventas.desde))} a ${esc(fechaCorta(ventas.hasta))}</p>` : ''}
    <p class="et">${C.portada ? `${esc(C.portada.etiqueta)}<span class="sep"> · </span>` : ventas ? 'Periodo de ventas<span class="sep"> · </span>' : ''}${esc(C.para ?? '')}<span class="sep"> · </span>Corte del ${esc(fechaLarga(C.fecha))}</p>
  </div>
</section>`;

const cuerpo = [portada];
let n = 2;
for (const s of slides.filter(Boolean)) cuerpo.push(s.html(n++));
cuerpo.push(cierre(n++));
if (C.comoLeer?.length) cuerpo.push(anexo(n++));

// ---------- HTML ----------

const font = (f) => readFileSync(join(root, 'src/assets/fonts', f)).toString('base64');
const css = readFileSync(join(here, 'plantilla.css'), 'utf8');
const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(C.titulo)} · ${esc(C.marca ?? 'Testigos de la Memoria')}</title>
<style>
@font-face { font-family: 'Archivo'; src: url(data:font/woff2;base64,${font('archivo-var.woff2')}) format('woff2'); font-weight: 100 900; }
@font-face { font-family: 'Fraunces'; src: url(data:font/woff2;base64,${font('fraunces-var-italic.woff2')}) format('woff2'); font-weight: 100 900; font-style: italic; }
${css}
</style>
</head>
<body>
<main class="deck">${cuerpo.join('\n')}</main>
<script>
// En pantalla: cada diapositiva se escala al ancho de la ventana; flechas,
// espacio y AvPág/RePág pasan de una a otra.
(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const fit = () => {
    const s = Math.min(innerWidth / 1280, innerHeight / 720);
    document.documentElement.style.setProperty('--escala', s);
  };
  fit();
  addEventListener('resize', fit);
  const actual = () => slides.reduce((m, el, i) => (Math.abs(el.getBoundingClientRect().top) < Math.abs(slides[m].getBoundingClientRect().top) ? i : m), 0);
  addEventListener('keydown', (e) => {
    const sig = ['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key);
    const ant = ['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key);
    if (!sig && !ant) return;
    e.preventDefault();
    const i = Math.max(0, Math.min(slides.length - 1, actual() + (sig ? 1 : -1)));
    slides[i].scrollIntoView({ block: 'center' });
  });
})();
</script>
</body>
</html>
`;

const outHtml = join(dir, 'informe.html');
writeFileSync(outHtml, html);
console.log('listo:', outHtml.replace(root + '/', ''));
if (faltan.length) console.warn(`· faltan lecturas en contenido.mjs: ${faltan.join(', ')}`);

if (!flags.has('--sin-pdf')) {
  const outPdf = join(dir, 'informe.pdf');
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${outPdf}`, pathToFileURL(outHtml).href], { stdio: 'ignore' });
  console.log('listo:', outPdf.replace(root + '/', ''));
}
