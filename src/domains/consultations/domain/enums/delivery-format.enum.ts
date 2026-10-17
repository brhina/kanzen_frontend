export const DeliveryFormat = {
  VIRTUAL_INTERACTIVE: 'virtual_interactive',
  ON_SITE_INTENSIVE: 'on_site_intensive',
  HYBRID: 'hybrid',
} as const;

export type DeliveryFormat =
  (typeof DeliveryFormat)[keyof typeof DeliveryFormat];
