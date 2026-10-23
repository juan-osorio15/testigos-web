# Punto de partida: qué es este repo y con qué filosofía se construyó

Para cualquier agente que investigue `testigos-web`, sea para ordenarlo o para convertir lo aprendido en una metodología que se repita en otros eventos. Escrito el 19 de octubre de 2026 por encargo del titular. No reemplaza la investigación del 13 de octubre (`/Users/juandev/Documents/eventalist/investigacion-testigos-web.md`); la completa con lo que esa no recoge y con lo que pasó después.

## 1. El repo es el cerebro de la operación, no solo un sitio

`testigos-web` empezó como la página del evento y terminó siendo el lugar con más contexto sobre Testigos de la Memoria. Por eso de aquí salen casi todas las piezas de mercadeo y operación, aunque se publiquen en otros sistemas:

- el sitio (Astro, GitHub Pages) con SEO y medición;
- la base de conocimiento y el prompt del chatbot de atención (se copian a mano a la plataforma del chatbot);
- los textos de la tienda de Pretix (se pegan a mano en Pretix);
- las boletas, las escarapelas y las imágenes para redes (`brand/`);
- las campañas de correo y WhatsApp (`scripts/campanas/`), sus plantillas y la convención de UTM;
- el plan de Google Ads, las plantillas de WhatsApp para Meta y los informes al cliente (`scripts/informe/`);
- los prompts que coordinan cambios en otros repos (backend de Eventalist, plugin de Pretix).

Una metodología para otros eventos tiene que partir de este hecho: el repo del sitio funciona como la fuente de verdad del evento y como el taller del mercadeo. Hoy lo es por acumulación, no por diseño.

## 2. Filosofía del sitio

### 2.1 Primero lo que atrae, después lo que convence

Principio del titular (formulado así el 2026-10-19; el sitio ya lo aplica):

- **El usuario moderno decide en segundos.** Lo más atractivo va primero: las caras de los panelistas en el hero, tres cifras clave y el nombre del evento con la marca.
- **El comprador rápido compra sin buscar.** La tienda está embebida en la portada, en la cuarta sección, después de los panelistas. Hay un botón de WhatsApp junto a la tienda para quien tiene una duda antes de pagar.
- **El minucioso encuentra todo desplegado.** Más abajo y en páginas propias: la agenda, una página por panelista y por charla, cómo llegar, hoteles, preguntas frecuentes, términos y política.

Orden real de la portada (`src/pages/index.astro`): Hero, KeyFacts, SpeakerGrid, TicketSection, Schedule, VenueMap, Opportunity, Interlude, FAQ.

### 2.2 La compra sin fricción manda

SEO, analítica y textos legales entran solo si no entorpecen la compra. Lo que agregue casillas, textos largos o avisos en el camino a pagar se descarta; la información completa va en la política (memoria `compra-sin-friccion`).

### 2.3 Marca aplicada, no decorativa

`brand/formula-visual.md` traduce el manual de marca a reglas que se pueden aplicar a cualquier pieza (bloques de color plano que se tocan, la tinta escribe, una sola firma). Tono sobrio, sin desesperación ni urgencia agresiva, y sin guiones largos de pausa.

### 2.4 SEO y medición en una iteración temprana, no al final

- **Cuándo:** apenas el primer borrador del sitio está aprobado por el cliente y estable, no durante los ensayos de diseño, donde es prematuro. Desde ahí el sitio se publica medido y con su SEO básico.
- **Por qué temprano:** el SEO tarda semanas en rendir (en Testigos el primer lugar en la búsqueda de marca llegó a los 6 días, pero la autoridad fuera del dominio es lenta y depende de relaciones). Sin medición desde el principio, las primeras visitas, interesados y ventas quedan sin campaña y no se aprende qué funciona.
- **Qué pasó en Testigos:** GA4 y el píxel entraron el 17 de septiembre, con la tienda ya vendiendo; el embudo de venta por campaña se diseñó en octubre. Fue tarde.
- Referencias: `docs/medicion/embudo/estandar-medicion.md`, `docs/medicion/embudo/enlaces-y-nombres.md` y la memoria `datos-desde-el-principio`.

### 2.5 Ambientes desde el día uno

Cada pieza que toca dinero o datos personales tiene su sandbox (evento de prueba en Pretix, llaves de prueba de la pasarela, campaña de ensayo en el backend). La prueba que cuenta es una compra real en el sandbox con capturas (memorias `evento-sandbox-por-evento` y `pruebas-utiles`).

### 2.6 Mercadeo insistente, tono sobrio

Desde el 2026-10-19: se escribe por todos los canales, sin límite de mensajes por persona (memoria `marketing-multicanal`). La insistencia está en la frecuencia y la presencia, no en el tono.

## 3. Lo que pasó después del 13 de octubre

La investigación del 13 de octubre no recoge esto:

- **Campañas con una sola arquitectura (19 oct).** `scripts/campanas/campana.py`: fuentes (Pretix, backend), audiencias, un formato único de lista, canales (Resend, Meta), reglas comunes y un registro único de envíos fuera del repo. Cada campaña es un JSON. Guía: `docs/campanas/README.md`. Se mandaron las dos primeras con ella (interesados y expirados).
- **Backend con lectura de contactos (19 oct).** Endpoint de solo lectura de los contactos de una campaña, con la autorización por canal. El sitio ya no solo escribe en el backend: también lee de él para las campañas.
- **Cambio de número de WhatsApp (19 oct).** En el sitio fue una línea (`WHATSAPP_URL` en `src/config.ts`). Afuera (Pretix, perfiles, chatbot, Meta) no hay un inventario de dónde está publicado.
- **Campañas de Google Ads y plantillas de WhatsApp** (`docs/campanas/google-ads/`, `docs/campanas/whatsapp-ventas/`), sin spec.

## 4. Dónde vive hoy cada tipo de verdad

- **Datos del evento:** `src/data/` (`event.ts` con ofertas y etapas, `speakers.ts`, `agenda.ts`, `faqs.ts`, `partners.ts`, `stays.ts`).
- **Integraciones e identificadores:** `src/config.ts`.
- **Rutas indexables:** `src/routes.ts`.
- **Textos del sitio:** `src/ui.ts` (microcopy en español e inglés, mezclado con datos del evento).
- **Marca:** `brand/formula-visual.md`.
- **Convención de UTM:** `docs/medicion/embudo/enlaces-y-nombres.md`.
- **Campañas:** `docs/campanas/README.md` y `scripts/campanas/config/`.
- **Decisiones y reglas del titular:** la memoria de Claude, fuera del repo (`~/.claude/projects/-Users-juandev-Documents-eventalist-testigos-testigos-web/memory/`), más las specs (`specs/001` a `003`) y los mensajes de commit.
- **Metodología en construcción:** `/Users/juandev/Documents/eventalist/prompt-skill-init-new-event.md` y la investigación del 13 de octubre.
