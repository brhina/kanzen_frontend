import { useMutation, useQueryClient } from '@tanstack/react-query';
import { solutionsApi } from '../../infrastructure/solutions.api';
import { toast } from '@/shared/ui/toast/toast.store';

export function useDeleteSolution() {
  const queryClient = useQueryClient();

  return useMutation<{ success?: boolean }, Error, string>({
    mutationFn: async (id: string) => {
      return solutionsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] });
      toast.success('Solution deleted successfully', 'Solution Removed');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete solution', 'Error');
    },
  });
}
