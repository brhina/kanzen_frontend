import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { JobTypeBadge } from '../components/JobTypeBadge';
import { JobStatusBadge } from '../components/JobStatusBadge';

describe('JobTypeBadge', () => {
  it('renders employment type label correctly', () => {
    const html = renderToStaticMarkup(<JobTypeBadge type="full-time" />);
    expect(html).toContain('Full-Time');
  });

  it('renders work mode badge correctly', () => {
    const html = renderToStaticMarkup(<JobTypeBadge mode="remote" />);
    expect(html).toContain('Remote');
  });

  it('renders experience level badge correctly', () => {
    const html = renderToStaticMarkup(<JobTypeBadge level="senior" />);
    expect(html).toContain('Senior');
  });
});

describe('JobStatusBadge', () => {
  it('renders open status badge correctly', () => {
    const html = renderToStaticMarkup(<JobStatusBadge status="open" />);
    expect(html).toContain('Open');
  });

  it('renders draft status badge correctly', () => {
    const html = renderToStaticMarkup(<JobStatusBadge status="draft" />);
    expect(html).toContain('Draft');
  });

  it('renders paused status badge correctly', () => {
    const html = renderToStaticMarkup(<JobStatusBadge status="paused" />);
    expect(html).toContain('Paused');
  });
});
