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
