import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { newsletterApi } from '../../infrastructure/newsletter.api';
import { NewsletterMapper } from '../../infrastructure/newsletter.mapper';
import type { FilterNewsletterDto } from '../../infrastructure/newsletter.dto';
import type { NewsletterSubscriberEntity } from '../../domain/entities/newsletter-subscriber.entity';

export interface UseNewsletterSubscribersResult {
  items: NewsletterSubscriberEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useNewsletterSubscribers(filters: FilterNewsletterDto = {}) {
  return useQuery<UseNewsletterSubscribersResult>({
    queryKey: queryKeys.newsletter.list(filters),
    queryFn: async () => {
      const response = await newsletterApi.listAdmin(filters);
      return NewsletterMapper.toPaginated(response);
    },
    staleTime: 1000 * 60 * 2,
  });
}
