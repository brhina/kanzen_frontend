import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { mediaApi } from '../../infrastructure/media.api';
import { MediaMapper } from '../../infrastructure/media.mapper';
import type { FilterMediaDto } from '../../infrastructure/media.dto';
import type { MediaFileEntity } from '../../domain/entities/media-file.entity';

export interface UseMediaResult {
  items: MediaFileEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useMedia(filters: FilterMediaDto = {}) {
  return useQuery<UseMediaResult>({
    queryKey: queryKeys.media.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const response = await mediaApi.list(filters);
      return {
        items: MediaMapper.toDomainList(response.data || []),
        total: response.meta?.pagination?.total ?? (response.data || []).length,
        page: response.meta?.pagination?.page ?? 1,
        limit: response.meta?.pagination?.limit ?? 20,
        totalPages: response.meta?.pagination?.totalPages ?? 1,
      };
    },
    staleTime: 1000 * 60, // 1 minute
  });
}
