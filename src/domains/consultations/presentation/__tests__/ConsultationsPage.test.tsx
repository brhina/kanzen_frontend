import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConsultationsPage } from '../pages/ConsultationsPage';
import { useAuthStore } from '@/core/auth/auth.store';

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ConsultationsPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('ConsultationsPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('renders public layout aligned with leads page style', () => {
    const html = renderPage();

    // Centered header & badge
    expect(html).toContain('Direct Technical Discovery');
    expect(html).toContain('Book an Architecture Consultation');
    expect(html).toContain('Engage directly with our Principal Architects');

    // Value indicators
    expect(html).toContain('45-Minute Deep Dive');
    expect(html).toContain('Live whiteboard review');
    expect(html).toContain('Direct Screen Share');
    expect(html).toContain('Architecture teardowns');
    expect(html).toContain('Mutual NDA Protected');
    expect(html).toContain('Full IP confidentiality');

    // Consultation booking wizard form container
    expect(html).toContain('Who will be joining the session?');
    expect(html).toContain('Your Full Name');
  });

  it('renders staff dispatch dashboard when user has permission', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Staff',
        lastName: 'Manager',
        fullName: 'Staff Manager',
        email: 'staff@kanzen.tech',
        isAdmin: true,
        permissions: ['consultations:read'],
        status: 'active',
      },
    });

    const html = renderPage();

    expect(html).toContain('Consultations &amp; Discovery Desk');
    expect(html).toContain('Active Dispatch');
    expect(html).toContain('Public Booking Preview');
  });
});
