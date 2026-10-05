import type { ServiceCategory } from '../enums/service-category.enum';
import type { PricingModel } from '../enums/pricing-model.enum';
import type { ServiceItemStatus } from '../enums/service-status.enum';

export interface ServiceSeoMeta {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface ServiceEntity {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  shortDescription: string;
  icon?: string;
  coverImage?: string;
  category: ServiceCategory;
  features: string[];
  deliverables: string[];
  technologies: string[];
  startingPrice?: number;
  pricingModel?: PricingModel;
  estimatedTimeline?: string;
  order: number;
  isFeatured: boolean;
  status: ServiceItemStatus;
  seo?: ServiceSeoMeta;
  createdAt?: string;
  updatedAt?: string;
}
