import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { analyticsApi } from '../../infrastructure/analytics.api';
import type { TopPageMetric } from '../../domain/entities/analytics-event.entity';

export function useTopPages(days = 30) {
  return useQuery<TopPageMetric[]>({
    queryKey: [...queryKeys.analytics.all, 'top-pages', String(days)],
    queryFn: async () => {
      return analyticsApi.getTopPages(days);
    },
    staleTime: 1000 * 60 * 2,
  });
}
