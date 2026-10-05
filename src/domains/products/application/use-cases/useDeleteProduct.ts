import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../../infrastructure/products.api';
import { toast } from '@/shared/ui/toast/toast.store';

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation<{ success?: boolean }, Error, string>({
    mutationFn: async (id: string) => {
      return productsApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully', 'Product Removed');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete product', 'Error');
    },
  });
}
