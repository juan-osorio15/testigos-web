# Implementation Plan: Medición, marcado y visibilidad de testigosdelamemoria.com

**Branch**: `002-seo-medicion-visibilidad` | **Date**: 2026-09-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-seo-medicion-visibilidad/spec.md`

## Summary

Convertir el sitio de una sola URL sin medición en un sitio medible y multipágina en las dos primeras semanas: medición de navegador (GA4 y píxel de Meta) con aviso de consentimiento y atribución de la compra real que ocurre en Pretix (widget → `api_meta` del pedido → webhook → backend de Eventalist → Conversions API y Measurement Protocol); marcado de evento completo para el módulo de eventos de Google (sedes con coordenadas, ofertas por etapa, subeventos, ponentes enlazados); 12 fichas de panelistas, programación, charlas abiertas y página de cómo llegar; sitemap derivado de una fuente única de rutas, Bing e IndexNow, `robots.txt` con los bots de respuesta de IA; título, descripción y precarga de la imagen principal. Todo estático en Astro 5, sin gestor de etiquetas ni dependencias nuevas de runtime, y con dos entregables fuera del repositorio (mini plugin de Pretix y receptor de webhook en Django) cuyos contratos fija este plan.

## Technical Context

**Language/Version**: Astro 5.18.2 (estático), TypeScript para datos y configuración, JavaScript vanilla en `<script>` de Astro. Node 22 en CI (24 local). Fuera del repo: Python (mini plugin de Pretix, ~30 líneas) y Django (backend de Eventalist en Railway).

**Primary Dependencies**: `astro` (única de runtime). Nueva devDependency opcional: ninguna obligatoria (`web-vitals` se carga inline desde el bundle de Astro si se decide RUM; ver R-04). Scripts externos: `gtag.js` (GA4), `fbevents.js` (Meta), widget de Pretix (ya existente). Sin GTM, sin Partytown.

**Storage**: N/A en el sitio (datos en módulos TypeScript de `src/data/`). Consentimiento y parámetros de origen en `localStorage` / cookie propia del navegador. Fuera del repo: `api_meta` del pedido en Pretix; registro de eventos enviados en el backend de Eventalist (idempotencia por código de pedido).

**Testing**: `astro build` + `astro check` como gate mecánico; validación funcional por `quickstart.md` (Rich Results Test, Schema Markup Validator, GA4 DebugView, Meta Test Events, Lighthouse móvil mediana de 5, Search Console, Bing Webmaster Tools). Sin harness de tests: el sitio es estático y los contratos se validan contra las herramientas de cada plataforma.

**Target Platform**: Web estática en GitHub Pages (workflow existente, push a `main` solo con autorización). Navegadores evergreen y móvil; todo el contenido legible sin JS; medición degradada en silencio si está bloqueada.

**Project Type**: Sitio web estático multipágina (portada + 16 a 18 páginas internas) con integraciones de medición de terceros.

**Performance Goals**: LCP móvil de la portada < 2,5 s después de instalar las etiquetas (SC-007); peso total del sitio ≤ 560 KB (hoy 420 KB); TTFB y peso de HTML sin regresión; una sola imagen `priority` por página.

**Constraints**: fecha límite dura de contenido 2026-10-15 (fichas, programación y charlas abiertas antes del 2026-09-29); ningún dato de sesión, sede o ponente inventado (FR-012); ningún precio en copy fuera de los datos de `event.ts` (la tienda sigue siendo dueña de la venta; el marcado y el texto plano de precios salen del mismo módulo); fórmula visual de bloques y copy sin guiones de pausa; publicación a `main` solo con visto bueno del usuario; identificadores de medición vacíos por defecto (nada se carga hasta que existan las cuentas).

**Scale/Scope**: 12 fichas de panelistas + índice, programación (13 sesiones), charlas abiertas, cómo llegar, dónde dormir (condicionada), 2 legales con `noindex`; 5 ofertas; 2 sedes; 3 eventos de medición en navegador y 2 en servidor; ~20 URL en el sitemap.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No existe `.specify/memory/constitution.md` en este repositorio (la carpeta `.specify/memory` no existe). Actúan como gates de facto las reglas vigentes del proyecto y de la spec: publicación a `main` solo con autorización explícita (FR-038); ningún dato de evento inventado (FR-012, heredado de la spec 001); Pretix como único dueño de la venta (contrato `pretix-embed.md` de la 001, que este plan extiende sin romper); copy sin guiones de pausa y fórmula visual de bloques; páginas legales sobrias; sin dependencias de runtime nuevas salvo justificación. **PASS** antes de Phase 0. Re-chequeado tras Phase 1: **PASS**. La única extensión del contrato de Pretix es añadir atributos `data-tracking-*` al `<pretix-widget>`; la página sigue sin leer precios ni estado del widget (los precios del marcado salen de `event.ts`, como ya ocurría con `ticketOffer`).

## Project Structure

### Documentation (this feature)

```text
specs/002-seo-medicion-visibilidad/
├── plan.md                      # Este archivo
├── spec.md
├── research.md                  # Phase 0: R-01 a R-06 resueltas
├── data-model.md                # Phase 1: entidades y cambios en src/data
├── quickstart.md                # Phase 1: guía de validación y setup manual
├── contracts/
│   ├── measurement-events.md    # Eventos de navegador, consentimiento, configuración
│   ├── pretix-attribution.md    # Widget → api_meta → webhook → CAPI y MP (Eventalist)
│   ├── jsonld.md                # Formas del JSON-LD: Event, ofertas, subeventos, Person, Breadcrumb
│   └── pages-seo.md             # Rutas, títulos, sitemap, robots, IndexNow, OG
├── checklists/requirements.md
└── tasks.md                     # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
astro.config.mjs                 # sin cambios previstos (site ya fijado)
.github/workflows/deploy.yml     # + paso IndexNow tras el deploy (curl POST con las URL del sitemap)
public/
├── robots.txt                   # bots de respuesta de IA nombrados; sitemap
├── 1b880322af30410c8832c1e6748dc455.txt   # clave IndexNow (ya existe)
└── og/
    ├── og-image-v2.png          # portada (existe)
    ├── panelistas/<slug>-v1.png # nuevas, generadas por brand/og
    └── paginas/<ruta>-v1.png    # programación, charlas abiertas, cómo llegar
