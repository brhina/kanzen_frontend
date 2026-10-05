import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { contactApi } from '../../infrastructure/contact.api';
import { ContactMapper } from '../../infrastructure/contact.mapper';
import type { CreateContactDto } from '../../infrastructure/contact.dto';
import type { ContactEntity } from '../../domain/entities/contact.entity';

export function useSendContact() {
  const queryClient = useQueryClient();

  return useMutation<ContactEntity, Error, CreateContactDto>({
    mutationFn: async (dto: CreateContactDto) => {
      const response = await contactApi.submit(dto);
      return ContactMapper.toEntity(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contact.all });
    },
  });
}
