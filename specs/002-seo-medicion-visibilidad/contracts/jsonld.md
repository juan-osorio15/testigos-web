# Contrato: JSON-LD por página

Cubre FR-011 a FR-017, FR-019 y R-06. Todo sale de `src/seo/jsonld.ts` a partir de `src/data/`; ninguna página escribe marcado a mano. Un solo `<script type="application/ld+json">` por página con `@graph`.

## Identificadores estables

| Entidad | `@id` |
|---|---|
| Organización | `${SITE_URL}/#organizacion` (existe) |
| Sitio | `${SITE_URL}/#sitio` (existe) |
| Evento principal | `${SITE_URL}/#evento` (existe) |
| Charlas abiertas | `${SITE_URL}/charlas-abiertas/#evento` |
| Sesión | `${SITE_URL}/programacion/#${slot.slug}` |
| Sede | `${SITE_URL}/#sede-${venue.id}` |
| Panelista | `${SITE_URL}/panelistas/${slug}/#persona` |

## Portada

`@graph`: Organization, WebSite, Place ×2, Event principal, FAQPage (ya existe en FAQ.astro; se mantiene, inocuo).

**Place** (por sede):
```json
{"@type":"Place","@id":"…/#sede-duruelo","name":"Hospedería Duruelo",
 "address":{"@type":"PostalAddress","streetAddress":"Carrera 3 n.º 12-88","addressLocality":"Villa de Leyva","addressRegion":"Boyacá","addressCountry":"CO"},
 "geo":{"@type":"GeoCoordinates","latitude":5.6xxxx,"longitude":-73.5xxxx},
 "hasMap":"https://www.google.com/maps/…"}
```

**Event principal** (cambios frente al actual):
- `location`: `{"@id":"…/#sede-duruelo"}` (un solo Place; decisión R-06). Si el Rich Results Test acepta sin aviso un arreglo con las dos sedes, se puede volver al arreglo; por defecto, uno.
- `image`: arreglo con la OG de portada (1200×630) y, cuando existan, variantes 4:3 y 1:1 generadas por `brand/og`.
- `offers`: arreglo de `Offer` desde `ticketOffers` filtrado por `availabilityOf()`:
```json
{"@type":"Offer","name":"Pase completo","url":"https://pretix.eventalist.co/eventalist/testigos-memoria/",
 "price":"310000","priceCurrency":"COP","availability":"https://schema.org/InStock",
 "validFrom":"2026-09-09T00:00:00-05:00","validThrough":"2026-10-04T23:59:59-05:00"}
```
  Franjas antes del 5 de octubre: `availability: PreOrder`, `validFrom: 2026-10-05T00:00:00-05:00`, sin `validThrough`. `soldOut` → `SoldOut`. Oferta vencida → omitida.
- `performer`: `Person` con `name`, `description` (credencial), `url` (ficha), `sameAs` (enlaces verificados).
- `subEvent`: uno por `AgendaSlot` con `start`, `end` y `venueId`:
```json
{"@type":"Event","@id":"…/programacion/#bogotazo","name":"Bogotazo, dictadura y Frente Nacional (1958-1974)",
 "url":"…/programacion/#bogotazo","startDate":"2026-11-06T15:30:00-05:00","endDate":"2026-11-06T18:00:00-05:00",
 "location":{"@id":"…/#sede-duruelo"},"superEvent":{"@id":"…/#evento"},
 "performer":[{"@id":"…/panelistas/daniel-samper-pizano/#persona"}],
 "eventStatus":"https://schema.org/EventScheduled"}
```
  Charlas: además `"isAccessibleForFree": true`. Invitados sin ficha: `{"@type":"Person","name":"…"}`. Sin `offers` en subeventos (la boleta es por franja, no por sesión; el pase y las franjas están en el principal).
- Se retira `eventAttendanceMode` (ya no documentado por Google; inocuo, pero se limpia). Se conservan `eventStatus`, `inLanguage`, `organizer`, `description`, `startDate`, `endDate`.

## `/charlas-abiertas/`

`@graph`: Breadcrumb, Event propio:
```json
{"@type":"Event","@id":"…/charlas-abiertas/#evento","name":"Charlas abiertas · Testigos de la Memoria",
 "url":"…/charlas-abiertas/","startDate":"2026-11-05T10:00:00-05:00","endDate":"2026-11-06T12:00:00-05:00",
 "location":{"@type":"Place","@id":"…/#sede-casa-museo",…},"isAccessibleForFree":true,
 "offers":{"@type":"Offer","price":"0","priceCurrency":"COP","availability":"https://schema.org/InStock","url":"…/charlas-abiertas/","validFrom":"2026-09-15T00:00:00-05:00"},
 "superEvent":{"@id":"…/#evento"},"organizer":{"@id":"…/#organizacion"},
 "subEvent":[ …las sesiones type 'charla', mismos @id que en la portada… ],
 "image":["…/og/paginas/charlas-abiertas-v1.png"],"description":"…"}
```
`endDate` de las charlas: fin de la última charla confirmada; si la charla del viernes no tiene hora de fin, se usa el fin de la del jueves más tarde o se pide al organizador (no se inventa).

## `/panelistas/<slug>/`

`@graph`: Breadcrumb, ProfilePage:
```json
{"@type":"ProfilePage","@id":"…/panelistas/<slug>/","dateModified":"<lastmod>",
 "mainEntity":{"@type":"Person","@id":"…/panelistas/<slug>/#persona","name":"…","description":"<credencial>",
   "image":"<foto 4:3 optimizada, URL absoluta>","url":"…/panelistas/<slug>/","sameAs":["…"],
   "performerIn":[{"@id":"…/#evento"},{"@id":"…/programacion/#<sesion>"}]}}
```
La biografía completa va en el HTML; `description` del Person lleva la credencial (corta).

## `/panelistas/`, `/programacion/`, `/como-llegar/`, `/donde-dormir/`

`@graph`: Breadcrumb + `WebPage` con `isPartOf` `{"@id":"…/#sitio"}`, `about` `{"@id":"…/#evento"}`, `dateModified`. La programación no lleva Event propio (Google no admite páginas de listado en el módulo; las sesiones ya están en la portada y en las charlas abiertas).

## BreadcrumbList (toda página interior)

```json
{"@type":"BreadcrumbList","itemListElement":[
 {"@type":"ListItem","position":1,"name":"Inicio","item":"https://testigosdelamemoria.com/"},
 {"@type":"ListItem","position":2,"name":"Panelistas","item":"https://testigosdelamemoria.com/panelistas/"},
 {"@type":"ListItem","position":3,"name":"Daniel Samper Pizano"}]}
```
Se genera desde `routes.ts` (`crumb`, `parent`); el último elemento sin `item`. La miga visible usa el mismo dato.

## Validación

- Rich Results Test sobre `/`, `/charlas-abiertas/`, una ficha y la programación: sin errores; avisos solo por propiedades recomendadas ausentes que se decidan omitir.
- Schema Markup Validator: sin errores de vocabulario (cubre `subEvent`, `geo`, `performerIn`, que Google ignora).
- Aserciones en build (`assertJsonLd()`): todo `@id` referenciado existe en el grafo de esa página; ningún subevento sin `startDate` y `location`; ningún `Offer` con `availability` fuera de `InStock`, `SoldOut`, `PreOrder`.
