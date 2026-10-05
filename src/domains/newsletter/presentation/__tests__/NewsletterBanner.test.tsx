import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NewsletterBanner } from '../components/NewsletterBanner';

describe('NewsletterBanner', () => {
  it('renders default title and call to action correctly', () => {
    const queryClient = new QueryClient();
    const html = renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <NewsletterBanner />
      </QueryClientProvider>,
    );

    expect(html).toContain('Stay Ahead of Architectural Shifts');
    expect(html).toContain('The Kanzen Architecture Dispatch');
    expect(html).toContain('Subscribe');
  });

  it('renders custom title and subtitle when provided', () => {
    const queryClient = new QueryClient();
    const html = renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <NewsletterBanner
          title="Custom Architecture Insights"
          subtitle="Specialized deep dives for software architects."
        />
      </QueryClientProvider>,
    );

    expect(html).toContain('Custom Architecture Insights');
    expect(html).toContain('Specialized deep dives for software architects.');
  });
});
