// Domain enums & entities
export {
  TestimonialStatus,
  TESTIMONIAL_STATUS_LABELS,
} from './domain/enums/testimonial-status.enum';
export type { TestimonialEntity } from './domain/entities/testimonial.entity';

// Infrastructure
export { testimonialsApi } from './infrastructure/testimonials.api';
export { TestimonialMapper } from './infrastructure/testimonials.mapper';
export type {
  CreateTestimonialDto,
  UpdateTestimonialDto,
  FilterTestimonialsDto,
  TestimonialResponseDto,
} from './infrastructure/testimonials.dto';

// Application hooks
export { useTestimonials } from './application/use-cases/useTestimonials';
export { useAdminTestimonials } from './application/use-cases/useAdminTestimonials';
export { useFeaturedTestimonials } from './application/use-cases/useFeaturedTestimonials';
export { useSubmitTestimonial } from './application/use-cases/useSubmitTestimonial';
export { useApproveTestimonial } from './application/use-cases/useApproveTestimonial';
export { useRejectTestimonial } from './application/use-cases/useRejectTestimonial';
export { useUpdateTestimonial } from './application/use-cases/useUpdateTestimonial';
export { useDeleteTestimonial } from './application/use-cases/useDeleteTestimonial';

// Presentation components & pages
export { StarRating } from './presentation/components/StarRating';
export { TestimonialCard } from './presentation/components/TestimonialCard';
export { TestimonialCarousel } from './presentation/components/TestimonialCarousel';
export { TestimonialVideoPlayer } from './presentation/components/TestimonialVideoPlayer';
export { TestimonialForm } from './presentation/components/TestimonialForm';
export { TestimonialsPage } from './presentation/pages/TestimonialsPage';
