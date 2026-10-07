import type { AnalyticsEventTypeValue } from '../enums/analytics-event-type.enum';

export interface AnalyticsEventEntity {
  id: string;
  type: AnalyticsEventTypeValue | string;
  sessionId?: string;
  userId?: string;
  page?: string;
  referrer?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  device?: string;
  browser?: string;
  country?: string;
  properties?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: string | Date;
}

export interface AnalyticsOverviewMetrics {
  totalPageViews: number;
  uniqueVisitors: number;
  totalLeads: number;
  totalConsultations: number;
  conversionRate: number;
  periodDays: number;
}

export interface LeadSourceMetric {
  source: string;
  medium?: string;
  campaign?: string;
  leadCount: number;
}

export interface TopPageMetric {
  page: string;
  views: number;
  uniqueVisitors: number;
}

export interface ConversionFunnelMetrics {
  visitors: number;
  pageViews: number;
  ctaClicks: number;
  leads: number;
  consultations: number;
}

export interface TrafficStatsMetrics {
  devices: Array<{ device: string; count: number; percentage: number }>;
  browsers: Array<{ browser: string; count: number; percentage: number }>;
  topCountries: Array<{ country: string; count: number }>;
}

export interface DailyPageViewMetric {
  date: string;
  views: number;
  visitors: number;
}

export interface AnalyticsDashboardPayload {
  overview: AnalyticsOverviewMetrics;
  traffic: TrafficStatsMetrics;
  topPages: TopPageMetric[];
  leadSources: LeadSourceMetric[];
  funnel: ConversionFunnelMetrics;
  dailyTrends?: DailyPageViewMetric[];
}
