import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  ProductResponseDto,
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
  PaginatedProductsResponseDto,
} from './products.dto';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const productsApi = {
  /**
   * List live and announced products (Public)
   */
  async listPublic(filter: FilterProductsDto = {}): Promise<ProductResponseDto[]> {
    const searchParams = new URLSearchParams();
    if (filter.category) searchParams.set('category', filter.category);
    if (filter.status) searchParams.set('status', filter.status);
    if (filter.isFeatured !== undefined) searchParams.set('isFeatured', String(filter.isFeatured));
    if (filter.search) searchParams.set('search', filter.search);

    const res = await apiClient
      .get(API_ENDPOINTS.products.list, { searchParams })
      .json<ApiResponse<ProductResponseDto[]> | ProductResponseDto[]>();
    return unwrapResponse(res);
  },

  /**
   * Get single product by slug (Public)
   */
  async getBySlug(slug: string): Promise<ProductResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.products.detail(slug))
      .json<ApiResponse<ProductResponseDto> | ProductResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * List all products with admin pagination (Admin)
   */
  async listAdmin(filter: FilterProductsDto = {}): Promise<PaginatedProductsResponseDto> {
    const searchParams = new URLSearchParams();
    if (filter.category) searchParams.set('category', filter.category);
    if (filter.status) searchParams.set('status', filter.status);
    if (filter.search) searchParams.set('search', filter.search);
    if (filter.page) searchParams.set('page', String(filter.page));
    if (filter.limit) searchParams.set('limit', String(filter.limit));

    return apiClient
      .get(API_ENDPOINTS.products.adminList, { searchParams })
      .json<PaginatedProductsResponseDto>();
  },

  /**
   * Get product by ID (Admin)
   */
  async getAdminById(id: string): Promise<ProductResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.products.adminDetail(id))
      .json<ApiResponse<ProductResponseDto> | ProductResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Create a new product (Admin)
   */
  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.products.adminCreate, { json: dto })
      .json<ApiResponse<ProductResponseDto> | ProductResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update product details (Admin)
   */
  async update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.products.adminUpdate(id), { json: dto })
      .json<ApiResponse<ProductResponseDto> | ProductResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Reorder product position (Admin)
   */
  async reorder(id: string, order: number): Promise<ProductResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.products.adminReorder(id), { json: { order } })
      .json<ApiResponse<ProductResponseDto> | ProductResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete product (Admin)
   */
  async delete(id: string): Promise<{ success?: boolean }> {
    const res = await apiClient
      .delete(API_ENDPOINTS.products.adminDelete(id))
      .json<ApiResponse<{ success?: boolean }> | { success?: boolean }>();
    return unwrapResponse(res);
  },
};
