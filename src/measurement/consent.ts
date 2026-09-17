/**
 * Estado del aviso de cookies (feature 002, contrato measurement-events.md,
 * dictamen legal 2026-09-15). Corre en el navegador.
 *
 * - Solo "Aceptar" acepta. Cerrar, ignorar o navegar no cambian nada.
 * - La aceptación se guarda en el navegador del visitante (variante B del
 *   dictamen legal): identificador aleatorio, versión, alcance y fechas.
 *   Sin registro en servidor (capa retirada el 2026-09-17).
 * - Todo acceso a localStorage va en try/catch: sin almacenamiento el
 *   aviso se oculta para la sesión y no se carga el píxel.
 */

export interface ConsentState {
  id: string;
  version: string;
  scope: string[];
  acceptedAt: string | null;
  revokedAt?: string;
}

export interface ConsentConfig {
  version: string;
}

const KEY = 'tdm.consent';
const DISMISSED_KEY = 'tdm.consent.dismissed';
export const SCOPE = ['analytics', 'advertising'];

export const CONSENT_EVENT = 'tdm:consent';
export const REVOKE_EVENT = 'tdm:revoke';

function read(): ConsentState | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}

function write(state: ConsentState | null): boolean {
  try {
    if (state) localStorage.setItem(KEY, JSON.stringify(state));
    else localStorage.removeItem(KEY);
    return true;
  } catch {
    return false;
  }
}

export function storageAvailable(): boolean {
  try {
    const k = 'tdm.test';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function getConsent(): ConsentState | null {
  return read();
}

/** Aceptación vigente para esta versión del aviso */
export function isAccepted(version: string): boolean {
  const s = read();
  return !!s && s.version === version && !!s.acceptedAt;
}

export function wasDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

export function dismiss(): void {
  try {
    sessionStorage.setItem(DISMISSED_KEY, '1');
  } catch {
    /* sin almacenamiento: el aviso vuelve en la siguiente carga */
  }
}

function uuid(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  } catch {
    /* fallback */
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export async function accept(cfg: ConsentConfig): Promise<ConsentState> {
  const state: ConsentState = {
    id: uuid(),
    version: cfg.version,
    scope: [...SCOPE],
    acceptedAt: new Date().toISOString(),
  };
  write(state);
  document.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
  return state;
}

export async function revoke(cfg: ConsentConfig): Promise<void> {
  const prev = read();
  const state: ConsentState = {
    id: prev?.id ?? uuid(),
    version: prev?.version ?? cfg.version,
    scope: prev?.scope ?? [...SCOPE],
    acceptedAt: null,
    revokedAt: new Date().toISOString(),
  };
  write(state);
  document.dispatchEvent(new CustomEvent(REVOKE_EVENT, { detail: state }));
}
