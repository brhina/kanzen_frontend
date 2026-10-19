import { Badge } from '@/shared/ui/badge';
import { UserStatus } from '../../domain/enums/user-status.enum';

export interface UserStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserStatusBadge({
  status,
  size = 'sm',
  className = '',
}: UserStatusBadgeProps) {
  let label = status;

  switch (status.toLowerCase()) {
    case UserStatus.ACTIVE:
      label = 'Active';
      break;
    case UserStatus.INACTIVE:
      label = 'Inactive';
      break;
    case UserStatus.SUSPENDED:
      label = 'Suspended';
      break;
    default:
      label = status;
  }

  return (
    <Badge variant="brand" size={size} dot className={`capitalize ${className}`}>
      {label}
    </Badge>
  );
}

export default UserStatusBadge;
