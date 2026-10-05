import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { BreadcrumbTrail } from '../BreadcrumbTrail';

describe('BreadcrumbTrail', () => {
  it('returns null on root path /', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/']}>
        <BreadcrumbTrail />
      </MemoryRouter>
    );

    expect(html).toBe('');
  });

  it('renders breadcrumbs for nested paths', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/case-studies/enterprise-cloud']}>
        <BreadcrumbTrail />
      </MemoryRouter>
    );

    expect(html).toContain('Case Studies');
    expect(html).toContain('Enterprise Cloud');
    expect(html).toContain('href="/case-studies"');
  });

  it('formats custom hyphens and known segment dictionary labels properly', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/blog/category/systems-architecture']}>
        <BreadcrumbTrail />
      </MemoryRouter>
    );

    expect(html).toContain('Blog');
    expect(html).toContain('Category');
    expect(html).toContain('Systems Architecture');
  });
});
