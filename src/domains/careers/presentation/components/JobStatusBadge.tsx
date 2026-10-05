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
  const statusConfig: Record<
    JobPostingStatus,
    { label: string; variant: 'success' | 'warning' | 'danger' | 'neutral' }
  > = {
    open: { label: 'Open', variant: 'success' },
    draft: { label: 'Draft', variant: 'neutral' },
    paused: { label: 'Paused', variant: 'warning' },
    closed: { label: 'Closed', variant: 'danger' },
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
