import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ApplicationStatusBadge } from '../components/ApplicationStatusBadge';
import { ApplicationStatus } from '../../domain/enums/application-status.enum';

describe('ApplicationStatusBadge', () => {
  it('renders applied status badge correctly', () => {
    const html = renderToStaticMarkup(
      <ApplicationStatusBadge status={ApplicationStatus.APPLIED} />,
    );
    expect(html).toContain('Applied');
  });

  it('renders screening status badge correctly', () => {
    const html = renderToStaticMarkup(
      <ApplicationStatusBadge status={ApplicationStatus.SCREENING} />,
    );
    expect(html).toContain('Screening');
  });

  it('renders interview status badge correctly', () => {
    const html = renderToStaticMarkup(
      <ApplicationStatusBadge status={ApplicationStatus.INTERVIEW} />,
    );
    expect(html).toContain('Interview');
  });

  it('renders hired status badge correctly', () => {
    const html = renderToStaticMarkup(
      <ApplicationStatusBadge status={ApplicationStatus.HIRED} />,
    );
    expect(html).toContain('Hired');
  });

  it('renders rejected status badge correctly', () => {
    const html = renderToStaticMarkup(
      <ApplicationStatusBadge status={ApplicationStatus.REJECTED} />,
    );
    expect(html).toContain('Rejected');
  });
});
