import type {
  AnalyticsOverviewMetrics,
  ConversionFunnelMetrics,
  LeadSourceMetric,
  TopPageMetric,
  TrafficStatsMetrics,
} from '../domain/entities/analytics-event.entity';

export interface CreateAnalyticsEventDto {
  type: string;
  sessionId?: string;
  userId?: string;
  page?: string;
  referrer?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  device?: string;
  browser?: string;
  properties?: Record<string, unknown>;
}

export interface FilterAnalyticsDto {
  type?: string;
  page?: string;
  sessionId?: string;
  userId?: string;
  source?: string;
  startDate?: string;
  endDate?: string;
  pageNumber?: number;
  limit?: number;
}

export interface AnalyticsPeriodDto {
  days?: number;
}

export interface AnalyticsEventResponseDto {
  id: string;
  type: string;
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
  createdAt?: string;
}

export interface AnalyticsDashboardDto {
  overview: AnalyticsOverviewMetrics;
  traffic: TrafficStatsMetrics;
  topPages: TopPageMetric[];
  leadSources: LeadSourceMetric[];
  funnel: ConversionFunnelMetrics;
}
