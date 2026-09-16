# Data Model · Medición, marcado y visibilidad

Phase 1. Entidades de la spec traducidas a los módulos de `src/data/` y a los tipos nuevos de `src/seo/` y `src/measurement/`. Sin implementación: solo formas, reglas de validación y transiciones.

## 1. Ofertas de boleta (`src/data/event.ts`)

Sustituye a `ticketOffer` (una sola) por `ticketOffers` (cinco). La tienda sigue siendo dueña de la venta; estos datos alimentan el JSON-LD y el texto plano de precios.

```ts
export type TicketOfferId = 'pase-completo' | 'viernes-tarde' | 'sabado-manana' | 'sabado-tarde' | 'domingo-manana';

export interface TicketOffer {
  id: TicketOfferId;
  /** Nombre visible y del marcado ("Pase completo", "Viernes en la tarde") */
  name: string;
  /** Nombre literal del producto en Pretix (docs/pretix-tienda-textos.md, sección Productos); es la clave con la que TicketSection y begin_checkout reconocen el producto en el widget */
  pretixProduct: string;
  price: number;           // COP, entero
  currency: 'COP';
  /** Primer día de venta (inclusive, calendario de Bogotá) */
  validFrom: string;       // ISO date
  /** Último día de venta (inclusive) o null si vende hasta el evento */
  validThrough: string | null;
  /** Interruptor manual: agotado en Pretix (FR-014) */
  soldOut: boolean;
  /** Franjas de la agenda que cubre (para subeventos y texto); el pase cubre todas */
  covers: 'all' | EventDay[];
}
```

Reglas:
- Pase completo: `pretixProduct: 'Pase completo'`, `validFrom: '2026-09-09'`, `validThrough: salesStages.stage1End` (2026-10-04), precio 310000.
- Cuatro franjas: `pretixProduct` = `'Viernes tarde'`, `'Sábado mañana'`, `'Sábado tarde'`, `'Domingo mañana'` (confirmados por el usuario el 2026-09-16; coinciden con lo que TicketSection ya normaliza), `validFrom: salesStages.stage2Start` (2026-10-05), `validThrough: null`, precio 90000.
- `soldOut` solo lo cambia una persona con la información de Pretix; nunca se infiere.

### Disponibilidad derivada (`src/seo/offers.ts`)

```ts
type Availability = 'InStock' | 'SoldOut' | 'PreOrder';
function availabilityOf(offer: TicketOffer, today: string): Availability | null
```

| Condición (evaluada en el build, fecha de Bogotá) | Resultado |
|---|---|
| `soldOut` | `SoldOut` |
| `today < validFrom` | `PreOrder` |
| `validThrough !== null && today > validThrough` | `null` → la oferta se omite del marcado (Google: retirar, no dejar InStock) |
| en ventana | `InStock` |

Transición operativa: el 5 de octubre el build cambia las franjas a `InStock` y omite el pase; exige una publicación ese día (quickstart §6).

## 2. Sedes con coordenadas (`src/data/event.ts`)

`Venue` gana:

```ts
geo: { latitude: number; longitude: number };  // decimal, 5 decimales, verificadas
```

Reglas: coordenadas tomadas del pin de Google Maps de cada sede y confirmadas con el organizador antes del deploy (edge case de la spec). Se usan en `Place.geo` y en el texto de `/como-llegar/`. Las dos sedes reciben `@id` estable: `${SITE_URL}/#sede-duruelo`, `${SITE_URL}/#sede-casa-museo`.

## 3. Sesiones (`src/data/agenda.ts`)

`AgendaSlot` gana:

```ts
/** Identificador estable para anclas (#slug) y @id de subevento */
slug: string;
/** Hora de inicio y fin en 24 h, zona de Bogotá; null = sin hora confirmada → sin subevento */
start: string | null;    // 'HH:MM'
end: string | null;      // 'HH:MM'
```

