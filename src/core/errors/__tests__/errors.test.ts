import { describe, expect, it } from 'vitest';
import {
  AppError,
  AuthError,
  ConflictError,
  ForbiddenError,
  NetworkError,
  NotFoundError,
  ServerError,
  ValidationError,
} from '../AppError';
import { normalizeError } from '../error-handler';

describe('AppError Taxonomy & Factory', () => {
  it('creates specialized AppError instances with correct properties', () => {
    const authErr = new AuthError('Session invalid', { reason: 'expired' }, 'SESSION_EXPIRED', 'req-1');
    expect(authErr).toBeInstanceOf(AppError);
    expect(authErr.statusCode).toBe(401);
    expect(authErr.code).toBe('SESSION_EXPIRED');
    expect(authErr.requestId).toBe('req-1');
    expect(authErr.details).toEqual({ reason: 'expired' });
  });

  it('maps HTTP status codes to specialized error classes via fromApiResponse', () => {
    expect(AppError.fromApiResponse({ message: 'Bad request' }, 400)).toBeInstanceOf(ValidationError);
    expect(AppError.fromApiResponse({ message: 'Not logged in' }, 401)).toBeInstanceOf(AuthError);
    expect(AppError.fromApiResponse({ message: 'No permission' }, 403)).toBeInstanceOf(ForbiddenError);
    expect(AppError.fromApiResponse({ message: 'Missing' }, 404)).toBeInstanceOf(NotFoundError);
    expect(AppError.fromApiResponse({ message: 'Conflict' }, 409)).toBeInstanceOf(ConflictError);
    expect(AppError.fromApiResponse({ message: 'Unprocessable' }, 422)).toBeInstanceOf(ValidationError);
    expect(AppError.fromApiResponse({ message: 'Offline' }, 0)).toBeInstanceOf(NetworkError);
    expect(AppError.fromApiResponse({ message: 'Crash' }, 500)).toBeInstanceOf(ServerError);
  });

  it('unwraps array messages from validation errors cleanly', () => {
    const error = AppError.fromApiResponse(
      { message: ['name is required', 'email is invalid'] },
      400,
    );
    expect(error.message).toBe('name is required, email is invalid');
  });

  it('normalizes arbitrary error objects into AppError via normalizeError', () => {
    const fromStr = normalizeError('Simple error string');
    expect(fromStr).toBeInstanceOf(AppError);
    expect(fromStr.message).toBe('Simple error string');

    const nativeError = new TypeError('Cannot read properties of undefined');
    const fromNative = normalizeError(nativeError);
    expect(fromNative).toBeInstanceOf(AppError);
    expect(fromNative.message).toBe('Cannot read properties of undefined');
  });
});
