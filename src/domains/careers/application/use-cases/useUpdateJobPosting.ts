import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { careersApi } from '../../infrastructure/careers.api';
import { CareersMapper } from '../../infrastructure/careers.mapper';
import type { UpdateJobPostingDto } from '../../infrastructure/careers.dto';
import type { JobPostingEntity } from '../../domain/entities/job-posting.entity';

export interface UpdateJobPostingParams {
  id: string;
  data: UpdateJobPostingDto;
}

export function useUpdateJobPosting() {
  const queryClient = useQueryClient();

  return useMutation<JobPostingEntity, Error, UpdateJobPostingParams>({
    mutationFn: async ({ id, data }: UpdateJobPostingParams) => {
      const response = await careersApi.update(id, data);
      return CareersMapper.toEntity(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.careers.all });
    },
  });
}
