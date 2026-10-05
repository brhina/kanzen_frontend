import type {
  ExperienceLevel,
  JobPostingStatus,
  JobType,
  WorkMode,
} from '../domain/enums/job-posting.enums';
import type { SeoMeta } from '../domain/entities/job-posting.entity';

export interface JobPostingDto {
  id: string;
  title: string;
  slug: string;
  department: string;
  type: JobType;
  mode: WorkMode;
  location?: string;
  description: string;
  requirements: string[];
  niceToHave?: string[];
  benefits?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  experienceLevel: ExperienceLevel;
  technologies?: string[];
  isUrgent?: boolean;
  closingDate?: string | null;
  status: JobPostingStatus;
  applicationCount?: number;
  seo?: SeoMeta;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJobPostingDto {
  title: string;
  slug?: string;
  department: string;
  type: JobType;
  mode: WorkMode;
  location?: string;
  description: string;
  requirements: string[];
  niceToHave?: string[];
  benefits?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  experienceLevel: ExperienceLevel;
  technologies?: string[];
  isUrgent?: boolean;
  closingDate?: string | null;
  status?: JobPostingStatus;
  seo?: SeoMeta;
}

export type UpdateJobPostingDto = Partial<CreateJobPostingDto>;

export interface FilterCareersDto {
  status?: JobPostingStatus;
  department?: string;
  type?: JobType;
  mode?: WorkMode;
  experienceLevel?: ExperienceLevel;
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface JobPostingListResponseDto {
  data: JobPostingDto[];
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
