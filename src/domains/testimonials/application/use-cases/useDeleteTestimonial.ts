import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialsApi } from '../../infrastructure/testimonials.api';
import { toast } from '@/shared/ui/toast/toast.store';

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message?: string }, Error, string>({
    mutationFn: async (id: string) => {
      return testimonialsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial deleted successfully', 'Deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete testimonial', 'Error');
    },
  });
}
