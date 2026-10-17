export const ServiceCategory = {
  CUSTOM_SOFTWARE: 'custom-software',
  SAAS: 'saas',
  WEB_APP: 'web-app',
  MOBILE: 'mobile',
  AI: 'ai',
  CLOUD: 'cloud',
  DESIGN: 'design',
  CONSULTING: 'consulting',
  MAINTENANCE: 'maintenance',
  TRAINING: 'training',
} as const;

export type ServiceCategory = (typeof ServiceCategory)[keyof typeof ServiceCategory];
export type ServiceCategoryType = ServiceCategory;
