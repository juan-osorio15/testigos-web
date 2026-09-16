# Contrato: medición en el navegador y consentimiento

Cubre FR-001, FR-002, FR-006, FR-007, FR-008, FR-010 y R-02, R-03, R-04. El lado servidor está en `pretix-attribution.md`.

## Configuración (`src/config.ts`)

```ts
export const measurement = {
  ga4Id: '',                 // 'G-XXXXXXXXXX'; vacío → no se carga gtag
  metaPixelId: '',           // '1234567890'; vacío → no se carga fbevents
  /** Versión del aviso; cambiarla vuelve a mostrarlo */
  consentVersion: '2026-09',
  /** Registro de aceptaciones en el backend de Eventalist; vacío → variante B (solo navegador) */
  consentEndpoint: `${EVENTALIST_BACKEND}/api/v1/marketing/consent/`,
  /** Verificación de dominio de Meta por etiqueta; vacío si se verifica por DNS */
  metaDomainVerification: '',
} as const;
```

Reglas: con `ga4Id` y `metaPixelId` vacíos el HTML publicado no contiene ninguna referencia a googletagmanager.com ni connect.facebook.net (permite desplegar el resto de la feature antes de tener cuentas). El píxel de Meta nunca carga antes de la aceptación (dictamen legal del 2026-09-15); no existe interruptor para lo contrario.

## Orden en `<head>` (EventLayout)

1. `<meta charset>`, viewport, title, description, robots, canonical.
2. `<link rel="preload" as="image" …>` de la imagen principal (solo portada).
3. `<link rel="preconnect">` a `www.googletagmanager.com` (si `ga4Id`) y a `pretix.eventalist.co` (ya existe).
4. Preload de fuentes (ya existe).
5. Open Graph, Twitter, JSON-LD.
6. `<script is:inline>` con `dataLayer`, `gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })` y, si `localStorage['tdm.consent'].acceptedAt` existe con la versión vigente, `gtag('consent', 'update', { …: 'granted' })` en el mismo bloque (antes de que cargue gtag.js). Después `<script is:inline async src="https://www.googletagmanager.com/gtag/js?id=G-…">` y `gtag('js')`, `gtag('config', G-…, { send_page_view: true })`.
7. Widget de Pretix (ya existe).

El píxel de Meta **no** va en `<head>`: lo inyecta `measurement/tags.ts` desde el `<script>` del layout.

## Consent Mode y carga del píxel (`src/measurement/tags.ts`)

```
GA4: siempre cargado; sin aceptación envía pings sin cookie (denied). Al aceptar:
    gtag('consent', 'update', { analytics_storage, ad_storage, ad_user_data, ad_personalization: 'granted' })
Meta:
    si metaPixelId vacío → nada
    si consent.acceptedAt (versión vigente) → tras window.load, requestIdleCallback(loadPixel, {timeout: 3000}) (fallback setTimeout 3000)
    si no → esperar evento 'tdm:consent' → loadPixel()
    loadPixel(): inyecta el snippet oficial fbevents.js; fbq('init', id); fbq('track', 'PageView')
Revocación ('tdm:revoke'): gtag consent update → denied; borrar cookies _ga, _ga_*, _fbp, _fbc (path=/, domain=.testigosdelamemoria.com); el píxel ya cargado no se descarga hasta la siguiente carga (queda documentado).
```

En la propiedad GA4: Google Signals apagado, personalización de anuncios apagada, sin User-ID (obligación operativa 8 del dictamen). Advanced Matching automático de Meta se activa en Events Manager (sin código). No se pasan datos personales al píxel desde el sitio.

## Eventos

| Momento | GA4 (`gtag('event')`) | Meta (`fbq('track')`) | Parámetros comunes |
|---|---|---|---|
| Carga de página | `page_view` (automático) | `PageView` | — |
| Aceptación del aviso | `consent_granted` `{ version }` | — | — |
| Intención de compra | `begin_checkout` `{ currency: 'COP', value, items? }` | `InitiateCheckout` `{ currency: 'COP', value }` + `{ eventID }` | `eventId` idéntico en ambos |

Disparadores de intención de compra (una vez por página, el primero que ocurra):
- `click` en cualquier CTA que lleve a `#boletas` desde header, hero, panelistas, agenda o cierre.
- `submit` del formulario del widget de Pretix (botón "Comprar" de la lista de productos) capturado por delegación en `.tickets-widget` (el widget pinta en el DOM del host, sin shadow DOM; verificado en TicketSection).
- `value`: si el submit lleva cantidades legibles del widget, suma de precios de `ticketOffers` por producto; si no, se omite `value` (nunca se inventa).

## Aviso de consentimiento (`ConsentNotice.astro`)

