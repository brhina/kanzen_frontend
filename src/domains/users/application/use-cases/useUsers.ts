import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { usersApi } from '../../infrastructure/users.api';
import { usersMapper } from '../../infrastructure/users.mapper';
import type { FilterUsersDto } from '../../infrastructure/users.dto';

export function useUsers(filter: FilterUsersDto = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(filter as Record<string, unknown>),
    queryFn: async () => {
      const dto = await usersApi.list(filter);
      return usersMapper.toPaginated(dto);
    },
    staleTime: 60 * 1000, // 1 minute
  });
}
