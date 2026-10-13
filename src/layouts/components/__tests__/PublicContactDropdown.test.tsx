import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { PublicContactDropdown } from '../PublicContactDropdown';

function renderDropdown(initialRoute = '/') {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[initialRoute]}>
      <PublicContactDropdown />
    </MemoryRouter>
  );
}

describe('PublicContactDropdown', () => {
  it('renders trigger button labeled Contact with accessibility attributes', () => {
    const html = renderDropdown();

    expect(html).toContain('>Contact<');
    expect(html).toContain('aria-haspopup="true"');
    expect(html).toContain('aria-label="Contact and consultation options"');
  });

  it('renders consultation option with link to /consultations without descriptions or extra badges', () => {
    const html = renderDropdown();

    expect(html).toContain('href="/consultations"');
    expect(html).toContain('Consultation');
    expect(html).not.toContain('45m Advisory');
    expect(html).not.toContain('Schedule a 1-on-1 architecture');
  });

  it('renders leads option with link to /leads without descriptions or extra badges', () => {
    const html = renderDropdown();

    expect(html).toContain('href="/leads"');
    expect(html).toContain('Leads &amp; Project Scoping');
    expect(html).not.toContain('&lt; 24h Proposal');
    expect(html).not.toContain('Submit requirements, estimate scope');
  });

  it('renders contact option with link to /contact without descriptions or extra badges', () => {
    const html = renderDropdown();

    expect(html).toContain('href="/contact"');
    expect(html).toContain('Contact Us');
    expect(html).not.toContain('Direct Inquiry');
    expect(html).not.toContain('Direct message, reach corporate phone');
  });

  it('does not render header descriptions, trust footers, or extra badges', () => {
    const html = renderDropdown();

    expect(html).not.toContain('Mutual NDA Protected');
    expect(html).not.toContain('hello@veyroo.tech');
    expect(html).not.toContain('Fast Response');
    expect(html).not.toContain('Contact &amp; Engagement');
  });

  it('highlights the active section when current route is /consultations', () => {
    const html = renderDropdown('/consultations');

    // Trigger button receives active styling ring
    expect(html).toContain('ring-brand-400');
    // Consultation item is marked active with brand background
    expect(html).toContain('bg-brand-50');
  });

  it('highlights the active section when current route is /leads', () => {
    const html = renderDropdown('/leads');

    expect(html).toContain('ring-brand-400');
    expect(html).toContain('bg-brand-50');
  });

  it('highlights the active section when current route is /contact', () => {
    const html = renderDropdown('/contact');

    expect(html).toContain('ring-brand-400');
    expect(html).toContain('bg-brand-50');
  });
});
