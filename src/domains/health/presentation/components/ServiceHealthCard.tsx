import { HealthStatusBadge } from './HealthStatusBadge';
import { Card } from '@/shared/ui/card';
import { cn } from '@/shared/utils/cn';

export interface ServiceHealthCardProps {
  title: string;
  status: 'up' | 'down' | 'healthy' | 'degraded' | 'unhealthy';
  latencyMs?: number;
  description?: string;
  details?: Record<string, unknown>;
  className?: string;
}

export function ServiceHealthCard({
  title,
  status,
  latencyMs,
  description,
  details,
  className = '',
}: ServiceHealthCardProps) {
  const isHealthy = status === 'up' || status === 'healthy';

  return (
    <Card
      className={cn(
        'rounded-2xl border bg-white p-5 shadow-xs transition-all dark:bg-slate-900',
        isHealthy
          ? 'border-slate-200 dark:border-slate-800'
          : 'border-rose-300 dark:border-rose-900/60 ring-1 ring-rose-500/20',
        className,
      )}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          {title}
        </h3>
        <HealthStatusBadge status={status} />
      </div>

      <div className="mt-3 space-y-2 text-xs">
        {description && (
          <p className="text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}

        {latencyMs !== undefined && (
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-500 dark:text-slate-400">Response Latency:</span>
            <span
              className={cn(
                'font-bold',
                latencyMs < 20
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : latencyMs < 80
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400',
              )}
            >
              {latencyMs.toFixed(1)} ms
            </span>
          </div>
        )}

        {details && Object.keys(details).length > 0 && (
          <div className="mt-3 rounded-lg bg-slate-50 p-2.5 font-mono text-[11px] text-slate-600 dark:bg-slate-850 dark:text-slate-300 space-y-1">
            {Object.entries(details).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-slate-400 capitalize">{key}:</span>
                <span className="truncate max-w-[140px] font-semibold">{String(val)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
