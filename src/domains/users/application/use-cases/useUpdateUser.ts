import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { useAuthStore } from '@/core/auth/auth.store';
import { usersApi } from '../../infrastructure/users.api';
import { usersMapper } from '../../infrastructure/users.mapper';
import type { UpdateUserDto } from '../../infrastructure/users.dto';
import { useToastStore } from '@/shared/ui/toast';

export interface UpdateUserPayload {
  id: string;
  dto: UpdateUserDto;
}

export interface UseUpdateUserOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useUpdateUser(options: UseUpdateUserOptions = {}) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { user: currentUser, setUser } = useAuthStore();

  return useMutation({
    mutationFn: async ({ id, dto }: UpdateUserPayload) => {
      const res = await usersApi.update(id, dto);
      return usersMapper.toEntity(res);
    },
    onSuccess: (updatedUser, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });

      // If updating current active session user, update authStore
      if (currentUser?.id === updatedUser.id) {
        setUser(updatedUser);
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      }

      addToast({
        title: 'User Updated',
        message: `Successfully saved changes for ${updatedUser.fullName}.`,
        type: 'success',
      });
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      addToast({
        title: 'Update Failed',
        message: error.message || 'Unable to update user profile.',
        type: 'error',
      });
      options.onError?.(error);
    },
  });
}
