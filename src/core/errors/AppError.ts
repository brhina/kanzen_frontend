export interface ApiErrorPayload {
  success?: boolean;
  statusCode?: number;
  code?: string;
  message?: string | string[];
  details?: unknown;
  path?: string;
  timestamp?: string;
  requestId?: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: unknown;
  public readonly timestamp: string;
  public readonly requestId?: string;

  constructor(
    message: string,
    statusCode = 500,
    code = 'APP_ERROR',
    details: unknown = null,
    requestId?: string,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static fromApiResponse(payload: ApiErrorPayload, status = 500): AppError {
    const message = Array.isArray(payload.message)
      ? payload.message.join(', ')
      : payload.message || 'An unexpected error occurred';
    const code = payload.code || `HTTP_${status}`;
    const statusCode = payload.statusCode || status;
    const details =
      payload.details ||
      (Array.isArray(payload.message) ? payload.message : null);

    switch (statusCode) {
      case 400:
        return new ValidationError(message, details, code, payload.requestId);
      case 401:
        return new AuthError(message, details, code, payload.requestId);
      case 403:
        return new ForbiddenError(message, details, code, payload.requestId);
      case 404:
        return new NotFoundError(message, details, code, payload.requestId);
      case 409:
        return new ConflictError(message, details, code, payload.requestId);
      case 422:
        return new ValidationError(message, details, code, payload.requestId);
      case 0:
        return new NetworkError(message);
      default:
        return new ServerError(
          message,
          statusCode,
          code,
          details,
          payload.requestId,
        );
    }
  }
}

export class NetworkError extends AppError {
  constructor(
    message = 'Network connection failed. Please check your internet connection.',
  ) {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class AuthError extends AppError {
  constructor(
    message = 'Authentication required or session expired',
    details: unknown = null,
    code = 'UNAUTHORIZED',
    requestId?: string,
  ) {
    super(message, 401, code, details, requestId);
    this.name = 'AuthError';
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message = 'You do not have permission to perform this action',
    details: unknown = null,
    code = 'FORBIDDEN',
    requestId?: string,
  ) {
    super(message, 403, code, details, requestId);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(
    message = 'Resource not found',
    details: unknown = null,
    code = 'NOT_FOUND',
    requestId?: string,
  ) {
    super(message, 404, code, details, requestId);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message = 'Validation failed',
    details: unknown = null,
    code = 'VALIDATION_ERROR',
    requestId?: string,
  ) {
    super(message, 400, code, details, requestId);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends AppError {
  constructor(
    message = 'A conflict occurred with an existing resource',
    details: unknown = null,
    code = 'CONFLICT',
    requestId?: string,
  ) {
    super(message, 409, code, details, requestId);
    this.name = 'ConflictError';
  }
}

export class ServerError extends AppError {
  constructor(
    message = 'Internal server error',
    statusCode = 500,
    code = 'INTERNAL_SERVER_ERROR',
    details: unknown = null,
    requestId?: string,
  ) {
    super(message, statusCode, code, details, requestId);
    this.name = 'ServerError';
  }
}