brand/og/                        # + plantilla y script para las imágenes de panelistas y páginas
src/
├── config.ts                    # + measurement { ga4Id, metaPixelId, consentVersion, consentEndpoint }
├── routes.ts                    # NUEVO: fuente única de rutas indexables (sitemap, migas, IndexNow)
├── links.ts                     # sectionHref sigue; + helpers a rutas internas
├── ui.ts                        # + textos de aviso de consentimiento, migas, fichas, programación
├── data/
│   ├── event.ts                 # ticketOffer → ticketOffers[] con ventana y soldOut; venues + geo
│   ├── agenda.ts                # AgendaSlot + start/end (HH:MM) + slug
│   ├── speakers.ts              # sin cambio de forma; + works/press opcional por ficha
│   └── faqs.ts                  # sin cambios
├── seo/
│   ├── jsonld.ts                # NUEVO: builders de Organization, Places, Event, subEvent, offers, Person, Breadcrumb
│   ├── offers.ts                # NUEVO: disponibilidad derivada de etapas y soldOut
│   └── meta.ts                  # NUEVO: título/descripción por página con aserción de longitud
├── measurement/
│   ├── consent.ts               # NUEVO: estado del aviso (localStorage, versión, fecha)
│   ├── tags.ts                  # NUEVO: carga de gtag y fbevents, eventos begin_checkout / InitiateCheckout con event_id
│   └── attribution.ts           # NUEVO: captura utm/fbclid/gclid, lectura de _fbp/_fbc/client_id/session_id, inyección data-tracking-* al widget
├── layouts/
│   ├── EventLayout.astro        # head: preload LCP, preconnect, JSON-LD por página (slot), etiquetas de medición, aviso de consentimiento, migas
│   ├── LegalLayout.astro        # noindex, follow
│   └── InnerLayout.astro        # NUEVO: cabecera de página interior con migas (fórmula visual de bloques)
├── components/
│   ├── ConsentNotice.astro      # NUEVO: aviso persistente + gestor de preferencias (revocar)
│   ├── Footer.astro             # + enlace "Cookies y preferencias" y enlaces a páginas nuevas
│   ├── Breadcrumbs.astro        # NUEVO (visible + BreadcrumbList)
│   ├── Hero.astro               # <Image priority> con widths acordes
│   ├── SpeakerCard.astro        # nombre y foto enlazan a /panelistas/<slug>/
│   ├── Schedule.astro           # filas con ancla por sesión y enlace a fichas; enlace a /programacion/
│   ├── TicketSection.astro      # data-tracking-* en <pretix-widget>; precios en texto plano desde event.ts
│   └── FAQ.astro                # respuestas de "cómo llego" y "dónde me hospedo" enlazan a las páginas nuevas
└── pages/
    ├── index.astro              # título y descripción nuevos; enlaces a las páginas internas
    ├── panelistas/index.astro   # NUEVO: índice de 12
    ├── panelistas/[slug].astro  # NUEVO: getStaticPaths desde speakers.ts; ProfilePage + Breadcrumb
    ├── programacion.astro       # NUEVO: programación completa, anclas por día y sesión, "Actualizado el"
    ├── charlas-abiertas.astro   # NUEVO: Event propio (entrada libre) + Breadcrumb
    ├── como-llegar.astro        # NUEVO (P3)
    ├── donde-dormir.astro       # NUEVO, solo si llega la lista (P3)
    ├── sitemap.xml.ts           # desde routes.ts, con lastmod
    ├── tratamiento-de-datos.astro   # + sección 10 (cookies y medición) y 7 ajustes del dictamen; noindex
    └── terminos-y-condiciones.astro # sección 12 según el dictamen; noindex
