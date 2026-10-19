import type { ConsultationStatus } from '../domain/enums/consultation-status.enum';
import type { MeetingType } from '../domain/enums/meeting-type.enum';
import type { ConsultationType } from '../domain/enums/consultation-type.enum';
import type { DeliveryFormat } from '../domain/enums/delivery-format.enum';

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
  type?: ConsultationType | 'consultation' | 'training';
  attendeesCount?: number;
  trainingTopic?: string;
  deliveryFormat?: DeliveryFormat | string;
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
  type?: ConsultationType | 'consultation' | 'training';
  attendeesCount?: number;
  trainingTopic?: string;
  deliveryFormat?: DeliveryFormat | string;
  notes?: string;
  status?: ConsultationStatus;
  meetingLink?: string;
  confirmedAt?: string;
}

export interface UpdateConsultationDto {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  projectDescription?: string;
  serviceInterest?: string[];
  budget?: number;
  preferredDate?: string;
  preferredTime?: string;
  timezone?: string;
  meetingType?: MeetingType;
  meetingLink?: string;
  notes?: string;
  status?: ConsultationStatus;
  type?: ConsultationType | 'consultation' | 'training';
  attendeesCount?: number;
  trainingTopic?: string;
  deliveryFormat?: DeliveryFormat | string;
  confirmedDate?: string;
  confirmedAt?: string;
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
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
