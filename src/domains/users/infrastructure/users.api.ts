import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  CreateUserDto,
  FilterUsersDto,
  PaginatedUsersResponseDto,
  UpdateUserDto,
  UserResponseDto,
} from './users.dto';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const usersApi = {
  /**
   * List users with optional filtering and pagination (Admin)
   */
  async list(filter: FilterUsersDto = {}): Promise<PaginatedUsersResponseDto> {
    const searchParams = new URLSearchParams();
    if (filter.status) searchParams.set('status', filter.status);
    if (filter.isAdmin !== undefined) searchParams.set('isAdmin', String(filter.isAdmin));
    if (filter.search) searchParams.set('search', filter.search);
    if (filter.page) searchParams.set('page', String(filter.page));
    if (filter.limit) searchParams.set('limit', String(filter.limit));

    return apiClient
      .get(API_ENDPOINTS.users.adminList, {
        searchParams,
      })
      .json<PaginatedUsersResponseDto>();
  },

  /**
   * Get single user by unique identifier
   */
  async getById(id: string): Promise<UserResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.users.adminDetail(id))
      .json<ApiResponse<UserResponseDto> | UserResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Create or invite a new user (Admin)
   */
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.users.adminCreate, {
        json: dto,
      })
      .json<ApiResponse<UserResponseDto> | UserResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update existing user record or permissions (Admin)
   */
  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.users.adminUpdate(id), {
        json: dto,
      })
      .json<ApiResponse<UserResponseDto> | UserResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete user record (Admin)
   */
  async delete(id: string): Promise<{ success: boolean }> {
    const res = await apiClient
      .delete(API_ENDPOINTS.users.adminDelete(id))
      .json<ApiResponse<{ success: boolean }> | { success: boolean }>();
    return unwrapResponse(res);
  },

  /**
   * Fetch current authenticated user profile
   */
  async getMe(): Promise<UserResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.users.me)
      .json<ApiResponse<UserResponseDto> | UserResponseDto>();
    return unwrapResponse(res);
  },
};
