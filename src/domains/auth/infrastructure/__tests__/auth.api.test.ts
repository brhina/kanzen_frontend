import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { authApi } from '../auth.api';

describe('authApi', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('correctly unwraps backend TransformInterceptor ApiResponse envelope on login', async () => {
    const backendResponse = {
      success: true,
      data: {
        accessToken: 'access-jwt-token',
        refreshToken: 'refresh-jwt-token',
        tokenType: 'Bearer',
        expiresIn: 900,
        user: {
          id: 'cly123456',
          email: 'engineer@kanzen.tech',
          firstName: 'Kanzen',
          lastName: 'Engineer',
          fullName: 'Kanzen Engineer',
          isAdmin: true,
          permissions: ['admin:all'],
          status: 'active',
        },
      },
      timestamp: '2026-10-05T12:00:00.000Z',
      requestId: 'req-auth-123',
    };

    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(backendResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await authApi.login({
      email: 'engineer@kanzen.tech',
      password: 'StrongPassword123!',
    });

    expect(result.accessToken).toBe('access-jwt-token');
    expect(result.refreshToken).toBe('refresh-jwt-token');
    expect(result.user).toBeDefined();
    expect(result.user.id).toBe('cly123456');
    expect(result.user.email).toBe('engineer@kanzen.tech');
  });

  it('correctly handles raw AuthResponseDto if already unwrapped', async () => {
    const rawDto = {
      accessToken: 'raw-access-jwt',
      refreshToken: 'raw-refresh-jwt',
      tokenType: 'Bearer',
      expiresIn: 900,
      user: {
        id: 'cly999',
        email: 'raw@kanzen.tech',
        firstName: 'Raw',
        lastName: 'User',
        fullName: 'Raw User',
        isAdmin: false,
        permissions: [],
        status: 'active',
      },
    };

    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(rawDto), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await authApi.login({
      email: 'raw@kanzen.tech',
      password: 'StrongPassword123!',
    });

    expect(result.accessToken).toBe('raw-access-jwt');
    expect(result.user.id).toBe('cly999');
  });
});
