import type { Locale } from './ui';

/** URL base de cada idioma. Español vive en la raíz (R2). */
const basePaths: Record<Locale, string> = {
  es: '/',
  en: '/en/',
};

export function localePath(locale: Locale): string {
  return basePaths[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es';
}

/**
 * URL equivalente en el otro idioma. Las anclas de sección comparten id
 * entre idiomas (contrato data-schemas), así que basta anexar el hash;
 * el hash activo se anexa en cliente como mejora progresiva (Header).
 */
export function alternateUrl(locale: Locale, hash = ''): string {
  return basePaths[otherLocale(locale)] + hash;
}
