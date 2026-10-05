import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '../../infrastructure/services.api';
import { servicesMapper } from '../../infrastructure/services.mapper';
import type { ServiceEntity } from '../../domain/entities/service.entity';

export function useFeaturedServices() {
  return useQuery<ServiceEntity[]>({
    queryKey: ['services', 'featured'],
    queryFn: async () => {
      const dtos = await servicesApi.listPublic({ isFeatured: true });
      return servicesMapper.toEntityList(dtos);
    },
    staleTime: 1000 * 60 * 5,
  });
}
