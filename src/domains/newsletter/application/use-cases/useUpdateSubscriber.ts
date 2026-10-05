import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { newsletterApi } from '../../infrastructure/newsletter.api';
import { NewsletterMapper } from '../../infrastructure/newsletter.mapper';
import type { UpdateNewsletterSubscriberDto } from '../../infrastructure/newsletter.dto';
import type { NewsletterSubscriberEntity } from '../../domain/entities/newsletter-subscriber.entity';

export interface UpdateSubscriberParams {
  id: string;
  data: UpdateNewsletterSubscriberDto;
}

export function useUpdateSubscriber() {
  const queryClient = useQueryClient();

  return useMutation<NewsletterSubscriberEntity, Error, UpdateSubscriberParams>({
    mutationFn: async ({ id, data }: UpdateSubscriberParams) => {
      const response = await newsletterApi.update(id, data);
      return NewsletterMapper.toEntity(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.newsletter.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.newsletter.detail(id) });
    },
  });
}
