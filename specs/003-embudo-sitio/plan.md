# Implementation Plan: Embudo de venta por campaña · parte del sitio

**Branch**: `main` (commits locales; ningún push sin visto bueno) | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)

**Input**: `specs/003-embudo-sitio/spec.md`. Contexto en `docs/medicion-embudo/diseno.md`, que manda sobre este plan.

## Summary

Que cada pedido de Pretix llegue con la campaña de la visita y, con cookies aceptadas, con los identificadores de GA4 y Meta, para que el informe del titular pueda ver qué campañas venden y en qué paso se pierde la gente. Un módulo nuevo (`src/measurement/attribution.ts`) captura la campaña en `sessionStorage` y escribe los atributos `data-tracking-*` en el widget sin tocar su comportamiento. `tags.ts` separa "vio las boletas" (clic en CTA) de "Comprar" (envío del formulario del widget). La política y los términos se actualizan con la sección C del dictamen y los ajustes de clarify. La URL del evento puede apuntar a `testigos-sandbox` en local con una variable.

## Technical Context

**Language/Version**: Astro 5 estático, TypeScript estricto en `src/measurement/` (corre en el navegador desde el `<script>` de `EventLayout.astro`).

**Primary Dependencies**: ninguna nueva. Scripts externos ya presentes: `gtag.js`, `fbevents.js`, widget v2 de Pretix.

**Storage**: `sessionStorage['tdm.attribution']` (nuevo); `localStorage['tdm.consent']` (existente, solo lectura desde el módulo nuevo). Sin cookies propias.

**Testing**: `npm run check` y `npm run build`. Prueba manual con capturas según [quickstart.md](quickstart.md). Sin corredor de pruebas (decisión del titular: no hay falla silenciosa que una prueba automática atrape mejor que el ensayo).

**Target Platform**: GitHub Pages; navegadores actuales, escritorio y móvil.

**Project Type**: sitio estático con integraciones de terceros.

**Performance Goals**: cero esperas nuevas antes de que el widget sea usable o antes de "Comprar". El módulo nuevo pesa menos de 3 KB comprimido.

**Constraints**: `disable-iframe` se queda; todo en `try/catch` y sin consola; nada de `localStorage` ni cookies para la campaña; textos visibles en español sin " — "; un archivo por `git add`; commits legales separados.

**Scale/Scope**: 2 páginas con widget (`/` y `/en/`), CTA en 5 lugares, 2 páginas legales, 1 documento de la tienda, 2 contratos de features anteriores con nota.

## Constitution Check

No existe `.specify/memory/constitution.md`. Gates de facto, los de 002 y los del prompt:

- Publicación solo con visto bueno del titular: el plan no fija fechas (research R-11). PASS.
- Pretix es dueño de la venta y el widget no cambia de comportamiento: solo se escriben atributos que el widget ya admite y se escuchan eventos sin cancelarlos. PASS, con la extensión del contrato de 001 anotada.
- Nada que el HTML publicado afirme sin que el sitio lo haga: código y textos legales en el mismo push. PASS.
- Datos personales lo mínimo: `gclid` e identificadores solo con aceptación; campaña solo en la pestaña. PASS.

Re-chequeo tras el diseño: PASS. Ningún gate se viola.

## Project Structure

### Documentación (esta feature)

```text
specs/003-embudo-sitio/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/widget-tracking.md
├── checklists/requirements.md
└── tasks.md            (siguiente paso)
```

### Código y documentos que cambian

```text
src/measurement/attribution.ts       nuevo: captura, identificadores, sincronización con el widget
src/measurement/tags.ts              view_item_list / ViewContent en CTA; begin_checkout en submit; initAttribution()
src/layouts/EventLayout.astro        solo el comentario "Nada viaja al widget"
src/config.ts                        PUBLIC_PRETIX_EVENT_URL; DATA_POLICY_EFFECTIVE y TERMS_EFFECTIVE; comentarios
src/pages/tratamiento-de-datos.astro sección C del dictamen + ajustes de clarify
src/pages/terminos-y-condiciones.astro sección 12
docs/pretix-tienda-textos.md         casilla A, ayuda del teléfono, fechas
specs/002-.../contracts/measurement-events.md  nota que remite a 003 y líneas corregidas
specs/001-.../contracts/pretix-embed.md        nota: el widget recibe atributos desde 003
docs/medicion-embudo/estado.md       sección testigos-web y preguntas abiertas
docs/medicion-embudo/diseno.md       decisiones de detalle (ya hecho en clarify; begin_checkout sin value)
```

`TicketSection.astro` no cambia: el módulo encuentra el widget por `.tickets-widget`.

**Structure Decision**: un módulo nuevo para la atribución y cambios mínimos en `tags.ts`, que sigue siendo el único punto de arranque (`initMeasurement()`). La atribución no depende del píxel ni de GA4: si `measurement.ga4Id` está vacío, las UTM igual viajan.

## Diseño

Detalle en [research.md](research.md), [data-model.md](data-model.md) y [contracts/widget-tracking.md](contracts/widget-tracking.md). En resumen:

1. `captureAttribution()` corre en cada carga: URL → `sessionStorage` según data-model.
2. `syncWidgetAttributes()` calcula el conjunto de atributos deseado y lo aplica sobre el elemento vigente: escribe los que tienen valor y quita los `data-tracking-*` que sobran. Solo toca el DOM si algo cambió, para no despertar al observador del widget sin necesidad.
3. Disparadores de sincronización (R-02) y un `MutationObserver` que se desconecta al ver el wrapper.
4. `tags.ts`: el listener de clic llama a `trackViewItemList()`; un listener nuevo de `submit` en captura llama a `trackBeginCheckout()` si el formulario está en el wrapper.

## Publicación

Orden propuesto en research R-11. Resumen: ensayo en el sandbox → el titular fija el día D → un push con código y textos (vigencias = D) → comprobar lo publicado → casilla y `consent_since` el mismo día → verificación en producción sin pagar. El titular decide D; el plan no la fija.

Para la guía de informes: D es la fecha en que `begin_checkout` cambia de significado (anotado en `diseno.md`).

## Riesgos

- **Claves `null` tras revocar**: depende de la respuesta de `pretix-wompi`. Si el plugin no las trata como ausentes, el ajuste es suyo; el sitio no puede borrar claves.
- **Momento de los identificadores**: si alguien acepta y pulsa "Comprar" antes de que exista `_fbp`, ese pedido va sin `fbp`. Es aceptable: el plugin manda igual con correo y teléfono cifrados.
- **Clases internas del widget** (`pretix-widget-wrapper`): si Pretix las cambia en una actualización, la sincronización cae al `<pretix-widget>` original, que ya no existe. El ensayo tras cada actualización de Pretix lo detecta (quickstart §5).
- **Verificación en producción**: el pedido de prueba sin pagar dispara `AddPaymentInfo` en Meta y entra al backend antes de cancelarlo. Usar la campaña `verificacion` para filtrarlo.

## Complexity Tracking

Sin violaciones que justificar.
