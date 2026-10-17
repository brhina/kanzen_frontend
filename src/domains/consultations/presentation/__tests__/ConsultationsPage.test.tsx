import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConsultationsPage } from '../pages/ConsultationsPage';
import { useAuthStore } from '@/core/auth/auth.store';

const MOCK_TEST_SESSIONS = {
  items: [
    {
      id: 'session-apex',
      name: 'Marcus Vance',
      email: 'marcus.vance@apex-fin.tech',
      company: 'Apex Financial Systems',
      projectDescription: 'Corporate Kubernetes training for 18 staff engineers',
      serviceInterest: ['cloud-architecture-devops'],
      type: 'training',
      attendeesCount: 18,
      trainingTopic: 'Enterprise Cloud & Kubernetes Engineering Masterclass',
      deliveryFormat: 'virtual_interactive',
      meetingType: 'video',
      status: 'scheduled',
    },
    {
      id: 'session-datametric',
      name: 'Sarah Jenkins',
      email: 'sjenkins@datametric-labs.com',
      company: 'DataMetric Labs',
      projectDescription: 'Hands-on RAG and GenAI workshop',
      serviceInterest: ['ai-intelligent-automation'],
      type: 'training',
      attendeesCount: 12,
      trainingTopic: 'Production GenAI & LLM Systems Workshop',
      deliveryFormat: 'virtual_interactive',
      meetingType: 'video',
      status: 'scheduled',
    },
    {
      id: 'session-aurora',
      name: 'Jonathan Sterling',
      email: 'jsterling@aurora-logistics.io',
      company: 'Aurora Logistics Inc.',
      projectDescription: 'Architecture discovery session for fleet telematics',
      serviceInterest: ['cloud-architecture-devops'],
      type: 'consultation',
      attendeesCount: 1,
      meetingType: 'video',
      status: 'scheduled',
    },
  ],
  total: 3,
  page: 1,
  limit: 20,
  totalPages: 1,
};

function renderPage(initialData: any = MOCK_TEST_SESSIONS) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  if (initialData) {
    queryClient.setQueryData(['consultations', 'public', {}], initialData);
    queryClient.setQueryData(['consultations', 'admin', {}], initialData);
  }

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

  it('renders public layout with scheduled trainings and consultations showcase', () => {
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

    // Scheduled sessions showcase & drawer booking actions (like ServicesPage)
    expect(html).toContain('Book a Session');
    expect(html).toContain('Book Team Training');
    expect(html).toContain('Enterprise Cloud &amp; Kubernetes Engineering Masterclass');
    expect(html).toContain('Production GenAI &amp; LLM Systems Workshop');
    expect(html).toContain('Corporate Workshop');
    expect(html).toContain('1-on-1 Advisory');
  });

  it('renders booking wizard form inside drawer when requested', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const html = renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/consultations?book=true']}>
          <ConsultationsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

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
        email: 'staff@veyroo.tech',
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
