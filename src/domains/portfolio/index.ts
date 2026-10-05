// Domain enums & entities
export {
  PortfolioCategory,
  PORTFOLIO_CATEGORY_LABELS,
} from './domain/enums/portfolio-category.enum';
export {
  PortfolioItemStatus,
  PORTFOLIO_STATUS_LABELS,
} from './domain/enums/portfolio-status.enum';
export type {
  PortfolioItemEntity,
  ProjectMetric,
  SeoMeta,
} from './domain/entities/portfolio-item.entity';

// Infrastructure
export { portfolioApi } from './infrastructure/portfolio.api';
export { PortfolioMapper } from './infrastructure/portfolio.mapper';
export type {
  CreatePortfolioDto,
  UpdatePortfolioDto,
  PortfolioFilterQuery,
  PortfolioItemResponseDto,
} from './infrastructure/portfolio.dto';

// Application hooks
export { usePortfolioItems } from './application/use-cases/usePortfolioItems';
export { usePortfolioItem } from './application/use-cases/usePortfolioItem';
export { useFeaturedPortfolio } from './application/use-cases/useFeaturedPortfolio';
export { useCreatePortfolioItem } from './application/use-cases/useCreatePortfolioItem';
export { useUpdatePortfolioItem } from './application/use-cases/useUpdatePortfolioItem';
export { useDeletePortfolioItem } from './application/use-cases/useDeletePortfolioItem';

// Presentation components & pages
export { PortfolioCard } from './presentation/components/PortfolioCard';
export { PortfolioGrid } from './presentation/components/PortfolioGrid';
export { PortfolioCategoryFilter } from './presentation/components/PortfolioCategoryFilter';
export { ProjectMetrics } from './presentation/components/ProjectMetrics';
export { PortfolioGallery } from './presentation/components/PortfolioGallery';
export { PortfolioForm } from './presentation/components/PortfolioForm';
export { PortfolioPage } from './presentation/pages/PortfolioPage';
export { PortfolioItemPage } from './presentation/pages/PortfolioItemPage';
