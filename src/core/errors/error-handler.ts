import { AppError } from './AppError';

export interface ErrorReport {
  message: string;
  code?: string;
  statusCode?: number;
  stack?: string;
  timestamp: string;
  url?: string;
  userAgent?: string;
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  if (error instanceof Error) {
    return new AppError(error.message, 500, 'UNCAUGHT_EXCEPTION', {
      originalName: error.name,
      stack: error.stack,
    });
  }
  if (typeof error === 'string') {
    return new AppError(error, 500, 'STRING_EXCEPTION');
  }
  return new AppError('An unknown error occurred', 500, 'UNKNOWN_ERROR', error);
}

export function reportError(error: unknown): ErrorReport {
  const normalized = normalizeError(error);
  const report: ErrorReport = {
    message: normalized.message,
    code: normalized.code,
    statusCode: normalized.statusCode,
    stack: normalized.stack,
    timestamp: normalized.timestamp,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  };

  // In production this could send to backend /analytics/track or monitoring
  // eslint-disable-next-line no-console
  console.error('[GlobalErrorHandler]', report);
  return report;
}

export function setupGlobalErrorHandlers(): () => void {
  if (typeof window === 'undefined') return () => {};

  const errorHandler = (event: ErrorEvent) => {
    reportError(event.error || event.message);
  };

  const rejectionHandler = (event: PromiseRejectionEvent) => {
    reportError(event.reason);
  };

  window.addEventListener('error', errorHandler);
  window.addEventListener('unhandledrejection', rejectionHandler);

  return () => {
    window.removeEventListener('error', errorHandler);
    window.removeEventListener('unhandledrejection', rejectionHandler);
  };
}
