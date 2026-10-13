/**
 * Campaña de la visita e identificadores para el widget de Pretix (feature
 * 003, contrato specs/003-embudo-sitio/contracts/widget-tracking.md; diseño
 * en docs/medicion-embudo/diseno.md). Corre en el navegador.
 *
 * - La campaña de la última visita (UTM, página de llegada y dominio de
 *   referencia) se guarda en localStorage hasta por 30 días, y nunca después
 *   del fin del evento (measurement.attributionDays y attributionUntil;
 *   decisión del 2026-10-12, docs/medicion-embudo/diseno.md). gclid y fbclid
 *   pasan a localStorage solo con el aviso de cookies aceptado; sin él viven
 *   en sessionStorage de la pestaña, como antes. Nada de cookies propias.
 * - Las UTM, la página de llegada y el dominio de referencia viajan siempre.
 *   gclid y los identificadores de GA4 y Meta, solo con el aviso de cookies
 *   aceptado.
 * - Se escriben como data-tracking-* en el widget; Pretix los guarda en el
 *   carrito como widget_data y el plugin de Eventalist los copia al pedido.
 * - Un valor solo se escribe si es texto no vacío: el plugin ignora el null
 *   de JSON pero enviaría las cadenas "null" o "undefined" como datos.
 * - Nada espera ni cancela nada del widget. Degradación silenciosa.
 */
import { measurement } from '../config';
import { CONSENT_EVENT, REVOKE_EVENT, isAccepted } from './consent';

const KEY = 'tdm.attribution';
const MAX = 200;
const PREFIX = 'data-tracking-';
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'] as const;
type Param = (typeof PARAMS)[number];
/** Identificadores de clic: entre visitas solo con cookies aceptadas */
const CLICK_IDS = ['gclid', 'fbclid'] as const;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Volver de la tienda o de la pasarela no es una fuente de la visita */
const IGNORED_REFERRERS = ['pretix.eventalist.co', 'checkout.wompi.co'];

export type Attribution = Partial<Record<Param, string>> & {
  landing: string;
  capturedAt: number;
  /** Solo el dominio desde el que se llegó, sin ruta ni consulta */
  referrer?: string;
};

interface VisitIds {
  gclid?: string;
  gaId?: string;
  gaSessId?: string;
  fbp?: string;
  fbc?: string;
}

/** Texto no vacío tras trim, recortado; cualquier otra cosa es "sin valor" */
function clean(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t ? t.slice(0, MAX) : undefined;
}

/* ---------- Captura de la campaña ---------- */

/** Vence a los attributionDays de capturada o al terminar el evento, lo que llegue antes */
function expired(capturedAt: number): boolean {
  const now = Date.now();
  const until = Date.parse(measurement.attributionUntil);
  return now - capturedAt > measurement.attributionDays * DAY_MS || (!Number.isNaN(until) && now >= until);
}

function read(store: Storage): Attribution | null {
  try {
    const raw = store.getItem(KEY);
    if (!raw) return null;
    const v: unknown = JSON.parse(raw);
    if (!v || typeof v !== 'object') return null;
    const o = v as Record<string, unknown>;
    const landing = clean(o.landing);
    if (!landing || typeof o.capturedAt !== 'number') return null;
    if (expired(o.capturedAt)) {
      store.removeItem(KEY);
      return null;
    }
    const a: Attribution = { landing, capturedAt: o.capturedAt };
    for (const p of PARAMS) {
      const c = clean(o[p]);
      if (c) a[p] = c;
    }
    const r = clean(o.referrer);
    if (r) a.referrer = r;
    return a;
  } catch {
    return null;
  }
}

/** La pestaña tiene la copia completa; entre visitas, la del navegador */
function fromStorage(): Attribution | null {
  try {
    return read(sessionStorage) ?? read(localStorage);
  } catch {
    return null;
  }
}

/**
 * La pestaña guarda todo. El navegador guarda gclid y fbclid solo con las
 * cookies aceptadas; al terminar el evento no guarda nada y borra lo que haya.
 */
function save(a: Attribution): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* sin almacenamiento: se trabaja en memoria con la URL de esta página */
  }
  try {
    if (expired(a.capturedAt)) {
      localStorage.removeItem(KEY);
      return;
    }
    const kept: Attribution = { ...a };
    if (!accepted()) for (const p of CLICK_IDS) delete kept[p];
    localStorage.setItem(KEY, JSON.stringify(kept));
  } catch {
    /* sin almacenamiento persistente: queda la copia de la pestaña */
  }
}

let current: Attribution | null = null;

function bareHost(host: string): string {
  const h = host.toLowerCase();
  return h.startsWith('www.') ? h.slice(4) : h;
}

/** Dominio externo de document.referrer, o nada si es el propio sitio o la compra */
function externalReferrer(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const host = bareHost(new URL(document.referrer).hostname);
    if (!host || host === bareHost(location.hostname) || IGNORED_REFERRERS.includes(host)) return undefined;
    return clean(host);
  } catch {
    return undefined;
  }
}

function hasCampaign(a: Attribution): boolean {
  return PARAMS.some((p) => a[p] !== undefined);
}

/**
 * Reglas de data-model.md: gana la última llegada con campaña; una llegada
 * desde otro sitio sin campaña solo reemplaza una visita que tampoco la tenía,
 * para que lo orgánico no borre lo pagado.
 */
