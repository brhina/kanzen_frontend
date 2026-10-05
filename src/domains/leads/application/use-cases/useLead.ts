import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { leadsApi } from '../../infrastructure/leads.api';
import { LeadMapper } from '../../infrastructure/leads.mapper';
import type { LeadEntity } from '../../domain/entities/lead.entity';

export function useLead(id?: string) {
  return useQuery<LeadEntity>({
    queryKey: queryKeys.leads.detail(id ?? ''),
    queryFn: async () => {
      if (!id) throw new Error('Lead ID is required');
      const response = await leadsApi.getById(id);
      return LeadMapper.toEntity(response);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}
