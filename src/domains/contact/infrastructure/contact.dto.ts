import type { ContactStatus } from '../domain/enums/contact-status.enum';
import type { ContactType } from '../domain/enums/contact-type.enum';

export interface ContactResponseDto {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: ContactType;
  status: ContactStatus;
  readAt?: string | Date;
  repliedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateContactDto {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type?: ContactType;
}

export interface UpdateContactStatusDto {
  status: ContactStatus;
}

export interface FilterContactDto {
  [key: string]: unknown;
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
