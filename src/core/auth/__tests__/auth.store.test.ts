import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authService } from '../auth.service';
import { authStore, type AuthUser } from '../auth.store';
import { PERMISSIONS } from '../permissions.constants';

describe('authStore & Permission Matrix', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    authStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    vi.restoreAllMocks();
  });

  it('initializes with unauthenticated empty state', () => {
    const state = authStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.user).toBeNull();
  });

  it('updates state properly on setAuth', () => {
    const mockUser: AuthUser = {
      id: 'usr_1',
      firstName: 'Jane',
      lastName: 'Doe',
      fullName: 'Jane Doe',
      email: 'jane@kanzen.tech',
      isAdmin: false,
      permissions: [PERMISSIONS.BLOG_READ, PERMISSIONS.BLOG_WRITE],
      status: 'active',
    };

    authStore.getState().setAuth(
      { accessToken: 'mock_access_token', refreshToken: 'mock_refresh_token' },
      mockUser,
    );

    const state = authStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.accessToken).toBe('mock_access_token');
    expect(state.refreshToken).toBe('mock_refresh_token');
    expect(state.user?.email).toBe('jane@kanzen.tech');
  });

  describe('hasPermission resolution & Admin Bypass', () => {
    it('returns false when no user is logged in', () => {
      expect(authStore.getState().hasPermission(PERMISSIONS.BLOG_READ)).toBe(false);
      expect(authStore.getState().hasPermission('users:read')).toBe(false);
    });

    it('correctly bypasses all permission checks when user is admin (isAdmin: true)', () => {
      const adminUser: AuthUser = {
        id: 'adm_1',
        firstName: 'Root',
        lastName: 'Admin',
        fullName: 'Root Admin',
        email: 'admin@kanzen.tech',
        isAdmin: true,
        permissions: [], // Empty permissions array, but isAdmin is true
        status: 'active',
      };

      authStore.getState().setUser(adminUser);

      // Should grant access to ANY valid permission via admin bypass
      expect(authStore.getState().hasPermission(PERMISSIONS.USERS_DELETE)).toBe(true);
      expect(authStore.getState().hasPermission(PERMISSIONS.BLOG_PUBLISH)).toBe(true);
      expect(authStore.getState().hasPermission(PERMISSIONS.SETTINGS_WRITE)).toBe(true);
      expect(authStore.getState().hasPermission('arbitrary:permission')).toBe(true);
    });

    it('strictly checks granular permissions when user is not admin (isAdmin: false)', () => {
      const editorUser: AuthUser = {
        id: 'ed_1',
        firstName: 'Content',
        lastName: 'Editor',
        fullName: 'Content Editor',
        email: 'editor@kanzen.tech',
        isAdmin: false,
        permissions: [PERMISSIONS.BLOG_READ, PERMISSIONS.BLOG_WRITE],
        status: 'active',
      };

      authStore.getState().setUser(editorUser);

      // Granted permissions
      expect(authStore.getState().hasPermission(PERMISSIONS.BLOG_READ)).toBe(true);
      expect(authStore.getState().hasPermission(PERMISSIONS.BLOG_WRITE)).toBe(true);

      // Ungranted permissions
      expect(authStore.getState().hasPermission(PERMISSIONS.BLOG_PUBLISH)).toBe(false);
      expect(authStore.getState().hasPermission(PERMISSIONS.USERS_WRITE)).toBe(false);
      expect(authStore.getState().hasPermission(PERMISSIONS.SETTINGS_WRITE)).toBe(false);
    });

    it('correctly evaluates hasAnyPermission and hasAllPermissions', () => {
      const editorUser: AuthUser = {
        id: 'ed_2',
        firstName: 'Alex',
        lastName: 'Morgan',
        fullName: 'Alex Morgan',
        email: 'alex@kanzen.tech',
        isAdmin: false,
        permissions: [PERMISSIONS.BLOG_READ, PERMISSIONS.BLOG_WRITE],
        status: 'active',
      };

      authStore.getState().setUser(editorUser);

      expect(
        authStore
          .getState()
          .hasAnyPermission([PERMISSIONS.BLOG_WRITE, PERMISSIONS.USERS_DELETE]),
      ).toBe(true);

      expect(
        authStore
          .getState()
          .hasAnyPermission([PERMISSIONS.SETTINGS_WRITE, PERMISSIONS.USERS_DELETE]),
      ).toBe(false);

      expect(
        authStore
          .getState()
          .hasAllPermissions([PERMISSIONS.BLOG_READ, PERMISSIONS.BLOG_WRITE]),
      ).toBe(true);

      expect(
        authStore
          .getState()
          .hasAllPermissions([PERMISSIONS.BLOG_READ, PERMISSIONS.BLOG_PUBLISH]),
      ).toBe(false);
    });
  });

  describe('logout & refresh actions', () => {
    it('clears state on logout and invokes authService.logout', () => {
      const serviceLogoutSpy = vi.spyOn(authService, 'logout').mockResolvedValue(undefined);

      authStore.getState().setAuth(
        { accessToken: 'acc_tok', refreshToken: 'ref_tok' },
        {
          id: '1',
          firstName: 'A',
          lastName: 'B',
          fullName: 'A B',
          email: 'a@b.com',
          isAdmin: false,
          permissions: [],
          status: 'active',
        },
      );

      authStore.getState().logout();

      const state = authStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.user).toBeNull();
      expect(serviceLogoutSpy).toHaveBeenCalledWith('ref_tok', 'acc_tok');
    });

    it('successfully updates tokens on refresh', async () => {
      vi.spyOn(authService, 'refreshToken').mockResolvedValue({
        accessToken: 'new_acc_token',
        refreshToken: 'new_ref_token',
      });

      authStore.getState().setTokens('old_acc', 'old_ref');

      const success = await authStore.getState().refresh();
      expect(success).toBe(true);
      expect(authStore.getState().accessToken).toBe('new_acc_token');
      expect(authStore.getState().refreshToken).toBe('new_ref_token');
    });

    it('clears session if refresh fails', async () => {
      vi.spyOn(authService, 'refreshToken').mockResolvedValue(null);

      authStore.getState().setTokens('old_acc', 'old_ref');

      const success = await authStore.getState().refresh();
      expect(success).toBe(false);
      expect(authStore.getState().isAuthenticated).toBe(false);
      expect(authStore.getState().accessToken).toBeNull();
    });
  });
});
