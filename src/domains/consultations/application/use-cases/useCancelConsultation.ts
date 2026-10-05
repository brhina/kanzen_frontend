import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { consultationsApi } from '../../infrastructure/consultations.api';
import { ConsultationMapper } from '../../infrastructure/consultations.mapper';
import type { CancelConsultationDto } from '../../infrastructure/consultations.dto';
import type { ConsultationEntity } from '../../domain/entities/consultation.entity';

export interface CancelConsultationParams {
  id: string;
  data: CancelConsultationDto;
}

export function useCancelConsultation() {
  const queryClient = useQueryClient();

  return useMutation<ConsultationEntity, Error, CancelConsultationParams>({
    mutationFn: async ({ id, data }: CancelConsultationParams) => {
      const response = await consultationsApi.cancel(id, data);
      return ConsultationMapper.toEntity(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultations.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultations.detail(id) });
    },
  });
}
