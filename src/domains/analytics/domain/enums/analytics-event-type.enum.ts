export const AnalyticsEventType = {
  PAGE_VIEW: 'page_view',
  CTA_CLICK: 'cta_click',
  LEAD_SUBMIT: 'lead_submit',
  CONSULTATION_BOOK: 'consultation_book',
  NEWSLETTER_SUBSCRIBE: 'newsletter_subscribe',
  FILE_DOWNLOAD: 'file_download',
  CUSTOM: 'custom',
} as const;

export type AnalyticsEventType = (typeof AnalyticsEventType)[keyof typeof AnalyticsEventType];
export type AnalyticsEventTypeValue = AnalyticsEventType;
