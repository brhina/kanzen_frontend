import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { leadsApi } from '../../infrastructure/leads.api';
import { LeadMapper } from '../../infrastructure/leads.mapper';
import type { FilterLeadsDto } from '../../infrastructure/leads.dto';
import type { LeadEntity } from '../../domain/entities/lead.entity';

export interface UseLeadsResult {
  items: LeadEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useLeads(filters: FilterLeadsDto = {}) {
  return useQuery<UseLeadsResult>({
    queryKey: queryKeys.leads.list(filters),
    queryFn: async () => {
      const response = await leadsApi.listAdmin(filters);
      return LeadMapper.toPaginated(response);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
