import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { PermissionGuard } from '../PermissionGuard';
import { useAuthStore } from '../../auth.store';

describe('PermissionGuard', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('renders loading state when isLoading is true', () => {
    useAuthStore.setState({ isLoading: true });

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/audit']}>
        <PermissionGuard permission="audit:read">
          <div>Protected Audit</div>
        </PermissionGuard>
      </MemoryRouter>
    );

    expect(html).toContain('role="status"');
    expect(html).not.toContain('Protected Audit');
  });

  it('does not render children when user lacks permission', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Viewer',
        lastName: 'User',
        fullName: 'Viewer User',
        email: 'viewer@kanzen.tech',
        isAdmin: false,
        permissions: ['blog:read'],
        status: 'active',
      },
      isLoading: false,
    });

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/audit']}>
        <PermissionGuard
          permission="audit:read"
          fallback={<div id="denied">Access Denied</div>}
        >
          <div id="content">Protected Audit Content</div>
        </PermissionGuard>
      </MemoryRouter>
    );

    expect(html).toContain('id="denied"');
    expect(html).not.toContain('id="content"');
  });

  it('renders children when user has permission', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Auditor',
        lastName: 'Staff',
        fullName: 'Auditor Staff',
        email: 'auditor@kanzen.tech',
        isAdmin: false,
        permissions: ['audit:read'],
        status: 'active',
      },
      isLoading: false,
    });

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/audit']}>
        <PermissionGuard permission="audit:read">
          <div id="content">Protected Audit Content</div>
        </PermissionGuard>
      </MemoryRouter>
    );

    expect(html).toContain('id="content"');
    expect(html).toContain('Protected Audit Content');
  });

  it('renders children for admin user via admin bypass', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Root',
        lastName: 'Admin',
        fullName: 'Root Admin',
        email: 'admin@kanzen.tech',
        isAdmin: true,
        permissions: [],
        status: 'active',
      },
      isLoading: false,
    });

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/audit']}>
        <PermissionGuard permission="audit:read">
          <div id="content">Protected Audit Content</div>
        </PermissionGuard>
      </MemoryRouter>
    );

    expect(html).toContain('id="content"');
  });
});
