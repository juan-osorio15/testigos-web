// Genera las imágenes de vista previa de las fichas de panelistas y de las
// páginas interiores (feature 002). Lee los datos de src/data/speakers.ts
// (slug, nombre, credencial; la foto es src/assets/speakers/<slug>.jpg),
// rellena las plantillas og-panelista.html y og-pagina.html y captura cada
// una con Chrome sin cabeza a 1200 × 630. Los archivos .build.html no se
// versionan.
//
//   node make-og.mjs panelistas          → public/og/panelistas/<slug>-v<n>.jpg
//   node make-og.mjs paginas             → public/og/paginas/<ruta>-v1.jpg
// Chrome captura PNG; el script lo pasa a JPEG (calidad 82) con sips y borra
// el PNG: las fotos con grano pesaban hasta 530 KB en PNG y 160 KB en JPEG.
//   node make-og.mjs panelistas <slug>   → solo ese
//
// Regla de caché: si cambia el diseño, subir la versión (ogVersion en
// speakers.ts, o el número de las páginas aquí). WhatsApp guarda la vista
// previa por URL.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const mode = process.argv[2];
const only = process.argv[3];

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fill(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (!(k in vars)) throw new Error(`marcador sin valor: ${k}`);
    return vars[k];
  });
}

function shoot(html, out) {
  const build = resolve(here, `.og-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.build.html`);
  writeFileSync(build, html);
  mkdirSync(dirname(out), { recursive: true });
  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--allow-file-access-from-files',
    '--hide-scrollbars',
    '--window-size=1200,630',
    '--force-device-scale-factor=1',
    `--screenshot=${out}`,
    `file://${build}`,
  ], { stdio: 'ignore' });
  execFileSync('rm', [build]);
  const jpg = out.replace(/\.png$/, '.jpg');
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', out, '--out', jpg], { stdio: 'ignore' });
  execFileSync('rm', [out]);
  console.log('listo:', jpg.replace(root + '/', ''));
}

/* Panelistas: se leen del TS con expresiones regulares (sin compilar). */
function readSpeakers() {
  const ts = readFileSync(resolve(root, 'src/data/speakers.ts'), 'utf8');
  const blocks = ts.split(/\n  \{\n/).slice(1);
  return blocks
    .map((b) => {
      const slug = b.match(/slug: '([^']+)'/)?.[1];
      const name = b.match(/name: '([^']+)'/)?.[1];
      const credential = b.match(/credential: '([^']+)'/)?.[1];
      const version = Number(b.match(/ogVersion: (\d+)/)?.[1] ?? 1);
      return slug && name && credential ? { slug, name, credential, version } : null;
    })
    .filter(Boolean);
}

const tones = ['olive', 'sky', 'brick'];

if (mode === 'panelistas') {
  const tpl = readFileSync(resolve(here, 'og-panelista.html'), 'utf8');
  readSpeakers().forEach((sp, i) => {
    if (only && sp.slug !== only) return;
    const photo = resolve(root, `src/assets/speakers/${sp.slug}.jpg`);
    if (!existsSync(photo)) throw new Error(`sin foto: ${photo}`);
    const html = fill(tpl, {
      photo: `file://${photo}`,
      name: esc(sp.name),
      credential: esc(sp.credential.replace(/\s·\s/g, ' · ')),
      tone: tones[i % tones.length],
    });
    shoot(html, resolve(root, `public/og/panelistas/${sp.slug}-v${sp.version}.png`));
  });
} else if (mode === 'paginas') {
  const raw = readFileSync(resolve(here, 'og-pagina.html'), 'utf8');
  const logo = readFileSync(resolve(root, 'src/assets/logo/logo-lockup.svg'), 'utf8').trim();
  const tpl = raw.replace(/<svg[^>]*><use href="[^"]*logo-lockup[^"]*"\/><\/svg>/, logo);
  const pages = [
    {
      file: 'programacion-v1',
      eyebrow: 'Programación',
      title: 'Cuatro días en Villa de Leyva',
      pitch: 'Charlas abiertas de entrada libre y siete conversatorios con los periodistas que cubrieron la Colombia reciente.',
      cta: 'Ver la programación',
      tone: 'terracotta',
      inkOn: 'ink',
    },
    {
      file: 'charlas-abiertas-v1',
      eyebrow: 'Charlas abiertas',
      title: 'Entrada libre el 5 y 6 de noviembre',
      pitch: 'Reportería, periodismo digital y el documental sobre Sady González, en la Casa Museo Antonio Nariño. Sin boleta.',
      cta: 'Ver las charlas',
      tone: 'olive',
      inkOn: 'cream',
    },
  ];
  for (const p of pages) {
    const { file, ...vars } = p;
    const html = fill(tpl, Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, k === 'tone' || k === 'inkOn' ? v : esc(v)])));
    shoot(html, resolve(root, `public/og/paginas/${file}.png`));
  }
} else {
  console.error('uso: node make-og.mjs panelistas [slug] | paginas');
  process.exit(1);
}
