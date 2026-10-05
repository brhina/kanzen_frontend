import { useQuery } from '@tanstack/react-query';
import { portfolioApi } from '../../infrastructure/portfolio.api';
import { PortfolioMapper } from '../../infrastructure/portfolio.mapper';
import type { PortfolioItemEntity } from '../../domain/entities/portfolio-item.entity';

export function usePortfolioItem(slug?: string) {
  return useQuery<PortfolioItemEntity | null>({
    queryKey: ['portfolio', 'detail', slug],
    queryFn: async () => {
      if (!slug) return null;
      const response = await portfolioApi.getBySlug(slug);
      return PortfolioMapper.toEntity(response);
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
}
