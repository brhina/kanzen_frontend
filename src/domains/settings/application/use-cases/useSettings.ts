import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { settingsApi } from '../../infrastructure/settings.api';
import { SettingsMapper } from '../../infrastructure/settings.mapper';
import type { FilterSettingsDto } from '../../infrastructure/settings.dto';
import type { SettingEntity } from '../../domain/entities/setting.entity';

export function useSettings(filters: FilterSettingsDto = {}) {
  const groupKey = filters.group || 'all';

  return useQuery<SettingEntity[]>({
    queryKey: queryKeys.settings.group(groupKey),
    queryFn: async () => {
      const response = await settingsApi.listAll(filters);
      return SettingsMapper.toDomainList(response || []);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
