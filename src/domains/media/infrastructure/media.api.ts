import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  FilterMediaDto,
  MediaResponseDto,
  PaginatedMediaResponseDto,
  UpdateMediaMetaDto,
} from './media.dto';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const mediaApi = {
  /**
   * List media files with filtering and pagination
   */
  async list(filter: FilterMediaDto = {}): Promise<PaginatedMediaResponseDto> {
    const searchParams = new URLSearchParams();
    if (filter.folder && filter.folder !== 'all') searchParams.set('folder', filter.folder);
    if (filter.search) searchParams.set('search', filter.search);
    if (filter.status) searchParams.set('status', filter.status);
    if (filter.page) searchParams.set('page', String(filter.page));
    if (filter.limit) searchParams.set('limit', String(filter.limit));

    return apiClient
      .get(API_ENDPOINTS.media.adminList, {
        searchParams,
      })
      .json<PaginatedMediaResponseDto>();
  },

  /**
   * Get single media file details
   */
  async getById(id: string): Promise<MediaResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.media.detail(id))
      .json<ApiResponse<MediaResponseDto> | MediaResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Upload file to media storage
   */
  async upload(
    file: File,
    meta?: { folder?: string; alt?: string; caption?: string },
  ): Promise<MediaResponseDto> {
    const formData = new FormData();
    formData.append('file', file);
    if (meta?.folder) formData.append('folder', meta.folder);
    if (meta?.alt) formData.append('alt', meta.alt);
    if (meta?.caption) formData.append('caption', meta.caption);

    const res = await apiClient
      .post(API_ENDPOINTS.media.upload, {
        body: formData,
      })
      .json<ApiResponse<MediaResponseDto> | MediaResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update metadata for media file
   */
  async updateMeta(id: string, dto: UpdateMediaMetaDto): Promise<MediaResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.media.update(id), {
        json: dto,
      })
      .json<ApiResponse<MediaResponseDto> | MediaResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete media asset
   */
  async delete(id: string): Promise<{ success: boolean; id: string }> {
    return apiClient.delete(API_ENDPOINTS.media.delete(id)).json<{ success: boolean; id: string }>();
  },
};
