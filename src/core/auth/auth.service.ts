import { env } from '../config/env';
import type { AuthUser } from './auth.store';

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  user?: AuthUser;
}

let activeRefreshPromise: Promise<RefreshResponse | null> | null = null;

export const authService = {
  /**
   * Safely checks whether a JWT has expired without third-party dependencies.
   * @param token JWT string
   * @param offsetSeconds Margin in seconds before actual expiry to treat as expired (default 30s)
   */
  isTokenExpired(token: string, offsetSeconds = 30): boolean {
    if (!token) return true;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      const payload = JSON.parse(jsonPayload);
      if (typeof payload.exp !== 'number') return false;
      const now = Math.floor(Date.now() / 1000);
      return payload.exp <= now + offsetSeconds;
    } catch {
      return true;
    }
  },

  /**
   * Performs an isolated fetch-based token refresh call to avoid Ky client cycle.
   * Deduplicates concurrent refresh attempts with an in-flight promise.
   */
  async refreshToken(refreshToken: string): Promise<RefreshResponse | null> {
    if (!refreshToken) return null;

    if (activeRefreshPromise) {
      return activeRefreshPromise;
    }

    activeRefreshPromise = (async () => {
      try {
        const url = `${env.API_BASE_URL}/auth/refresh`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          return null;
        }

        const json = await response.json();
        const payload: RefreshResponse = json.data ?? json;
        if (payload?.accessToken && payload?.refreshToken) {
          return payload;
        }
        return null;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to refresh authentication token:', error);
        return null;
      } finally {
        activeRefreshPromise = null;
      }
    })();

    return activeRefreshPromise;
  },

  /**
   * Revokes refresh token on backend
   */
  async logout(refreshToken?: string | null, accessToken?: string | null): Promise<void> {
    if (!refreshToken) return;
    try {
      const url = `${env.API_BASE_URL}/auth/logout`;
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Ignore network errors during logout teardown
    }
  },

  /**
   * Fetches current authenticated user profile
   */
  async getCurrentUser(accessToken: string): Promise<AuthUser | null> {
    if (!accessToken) return null;
    try {
      const url = `${env.API_BASE_URL}/auth/me`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) return null;
      const json = await response.json();
      return json.data ?? json;
    } catch {
      return null;
    }
  },
};
