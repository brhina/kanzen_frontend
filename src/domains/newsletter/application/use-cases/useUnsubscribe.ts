import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { newsletterApi } from '../../infrastructure/newsletter.api';
import type { UnsubscribeNewsletterDto } from '../../infrastructure/newsletter.dto';

export function useUnsubscribe() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, UnsubscribeNewsletterDto>({
    mutationFn: async (dto: UnsubscribeNewsletterDto) => {
      return newsletterApi.unsubscribe(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.newsletter.all });
    },
  });
}
