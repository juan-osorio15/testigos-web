# Contrato: esquemas de datos y componentes

Interfaz entre contenido (`src/data/`, `src/i18n/`) y componentes. Los tipos exactos viven en [data-model.md](../data-model.md); aquí, qué consume cada componente y qué garantiza.

## Página → secciones (orden fijo, FR-004)

`index.astro` y `en/index.astro` renderizan el MISMO árbol con `locale` distinto:

```
EventLayout(locale)
├── Header(locale)            ← ui.ts, event, routes.ts
├── Hero(locale)              ← event
├── TicketSection(locale)     ← ui.ts, config (PRETIX_EVENT_URL, pretixReady)
├── Opportunity(locale)       ← copy propio + speakers (nombres para el argumento)
├── SpeakerGrid(locale)       ← speakers, tbdSlots
├── Schedule(locale)          ← agenda, venues, speakers (lookup por slug)
├── VenueMap(locale)          ← venues
└── FAQ(locale)               ← faqs
```

Garantía de paridad ES/EN (SC-009): ambas páginas comparten componentes y datos; solo cambia `locale`. No existe contenido por-página.

## Props de componentes

- Todos los componentes de sección aceptan `{ locale: Locale }` y nada más de contenido — leen los módulos de datos directamente (una fuente de verdad, sin prop-drilling).
- `CtaButton` acepta `{ locale, variant?: 'header' | 'inline' }`; SIEMPRE renderiza `ui['cta.buy'][locale]` y `href="#boletas"` (id fijo de TicketSection). Prohibido pasarle texto.
- `SpeakerCard` acepta `{ speaker, locale }` o `{ tbd: true, locale }` (card "por confirmar").

## Anclas estables (contrato de navegación)

| id | Sección | Usado por |
|---|---|---|
| `#boletas` | TicketSection | todos los CTAs (FR-010), en ambos idiomas (el id no se traduce) |
| `#oportunidad`, `#speakers`, `#agenda`, `#lugar`, `#faq` | secciones | nav del header; el selector de idioma preserva el ancla activa |

## Invariantes verificables

1. `grep` de nombres de speaker en `src/` solo encuentra los del array confirmado o "por confirmar" (SC-003/SC-010).
2. Ninguna cifra de precio ni nombre de tipo de boleta aparece en `src/` (FR-008) — la palabra "boleta" solo en copy genérico.
3. Un solo `IntersectionObserver` para reveals y uno para el header, ambos en `EventLayout`; los componentes solo marcan `data-reveal`.
4. `ui['cta.buy']` es la única fuente del texto de compra.
