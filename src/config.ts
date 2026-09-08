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
 * Mientras sea `false`, la portada muestra "la venta abre pronto" con el
 * formulario de interesados y NO carga el widget. La ruta /demo ignora este
 * valor y muestra la tienda real para probarla; cuando se apruebe, pasar a
 * `true` y borrar /demo.
 */
export const pretixReady = false;

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
 * datos personales (Ley 1581 de 2012). Es el canal público de Eventalist
 * según su guía de integración; aparece en el formulario y en
 * /tratamiento-de-datos/.
 */
export const DATA_CONTACT_EMAIL = 'hola@eventalist.co';

/** Fecha de entrada en vigencia de la política de tratamiento de datos (ISO). */
export const DATA_POLICY_EFFECTIVE = '2026-09-04';

/**
 * Identificación del responsable del tratamiento (art. 13 del Decreto 1377
 * de 2013 exige razón social, domicilio, dirección, correo y teléfono).
 * Los valores que empiecen por TODO no se muestran en la página.
 * Datos entregados por el usuario el 2026-09-04.
 */
export const DATA_CONTROLLER = {
  name: 'Eventalist S.A.S.',
  brand: 'Eventalist',
  address: 'Calle 111 # 45A-70',
  city: 'Bogotá, Colombia',
  phone: '+57 305 840 6091',
} as const;
