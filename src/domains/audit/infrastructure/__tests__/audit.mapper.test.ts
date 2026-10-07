import { describe, it, expect } from 'vitest';
import { AuditMapper } from '../audit.mapper';

describe('AuditMapper', () => {
  it('maps AuditLogResponseDto to domain AuditLogEntity', () => {
    const dto = {
      id: 'audit-999',
      userId: 'admin-1',
      userEmail: 'admin@kanzen.tech',
      action: 'update',
      resource: 'setting',
      resourceId: 'company.name',
      changes: {
        before: { name: 'Old Name' },
        after: { name: 'Kanzen Tech' },
      },
      ipAddress: '127.0.0.1',
      status: 'success',
      createdAt: '2026-10-04T14:00:00Z',
    };

    const entity = AuditMapper.toDomain(dto);

    expect(entity.id).toBe('audit-999');
    expect(entity.userEmail).toBe('admin@kanzen.tech');
    expect(entity.action).toBe('update');
    expect(entity.resource).toBe('setting');
    expect(entity.changes?.after).toEqual({ name: 'Kanzen Tech' });
    expect(entity.status).toBe('success');
  });
});
