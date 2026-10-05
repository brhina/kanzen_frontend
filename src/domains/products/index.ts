// Domain
export * from './domain/entities/product.entity';
export * from './domain/enums/product-category.enum';
export * from './domain/enums/product-status.enum';

// Infrastructure
export * from './infrastructure/products.dto';
export * from './infrastructure/products.api';
export * from './infrastructure/products.mapper';

// Application
export * from './application/use-cases/useProducts';
export * from './application/use-cases/useProduct';
export * from './application/use-cases/useFeaturedProducts';
export * from './application/use-cases/useCreateProduct';
export * from './application/use-cases/useUpdateProduct';
export * from './application/use-cases/useDeleteProduct';

// Presentation
export { ProductsPage } from './presentation/pages/ProductsPage';
export { ProductDetailPage } from './presentation/pages/ProductDetailPage';
export * from './presentation/components/ProductCard';
export * from './presentation/components/ProductForm';
export * from './presentation/components/ProductStatusBadge';
export * from './presentation/components/ProductScreenshots';
