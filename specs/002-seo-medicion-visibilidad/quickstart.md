# Quickstart · Validación de la feature 002

Guía de setup manual y de verificación. Cada bloque cierra un criterio de éxito de la spec. Sin código de implementación: los detalles están en `contracts/`.

## 0. Prerrequisitos

- Node 22 o 24, `npm ci`, `npm run build` y `npm run check` en verde en la rama `002-seo-medicion-visibilidad`.
- Cuentas: propiedad GA4 de Eventalist para testigosdelamemoria.com (`G-…` y un `api_secret` de Measurement Protocol); dataset (píxel) de Meta en el Business Manager de Eventalist con token de Conversions API; acceso de administrador a `pretix.eventalist.co` (organizador `eventalist`, evento `testigos-memoria`) y a la API con token de solo lectura; acceso al backend de Eventalist en Railway.
- Perfil de Chrome "Eventalist" para Search Console (propiedad de dominio) y Bing Webmaster Tools (bing.com está bloqueado para el navegador automatizado: paso manual).

## 1. Setup manual (usuario o Eventalist)

1. **Pretix**: nada obligatorio. Opcional: activar en el evento "Ask search engines not to index the ticket shop".
2. **Meta**: Events Manager → dataset → obtener ID y token de CAPI; Business Settings → Brand Safety → Domains → añadir testigosdelamemoria.com y verificar (DNS TXT en GoDaddy, o meta-tag → `measurement.metaDomainVerification`). Comprobar que el dataset no cae en una categoría restringida.
3. **GA4**: crear propiedad y flujo web; copiar `G-…`; Admin → Data collection → Google Signals **apagado** y personalización de anuncios **apagada**; sin User-ID; Admin → Data streams → Measurement Protocol API secrets → crear uno para el backend; Admin → Events → marcar `purchase` y `begin_checkout` como eventos clave. Sin Google Ads (decisión 2026-09-16).
4. **Backend de Eventalist**: nada (capa retirada el 2026-09-17).
5. **Configurar el sitio**: `src/config.ts` → `measurement.ga4Id`, `measurement.metaPixelId`, `metaDomainVerification` (si aplica).
6. **Bing Webmaster Tools**: My Sites → Import → Google Search Console → seleccionar testigosdelamemoria.com → Import. Sitemaps → añadir `https://testigosdelamemoria.com/sitemap.xml`. URL Inspection → portada → Request indexing. Anotar la fecha para SC-008.

## 2. Medición en navegador (SC-001, FR-001, FR-002, FR-006)

```sh
npm run build && npm run preview
```

1. Abrir la portada en una ventana limpia. Debe aparecer el aviso de consentimiento y permanecer al hacer scroll; en la pestaña Network solo `gtag/js` (no `fbevents.js`); en Application → Cookies **no** existe `_ga` ni `_fbp` (Consent Mode en `denied`); los pings a `/g/collect` llevan `gcs=G100`.
2. Cerrar el aviso con ×: no aparecen cookies ni `fbevents.js`; al abrir otra pestaña nueva el aviso vuelve.
3. Pulsar "Aceptar": `localStorage['tdm.consent']` con `id`, versión, alcance y fecha; aparecen `_ga` y, tras `load`, `fbevents.js` y `_fbp`; en GA4 DebugView (con `?debug_mode=1` o la extensión) aparece `consent_granted`. Ninguna petición a servidores propios.
4. Recargar: el aviso no vuelve a salir; `gcs=G111` en los pings.
5. Pie de página → "Cookies y preferencias" → "Retirar la aceptación": `acceptedAt` en null, `_ga*`, `_fbp` y `_fbc` borradas, `gcs=G100`, y en la siguiente carga no se carga `fbevents.js`.
6. Con la aceptación dada, pulsar "Comprar boletas" en el header: GA4 DebugView muestra `begin_checkout` con `currency: COP`; Meta Test Events (Events Manager → Test Events, con el código de prueba) muestra `InitiateCheckout` con el mismo `eventID` (se ve en el payload `/tr?…&eid=`).
7. Con un bloqueador de anuncios activo: la página se ve igual, el widget de Pretix se construye, la consola no muestra errores no capturados.
8. Sin JavaScript (DevTools → Disable JavaScript): no hay aviso, no hay etiquetas, el contenido y el enlace de compra se ven.
9. En producción, 24 h después del deploy: GA4 Realtime con visitas y al menos un `begin_checkout`; Meta Events Manager con `PageView` activo y audiencia creciendo.

## 3 y 4. Retirados el 2026-09-17

La atribución de compras en el servidor se retiró; no hay nada que probar en Pretix ni en el backend. El widget de Pretix debe comportarse exactamente igual que el 15 de septiembre: misma lista, mismo botón, sin atributos `data-tracking-*` (comprobar en el inspector).

## 5. Rendimiento (SC-007, FR-010, FR-036)

Medir la portada en móvil con Lighthouse, 5 corridas, mediana, en tres estados: (a) rama `dev` actual (línea base), (b) esta rama con identificadores vacíos (preload de la hero), (c) esta rama con GA4 y Meta activos y consentimiento aceptado.

```sh
npx lighthouse http://localhost:4321/ --preset=perf --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate --output=json --output-path=./lh-$STATE-$i.json
```

Extraer `audits.largest-contentful-paint.numericValue` y `audits.total-byte-weight.numericValue`; guardar las medianas en `specs/002-seo-medicion-visibilidad/perf.md`. Criterios: LCP (c) < 2500 ms; peso (c) ≤ 560 KB; el preload no debe cambiar qué variante de la hero descarga el navegador (verificar en Network que `href` del preload = `currentSrc` de la `<img>`). Complementar con PageSpeed Insights sobre producción tras el deploy.

