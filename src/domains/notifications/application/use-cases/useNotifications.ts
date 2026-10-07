import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { notificationsApi } from '../../infrastructure/notifications.api';
import { NotificationMapper } from '../../infrastructure/notifications.mapper';
import type {
  CreateNotificationDto,
  FilterNotificationsDto,
} from '../../infrastructure/notifications.dto';
import type { NotificationEntity } from '../../domain/entities/notification.entity';

export interface UseNotificationsResult {
  items: NotificationEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useNotifications(filters: FilterNotificationsDto = {}, isAdminFeed = false) {
  return useQuery<UseNotificationsResult>({
    queryKey: isAdminFeed
      ? [...queryKeys.notifications.lists(), 'admin', filters]
      : queryKeys.notifications.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const response = isAdminFeed
        ? await notificationsApi.adminList(filters)
        : await notificationsApi.list(filters);

      return {
        items: NotificationMapper.toDomainList(response.data || []),
        total: response.meta?.pagination?.total ?? (response.data || []).length,
        page: response.meta?.pagination?.page ?? 1,
        limit: response.meta?.pagination?.limit ?? 20,
        totalPages: response.meta?.pagination?.totalPages ?? 1,
      };
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useUnreadNotificationsCount(enabled = true) {
  return useQuery<number>({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: async () => {
      return notificationsApi.unreadCount();
    },
    enabled,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Poll every minute
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return notificationsApi.markAllRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useBroadcastNotification() {
  const queryClient = useQueryClient();

  return useMutation<NotificationEntity, Error, CreateNotificationDto>({
    mutationFn: async (dto) => {
      const response = await notificationsApi.broadcast(dto);
      return NotificationMapper.toDomain(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}
