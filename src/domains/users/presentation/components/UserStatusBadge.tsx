import { Badge, type BadgeVariant } from '@/shared/ui/badge';
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
  let variant: BadgeVariant = 'neutral';
  let label = status;

  switch (status.toLowerCase()) {
    case UserStatus.ACTIVE:
      variant = 'success';
      label = 'Active';
      break;
    case UserStatus.INACTIVE:
      variant = 'neutral';
      label = 'Inactive';
      break;
    case UserStatus.SUSPENDED:
      variant = 'danger';
      label = 'Suspended';
      break;
    default:
      variant = 'neutral';
      label = status;
  }

  return (
    <Badge variant={variant} size={size} dot className={`capitalize ${className}`}>
      {label}
    </Badge>
  );
}

export default UserStatusBadge;
