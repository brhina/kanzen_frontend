import { describe, it, expect } from 'vitest';
import { AnalyticsMapper } from '../analytics.mapper';

describe('AnalyticsMapper', () => {
  it('maps AnalyticsEventResponseDto to domain AnalyticsEventEntity', () => {
    const dto = {
      id: 'evt-101',
      type: 'page_view',
      sessionId: 'sess-abc',
      userId: 'usr-1',
      page: '/services/cloud',
      referrer: 'https://google.com',
      source: 'organic',
      device: 'desktop',
      browser: 'chrome',
      country: 'Germany',
      properties: { durationSec: 45 },
    };

    const entity = AnalyticsMapper.toDomain(dto);

    expect(entity.id).toBe('evt-101');
    expect(entity.type).toBe('page_view');
    expect(entity.page).toBe('/services/cloud');
    expect(entity.device).toBe('desktop');
    expect(entity.country).toBe('Germany');
    expect(entity.properties).toEqual({ durationSec: 45 });
  });
});
