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

/**
 * En la propia portada el enlace es solo "#id": con "/#id", quien llega con
 * parámetros de campaña (?utm_...) recargaba la página entera al pulsar
 * "Comprar boletas", porque la URL cambiaba (detectado en la feature 003).
 */
export function sectionHref(pathname: string, id: string): string {
  const home = langOf(pathname) === 'en' ? `${base}en/` : base;
  const here = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return here === home ? `#${id}` : `${home}#${id}`;
}
