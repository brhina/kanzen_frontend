import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { HealthStatusBadge } from '../components/HealthStatusBadge';
import { HealthStatus } from '../../domain/enums/health-status.enum';

describe('HealthStatusBadge', () => {
  it('renders OPERATIONAL variant for healthy status', () => {
    const html = renderToStaticMarkup(<HealthStatusBadge status={HealthStatus.HEALTHY} />);

    expect(html).toContain('OPERATIONAL');
  });

  it('renders DEGRADED variant for degraded status', () => {
    const html = renderToStaticMarkup(<HealthStatusBadge status={HealthStatus.DEGRADED} />);

    expect(html).toContain('DEGRADED');
  });

  it('renders OFFLINE variant for unhealthy or down status', () => {
    const html = renderToStaticMarkup(<HealthStatusBadge status={HealthStatus.UNHEALTHY} />);

    expect(html).toContain('OFFLINE');
  });

  it('renders CHECKING fallback for undefined or unknown status', () => {
    const html = renderToStaticMarkup(<HealthStatusBadge status="" />);

    expect(html).toContain('CHECKING');
  });
});
