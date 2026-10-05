import { useQuery } from '@tanstack/react-query';
import { portfolioApi } from '../../infrastructure/portfolio.api';
import { PortfolioMapper } from '../../infrastructure/portfolio.mapper';
import type { PortfolioFilterQuery } from '../../infrastructure/portfolio.dto';
import type { PortfolioItemEntity } from '../../domain/entities/portfolio-item.entity';

export interface UsePortfolioItemsOptions extends PortfolioFilterQuery {
  isAdminView?: boolean;
}

export interface UsePortfolioItemsResult {
  items: PortfolioItemEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function usePortfolioItems({
  isAdminView = false,
  ...filter
}: UsePortfolioItemsOptions = {}) {
  return useQuery<UsePortfolioItemsResult>({
    queryKey: ['portfolio', isAdminView ? 'admin' : 'public', filter],
    queryFn: async () => {
      if (isAdminView) {
        const response = await portfolioApi.listAdmin(filter);
        return PortfolioMapper.toPaginated(response);
      }
      const response = await portfolioApi.listPublic(filter);
      return PortfolioMapper.toPaginated(response);
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}
