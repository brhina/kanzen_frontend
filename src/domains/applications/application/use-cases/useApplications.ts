import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { applicationsApi } from '../../infrastructure/applications.api';
import { ApplicationsMapper } from '../../infrastructure/applications.mapper';
import type { FilterApplicationsDto } from '../../infrastructure/applications.dto';
import type { JobApplicationEntity } from '../../domain/entities/job-application.entity';

export interface UseApplicationsResult {
  items: JobApplicationEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useApplications(filters: FilterApplicationsDto = {}) {
  return useQuery<UseApplicationsResult>({
    queryKey: queryKeys.applications.list(filters),
    queryFn: async () => {
      const response = await applicationsApi.adminList(filters);
      const items = ApplicationsMapper.toEntities(response.data || []);
      const total = response.meta?.pagination?.total ?? items.length;
      const page = response.meta?.pagination?.page ?? 1;
      const limit = response.meta?.pagination?.limit ?? items.length;
      const totalPages =
        response.meta?.pagination?.totalPages ??
        Math.ceil(total / (limit || 1)) ??
        1;

      return {
        items,
        total,
        page,
        limit,
        totalPages,
      };
    },
    staleTime: 1000 * 60 * 2,
  });
}
