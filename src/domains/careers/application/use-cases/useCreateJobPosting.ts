import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { careersApi } from '../../infrastructure/careers.api';
import { CareersMapper } from '../../infrastructure/careers.mapper';
import type { CreateJobPostingDto } from '../../infrastructure/careers.dto';
import type { JobPostingEntity } from '../../domain/entities/job-posting.entity';

export function useCreateJobPosting() {
  const queryClient = useQueryClient();

  return useMutation<JobPostingEntity, Error, CreateJobPostingDto>({
    mutationFn: async (dto: CreateJobPostingDto) => {
      const response = await careersApi.create(dto);
      return CareersMapper.toEntity(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.careers.all });
    },
  });
}
