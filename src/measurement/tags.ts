/**
 * Carga de etiquetas y eventos de navegador (feature 002, contrato
 * measurement-events.md, dictamen legal 2026-09-15; eventos del embudo
 * cambiados en 003, contrato specs/003-embudo-sitio/contracts/widget-tracking.md).
 * Corre en el navegador.
 *
 * - GA4 lo carga el layout en <head> (async) con Consent Mode en `denied`;
 *   aquí se pasa a `granted` al aceptar y se vuelve a `denied` al revocar.
 * - El píxel de Meta SOLO se inyecta tras la aceptación, en idle.
 * - Clic hacia #boletas: `view_item_list` (GA4) y `ViewContent` (Meta).
 *   "Comprar" en el widget: `begin_checkout` (GA4) e `InitiateCheckout`
 *   (Meta), con el mismo eventId. Cada uno una vez por página.
 * - La campaña y los identificadores viajan al widget de Pretix como
 *   data-tracking-* (./attribution.ts); el plugin de Eventalist en Pretix
 *   los usa para atribuir el pedido.
 * - Degradación silenciosa: nada lanza ni escribe errores en consola.
 */
import { measurement } from '../config';
import { CONSENT_EVENT, REVOKE_EVENT, accept, isAccepted, revoke, type ConsentConfig } from './consent';
import { initAttribution } from './attribution';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string; callMethod?: unknown };
    _fbq?: unknown;
  }
}

const cfg: ConsentConfig = { version: measurement.consentVersion };

const GRANTED = {
  analytics_storage: 'granted',
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
};
const DENIED = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};

function gtag(...args: unknown[]): void {
  try {
    if (typeof window.gtag === 'function') window.gtag(...args);
  } catch {
    /* bloqueado */
  }
}

function fbq(...args: unknown[]): void {
  try {
    if (typeof window.fbq === 'function') window.fbq(...args);
  } catch {
    /* bloqueado */
  }
}

let pixelLoaded = false;

/** Snippet oficial de Meta, en función; se llama una sola vez */
function loadPixel(): void {
  if (pixelLoaded || !measurement.metaPixelId) return;
  pixelLoaded = true;
  try {
    const w = window;
    if (!w.fbq) {
      const n = function (...args: unknown[]) {
        if (n.callMethod) (n.callMethod as (...a: unknown[]) => void)(...args);
        else n.queue!.push(args);
      } as NonNullable<Window['fbq']>;
      n.queue = [];
      n.loaded = true;
      n.version = '2.0';
      w.fbq = n;
      w._fbq = n;
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(s);
    }
    fbq('init', measurement.metaPixelId);
    fbq('track', 'PageView');
  } catch {
    /* bloqueado */
  }
}

function whenIdle(fn: () => void): void {
  const run = () => {
    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback(
        fn,
        { timeout: 3000 },
      );
    } else setTimeout(fn, 3000);
  };
  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run, { once: true });
}

function deleteCookie(name: string): void {
  const domain = location.hostname.replace(/^www\./, '');
  for (const d of ['', `; domain=${domain}`, `; domain=.${domain}`]) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`;
  }
}

function clearMeasurementCookies(): void {
  try {
    const names = document.cookie.split(';').map((c) => c.trim().split('=')[0] ?? '');
    for (const n of names) if (/^(_ga|_gid|_gat|_fbp|_fbc)/.test(n)) deleteCookie(n);
  } catch {
    /* nada */
  }
}

/* ---------- Embudo: vio las boletas y pulsó Comprar ---------- */

let listTracked = false;
let checkoutTracked = false;

function eventId(): string {
  return `tdm.${Date.now()}.${Math.random().toString(36).slice(2, 10)}`;
}

/** Clic hacia #boletas, una vez por página */
export function trackViewItemList(): void {
  if (listTracked) return;
  listTracked = true;
  gtag('event', 'view_item_list', { item_list_name: 'boletas' });
  fbq('track', 'ViewContent', { content_name: 'boletas' });
}

/**
 * "Comprar" en el widget, una vez por página. Sin `value`: el valor real lo
 * envía el plugin de Pretix desde el pedido (research R-06 de 003).
 */
export function trackBeginCheckout(): void {
  if (checkoutTracked) return;
  checkoutTracked = true;
  const id = eventId();
  const params = { currency: 'COP' };
  gtag('event', 'begin_checkout', { ...params, event_id: id });
  fbq('track', 'InitiateCheckout', params, { eventID: id });
}

/* ---------- Consentimiento ---------- */

export const consentConfig = cfg;

export function acceptConsent(): Promise<unknown> {
  return accept(cfg);
}

export function revokeConsent(): Promise<void> {
  return revoke(cfg);
}

export function consentAccepted(): boolean {
  return isAccepted(cfg.version);
}

/* ---------- Arranque ---------- */

export function initMeasurement(): void {
  // La campaña viaja aunque GA4 y el píxel estén apagados
  initAttribution();

  const enabled = !!(measurement.ga4Id || measurement.metaPixelId);

  document.addEventListener(CONSENT_EVENT, () => {
    gtag('consent', 'update', GRANTED);
    gtag('event', 'consent_granted', { version: cfg.version });
    whenIdle(loadPixel);
  });
  document.addEventListener(REVOKE_EVENT, () => {
    gtag('consent', 'update', DENIED);
    clearMeasurementCookies();
  });

  if (enabled && consentAccepted()) whenIdle(loadPixel);

  // Botones de compra: primer clic hacia #boletas
  document.addEventListener(
    'click',
    (e) => {
      try {
        const a = (e.target as Element | null)?.closest?.('a[href$="#boletas"]');
        if (a) trackViewItemList();
      } catch {
        /* nada */
      }
    },
    { capture: true },
  );

  // WhatsApp de dudas (WhatsAppLink.astro): cuánta gente se traba al comprar
  document.addEventListener(
    'click',
    (e) => {
      try {
        const a = (e.target as Element | null)?.closest?.('a[data-contact]');
        const where = a?.getAttribute('data-contact');
        if (where) gtag('event', 'contact', { method: 'whatsapp', link_location: where });
      } catch {
        /* nada */
      }
    },
    { capture: true },
  );

  // "Comprar" en el widget: envío nativo (disable-iframe), sin cancelarlo.
  // Solo cuenta el formulario de la tienda, no el de interesados ni el modal.
  document.addEventListener(
    'submit',
    (e) => {
      try {
        const form = e.target;
        if (form instanceof HTMLFormElement && form.closest('.tickets-widget .pretix-widget-wrapper')) {
          trackBeginCheckout();
        }
      } catch {
        /* nada */
      }
    },
    { capture: true },
  );
}