docs/
├── revision-legal-2026-09-15-medicion.md   # dictamen con los textos legales (fuente de verdad)
└── pretix-tienda-textos.md                 # casilla obligatoria de Pretix reescrita (se aplica en el panel de Pretix)
```

**Structure Decision**: proyecto Astro existente en la raíz; se añaden dos módulos de dominio (`src/seo/`, `src/measurement/`) para que el layout no acumule lógica, y `src/routes.ts` como fuente única de rutas. Los entregables de Eventalist (plugin de Pretix y receptor del webhook) no viven en este repositorio: sus contratos están en `contracts/pretix-attribution.md` y las tareas los marcan como dependencias externas.

## Fases de entrega (para /speckit-tasks)

1. **Semana 1 · Medición y correcciones on-page** (publicable sola): configuración de medición, aviso de consentimiento con Consent Mode y gestor de preferencias, GA4 y píxel, `begin_checkout` / `InitiateCheckout`, captura de origen e inyección al widget, textos legales del dictamen (política, términos) en commits propios, título y descripción, preload de la hero, `noindex` legales, `robots.txt`, IndexNow en el deploy. Manual del usuario: cuentas de GA4 (Signals apagado) y Meta, verificación de dominio en Meta, Bing Webmaster Tools, `noindex` y casilla nueva en Pretix.
2. **Semana 1-2 · Lado servidor** (Eventalist, en paralelo): endpoint de registro de consentimiento, plugin de Pretix, webhook, endpoint Django, envío a CAPI y MP solo de pedidos posteriores a la nueva casilla, prueba con pedido de test.
3. **Semana 2 · Marcado y arquitectura** (antes del 29 de septiembre): `routes.ts`, `seo/`, ofertas y disponibilidad derivada, sedes con geo, subeventos, fichas de panelistas con OG propio, índice, programación, charlas abiertas, migas, sitemap nuevo, reenvío en Search Console y Bing.
4. **Semana 3 · Páginas prácticas** (antes del 15 de octubre): cómo llegar; dónde dormir si hay lista.
5. **Hitos de operación**: publicación el 5 de octubre (cambio de etapa); marcar `soldOut` cuando aplique; revisión del informe de eventos de Search Console a los 7 días de cada publicación.

## Decisiones cerradas por el dictamen legal (2026-09-15)

Dictamen completo en `docs/revision-legal-2026-09-15-medicion.md`. Efectos en el diseño:

- El píxel de Meta carga solo tras "Aceptar". No hay interruptor para cargarlo antes.
- GA4 carga de inmediato en Consent Mode con todo en `denied` y pasa a `granted` al aceptar; Google Signals y personalización de anuncios apagados en la propiedad; sin ID de usuario.
- La aceptación se registra en el navegador y en el backend de Eventalist (endpoint mínimo de consentimiento, contrato en `measurement-events.md`). Sin backend a tiempo: variante B de la cláusula.
- Enlace "Cookies y preferencias" en el pie de todas las páginas, con revocación efectiva en ese navegador.
- La política de datos no se publica con la medición sin la cláusula 10 y los siete ajustes consecuenciales; la casilla obligatoria de Pretix y la sección 12 de los términos se reescriben con los textos del dictamen. `DATA_POLICY_EFFECTIVE` y `TERMS_EFFECTIVE` suben a la fecha de publicación.
- El backend solo envía a Meta y GA4 pedidos pagados después de la nueva versión de la casilla de Pretix; ningún dato fuera de los enumerados en la cláusula.

## Decisión pendiente del usuario

- **Título de la portada**: dos opciones en `research.md` (60 y 53 caracteres); se aplica la que el usuario apruebe.
- **Aprobación de los textos legales** del dictamen antes de publicarlos (aviso, cláusula, casilla de Pretix, términos).

## Complexity Tracking

Sin violaciones que justificar. Los dos módulos nuevos (`src/seo/`, `src/measurement/`) sustituyen lógica que de otro modo crecería dentro de `EventLayout.astro`; el mini plugin de Pretix es la alternativa más simple verificada frente a una licencia Enterprise.
