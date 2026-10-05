import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../config/constants';
import { authService } from './auth.service';
import type { Permission } from './permissions.constants';

export interface AuthUser {
  id?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  isAdmin: boolean;
  permissions: string[];
  status: string;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (tokens: AuthTokens, user: AuthUser) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  refresh: () => Promise<boolean>;

  hasPermission: (permission: Permission | string) => boolean;
  hasAnyPermission: (permissions: (Permission | string)[]) => boolean;
  hasAllPermissions: (permissions: (Permission | string)[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (tokens, user) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setTokens: (accessToken, refreshToken) => {
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      logout: () => {
        const { refreshToken, accessToken } = get();
        if (refreshToken) {
          authService.logout(refreshToken, accessToken);
        }
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      refresh: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          return false;
        }

        const result = await authService.refreshToken(refreshToken);
        if (result && result.accessToken) {
          set({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken || refreshToken,
            user: result.user ?? get().user,
            isAuthenticated: true,
          });
          return true;
        }

        get().logout();
        return false;
      },

      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        if (user.isAdmin === true) return true;
        return Array.isArray(user.permissions) && user.permissions.includes(permission);
      },

      hasAnyPermission: (permissions) => {
        const { user } = get();
        if (!user) return false;
        if (user.isAdmin === true) return true;
        if (!Array.isArray(user.permissions)) return false;
        return permissions.some((p) => user.permissions.includes(p));
      },

      hasAllPermissions: (permissions) => {
        const { user } = get();
        if (!user) return false;
        if (user.isAdmin === true) return true;
        if (!Array.isArray(user.permissions)) return false;
        return permissions.every((p) => user.permissions.includes(p));
      },
    }),
    {
      name: STORAGE_KEYS.auth,
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Vanilla store access alias for non-React modules (interceptors, services)
export const authStore = useAuthStore;
