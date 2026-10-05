import { useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '../../infrastructure/portfolio.api';
import { PortfolioMapper } from '../../infrastructure/portfolio.mapper';
import type { CreatePortfolioDto } from '../../infrastructure/portfolio.dto';
import type { PortfolioItemEntity } from '../../domain/entities/portfolio-item.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export function useCreatePortfolioItem() {
  const queryClient = useQueryClient();

  return useMutation<PortfolioItemEntity, Error, CreatePortfolioDto>({
    mutationFn: async (dto) => {
      const response = await portfolioApi.create(dto);
      return PortfolioMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success(`Project "${data.title}" created successfully!`, 'Project Created');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create portfolio item', 'Error');
    },
  });
}
