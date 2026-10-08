import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { settingsApi } from '../../infrastructure/settings.api';
import { toast } from '@/shared/ui/toast/toast.store';

export function useDeleteSetting() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (key: string) => {
      return settingsApi.delete(key);
    },
    onSuccess: (_, key) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.public() });
      toast.success(`Configuration "${key}" removed successfully.`, 'Setting Removed');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete configuration setting', 'Error');
    },
  });
}
