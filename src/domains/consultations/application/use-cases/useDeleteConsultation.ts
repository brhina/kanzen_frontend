import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { consultationsApi } from '../../infrastructure/consultations.api';

export function useDeleteConsultation() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message?: string }, Error, string>({
    mutationFn: async (id: string) => {
      return consultationsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultations.all });
    },
  });
}
