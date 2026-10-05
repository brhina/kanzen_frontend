import { useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialsApi } from '../../infrastructure/testimonials.api';
import { TestimonialMapper } from '../../infrastructure/testimonials.mapper';
import type { UpdateTestimonialDto } from '../../infrastructure/testimonials.dto';
import type { TestimonialEntity } from '../../domain/entities/testimonial.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export interface UpdateTestimonialArgs {
  id: string;
  dto: UpdateTestimonialDto;
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation<TestimonialEntity, Error, UpdateTestimonialArgs>({
    mutationFn: async ({ id, dto }) => {
      const response = await testimonialsApi.updateAdmin(id, dto);
      return TestimonialMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success(`Review from ${data.author} updated!`, 'Testimonial Updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update testimonial', 'Error');
    },
  });
}