## 6. Marcado (SC-004, FR-011 a FR-017)

1. `npm run build` pasa las aserciones (`assertAgenda`, `assertJsonLd`, longitudes de título y descripción, rutas registradas).
2. Rich Results Test (https://search.google.com/test/rich-results) sobre `https://testigosdelamemoria.com/` tras el deploy: "Event" detectado, sin errores; ofertas listadas (5 antes del 5 de octubre: 1 InStock y 4 PreOrder); sede con dirección. Repetir con `/charlas-abiertas/` (Event con entrada libre) y con una ficha (Breadcrumb; ProfilePage si la herramienta lo muestra) y `/programacion/` (Breadcrumb).
3. Schema Markup Validator (https://validator.schema.org/) sobre las mismas URL: sin errores.
4. Si el test avisa por `location` en arreglo: aplicar la decisión de un solo Place (contrato `jsonld.md`).
5. Search Console → Mejoras → Eventos y Rutas de navegación a los 7 días: sin errores.
6. **Hito 5 de octubre**: publicar ese día (build con fecha ≥ stage2Start) y comprobar en el Rich Results Test que el pase completo desaparece y las franjas pasan a InStock. **Al agotarse una boleta**: `soldOut: true`, publicar y verificar `SoldOut`.

## 7. Páginas nuevas e indexación (SC-005, SC-006, FR-018 a FR-030)

1. `dist/` contiene `panelistas/index.html`, `panelistas/<slug>/index.html` ×12, `programacion/index.html`, `charlas-abiertas/index.html`, `como-llegar/index.html`; `sitemap.xml` lista esas URL más la portada y ninguna legal; las legales tienen `<meta name="robots" content="noindex, follow">`.
2. Cada ficha: título ≤ 60 y descripción ≤ 155 (aserción), migas visibles, biografía completa, sesiones con enlace a `/programacion/#slug`, OG con la imagen del panelista (probar en https://developers.facebook.com/tools/debug/ y en el Post Inspector de LinkedIn; en WhatsApp con el enlace real).
3. Portada: cada tarjeta de panelista enlaza a su ficha; Agenda enlaza a la programación; el bloque de boletas muestra precios y etapas en texto plano.
4. `curl -s https://testigosdelamemoria.com/programacion/ | grep -c 'id="' ` ≥ 17 (4 días + 13 sesiones).
5. Tras el deploy: Search Console → Sitemaps → reenviar; Inspección de URL → solicitar indexación de la portada, `/programacion/`, `/charlas-abiertas/` y las 12 fichas (o las de mayor prioridad si hay cuota). Workflow de deploy: el paso IndexNow devuelve 200 o 202.
6. Seguimiento: el 20 de octubre, Search Console → Páginas: ≥ 80 % de las URL del sitemap indexadas. El 1 de noviembre: búsqueda `"<nombre>" "Villa de Leyva"` para 8 de 12 panelistas devuelve la ficha en la primera página; búsqueda de marca devuelve el sitio en primer lugar (SC-009).

## 8. Bing y asistentes (SC-008, FR-032, FR-033, FR-034)

1. Bing Webmaster Tools: propiedad verificada, sitemap "Procesado", portada indexada antes del 30 de septiembre; informe AI Performance activado.
2. `curl -s https://testigosdelamemoria.com/robots.txt` contiene los ocho agentes del contrato y el sitemap.
3. `curl -s https://testigosdelamemoria.com/panelistas/daniel-samper-pizano/ | sed 's/<[^>]*>/ /g' | grep -c "5 al 8 de noviembre de 2026"` ≥ 1, y lo mismo con "Villa de Leyva" y "Boyacá" en cada página interior.
4. El 15 de octubre: `site:testigosdelamemoria.com` en Bing devuelve las páginas; una pregunta en Copilot y en ChatGPT (con búsqueda) sobre "eventos en Villa de Leyva en noviembre de 2026" cita el sitio (registro cualitativo, no criterio de cierre).

## 9. Legal (SC-011, FR-008)

1. `/tratamiento-de-datos/#cookies` existe con la sección 10 (solo cookies, variante B) y sus ajustes consecuenciales; la política no afirma que se transmitan datos de compra; `DATA_POLICY_EFFECTIVE` actualizado; el aviso y el pie enlazan a esa ancla.
2. `/terminos-y-condiciones/` sin cambios respecto al 14 de septiembre.
3. En Pretix, la casilla obligatoria conserva su texto.
4. Enlaces https://policies.google.com/technologies/partner-sites y https://www.facebook.com/adpreferences/ responden 200.
5. Los cambios legales van en commits propios; el despliegue que activa las etiquetas incluye la política y los términos nuevos (mismo commit o anterior).
6. Comprobación del §2 (sin cookies antes de Aceptar) hecha en producción antes de anunciar la campaña.

## 10. Publicación y revisión de restos (FR-039)

Antes de cada despliegue, con el usuario: (1) leer el diff completo de la rama frente a `main`; (2) buscar en código, HTML compilado y documentación los términos `webhook`, `api_meta`, `Conversions API`, `Measurement Protocol`, `ATTRIBUTION_CONSENT_SINCE`, `consentEndpoint`, `data-tracking`, `attribution` y confirmar que solo aparecen en `docs/archivo-2027/` o en notas de "retirado"; (3) abrir la portada y comprobar que el widget de Pretix carga igual que el 15 de septiembre; (4) anotar fecha y resultado en `perf.md`. Cada despliegue a `main` requiere además el visto bueno del usuario para ese cambio. Orden previsto: (1) medición + on-page + política; (2) marcado + fichas + programación + charlas; (3) cómo llegar (y dónde dormir si hay lista); (4) 5 de octubre; (5) agotados. Tras cada uno: reenviar sitemap en Search Console y comprobar el paso IndexNow.
