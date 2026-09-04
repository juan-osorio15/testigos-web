// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://testigosdelamemoria.com',
  trailingSlash: 'ignore',
  base: '/',
  build: {
    /* CSS siempre como archivo: las url(../fonts/) de @font-face
       resuelven bien desde cualquier ruta. */
    inlineStylesheets: 'never',
  },
});
