# Contrato: embed de Pretix

Pretix es el ÚNICO dueño de tipos de boleta, precios y etapas (FR-008). La página solo conoce una URL.

## Configuración

```ts
// src/config.ts
export const PRETIX_EVENT_URL = 'TODO-PRETIX-URL'; // p.ej. https://pretix.eu/<org>/<event>/
export const pretixReady = false; // true SOLO junto con la URL real
```

## Render de TicketSection (`#boletas`)

| Estado | Render |
|---|---|
| `pretixReady: false` | Párrafo de contexto + aviso "La venta de boletas abre pronto / Ticket sales open soon" (ui.ts). SIN script de Pretix, SIN enlace roto. |
| `pretixReady: true` | Widget oficial: `<link rel="stylesheet" href="{PRETIX_EVENT_URL}widget/v1.css">` + `<script async src="https://pretix.eu/widget/v1.{locale}.js">` + `<pretix-widget event="{PRETIX_EVENT_URL}"></pretix-widget>`. Script `v1.es.js` en `/`, `v1.en.js` en `/en/`. |

## Fallback (FR-011, siempre presente cuando `pretixReady`)

Dentro de `<pretix-widget>`, el bloque oficial de no-carga:

```html
<pretix-widget event="...">
  <div class="pretix-widget-info-message">
    <!-- texto ui.ts: si el módulo no carga -->
    <a href="{PRETIX_EVENT_URL}" target="_blank" rel="noopener">Comprar en la tienda de Pretix →</a>
  </div>
</pretix-widget>
```

Sin JS (o widget bloqueado): ese contenido interno es lo que se ve → siempre hay vía de compra (FR-018/FR-011).

## Prohibiciones

- Ningún otro componente carga scripts de Pretix ni duplica el widget (los CTAs solo hacen scroll a `#boletas`, FR-010).
- La página no lee ni sincroniza estado del widget (carrito, precios, disponibilidad).
- Ningún precio/tipo de boleta hardcodeado en copy, JSON-LD ni FAQs; las dudas de reembolso remiten a Pretix/organizador.
