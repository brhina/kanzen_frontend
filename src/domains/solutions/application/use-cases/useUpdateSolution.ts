import { useMutation, useQueryClient } from '@tanstack/react-query';
import { solutionsApi } from '../../infrastructure/solutions.api';
import { solutionsMapper } from '../../infrastructure/solutions.mapper';
import type { UpdateSolutionDto } from '../../infrastructure/solutions.dto';
import type { SolutionEntity } from '../../domain/entities/solution.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export interface UpdateSolutionParams {
  id: string;
  dto: UpdateSolutionDto;
}

export function useUpdateSolution() {
  const queryClient = useQueryClient();

  return useMutation<SolutionEntity, Error, UpdateSolutionParams>({
    mutationFn: async ({ id, dto }) => {
      const response = await solutionsApi.update(id, dto);
      return solutionsMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] });
      queryClient.invalidateQueries({ queryKey: ['solution'] });
      toast.success(`Solution "${data.name}" updated successfully!`, 'Solution Saved');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update solution', 'Error');
    },
  });
}
