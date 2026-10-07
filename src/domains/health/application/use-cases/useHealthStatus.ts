import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { healthApi } from '../../infrastructure/health.api';
import type { HealthResponseDto, DetailedHealthResponseDto } from '../../infrastructure/health.dto';

export function useHealthStatus() {
  return useQuery<HealthResponseDto>({
    queryKey: queryKeys.health.system(),
    queryFn: async () => {
      return healthApi.getStatus();
    },
    staleTime: 1000 * 15, // 15 seconds
  });
}

export function useDetailedHealthStatus(enabled = true, pollingInterval = 0) {
  return useQuery<DetailedHealthResponseDto>({
    queryKey: queryKeys.health.detailed(),
    queryFn: async () => {
      return healthApi.getDetailed();
    },
    enabled,
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: pollingInterval > 0 ? pollingInterval : false,
  });
}
