import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type { ApplicationStatus } from '../domain/enums/application-status.enum';
import type {
  JobApplicationDto,
  CreateJobApplicationDto,
  UpdateJobApplicationDto,
  FilterApplicationsDto,
  JobApplicationListResponseDto,
} from './applications.dto';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const applicationsApi = {
  /**
   * Submit job application (Public)
   */
  async submit(data: CreateJobApplicationDto): Promise<JobApplicationDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.applications.submit, { json: data })
      .json<ApiResponse<JobApplicationDto> | JobApplicationDto>();
    return unwrapResponse(res);
  },

  /**
   * Submit application for a specific job posting (Public)
   */
  async submitForJob(
    jobId: string,
    data: Omit<CreateJobApplicationDto, 'jobId'>,
  ): Promise<JobApplicationDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.applications.submitForJob(jobId), { json: data })
      .json<ApiResponse<JobApplicationDto> | JobApplicationDto>();
    return unwrapResponse(res);
  },

  /**
   * List all candidate job applications with filters (Admin)
   */
  async adminList(
    params: FilterApplicationsDto = {},
  ): Promise<JobApplicationListResponseDto> {
    const searchParams = new URLSearchParams();
    if (params.jobId) searchParams.set('jobId', params.jobId);
    if (params.status) searchParams.set('status', params.status);
    if (params.search) searchParams.set('search', params.search);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    return apiClient
      .get(API_ENDPOINTS.applications.adminList, { searchParams })
      .json<JobApplicationListResponseDto>();
  },

  /**
   * Get application details by ID (Admin)
   */
  async adminGetById(id: string): Promise<JobApplicationDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.applications.adminDetail(id))
      .json<ApiResponse<JobApplicationDto> | JobApplicationDto>();
    return unwrapResponse(res);
  },

  /**
   * Update application notes, rating, interview date, or candidate details (Admin)
   */
  async adminUpdate(
    id: string,
    data: UpdateJobApplicationDto,
  ): Promise<JobApplicationDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.applications.adminUpdate(id), { json: data })
      .json<ApiResponse<JobApplicationDto> | JobApplicationDto>();
    return unwrapResponse(res);
  },

  /**
   * Move candidate along hiring workflow stages (Admin)
   */
  async adminUpdateStatus(
    id: string,
    status: ApplicationStatus,
    notes?: string,
  ): Promise<JobApplicationDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.applications.adminUpdateStatus(id), {
        json: { status, notes },
      })
      .json<ApiResponse<JobApplicationDto> | JobApplicationDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete application (Admin)
   */
  async adminDelete(
    id: string,
  ): Promise<{ success: boolean; message?: string }> {
    return apiClient
      .delete(API_ENDPOINTS.applications.adminDelete(id))
      .json<{ success: boolean; message?: string }>();
  },
};
