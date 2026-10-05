import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { consultationsApi } from '../../infrastructure/consultations.api';
import { ConsultationMapper } from '../../infrastructure/consultations.mapper';
import type { CreateConsultationDto } from '../../infrastructure/consultations.dto';
import type { ConsultationEntity } from '../../domain/entities/consultation.entity';

export function useBookConsultation() {
  const queryClient = useQueryClient();

  return useMutation<ConsultationEntity, Error, CreateConsultationDto>({
    mutationFn: async (dto: CreateConsultationDto) => {
      const response = await consultationsApi.book(dto);
      return ConsultationMapper.toEntity(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultations.all });
    },
  });
}
