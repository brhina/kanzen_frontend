import type { AuditLogEntity } from '../domain/entities/audit-log.entity';
import type { AuditLogResponseDto } from './audit.dto';

export class AuditMapper {
  static toDomain(dto: AuditLogResponseDto): AuditLogEntity {
    return {
      id: dto.id || '',
      userId: dto.userId,
      userEmail: dto.userEmail,
      action: dto.action,
      resource: dto.resource,
      resourceId: dto.resourceId,
      changes: dto.changes,
      ipAddress: dto.ipAddress,
      userAgent: dto.userAgent,
      status: dto.status as any,
      createdAt: dto.createdAt,
    };
  }

  static toDomainList(dtos: AuditLogResponseDto[]): AuditLogEntity[] {
    return (dtos || []).map((d) => AuditMapper.toDomain(d));
  }
}
