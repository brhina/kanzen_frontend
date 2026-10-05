import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../../infrastructure/products.api';
import { productsMapper } from '../../infrastructure/products.mapper';
import type { UpdateProductDto } from '../../infrastructure/products.dto';
import type { ProductEntity } from '../../domain/entities/product.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export interface UpdateProductParams {
  id: string;
  dto: UpdateProductDto;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation<ProductEntity, Error, UpdateProductParams>({
    mutationFn: async ({ id, dto }) => {
      const response = await productsApi.update(id, dto);
      return productsMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      toast.success(`Product "${data.name}" updated successfully!`, 'Product Saved');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update product', 'Error');
    },
  });
}
