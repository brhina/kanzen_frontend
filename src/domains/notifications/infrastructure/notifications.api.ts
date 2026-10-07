import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  CreateNotificationDto,
  FilterNotificationsDto,
  NotificationResponseDto,
  PaginatedNotificationsResponseDto,
} from './notifications.dto';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const notificationsApi = {
  /**
   * List notifications for active user
   */
  async list(filter: FilterNotificationsDto = {}): Promise<PaginatedNotificationsResponseDto> {
    const searchParams = new URLSearchParams();
    if (filter.type) searchParams.set('type', filter.type);
    if (filter.channel) searchParams.set('channel', filter.channel);
    if (filter.status) searchParams.set('status', filter.status);
    if (filter.isUnread !== undefined) searchParams.set('isUnread', String(filter.isUnread));
    if (filter.page) searchParams.set('page', String(filter.page));
    if (filter.limit) searchParams.set('limit', String(filter.limit));

    return apiClient
      .get(API_ENDPOINTS.notifications.list, {
        searchParams,
      })
      .json<PaginatedNotificationsResponseDto>();
  },

  /**
   * Get unread notification counter
   */
  async unreadCount(): Promise<number> {
    const res = await apiClient
      .get(API_ENDPOINTS.notifications.unreadCount)
      .json<number | { count: number } | ApiResponse<{ count: number }>>();

    if (typeof res === 'number') return res;
    if (res && typeof res === 'object') {
      if ('count' in res && typeof (res as any).count === 'number') return (res as any).count;
      if ('data' in res && res.data && typeof (res.data as any).count === 'number') return (res.data as any).count;
    }
    return 0;
  },

  /**
   * Mark single notification as read
   */
  async markRead(id: string): Promise<NotificationResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.notifications.markRead(id))
      .json<ApiResponse<NotificationResponseDto> | NotificationResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Mark all notifications as read
   */
  async markAllRead(): Promise<{ modifiedCount: number }> {
    const res = await apiClient
      .patch(API_ENDPOINTS.notifications.markAllRead)
      .json<any>();
    return typeof res === 'number' ? { modifiedCount: res } : res;
  },

  /**
   * Broadcast notification to users (Admin)
   */
  async broadcast(dto: CreateNotificationDto): Promise<NotificationResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.notifications.broadcast, {
        json: dto,
      })
      .json<ApiResponse<NotificationResponseDto> | NotificationResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Admin list all notifications across system
   */
  async adminList(filter: FilterNotificationsDto = {}): Promise<PaginatedNotificationsResponseDto> {
    const searchParams = new URLSearchParams();
    if (filter.type) searchParams.set('type', filter.type);
    if (filter.channel) searchParams.set('channel', filter.channel);
    if (filter.status) searchParams.set('status', filter.status);
    if (filter.page) searchParams.set('page', String(filter.page));
    if (filter.limit) searchParams.set('limit', String(filter.limit));

    return apiClient
      .get(API_ENDPOINTS.notifications.adminList, {
        searchParams,
      })
      .json<PaginatedNotificationsResponseDto>();
  },

  /**
   * Delete notification (Admin)
   */
  async delete(id: string): Promise<boolean> {
    const res = await apiClient
      .delete(API_ENDPOINTS.notifications.adminDelete(id))
      .json<any>();
    return Boolean(res);
  },
};
