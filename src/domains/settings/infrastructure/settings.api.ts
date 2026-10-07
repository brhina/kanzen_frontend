import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  CreateSettingDto,
  FilterSettingsDto,
  SettingResponseDto,
  UpdateSettingDto,
} from './settings.dto';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const settingsApi = {
  /**
   * Get public key-value settings for frontend hydration
   */
  async getPublic(): Promise<Record<string, unknown>> {
    const res = await apiClient
      .get(API_ENDPOINTS.settings.public)
      .json<ApiResponse<Record<string, unknown>> | Record<string, unknown>>();
    return unwrapResponse(res);
  },

  /**
   * List all administrative configuration settings
   */
  async listAll(filter: FilterSettingsDto = {}): Promise<SettingResponseDto[]> {
    const searchParams = new URLSearchParams();
    if (filter.group && filter.group !== 'all') searchParams.set('group', filter.group);
    if (filter.isPublic !== undefined) searchParams.set('isPublic', String(filter.isPublic));

    const res = await apiClient
      .get(API_ENDPOINTS.settings.adminAll, {
        searchParams,
      })
      .json<ApiResponse<SettingResponseDto[]> | SettingResponseDto[]>();
    return unwrapResponse(res);
  },

  /**
   * Get single setting by key
   */
  async getByKey(key: string): Promise<SettingResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.settings.adminKey(key))
      .json<ApiResponse<SettingResponseDto> | SettingResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Create configuration setting
   */
  async create(dto: CreateSettingDto): Promise<SettingResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.settings.adminCreate, {
        json: dto,
      })
      .json<ApiResponse<SettingResponseDto> | SettingResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update setting value
   */
  async update(key: string, dto: UpdateSettingDto): Promise<SettingResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.settings.adminUpdate(key), {
        json: dto,
      })
      .json<ApiResponse<SettingResponseDto> | SettingResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete configuration setting
   */
  async delete(key: string): Promise<boolean> {
    const res = await apiClient
      .delete(API_ENDPOINTS.settings.adminDelete(key))
      .json<any>();
    return Boolean(res);
  },
};