- Barra fija inferior, bloque de tinta sobre crema (fórmula visual), visible en toda la página hasta que se acepta o se cierra (no se pierde al hacer scroll), sin superponerse al CTA del hero en móvil. Elementos: texto, enlace "Más información" a `/tratamiento-de-datos/#cookies`, botón "Aceptar" y botón de cerrar (×). Sin "Rechazar".
- Texto (dictamen, `ui.ts` `consent.text`): "Eventalist S.A.S. usa en este sitio cookies de analítica y de publicidad de Google y de Meta para medir las visitas y atribuir las compras de boletas. Al pulsar Aceptar se autoriza ese uso conforme a la política de tratamiento de datos, que explica cómo revocarlo."
- Solo "Aceptar" acepta: cerrar, ignorar, hacer scroll, navegar o pulsar "Más información" no cambian el estado. Cerrar oculta la barra durante la sesión (`sessionStorage`) y vuelve a mostrarla en la siguiente visita.
- Al aceptar: crea `id` (UUID), guarda `ConsentState` en `localStorage['tdm.consent']`, actualiza Consent Mode a `granted`, envía `consent_granted` a GA4, dispara `tdm:consent`, registra en `consentEndpoint` (`POST { id, version, scope, accepted_at, site }`, reintento en la siguiente carga si falla) y oculta la barra.
- No se muestra si `acceptedAt` existe con la misma `consentVersion`. Si `localStorage` no está disponible, la barra se oculta para la sesión y no se carga el píxel.
- Sin JS: la barra no aparece (está dentro de un `<template>` que el script materializa), y no se carga ninguna etiqueta.

## Gestor de preferencias (pie de página, todas las páginas)

- Enlace "Cookies y preferencias" en `Footer.astro` que abre un `<dialog>` con el estado actual ("Aceptado el <fecha>" o "No aceptado"), el texto del aviso, botón "Aceptar" o "Retirar la aceptación" según el estado, y enlace a `/tratamiento-de-datos/#cookies`. Sin JS, el enlace lleva a la sección de la política.
- Retirar: guarda `revokedAt`, pone `acceptedAt` en null, dispara `tdm:revoke` (Consent Mode a `denied`, borrado de cookies), notifica al backend `POST { id, revoked_at }`.

## Endpoint de consentimiento (backend de Eventalist)

`POST /api/v1/marketing/consent/` (CORS desde https://testigosdelamemoria.com) con cuerpo `{ id, version, scope, accepted_at, revoked_at?, site }`; idempotente por `id` (upsert). Sin IP ni identidad; responde 204. Sirve para entregar copia al titular que la pida (art. 8 del Decreto 1377). Si no existe al publicar, `consentEndpoint` queda vacío y la política usa la variante B ("en el navegador del visitante").

## Degradación (FR-006)

- Todos los accesos a `gtag`, `fbq`, `localStorage` van en `try/catch`; nunca se lanza ni se escribe en consola de error.
- Bloqueadores: las llamadas a `gtag('get')` tienen tope de 2 s; si no responden, el widget se construye igual sin `data-tracking-ga-*` (patrón oficial de Pretix, ver `pretix-attribution.md`).

## Rendimiento (FR-010)

- gtag `async` detrás del preload de la imagen; píxel tras `load` en idle.
- Presupuesto: la portada no supera 560 KB transferidos con ambas etiquetas cargadas; LCP móvil (Lighthouse, mediana de 5) < 2,5 s. Se mide en `quickstart.md` §5 en tres estados: sin etiquetas, con GA4, con GA4 y Meta.

## Textos legales (FR-008)

Fuente de verdad: `docs/revision-legal-2026-09-15-medicion.md`. Cada cambio legal en un commit propio, sin reescribir historial (prueba de la versión vigente, art. 16 del Decreto 1377).

- `tratamiento-de-datos.astro`: nueva sección 10 "Cookies, medición de audiencia y publicidad" con `id="cookies"` (variante A si `consentEndpoint` existe, B si no); Vigencia pasa a 11; los siete ajustes consecuenciales de la tabla del dictamen (párrafo inicial, sección 2, sección 3 literal g y frase de mensajes, sección 4, sección 5, cabecera). `DATA_POLICY_EFFECTIVE` = fecha de publicación.
- `terminos-y-condiciones.astro`: sección 12, primer párrafo reemplazado y frase final añadida según el dictamen. `TERMS_EFFECTIVE` = fecha de publicación.
- `docs/pretix-tienda-textos.md`: casilla obligatoria de Pretix reescrita con el texto del dictamen; se aplica en el panel de Pretix (Confirmation text) el mismo día que se publica la política; la fecha queda como `ATTRIBUTION_CONSENT_SINCE` para el backend.
- La política y los términos nuevos se publican en el mismo despliegue que las etiquetas o antes; el HTML publicado no debe afirmar nada que el sitio no haga (verificación con el inspector antes de publicar).
