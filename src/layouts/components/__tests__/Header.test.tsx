import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { Header } from '../Header';
import { useAuthStore } from '@/core/auth/auth.store';

describe('Header', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('renders brand identity and primary navigation items', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    );

    expect(html).toContain('KANZEN');
    expect(html).toContain('TECH');
    expect(html).toContain('Services');
    expect(html).toContain('Solutions');
    expect(html).toContain('Products');
    expect(html).toContain('Portfolio');
    expect(html).toContain('Case Studies');
    expect(html).toContain('Blog');
    expect(html).toContain('About');
    expect(html).toContain('Contact');
  });

  it('renders Sign In and Start Project CTA for public visitors', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    );

    expect(html).toContain('Sign In');
    expect(html).toContain('Start Project');
  });

  it('renders user avatar when authenticated', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Alex',
        lastName: 'Morgan',
        fullName: 'Alex Morgan',
        email: 'alex@kanzen.tech',
        isAdmin: false,
        permissions: [],
        status: 'active',
      },
    });

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    );

    expect(html).toContain('AM'); // Initials on Avatar
    expect(html).not.toContain('Sign In');
  });
});