export function captureAttribution(): Attribution {
  const fresh: Attribution = { landing: location.pathname.slice(0, MAX) || '/', capturedAt: Date.now() };
  const referrer = externalReferrer();
  if (referrer) fresh.referrer = referrer;
  let hasParams = false;
  try {
    const q = new URLSearchParams(location.search);
    for (const p of PARAMS) {
      const c = clean(q.get(p));
      if (c) {
        fresh[p] = c;
        hasParams = true;
      }
    }
  } catch {
    /* URL ilegible: sin campaña */
  }
  if (hasParams) {
    save(fresh);
    current = fresh;
    return fresh;
  }
  const stored = fromStorage();
  if (stored && !(referrer && !hasCampaign(stored))) {
    current = stored;
    return stored;
  }
  save(fresh);
  current = fresh;
  return fresh;
}

/* ---------- Identificadores de la visita (solo con aceptación) ---------- */

let gaId: string | undefined;
let gaSessId: string | undefined;
let gaAsked = false;

function accepted(): boolean {
  return isAccepted(measurement.consentVersion);
}

function cookie(name: string): string | undefined {
  try {
    for (const part of document.cookie.split(';')) {
      const i = part.indexOf('=');
      if (i < 0) continue;
      if (part.slice(0, i).trim() === name) return clean(decodeURIComponent(part.slice(i + 1)));
    }
  } catch {
    /* cookies bloqueadas */
  }
  return undefined;
}

/** gtag puede responder texto, número o undefined: solo se aceptan valores reales */
function gaValue(v: unknown): string | undefined {
  if (typeof v === 'number') return Number.isFinite(v) ? clean(v.toString()) : undefined;
  return clean(v);
}

/**
 * Nada espera la respuesta: llega cuando llegue y se sincroniza. Si a los 2 s
 * no ha llegado (gtag.js lento o bloqueado), la próxima sincronización por
 * interacción vuelve a preguntar.
 */
function askGa(field: 'client_id' | 'session_id', set: (v: string) => void): void {
  try {
    if (!measurement.ga4Id || typeof window.gtag !== 'function') return;
    let answered = false;
    window.gtag('get', measurement.ga4Id, field, (v: unknown) => {
      const c = gaValue(v);
      if (!c || !accepted()) return;
      answered = true;
      set(c);
      syncWidgetAttributes();
    });
    setTimeout(() => {
      if (!answered) gaAsked = false;
    }, 2000);
  } catch {
    /* gtag bloqueado */
  }
}

function requestGaIds(): void {
  if (gaAsked || !accepted()) return;
  gaAsked = true;
  askGa('client_id', (v) => (gaId = v));
  askGa('session_id', (v) => (gaSessId = v));
}

function visitIds(a: Attribution): VisitIds | null {
  if (!accepted()) return null;
  const ids: VisitIds = { gclid: a.gclid, gaId, gaSessId, fbp: cookie('_fbp'), fbc: cookie('_fbc') };
  if (!ids.fbc && a.fbclid) ids.fbc = clean(`fb.1.${a.capturedAt}.${a.fbclid}`);
  return ids;
}

/* ---------- Atributos del widget ---------- */

export function desiredAttributes(a: Attribution, ids: VisitIds | null): Map<string, string> {
  const out = new Map<string, string>();
  const put = (name: string, v: unknown) => {
    const c = clean(v);
    if (c) out.set(PREFIX + name, c);
  };
  put('utm-source', a.utm_source);
  put('utm-medium', a.utm_medium);
  put('utm-campaign', a.utm_campaign);
  put('utm-content', a.utm_content);
  put('utm-term', a.utm_term);
  put('landing', a.landing);
  put('referrer', a.referrer);
  if (ids) {
    put('gclid', ids.gclid);
    put('ga-id', ids.gaId);
    put('ga-sessid', ids.gaSessId);
    put('fbp', ids.fbp);
    put('fbc', ids.fbc);
    put('consent', '1');
  }
  return out;
}

/** El widget construido ya no tiene <pretix-widget>: Vue lo cambia por el wrapper */
function widgetTarget(): Element | null {
  return (
    document.querySelector('.tickets-widget .pretix-widget-wrapper') ??
    document.querySelector('.tickets-widget pretix-widget')
  );
}

export function syncWidgetAttributes(): void {
  try {
    requestGaIds();
    const el = widgetTarget();
    if (!el) return;
    const a = current ?? captureAttribution();
    const want = desiredAttributes(a, visitIds(a));
    for (const [name, value] of want) {
      if (el.getAttribute(name) !== value) el.setAttribute(name, value);
    }
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith(PREFIX) && !want.has(attr.name)) el.removeAttribute(attr.name);
    }
  } catch {
    /* el widget sigue igual */
  }
}

/* ---------- Arranque ---------- */

export function initAttribution(): void {
  try {
    captureAttribution();
    requestGaIds();
    syncWidgetAttributes();

    const box = document.querySelector('.tickets-widget');
    if (box) {
      if (!box.querySelector('.pretix-widget-wrapper')) {
        const mo = new MutationObserver(() => {
          if (!box.querySelector('.pretix-widget-wrapper')) return;
          mo.disconnect();
          syncWidgetAttributes();
        });
        mo.observe(box, { childList: true, subtree: true });
      }
      const resync = () => syncWidgetAttributes();
      box.addEventListener('pointerdown', resync, { capture: true, passive: true });
      box.addEventListener('focusin', resync, { capture: true });
    }
    document.addEventListener('submit', () => syncWidgetAttributes(), { capture: true });

    /* Aceptar o retirar las cookies cambia qué guarda el navegador entre visitas */
    document.addEventListener(CONSENT_EVENT, () => {
      if (current) save(current);
      gaAsked = false;
      requestGaIds();
      syncWidgetAttributes();
    });
    document.addEventListener(REVOKE_EVENT, () => {
      if (current) save(current);
      gaId = undefined;
      gaSessId = undefined;
      gaAsked = false;
      syncWidgetAttributes();
    });
  } catch {
    /* sin atribución, la página sigue igual */
  }
}
