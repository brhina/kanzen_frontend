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
  const statusLabels: Record<ApplicationStatus, string> = {
    applied: 'Applied',
    screening: 'Screening',
    interview: 'Interview',
    offer: 'Offer',
    hired: 'Hired',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
  };

  const label = statusLabels[status] ?? status;

  return (
    <Badge variant="brand" size="sm" className={className}>
      {label}
    </Badge>
  );
};
