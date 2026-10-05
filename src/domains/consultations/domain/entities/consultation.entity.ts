import { ConsultationStatus } from '../enums/consultation-status.enum';
import { MeetingType } from '../enums/meeting-type.enum';

export interface ConsultationProps {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectDescription: string;
  serviceInterest: string[];
  budget?: number;
  preferredDate?: Date;
  preferredTime?: string;
  timezone: string;
  meetingType: MeetingType;
  meetingLink?: string;
  status?: ConsultationStatus;
  confirmedAt?: Date;
  completedAt?: Date;
  notes?: string;
  leadId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ConsultationEntity {
  public id?: string;
  public name: string;
  public email: string;
  public phone?: string;
  public company?: string;
  public projectDescription: string;
  public serviceInterest: string[];
  public budget?: number;
  public preferredDate?: Date;
  public preferredTime?: string;
  public timezone: string;
  public meetingType: MeetingType;
  public meetingLink?: string;
  public status: ConsultationStatus;
  public confirmedAt?: Date;
  public completedAt?: Date;
  public notes?: string;
  public leadId?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: ConsultationProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    this.company = props.company;
    this.projectDescription = props.projectDescription;
    this.serviceInterest = props.serviceInterest ?? [];
    this.budget = props.budget;
    this.preferredDate = props.preferredDate;
    this.preferredTime = props.preferredTime;
    this.timezone = props.timezone ?? 'UTC';
    this.meetingType = props.meetingType ?? MeetingType.VIDEO;
    this.meetingLink = props.meetingLink;
    this.status = props.status ?? ConsultationStatus.PENDING;
    this.confirmedAt = props.confirmedAt;
    this.completedAt = props.completedAt;
    this.notes = props.notes;
    this.leadId = props.leadId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
