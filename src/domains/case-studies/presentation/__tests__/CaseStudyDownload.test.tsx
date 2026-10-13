import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { CaseStudyDownload } from '../components/CaseStudyDownload';

describe('CaseStudyDownload', () => {
  it('renders button variant', () => {
    const html = renderToStaticMarkup(
      <CaseStudyDownload
        title="Payment Platform"
        pdfUrl="https://downloads.veyroo.tech/study.pdf"
        variant="button"
      />
    );

    expect(html).toContain('Download PDF');
  });

  it('renders banner variant with bottom button layout for complete technical whitepaper', () => {
    const html = renderToStaticMarkup(
      <CaseStudyDownload
        title="Payment Platform"
        pdfUrl="https://downloads.veyroo.tech/study.pdf"
        variant="banner"
      />
    );

    expect(html).toContain('Complete Technical Whitepaper');
    expect(html).toContain('Download Enterprise Architecture Report');
    expect(html).toContain('Download Full Case Study');
    // Flex direction is column so button layout sits at the bottom
    expect(html).toContain('flex flex-col items-start');
    expect(html).not.toContain('sm:flex-row');
  });
});
