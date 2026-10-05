import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  TestimonialResponseDto,
  CreateTestimonialDto,
  UpdateTestimonialDto,
  FilterTestimonialsDto,
} from './testimonials.dto';
import type { PaginatedTestimonialsResponseDto } from './testimonials.mapper';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const testimonialsApi = {
  /**
   * List approved client testimonials (Public)
   */
  async listPublic(filter: FilterTestimonialsDto = {}): Promise<TestimonialResponseDto[]> {
    const searchParams = new URLSearchParams();
    if (filter.search) searchParams.set('search', filter.search);
    if (filter.serviceId) searchParams.set('serviceId', filter.serviceId);

    const res = await apiClient
      .get(API_ENDPOINTS.testimonials.list, { searchParams })
      .json<ApiResponse<TestimonialResponseDto[]> | TestimonialResponseDto[]>();
    return unwrapResponse(res);
  },

  /**
   * List featured client testimonials (Public)
   */
  async getFeatured(): Promise<TestimonialResponseDto[]> {
    const res = await apiClient
      .get(API_ENDPOINTS.testimonials.featured)
      .json<ApiResponse<TestimonialResponseDto[]> | TestimonialResponseDto[]>();
    return unwrapResponse(res);
  },

  /**
   * Get testimonial by ID (Public)
   */
  async getById(id: string): Promise<TestimonialResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.testimonials.detail(id))
      .json<ApiResponse<TestimonialResponseDto> | TestimonialResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Submit client testimonial review (Public, creates in pending state)
   */
  async submitPublic(data: CreateTestimonialDto): Promise<TestimonialResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.testimonials.submit, { json: data })
      .json<ApiResponse<TestimonialResponseDto> | TestimonialResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * List all testimonials with filters & moderation status (Admin)
   */
  async listAdmin(filter: FilterTestimonialsDto = {}): Promise<PaginatedTestimonialsResponseDto> {
    const searchParams = new URLSearchParams();
    if (filter.status) searchParams.set('status', filter.status);
    if (filter.isFeatured !== undefined) searchParams.set('isFeatured', String(filter.isFeatured));
    if (filter.isVerified !== undefined) searchParams.set('isVerified', String(filter.isVerified));
    if (filter.search) searchParams.set('search', filter.search);
    if (filter.page) searchParams.set('page', String(filter.page));
    if (filter.limit) searchParams.set('limit', String(filter.limit));

    return apiClient
      .get(API_ENDPOINTS.testimonials.adminList, { searchParams })
      .json<PaginatedTestimonialsResponseDto>();
  },

  /**
   * Get testimonial details by ID (Admin)
   */
  async getAdminById(id: string): Promise<TestimonialResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.testimonials.adminDetail(id))
      .json<ApiResponse<TestimonialResponseDto> | TestimonialResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Create testimonial (Admin)
   */
  async createAdmin(data: CreateTestimonialDto): Promise<TestimonialResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.testimonials.adminCreate, { json: data })
      .json<ApiResponse<TestimonialResponseDto> | TestimonialResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update testimonial (Admin)
   */
  async updateAdmin(id: string, data: UpdateTestimonialDto): Promise<TestimonialResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.testimonials.adminUpdate(id), { json: data })
      .json<ApiResponse<TestimonialResponseDto> | TestimonialResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * 1-click Approve testimonial (Admin)
   */
  async approve(id: string): Promise<TestimonialResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.testimonials.adminApprove(id))
      .json<ApiResponse<TestimonialResponseDto> | TestimonialResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * 1-click Reject testimonial (Admin)
   */
  async reject(id: string): Promise<TestimonialResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.testimonials.adminReject(id))
      .json<ApiResponse<TestimonialResponseDto> | TestimonialResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update testimonial display order (Admin)
   */
  async reorder(id: string, order: number): Promise<TestimonialResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.testimonials.adminReorder(id), { json: { order } })
      .json<ApiResponse<TestimonialResponseDto> | TestimonialResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete testimonial (Admin)
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    return apiClient
      .delete(API_ENDPOINTS.testimonials.adminDelete(id))
      .json<{ success: boolean; message?: string }>();
  },
};
