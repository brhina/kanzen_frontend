import type {
  ExperienceLevel,
  JobPostingStatus,
  JobType,
  WorkMode,
} from '../enums/job-posting.enums';

export interface SeoMeta {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface JobPostingProps {
  id?: string;
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
  closingDate?: Date | null;
  status: JobPostingStatus;
  applicationCount?: number;
  seo?: SeoMeta;
  publishedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class JobPostingEntity {
  public id?: string;
  public title: string;
  public slug: string;
  public department: string;
  public type: JobType;
  public mode: WorkMode;
  public location?: string;
  public description: string;
  public requirements: string[];
  public niceToHave: string[];
  public benefits: string[];
  public salaryMin?: number;
  public salaryMax?: number;
  public salaryCurrency: string;
  public experienceLevel: ExperienceLevel;
  public technologies: string[];
  public isUrgent: boolean;
  public closingDate?: Date | null;
  public status: JobPostingStatus;
  public applicationCount: number;
  public seo?: SeoMeta;
  public publishedAt?: Date | null;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: JobPostingProps) {
    this.id = props.id;
    this.title = props.title;
    this.slug = props.slug;
    this.department = props.department;
    this.type = props.type;
    this.mode = props.mode;
    this.location = props.location;
    this.description = props.description;
    this.requirements = props.requirements ?? [];
    this.niceToHave = props.niceToHave ?? [];
    this.benefits = props.benefits ?? [];
    this.salaryMin = props.salaryMin;
    this.salaryMax = props.salaryMax;
    this.salaryCurrency = props.salaryCurrency ?? 'USD';
    this.experienceLevel = props.experienceLevel;
    this.technologies = props.technologies ?? [];
    this.isUrgent = props.isUrgent ?? false;
    this.closingDate = props.closingDate;
    this.status = props.status;
    this.applicationCount = props.applicationCount ?? 0;
    this.seo = props.seo;
    this.publishedAt = props.publishedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get salaryRangeFormatted(): string {
    if (this.salaryMin && this.salaryMax) {
      return `${this.salaryCurrency} ${this.salaryMin.toLocaleString()} - ${this.salaryMax.toLocaleString()}`;
    }
    if (this.salaryMin) {
      return `From ${this.salaryCurrency} ${this.salaryMin.toLocaleString()}`;
    }
    if (this.salaryMax) {
      return `Up to ${this.salaryCurrency} ${this.salaryMax.toLocaleString()}`;
    }
    return 'Competitive Compensation';
  }

  get isOpen(): boolean {
    return this.status === 'open';
  }

  get locationDisplay(): string {
    if (this.mode === 'remote') {
      return this.location ? `Remote (${this.location})` : 'Remote';
    }
    if (this.mode === 'hybrid') {
      return this.location ? `Hybrid (${this.location})` : 'Hybrid';
    }
    return this.location || 'On-site';
  }
}
