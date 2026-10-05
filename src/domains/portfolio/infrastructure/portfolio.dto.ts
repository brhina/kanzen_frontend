import type { PortfolioCategory } from '../domain/enums/portfolio-category.enum';
import type { PortfolioItemStatus } from '../domain/enums/portfolio-status.enum';

export interface ProjectMetricDto {
  label: string;
  value: string;
  icon?: string;
}

export interface SeoMetaDto {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface CreatePortfolioDto {
  title: string;
  slug?: string;
  subtitle?: string;
  client?: string;
  clientLogo?: string;
  description: string;
  challenge?: string;
  solution?: string;
  results?: string;
  coverImage: string;
  images?: string[];
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  category: PortfolioCategory;
  services?: string[];
  technologies?: string[];
  teamSize?: number;
  duration?: string;
  completedAt?: string;
  isFeatured?: boolean;
  isConfidential?: boolean;
  order?: number;
  status?: PortfolioItemStatus;
  seo?: SeoMetaDto;
  metrics?: ProjectMetricDto[];
  testimonialId?: string;
  caseStudyId?: string;
}

export interface UpdatePortfolioDto extends Partial<CreatePortfolioDto> {}

export interface PortfolioFilterQuery {
  category?: string;
  status?: string;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PortfolioItemResponseDto {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  client?: string;
  clientLogo?: string;
  description: string;
  challenge?: string;
  solution?: string;
  results?: string;
  coverImage: string;
  images?: string[];
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  category: PortfolioCategory;
  services?: string[];
  technologies?: string[];
  teamSize?: number;
  duration?: string;
  completedAt?: string | Date;
  isFeatured?: boolean;
  isConfidential?: boolean;
  order?: number;
  status?: PortfolioItemStatus;
  seo?: SeoMetaDto;
  metrics?: ProjectMetricDto[];
  testimonialId?: string;
  caseStudyId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
