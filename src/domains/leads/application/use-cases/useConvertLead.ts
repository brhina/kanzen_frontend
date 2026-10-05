import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { leadsApi } from '../../infrastructure/leads.api';
import { LeadMapper } from '../../infrastructure/leads.mapper';
import type { LeadEntity } from '../../domain/entities/lead.entity';

export function useConvertLead() {
  const queryClient = useQueryClient();

  return useMutation<LeadEntity, Error, string>({
    mutationFn: async (id: string) => {
      const response = await leadsApi.convert(id);
      return LeadMapper.toEntity(response);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(id) });
    },
  });
}
