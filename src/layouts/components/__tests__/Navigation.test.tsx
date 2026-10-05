import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { Navigation } from '../Navigation';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';

describe('Navigation', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    useUIStore.setState({
      sidebarOpen: false,
    });
  });

  it('renders closed when sidebarOpen is false', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/']}>
        <Navigation />
      </MemoryRouter>
    );

    expect(html).not.toContain('Solutions &amp; Offerings');
  });

  it('renders navigation drawer links when sidebarOpen is true', () => {
    useUIStore.setState({ sidebarOpen: true });

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/']}>
        <Navigation />
      </MemoryRouter>
    );

    expect(html).toContain('Solutions &amp; Offerings');
    expect(html).toContain('Services');
    expect(html).toContain('Products');
    expect(html).toContain('Start a Project');
  });
});
