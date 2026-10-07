import type { AuditChanges } from '../domain/entities/audit-log.entity';

export interface FilterAuditDto {
  action?: string;
  resource?: string;
  userId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogResponseDto {
  id?: string;
  userId?: string;
  userEmail?: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: AuditChanges;
  ipAddress?: string;
  userAgent?: string;
  status: string;
  createdAt?: string;
}

export interface PaginatedAuditLogResponseDto {
  data: AuditLogResponseDto[];
  meta: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
