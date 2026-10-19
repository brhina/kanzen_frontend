import { Badge } from '@/shared/ui/badge';

export interface AuditActionBadgeProps {
  action: string;
  className?: string;
}

export function AuditActionBadge({ action, className = '' }: AuditActionBadgeProps) {
  return (
    <Badge
      variant="brand"
      size="sm"
      className={`font-mono text-[10px] uppercase font-bold tracking-wider ${className}`}
    >
      {action}
    </Badge>
  );
}
