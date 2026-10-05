export const ProductStatus = {
  COMING_SOON: 'coming-soon',
  BETA: 'beta',
  LIVE: 'live',
  RETIRED: 'retired',
} as const;

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];
export type ProductStatusType = ProductStatus;
