// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://testigosdelamemoria.com',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
