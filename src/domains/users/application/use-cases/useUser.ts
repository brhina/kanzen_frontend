import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { usersApi } from '../../infrastructure/users.api';
import { usersMapper } from '../../infrastructure/users.mapper';

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(id || ''),
    queryFn: async () => {
      if (!id) throw new Error('User ID is required');
      const dto = await usersApi.getById(id);
      return usersMapper.toEntity(dto);
    },
    enabled: Boolean(id),
  });
}
