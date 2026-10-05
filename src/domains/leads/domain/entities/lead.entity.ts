import { LeadStatus } from '../enums/lead-status.enum';

export interface LeadProps {
  id?: string;
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
  qualificationScore?: number;
  assignedTo?: string;
  notes?: string;
  status?: LeadStatus;
  convertedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class LeadEntity {
  public id?: string;
  public name: string;
  public email: string;
  public phone?: string;
  public company?: string;
  public website?: string;
  public message?: string;
  public serviceInterest: string[];
  public budget?: number;
  public budgetCurrency: string;
  public timeline?: string;
  public source: string;
  public utmSource?: string;
  public utmMedium?: string;
  public utmCampaign?: string;
  public qualificationScore: number;
  public assignedTo?: string;
  public notes?: string;
  public status: LeadStatus;
  public convertedAt?: Date;
  public ipAddress?: string;
  public userAgent?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: LeadProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    this.company = props.company;
    this.website = props.website;
    this.message = props.message;
    this.serviceInterest = props.serviceInterest ?? [];
    this.budget = props.budget;
    this.budgetCurrency = props.budgetCurrency ?? 'USD';
    this.timeline = props.timeline;
    this.source = props.source ?? 'website';
    this.utmSource = props.utmSource;
    this.utmMedium = props.utmMedium;
    this.utmCampaign = props.utmCampaign;
    this.qualificationScore = props.qualificationScore ?? 0;
    this.assignedTo = props.assignedTo;
    this.notes = props.notes;
    this.status = props.status ?? LeadStatus.NEW;
    this.convertedAt = props.convertedAt;
    this.ipAddress = props.ipAddress;
    this.userAgent = props.userAgent;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
