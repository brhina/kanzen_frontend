import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { leadsApi } from '../../infrastructure/leads.api';
import { LeadMapper } from '../../infrastructure/leads.mapper';
import type { UpdateLeadDto } from '../../infrastructure/leads.dto';
import type { LeadEntity } from '../../domain/entities/lead.entity';

export interface UpdateLeadParams {
  id: string;
  data: UpdateLeadDto;
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation<LeadEntity, Error, UpdateLeadParams>({
    mutationFn: async ({ id, data }: UpdateLeadParams) => {
      const response = await leadsApi.update(id, data);
      return LeadMapper.toEntity(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(id) });
    },
  });
}
