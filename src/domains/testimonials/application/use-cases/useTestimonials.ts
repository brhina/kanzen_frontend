import { useQuery } from '@tanstack/react-query';
import { testimonialsApi } from '../../infrastructure/testimonials.api';
import { TestimonialMapper } from '../../infrastructure/testimonials.mapper';
import type { FilterTestimonialsDto } from '../../infrastructure/testimonials.dto';
import type { TestimonialEntity } from '../../domain/entities/testimonial.entity';

export function useTestimonials(filter: FilterTestimonialsDto = {}) {
  return useQuery<TestimonialEntity[]>({
    queryKey: ['testimonials', 'public', filter],
    queryFn: async () => {
      const response = await testimonialsApi.listPublic(filter);
      return TestimonialMapper.toEntityList(response);
    },
    staleTime: 1000 * 60 * 3,
  });
}
