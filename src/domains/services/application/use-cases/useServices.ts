import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '../../infrastructure/services.api';
import { servicesMapper } from '../../infrastructure/services.mapper';
import type { FilterServicesDto } from '../../infrastructure/services.dto';
import type { ServiceEntity } from '../../domain/entities/service.entity';

export interface UseServicesOptions extends FilterServicesDto {
  isAdminView?: boolean;
}

export interface UseServicesResult {
  services: ServiceEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useServices({
  isAdminView = false,
  ...filter
}: UseServicesOptions = {}) {
  return useQuery<UseServicesResult>({
    queryKey: ['services', isAdminView ? 'admin' : 'public', filter],
    queryFn: async () => {
      if (isAdminView) {
        const response = await servicesApi.listAdmin(filter);
        return servicesMapper.toPaginated(response);
      }
      const response = await servicesApi.listPublic(filter);
      return servicesMapper.toPaginated(response);
    },
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}
