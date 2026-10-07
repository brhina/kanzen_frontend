import { describe, it, expect } from 'vitest';
import { NotificationMapper } from '../notifications.mapper';

describe('NotificationMapper', () => {
  it('maps NotificationResponseDto to domain NotificationEntity', () => {
    const dto = {
      id: 'notif-1',
      userId: 'user-42',
      type: 'system',
      channel: 'in_app',
      subject: 'Security Notice',
      body: 'Your password was changed successfully.',
      status: 'unread',
      sentAt: '2026-10-04T10:00:00Z',
      createdAt: '2026-10-04T10:00:00Z',
    };

    const entity = NotificationMapper.toDomain(dto);

    expect(entity.id).toBe('notif-1');
    expect(entity.userId).toBe('user-42');
    expect(entity.type).toBe('system');
    expect(entity.subject).toBe('Security Notice');
    expect(entity.body).toContain('password was changed');
  });

  it('maps list of notifications correctly', () => {
    const list = NotificationMapper.toDomainList([
      {
        id: 'n-1',
        type: 'email',
        channel: 'email',
        body: 'Welcome',
        status: 'sent',
      },
    ]);

    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('n-1');
  });
});
