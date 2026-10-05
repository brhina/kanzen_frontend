import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { contactApi } from '../../infrastructure/contact.api';
import { ContactMapper } from '../../infrastructure/contact.mapper';
import { ContactStatus } from '../../domain/enums/contact-status.enum';
import type { ContactEntity } from '../../domain/entities/contact.entity';

export function useMarkContactRead() {
  const queryClient = useQueryClient();

  return useMutation<ContactEntity, Error, string>({
    mutationFn: async (id: string) => {
      const response = await contactApi.updateStatus(id, ContactStatus.READ);
      return ContactMapper.toEntity(response);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.detail(id) });
    },
  });
}
