import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { settingsApi } from '../../infrastructure/settings.api';
import { SettingsMapper } from '../../infrastructure/settings.mapper';
import type { UpdateSettingDto } from '../../infrastructure/settings.dto';
import type { SettingEntity } from '../../domain/entities/setting.entity';

export interface UpdateSettingVariables {
  key: string;
  dto: UpdateSettingDto;
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation<SettingEntity, Error, UpdateSettingVariables>({
    mutationFn: async ({ key, dto }) => {
      const response = await settingsApi.update(key, dto);
      return SettingsMapper.toDomain(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
}
