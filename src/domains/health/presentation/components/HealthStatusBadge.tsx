import { HealthStatus } from '../../domain/enums/health-status.enum';
import { Badge } from '@/shared/ui/badge';

export interface HealthStatusBadgeProps {
  status?: string;
  className?: string;
}

export function HealthStatusBadge({ status, className = '' }: HealthStatusBadgeProps) {
  const norm = (status || '').toLowerCase();

  let label = 'CHECKING';

  if (norm === HealthStatus.HEALTHY || norm === 'up' || norm === 'healthy' || norm === 'ok') {
    label = 'OPERATIONAL';
  } else if (norm === HealthStatus.DEGRADED || norm === 'degraded') {
    label = 'DEGRADED';
  } else if (norm === HealthStatus.UNHEALTHY || norm === 'down' || norm === 'unhealthy') {
    label = 'OFFLINE';
  }

  return (
    <Badge
      variant="brand"
      size="sm"
      className={`font-mono text-[10px] font-bold tracking-wider ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current mr-1 animate-pulse" />
      {label}
    </Badge>
  );
}
