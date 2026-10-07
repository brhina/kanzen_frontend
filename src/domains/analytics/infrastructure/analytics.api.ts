import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  CreateAnalyticsEventDto,
  FilterAnalyticsDto,
  AnalyticsEventResponseDto,
  AnalyticsDashboardDto,
} from './analytics.dto';
import type {
  AnalyticsOverviewMetrics,
  ConversionFunnelMetrics,
  LeadSourceMetric,
  TopPageMetric,
  TrafficStatsMetrics,
} from '../domain/entities/analytics-event.entity';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const analyticsApi = {
  /**
   * Track telemetry event from client
   */
  async track(dto: CreateAnalyticsEventDto): Promise<AnalyticsEventResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.analytics.track, {
        json: dto,
      })
      .json<ApiResponse<AnalyticsEventResponseDto> | AnalyticsEventResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Get full aggregated analytics dashboard payload
   */
  async getDashboard(days = 30): Promise<AnalyticsDashboardDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.analytics.dashboard, {
        searchParams: { days: String(days) },
      })
      .json<ApiResponse<AnalyticsDashboardDto> | AnalyticsDashboardDto>();
    return unwrapResponse(res);
  },

  /**
   * Get high-level overview KPIs
   */
  async getOverview(days = 30): Promise<AnalyticsOverviewMetrics> {
    const res = await apiClient
      .get(API_ENDPOINTS.analytics.overview, {
        searchParams: { days: String(days) },
      })
      .json<ApiResponse<AnalyticsOverviewMetrics> | AnalyticsOverviewMetrics>();
    return unwrapResponse(res);
  },

  /**
   * Get traffic stats (devices, browsers, countries)
   */
  async getTraffic(days = 30): Promise<TrafficStatsMetrics> {
    const res = await apiClient
      .get(API_ENDPOINTS.analytics.traffic, {
        searchParams: { days: String(days) },
      })
      .json<ApiResponse<TrafficStatsMetrics> | TrafficStatsMetrics>();
    return unwrapResponse(res);
  },

  /**
   * Get top visited pages
   */
  async getTopPages(days = 30): Promise<TopPageMetric[]> {
    const res = await apiClient
      .get(API_ENDPOINTS.analytics.topPages, {
        searchParams: { days: String(days) },
      })
      .json<ApiResponse<TopPageMetric[]> | TopPageMetric[]>();
    return unwrapResponse(res);
  },

  /**
   * Get lead acquisition sources
   */
  async getLeadSources(days = 30): Promise<LeadSourceMetric[]> {
    const res = await apiClient
      .get(API_ENDPOINTS.analytics.leads, {
        searchParams: { days: String(days) },
      })
      .json<ApiResponse<LeadSourceMetric[]> | LeadSourceMetric[]>();
    return unwrapResponse(res);
  },

  /**
   * Get conversion funnel metrics
   */
  async getConversionFunnel(days = 30): Promise<ConversionFunnelMetrics> {
    const res = await apiClient
      .get(API_ENDPOINTS.analytics.funnel, {
        searchParams: { days: String(days) },
      })
      .json<ApiResponse<ConversionFunnelMetrics> | ConversionFunnelMetrics>();
    return unwrapResponse(res);
  },

  /**
   * List paginated analytics events
   */
  async listEvents(filter: FilterAnalyticsDto = {}): Promise<{
    data: AnalyticsEventResponseDto[];
    meta: { pagination: { total: number; page: number; limit: number; totalPages: number } };
  }> {
    const searchParams = new URLSearchParams();
    if (filter.type) searchParams.set('type', filter.type);
    if (filter.page) searchParams.set('page', filter.page);
    if (filter.sessionId) searchParams.set('sessionId', filter.sessionId);
    if (filter.userId) searchParams.set('userId', filter.userId);
    if (filter.source) searchParams.set('source', filter.source);
    if (filter.pageNumber) searchParams.set('pageNumber', String(filter.pageNumber));
    if (filter.limit) searchParams.set('limit', String(filter.limit));

    return apiClient
      .get(API_ENDPOINTS.analytics.events, {
        searchParams,
      })
      .json<any>();
  },
};
