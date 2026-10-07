import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardPage } from '../DashboardPage';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';

describe('DashboardPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    useUIStore.setState({
      isEditMode: false,
    });
  });

  const renderDashboard = () => {
    return renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('renders Member Workspace for standard authenticated users', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Alice',
        lastName: 'Client',
        fullName: 'Alice Client',
        email: 'alice@client.com',
        isAdmin: false,
        permissions: [],
        status: 'active',
      },
    });

    const html = renderDashboard();

    expect(html).toContain('Member Workspace');
    expect(html).toContain('Alice Client');
    expect(html).toContain('Active Member');
    expect(html).toContain('Active Consultations');
    expect(html).toContain('Career Applications');
    expect(html).toContain('Start an Enterprise Project');
    expect(html).not.toContain('Executive Operations Console');
    expect(html).not.toContain('Administrative Command Center');
  });

  it('renders Executive Operations Console with live KPI metrics for admin staff', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Bob',
        lastName: 'Admin',
        fullName: 'Bob Admin',
        email: 'bob@kanzen.tech',
        isAdmin: true,
        permissions: ['system:admin'],
        status: 'active',
      },
    });

    const html = renderDashboard();

    expect(html).toContain('Executive Operations Console');
    expect(html).toContain('Bob Admin');
    expect(html).toContain('Active Leads');
    expect(html).toContain('Pending Reviews');
    expect(html).toContain('Unread Inquiries');
    expect(html).toContain('Server Health');
    expect(html).toContain('Administrative Command Center');
    expect(html).toContain('Recent Administrative Mutations');
    expect(html).toContain('/settings');
    expect(html).toContain('/health');
    expect(html).toContain('/audit');
  });

  it('displays Edit Mode badge when UI edit mode is enabled', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        firstName: 'Bob',
        lastName: 'Admin',
        fullName: 'Bob Admin',
        email: 'bob@kanzen.tech',
        isAdmin: true,
        permissions: [],
        status: 'active',
      },
    });
    useUIStore.setState({ isEditMode: true });

    const html = renderDashboard();

    expect(html).toContain('Edit Mode');
  });
});
