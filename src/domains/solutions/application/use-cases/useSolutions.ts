import { useQuery } from '@tanstack/react-query';
import { solutionsApi } from '../../infrastructure/solutions.api';
import { solutionsMapper } from '../../infrastructure/solutions.mapper';
import type { FilterSolutionsDto } from '../../infrastructure/solutions.dto';
import type { SolutionEntity } from '../../domain/entities/solution.entity';

export interface UseSolutionsOptions extends FilterSolutionsDto {
  isAdminView?: boolean;
}

export interface UseSolutionsResult {
  solutions: SolutionEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useSolutions({
  isAdminView = false,
  ...filter
}: UseSolutionsOptions = {}) {
  return useQuery<UseSolutionsResult>({
    queryKey: ['solutions', isAdminView ? 'admin' : 'public', filter],
    queryFn: async () => {
      if (isAdminView) {
        const response = await solutionsApi.listAdmin(filter);
        return solutionsMapper.toPaginated(response);
      }
      const response = await solutionsApi.listPublic(filter);
      return solutionsMapper.toPaginated(response);
    },
    staleTime: 1000 * 60 * 3,
  });
}
