# Testigos de la Memoria

Sitio de venta del encuentro de periodismo e historia en Villa de Leyva (testigosdelamemoria.com) y las herramientas de su operación. Astro, publicado en GitHub Pages desde `main`; la tienda es el widget de Pretix de Eventalist.

## Dónde vive cada verdad

- **Hechos del evento** (fechas, sesiones, panelistas, boletas, precios, etapas, sedes): `src/data/`. Qué cubre cada boleta: `src/data/boletas.ts`.
- **Integraciones** (tienda, backend, medición, contacto, fechas legales): `src/config.ts`.
- **Para los scripts**: `npm run build` exporta todo en `dist/datos/evento.json`. Ningún script ni plantilla repite un precio, una fecha o un identificador.
- **Chatbot**: `docs/chatbot/`, la ficha (hechos) y el prompt (comportamiento); vale la versión más alta de cada uno.
- **Lo publicado fuera del repo** (Pretix, chatbot, Meta, Google Ads): `docs/copias-externas.md`, con qué volver a pegar cuando cambia un hecho.

Para cambiar un hecho: editarlo en `src/data/` o `src/config.ts`, `npm run build`, `npm run check`, `npm run verificar`, y recorrer `docs/copias-externas.md`.

## Comandos

```sh
npm run dev          # sitio en local
npm run build        # sitio y exportación de hechos
npm run check        # tipos
npm run verificar    # textos para pegar y plantillas contra la fuente
npm run campana -- lista expirados
```

Las demás herramientas (informe, imágenes para compartir, boleta y escarapela de Pretix) están en `scripts/README.md`.

## Documentos y estado

- `docs/README.md`: qué hay en cada carpeta de `docs/`.
- `docs/proyecto/punto-de-partida.md`: qué es este repo y su filosofía.
- `specs/`: una carpeta por feature, con su spec, su plan y sus decisiones (Clarifications).
- Estado vivo de la medición: `docs/medicion/embudo/estado.md`. Pendientes del titular de la feature 002: `docs/proyecto/pendientes-002.md`.

Las reglas de trabajo para agentes están en `CLAUDE.md` (local).
