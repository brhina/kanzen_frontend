import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../../infrastructure/products.api';
import { productsMapper } from '../../infrastructure/products.mapper';
import type { CreateProductDto } from '../../infrastructure/products.dto';
import type { ProductEntity } from '../../domain/entities/product.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation<ProductEntity, Error, CreateProductDto>({
    mutationFn: async (dto) => {
      const response = await productsApi.create(dto);
      return productsMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Product "${data.name}" created successfully!`, 'Product Created');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create product', 'Error');
    },
  });
}
