import { useMutation } from '@tanstack/react-query';
import { analyticsApi } from '../../infrastructure/analytics.api';
import type { CreateAnalyticsEventDto } from '../../infrastructure/analytics.dto';

export function useTrackEvent() {
  return useMutation({
    mutationFn: async (dto: CreateAnalyticsEventDto) => {
      return analyticsApi.track(dto);
    },
  });
}
