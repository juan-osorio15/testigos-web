/**
 * Campaña de la visita e identificadores para el widget de Pretix (feature
 * 003, contrato specs/003-embudo-sitio/contracts/widget-tracking.md; diseño
 * en docs/medicion-embudo/diseno.md). Corre en el navegador.
 *
 * - La campaña (UTM, gclid, fbclid y página de llegada) vive solo en
 *   sessionStorage de la pestaña. Nada de localStorage ni cookies propias.
 * - Las UTM y la página de llegada viajan siempre. gclid y los
 *   identificadores de GA4 y Meta, solo con el aviso de cookies aceptado.
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

export type Attribution = Partial<Record<Param, string>> & {
  landing: string;
  capturedAt: number;
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

function fromStorage(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const v: unknown = JSON.parse(raw);
    if (!v || typeof v !== 'object') return null;
    const o = v as Record<string, unknown>;
    const landing = clean(o.landing);
    if (!landing || typeof o.capturedAt !== 'number') return null;
    const a: Attribution = { landing, capturedAt: o.capturedAt };
    for (const p of PARAMS) {
      const c = clean(o[p]);
      if (c) a[p] = c;
    }
    return a;
  } catch {
    return null;
  }
}

function save(a: Attribution): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* sin almacenamiento: se trabaja en memoria con la URL de esta página */
  }
}

let current: Attribution | null = null;

/** Reglas de data-model.md: gana la última campaña de la pestaña */
export function captureAttribution(): Attribution {
  const fresh: Attribution = { landing: location.pathname.slice(0, MAX) || '/', capturedAt: Date.now() };
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
  if (stored) {
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

    document.addEventListener(CONSENT_EVENT, () => {
      gaAsked = false;
      requestGaIds();
      syncWidgetAttributes();
    });
    document.addEventListener(REVOKE_EVENT, () => {
      gaId = undefined;
      gaSessId = undefined;
      gaAsked = false;
      syncWidgetAttributes();
    });
  } catch {
    /* sin atribución, la página sigue igual */
  }
}
