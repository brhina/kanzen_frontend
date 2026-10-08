import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Footer } from '../Footer';
import * as usePublicSettingsModule from '@/domains/settings/application/use-cases/usePublicSettings';

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

describe('Footer', () => {
  it('renders default company name, offerings, and operational status', () => {
    const html = renderWithProviders(<Footer />);

    expect(html).toContain('KANZEN');
    expect(html).toContain('TECH');
    expect(html).toContain('Engineering Services');
    expect(html).toContain('Enterprise Solutions');
    expect(html).toContain('Book Technical Consultation');
    expect(html).toContain('Scope &amp; Budget Estimator');
    expect(html).toContain('All Systems Operational');
    expect(html).toContain('All rights reserved.');
    expect(html).not.toContain('Executive Dashboard');
    expect(html).not.toContain('Platform &amp; Ops');
  });

  it('renders dynamic social links and copyright derived from public settings', () => {
    vi.spyOn(usePublicSettingsModule, 'usePublicSettings').mockReturnValue({
      company: {
        name: 'Kanzen Global Technologies Ltd',
        tagline: 'High-Scale Distributed Systems Architecture',
        email: 'ops@kanzen.tech',
        phone: '+254 700 000 001',
        address: 'Nairobi Silicon Savannah',
      },
      seo: {
        defaultTitle: 'Kanzen Tech | Enterprise',
        defaultDescription: 'Architecting high-concurrency systems',
      },
      contact: {
        supportEmail: 'support@kanzen.tech',
        headquarters: 'Nairobi, Kenya',
        businessHours: '24/7 Operations',
      },
      socialLinks: [
        {
          id: '1',
          key: 'social.github',
          platform: 'github',
          url: 'https://github.com/kanzen-tech',
          label: 'GitHub',
        },
        {
          id: '2',
          key: 'social.linkedin',
          platform: 'linkedin',
          url: 'https://linkedin.com/company/kanzen-tech',
          label: 'LinkedIn',
        },
        {
          id: '3',
          key: 'social.youtube',
          platform: 'youtube',
          url: 'https://youtube.com/@kanzentech',
          label: 'YouTube',
        },
      ],
      settings: {},
      getSetting: vi.fn(),
      isLoading: false,
    } as any);

    const html = renderWithProviders(<Footer />);

    // Verify dynamic company name in copyright
    expect(html).toContain('Kanzen Global Technologies Ltd');
    // Verify dynamic tagline
    expect(html).toContain('High-Scale Distributed Systems Architecture');
    // Verify dynamic social links are rendered
    expect(html).toContain('href="https://github.com/kanzen-tech"');
    expect(html).toContain('href="https://linkedin.com/company/kanzen-tech"');
    expect(html).toContain('href="https://youtube.com/@kanzentech"');
    expect(html).toContain('aria-label="GitHub"');
    expect(html).toContain('aria-label="LinkedIn"');
    expect(html).toContain('aria-label="YouTube"');

    vi.restoreAllMocks();
  });

  it('configures a 2-column grid on mobile view with Offerings and Company side by side', () => {
    const html = renderWithProviders(<Footer />);

    expect(html).toContain('grid-cols-2');
    expect(html).not.toContain('grid-cols-1');
    expect(html).toContain('col-span-2 md:col-span-1 lg:col-span-2');
  });
});
