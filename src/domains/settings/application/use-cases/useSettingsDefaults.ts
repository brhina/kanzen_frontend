import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { settingsApi } from '../../infrastructure/settings.api';
import type { DefaultSettingDto } from '../../infrastructure/settings.dto';

/**
 * Seeded default values keyed by setting key. Powers the per-field
 * "Restore default" action in the admin settings editor.
 */
export function useSettingsDefaults() {
  return useQuery<Record<string, DefaultSettingDto>>({
    queryKey: queryKeys.settings.defaults(),
    queryFn: async () => {
      const defaults = await settingsApi.getDefaults();
      const map: Record<string, DefaultSettingDto> = {};
      for (const item of defaults || []) {
        map[item.key] = item;
      }
      return map;
    },
    staleTime: 1000 * 60 * 10,
  });
}
