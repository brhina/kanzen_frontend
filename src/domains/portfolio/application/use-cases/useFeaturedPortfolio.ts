import { useQuery } from '@tanstack/react-query';
import { portfolioApi } from '../../infrastructure/portfolio.api';
import { PortfolioMapper } from '../../infrastructure/portfolio.mapper';
import type { PortfolioItemEntity } from '../../domain/entities/portfolio-item.entity';

export function useFeaturedPortfolio() {
  return useQuery<PortfolioItemEntity[]>({
    queryKey: ['portfolio', 'featured'],
    queryFn: async () => {
      const response = await portfolioApi.getFeatured();
      return PortfolioMapper.toEntityList(response);
    },
    staleTime: 1000 * 60 * 5,
  });
}
