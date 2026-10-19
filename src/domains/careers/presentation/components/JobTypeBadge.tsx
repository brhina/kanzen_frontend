import React from 'react';
import { Badge } from '@/shared/ui/badge';
import type {
  ExperienceLevel,
  JobType,
  WorkMode,
} from '../../domain/enums/job-posting.enums';

interface JobTypeBadgeProps {
  type?: JobType;
  mode?: WorkMode;
  level?: ExperienceLevel;
  className?: string;
}

export const JobTypeBadge: React.FC<JobTypeBadgeProps> = ({
  type,
  mode,
  level,
  className,
}) => {
  if (type) {
    const typeLabels: Record<JobType, string> = {
      'full-time': 'Full-Time',
      'part-time': 'Part-Time',
      contract: 'Contract',
      internship: 'Internship',
    };

    return (
      <Badge variant="brand" size="sm" className={className}>
        {typeLabels[type] ?? type}
      </Badge>
    );
  }

  if (mode) {
    const modeConfig: Record<WorkMode, string> = {
      remote: 'Remote',
      hybrid: 'Hybrid',
      'on-site': 'On-Site',
    };

    const label = modeConfig[mode] ?? mode;

    return (
      <Badge variant="brand" size="sm" className={className}>
        {label}
      </Badge>
    );
  }

  if (level) {
    const levelLabels: Record<ExperienceLevel, string> = {
      junior: 'Junior',
      mid: 'Mid-Level',
      senior: 'Senior',
      lead: 'Lead / Principal',
    };

    return (
      <Badge variant="brand" size="sm" className={className}>
        {levelLabels[level] ?? level}
      </Badge>
    );
  }

  return null;
};
