import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { applicationsApi } from '../../infrastructure/applications.api';

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message?: string }, Error, string>({
    mutationFn: async (id: string) => {
      return applicationsApi.adminDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
    },
  });
}
