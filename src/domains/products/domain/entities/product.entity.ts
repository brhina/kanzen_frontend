import type { ProductCategory } from '../enums/product-category.enum';
import type { ProductStatus } from '../enums/product-status.enum';

export interface ProductSeoMeta {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface ProductEntity {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo?: string;
  screenshots: string[];
  productUrl?: string;
  demoUrl?: string;
  pricingUrl?: string;
  category: ProductCategory;
  techStack: string[];
  status: ProductStatus;
  isFeatured: boolean;
  order: number;
  launchedAt?: string;
  seo?: ProductSeoMeta;
  createdAt?: string;
  updatedAt?: string;
}
