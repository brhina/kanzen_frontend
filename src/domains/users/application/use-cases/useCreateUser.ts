import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { usersApi } from '../../infrastructure/users.api';
import { usersMapper } from '../../infrastructure/users.mapper';
import type { CreateUserDto } from '../../infrastructure/users.dto';
import { useToastStore } from '@/shared/ui/toast';

export interface UseCreateUserOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCreateUser(options: UseCreateUserOptions = {}) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: async (dto: CreateUserDto) => {
      const res = await usersApi.create(dto);
      return usersMapper.toEntity(res);
    },
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      addToast({
        title: 'User Created',
        message: `Successfully added ${user.fullName} (${user.email}) to the team.`,
        type: 'success',
      });
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      addToast({
        title: 'Creation Failed',
        message: error.message || 'Unable to create user record.',
        type: 'error',
      });
      options.onError?.(error);
    },
  });
}
