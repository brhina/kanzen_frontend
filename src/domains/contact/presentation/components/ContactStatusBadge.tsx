import { Badge } from '@/shared/ui/badge';
import { ContactStatus } from '../../domain/enums/contact-status.enum';

interface ContactStatusBadgeProps {
  status: ContactStatus | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ContactStatusBadge({
  status,
  size = 'sm',
  className,
}: ContactStatusBadgeProps) {
  switch (status) {
    case ContactStatus.PENDING:
    case 'pending':
      return (
        <Badge variant="warning" size={size} className={className}>
          Pending
        </Badge>
      );
    case ContactStatus.READ:
    case 'read':
      return (
        <Badge variant="info" size={size} className={className}>
          Read
        </Badge>
      );
    case ContactStatus.REPLIED:
    case 'replied':
      return (
        <Badge variant="success" size={size} className={className}>
          Replied
        </Badge>
      );
    case ContactStatus.ARCHIVED:
    case 'archived':
      return (
        <Badge variant="neutral" size={size} className={className}>
          Archived
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
