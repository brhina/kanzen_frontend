import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { NotificationBadge } from '../components/NotificationBadge';

describe('NotificationBadge', () => {
  it('renders nothing when count is 0 or undefined', () => {
    const htmlZero = renderToStaticMarkup(<NotificationBadge count={0} />);
    expect(htmlZero).toBe('');

    const htmlUndef = renderToStaticMarkup(<NotificationBadge count={undefined} />);
    expect(htmlUndef).toBe('');
  });

  it('renders exact count when count is between 1 and 99', () => {
    const html = renderToStaticMarkup(<NotificationBadge count={7} />);
    expect(html).toContain('7');
  });

  it('renders "99+" when count exceeds 99', () => {
    const html = renderToStaticMarkup(<NotificationBadge count={150} />);
    expect(html).toContain('99+');
  });
});
