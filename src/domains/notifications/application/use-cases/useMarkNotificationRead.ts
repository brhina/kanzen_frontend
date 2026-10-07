import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { notificationsApi } from '../../infrastructure/notifications.api';
import { NotificationMapper } from '../../infrastructure/notifications.mapper';
import type { NotificationEntity } from '../../domain/entities/notification.entity';

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation<NotificationEntity, Error, string>({
    mutationFn: async (id: string) => {
      const response = await notificationsApi.markRead(id);
      return NotificationMapper.toDomain(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}
