import { useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '../../infrastructure/services.api';
import { toast } from '@/shared/ui/toast/toast.store';

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation<{ success?: boolean }, Error, string>({
    mutationFn: async (id: string) => {
      return servicesApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service deleted successfully', 'Service Removed');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete service', 'Error');
    },
  });
}
