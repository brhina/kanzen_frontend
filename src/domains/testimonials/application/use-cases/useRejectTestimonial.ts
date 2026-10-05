import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialsApi } from '../../infrastructure/testimonials.api';
import { TestimonialMapper } from '../../infrastructure/testimonials.mapper';
import type { TestimonialEntity } from '../../domain/entities/testimonial.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export function useRejectTestimonial() {
  const queryClient = useQueryClient();

  return useMutation<TestimonialEntity, Error, string>({
    mutationFn: async (id: string) => {
      const response = await testimonialsApi.reject(id);
      return TestimonialMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.info(`Review from ${data.author} rejected.`, 'Testimonial Moderated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reject testimonial', 'Error');
    },
  });
}
