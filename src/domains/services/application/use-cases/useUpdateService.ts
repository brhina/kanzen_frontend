import { useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '../../infrastructure/services.api';
import { servicesMapper } from '../../infrastructure/services.mapper';
import type { UpdateServiceDto } from '../../infrastructure/services.dto';
import type { ServiceEntity } from '../../domain/entities/service.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export interface UpdateServiceParams {
  id: string;
  dto: UpdateServiceDto;
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation<ServiceEntity, Error, UpdateServiceParams>({
    mutationFn: async ({ id, dto }) => {
      const response = await servicesApi.update(id, dto);
      return servicesMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['service'] });
      toast.success(`Service "${data.name}" updated successfully!`, 'Service Saved');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update service', 'Error');
    },
  });
}
