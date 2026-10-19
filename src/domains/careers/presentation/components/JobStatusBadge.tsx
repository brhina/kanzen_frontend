import React from 'react';
import { Badge } from '@/shared/ui/badge';
import type { JobPostingStatus } from '../../domain/enums/job-posting.enums';

interface JobStatusBadgeProps {
  status: JobPostingStatus;
  className?: string;
}

export const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({
  status,
  className,
}) => {
  const statusLabels: Record<JobPostingStatus, string> = {
    open: 'Open',
    draft: 'Draft',
    paused: 'Paused',
    closed: 'Closed',
  };

  const label = statusLabels[status] ?? status;

  return (
    <Badge variant="brand" size="sm" className={className}>
      {label}
    </Badge>
  );
};
