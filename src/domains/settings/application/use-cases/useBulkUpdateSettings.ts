import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { settingsApi } from '../../infrastructure/settings.api';
import { SettingsMapper } from '../../infrastructure/settings.mapper';
import type { BulkUpdateItem } from '../../infrastructure/settings.dto';
import type { SettingEntity } from '../../domain/entities/setting.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export interface BulkUpdateSettingsVariables {
  items: BulkUpdateItem[];
}

/**
 * Saves multiple dirty settings in one request instead of a sequential
 * PATCH per key — one round trip, one public-cache invalidation.
 */
export function useBulkUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation<SettingEntity[], Error, BulkUpdateSettingsVariables>({
    mutationFn: async ({ items }) => {
      const response = await settingsApi.bulkUpdate({ items });
      return (response || []).map((item) => SettingsMapper.toDomain(item));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.public() });
      toast.success(
        `${data.length} configuration${data.length === 1 ? '' : 's'} saved and synchronized across services!`,
        'Settings Updated',
      );
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save configuration settings', 'Error');
    },
  });
}
