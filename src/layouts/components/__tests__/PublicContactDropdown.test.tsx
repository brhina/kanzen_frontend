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

  it('renders consultation option with link to /consultations and descriptive details', () => {
    const html = renderDropdown();

    expect(html).toContain('href="/consultations"');
    expect(html).toContain('Consultation');
    expect(html).toContain('45m Advisory');
    expect(html).toContain('Schedule a 1-on-1 architecture');
  });

  it('renders leads option with link to /leads and scoping estimator details', () => {
    const html = renderDropdown();

    expect(html).toContain('href="/leads"');
    expect(html).toContain('Leads &amp; Project Scoping');
    expect(html).toContain('&lt; 24h Proposal');
    expect(html).toContain('Submit requirements, estimate scope');
  });

  it('renders contact option with link to /contact and direct inquiry details', () => {
    const html = renderDropdown();

    expect(html).toContain('href="/contact"');
    expect(html).toContain('Contact Us');
    expect(html).toContain('Direct Inquiry');
    expect(html).toContain('Direct message, reach corporate phone');
  });

  it('renders trust reassurance and quick support email in dropdown footer', () => {
    const html = renderDropdown();

    expect(html).toContain('Mutual NDA Protected');
    expect(html).toContain('hello@kanzen.tech');
    expect(html).toContain('Fast Response');
  });

  it('highlights the active section when current route is /consultations', () => {
    const html = renderDropdown('/consultations');

    // Trigger button receives active styling ring
    expect(html).toContain('ring-brand-400');
    // Consultation item is marked active with brand background
    expect(html).toContain('bg-brand-50/90');
  });

  it('highlights the active section when current route is /leads', () => {
    const html = renderDropdown('/leads');

    expect(html).toContain('ring-brand-400');
  });

  it('highlights the active section when current route is /contact', () => {
    const html = renderDropdown('/contact');

    expect(html).toContain('ring-brand-400');
  });
});
