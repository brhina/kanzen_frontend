import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from '../Header';
import { useAuthStore } from '@/core/auth/auth.store';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

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
    const html = renderWithProviders(<Header />);

    expect(html).toContain('KANZEN');
    expect(html).toContain('TECH');
    expect(html).toContain('Services');
    expect(html).toContain('Solutions');
    expect(html).toContain('Products');
    expect(html).toContain('Portfolio');
    expect(html).toContain('Case Studies');
    expect(html).toContain('Consultations');
    expect(html).toContain('Leads');
    expect(html).toContain('Blog');
    expect(html).toContain('Careers');
    expect(html).toContain('About');
    expect(html).not.toContain('Book');
    expect(html).not.toContain('Hiring');
    expect(html).not.toContain('>Contact<');
    expect(html).not.toContain('Testimonials');
  });

  it('renders Sign In and Start Project CTA for public visitors', () => {
    const html = renderWithProviders(<Header />);

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

    const html = renderWithProviders(<Header />);

    expect(html).toContain('AM'); // Initials on Avatar
    expect(html).toContain('Alex Morgan'); // User name displayed with profile image
    expect(html).not.toContain('Sign In');
  });

  it('renders navbar at increased full width with w-full and no icon in Start Project button', () => {
    const html = renderWithProviders(<Header />);

    expect(html).toContain('w-full');
    expect(html).not.toContain('max-w-7xl');
    // Start Project button exists without any icons inside
    expect(html).toContain('Start Project');
  });

  it('omits admin bar routes from header navigation tabs for elevated administrators', () => {
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

    const html = renderWithProviders(<Header />);

    // General public routes remain in header tabs
    expect(html).toContain('Services');
    expect(html).toContain('Solutions');
    expect(html).toContain('Products');
    expect(html).toContain('Case Studies');
    expect(html).toContain('Blog');

    // Admin bar routes must NOT be in header tabs for admins
    expect(html).not.toContain('Consultations');
    expect(html).not.toContain('Leads');
  });
});
