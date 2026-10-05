import { useQuery } from '@tanstack/react-query';
import { caseStudiesApi } from '../../infrastructure/case-studies.api';
import { CaseStudyMapper } from '../../infrastructure/case-studies.mapper';
import type { CaseStudyEntity } from '../../domain/entities/case-study.entity';

export function useCaseStudy(slug?: string) {
  return useQuery<CaseStudyEntity | null>({
    queryKey: ['case-studies', 'detail', slug],
    queryFn: async () => {
      if (!slug) return null;
      const response = await caseStudiesApi.getBySlug(slug);
      return CaseStudyMapper.toEntity(response);
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
}
