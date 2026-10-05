import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { AuthGuard } from '../AuthGuard';
import { useAuthStore } from '../../auth.store';

describe('AuthGuard', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('renders loading spinner fallback when auth state is loading', () => {
    useAuthStore.setState({ isLoading: true });

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthGuard>
          <div>Protected Dashboard</div>
        </AuthGuard>
      </MemoryRouter>
    );

    expect(html).toContain('role="status"');
    expect(html).not.toContain('Protected Dashboard');
  });

  it('redirects (does not render children) when unauthenticated', () => {
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthGuard>
          <div id="content">Protected Dashboard</div>
        </AuthGuard>
      </MemoryRouter>
    );

    expect(html).not.toContain('id="content"');
  });

  it('renders children when user is authenticated', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Jane',
        lastName: 'Doe',
        fullName: 'Jane Doe',
        email: 'jane@kanzen.tech',
        isAdmin: false,
        permissions: [],
        status: 'active',
      },
      isLoading: false,
    });

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthGuard>
          <div id="content">Protected Dashboard</div>
        </AuthGuard>
      </MemoryRouter>
    );

    expect(html).toContain('id="content"');
    expect(html).toContain('Protected Dashboard');
  });
});
