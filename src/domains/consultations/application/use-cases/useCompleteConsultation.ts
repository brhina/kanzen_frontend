import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { consultationsApi } from '../../infrastructure/consultations.api';
import { ConsultationMapper } from '../../infrastructure/consultations.mapper';
import { ConsultationStatus } from '../../domain/enums/consultation-status.enum';
import type { ConsultationEntity } from '../../domain/entities/consultation.entity';

export function useCompleteConsultation() {
  const queryClient = useQueryClient();

  return useMutation<ConsultationEntity, Error, string>({
    mutationFn: async (id: string) => {
      const response = await consultationsApi.update(id, {
        status: ConsultationStatus.COMPLETED,
      });
      return ConsultationMapper.toEntity(response);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultations.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultations.detail(id) });
    },
  });
}
