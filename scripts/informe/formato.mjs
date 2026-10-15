// Formato de cifras y fechas para el informe (es-CO, con punto de miles
// también en cifras de cuatro dígitos: "1.439", no "1439").
const ENTERO = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0, useGrouping: 'always' });
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MESES_LARGO = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const entero = (n) => ENTERO.format(Math.round(n));
export const pesos = (n) => `$${entero(n)}`;
export const pct = (x) => (x > 0 && x < 0.005 ? '<1\u00a0%' : `${Math.round(x * 100)}\u00a0%`);
/** Texto corrido: el signo de porcentaje no se separa de su cifra. */
export const texto = (s) => esc(s).replace(/ %/g, '\u00a0%');

export function fechaCorta(iso) {
  const [, m, d] = iso.split('-').map(Number);
  return `${d} ${MESES[m - 1]}`;
}

export function fechaLarga(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES_LARGO[m - 1]} de ${y}`;
}

/** "6 al 12 de octubre" o "13 de septiembre al 12 de octubre". */
export function periodo({ desde, hasta }) {
  const [y1, m1, d1] = desde.split('-').map(Number);
  const [y2, m2, d2] = hasta.split('-').map(Number);
  if (desde === hasta) return `${d1} de ${MESES_LARGO[m1 - 1]}`;
  if (y1 === y2 && m1 === m2) return `${d1} al ${d2} de ${MESES_LARGO[m2 - 1]}`;
  return `${d1} de ${MESES_LARGO[m1 - 1]} al ${d2} de ${MESES_LARGO[m2 - 1]}`;
}
