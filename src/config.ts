/**
 * Configuración del sitio. Único lugar donde vive la integración con Pretix.
 * Contrato: specs/001-event-landing/contracts/pretix-embed.md
 */

export const SITE_URL = 'https://testigosdelamemoria.com';

/**
 * URL del evento en Pretix (formato: https://pretix.eu/<organizador>/<evento>/).
 * TODO-PRETIX-URL: reemplazar cuando el organizador entregue la tienda real.
 */
export const PRETIX_EVENT_URL = 'TODO-PRETIX-URL';

/**
 * Mientras sea `false`, la sección de compra muestra "la venta abre pronto"
 * y NO carga widget ni enlaces. Pasar a `true` SOLO junto con la URL real.
 */
export const pretixReady = false;

/**
 * Endpoint del formulario "avísame cuando abra la venta" (visible solo
 * mientras pretixReady sea false). Acepta un POST estándar con los campos
 * name, email, phone. Compatible con listmonk (open source, recomendado),
 * Formbricks, Formspree o Web3Forms.
 * TODO-WAITLIST-ENDPOINT: mientras tenga este valor, el formulario se
 * muestra con el botón deshabilitado y una nota.
 */
export const WAITLIST_ENDPOINT = 'TODO-WAITLIST-ENDPOINT';
export const waitlistReady = !WAITLIST_ENDPOINT.startsWith('TODO');
