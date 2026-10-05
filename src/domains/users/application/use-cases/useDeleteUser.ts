import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { usersApi } from '../../infrastructure/users.api';
import { useToastStore } from '@/shared/ui/toast';

export interface UseDeleteUserOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteUser(options: UseDeleteUserOptions = {}) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      addToast({
        title: 'User Deleted',
        message: 'User record has been permanently removed.',
        type: 'info',
      });
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      addToast({
        title: 'Deletion Failed',
        message: error.message || 'Unable to delete user account.',
        type: 'error',
      });
      options.onError?.(error);
    },
  });
}
