import type { LeadStatus } from '../domain/enums/lead-status.enum';

export interface LeadResponseDto {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  message?: string;
  serviceInterest: string[];
  budget?: number;
  budgetCurrency?: string;
  timeline?: string;
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  qualificationScore: number;
  assignedTo?: string;
  notes?: string;
  status: LeadStatus;
  convertedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateLeadDto {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  message?: string;
  serviceInterest?: string[];
  budget?: number;
  budgetCurrency?: string;
  timeline?: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {
  status?: LeadStatus;
  assignedTo?: string;
  notes?: string;
  qualificationScore?: number;
}

export interface QualifyLeadDto {
  score: number;
  status?: LeadStatus;
}

export interface FilterLeadsDto {
  [key: string]: unknown;
  status?: string;
  serviceInterest?: string;
  source?: string;
  assignedTo?: string;
  minScore?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