Reglas:
- `time` (texto visible) se conserva; `start`/`end` deben ser coherentes con él. Una función de comprobación en el build (`assertAgenda()`) falla si un slot tiene `time` sin `start`, o `start` sin `end`, o `slug` repetido.
- Subevento solo si `start`, `end` y `venueId` no son null (FR-012). "Cierre" (12:30 a 13:00) sí tiene datos; la "Charla de periodismo digital" tiene hora de inicio pero no de fin: se le fija `end` solo si el organizador lo confirma; mientras tanto se declara con `endDate` omitido (Google no lo exige en subeventos anidados; el evento principal sí lleva `endDate`).
- `speakerSlugs` → `performer` con `url` a la ficha; `guests` → `performer` `Person` con solo `name`.
- `type: 'charla'` → `isAccessibleForFree: true`.

## 4. Panelista (`src/data/speakers.ts`)

Forma actual suficiente para la ficha. Campos nuevos opcionales para ampliación posterior sin bloquear la publicación:

```ts
/** Obras y piezas destacadas: título, año opcional, URL opcional (solo verificadas) */
works?: { title: string; year?: number; url?: string }[];
/** Texto de la imagen de vista previa si difiere del nombre */
ogVersion?: number;   // por defecto 1; subir al regenerar la imagen
```

Derivados por ficha (no se guardan): `url = ${SITE_URL}/panelistas/${slug}/`, `sessions = agenda.filter(s => s.speakerSlugs.includes(slug))`, `ogImage = /og/panelistas/${slug}-v${ogVersion}.png`, título de página `${name} · Testigos de la Memoria 2026` (aserción ≤ 60 caracteres; si un nombre lo excede, se usa `${name} · Testigos de la Memoria`).

Retiro de un panelista (FR-028): se elimina del array; la ruta desaparece del build y de `routes.ts`; se añade una redirección a `/` en `astro.config.mjs` (`redirects`) hasta después del evento.

## 5. Rutas indexables (`src/routes.ts`)

```ts
export interface Route {
  path: string;          // '/panelistas/daniel-samper-pizano/'
  title: string;         // ≤ 60
  description: string;   // ≤ 155
  /** Etiqueta para migas de pan */
  crumb: string;
  parent?: string;       // path del padre ('/' o '/panelistas/')
  ogImage: string;       // URL absoluta
  /** Fecha de última modificación de contenido (ISO) para el sitemap */
  lastmod: string;
  /** Prioridad de indexación (Search Console y IndexNow); informativa */
  priority: 'alta' | 'media';
}
export const routes: Route[];   // portada, panelistas índice + 12, programación, charlas abiertas, cómo llegar, [dónde dormir]
```

Reglas: las páginas legales y la 404 no están aquí. `sitemap.xml.ts`, `Breadcrumbs.astro` y el paso de IndexNow leen solo esta lista. Una aserción en el build falla si un `.astro` público indexable no está en `routes` (comparación con `import.meta.glob('./pages/**/*.astro')` menos las excluidas).

## 6. Página indexable (metadatos por página, `src/seo/meta.ts`)

| Campo | Regla |
|---|---|
| `title` | ≤ 60 caracteres, con marca; aserción en build |
| `description` | ≤ 155 caracteres; aserción en build |
| `canonical` | `SITE_URL + path` |
| `robots` | `index, follow, max-image-preview:large, max-snippet:-1`; legales `noindex, follow` |
| `og:image` | 1200×630 PNG versionado; por ficha, la del panelista; por página, la de la página o la de la portada |
| Hechos en texto plano | nombre, "Villa de Leyva, Boyacá, Colombia", "5 al 8 de noviembre de 2026", sedes, estado de boletería y precios (FR-034): los aporta `InnerLayout` en un bloque fijo al pie de cada página interior |

## 7. Evento de medición (`src/measurement/`)

