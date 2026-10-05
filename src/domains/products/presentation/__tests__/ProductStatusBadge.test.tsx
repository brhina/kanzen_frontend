import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProductStatusBadge } from '../components/ProductStatusBadge';
import { ProductStatus } from '../../domain/enums/product-status.enum';

describe('ProductStatusBadge', () => {
  it('renders Live status label correctly', () => {
    const html = renderToStaticMarkup(<ProductStatusBadge status={ProductStatus.LIVE} />);
    expect(html).toContain('Live in Production');
  });

  it('renders Beta status label correctly', () => {
    const html = renderToStaticMarkup(<ProductStatusBadge status={ProductStatus.BETA} />);
    expect(html).toContain('Public Beta');
  });

  it('renders Coming Soon status label correctly', () => {
    const html = renderToStaticMarkup(<ProductStatusBadge status={ProductStatus.COMING_SOON} />);
    expect(html).toContain('Coming Soon');
  });
});
