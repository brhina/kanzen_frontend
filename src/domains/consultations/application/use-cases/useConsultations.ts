import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { consultationsApi } from '../../infrastructure/consultations.api';
import { ConsultationMapper } from '../../infrastructure/consultations.mapper';
import type { FilterConsultationsDto } from '../../infrastructure/consultations.dto';
import type { ConsultationEntity } from '../../domain/entities/consultation.entity';

export interface UseConsultationsResult {
  items: ConsultationEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useConsultations(filters: FilterConsultationsDto = {}) {
  return useQuery<UseConsultationsResult>({
    queryKey: queryKeys.consultations.list(filters),
    queryFn: async () => {
      const response = await consultationsApi.listAdmin(filters);
      return ConsultationMapper.toPaginated(response);
    },
    staleTime: 1000 * 60 * 2,
  });
}
