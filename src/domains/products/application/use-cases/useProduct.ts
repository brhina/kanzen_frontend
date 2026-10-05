import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../infrastructure/products.api';
import { productsMapper } from '../../infrastructure/products.mapper';
import type { ProductEntity } from '../../domain/entities/product.entity';

export function useProduct(slugOrId?: string, isId = false) {
  return useQuery<ProductEntity>({
    queryKey: ['product', isId ? 'id' : 'slug', slugOrId],
    queryFn: async () => {
      if (!slugOrId) throw new Error('Missing product identifier');
      const dto = isId
        ? await productsApi.getAdminById(slugOrId)
        : await productsApi.getBySlug(slugOrId);
      return productsMapper.toEntity(dto);
    },
    enabled: Boolean(slugOrId),
    staleTime: 1000 * 60 * 3,
  });
}
