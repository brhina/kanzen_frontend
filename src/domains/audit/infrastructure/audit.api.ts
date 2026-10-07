import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  FilterAuditDto,
  AuditLogResponseDto,
  PaginatedAuditLogResponseDto,
} from './audit.dto';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const auditApi = {
  /**
   * List security and mutation audit logs
   */
  async list(filter: FilterAuditDto = {}): Promise<PaginatedAuditLogResponseDto> {
    const searchParams = new URLSearchParams();
    if (filter.action && filter.action !== 'all') searchParams.set('action', filter.action);
    if (filter.resource && filter.resource !== 'all') searchParams.set('resource', filter.resource);
    if (filter.status && filter.status !== 'all') searchParams.set('status', filter.status);
    if (filter.userId) searchParams.set('userId', filter.userId);
    if (filter.page) searchParams.set('page', String(filter.page));
    if (filter.limit) searchParams.set('limit', String(filter.limit));

    return apiClient
      .get(API_ENDPOINTS.audit.adminList, {
        searchParams,
      })
      .json<PaginatedAuditLogResponseDto>();
  },

  /**
   * Get audit log entry details
   */
  async getById(id: string): Promise<AuditLogResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.audit.adminDetail(id))
      .json<ApiResponse<AuditLogResponseDto> | AuditLogResponseDto>();
    return unwrapResponse(res);
  },
};
