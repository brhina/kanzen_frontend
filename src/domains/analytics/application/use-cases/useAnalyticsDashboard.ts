import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { analyticsApi } from '../../infrastructure/analytics.api';
import type { AnalyticsDashboardPayload } from '../../domain/entities/analytics-event.entity';

export function useAnalyticsDashboard(days = 30) {
  return useQuery<AnalyticsDashboardPayload>({
    queryKey: queryKeys.analytics.dashboard(String(days)),
    queryFn: async () => {
      // First try aggregated dashboard endpoint
      try {
        const dashboard = await analyticsApi.getDashboard(days);
        return {
          overview: dashboard.overview,
          traffic: dashboard.traffic,
          topPages: dashboard.topPages || [],
          leadSources: dashboard.leadSources || [],
          funnel: dashboard.funnel,
        };
      } catch {
        // Fallback to parallel individual calls
        const [overview, traffic, topPages, leadSources, funnel] = await Promise.all([
          analyticsApi.getOverview(days),
          analyticsApi.getTraffic(days),
          analyticsApi.getTopPages(days),
          analyticsApi.getLeadSources(days),
          analyticsApi.getConversionFunnel(days),
        ]);

        return {
          overview,
          traffic,
          topPages: topPages || [],
          leadSources: leadSources || [],
          funnel,
        };
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
