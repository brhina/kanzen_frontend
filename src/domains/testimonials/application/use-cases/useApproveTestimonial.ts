import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialsApi } from '../../infrastructure/testimonials.api';
import { TestimonialMapper } from '../../infrastructure/testimonials.mapper';
import type { TestimonialEntity } from '../../domain/entities/testimonial.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export function useApproveTestimonial() {
  const queryClient = useQueryClient();

  return useMutation<TestimonialEntity, Error, string>({
    mutationFn: async (id: string) => {
      const response = await testimonialsApi.approve(id);
      return TestimonialMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success(`Review from ${data.author} approved!`, 'Testimonial Approved');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to approve testimonial', 'Error');
    },
  });
}
