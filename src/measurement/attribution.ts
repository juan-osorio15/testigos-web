/**
 * Origen de la visita y su paso al widget de Pretix (feature 002,
 * contrato pretix-attribution.md §1). Corre en el navegador.
 *
 * Captura utm_*, fbclid y gclid de la URL, construye `fbc` a partir de
 * fbclid con el formato oficial de Meta, lee las cookies _fbp/_fbc que crea
 * el píxel y pide a gtag el client_id y el session_id de GA4 (tope de 2 s).
 * Todo se pone como atributos `data-tracking-*` en <pretix-widget>: Pretix
 * los conserva en el carrito y el plugin de Eventalist los copia al pedido.
 */

export interface Attribution {
  utm: Partial<Record<'source' | 'medium' | 'campaign' | 'content' | 'term', string>>;
  fbclid?: string;
  gclid?: string;
  landing: string;
  firstSeen: string;
}

const KEY = 'tdm.attribution';
const MAX_AGE_DAYS = 90;
const UTM_KEYS = ['source', 'medium', 'campaign', 'content', 'term'] as const;

function read(): Attribution | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const a = JSON.parse(raw) as Attribution;
    const age = (Date.now() - Date.parse(a.firstSeen)) / 86_400_000;
    return age <= MAX_AGE_DAYS ? a : null;
  } catch {
    return null;
  }
}

function write(a: Attribution): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* sin almacenamiento: solo dura esta página */
  }
}

/** Lee la URL actual; si trae parámetros nuevos, sobrescribe lo guardado */
export function captureAttribution(): Attribution | null {
  let fromUrl: Attribution | null = null;
  try {
    const p = new URLSearchParams(location.search);
    const utm: Attribution['utm'] = {};
    for (const k of UTM_KEYS) {
      const v = p.get(`utm_${k}`);
      if (v) utm[k] = v.slice(0, 200);
    }
    const fbclid = p.get('fbclid') ?? undefined;
    const gclid = p.get('gclid') ?? undefined;
    if (Object.keys(utm).length || fbclid || gclid) {
      fromUrl = {
        utm,
        ...(fbclid ? { fbclid: fbclid.slice(0, 500) } : {}),
        ...(gclid ? { gclid: gclid.slice(0, 500) } : {}),
        landing: location.pathname,
        firstSeen: new Date().toISOString(),
      };
    }
  } catch {
    /* URL ilegible: seguimos con lo guardado */
  }
  if (fromUrl) {
    write(fromUrl);
    return fromUrl;
  }
  return read();
}

export function cookie(name: string): string | undefined {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return m ? decodeURIComponent(m[1]!) : undefined;
  } catch {
    return undefined;
  }
}

/** `fb.1.<ms>.<fbclid>`: formato oficial cuando el píxel no creó la cookie */
function buildFbc(a: Attribution | null): string | undefined {
  const fromCookie = cookie('_fbc');
  if (fromCookie) return fromCookie;
  if (a?.fbclid) return `fb.1.${Date.parse(a.firstSeen) || Date.now()}.${a.fbclid}`;
  return undefined;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtagGet(ga4Id: string, field: 'client_id' | 'session_id', timeoutMs: number): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (!ga4Id || typeof window.gtag !== 'function') return resolve(undefined);
    const timer = setTimeout(() => resolve(undefined), timeoutMs);
    try {
      window.gtag('get', ga4Id, field, (value: unknown) => {
        clearTimeout(timer);
        resolve(value == null ? undefined : String(value));
      });
    } catch {
      clearTimeout(timer);
      resolve(undefined);
    }
  });
}

export type TrackingData = Record<string, string>;

/** Todo lo que viaja al widget; los valores vacíos se omiten */
export async function collectTrackingData(ga4Id: string, timeoutMs = 2000): Promise<TrackingData> {
  const a = captureAttribution();
  const [clientId, sessionId] = await Promise.all([
    gtagGet(ga4Id, 'client_id', timeoutMs),
    gtagGet(ga4Id, 'session_id', timeoutMs),
  ]);
  const data: Record<string, string | undefined> = {
    'ga-id': clientId,
    'ga-sessid': sessionId,
    fbp: cookie('_fbp'),
    fbc: buildFbc(a),
    gclid: a?.gclid,
    'utm-source': a?.utm.source,
    'utm-medium': a?.utm.medium,
    'utm-campaign': a?.utm.campaign,
    'utm-content': a?.utm.content,
    'utm-term': a?.utm.term,
    landing: a?.landing,
  };
  const out: TrackingData = {};
  for (const [k, v] of Object.entries(data)) if (v) out[k] = v;
  return out;
}

export function applyTrackingToWidgets(data: TrackingData): void {
  document.querySelectorAll<HTMLElement>('pretix-widget').forEach((el) => {
    for (const [k, v] of Object.entries(data)) el.setAttribute(`data-tracking-${k}`, v);
  });
}
