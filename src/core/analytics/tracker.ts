import { API_ENDPOINTS } from '../api/endpoints';
import { env } from '../config/env';

export interface AnalyticsEvent {
  eventType: string;
  eventName: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
  path?: string;
  referrer?: string;
}

export const analyticsTracker = {
  /**
   * Tracks an event by sending it to backend /analytics/track
   */
  async track(event: AnalyticsEvent): Promise<void> {
    try {
      const payload: AnalyticsEvent = {
        ...event,
        path: event.path || (typeof window !== 'undefined' ? window.location.pathname : ''),
        referrer: event.referrer || (typeof document !== 'undefined' ? document.referrer : ''),
        timestamp: event.timestamp || new Date().toISOString(),
      };

      const url = `${env.API_BASE_URL}/${API_ENDPOINTS.analytics.track}`;

      // Prefer navigator.sendBeacon when available for non-blocking telemetry
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        const enqueued = navigator.sendBeacon(url, blob);
        if (enqueued) return;
      }

      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch {
      // Telemetry failures must never disrupt user experience
    }
  },

  /**
   * Convenience helper to track page views
   */
  trackPageView(pageName: string, properties?: Record<string, unknown>): void {
    this.track({
      eventType: 'PAGE_VIEW',
      eventName: pageName,
      properties,
    });
  },
};
