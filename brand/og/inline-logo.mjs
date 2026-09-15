// Incrusta el SVG del logo en og.html → og.build.html (Chrome no resuelve
// <use> hacia un SVG externo con file://). El archivo generado no se versiona.
import { readFileSync, writeFileSync } from 'node:fs';
const html = readFileSync('og.html', 'utf8');
const logo = readFileSync('../../src/assets/logo/logo-lockup.svg', 'utf8').trim();
const out = html.replace(/<svg[^>]*><use href="[^"]*logo-lockup[^"]*"\/><\/svg>/, logo);
if (out === html) throw new Error('no se encontró el marcador del logo en og.html');
writeFileSync('og.build.html', out);
