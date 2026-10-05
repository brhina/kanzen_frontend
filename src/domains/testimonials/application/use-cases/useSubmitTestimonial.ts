import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialsApi } from '../../infrastructure/testimonials.api';
import { TestimonialMapper } from '../../infrastructure/testimonials.mapper';
import type { CreateTestimonialDto } from '../../infrastructure/testimonials.dto';
import type { TestimonialEntity } from '../../domain/entities/testimonial.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export function useSubmitTestimonial() {
  const queryClient = useQueryClient();

  return useMutation<TestimonialEntity, Error, CreateTestimonialDto>({
    mutationFn: async (dto) => {
      const response = await testimonialsApi.submitPublic(dto);
      return TestimonialMapper.toEntity(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success(
        'Thank you! Your testimonial has been submitted and is currently pending client verification.',
        'Review Submitted',
      );
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit testimonial', 'Submission Error');
    },
  });
}
