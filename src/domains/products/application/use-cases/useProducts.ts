import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../infrastructure/products.api';
import { productsMapper } from '../../infrastructure/products.mapper';
import type { FilterProductsDto } from '../../infrastructure/products.dto';
import type { ProductEntity } from '../../domain/entities/product.entity';

export interface UseProductsOptions extends FilterProductsDto {
  isAdminView?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
  refetchOnMount?: boolean | 'always';
  enabled?: boolean;
}

export interface UseProductsResult {
  products: ProductEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useProducts({
  isAdminView = false,
  staleTime,
  refetchOnWindowFocus,
  refetchInterval,
  refetchOnMount,
  enabled = true,
  ...filter
}: UseProductsOptions = {}) {
  return useQuery<UseProductsResult>({
    queryKey: ['products', isAdminView ? 'admin' : 'public', filter],
    queryFn: async () => {
      if (isAdminView) {
        const response = await productsApi.listAdmin(filter);
        return productsMapper.toPaginated(response);
      }
      const response = await productsApi.listPublic(filter);
      return productsMapper.toPaginated(response);
    },
    enabled,
    staleTime: staleTime ?? 1000 * 60 * 3,
    ...(refetchOnWindowFocus !== undefined ? { refetchOnWindowFocus } : {}),
    ...(refetchInterval !== undefined ? { refetchInterval } : {}),
    ...(refetchOnMount !== undefined ? { refetchOnMount } : {}),
  });
}
