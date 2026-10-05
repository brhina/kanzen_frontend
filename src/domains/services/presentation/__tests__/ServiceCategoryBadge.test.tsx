import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ServiceCategoryBadge } from '../components/ServiceCategoryBadge';
import { ServiceCategory } from '../../domain/enums/service-category.enum';

describe('ServiceCategoryBadge', () => {
  it('renders Custom Software label correctly', () => {
    const html = renderToStaticMarkup(
      <ServiceCategoryBadge category={ServiceCategory.CUSTOM_SOFTWARE} />,
    );
    expect(html).toContain('Custom Software');
  });

  it('renders SaaS Engineering label correctly', () => {
    const html = renderToStaticMarkup(
      <ServiceCategoryBadge category={ServiceCategory.SAAS} />,
    );
    expect(html).toContain('SaaS Engineering');
  });

  it('renders Cloud & DevOps label correctly', () => {
    const html = renderToStaticMarkup(
      <ServiceCategoryBadge category={ServiceCategory.CLOUD} />,
    );
    expect(html).toContain('Cloud &amp; DevOps');
  });
});
