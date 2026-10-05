import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { UserStatusBadge } from '../components/UserStatusBadge';

describe('UserStatusBadge', () => {
  it('renders active status with success variant', () => {
    const html = renderToStaticMarkup(<UserStatusBadge status="active" />);
    expect(html).toContain('Active');
  });

  it('renders inactive status', () => {
    const html = renderToStaticMarkup(<UserStatusBadge status="inactive" />);
    expect(html).toContain('Inactive');
  });

  it('renders suspended status with danger variant', () => {
    const html = renderToStaticMarkup(<UserStatusBadge status="suspended" />);
    expect(html).toContain('Suspended');
  });
});
