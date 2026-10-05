import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LeadStatusBadge } from '../components/LeadStatusBadge';
import { LeadStatus } from '../../domain/enums/lead-status.enum';

describe('LeadStatusBadge', () => {
  it('renders New status correctly', () => {
    const html = renderToStaticMarkup(<LeadStatusBadge status={LeadStatus.NEW} />);
    expect(html).toContain('New');
  });

  it('renders Qualified status correctly', () => {
    const html = renderToStaticMarkup(<LeadStatusBadge status={LeadStatus.QUALIFIED} />);
    expect(html).toContain('Qualified');
  });

  it('renders Converted status correctly', () => {
    const html = renderToStaticMarkup(<LeadStatusBadge status={LeadStatus.CONVERTED} />);
    expect(html).toContain('Converted');
  });
});
