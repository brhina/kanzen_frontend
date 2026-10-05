import { useMutation, useQueryClient } from '@tanstack/react-query';
import { caseStudiesApi } from '../../infrastructure/case-studies.api';
import { CaseStudyMapper } from '../../infrastructure/case-studies.mapper';
import type { UpdateCaseStudyDto } from '../../infrastructure/case-studies.dto';
import type { CaseStudyEntity } from '../../domain/entities/case-study.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export interface UpdateCaseStudyArgs {
  id: string;
  dto: UpdateCaseStudyDto;
}

export function useUpdateCaseStudy() {
  const queryClient = useQueryClient();

  return useMutation<CaseStudyEntity, Error, UpdateCaseStudyArgs>({
    mutationFn: async ({ id, dto }) => {
      const response = await caseStudiesApi.update(id, dto);
      return CaseStudyMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['case-studies'] });
      toast.success(`Case study "${data.title}" updated successfully!`, 'Case Study Updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update case study', 'Error');
    },
  });
}
