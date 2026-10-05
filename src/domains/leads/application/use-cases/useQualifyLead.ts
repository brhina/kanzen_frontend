import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { leadsApi } from '../../infrastructure/leads.api';
import { LeadMapper } from '../../infrastructure/leads.mapper';
import type { QualifyLeadDto } from '../../infrastructure/leads.dto';
import type { LeadEntity } from '../../domain/entities/lead.entity';

export interface QualifyLeadParams {
  id: string;
  data: QualifyLeadDto;
}

export function useQualifyLead() {
  const queryClient = useQueryClient();

  return useMutation<LeadEntity, Error, QualifyLeadParams>({
    mutationFn: async ({ id, data }: QualifyLeadParams) => {
      const response = await leadsApi.qualify(id, data);
      return LeadMapper.toEntity(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(id) });
    },
  });
}
