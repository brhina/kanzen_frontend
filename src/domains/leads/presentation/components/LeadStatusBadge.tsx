import { Badge } from '@/shared/ui/badge';
import { LeadStatus } from '../../domain/enums/lead-status.enum';

interface LeadStatusBadgeProps {
  status: LeadStatus | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LeadStatusBadge({ status, size = 'sm', className }: LeadStatusBadgeProps) {
  let label = status;
  switch (status) {
    case LeadStatus.NEW:
    case 'new':
      label = 'New';
      break;
    case LeadStatus.CONTACTED:
    case 'contacted':
      label = 'Contacted';
      break;
    case LeadStatus.QUALIFIED:
    case 'qualified':
      label = 'Qualified';
      break;
    case LeadStatus.CONVERTED:
    case 'converted':
      label = 'Converted';
      break;
    case LeadStatus.DISQUALIFIED:
    case 'disqualified':
      label = 'Disqualified';
      break;
    default:
      label = status;
      break;
  }

  return (
    <Badge variant="brand" size={size} className={className}>
      {label}
    </Badge>
  );
}
