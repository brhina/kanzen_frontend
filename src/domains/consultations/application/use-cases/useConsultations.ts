import { useQuery } from '@tanstack/react-query';
import { consultationsApi } from '../../infrastructure/consultations.api';
import { ConsultationMapper } from '../../infrastructure/consultations.mapper';
import type { FilterConsultationsDto } from '../../infrastructure/consultations.dto';
import type { ConsultationEntity } from '../../domain/entities/consultation.entity';

export interface UseConsultationsOptions extends FilterConsultationsDto {
  isAdminView?: boolean;
}

export interface UseConsultationsResult {
  items: ConsultationEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useConsultations(options: UseConsultationsOptions = {}) {
  const { isAdminView = false, ...filters } = options;
  return useQuery<UseConsultationsResult>({
    queryKey: ['consultations', isAdminView ? 'admin' : 'public', filters],
    queryFn: async () => {
      const response = isAdminView
        ? await consultationsApi.listAdmin(filters)
        : await consultationsApi.listPublic(filters);
      return ConsultationMapper.toPaginated(response);
    },
    staleTime: 1000 * 60 * 2,
  });
}
