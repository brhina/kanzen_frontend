import type { ConsultationStatus } from '../domain/enums/consultation-status.enum';
import type { MeetingType } from '../domain/enums/meeting-type.enum';

export interface ConsultationResponseDto {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectDescription: string;
  serviceInterest: string[];
  budget?: number;
  preferredDate?: string | Date;
  preferredTime?: string;
  timezone: string;
  meetingType: MeetingType;
  meetingLink?: string;
  status: ConsultationStatus;
  confirmedAt?: string | Date;
  completedAt?: string | Date;
  notes?: string;
  leadId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateConsultationDto {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectDescription: string;
  serviceInterest?: string[];
  budget?: number;
  preferredDate?: string;
  preferredTime?: string;
  timezone?: string;
  meetingType?: MeetingType;
  notes?: string;
}

export interface UpdateConsultationDto {
  meetingLink?: string;
  notes?: string;
  status?: ConsultationStatus;
  confirmedDate?: string;
}

export interface ConfirmConsultationDto {
  meetingLink: string;
  confirmedDate?: string;
  notes?: string;
}

export interface CancelConsultationDto {
  reason?: string;
}

export interface FilterConsultationsDto {
  [key: string]: unknown;
  status?: string;
  meetingType?: string;
  search?: string;
  page?: number;
  limit?: number;
}
