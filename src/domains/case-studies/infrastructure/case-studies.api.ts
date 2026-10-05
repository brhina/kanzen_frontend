import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  CaseStudyResponseDto,
  CreateCaseStudyDto,
  UpdateCaseStudyDto,
  FilterCaseStudiesDto,
} from './case-studies.dto';
import type { PaginatedCaseStudiesResponseDto } from './case-studies.mapper';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const caseStudiesApi = {
  /**
   * List all published case studies (Public)
   */
  async listPublic(filter: FilterCaseStudiesDto = {}): Promise<CaseStudyResponseDto[]> {
    const searchParams = new URLSearchParams();
    if (filter.industry) searchParams.set('industry', filter.industry);
    if (filter.isFeatured !== undefined) searchParams.set('isFeatured', String(filter.isFeatured));
    if (filter.search) searchParams.set('search', filter.search);

    const res = await apiClient
      .get(API_ENDPOINTS.caseStudies.list, { searchParams })
      .json<ApiResponse<CaseStudyResponseDto[]> | CaseStudyResponseDto[]>();
    return unwrapResponse(res);
  },

  /**
   * List featured case studies (Public)
   */
  async getFeatured(): Promise<CaseStudyResponseDto[]> {
    const res = await apiClient
      .get(API_ENDPOINTS.caseStudies.featured)
      .json<ApiResponse<CaseStudyResponseDto[]> | CaseStudyResponseDto[]>();
    return unwrapResponse(res);
  },

  /**
   * Get case study by slug (Public)
   */
  async getBySlug(slug: string): Promise<CaseStudyResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.caseStudies.detail(slug))
      .json<ApiResponse<CaseStudyResponseDto> | CaseStudyResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * List all case studies with administrative filters (Admin)
   */
  async listAdmin(filter: FilterCaseStudiesDto = {}): Promise<PaginatedCaseStudiesResponseDto> {
    const searchParams = new URLSearchParams();
    if (filter.industry) searchParams.set('industry', filter.industry);
    if (filter.status) searchParams.set('status', filter.status);
    if (filter.search) searchParams.set('search', filter.search);
    if (filter.page) searchParams.set('page', String(filter.page));
    if (filter.limit) searchParams.set('limit', String(filter.limit));

    return apiClient
      .get(API_ENDPOINTS.caseStudies.adminList, { searchParams })
      .json<PaginatedCaseStudiesResponseDto>();
  },

  /**
   * Get case study details by ID (Admin)
   */
  async getById(id: string): Promise<CaseStudyResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.caseStudies.adminDetail(id))
      .json<ApiResponse<CaseStudyResponseDto> | CaseStudyResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Create a new case study (Admin)
   */
  async create(data: CreateCaseStudyDto): Promise<CaseStudyResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.caseStudies.adminCreate, { json: data })
      .json<ApiResponse<CaseStudyResponseDto> | CaseStudyResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update an existing case study (Admin)
   */
  async update(id: string, data: UpdateCaseStudyDto): Promise<CaseStudyResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.caseStudies.adminUpdate(id), { json: data })
      .json<ApiResponse<CaseStudyResponseDto> | CaseStudyResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete a case study (Admin)
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    return apiClient
      .delete(API_ENDPOINTS.caseStudies.adminDelete(id))
      .json<{ success: boolean; message?: string }>();
  },
};
