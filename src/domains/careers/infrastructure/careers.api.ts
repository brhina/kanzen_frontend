import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  JobPostingDto,
  CreateJobPostingDto,
  UpdateJobPostingDto,
  FilterCareersDto,
  JobPostingListResponseDto,
} from './careers.dto';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const careersApi = {
  /**
   * List active careers (Public)
   */
  async getActive(params: FilterCareersDto = {}): Promise<JobPostingListResponseDto> {
    const searchParams = new URLSearchParams();
    if (params.department) searchParams.set('department', params.department);
    if (params.type) searchParams.set('type', params.type);
    if (params.mode) searchParams.set('mode', params.mode);
    if (params.experienceLevel) searchParams.set('experienceLevel', params.experienceLevel);
    if (params.search) searchParams.set('search', params.search);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    return apiClient
      .get(API_ENDPOINTS.careers.list, { searchParams })
      .json<JobPostingListResponseDto>();
  },

  /**
   * Get career opportunity by slug (Public)
   */
  async getBySlug(slug: string): Promise<JobPostingDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.careers.detail(slug))
      .json<ApiResponse<JobPostingDto> | JobPostingDto>();
    return unwrapResponse(res);
  },

  /**
   * List all job postings including drafts and paused (Admin)
   */
  async listAdmin(params: FilterCareersDto = {}): Promise<JobPostingListResponseDto> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set('status', params.status);
    if (params.department) searchParams.set('department', params.department);
    if (params.type) searchParams.set('type', params.type);
    if (params.mode) searchParams.set('mode', params.mode);
    if (params.experienceLevel) searchParams.set('experienceLevel', params.experienceLevel);
    if (params.search) searchParams.set('search', params.search);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    return apiClient
      .get(API_ENDPOINTS.careers.adminList, { searchParams })
      .json<JobPostingListResponseDto>();
  },

  /**
   * Get job posting by ID (Admin)
   */
  async getAdminById(id: string): Promise<JobPostingDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.careers.adminDetail(id))
      .json<ApiResponse<JobPostingDto> | JobPostingDto>();
    return unwrapResponse(res);
  },

  /**
   * Create a new job posting (Admin)
   */
  async create(data: CreateJobPostingDto): Promise<JobPostingDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.careers.adminCreate, { json: data })
      .json<ApiResponse<JobPostingDto> | JobPostingDto>();
    return unwrapResponse(res);
  },

  /**
   * Update existing job posting (Admin)
   */
  async update(id: string, data: UpdateJobPostingDto): Promise<JobPostingDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.careers.adminUpdate(id), { json: data })
      .json<ApiResponse<JobPostingDto> | JobPostingDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete job posting (Admin)
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    return apiClient
      .delete(API_ENDPOINTS.careers.adminDelete(id))
      .json<{ success: boolean; message?: string }>();
  },
};
