import { useQuery } from '@tanstack/react-query';
import { testimonialsApi } from '../../infrastructure/testimonials.api';
import { TestimonialMapper } from '../../infrastructure/testimonials.mapper';
import type { FilterTestimonialsDto } from '../../infrastructure/testimonials.dto';
import type { TestimonialEntity } from '../../domain/entities/testimonial.entity';

export interface UseAdminTestimonialsResult {
  items: TestimonialEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useAdminTestimonials(filter: FilterTestimonialsDto = {}, enabled = true) {
  return useQuery<UseAdminTestimonialsResult>({
    queryKey: ['testimonials', 'admin', filter],
    queryFn: async () => {
      const response = await testimonialsApi.listAdmin(filter);
      return TestimonialMapper.toPaginated(response);
    },
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}
