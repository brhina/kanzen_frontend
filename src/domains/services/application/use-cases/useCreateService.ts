import { useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '../../infrastructure/services.api';
import { servicesMapper } from '../../infrastructure/services.mapper';
import type { CreateServiceDto } from '../../infrastructure/services.dto';
import type { ServiceEntity } from '../../domain/entities/service.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation<ServiceEntity, Error, CreateServiceDto>({
    mutationFn: async (dto) => {
      const response = await servicesApi.create(dto);
      return servicesMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success(`Service "${data.name}" created successfully!`, 'Service Created');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create service', 'Error');
    },
  });
}
