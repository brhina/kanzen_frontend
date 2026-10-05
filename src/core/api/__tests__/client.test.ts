import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authStore } from '../../auth/auth.store';
import { ValidationError } from '../../errors/AppError';
import { apiClient } from '../client';

describe('apiClient HTTP Interceptors', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    authStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('beforeRequest Authorization Token Attachment', () => {
    it('automatically attaches Bearer token from authStore when token is present', async () => {
      authStore.setState({
        accessToken: 'mock_jwt_token_123',
        isAuthenticated: true,
      });

      let capturedHeaders: Headers | undefined;

      globalThis.fetch = vi.fn().mockImplementation((input, init) => {
        const req = input instanceof Request ? input : new Request(input, init);
        capturedHeaders = req.headers;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true, data: { test: true } }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      });

      await apiClient.get('test-endpoint').json();

      expect(capturedHeaders).toBeDefined();
      expect(capturedHeaders?.get('Authorization')).toBe('Bearer mock_jwt_token_123');
    });

    it('does not attach Authorization header when unauthenticated', async () => {
      authStore.setState({
        accessToken: null,
        isAuthenticated: false,
      });

      let capturedHeaders: Headers | undefined;

      globalThis.fetch = vi.fn().mockImplementation((input, init) => {
        const req = input instanceof Request ? input : new Request(input, init);
        capturedHeaders = req.headers;
        return Promise.resolve(
          new Response(JSON.stringify({ success: true, data: {} }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      });

      await apiClient.get('public-endpoint').json();

      expect(capturedHeaders?.has('Authorization')).toBe(false);
    });
  });

  describe('afterResponse 401 Unauthorized Refresh & Retry', () => {
    it('triggers refresh and retries original request when 401 is encountered', async () => {
      authStore.setState({
        accessToken: 'expired_token',
        refreshToken: 'valid_refresh_token',
        isAuthenticated: true,
      });

      let callCount = 0;
      const refreshSpy = vi.spyOn(authStore.getState(), 'refresh').mockImplementation(async () => {
        authStore.setState({
          accessToken: 'fresh_token_456',
        });
        return true;
      });

      globalThis.fetch = vi.fn().mockImplementation((input, init) => {
        callCount++;
        const req = input instanceof Request ? input : new Request(input, init);

        if (callCount === 1) {
          // First attempt returns 401 Unauthorized
          return Promise.resolve(
            new Response(
              JSON.stringify({ success: false, message: 'Token expired', statusCode: 401 }),
              { status: 401, headers: { 'Content-Type': 'application/json' } },
            ),
          );
        }

        // Second (retried) attempt with new token returns 200
        expect(req.headers.get('Authorization')).toBe('Bearer fresh_token_456');
        return Promise.resolve(
          new Response(JSON.stringify({ success: true, data: { status: 'retried_success' } }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      });

      const res = await apiClient.get('protected-resource').json<{ data: { status: string } }>();

      expect(refreshSpy).toHaveBeenCalledTimes(1);
      expect(callCount).toBe(2);
      expect(res.data.status).toBe('retried_success');
    });

    it('logs out and does not retry if refresh fails on 401', async () => {
      authStore.setState({
        accessToken: 'expired_token',
        refreshToken: 'invalid_refresh_token',
        isAuthenticated: true,
      });

      const logoutSpy = vi.spyOn(authStore.getState(), 'logout');
      vi.spyOn(authStore.getState(), 'refresh').mockResolvedValue(false);

      globalThis.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify({ success: false, message: 'Invalid token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }),
        ),
      );

      await expect(apiClient.get('protected-resource')).rejects.toThrow();

      expect(logoutSpy).toHaveBeenCalled();
    });

    it('does not attempt refresh for /auth/login or /auth/refresh endpoints', async () => {
      const refreshSpy = vi.spyOn(authStore.getState(), 'refresh');

      globalThis.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({ success: false, message: 'Invalid credentials', statusCode: 401 }),
            { status: 401, headers: { 'Content-Type': 'application/json' } },
          ),
        ),
      );

      await expect(apiClient.post('auth/login')).rejects.toThrow();

      expect(refreshSpy).not.toHaveBeenCalled();
    });
  });

  describe('beforeError NestJS Error Response Unwrapping', () => {
    it('unwraps NestJS HttpExceptionFilter response format into AppError', async () => {
      const nestJsErrorResponse = {
        success: false,
        statusCode: 400,
        code: 'VALIDATION_FAILED',
        message: ['email must be an email', 'password too short'],
        details: null,
        path: '/api/v1/auth/login',
        timestamp: '2026-10-05T12:00:00.000Z',
        requestId: 'req-12345',
      };

      globalThis.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify(nestJsErrorResponse), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }),
        ),
      );

      try {
        await apiClient.post('auth/login', { json: {} });
        expect.unreachable('Should have thrown an Error');
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(ValidationError);
        const valError = err as ValidationError;
        expect(valError.message).toContain('email must be an email, password too short');
        expect(valError.statusCode).toBe(400);
        expect(valError.code).toBe('VALIDATION_FAILED');
        expect(valError.requestId).toBe('req-12345');
      }
    });
  });
});
