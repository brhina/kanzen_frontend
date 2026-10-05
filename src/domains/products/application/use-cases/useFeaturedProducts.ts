import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../infrastructure/products.api';
import { productsMapper } from '../../infrastructure/products.mapper';
import type { ProductEntity } from '../../domain/entities/product.entity';

export function useFeaturedProducts() {
  return useQuery<ProductEntity[]>({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const dtos = await productsApi.listPublic({ isFeatured: true });
      return productsMapper.toEntityList(dtos);
    },
    staleTime: 1000 * 60 * 5,
  });
}
