import { useQuery } from '@tanstack/react-query';
import { caseStudiesApi } from '../../infrastructure/case-studies.api';
import { CaseStudyMapper } from '../../infrastructure/case-studies.mapper';
import type { CaseStudyEntity } from '../../domain/entities/case-study.entity';

export function useFeaturedCaseStudies() {
  return useQuery<CaseStudyEntity[]>({
    queryKey: ['case-studies', 'featured'],
    queryFn: async () => {
      const response = await caseStudiesApi.getFeatured();
      return CaseStudyMapper.toEntityList(response);
    },
    staleTime: 1000 * 60 * 5,
  });
}
