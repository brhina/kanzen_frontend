import type { SolutionStatus } from '../enums/solution-status.enum';

export interface SolutionSeoMeta {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface SolutionEntity {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  features: string[];
  industries: string[];
  icon?: string;
  coverImage?: string;
  status: SolutionStatus;
  isFeatured: boolean;
  order: number;
  seo?: SolutionSeoMeta;
  createdAt?: string;
  updatedAt?: string;
}
