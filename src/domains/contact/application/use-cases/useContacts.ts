import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { contactApi } from '../../infrastructure/contact.api';
import { ContactMapper } from '../../infrastructure/contact.mapper';
import type { FilterContactDto } from '../../infrastructure/contact.dto';
import type { ContactEntity } from '../../domain/entities/contact.entity';

export interface UseContactsResult {
  items: ContactEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useContacts(filters: FilterContactDto = {}) {
  return useQuery<UseContactsResult>({
    queryKey: queryKeys.contact.list(filters),
    queryFn: async () => {
      const response = await contactApi.listAdmin(filters);
      return ContactMapper.toPaginated(response);
    },
    staleTime: 1000 * 60 * 2,
  });
}
