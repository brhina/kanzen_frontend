import type { CaseStudyStatus } from '../enums/case-study-status.enum';

export interface CaseStudyMetric {
  label: string;
  value: string;
  description?: string;
}

export interface SeoMeta {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface CaseStudyEntity {
  id: string;
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
  metrics: CaseStudyMetric[];
  coverImage: string;
  images: string[];
  videoUrl?: string;
  technologies: string[];
  servicesUsed: string[];
  duration?: string;
  teamSize?: number;
  testimonialId?: string;
  portfolioItemId?: string;
  downloadable: boolean;
  pdfUrl?: string;
  isFeatured: boolean;
  status: CaseStudyStatus;
  seo?: SeoMeta;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
