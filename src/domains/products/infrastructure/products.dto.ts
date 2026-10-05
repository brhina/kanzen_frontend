import type { ProductCategory } from '../domain/enums/product-category.enum';
import type { ProductStatus } from '../domain/enums/product-status.enum';
import type { ProductSeoMeta } from '../domain/entities/product.entity';

export interface ProductResponseDto {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo?: string;
  screenshots?: string[];
  productUrl?: string;
  demoUrl?: string;
  pricingUrl?: string;
  category: ProductCategory;
  techStack?: string[];
  status?: ProductStatus;
  isFeatured?: boolean;
  order?: number;
  launchedAt?: string;
  seo?: ProductSeoMeta;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  slug?: string;
  tagline: string;
  description: string;
  logo?: string;
  screenshots?: string[];
  productUrl?: string;
  demoUrl?: string;
  pricingUrl?: string;
  category: ProductCategory;
  techStack?: string[];
  status?: ProductStatus;
  isFeatured?: boolean;
  order?: number;
  launchedAt?: string;
  seo?: ProductSeoMeta;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface FilterProductsDto {
  category?: ProductCategory | string;
  status?: ProductStatus | string;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProductsResponseDto {
  data: ProductResponseDto[];
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
