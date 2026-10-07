import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { AdminBar } from '../AdminBar';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';

describe('AdminBar', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    useUIStore.setState({
      isEditMode: false,
      viewMode: 'grid',
    });
  });

  it('does not render for public unauthenticated visitors', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <AdminBar />
      </MemoryRouter>
    );

    expect(html).toBe('');
  });

  it('does not render for authenticated users with zero elevated permissions and isAdmin false', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Public',
        lastName: 'User',
        fullName: 'Public User',
        email: 'public@kanzen.tech',
        isAdmin: false,
        permissions: [],
        status: 'active',
      },
    });

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <AdminBar />
      </MemoryRouter>
    );

    expect(html).toBe('');
  });

  it('renders for administrator with Super Admin badge and edit mode controls', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Jane',
        lastName: 'Admin',
        fullName: 'Jane Admin',
        email: 'admin@kanzen.tech',
        isAdmin: true,
        permissions: [],
        status: 'active',
      },
    });

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <AdminBar />
      </MemoryRouter>
    );

    expect(html).toContain('Super Admin');
    expect(html).toContain('Jane Admin');
    expect(html).toContain('Edit Mode:');
    expect(html).toContain('/dashboard');
    expect(html).toContain('/leads');
    expect(html).toContain('/applications');
    expect(html).toContain('/settings');
  });

  it('renders for staff member with explicit permissions', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Editor',
        lastName: 'One',
        fullName: 'Editor One',
        email: 'editor@kanzen.tech',
        isAdmin: false,
        permissions: ['blog:write'],
        status: 'active',
      },
    });

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <AdminBar />
      </MemoryRouter>
    );

    expect(html).toContain('Staff Editor');
    expect(html).toContain('Editor One');
  });

  it('reflects active Edit Mode ON state', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Jane',
        lastName: 'Admin',
        fullName: 'Jane Admin',
        email: 'admin@kanzen.tech',
        isAdmin: true,
        permissions: [],
        status: 'active',
      },
    });
    useUIStore.setState({ isEditMode: true });

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <AdminBar />
      </MemoryRouter>
    );

    expect(html).toContain('ON');
  });

  it('renders right-side sidebar layout classes on lg viewports', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Jane',
        lastName: 'Admin',
        fullName: 'Jane Admin',
        email: 'admin@kanzen.tech',
        isAdmin: true,
        permissions: [],
        status: 'active',
      },
    });

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <AdminBar />
      </MemoryRouter>
    );

    expect(html).toContain('lg:fixed');
    expect(html).toContain('lg:top-16');
    expect(html).toContain('lg:right-0');
    expect(html).toContain('lg:w-64');
  });

  it('contains zero svg icons beside or within buttons across all controls', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Jane',
        lastName: 'Admin',
        fullName: 'Jane Admin',
        email: 'admin@kanzen.tech',
        isAdmin: true,
        permissions: [],
        status: 'active',
      },
    });

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <AdminBar />
      </MemoryRouter>
    );

    // Verify absolutely no svg icons are rendered in the entire AdminBar
    expect(html).not.toContain('<svg');
    // Verify text labels are fully present
    expect(html).toContain('Dashboard');
    expect(html).toContain('Leads');
    expect(html).toContain('Recruiting');
    expect(html).toContain('Media');
    expect(html).toContain('Users');
    expect(html).toContain('Settings');
    expect(html).toContain('Showcase');
    expect(html).toContain('Manage');
    expect(html).toContain('Minimize');
  });

  it('renders minimized trigger pill without any icons', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Jane',
        lastName: 'Admin',
        fullName: 'Jane Admin',
        email: 'admin@kanzen.tech',
        isAdmin: true,
        permissions: [],
        status: 'active',
      },
    });
    useUIStore.setState({ adminBarMinimized: true });

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <AdminBar />
      </MemoryRouter>
    );

    expect(html).toContain('Admin Bar');
    expect(html).not.toContain('<svg');
  });
});
