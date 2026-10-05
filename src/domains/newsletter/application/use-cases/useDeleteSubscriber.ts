import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { newsletterApi } from '../../infrastructure/newsletter.api';

export function useDeleteSubscriber() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message?: string }, Error, string>({
    mutationFn: async (id: string) => {
      return newsletterApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.newsletter.all });
    },
  });
}
