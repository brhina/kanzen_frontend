import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  PortfolioItemResponseDto,
  CreatePortfolioDto,
  UpdatePortfolioDto,
  PortfolioFilterQuery,
} from './portfolio.dto';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export interface PaginatedPortfolioResponseDto {
  data: PortfolioItemResponseDto[];
  meta: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const portfolioApi = {
  /**
   * List all published portfolio items (Public)
   */
  async listPublic(filter: PortfolioFilterQuery = {}): Promise<PortfolioItemResponseDto[]> {
    const searchParams = new URLSearchParams();
    if (filter.category) searchParams.set('category', filter.category);
    if (filter.isFeatured !== undefined) searchParams.set('isFeatured', String(filter.isFeatured));
    if (filter.search) searchParams.set('search', filter.search);

    const res = await apiClient
      .get(API_ENDPOINTS.portfolio.list, { searchParams })
      .json<ApiResponse<PortfolioItemResponseDto[]> | PortfolioItemResponseDto[]>();
    return unwrapResponse(res);
  },

  /**
   * Get featured portfolio items (Public)
   */
  async getFeatured(): Promise<PortfolioItemResponseDto[]> {
    const res = await apiClient
      .get(API_ENDPOINTS.portfolio.featured)
      .json<ApiResponse<PortfolioItemResponseDto[]> | PortfolioItemResponseDto[]>();
    return unwrapResponse(res);
  },

  /**
   * Get portfolio project by slug (Public)
   */
  async getBySlug(slug: string): Promise<PortfolioItemResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.portfolio.detail(slug))
      .json<ApiResponse<PortfolioItemResponseDto> | PortfolioItemResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * List all portfolio projects with admin filters & pagination (Admin)
   */
  async listAdmin(filter: PortfolioFilterQuery = {}): Promise<PaginatedPortfolioResponseDto> {
    const searchParams = new URLSearchParams();
    if (filter.category) searchParams.set('category', filter.category);
    if (filter.status) searchParams.set('status', filter.status);
    if (filter.search) searchParams.set('search', filter.search);
    if (filter.page) searchParams.set('page', String(filter.page));
    if (filter.limit) searchParams.set('limit', String(filter.limit));

    return apiClient
      .get(API_ENDPOINTS.portfolio.adminList, { searchParams })
      .json<PaginatedPortfolioResponseDto>();
  },

  /**
   * Get portfolio project details by ID (Admin)
   */
  async getById(id: string): Promise<PortfolioItemResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.portfolio.adminDetail(id))
      .json<ApiResponse<PortfolioItemResponseDto> | PortfolioItemResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Create a new portfolio item (Admin)
   */
  async create(data: CreatePortfolioDto): Promise<PortfolioItemResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.portfolio.adminCreate, { json: data })
      .json<ApiResponse<PortfolioItemResponseDto> | PortfolioItemResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update an existing portfolio item (Admin)
   */
  async update(id: string, data: UpdatePortfolioDto): Promise<PortfolioItemResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.portfolio.adminUpdate(id), { json: data })
      .json<ApiResponse<PortfolioItemResponseDto> | PortfolioItemResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Reorder portfolio project position (Admin)
   */
  async reorder(id: string, order: number): Promise<PortfolioItemResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.portfolio.adminReorder(id), { json: { order } })
      .json<ApiResponse<PortfolioItemResponseDto> | PortfolioItemResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete a portfolio item (Admin)
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    return apiClient
      .delete(API_ENDPOINTS.portfolio.adminDelete(id))
      .json<{ success: boolean; message?: string }>();
  },
};
