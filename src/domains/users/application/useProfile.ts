import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/auth.store';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { usersApi } from '../infrastructure/users.api';
import { usersMapper } from '../infrastructure/users.mapper';

export function useProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: [...queryKeys.users.all, 'profile'],
    queryFn: async () => {
      const dto = await usersApi.getMe();
      return usersMapper.toEntity(dto);
    },
    enabled: isAuthenticated,
  });
}
