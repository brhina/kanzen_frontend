import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { settingsApi } from '../../infrastructure/settings.api';
import { SettingsMapper } from '../../infrastructure/settings.mapper';
import type { CreateSettingDto } from '../../infrastructure/settings.dto';
import type { SettingEntity } from '../../domain/entities/setting.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export function useCreateSetting() {
  const queryClient = useQueryClient();

  return useMutation<SettingEntity, Error, CreateSettingDto>({
    mutationFn: async (dto) => {
      const response = await settingsApi.create(dto);
      return SettingsMapper.toDomain(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.public() });
      toast.success(`Configuration "${data.label || data.key}" created successfully!`, 'Configuration Created');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create configuration setting', 'Error');
    },
  });
}
