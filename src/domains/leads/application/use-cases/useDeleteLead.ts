import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { leadsApi } from '../../infrastructure/leads.api';

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message?: string }, Error, string>({
    mutationFn: async (id: string) => {
      return leadsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
    },
  });
}
