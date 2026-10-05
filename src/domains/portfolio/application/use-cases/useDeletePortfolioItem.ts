import { useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '../../infrastructure/portfolio.api';
import { toast } from '@/shared/ui/toast/toast.store';

export function useDeletePortfolioItem() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message?: string }, Error, string>({
    mutationFn: async (id: string) => {
      return portfolioApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Project deleted successfully', 'Deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete portfolio item', 'Error');
    },
  });
}
