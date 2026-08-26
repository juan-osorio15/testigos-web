# Data Model — Landing Testigos de la Memoria

Phase 1. Los datos viven en módulos TypeScript tipados (`src/data/`, `src/i18n/`); no hay base de datos. Los tipos son el contrato: `astro check` es el validador.

## Tipos base

```ts
/** Todo texto visible al público existe en ambos idiomas. Ambos campos obligatorios. */
type LocalizedString = { es: string; en: string };
type Locale = 'es' | 'en';
```

Regla dura: ningún componente renderiza texto de contenido que no venga de un `LocalizedString` o del diccionario de UI. Así, "contenido sin traducir" es un error de compilación, no un bug en producción (edge case del spec).

## Entidades

### Event (`src/data/event.ts`) — singleton

| Campo | Tipo | Regla |
|---|---|---|
| `name` | `string` | "Testigos de la Memoria" — no se traduce |
| `tagline` | `LocalizedString` | ES fijo: "Periodistas en la Historia" (FR-003) |
| `startDate` / `endDate` | `'2026-11-05'` / `'2026-11-08'` | ISO; el rango completo 5-8 es la fecha de comunicación (FR-001) |
| `dateDisplay` | `LocalizedString` | p. ej. es: "5 al 8 de noviembre de 2026" |
| `city` | `LocalizedString` | Villa de Leyva, Colombia |
| `organizers` | `string[]` | `['Fernando Cordovez', 'Darío Restrepo']` |

### Venue (`src/data/event.ts`)

| Campo | Tipo | Regla |
|---|---|---|
| `id` | `'casa-museo' \| 'duruelo'` | cerrado a las dos sedes |
| `name` | `string` | "Casa Museo Antonio Nariño" / "Hospedería Duruelo" — no se traduce |
| `address` | `string` | dirección completa en texto plano (FR-006) |
| `role` | `LocalizedString` | qué ocurre ahí (talleres gratuitos / conversatorios) |
| `mapsUrl` | `string` | deep link universal de Google Maps (funciona como URL en desktop y abre app en móvil) |

### Speaker (`src/data/speakers.ts`)

| Campo | Tipo | Regla |
|---|---|---|
| `slug` | `string` | kebab-case único |
| `name` | `string` | **solo nombres confirmados** (FR-005). Estado inicial exacto: `Daniel Samper Pizano`, `María Jimena Duzán`, `Darío Restrepo` |
| `credential` | `LocalizedString` | medio/rol con fuente explícita |
| `bio` | `LocalizedString` | 1-2 frases, voz del spec |
| `photo` | `ImageMetadata \| null` | import de `astro:assets`; `null` → placeholder de marca (bloque + símbolo comillas) |
| `confirmed` | `true` | el array solo admite confirmados; los cupos "por confirmar" se representan con `tbdSlots: number` exportado aparte, renderizados como cards "Por confirmar / To be announced" |

### AgendaSlot (`src/data/agenda.ts`)

| Campo | Tipo | Regla |
|---|---|---|
| `day` | `'2026-11-05' \| '2026-11-06' \| '2026-11-07' \| '2026-11-08'` | cerrado a los 4 días |
| `time` | `string \| null` | `null` → "por confirmar"; **nunca horario inventado** — hoy TODOS los slots con speaker van con `null` |
| `type` | `'taller' \| 'conversatorio'` | taller → gratuito, Casa Museo; conversatorio → boleta, Duruelo (asunción del spec; manda la programación cuando llegue) |
| `title` | `LocalizedString \| null` | `null` → franja anunciada sin título |
| `venueId` | `'casa-museo' \| 'duruelo'` | referencia a Venue |
| `speakerSlugs` | `string[]` | referencia a Speaker; puede ser vacío |

Derivadas para render: la agenda agrupa por `day`; el tipo controla la etiqueta "Entrada libre"/"Free entry" vs. "Con boleta"/"Ticketed" y el acento sólido de fila destacada.

### FAQ (`src/data/faqs.ts`)

| Campo | Tipo | Regla |
|---|---|---|
| `question` / `answer` | `LocalizedString` | contenido mínimo obligatorio (FR-007): gratis-vs-boleta, cómo llegar, dudas de compra/reembolso → Pretix |

### UI Dictionary (`src/i18n/ui.ts`)

Mapa plano `key → LocalizedString` para todo microcopy (nav, botón CTA único, etiquetas de agenda, aria-labels, texto del fallback de Pretix, 404). El texto del CTA es **una sola key** (`cta.buy`) usada por header y los tres CTAs de contenido (FR-010: mismo texto garantizado por construcción).

### Config (`src/config.ts`)

| Campo | Tipo | Regla |
|---|---|---|
| `SITE_URL` | `'https://testigosdelamemoria.com'` | base de canonicals/OG/sitemap |
| `PRETIX_EVENT_URL` | `string` | placeholder `TODO-PRETIX-URL` hasta que el usuario la entregue |
| `pretixReady` | `boolean` | `false` → la sección de compra muestra "venta próximamente" sin widget ni enlace roto (R5) |

## Activos heredados (estáticos, sin tipo)

`public/CNAME`, `public/1b880322af30410c8832c1e6748dc455.txt`, `public/robots.txt`, `public/sitemap.xml` (2 URLs + hreflang), `public/og/og-image.png` — copiados de `main` según FR-021. El JSON-LD `Event` se genera en `EventLayout.astro` desde la entidad Event (una sola fuente de verdad para fechas/sedes).

## Reglas de estado / transición

- **Alta de speaker**: solo con confirmación explícita del usuario o archivo de programación → se agrega al array con nombre exacto. No existe estado "draft" publicable.
- **Horarios**: pasar `time: null → 'HH:MM'` solo cuando la programación lo confirme.
- **Venta**: `pretixReady: false → true` junto con la `PRETIX_EVENT_URL` real; es el único switch para que el widget aparezca.
- **Idiomas**: agregar contenido = agregar `es` y `en` a la vez; el tipo no permite lo contrario.
