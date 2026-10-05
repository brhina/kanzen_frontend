import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/auth.store';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { authApi } from '../infrastructure/auth.api';
import { authMapper } from '../infrastructure/auth.mapper';

export function useCurrentUser() {
  const { isAuthenticated, setUser } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const data = await authApi.getMe();
      const entity = authMapper.toUserEntity(data);
      setUser(entity);
      return entity;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
