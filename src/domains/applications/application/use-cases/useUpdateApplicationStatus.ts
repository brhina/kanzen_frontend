import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { applicationsApi } from '../../infrastructure/applications.api';
import { ApplicationsMapper } from '../../infrastructure/applications.mapper';
import type { ApplicationStatus } from '../../domain/enums/application-status.enum';
import type { JobApplicationEntity } from '../../domain/entities/job-application.entity';

export interface UpdateApplicationStatusParams {
  id: string;
  status: ApplicationStatus;
  notes?: string;
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    JobApplicationEntity,
    Error,
    UpdateApplicationStatusParams
  >({
    mutationFn: async ({ id, status, notes }: UpdateApplicationStatusParams) => {
      const response = await applicationsApi.adminUpdateStatus(
        id,
        status,
        notes,
      );
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
