// Domain
export * from './domain/entities/solution.entity';
export * from './domain/enums/solution-status.enum';

// Infrastructure
export * from './infrastructure/solutions.dto';
export * from './infrastructure/solutions.api';
export * from './infrastructure/solutions.mapper';

// Application
export * from './application/use-cases/useSolutions';
export * from './application/use-cases/useSolution';
export * from './application/use-cases/useFeaturedSolutions';
export * from './application/use-cases/useCreateSolution';
export * from './application/use-cases/useUpdateSolution';
export * from './application/use-cases/useDeleteSolution';

// Presentation
export { SolutionsPage } from './presentation/pages/SolutionsPage';
export { SolutionDetailPage } from './presentation/pages/SolutionDetailPage';
export * from './presentation/components/SolutionCard';
export * from './presentation/components/SolutionForm';
