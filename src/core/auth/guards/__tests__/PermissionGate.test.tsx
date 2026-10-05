import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PermissionGate } from '../PermissionGate';
import { useAuthStore } from '../../auth.store';

describe('PermissionGate', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('renders fallback when unauthenticated', () => {
    const html = renderToStaticMarkup(
      <PermissionGate permission="blog:write" fallback={<div id="fallback">No Access</div>}>
        <div id="content">Protected Content</div>
      </PermissionGate>
    );

    expect(html).toContain('id="fallback"');
    expect(html).not.toContain('id="content"');
  });

  it('renders children when authenticated user has the exact permission', () => {
    useAuthStore.getState().setAuth(
      { accessToken: 'mock-token', refreshToken: 'mock-refresh' },
      {
        firstName: 'Staff',
        lastName: 'Editor',
        fullName: 'Staff Editor',
        email: 'editor@kanzen.tech',
        isAdmin: false,
        permissions: ['blog:write', 'blog:read'],
        status: 'active',
      }
    );

    const html = renderToStaticMarkup(
      <PermissionGate permission="blog:write" fallback={<div>No Access</div>}>
        <div id="content">Editor Content</div>
      </PermissionGate>
    );

    expect(html).toContain('id="content"');
    expect(html).not.toContain('No Access');
  });

  it('renders fallback when authenticated user lacks the required permission', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Staff',
        lastName: 'Editor',
        fullName: 'Staff Editor',
        email: 'editor@kanzen.tech',
        isAdmin: false,
        permissions: ['blog:read'],
        status: 'active',
      },
    });

    const html = renderToStaticMarkup(
      <PermissionGate permission="blog:delete" fallback={<div id="fallback">Forbidden</div>}>
        <div id="content">Delete Button</div>
      </PermissionGate>
    );

    expect(html).toContain('id="fallback"');
    expect(html).not.toContain('Delete Button');
  });

  it('grants full access to admin user via admin bypass even if permission not explicitly listed', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Admin',
        lastName: 'User',
        fullName: 'Admin User',
        email: 'admin@kanzen.tech',
        isAdmin: true,
        permissions: [],
        status: 'active',
      },
    });

    const html = renderToStaticMarkup(
      <PermissionGate permission="users:delete" fallback={<div>Forbidden</div>}>
        <div id="content">Admin Delete Action</div>
      </PermissionGate>
    );

    expect(html).toContain('id="content"');
    expect(html).not.toContain('Forbidden');
  });

  it('supports array of permissions with mode="any"', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Support',
        lastName: 'Agent',
        fullName: 'Support Agent',
        email: 'support@kanzen.tech',
        isAdmin: false,
        permissions: ['leads:read'],
        status: 'active',
      },
    });

    const html = renderToStaticMarkup(
      <PermissionGate
        permission={['leads:read', 'leads:write']}
        mode="any"
        fallback={<div>Denied</div>}
      >
        <div id="content">Leads View</div>
      </PermissionGate>
    );

    expect(html).toContain('id="content"');
  });

  it('enforces requireAdmin strictly', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Staff',
        lastName: 'Editor',
        fullName: 'Staff Editor',
        email: 'editor@kanzen.tech',
        isAdmin: false,
        permissions: ['settings:write'],
        status: 'active',
      },
    });

    const nonAdminHtml = renderToStaticMarkup(
      <PermissionGate requireAdmin fallback={<div id="fallback">Admin Only</div>}>
        <div id="content">Danger Zone</div>
      </PermissionGate>
    );
    expect(nonAdminHtml).toContain('id="fallback"');
    expect(nonAdminHtml).not.toContain('Danger Zone');

    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Super',
        lastName: 'Admin',
        fullName: 'Super Admin',
        email: 'root@kanzen.tech',
        isAdmin: true,
        permissions: [],
        status: 'active',
      },
    });

    const adminHtml = renderToStaticMarkup(
      <PermissionGate requireAdmin fallback={<div id="fallback">Admin Only</div>}>
        <div id="content">Danger Zone</div>
      </PermissionGate>
    );
    expect(adminHtml).toContain('id="content"');
  });
});
