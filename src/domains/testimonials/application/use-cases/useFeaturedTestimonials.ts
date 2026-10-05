import { useQuery } from '@tanstack/react-query';
import { testimonialsApi } from '../../infrastructure/testimonials.api';
import { TestimonialMapper } from '../../infrastructure/testimonials.mapper';
import type { TestimonialEntity } from '../../domain/entities/testimonial.entity';

export function useFeaturedTestimonials() {
  return useQuery<TestimonialEntity[]>({
    queryKey: ['testimonials', 'featured'],
    queryFn: async () => {
      const response = await testimonialsApi.getFeatured();
      return TestimonialMapper.toEntityList(response);
    },
    staleTime: 1000 * 60 * 5,
  });
}
