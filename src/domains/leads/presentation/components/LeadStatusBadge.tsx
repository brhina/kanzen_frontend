import { Badge } from '@/shared/ui/badge';
import { LeadStatus } from '../../domain/enums/lead-status.enum';

interface LeadStatusBadgeProps {
  status: LeadStatus | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LeadStatusBadge({ status, size = 'sm', className }: LeadStatusBadgeProps) {
  switch (status) {
    case LeadStatus.NEW:
    case 'new':
      return (
        <Badge variant="info" size={size} className={className}>
          New
        </Badge>
      );
    case LeadStatus.CONTACTED:
    case 'contacted':
      return (
        <Badge variant="warning" size={size} className={className}>
          Contacted
        </Badge>
      );
    case LeadStatus.QUALIFIED:
    case 'qualified':
      return (
        <Badge variant="brand" size={size} className={className}>
          Qualified
        </Badge>
      );
    case LeadStatus.CONVERTED:
    case 'converted':
      return (
        <Badge variant="success" size={size} className={className}>
          Converted
        </Badge>
      );
    case LeadStatus.DISQUALIFIED:
    case 'disqualified':
      return (
        <Badge variant="neutral" size={size} className={className}>
          Disqualified
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" size={size} className={className}>
          {status}
        </Badge>
      );
  }
}
