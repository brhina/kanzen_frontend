import { useMemo } from 'react';
import { Link } from 'react-router';
import { Edit3, Trash2, ArrowUpRight } from 'lucide-react';
import type { ServiceEntity } from '../../domain/entities/service.entity';
import { ServiceCategoryBadge } from './ServiceCategoryBadge';
import { ServicePricingBadge } from './ServicePricingBadge';
import { Table, type ColumnDef } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { PermissionGate } from '@/core/auth/guards/PermissionGate';

export interface ServiceTableProps {
  services: ServiceEntity[];
  onEdit: (service: ServiceEntity) => void;
  onDelete: (service: ServiceEntity) => void;
  isLoading?: boolean;
}

export function ServiceTable({
  services,
  onEdit,
  onDelete,
  isLoading = false,
}: ServiceTableProps) {
  const columns = useMemo<ColumnDef<ServiceEntity, any>[]>(
    () => [
      {
        id: 'service',
        header: 'Service',
        cell: ({ row }: { row: { original: ServiceEntity } }) => {
          const service = row.original;
          return (
            <div className="max-w-xs">
              <Link
                to={`/services/${service.slug}`}
                className="font-semibold text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400 inline-flex items-center gap-1 transition-colors"
              >
                <span>{service.name}</span>
                <ArrowUpRight className="h-3 w-3 text-slate-400" />
              </Link>
              <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {service.tagline}
              </div>
            </div>
          );
        },
      },
      {
        id: 'category',
        header: 'Category',
        cell: ({ row }: { row: { original: ServiceEntity } }) => (
          <ServiceCategoryBadge category={row.original.category} />
        ),
      },
      {
        id: 'pricing',
        header: 'Pricing',
        cell: ({ row }: { row: { original: ServiceEntity } }) => {
          const service = row.original;
          return (
            <ServicePricingBadge
              startingPrice={service.startingPrice}
              pricingModel={service.pricingModel}
            />
          );
        },
      },
      {
        id: 'timeline',
        header: 'Timeline',
        cell: ({ row }: { row: { original: ServiceEntity } }) => (
          <span className="text-xs text-slate-600 dark:text-slate-300">
            {row.original.estimatedTimeline || '—'}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }: { row: { original: ServiceEntity } }) => {
          const service = row.original;
          return (
            <Badge
              variant={service.status === 'active' ? 'success' : 'neutral'}
              size="sm"
              className="capitalize"
            >
              {service.status}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }: { row: { original: ServiceEntity } }) => {
          const service = row.original;
          return (
            <div className="flex items-center justify-end gap-1.5">
              <PermissionGate permission="services:write">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => onEdit(service)}
                  className="flex items-center gap-1"
                  title="Edit Service"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Edit</span>
                </Button>
              </PermissionGate>

              <PermissionGate permission="services:delete">
                <Button
                  type="button"
                  variant="danger"
                  size="xs"
                  onClick={() => onDelete(service)}
                  title="Delete Service"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </PermissionGate>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete],
  );

  return (
    <Table<ServiceEntity>
      data={services}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No service offerings found matching current filters."
    />
  );
}

export default ServiceTable;
