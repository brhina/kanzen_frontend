import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { contactApi } from '../../infrastructure/contact.api';
import { ContactMapper } from '../../infrastructure/contact.mapper';
import type { ContactEntity } from '../../domain/entities/contact.entity';

export function useContact(id?: string) {
  return useQuery<ContactEntity>({
    queryKey: queryKeys.contact.detail(id ?? ''),
    queryFn: async () => {
      if (!id) throw new Error('Contact ID is required');
      const response = await contactApi.getById(id);
      return ContactMapper.toEntity(response);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}
