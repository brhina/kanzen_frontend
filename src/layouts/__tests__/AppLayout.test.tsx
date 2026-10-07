import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { AppLayout } from '../AppLayout';
import { AuthLayout } from '../AuthLayout';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';

describe('Layouts', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    useUIStore.setState({
      adminBarMinimized: false,
    });
  });

  describe('AppLayout', () => {
    it('renders header, main outlet, and footer for public visitors without AdminBar', () => {
      const html = renderToStaticMarkup(
        <MemoryRouter initialEntries={['/']}>
          <AppLayout />
        </MemoryRouter>
      );

      expect(html).toContain('KANZEN');
      expect(html).toContain('TECH');
      expect(html).toContain('All Systems Operational');
      expect(html).not.toContain('Super Admin');
      expect(html).not.toContain('Staff Editor');
    });

    it('dynamically injects AdminBar when an administrator is authenticated', () => {
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
        <MemoryRouter initialEntries={['/']}>
          <AppLayout />
        </MemoryRouter>
      );

      expect(html).toContain('Super Admin');
      expect(html).toContain('Edit Mode:');
      expect(html).toContain('Admin User');
      expect(html).toContain('lg:pr-64');
    });

    it('omits lg:pr-64 right offset when AdminBar is minimized', () => {
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
      useUIStore.setState({ adminBarMinimized: true });

      const html = renderToStaticMarkup(
        <MemoryRouter initialEntries={['/']}>
          <AppLayout />
        </MemoryRouter>
      );

      expect(html).not.toContain('lg:pr-64');
    });

    it('renders navbar at full width without right offset, while content shell receives offset', () => {
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
        <MemoryRouter initialEntries={['/']}>
          <AppLayout />
        </MemoryRouter>
      );

      const headerTagMatch = html.match(/<header[^>]*>/);
      expect(headerTagMatch).not.toBeNull();
      expect(headerTagMatch![0]).not.toContain('lg:pr-64');
      expect(html).toContain('lg:pr-64');
    });
  });

  describe('AuthLayout', () => {
    it('renders auth shell with brand link and encryption footer', () => {
      const html = renderToStaticMarkup(
        <MemoryRouter initialEntries={['/login']}>
          <AuthLayout />
        </MemoryRouter>
      );

      expect(html).toContain('Back to Site');
      expect(html).toContain('Enterprise End-to-End Encryption');
    });
  });
});
