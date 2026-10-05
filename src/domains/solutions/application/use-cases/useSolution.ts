import { useQuery } from '@tanstack/react-query';
import { solutionsApi } from '../../infrastructure/solutions.api';
import { solutionsMapper } from '../../infrastructure/solutions.mapper';
import type { SolutionEntity } from '../../domain/entities/solution.entity';

export function useSolution(slugOrId?: string, isId = false) {
  return useQuery<SolutionEntity>({
    queryKey: ['solution', isId ? 'id' : 'slug', slugOrId],
    queryFn: async () => {
      if (!slugOrId) throw new Error('Missing solution identifier');
      const dto = isId
        ? await solutionsApi.getAdminById(slugOrId)
        : await solutionsApi.getBySlug(slugOrId);
      return solutionsMapper.toEntity(dto);
    },
    enabled: Boolean(slugOrId),
    staleTime: 1000 * 60 * 3,
  });
}
