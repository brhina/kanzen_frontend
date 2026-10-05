import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { careersApi } from '../../infrastructure/careers.api';
import { CareersMapper } from '../../infrastructure/careers.mapper';
import type { FilterCareersDto } from '../../infrastructure/careers.dto';
import type { JobPostingEntity } from '../../domain/entities/job-posting.entity';

export interface UseJobPostingsResult {
  items: JobPostingEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UseJobPostingsOptions {
  admin?: boolean;
}

export function useJobPostings(
  filters: FilterCareersDto = {},
  options: UseJobPostingsOptions = {},
) {
  const isAdmin = options.admin ?? false;

  return useQuery<UseJobPostingsResult>({
    queryKey: isAdmin
      ? [...queryKeys.careers.lists(), 'admin', filters]
      : queryKeys.careers.list(filters),
    queryFn: async () => {
      const response = isAdmin
        ? await careersApi.listAdmin(filters)
        : await careersApi.getActive(filters);

      const items = CareersMapper.toEntities(response.data || []);
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
