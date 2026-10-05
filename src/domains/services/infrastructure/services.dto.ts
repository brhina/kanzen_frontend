import type { ServiceCategory } from '../domain/enums/service-category.enum';
import type { PricingModel } from '../domain/enums/pricing-model.enum';
import type { ServiceItemStatus } from '../domain/enums/service-status.enum';
import type { ServiceSeoMeta } from '../domain/entities/service.entity';

export interface ServiceItemResponseDto {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  shortDescription: string;
  icon?: string;
  coverImage?: string;
  category: ServiceCategory;
  features?: string[];
  deliverables?: string[];
  technologies?: string[];
  startingPrice?: number;
  pricingModel?: PricingModel;
  estimatedTimeline?: string;
  order?: number;
  isFeatured?: boolean;
  status?: ServiceItemStatus;
  seo?: ServiceSeoMeta;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServiceDto {
  name: string;
  slug?: string;
  tagline: string;
  description: string;
  shortDescription: string;
  icon?: string;
  coverImage?: string;
  category: ServiceCategory;
  features?: string[];
  deliverables?: string[];
  technologies?: string[];
  startingPrice?: number;
  pricingModel?: PricingModel;
  estimatedTimeline?: string;
  order?: number;
  isFeatured?: boolean;
  status?: ServiceItemStatus;
  seo?: ServiceSeoMeta;
}

export type UpdateServiceDto = Partial<CreateServiceDto>;

export interface FilterServicesDto {
  category?: ServiceCategory | string;
  status?: ServiceItemStatus | string;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedServicesResponseDto {
  data: ServiceItemResponseDto[];
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
