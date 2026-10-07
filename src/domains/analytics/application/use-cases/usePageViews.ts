import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { analyticsApi } from '../../infrastructure/analytics.api';
import type { AnalyticsOverviewMetrics } from '../../domain/entities/analytics-event.entity';

export function usePageViews(days = 30) {
  return useQuery<AnalyticsOverviewMetrics>({
    queryKey: queryKeys.analytics.pageViews(String(days)),
    queryFn: async () => {
      return analyticsApi.getOverview(days);
    },
    staleTime: 1000 * 60 * 2,
  });
}
