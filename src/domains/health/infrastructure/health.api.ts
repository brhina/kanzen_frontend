import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  HealthResponseDto,
  DetailedHealthResponseDto,
} from './health.dto';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const healthApi = {
  /**
   * Public liveness & uptime status probe
   */
  async getStatus(): Promise<HealthResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.health.status)
      .json<ApiResponse<HealthResponseDto> | HealthResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Subsystem detailed telemetry (DB, Redis, BullMQ queue, memory, process)
   */
  async getDetailed(): Promise<DetailedHealthResponseDto> {
    try {
      const res = await apiClient
        .get(API_ENDPOINTS.health.detailed)
        .json<ApiResponse<DetailedHealthResponseDto> | DetailedHealthResponseDto>();
      return unwrapResponse(res);
    } catch {
      // Fallback probe endpoint
      const fallback = await apiClient
        .get(API_ENDPOINTS.health.publicDetailed)
        .json<ApiResponse<DetailedHealthResponseDto> | DetailedHealthResponseDto>();
      return unwrapResponse(fallback);
    }
  },
};
