import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AboutPage } from '../AboutPage';
import { seedPublicSettings } from '@/test/settings.fixture';

describe('AboutPage', () => {
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
  });

  const renderAbout = () =>
    renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AboutPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

  it('renders settings-driven banner with interpolated company name and tagline', () => {
    seedPublicSettings(queryClient);

    const html = renderAbout();

    expect(html).toContain('Our Principles &amp; Mission');
    expect(html).toContain('Engineering Perfection at Enterprise Scale');
    expect(html).toContain('Veyroo Tech');
    expect(html).toContain('stands for completeness, perfection, and wholeness.');
    expect(html).toContain('Engineering Digital Mastery.');
  });

  it('renders story, mission, and vision sections from settings', () => {
    seedPublicSettings(queryClient);

    const html = renderAbout();

    expect(html).toContain('Our Story');
    expect(html).toContain('Built by Engineers, for Engineering Excellence');
    expect(html).toContain('Our Mission');
    expect(html).toContain('uncompromising completeness');
    expect(html).toContain('Our Vision');
    expect(html).toContain('strategic asset rather than a liability');
  });

  it('renders stats and company values from settings', () => {
    seedPublicSettings(queryClient);

    const html = renderAbout();

    expect(html).toContain('120+');
    expect(html).toContain('Projects Delivered');
    expect(html).toContain('99.99%');
    expect(html).toContain('Platform Uptime');
    expect(html).toContain('Architectural Rigor');
  });

  it('renders bottom CTA from settings', () => {
    seedPublicSettings(queryClient);

    const html = renderAbout();

    expect(html).toContain('Ready to elevate your engineering standard?');
    expect(html).toContain('Consult With Us');
    expect(html).toContain('href="/contact"');
  });

  it('renders backend overrides instead of any frontend copy', () => {
    seedPublicSettings(queryClient, {
      'about.banner.badge': 'Custom Override Badge',
      'about.banner.title': 'Custom Override Title',
      'about.story.title': 'Custom Story Title',
    });

    const html = renderAbout();

    expect(html).toContain('Custom Override Badge');
    expect(html).toContain('Custom Override Title');
    expect(html).toContain('Custom Story Title');
    expect(html).not.toContain('Engineering Perfection at Enterprise Scale');
    expect(html).not.toContain('Built by Engineers, for Engineering Excellence');
  });
});
