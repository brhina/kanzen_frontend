import type { ApplicationStatus } from '../enums/application-status.enum';

export interface JobApplicationProps {
  id?: string;
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
  status: ApplicationStatus;
  rating?: number;
  notes?: string;
  interviewDate?: Date | null;
  rejectedAt?: Date | null;
  hiredAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class JobApplicationEntity {
  public id?: string;
  public jobId: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public phone?: string;
  public linkedinUrl?: string;
  public portfolioUrl?: string;
  public githubUrl?: string;
  public coverLetter?: string;
  public resumeUrl: string;
  public yearsOfExperience?: number;
  public currentCompany?: string;
  public expectedSalary?: number;
  public noticePeriod?: string;
  public source: string;
  public referredBy?: string;
  public status: ApplicationStatus;
  public rating?: number;
  public notes?: string;
  public interviewDate?: Date | null;
  public rejectedAt?: Date | null;
  public hiredAt?: Date | null;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: JobApplicationProps) {
    this.id = props.id;
    this.jobId = props.jobId;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.phone = props.phone;
    this.linkedinUrl = props.linkedinUrl;
    this.portfolioUrl = props.portfolioUrl;
    this.githubUrl = props.githubUrl;
    this.coverLetter = props.coverLetter;
    this.resumeUrl = props.resumeUrl;
    this.yearsOfExperience = props.yearsOfExperience;
    this.currentCompany = props.currentCompany;
    this.expectedSalary = props.expectedSalary;
    this.noticePeriod = props.noticePeriod;
    this.source = props.source ?? 'website';
    this.referredBy = props.referredBy;
    this.status = props.status;
    this.rating = props.rating;
    this.notes = props.notes;
    this.interviewDate = props.interviewDate;
    this.rejectedAt = props.rejectedAt;
    this.hiredAt = props.hiredAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get isPendingReview(): boolean {
    return this.status === 'applied' || this.status === 'screening';
  }

  get isInterviewing(): boolean {
    return this.status === 'interview';
  }

  get isHired(): boolean {
    return this.status === 'hired';
  }
}
