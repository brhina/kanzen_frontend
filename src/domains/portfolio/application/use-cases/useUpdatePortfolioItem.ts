import { useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '../../infrastructure/portfolio.api';
import { PortfolioMapper } from '../../infrastructure/portfolio.mapper';
import type { UpdatePortfolioDto } from '../../infrastructure/portfolio.dto';
import type { PortfolioItemEntity } from '../../domain/entities/portfolio-item.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export interface UpdatePortfolioItemArgs {
  id: string;
  dto: UpdatePortfolioDto;
}

export function useUpdatePortfolioItem() {
  const queryClient = useQueryClient();

  return useMutation<PortfolioItemEntity, Error, UpdatePortfolioItemArgs>({
    mutationFn: async ({ id, dto }) => {
      const response = await portfolioApi.update(id, dto);
      return PortfolioMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success(`Project "${data.title}" updated successfully!`, 'Project Updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update portfolio item', 'Error');
    },
  });
}
