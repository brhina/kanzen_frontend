import { Badge } from '@/shared/ui/badge';

export interface NotificationBadgeProps {
  count?: number;
  className?: string;
}

export function NotificationBadge({ count, className = '' }: NotificationBadgeProps) {
  if (!count || count <= 0) return null;

  return (
    <Badge
      variant="brand"
      size="sm"
      className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold ${className}`}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
}
