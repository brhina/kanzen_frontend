import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  ServiceItemResponseDto,
  CreateServiceDto,
  UpdateServiceDto,
  FilterServicesDto,
  PaginatedServicesResponseDto,
} from './services.dto';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const servicesApi = {
  /**
   * List all published services (Public)
   */
  async listPublic(filter: FilterServicesDto = {}): Promise<ServiceItemResponseDto[]> {
    const searchParams = new URLSearchParams();
    if (filter.category) searchParams.set('category', filter.category);
    if (filter.isFeatured !== undefined) searchParams.set('isFeatured', String(filter.isFeatured));
    if (filter.search) searchParams.set('search', filter.search);

    const res = await apiClient
      .get(API_ENDPOINTS.services.list, { searchParams })
      .json<ApiResponse<ServiceItemResponseDto[]> | ServiceItemResponseDto[]>();
    return unwrapResponse(res);
  },

  /**
   * Get single service offering by slug (Public)
   */
  async getBySlug(slug: string): Promise<ServiceItemResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.services.detail(slug))
      .json<ApiResponse<ServiceItemResponseDto> | ServiceItemResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * List all services with administrative filters (Admin)
   */
  async listAdmin(filter: FilterServicesDto = {}): Promise<PaginatedServicesResponseDto> {
    const searchParams = new URLSearchParams();
    if (filter.category) searchParams.set('category', filter.category);
    if (filter.status) searchParams.set('status', filter.status);
    if (filter.search) searchParams.set('search', filter.search);
    if (filter.page) searchParams.set('page', String(filter.page));
    if (filter.limit) searchParams.set('limit', String(filter.limit));

    return apiClient
      .get(API_ENDPOINTS.services.adminList, { searchParams })
      .json<PaginatedServicesResponseDto>();
  },

  /**
   * Get service details by ID (Admin)
   */
  async getAdminById(id: string): Promise<ServiceItemResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.services.adminDetail(id))
      .json<ApiResponse<ServiceItemResponseDto> | ServiceItemResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Create a new service offering (Admin)
   */
  async create(dto: CreateServiceDto): Promise<ServiceItemResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.services.adminCreate, { json: dto })
      .json<ApiResponse<ServiceItemResponseDto> | ServiceItemResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update service offering details (Admin)
   */
  async update(id: string, dto: UpdateServiceDto): Promise<ServiceItemResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.services.adminUpdate(id), { json: dto })
      .json<ApiResponse<ServiceItemResponseDto> | ServiceItemResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Reorder service positioning (Admin)
   */
  async reorder(id: string, order: number): Promise<ServiceItemResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.services.adminReorder(id), { json: { order } })
      .json<ApiResponse<ServiceItemResponseDto> | ServiceItemResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete service offering (Admin)
   */
  async delete(id: string): Promise<{ success?: boolean }> {
    const res = await apiClient
      .delete(API_ENDPOINTS.services.adminDelete(id))
      .json<ApiResponse<{ success?: boolean }> | { success?: boolean }>();
    return unwrapResponse(res);
  },
};
