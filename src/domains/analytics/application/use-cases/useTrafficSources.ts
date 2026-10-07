import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { analyticsApi } from '../../infrastructure/analytics.api';
import type { LeadSourceMetric } from '../../domain/entities/analytics-event.entity';

export function useTrafficSources(days = 30) {
  return useQuery<LeadSourceMetric[]>({
    queryKey: queryKeys.analytics.trafficSources(String(days)),
    queryFn: async () => {
      return analyticsApi.getLeadSources(days);
    },
    staleTime: 1000 * 60 * 2,
  });
}
