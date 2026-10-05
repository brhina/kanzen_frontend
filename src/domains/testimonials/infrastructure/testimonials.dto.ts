import type { TestimonialStatus } from '../domain/enums/testimonial-status.enum';

export interface CreateTestimonialDto {
  author: string;
  role?: string;
  company?: string;
  companyLogo?: string;
  avatar?: string;
  content: string;
  rating: number;
  videoUrl?: string;
  serviceId?: string;
  portfolioItemId?: string;
  caseStudyId?: string;
  source?: string;
}

export interface UpdateTestimonialDto {
  author?: string;
  role?: string;
  company?: string;
  companyLogo?: string;
  avatar?: string;
  content?: string;
  rating?: number;
  videoUrl?: string;
  serviceId?: string;
  portfolioItemId?: string;
  caseStudyId?: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  status?: TestimonialStatus;
  order?: number;
  source?: string;
}

export interface FilterTestimonialsDto {
  status?: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  serviceId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TestimonialResponseDto {
  id?: string;
  _id?: string;
  author: string;
  role?: string;
  company?: string;
  companyLogo?: string;
  avatar?: string;
  content: string;
  rating: number;
  videoUrl?: string;
  serviceId?: string;
  portfolioItemId?: string;
  caseStudyId?: string;
  isFeatured: boolean;
  isVerified: boolean;
  status: TestimonialStatus;
  order: number;
  source?: string;
  publishedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
