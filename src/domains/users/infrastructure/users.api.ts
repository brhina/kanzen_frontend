import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type {
  CreateUserDto,
  FilterUsersDto,
  PaginatedUsersResponseDto,
  UpdateUserDto,
  UserResponseDto,
} from './users.dto';

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
    return apiClient.get(API_ENDPOINTS.users.adminDetail(id)).json<UserResponseDto>();
  },

  /**
   * Create or invite a new user (Admin)
   */
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    return apiClient
      .post(API_ENDPOINTS.users.adminCreate, {
        json: dto,
      })
      .json<UserResponseDto>();
  },

  /**
   * Update existing user record or permissions (Admin)
   */
  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    return apiClient
      .patch(API_ENDPOINTS.users.adminUpdate(id), {
        json: dto,
      })
      .json<UserResponseDto>();
  },

  /**
   * Delete user record (Admin)
   */
  async delete(id: string): Promise<{ success: boolean }> {
    return apiClient
      .delete(API_ENDPOINTS.users.adminDelete(id))
      .json<{ success: boolean }>();
  },

  /**
   * Fetch current authenticated user profile
   */
  async getMe(): Promise<UserResponseDto> {
    return apiClient.get(API_ENDPOINTS.users.me).json<UserResponseDto>();
  },
};
