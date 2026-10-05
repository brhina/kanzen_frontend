import type { CaseStudyStatus } from '../domain/enums/case-study-status.enum';

export interface CaseStudyMetricDto {
  label: string;
  value: string;
  description?: string;
}

export interface SeoMetaDto {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface CreateCaseStudyDto {
  title: string;
  slug?: string;
  client: string;
  clientIndustry: string;
  clientSize?: string;
  summary: string;
  challenge: string;
  approach: string;
  solution: string;
  results: string;
  coverImage: string;
  images?: string[];
  videoUrl?: string;
  technologies?: string[];
  servicesUsed?: string[];
  duration?: string;
  teamSize?: number;
  testimonialId?: string;
  portfolioItemId?: string;
  downloadable?: boolean;
  pdfUrl?: string;
  isFeatured?: boolean;
  status?: CaseStudyStatus;
  seo?: SeoMetaDto;
  metrics?: CaseStudyMetricDto[];
  publishedAt?: string;
}

export interface UpdateCaseStudyDto extends Partial<CreateCaseStudyDto> {}

export interface FilterCaseStudiesDto {
  industry?: string;
  status?: string;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CaseStudyResponseDto {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  client: string;
  clientIndustry: string;
  clientSize?: string;
  summary: string;
  challenge: string;
  approach: string;
  solution: string;
  results: string;
  coverImage: string;
  images?: string[];
  videoUrl?: string;
  technologies?: string[];
  servicesUsed?: string[];
  duration?: string;
  teamSize?: number;
  testimonialId?: string;
  portfolioItemId?: string;
  downloadable?: boolean;
  pdfUrl?: string;
  isFeatured?: boolean;
  status?: CaseStudyStatus;
  seo?: SeoMetaDto;
  metrics?: CaseStudyMetricDto[];
  publishedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
