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
  async list(filter: FilterMediaDto = {}, isAdmin = true): Promise<PaginatedMediaResponseDto> {
    const searchParams = new URLSearchParams();
    if (filter.folder && filter.folder !== 'all') searchParams.set('folder', filter.folder);
    if (filter.search) searchParams.set('search', filter.search);
    if (filter.status) searchParams.set('status', filter.status);
    if (filter.page) searchParams.set('page', String(filter.page));
    if (filter.limit) searchParams.set('limit', String(filter.limit));

    const endpoint = isAdmin ? API_ENDPOINTS.media.adminList : API_ENDPOINTS.media.list;
    try {
      const raw = await apiClient
        .get(endpoint, {
          searchParams,
        })
        .json<any>();

      // Normalize various response envelopes:
      // Case 1: Standard ApiResponse with pagination { success: true, data: [...], meta: { pagination: ... } }
      if (raw && Array.isArray(raw.data)) {
        return {
          data: raw.data,
          meta: raw.meta || {
            pagination: {
              total: raw.data.length,
              page: filter.page ?? 1,
              limit: filter.limit ?? 20,
              totalPages: 1,
            },
          },
        };
      }

      // Case 2: Nested data shape { data: { data: [...], meta: ... } }
      if (raw?.data && Array.isArray(raw.data.data)) {
        return {
          data: raw.data.data,
          meta: raw.data.meta || raw.meta,
        };
      }

      // Case 3: Raw array
      if (Array.isArray(raw)) {
        return {
          data: raw,
          meta: {
            pagination: {
              total: raw.length,
              page: 1,
              limit: raw.length,
              totalPages: 1,
            },
          },
        };
      }

      return raw as PaginatedMediaResponseDto;
    } catch (err) {
      // If admin list fails with 401/403 and wasn't explicitly public, try public list fallback
      if (isAdmin) {
        return this.list(filter, false);
      }
      throw err;
    }
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
    meta?: { folder?: string; alt?: string; caption?: string; useUserEndpoint?: boolean },
  ): Promise<MediaResponseDto> {
    const formData = new FormData();
    formData.append('file', file);
    if (meta?.folder) formData.append('folder', meta.folder);
    if (meta?.alt) formData.append('alt', meta.alt);
    if (meta?.caption) formData.append('caption', meta.caption);

    const endpoint = meta?.useUserEndpoint
      ? API_ENDPOINTS.media.userUpload
      : API_ENDPOINTS.media.upload;

    const res = await apiClient
      .post(endpoint, {
        body: formData,
      })
      .json<ApiResponse<MediaResponseDto> | MediaResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Upload multiple files in batch to media storage
   */
  async uploadBulk(
    files: File[],
    meta?: { folder?: string; alt?: string; caption?: string },
  ): Promise<MediaResponseDto[]> {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    if (meta?.folder) formData.append('folder', meta.folder);
    if (meta?.alt) formData.append('alt', meta.alt);
    if (meta?.caption) formData.append('caption', meta.caption);

    const res = await apiClient
      .post(API_ENDPOINTS.media.uploadBulk, {
        body: formData,
      })
      .json<ApiResponse<MediaResponseDto[]> | MediaResponseDto[]>();
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
