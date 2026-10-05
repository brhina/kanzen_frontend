import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  NewsletterSubscriberResponseDto,
  SubscribeNewsletterDto,
  UnsubscribeNewsletterDto,
  UpdateNewsletterSubscriberDto,
  FilterNewsletterDto,
} from './newsletter.dto';
import type { PaginatedNewsletterResponseDto } from './newsletter.mapper';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const newsletterApi = {
  /**
   * Subscribe to newsletter with double opt-in (Public)
   */
  async subscribe(
    data: SubscribeNewsletterDto,
  ): Promise<{ message: string; subscriber: NewsletterSubscriberResponseDto }> {
    return apiClient
      .post(API_ENDPOINTS.newsletter.subscribe, { json: data })
      .json<{ message: string; subscriber: NewsletterSubscriberResponseDto }>();
  },

  /**
   * Confirm subscription token (Public)
   */
  async confirm(
    token: string,
  ): Promise<{ message: string; subscriber: NewsletterSubscriberResponseDto }> {
    return apiClient
      .get(API_ENDPOINTS.newsletter.confirm(token))
      .json<{ message: string; subscriber: NewsletterSubscriberResponseDto }>();
  },

  /**
   * Unsubscribe from newsletter (Public)
   */
  async unsubscribe(
    data: UnsubscribeNewsletterDto,
  ): Promise<{ message: string }> {
    return apiClient
      .post(API_ENDPOINTS.newsletter.unsubscribe, { json: data })
      .json<{ message: string }>();
  },

  /**
   * List subscribers with filters & pagination (Admin)
   */
  async listAdmin(
    params: FilterNewsletterDto = {},
  ): Promise<PaginatedNewsletterResponseDto> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set('status', params.status);
    if (params.source) searchParams.set('source', params.source);
    if (params.tag) searchParams.set('tag', params.tag);
    if (params.search) searchParams.set('search', params.search);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    return apiClient
      .get(API_ENDPOINTS.newsletter.adminList, { searchParams })
      .json<PaginatedNewsletterResponseDto>();
  },

  /**
   * Get subscriber details by ID (Admin)
   */
  async getById(id: string): Promise<NewsletterSubscriberResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.newsletter.adminDetail(id))
      .json<ApiResponse<NewsletterSubscriberResponseDto> | NewsletterSubscriberResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update subscriber status or tags (Admin)
   */
  async update(
    id: string,
    data: UpdateNewsletterSubscriberDto,
  ): Promise<NewsletterSubscriberResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.newsletter.adminUpdate(id), { json: data })
      .json<ApiResponse<NewsletterSubscriberResponseDto> | NewsletterSubscriberResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Remove subscriber permanently (Admin)
   */
  async delete(id: string): Promise<{ success: boolean; message?: string }> {
    return apiClient
      .delete(API_ENDPOINTS.newsletter.adminDelete(id))
      .json<{ success: boolean; message?: string }>();
  },

  /**
   * Export active subscribers as CSV (Admin)
   */
  async exportCsv(): Promise<Blob> {
    return apiClient.get(API_ENDPOINTS.newsletter.adminExport).blob();
  },
};
