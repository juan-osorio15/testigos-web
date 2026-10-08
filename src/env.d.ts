/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Solo pruebas locales: URL de un evento de Pretix de ensayo (ver src/config.ts) */
  readonly PUBLIC_PRETIX_EVENT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
