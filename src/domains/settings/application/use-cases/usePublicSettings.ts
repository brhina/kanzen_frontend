import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { settingsApi } from '../../infrastructure/settings.api';

export function usePublicSettings() {
  return useQuery<Record<string, unknown>>({
    queryKey: queryKeys.settings.public(),
    queryFn: async () => {
      return settingsApi.getPublic();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
