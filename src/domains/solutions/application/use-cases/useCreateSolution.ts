import { useMutation, useQueryClient } from '@tanstack/react-query';
import { solutionsApi } from '../../infrastructure/solutions.api';
import { solutionsMapper } from '../../infrastructure/solutions.mapper';
import type { CreateSolutionDto } from '../../infrastructure/solutions.dto';
import type { SolutionEntity } from '../../domain/entities/solution.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export function useCreateSolution() {
  const queryClient = useQueryClient();

  return useMutation<SolutionEntity, Error, CreateSolutionDto>({
    mutationFn: async (dto) => {
      const response = await solutionsApi.create(dto);
      return solutionsMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] });
      toast.success(`Solution "${data.name}" created successfully!`, 'Solution Created');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create solution', 'Error');
    },
  });
}
