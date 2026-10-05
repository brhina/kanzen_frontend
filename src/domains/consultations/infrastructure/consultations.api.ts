import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  ConsultationResponseDto,
  CreateConsultationDto,
  UpdateConsultationDto,
  ConfirmConsultationDto,
  CancelConsultationDto,
  FilterConsultationsDto,
} from './consultations.dto';
import type { PaginatedConsultationResponseDto } from './consultations.mapper';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const consultationsApi = {
  /**
   * Book a technical discovery consultation (Public)
   */
  async book(data: CreateConsultationDto): Promise<ConsultationResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.consultations.book, { json: data })
      .json<ApiResponse<ConsultationResponseDto> | ConsultationResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * List consultations with filters & pagination (Admin)
   */
  async listAdmin(
    params: FilterConsultationsDto = {},
  ): Promise<PaginatedConsultationResponseDto> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set('status', params.status);
    if (params.meetingType) searchParams.set('meetingType', params.meetingType);
    if (params.search) searchParams.set('search', params.search);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    return apiClient
      .get(API_ENDPOINTS.consultations.adminList, { searchParams })
      .json<PaginatedConsultationResponseDto>();
  },

  /**
   * Get consultation details by ID (Admin)
   */
  async getById(id: string): Promise<ConsultationResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.consultations.adminDetail(id))
      .json<ApiResponse<ConsultationResponseDto> | ConsultationResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update consultation notes or link (Admin)
   */
  async update(
    id: string,
    data: UpdateConsultationDto,
  ): Promise<ConsultationResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.consultations.adminUpdate(id), { json: data })
      .json<ApiResponse<ConsultationResponseDto> | ConsultationResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Confirm consultation appointment and set meeting link (Admin)
   */
  async confirm(
    id: string,
    data: ConfirmConsultationDto,
  ): Promise<ConsultationResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.consultations.adminConfirm(id), { json: data })
      .json<ApiResponse<ConsultationResponseDto> | ConsultationResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Cancel consultation appointment (Admin)
   */
  async cancel(
    id: string,
    data: CancelConsultationDto,
  ): Promise<ConsultationResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.consultations.adminCancel(id), { json: data })
      .json<ApiResponse<ConsultationResponseDto> | ConsultationResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete consultation (Admin)
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    return apiClient
      .delete(API_ENDPOINTS.consultations.adminDelete(id))
      .json<{ success: boolean; message?: string }>();
  },
};
