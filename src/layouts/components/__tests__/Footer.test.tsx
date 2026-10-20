import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Footer } from '../Footer';
import { seedPublicSettings } from '@/test/settings.fixture';

function renderWithProviders(
  ui: React.ReactElement,
  setup?: (client: QueryClient) => void,
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  setup?.(queryClient);

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
    const html = renderWithProviders(<Footer />, seedPublicSettings);

    expect(html).toContain('VEYROO');
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
    const html = renderWithProviders(<Footer />, (client) =>
      seedPublicSettings(client, {
        'company.name': 'Veyroo Global Technologies Ltd',
        'footer.description': 'High-Scale Distributed Systems Architecture',
        'social.github': 'https://github.com/veyroo-tech',
        'social.linkedin': 'https://linkedin.com/company/veyroo-tech',
        'social.youtube': 'https://youtube.com/@veyrootech',
      }),
    );

    // Verify dynamic company name in copyright
    expect(html).toContain('Veyroo Global Technologies Ltd');
    // Verify dynamic footer description sourced from settings
    expect(html).toContain('High-Scale Distributed Systems Architecture');
    // Verify dynamic social links are rendered
    expect(html).toContain('href="https://github.com/veyroo-tech"');
    expect(html).toContain('href="https://linkedin.com/company/veyroo-tech"');
    expect(html).toContain('href="https://youtube.com/@veyrootech"');
    expect(html).toContain('aria-label="GitHub"');
    expect(html).toContain('aria-label="LinkedIn"');
    expect(html).toContain('aria-label="YouTube"');
  });

  it('configures a 2-column grid on mobile view with Offerings and Company side by side', () => {
    const html = renderWithProviders(<Footer />);

    expect(html).toContain('grid-cols-2');
    expect(html).not.toContain('grid-cols-1');
    expect(html).toContain('col-span-2 md:col-span-1 lg:col-span-2');
  });
});
