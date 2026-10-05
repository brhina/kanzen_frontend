export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;

export const TOAST_DURATION = {
  short: 3000,
  normal: 5000,
  long: 8000,
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
