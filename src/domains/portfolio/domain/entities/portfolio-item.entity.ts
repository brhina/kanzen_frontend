import type { PortfolioCategory } from '../enums/portfolio-category.enum';
import type { PortfolioItemStatus } from '../enums/portfolio-status.enum';

export interface ProjectMetric {
  label: string;
  value: string;
  icon?: string;
}

export interface SeoMeta {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface PortfolioItemEntity {
  id: string;
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
  images: string[];
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  category: PortfolioCategory;
  services: string[];
  technologies: string[];
  teamSize?: number;
  duration?: string;
  completedAt?: string;
  isFeatured: boolean;
  isConfidential: boolean;
  order: number;
  status: PortfolioItemStatus;
  seo?: SeoMeta;
  metrics: ProjectMetric[];
  testimonialId?: string;
  caseStudyId?: string;
  createdAt?: string;
  updatedAt?: string;
}
