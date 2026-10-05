import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  ContactResponseDto,
  CreateContactDto,
  FilterContactDto,
} from './contact.dto';
import type { ContactStatus } from '../domain/enums/contact-status.enum';
import type { PaginatedContactResponseDto } from './contact.mapper';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const contactApi = {
  /**
   * Submit general contact inquiry (Public)
   */
  async submit(data: CreateContactDto): Promise<ContactResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.contact.submit, { json: data })
      .json<ApiResponse<ContactResponseDto> | ContactResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * List all contact submissions with filters & pagination (Admin)
   */
  async listAdmin(params: FilterContactDto = {}): Promise<PaginatedContactResponseDto> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set('status', params.status);
    if (params.type) searchParams.set('type', params.type);
    if (params.search) searchParams.set('search', params.search);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

    return apiClient
      .get(API_ENDPOINTS.contact.adminList, { searchParams })
      .json<PaginatedContactResponseDto>();
  },

  /**
   * Get contact details by ID (Admin) - automatically marked as read on server
   */
  async getById(id: string): Promise<ContactResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.contact.adminDetail(id))
      .json<ApiResponse<ContactResponseDto> | ContactResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update message status (read / replied / archived) (Admin)
   */
  async updateStatus(id: string, status: ContactStatus): Promise<ContactResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.contact.adminUpdateStatus(id), { json: { status } })
      .json<ApiResponse<ContactResponseDto> | ContactResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete contact submission (Admin)
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    return apiClient
      .delete(API_ENDPOINTS.contact.adminDelete(id))
      .json<{ success: boolean; message?: string }>();
  },
};
