import type { NewsletterSubscriberStatus } from '../domain/enums/newsletter-status.enum';

export interface NewsletterSubscriberResponseDto {
  id?: string;
  email: string;
  firstName?: string;
  source: string;
  tags: string[];
  isConfirmed: boolean;
  status: NewsletterSubscriberStatus;
  confirmedAt?: string | Date;
  unsubscribedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface SubscribeNewsletterDto {
  email: string;
  firstName?: string;
  source?: string;
  tags?: string[];
}

export interface UnsubscribeNewsletterDto {
  email: string;
  reason?: string;
}

export interface UpdateNewsletterSubscriberDto {
  firstName?: string;
  source?: string;
  tags?: string[];
  status?: NewsletterSubscriberStatus;
  isConfirmed?: boolean;
}

export interface FilterNewsletterDto {
  [key: string]: unknown;
  status?: string;
  source?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}
