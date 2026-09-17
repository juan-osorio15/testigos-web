/**
 * Carga de etiquetas y eventos de navegador (feature 002, contrato
 * measurement-events.md, dictamen legal 2026-09-15). Corre en el navegador.
 *
 * - GA4 lo carga el layout en <head> (async) con Consent Mode en `denied`;
 *   aquí se pasa a `granted` al aceptar y se vuelve a `denied` al revocar.
 * - El píxel de Meta SOLO se inyecta tras la aceptación, en idle.
 * - `begin_checkout` (GA4) e `InitiateCheckout` (Meta) comparten eventId.
 * - Degradación silenciosa: nada lanza ni escribe errores en consola.
 * - Nada viaja al widget de Pretix ni a ningún servidor propio: la
 *   atribución de compras en el servidor se retiró el 2026-09-17.
 */
import { measurement } from '../config';
import { CONSENT_EVENT, REVOKE_EVENT, accept, isAccepted, revoke, type ConsentConfig } from './consent';

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

/* ---------- Intención de compra ---------- */

let checkoutTracked = false;

function eventId(): string {
  return `tdm.${Date.now()}.${Math.random().toString(36).slice(2, 10)}`;
}

/** Una vez por página; `value` solo si se conoce (nunca inventado) */
export function trackBeginCheckout(value?: number): void {
  if (checkoutTracked) return;
  checkoutTracked = true;
  const id = eventId();
  const params: Record<string, unknown> = { currency: 'COP' };
  if (typeof value === 'number' && value > 0) params.value = value;
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
      const a = (e.target as Element | null)?.closest?.('a[href$="#boletas"]');
      if (a) trackBeginCheckout();
    },
    { capture: true },
  );
}
