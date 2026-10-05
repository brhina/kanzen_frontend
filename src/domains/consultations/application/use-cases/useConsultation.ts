import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { consultationsApi } from '../../infrastructure/consultations.api';
import { ConsultationMapper } from '../../infrastructure/consultations.mapper';
import type { ConsultationEntity } from '../../domain/entities/consultation.entity';

export function useConsultation(id?: string) {
  return useQuery<ConsultationEntity>({
    queryKey: queryKeys.consultations.detail(id ?? ''),
    queryFn: async () => {
      if (!id) throw new Error('Consultation ID is required');
      const response = await consultationsApi.getById(id);
      return ConsultationMapper.toEntity(response);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}
