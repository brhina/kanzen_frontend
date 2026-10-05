import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { newsletterApi } from '../../infrastructure/newsletter.api';
import { NewsletterMapper } from '../../infrastructure/newsletter.mapper';
import type { SubscribeNewsletterDto } from '../../infrastructure/newsletter.dto';
import type { NewsletterSubscriberEntity } from '../../domain/entities/newsletter-subscriber.entity';

export function useSubscribeNewsletter() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string; subscriber: NewsletterSubscriberEntity }, Error, SubscribeNewsletterDto>({
    mutationFn: async (dto: SubscribeNewsletterDto) => {
      const response = await newsletterApi.subscribe(dto);
      return {
        message: response.message,
        subscriber: NewsletterMapper.toEntity(response.subscriber),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.newsletter.all });
    },
  });
}
