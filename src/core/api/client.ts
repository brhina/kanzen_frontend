import ky, {
  isHTTPError,
  type KyInstance,
} from 'ky';
import { authStore } from '../auth/auth.store';
import { NETWORK_CONFIG } from '../config/constants';
import { env } from '../config/env';
import { AppError } from '../errors/AppError';
import type { ApiErrorResponse } from './types';

export const apiClient: KyInstance = ky.create({
  prefix: env.API_BASE_URL,
  timeout: NETWORK_CONFIG.timeoutMs,
  headers: {
    'Content-Type': 'application/json',
  },
  retry: {
    limit: 1,
    statusCodes: [408, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        // Automatically attach Bearer token if not already manually set
        if (!request.headers.has('Authorization')) {
          const token = authStore.getState().accessToken;
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        }
      },
    ],
    afterResponse: [
      async ({ request, response, retryCount }) => {
        if (response.status === 401 && retryCount === 0) {
          const url = request.url;
          const isAuthEndpoint =
            url.includes('auth/login') ||
            url.includes('auth/refresh') ||
            url.includes('auth/logout');

          // Do not attempt refresh on auth endpoints
          if (isAuthEndpoint) {
            return response;
          }

          // Attempt token refresh rotation
          const refreshed = await authStore.getState().refresh();
          if (refreshed) {
            const newToken = authStore.getState().accessToken;
            const retryHeaders = new Headers(request.headers);
            if (newToken) {
              retryHeaders.set('Authorization', `Bearer ${newToken}`);
            }

            return ky.retry({
              request: new Request(request, { headers: retryHeaders }),
              code: 'TOKEN_REFRESHED',
            });
          } else {
            authStore.getState().logout();
          }
        }
        return response;
      },
    ],
    beforeError: [
      async ({ error }) => {
        if (isHTTPError(error)) {
          const status = error.response?.status ?? 500;
          let errorBody: ApiErrorResponse | null = null;

          if (error.data && typeof error.data === 'object') {
            errorBody = error.data as ApiErrorResponse;
          } else if (typeof error.data === 'string') {
            try {
              errorBody = JSON.parse(error.data);
            } catch {
              // Not JSON
            }
          }

          if (errorBody && typeof errorBody === 'object') {
            const appError = AppError.fromApiResponse(errorBody, status);
            Object.assign(appError, {
              response: error.response,
              request: error.request,
              options: error.options,
              data: error.data,
            });
            return appError;
          }
        }
        return error;
      },
    ],
  },
});

export const api = {
  get: <T>(url: string, options?: Parameters<typeof apiClient.get>[1]) =>
    apiClient.get(url, options).json<T>(),
  post: <T>(url: string, options?: Parameters<typeof apiClient.post>[1]) =>
    apiClient.post(url, options).json<T>(),
  put: <T>(url: string, options?: Parameters<typeof apiClient.put>[1]) =>
    apiClient.put(url, options).json<T>(),
  patch: <T>(url: string, options?: Parameters<typeof apiClient.patch>[1]) =>
    apiClient.patch(url, options).json<T>(),
  delete: <T>(url: string, options?: Parameters<typeof apiClient.delete>[1]) =>
    apiClient.delete(url, options).json<T>(),
};
