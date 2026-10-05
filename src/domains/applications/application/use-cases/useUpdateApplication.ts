import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { applicationsApi } from '../../infrastructure/applications.api';
import { ApplicationsMapper } from '../../infrastructure/applications.mapper';
import type { UpdateJobApplicationDto } from '../../infrastructure/applications.dto';
import type { JobApplicationEntity } from '../../domain/entities/job-application.entity';

export interface UpdateApplicationParams {
  id: string;
  data: UpdateJobApplicationDto;
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation<JobApplicationEntity, Error, UpdateApplicationParams>({
    mutationFn: async ({ id, data }: UpdateApplicationParams) => {
      const response = await applicationsApi.adminUpdate(id, data);
      return ApplicationsMapper.toEntity(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.detail(id),
      });
    },
  });
}
