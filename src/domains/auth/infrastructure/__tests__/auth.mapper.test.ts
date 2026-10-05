import { describe, it, expect, beforeEach } from 'vitest';
import { authMapper } from '../auth.mapper';
import { useAuthStore } from '@/core/auth/auth.store';

describe('authMapper', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  });

  it('correctly maps DTO to AuthTokensEntity', () => {
    const tokens = authMapper.toTokens({
      accessToken: 'access-123',
      refreshToken: 'refresh-456',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: '1',
        firstName: 'Jane',
        lastName: 'Doe',
        fullName: 'Jane Doe',
        email: 'jane@kanzen.tech',
        isAdmin: true,
        permissions: [],
        status: 'active',
      },
    });

    expect(tokens.accessToken).toBe('access-123');
    expect(tokens.refreshToken).toBe('refresh-456');
    expect(tokens.tokenType).toBe('Bearer');
    expect(tokens.expiresIn).toBe(3600);
  });

  it('correctly normalizes partial user into UserEntity with defaults', () => {
    const entity = authMapper.toUserEntity({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@kanzen.tech',
      isAdmin: false,
    });

    expect(entity.fullName).toBe('Alice Smith');
    expect(entity.permissions).toEqual([]);
    expect(entity.status).toBe('active');
    expect(entity.isAdmin).toBe(false);
  });

  it('hydrates authStore with tokens and user entity via syncAuthStore', () => {
    authMapper.syncAuthStore({
      accessToken: 'acc-jwt',
      refreshToken: 'ref-jwt',
      user: {
        id: 'u-99',
        firstName: 'Bob',
        lastName: 'Admin',
        fullName: 'Bob Admin',
        email: 'bob@kanzen.tech',
        isAdmin: true,
        permissions: ['users:read', 'users:write'],
        status: 'active',
      },
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.accessToken).toBe('acc-jwt');
    expect(state.refreshToken).toBe('ref-jwt');
    expect(state.user?.email).toBe('bob@kanzen.tech');
    expect(state.user?.isAdmin).toBe(true);
    expect(state.hasPermission('users:read')).toBe(true);
  });
});
