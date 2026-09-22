/**
 * Enlaces a secciones de la portada ("#agenda", "#boletas"). Llevan la base
 * del despliegue delante para que funcionen desde /tratamiento-de-datos/ y
 * /404. Desde la portada en inglés (/en/) apuntan a sus propias secciones,
 * no a las de la portada en español.
 */
import { langOf } from './i18n';

const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : import.meta.env.BASE_URL + '/';

export function sectionHref(pathname: string, id: string): string {
  const home = langOf(pathname) === 'en' ? `${base}en/` : base;
  return `${home}#${id}`;
}
