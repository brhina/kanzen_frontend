export const PricingModel = {
  FIXED: 'fixed',
  HOURLY: 'hourly',
  RETAINER: 'retainer',
  CUSTOM: 'custom',
} as const;

export type PricingModel = (typeof PricingModel)[keyof typeof PricingModel];
export type PricingModelType = PricingModel;
