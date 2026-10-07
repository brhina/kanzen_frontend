import type { AuditStatusValue } from '../enums/audit-status.enum';

export interface AuditChanges {
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
}

export interface AuditLogEntity {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: AuditChanges;
  ipAddress?: string;
  userAgent?: string;
  status: AuditStatusValue | string;
  createdAt?: string | Date;
}
