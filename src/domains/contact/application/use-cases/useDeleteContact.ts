import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { contactApi } from '../../infrastructure/contact.api';

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message?: string }, Error, string>({
    mutationFn: async (id: string) => {
      return contactApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
    },
  });
}
