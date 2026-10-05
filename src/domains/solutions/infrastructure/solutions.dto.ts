import type { SolutionStatus } from '../domain/enums/solution-status.enum';
import type { SolutionSeoMeta } from '../domain/entities/solution.entity';

export interface SolutionResponseDto {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  features?: string[];
  industries?: string[];
  icon?: string;
  coverImage?: string;
  status?: SolutionStatus;
  isFeatured?: boolean;
  order?: number;
  seo?: SolutionSeoMeta;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSolutionDto {
  name: string;
  slug?: string;
  tagline: string;
  description: string;
  features?: string[];
  industries?: string[];
  icon?: string;
  coverImage?: string;
  status?: SolutionStatus;
  isFeatured?: boolean;
  order?: number;
  seo?: SolutionSeoMeta;
}

export type UpdateSolutionDto = Partial<CreateSolutionDto>;

export interface FilterSolutionsDto {
  industry?: string;
  status?: SolutionStatus | string;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedSolutionsResponseDto {
  data: SolutionResponseDto[];
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
