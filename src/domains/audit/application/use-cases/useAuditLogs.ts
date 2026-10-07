import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { auditApi } from '../../infrastructure/audit.api';
import { AuditMapper } from '../../infrastructure/audit.mapper';
import type { FilterAuditDto } from '../../infrastructure/audit.dto';
import type { AuditLogEntity } from '../../domain/entities/audit-log.entity';

export interface UseAuditLogsResult {
  items: AuditLogEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useAuditLogs(filters: FilterAuditDto = {}) {
  return useQuery<UseAuditLogsResult>({
    queryKey: queryKeys.audit.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const response = await auditApi.list(filters);
      return {
        items: AuditMapper.toDomainList(response.data || []),
        total: response.meta?.pagination?.total ?? (response.data || []).length,
        page: response.meta?.pagination?.page ?? 1,
        limit: response.meta?.pagination?.limit ?? 20,
        totalPages: response.meta?.pagination?.totalPages ?? 1,
      };
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}
