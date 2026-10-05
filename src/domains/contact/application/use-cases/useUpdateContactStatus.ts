import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { contactApi } from '../../infrastructure/contact.api';
import { ContactMapper } from '../../infrastructure/contact.mapper';
import type { ContactStatus } from '../../domain/enums/contact-status.enum';
import type { ContactEntity } from '../../domain/entities/contact.entity';

export interface UpdateContactStatusParams {
  id: string;
  status: ContactStatus;
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();

  return useMutation<ContactEntity, Error, UpdateContactStatusParams>({
    mutationFn: async ({ id, status }: UpdateContactStatusParams) => {
      const response = await contactApi.updateStatus(id, status);
      return ContactMapper.toEntity(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.detail(id) });
    },
  });
}
