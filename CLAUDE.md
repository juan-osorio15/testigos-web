# Testigos de la Memoria · sitio y operación

Sitio de venta del encuentro (Astro, GitHub Pages desde `main`, testigosdelamemoria.com) y las herramientas de su operación: campañas, informes, imágenes. Contexto y filosofía en `docs/proyecto/punto-de-partida.md`; índice de documentos en `docs/README.md`.

El sitio está en producción y vende. Ningún cambio puede romper la tienda, el SEO (rutas, JSON-LD, metadatos), la medición ni las campañas.

## Dónde vive cada verdad

- **Hechos del evento** (fechas, sesiones, panelistas, boletas, precios, etapas, sedes, aforo): `src/data/`. Qué sesiones cubre cada boleta: `src/data/boletas.ts`.
- **Integraciones e identificadores** (tienda, backend, medición, contacto, fechas legales): `src/config.ts`.
- **Para lo que no lee TypeScript**: `npm run build` exporta todo en `dist/datos/evento.json`. Los scripts lo leen con `scripts/lib/hechos.py` y se detienen si es más viejo que la fuente. Nunca copiar un precio, un slug o una URL en un script o una plantilla.
- **Chatbot**: `docs/chatbot/`, dos archivos que se versionan por separado: la ficha (`ficha_*_vN.md`, los hechos) y el prompt (`prompt_vN.md`, el comportamiento). Vale la versión más alta. `docs/chatbot/legacy/` no se usa.
- **Textos de Pretix**: `docs/pretix/pretix-tienda-textos.md`. Pretix no se centraliza: todo pedido de textos para Pretix obliga a cotejarlos con `src/data/` antes de redactar.
- **Lo publicado fuera del repo**: `docs/copias-externas.md`. Al cambiar un hecho, recorrerla.

## Antes de entregar

- Cambio en el sitio: `npm run build` y `npm run check`, sin errores.
- Texto para pegar en otro sistema o plantilla de correo: `npm run verificar`. Si un error nuevo se cuela, agregar su patrón y su caso en `scripts/verificar/verificar.py`.
- Campañas: `python3 scripts/campanas/campana.py lista <campaña>` y la vista previa sin `--enviar`. Nunca `--enviar` sin que el titular lo pida para ese envío. Comandos en `docs/campanas/README.md`.

## Reglas del titular

- Commits locales sí. **Ningún push ni deploy sin su visto bueno de ese cambio.**
- No abrir ni citar archivos de credenciales: `docs/proyecto/credenciales.md`, `creds.txt`, el llavero, `*.local.csv`, `~/Documents/eventalist/datos/`.
- No inventar datos. Si dos fuentes se contradicen, preguntar cuál es la verdad.
- Nombres públicos: "boletas de medio día" (franja es interno) y "charlas abiertas" (no talleres). Panelistas con la grafía de `src/data/speakers.ts`.
- Textos visibles sin guiones largos de pausa (" — ") y sin tablas en Markdown. Todo enlace con `https://` explícito.
- Correos y mensajes sin dirección ni datos personales del titular: solo Eventalist S.A.S. y hola@eventalist.co.
- `DATA_POLICY_EFFECTIVE` (`src/config.ts`) no se mueve.
- El canal de contacto del sitio es WhatsApp (`CONTACT_CHANNEL`); los botones ya funcionan.
- Liviano: poco y sólido antes que mucho y frágil.
