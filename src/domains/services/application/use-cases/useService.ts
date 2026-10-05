import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '../../infrastructure/services.api';
import { servicesMapper } from '../../infrastructure/services.mapper';
import type { ServiceEntity } from '../../domain/entities/service.entity';

export function useService(slugOrId?: string, isId = false) {
  return useQuery<ServiceEntity>({
    queryKey: ['service', isId ? 'id' : 'slug', slugOrId],
    queryFn: async () => {
      if (!slugOrId) throw new Error('Missing service identifier');
      const dto = isId
        ? await servicesApi.getAdminById(slugOrId)
        : await servicesApi.getBySlug(slugOrId);
      return servicesMapper.toEntity(dto);
    },
    enabled: Boolean(slugOrId),
    staleTime: 1000 * 60 * 3,
  });
}
