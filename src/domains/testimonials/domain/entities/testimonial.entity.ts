import type { TestimonialStatus } from '../enums/testimonial-status.enum';

export interface TestimonialEntity {
  id: string;
  author: string;
  role?: string;
  company?: string;
  companyLogo?: string;
  avatar?: string;
  content: string;
  rating: number; // 1 to 5
  videoUrl?: string;
  serviceId?: string;
  portfolioItemId?: string;
  caseStudyId?: string;
  isFeatured: boolean;
  isVerified: boolean;
  status: TestimonialStatus;
  order: number;
  source?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
