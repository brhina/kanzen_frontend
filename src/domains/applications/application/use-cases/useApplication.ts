import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { applicationsApi } from '../../infrastructure/applications.api';
import { ApplicationsMapper } from '../../infrastructure/applications.mapper';
import type { JobApplicationEntity } from '../../domain/entities/job-application.entity';

export function useApplication(id: string | undefined) {
  return useQuery<JobApplicationEntity | null>({
    queryKey: queryKeys.applications.detail(id || ''),
    queryFn: async () => {
      if (!id) return null;
      const response = await applicationsApi.adminGetById(id);
      return ApplicationsMapper.toEntity(response);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}
