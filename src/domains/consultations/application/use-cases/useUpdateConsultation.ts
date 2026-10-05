import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { consultationsApi } from '../../infrastructure/consultations.api';
import { ConsultationMapper } from '../../infrastructure/consultations.mapper';
import type { UpdateConsultationDto } from '../../infrastructure/consultations.dto';
import type { ConsultationEntity } from '../../domain/entities/consultation.entity';

export interface UpdateConsultationParams {
  id: string;
  data: UpdateConsultationDto;
}

export function useUpdateConsultation() {
  const queryClient = useQueryClient();

  return useMutation<ConsultationEntity, Error, UpdateConsultationParams>({
    mutationFn: async ({ id, data }: UpdateConsultationParams) => {
      const response = await consultationsApi.update(id, data);
      return ConsultationMapper.toEntity(response);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultations.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultations.detail(id) });
    },
  });
}
