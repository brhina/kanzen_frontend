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
      adminBarMinimized: false,
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
    expect(html).not.toContain('Jane Admin');
    expect(html).not.toContain('admin@kanzen.tech');
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
    expect(html).not.toContain('Editor One');
    expect(html).not.toContain('editor@kanzen.tech');
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
    expect(html).not.toContain('View format switcher');
    expect(html).not.toContain('Showcase');
    expect(html).not.toContain('<span>Manage</span>');
    expect(html).toContain('Minimize');
  });

  it('renders minimized trigger pill at the top without any icons', () => {
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
    expect(html).toContain('top-20');
    expect(html).not.toContain('bottom-4');
    expect(html).not.toContain('<svg');
  });

  it('renders Quick Access links stacked vertically and not side-by-side', () => {
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

    expect(html).toContain('Quick Access');
    // Verify vertical column stacking and full width links (no horizontal flex-wrap)
    expect(html).toContain('flex flex-col items-stretch w-full gap-1');
    expect(html).not.toContain('flex items-center gap-1 sm:gap-1.5 flex-wrap');
  });

  it('styles active tab with header nav tab styling (text-brand-600 dark:text-brand-400 font-semibold)', () => {
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
      <MemoryRouter initialEntries={['/dashboard']}>
        <AdminBar />
      </MemoryRouter>
    );

    // Verify active link has header nav tab styling
    expect(html).toContain('text-brand-600');
    expect(html).toContain('dark:text-brand-400');
    expect(html).toContain('font-semibold');
  });

  it('supports both light and dark themes across full and minimized states', () => {
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

    const fullHtml = renderToStaticMarkup(
      <MemoryRouter>
        <AdminBar />
      </MemoryRouter>
    );

    // Full state has light mode and dark mode classes
    expect(fullHtml).toContain('bg-white/95');
    expect(fullHtml).toContain('text-slate-900');
    expect(fullHtml).toContain('dark:bg-slate-950/95');
    expect(fullHtml).toContain('dark:text-slate-100');
    expect(fullHtml).toContain('border-slate-200');
    expect(fullHtml).toContain('dark:border-slate-800/80');

    // Minimized state has light mode and dark mode classes
    useUIStore.setState({ adminBarMinimized: true });
    const minHtml = renderToStaticMarkup(
      <MemoryRouter>
        <AdminBar />
      </MemoryRouter>
    );

    expect(minHtml).toContain('bg-white/95');
    expect(minHtml).toContain('text-slate-800');
    expect(minHtml).toContain('dark:bg-slate-900/95');
    expect(minHtml).toContain('dark:text-slate-100');
  });
});
