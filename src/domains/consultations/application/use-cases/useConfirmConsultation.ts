import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { consultationsApi } from '../../infrastructure/consultations.api';
import { ConsultationMapper } from '../../infrastructure/consultations.mapper';
import type { ConfirmConsultationDto } from '../../infrastructure/consultations.dto';
import type { ConsultationEntity } from '../../domain/entities/consultation.entity';

export interface ConfirmConsultationParams {
  id: string;
  data: ConfirmConsultationDto;
}

export function useConfirmConsultation() {
  const queryClient = useQueryClient();

  return useMutation<ConsultationEntity, Error, ConfirmConsultationParams>({
    mutationFn: async ({ id, data }: ConfirmConsultationParams) => {
      const response = await consultationsApi.confirm(id, data);
      return ConsultationMapper.toEntity(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultations.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultations.detail(id) });
    },
  });
}
