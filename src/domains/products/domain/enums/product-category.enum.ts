export const ProductCategory = {
  SAAS: 'saas',
  TOOL: 'tool',
  LIBRARY: 'library',
  TEMPLATE: 'template',
} as const;

export type ProductCategory = (typeof ProductCategory)[keyof typeof ProductCategory];
export type ProductCategoryType = ProductCategory;
