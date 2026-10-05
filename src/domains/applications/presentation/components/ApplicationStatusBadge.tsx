import React from 'react';
import { Badge } from '@/shared/ui/badge';
import type { ApplicationStatus } from '../../domain/enums/application-status.enum';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({
  status,
  className,
}) => {
  const statusConfig: Record<
    ApplicationStatus,
    {
      label: string;
      variant:
        | 'neutral'
        | 'info'
        | 'brand'
        | 'success'
        | 'danger'
        | 'warning';
    }
  > = {
    applied: { label: 'Applied', variant: 'neutral' },
    screening: { label: 'Screening', variant: 'info' },
    interview: { label: 'Interview', variant: 'brand' },
    offer: { label: 'Offer', variant: 'brand' },
    hired: { label: 'Hired', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'danger' },
    withdrawn: { label: 'Withdrawn', variant: 'warning' },
  };

  const config = statusConfig[status] ?? {
    label: status,
    variant: 'neutral' as const,
  };

  return (
    <Badge variant={config.variant} size="sm" className={className}>
      {config.label}
    </Badge>
  );
};
