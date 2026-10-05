export const APP_CONFIG = {
  name: 'KANZEN TECH',
  tagline: 'High-Impact Engineering, Enterprise Architecture & AI Solutions',
  version: '1.0.0',
  defaultLocale: 'en',
  supportEmail: 'contact@kanzen.tech',
} as const;

export const STORAGE_KEYS = {
  auth: 'kanzen_auth_session',
  ui: 'kanzen_ui_state',
  theme: 'kanzen_theme',
  locale: 'kanzen_locale',
} as const;

export const PAGINATION_DEFAULTS = {
  defaultPage: 1,
  defaultLimit: 10,
  pageSizeOptions: [10, 20, 50, 100] as const,
} as const;

export const QUERY_CONFIG = {
  defaultStaleTime: 5 * 60 * 1000, // 5 minutes
  defaultGcTime: 10 * 60 * 1000,   // 10 minutes
  defaultRetryCount: 1,
} as const;

export const NETWORK_CONFIG = {
  timeoutMs: 30000,
  maxRetries: 1,
} as const;
