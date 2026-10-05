import { useQuery } from '@tanstack/react-query';
import { caseStudiesApi } from '../../infrastructure/case-studies.api';
import { CaseStudyMapper } from '../../infrastructure/case-studies.mapper';
import type { FilterCaseStudiesDto } from '../../infrastructure/case-studies.dto';
import type { CaseStudyEntity } from '../../domain/entities/case-study.entity';

export interface UseCaseStudiesOptions extends FilterCaseStudiesDto {
  isAdminView?: boolean;
}

export interface UseCaseStudiesResult {
  items: CaseStudyEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useCaseStudies({
  isAdminView = false,
  ...filter
}: UseCaseStudiesOptions = {}) {
  return useQuery<UseCaseStudiesResult>({
    queryKey: ['case-studies', isAdminView ? 'admin' : 'public', filter],
    queryFn: async () => {
      if (isAdminView) {
        const response = await caseStudiesApi.listAdmin(filter);
        return CaseStudyMapper.toPaginated(response);
      }
      const response = await caseStudiesApi.listPublic(filter);
      return CaseStudyMapper.toPaginated(response);
    },
    staleTime: 1000 * 60 * 3,
  });
}
