import { useMutation, useQueryClient } from '@tanstack/react-query';
import { caseStudiesApi } from '../../infrastructure/case-studies.api';
import { toast } from '@/shared/ui/toast/toast.store';

export function useDeleteCaseStudy() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message?: string }, Error, string>({
    mutationFn: async (id: string) => {
      return caseStudiesApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-studies'] });
      toast.success('Case study deleted successfully', 'Deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete case study', 'Error');
    },
  });
}
