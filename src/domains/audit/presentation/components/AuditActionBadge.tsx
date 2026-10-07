import { Badge } from '@/shared/ui/badge';

export interface AuditActionBadgeProps {
  action: string;
  className?: string;
}

export function AuditActionBadge({ action, className = '' }: AuditActionBadgeProps) {
  const norm = (action || '').toLowerCase();

  let variant: 'success' | 'danger' | 'warning' | 'info' | 'brand' | 'neutral' = 'neutral';

  if (norm.includes('create') || norm.includes('insert') || norm.includes('publish')) {
    variant = 'success';
  } else if (norm.includes('delete') || norm.includes('destroy') || norm.includes('reject')) {
    variant = 'danger';
  } else if (norm.includes('update') || norm.includes('patch') || norm.includes('edit')) {
    variant = 'info';
  } else if (norm.includes('login') || norm.includes('auth')) {
    variant = 'brand';
  } else if (norm.includes('logout') || norm.includes('cancel')) {
    variant = 'warning';
  }

  return (
    <Badge
      variant={variant}
      size="sm"
      className={`font-mono text-[10px] uppercase font-bold tracking-wider ${className}`}
    >
      {action}
    </Badge>
  );
}
