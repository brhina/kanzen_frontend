import { describe, it, expect } from 'vitest';
import { usersMapper } from '../users.mapper';

describe('usersMapper', () => {
  it('maps UserResponseDto to domain UserEntity', () => {
    const entity = usersMapper.toEntity({
      id: 'u-1',
      firstName: 'Sarah',
      lastName: 'Connor',
      fullName: 'Sarah Connor',
      email: 'sarah@kanzen.tech',
      isAdmin: false,
      permissions: ['leads:read'],
      status: 'active',
      phone: '+1234567890',
    });

    expect(entity.id).toBe('u-1');
    expect(entity.fullName).toBe('Sarah Connor');
    expect(entity.isAdmin).toBe(false);
    expect(entity.permissions).toEqual(['leads:read']);
    expect(entity.status).toBe('active');
  });

  it('maps paginated users response correctly', () => {
    const result = usersMapper.toPaginated({
      data: [
        {
          id: 'u-1',
          firstName: 'John',
          lastName: 'Doe',
          fullName: 'John Doe',
          email: 'john@kanzen.tech',
          isAdmin: true,
          permissions: [],
          status: 'active',
        },
      ],
      meta: {
        pagination: {
          total: 15,
          page: 2,
          limit: 10,
          totalPages: 2,
        },
      },
    });

    expect(result.users).toHaveLength(1);
    expect(result.total).toBe(15);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(2);
  });
});
