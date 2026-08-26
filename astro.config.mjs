// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://testigosdelamemoria.com',
  trailingSlash: 'ignore',
  /* DEMO_BASE=/demo npm run build → build publicable bajo /demo/
     (demo temporal mientras el placeholder sigue en la raíz). */
  base: process.env.DEMO_BASE || '/',
  build: {
    /* CSS siempre como archivo: las url(../fonts/) de @font-face
       resuelven bien tanto en la raíz como bajo /demo/. */
    inlineStylesheets: 'never',
  },
});
