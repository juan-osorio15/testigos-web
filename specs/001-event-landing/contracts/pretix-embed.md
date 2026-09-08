# Contrato: embed de Pretix

Pretix es el ÚNICO dueño de tipos de boleta, precios y etapas (FR-008). La página solo conoce una URL.

## Configuración

```ts
// src/config.ts
export const PRETIX_EVENT_URL = 'https://pretix.eventalist.co/eventalist/testigos-memoria/';
export const PRETIX_WIDGET_SCRIPT = 'https://pretix.eventalist.co/widget/v2.es.js';
export const PRETIX_WIDGET_CSS = `${PRETIX_EVENT_URL}widget/v2.css`;
export const pretixReady = false; // true cuando la prueba en /demo se apruebe
```

Instancia propia de Eventalist, widget **v2** (2026-09-07). Mientras `pretixReady`
sea `false`, la ruta temporal `/demo` (noindex) muestra la tienda real para
probar la compra; al aprobarla, `pretixReady = true`, borrar `src/pages/demo.astro`
y la excepción de `src/links.ts`.

## Render de TicketSection (`#boletas`)

| Estado | Render |
|---|---|
| `pretixReady: false` | Párrafo de contexto + aviso "La venta de boletas abre pronto / Ticket sales open soon" (ui.ts). SIN script de Pretix, SIN enlace roto. |
| `pretixReady: true` (o `live` en /demo) | Widget oficial v2: `EventLayout` pone en `<head>` `<link rel="stylesheet" href="{PRETIX_WIDGET_CSS}" crossorigin>` + `<script async src="{PRETIX_WIDGET_SCRIPT}" crossorigin>`, tal como lo indica la tienda; `TicketSection` renderiza `<pretix-widget event="{PRETIX_EVENT_URL}"></pretix-widget>`. |

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
