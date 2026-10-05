import { useMutation, useQueryClient } from '@tanstack/react-query';
import { caseStudiesApi } from '../../infrastructure/case-studies.api';
import { CaseStudyMapper } from '../../infrastructure/case-studies.mapper';
import type { CreateCaseStudyDto } from '../../infrastructure/case-studies.dto';
import type { CaseStudyEntity } from '../../domain/entities/case-study.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export function useCreateCaseStudy() {
  const queryClient = useQueryClient();

  return useMutation<CaseStudyEntity, Error, CreateCaseStudyDto>({
    mutationFn: async (dto) => {
      const response = await caseStudiesApi.create(dto);
      return CaseStudyMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['case-studies'] });
      toast.success(`Case study "${data.title}" created successfully!`, 'Case Study Created');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create case study', 'Error');
    },
  });
}
