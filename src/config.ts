/**
 * Configuración del sitio. Único lugar donde vive la integración con Pretix.
 * Contrato: specs/001-event-landing/contracts/pretix-embed.md
 */

export const SITE_URL = 'https://testigosdelamemoria.com';

/**
 * Tienda real del evento en la instancia de Pretix de Eventalist (entregada
 * el 2026-09-07). Widget v2 en español; el CSS lo sirve el propio evento.
 */
export const PRETIX_EVENT_URL = 'https://pretix.eventalist.co/eventalist/testigos-memoria/';
export const PRETIX_WIDGET_SCRIPT = 'https://pretix.eventalist.co/widget/v2.es.js';
export const PRETIX_WIDGET_CSS = `${PRETIX_EVENT_URL}widget/v2.css`;

/**
 * INTERRUPTOR DE LA TIENDA. Único punto que decide qué ve el público en la
 * sección "Asegura tu lugar":
 *
 *   true  → tienda real de Pretix (widget en la portada, oferta en JSON-LD).
 *   false → "la venta abre pronto" con el formulario de interesados; el
 *           widget ni se carga.
 *
 * Si la tienda falla en producción: cambiar a `false`, commit y push a
 * main. El formulario vuelve sin dejar hueco (todo su código sigue aquí).
 * Solo se lee en TicketSection.astro y EventLayout.astro.
 */
export const pretixReady = true;

/**
 * Medición (feature 002, contrato measurement-events.md). Con `ga4Id` y
 * `metaPixelId` vacíos el HTML publicado no contiene ninguna referencia a
 * Google ni a Meta: así se despliega el resto de la feature sin cuentas.
 *
 * Reglas del dictamen legal del 2026-09-15: el píxel de Meta solo carga
 * después de que el visitante pulsa "Aceptar" en el aviso de cookies; GA4
 * carga antes pero en Consent Mode sin cookies hasta la aceptación. No hay
 * interruptor para cargar el píxel antes: no es defendible.
 */
export const measurement = {
  /** ID de medición de GA4 ('G-XXXXXXXXXX'); vacío → no se carga gtag */
  ga4Id: '',
  /** ID del conjunto de datos (píxel) de Meta; vacío → no se carga fbevents */
  metaPixelId: '',
  /** Versión del aviso de cookies; cambiarla vuelve a mostrarlo */
  consentVersion: '2026-09',
  /** Registro de aceptaciones en el backend de Eventalist; vacío → solo navegador (variante B de la política) */
  consentEndpoint: '',
  /** Verificación de dominio de Meta por etiqueta; vacío si se verifica por DNS */
  metaDomainVerification: '',
} as const;

/**
 * Formulario "avísame cuando abra la venta" (visible solo mientras
 * pretixReady sea false). Envía los contactos a Eventalist según su guía
 * de integración: POST JSON a /api/v1/marketing/contacts/submit/ con el
 * slug de campaña. El origen del sitio debe estar registrado en Eventalist
 * (si todo devuelve 403, es eso).
 */
export const EVENTALIST_BACKEND = 'https://eventalist-backend-production.up.railway.app';
export const EVENTALIST_CAMPAIGN = 'testigos-de-la-memoria-2026';
export const WAITLIST_ENDPOINT = `${EVENTALIST_BACKEND}/api/v1/marketing/contacts/submit/`;
export const waitlistReady = EVENTALIST_CAMPAIGN.length > 0;

/**
 * Correo para retirar la autorización y para consultas y reclamos sobre
 * datos personales (Ley 1581 de 2012) y canal único de atención al comprador
 * (Ley 1480 de 2011). Es el canal público de Eventalist según su guía de
 * integración; aparece en el formulario, en /tratamiento-de-datos/ y en
 * /terminos-y-condiciones/.
 */
export const DATA_CONTACT_EMAIL = 'hola@eventalist.co';

/**
 * Fecha de entrada en vigencia de la política de tratamiento de datos (ISO).
 * 2026-09-14: ampliación a la tienda de boletería y al control de ingreso.
 * 2026-09-21: sección 10 (cookies, medición y atribución de compras).
 * DEBE coincidir con el día de la publicación 1; ajustar si cambia.
 */
export const DATA_POLICY_EFFECTIVE = '2026-09-21';

/** Fecha de entrada en vigencia de los términos y condiciones de compra (ISO). Igual que la política. */
export const TERMS_EFFECTIVE = '2026-09-21';

/**
 * Responsable del tratamiento. Solo razón social y nombre comercial: por
 * decisión del titular (2026-09-14) el sitio no publica dirección ni
 * teléfono; el único canal es DATA_CONTACT_EMAIL.
 */
export const DATA_CONTROLLER = {
  name: 'Eventalist S.A.S.',
  brand: 'Eventalist',
} as const;
