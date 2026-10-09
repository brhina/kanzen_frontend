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
    expect(html).toContain('Process');
    expect(html).toContain('Blog');
    expect(html).toContain('Careers');
    expect(html).toContain('About');
    expect(html).not.toContain('Book');
    expect(html).not.toContain('Hiring');
    expect(html).not.toContain('Testimonials');
  });

  it('renders unified Contact dropdown button with consultation, leads, and contact options for public visitors', () => {
    const html = renderWithProviders(<Header />);

    expect(html).toContain('Sign In');
    // Unified contact dropdown trigger button
    expect(html).toContain('>Contact<');
    // Dropdown options
    expect(html).toContain('/consultations');
    expect(html).toContain('Consultation');
    expect(html).toContain('45m Advisory');
    expect(html).toContain('/leads');
    expect(html).toContain('Leads');
    expect(html).toContain('Project Scoping');
    expect(html).toContain('/contact');
    expect(html).toContain('Contact Us');
  });

  it('renders user avatar and contact dropdown for authenticated non-elevated users', () => {
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
    // Contact dropdown is still accessible to non-elevated authenticated users
    expect(html).toContain('>Contact<');
  });

  it('renders navbar at increased full width with w-full', () => {
    const html = renderWithProviders(<Header />);

    expect(html).toContain('w-full');
    expect(html).not.toContain('max-w-7xl');
  });

  it('omits admin bar routes and public contact dropdown for elevated administrators', () => {
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

    // For elevated admins, public intake button is omitted (accessed via AdminBar)
    expect(html).not.toContain('>Contact<');
  });
});
