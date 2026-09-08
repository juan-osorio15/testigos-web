/**
 * Enlaces a secciones de la portada ("#agenda", "#boletas"). Llevan la base
 * del despliegue delante para que funcionen desde /tratamiento-de-datos/ y
 * /404. TEMPORAL: mientras exista /demo (la portada con la tienda real para
 * pruebas), desde esa ruta las anclas apuntan a la propia /demo y no a la
 * raíz; al borrar /demo, borrar también esa excepción.
 */
const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : import.meta.env.BASE_URL + '/';

const trim = (p: string) => p.replace(/\/+$/, '');

export function sectionHref(pathname: string, id: string): string {
  const onDemo = trim(pathname) === trim(`${base}demo`);
  return `${onDemo ? pathname : base}#${id}`;
}
