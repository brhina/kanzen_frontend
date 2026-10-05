import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  LeadResponseDto,
  CreateLeadDto,
  UpdateLeadDto,
  QualifyLeadDto,
  FilterLeadsDto,
} from './leads.dto';
import type { PaginatedLeadResponseDto } from './leads.mapper';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const leadsApi = {
  /**
   * Submit a new lead inquiry from website (Public)
   */
  async submit(data: CreateLeadDto): Promise<LeadResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.leads.submit, { json: data })
      .json<ApiResponse<LeadResponseDto> | LeadResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * List all leads with filters & pagination (Admin)
   */
  async listAdmin(params: FilterLeadsDto = {}): Promise<PaginatedLeadResponseDto> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set('status', params.status);
    if (params.serviceInterest) searchParams.set('serviceInterest', params.serviceInterest);
    if (params.source) searchParams.set('source', params.source);
    if (params.assignedTo) searchParams.set('assignedTo', params.assignedTo);
    if (params.minScore !== undefined) searchParams.set('minScore', String(params.minScore));
    if (params.search) searchParams.set('search', params.search);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

    return apiClient
      .get(API_ENDPOINTS.leads.adminList, { searchParams })
      .json<PaginatedLeadResponseDto>();
  },

  /**
   * Get lead details by ID (Admin)
   */
  async getById(id: string): Promise<LeadResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.leads.adminDetail(id))
      .json<ApiResponse<LeadResponseDto> | LeadResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update lead metadata, status, notes, or assignment (Admin)
   */
  async update(id: string, data: UpdateLeadDto): Promise<LeadResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.leads.adminUpdate(id), { json: data })
      .json<ApiResponse<LeadResponseDto> | LeadResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Manually qualify lead score and status (Admin)
   */
  async qualify(id: string, data: QualifyLeadDto): Promise<LeadResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.leads.adminQualify(id), { json: data })
      .json<ApiResponse<LeadResponseDto> | LeadResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Mark lead as converted (Admin)
   */
  async convert(id: string): Promise<LeadResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.leads.adminConvert(id), { json: {} })
      .json<ApiResponse<LeadResponseDto> | LeadResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete lead (Admin)
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    return apiClient
      .delete(API_ENDPOINTS.leads.adminDelete(id))
      .json<{ success: boolean; message?: string }>();
  },

  /**
   * Export leads as CSV file (Admin)
   */
  async exportCsv(): Promise<Blob> {
    return apiClient.get(API_ENDPOINTS.leads.adminExport).blob();
  },
};
