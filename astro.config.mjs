// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://testigosdelamemoria.com',
  trailingSlash: 'ignore',
  base: '/',
  /* Retiro de un panelista (feature 002, FR-028): se quita del array de
     src/data/speakers.ts (su ficha desaparece del build y del sitemap) y
     se añade aquí su ruta hacia la portada hasta después del evento:
       '/panelistas/nombre-apellido/': '/',
     Rutas cambiadas de nombre: también aquí, hacia la nueva. */
  redirects: {},
  build: {
    /* CSS siempre como archivo: las url(../fonts/) de @font-face
       resuelven bien desde cualquier ruta. */
    inlineStylesheets: 'never',
  },
});
