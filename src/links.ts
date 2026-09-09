/**
 * Enlaces a secciones de la portada ("#agenda", "#boletas"). Llevan la base
 * del despliegue delante para que funcionen desde /tratamiento-de-datos/ y
 * /404.
 */
const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : import.meta.env.BASE_URL + '/';

export function sectionHref(_pathname: string, id: string): string {
  return `${base}#${id}`;
}
