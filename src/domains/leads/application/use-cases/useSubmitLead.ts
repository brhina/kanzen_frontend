import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { leadsApi } from '../../infrastructure/leads.api';
import { LeadMapper } from '../../infrastructure/leads.mapper';
import type { CreateLeadDto } from '../../infrastructure/leads.dto';
import type { LeadEntity } from '../../domain/entities/lead.entity';

export function useSubmitLead() {
  const queryClient = useQueryClient();

  return useMutation<LeadEntity, Error, CreateLeadDto>({
    mutationFn: async (dto: CreateLeadDto) => {
      const response = await leadsApi.submit(dto);
      return LeadMapper.toEntity(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
    },
  });
}
