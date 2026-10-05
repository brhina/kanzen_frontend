import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StarRating } from '../components/StarRating';

describe('StarRating', () => {
  it('renders 5 star buttons by default', () => {
    const html = renderToStaticMarkup(<StarRating rating={4} />);

    expect(html).toContain('1 of 5 stars');
    expect(html).toContain('4 of 5 stars');
    expect(html).toContain('5 of 5 stars');
  });

  it('applies amber styling for filled stars', () => {
    const html = renderToStaticMarkup(<StarRating rating={3} />);

    expect(html).toContain('text-amber-400');
  });
});