```ts
type BrowserEvent =
  | { name: 'page_view' }
  | { name: 'begin_checkout'; eventId: string; currency: 'COP'; value?: number }
  | { name: 'consent_granted'; version: string };

interface Attribution {
  utm: Partial<Record<'source' | 'medium' | 'campaign' | 'content' | 'term', string>>;
  fbclid?: string; gclid?: string;
  fbp?: string; fbc?: string;
  gaClientId?: string; gaSessionId?: string;
  landing: string;          // path de aterrizaje
  firstSeen: string;        // ISO
}

interface ConsentState {
  id: string;               // identificador aleatorio de la aceptación (UUID), creado al aceptar
  version: string;          // measurement.consentVersion
  scope: ['analytics', 'advertising'];
  acceptedAt: string | null;   // ISO; null = no aceptado o revocado
  revokedAt?: string;       // ISO, si se retiró desde "Cookies y preferencias"
  recorded: boolean;        // true cuando el backend confirmó el registro
}
```

Reglas: `Attribution` se guarda en `localStorage` (clave `tdm.attribution`, 90 días por `firstSeen`) y se sobrescribe solo si llega un nuevo `fbclid`, `gclid` o `utm_*`. `ConsentState` en `localStorage` (`tdm.consent`); un cambio de `consentVersion` vuelve a mostrar el aviso; cerrar el aviso no cambia el estado. Al aceptar se envía `{ id, version, scope, acceptedAt }` al endpoint de consentimiento del backend (sin IP ni nombre); si falla, se reintenta en la siguiente carga hasta `recorded`. Revocar guarda `revokedAt`, pone `acceptedAt` en null, vuelve `analytics_storage` y `ad_*` a `denied`, borra las cookies `_ga*`, `_fbp` y `_fbc` del dominio y notifica al backend con el mismo `id`. `eventId` de `begin_checkout` = `${gaClientId ?? random}.${Date.now()}` y se envía a GA4 y a Meta con el mismo valor (dedup futura). Mapeo: `begin_checkout` ↔ Meta `InitiateCheckout`.

## 8. Pedido atribuido (fuera del repo: Pretix `api_meta` y backend)

```json
{
  "tracking": {
    "ga_client_id": "…", "ga_session_id": "…",
    "fbp": "fb.1.…", "fbc": "fb.1.…",
    "gclid": "…", "utm_source": "…", "utm_medium": "…", "utm_campaign": "…",
    "landing": "/", "event_id_checkout": "…",
    "client_ip": "…", "client_user_agent": "…",
    "captured_at": "2026-09-20T15:04:05-05:00"
  }
}
```

Reglas: el plugin escribe `api_meta.tracking` una sola vez al confirmar el pedido; el backend registra por `code` los envíos hechos (`capi_sent_at`, `mp_sent_at`) para idempotencia frente a reintentos del webhook, y solo procesa pedidos cuya fecha sea posterior a la entrada en vigor de la casilla nueva de Pretix (`ATTRIBUTION_CONSENT_SINCE`). Detalle en `contracts/pretix-attribution.md`.

## 8b. Registro de consentimiento (fuera del repo: backend)

```json
{"id":"<uuid>","version":"2026-09","scope":["analytics","advertising"],"accepted_at":"…","revoked_at":null,"site":"testigosdelamemoria.com"}
```

Sin IP ni datos de identidad. Sirve como prueba de autorización (art. 8 del Decreto 1377) y para entregar copia al titular que la pida.

## 9. Relaciones

- Evento principal 1 → n sesiones (subeventos) → n panelistas (performer); 1 → 5 ofertas; 1 → 1 sede principal; sesiones → 1 sede cada una.
- Charlas abiertas: evento propio (URL `/charlas-abiertas/`) con `superEvent` al principal, que agrupa las sesiones `type: 'charla'`.
- Ficha de panelista → sesiones donde participa → programación (ancla) y compra.
- Ruta → migas (padre) → `BreadcrumbList`.
- Visita (Attribution) → pedido (api_meta.tracking) → eventos de servidor (CAPI, MP) → informes (Meta Ads, GA4, Google Ads).
