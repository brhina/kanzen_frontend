import type { ApplicationStatus } from '../domain/enums/application-status.enum';

export interface JobApplicationDto {
  id: string;
  jobId: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  coverLetter?: string;
  resumeUrl: string;
  yearsOfExperience?: number;
  currentCompany?: string;
  expectedSalary?: number;
  noticePeriod?: string;
  source: string;
  referredBy?: string;
  status: ApplicationStatus;
  rating?: number;
  notes?: string;
  interviewDate?: string | null;
  rejectedAt?: string | null;
  hiredAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJobApplicationDto {
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  coverLetter?: string;
  resumeUrl: string;
  yearsOfExperience?: number;
  currentCompany?: string;
  expectedSalary?: number;
  noticePeriod?: string;
  source?: string;
  referredBy?: string;
}

export interface UpdateJobApplicationDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  coverLetter?: string;
  resumeUrl?: string;
  yearsOfExperience?: number;
  currentCompany?: string;
  expectedSalary?: number;
  noticePeriod?: string;
  status?: ApplicationStatus;
  rating?: number;
  notes?: string;
  interviewDate?: string | null;
}

export interface FilterApplicationsDto {
  jobId?: string;
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface JobApplicationListResponseDto {
  data: JobApplicationDto[];
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
