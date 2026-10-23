// Hechos del evento para los scripts en Node, desde la exportación del build
// (la misma que lee scripts/lib/hechos.py). La fuente es src/data/ y
// src/config.ts; `npm run build` la exporta en dist/datos/evento.json. Si la
// exportación falta o es más vieja que la fuente, se detiene y pide el build.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = resolve(fileURLToPath(import.meta.url), '../../..');
const EXPORTACION = join(RAIZ, 'dist/datos/evento.json');
const FUENTE = [
  join(RAIZ, 'src/config.ts'),
  ...readdirSync(join(RAIZ, 'src/data')).filter((f) => f.endsWith('.ts')).map((f) => join(RAIZ, 'src/data', f)),
];

/** Chrome para capturar HTML a PNG o PDF; otra ruta con la variable CHROME */
export const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

let cache = null;
export function hechos() {
  if (cache) return cache;
  const rel = (p) => relative(RAIZ, p);
  if (!existsSync(EXPORTACION)) {
    console.error(`Falta ${rel(EXPORTACION)}: correr \`npm run build\` en la raíz del repo.`);
    process.exit(1);
  }
  const exportado = statSync(EXPORTACION).mtimeMs;
  const cambiados = FUENTE.filter((p) => statSync(p).mtimeMs > exportado).map(rel);
  if (cambiados.length) {
    console.error(`${rel(EXPORTACION)} es más viejo que ${cambiados.join(', ')}: correr \`npm run build\` para no usar datos viejos.`);
    process.exit(1);
  }
  cache = JSON.parse(readFileSync(EXPORTACION, 'utf8'));
  return cache;
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** '2026-11-06', '2026-11-08' → '6 al 8 de noviembre de 2026' */
export function rangoDeFechas(desde, hasta) {
  const [a, b] = [desde, hasta].map((d) => d.split('-').map(Number));
  const inicio = a[1] === b[1] ? `${a[2]}` : `${a[2]} de ${MESES[a[1] - 1]}`;
  return `${inicio} al ${b[2]} de ${MESES[b[1] - 1]} de ${b[0]}`;
}

/** Sede y días de los conversatorios (lo que va impreso en la boleta y la escarapela) */
export function conversatorios() {
  const h = hechos();
  const sesiones = h.sesiones.filter((s) => s.tipo === 'conversatorio');
  const dias = sesiones.map((s) => s.dia).sort();
  const sede = h.sedes.find((v) => v.id === sesiones[0].sede);
  return { sede, fechas: rangoDeFechas(dias[0], dias.at(-1)) };
}
