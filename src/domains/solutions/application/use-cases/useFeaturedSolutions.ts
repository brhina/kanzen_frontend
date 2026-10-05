import { useQuery } from '@tanstack/react-query';
import { solutionsApi } from '../../infrastructure/solutions.api';
import { solutionsMapper } from '../../infrastructure/solutions.mapper';
import type { SolutionEntity } from '../../domain/entities/solution.entity';

export function useFeaturedSolutions() {
  return useQuery<SolutionEntity[]>({
    queryKey: ['solutions', 'featured'],
    queryFn: async () => {
      const dtos = await solutionsApi.listPublic({ isFeatured: true });
      return solutionsMapper.toEntityList(dtos);
    },
    staleTime: 1000 * 60 * 5,
  });
}
