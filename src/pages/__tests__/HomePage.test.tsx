import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomePage } from '../HomePage';
import { useUIStore } from '@/core/stores/ui.store';

describe('HomePage', () => {
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

    useUIStore.setState({
      isEditMode: false,
    });
  });

  const renderHome = () => {
    return renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('renders hero section and core competencies', () => {
    const html = renderHome();

    expect(html).toContain('High-Impact Engineering');
    expect(html).toContain('Architecture &amp; AI');
    expect(html).toContain('Core Competencies');
    expect(html).toContain('Enterprise Solutions');
    expect(html).toContain('AI &amp; Deep Learning');
  });

  it('renders single testimonial carousel in full width with horizontal controls on the home page', () => {
    const html = renderHome();

    // Section title & badge
    expect(html).toContain('Client Endorsements');
    expect(html).toContain('Trusted by High-Velocity Engineering Teams');

    // First slide author and company in full-width single carousel
    expect(html).toContain('Sarah Connor');
    expect(html).toContain('Apex Distributed Systems');

    // Controls for horizontal navigation / one-by-one slide changing
    expect(html).toContain('Previous Testimonial');
    expect(html).toContain('Next Testimonial');
    expect(html).toContain('Go to slide 1');

    // Link to all client endorsements
    expect(html).toContain('View All Client Endorsements');
    expect(html).toContain('/testimonials');
  });

  it('renders inline edit banner when isEditMode is true', () => {
    useUIStore.setState({ isEditMode: true });

    const html = renderHome();

    expect(html).toContain('Inline Editing Mode Active');
  });
});
