import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { careersApi } from '../../infrastructure/careers.api';
import { CareersMapper } from '../../infrastructure/careers.mapper';
import type { JobPostingEntity } from '../../domain/entities/job-posting.entity';

export function useJobPosting(slug: string | undefined) {
  return useQuery<JobPostingEntity | null>({
    queryKey: queryKeys.careers.detail(slug || ''),
    queryFn: async () => {
      if (!slug) return null;
      const response = await careersApi.getBySlug(slug);
      return CareersMapper.toEntity(response);
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
}
