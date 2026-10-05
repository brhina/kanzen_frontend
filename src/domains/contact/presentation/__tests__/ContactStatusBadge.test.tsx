import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ContactStatusBadge } from '../components/ContactStatusBadge';
import { ContactStatus } from '../../domain/enums/contact-status.enum';

describe('ContactStatusBadge', () => {
  it('renders Pending status correctly', () => {
    const html = renderToStaticMarkup(
      <ContactStatusBadge status={ContactStatus.PENDING} />,
    );
    expect(html).toContain('Pending');
  });

  it('renders Read status correctly', () => {
    const html = renderToStaticMarkup(
      <ContactStatusBadge status={ContactStatus.READ} />,
    );
    expect(html).toContain('Read');
  });

  it('renders Replied status correctly', () => {
    const html = renderToStaticMarkup(
      <ContactStatusBadge status={ContactStatus.REPLIED} />,
    );
    expect(html).toContain('Replied');
  });
});
