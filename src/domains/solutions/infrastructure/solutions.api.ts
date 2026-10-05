import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  SolutionResponseDto,
  CreateSolutionDto,
  UpdateSolutionDto,
  FilterSolutionsDto,
  PaginatedSolutionsResponseDto,
} from './solutions.dto';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const solutionsApi = {
  /**
   * List all published solutions (Public)
   */
  async listPublic(filter: FilterSolutionsDto = {}): Promise<SolutionResponseDto[]> {
    const searchParams = new URLSearchParams();
    if (filter.industry) searchParams.set('industry', filter.industry);
    if (filter.isFeatured !== undefined) searchParams.set('isFeatured', String(filter.isFeatured));
    if (filter.search) searchParams.set('search', filter.search);

    const res = await apiClient
      .get(API_ENDPOINTS.solutions.list, { searchParams })
      .json<ApiResponse<SolutionResponseDto[]> | SolutionResponseDto[]>();
    return unwrapResponse(res);
  },

  /**
   * Get single solution by slug (Public)
   */
  async getBySlug(slug: string): Promise<SolutionResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.solutions.detail(slug))
      .json<ApiResponse<SolutionResponseDto> | SolutionResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * List all solutions with admin pagination (Admin)
   */
  async listAdmin(filter: FilterSolutionsDto = {}): Promise<PaginatedSolutionsResponseDto> {
    const searchParams = new URLSearchParams();
    if (filter.industry) searchParams.set('industry', filter.industry);
    if (filter.status) searchParams.set('status', filter.status);
    if (filter.search) searchParams.set('search', filter.search);
    if (filter.page) searchParams.set('page', String(filter.page));
    if (filter.limit) searchParams.set('limit', String(filter.limit));

    return apiClient
      .get(API_ENDPOINTS.solutions.adminList, { searchParams })
      .json<PaginatedSolutionsResponseDto>();
  },

  /**
   * Get solution by ID (Admin)
   */
  async getAdminById(id: string): Promise<SolutionResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.solutions.adminDetail(id))
      .json<ApiResponse<SolutionResponseDto> | SolutionResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Create a new solution (Admin)
   */
  async create(dto: CreateSolutionDto): Promise<SolutionResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.solutions.adminCreate, { json: dto })
      .json<ApiResponse<SolutionResponseDto> | SolutionResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update solution details (Admin)
   */
  async update(id: string, dto: UpdateSolutionDto): Promise<SolutionResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.solutions.adminUpdate(id), { json: dto })
      .json<ApiResponse<SolutionResponseDto> | SolutionResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Reorder solution positioning (Admin)
   */
  async reorder(id: string, order: number): Promise<SolutionResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.solutions.adminReorder(id), { json: { order } })
      .json<ApiResponse<SolutionResponseDto> | SolutionResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete solution (Admin)
   */
  async delete(id: string): Promise<{ success?: boolean }> {
    const res = await apiClient
      .delete(API_ENDPOINTS.solutions.adminDelete(id))
      .json<ApiResponse<{ success?: boolean }> | { success?: boolean }>();
    return unwrapResponse(res);
  },
};
