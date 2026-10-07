import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/utils/cn';

export interface OverviewMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  badge?: string;
  className?: string;
}

export function OverviewMetricCard({
  title,
  value,
  subtitle,
  change,
  trend = 'neutral',
  badge,
  className = '',
}: OverviewMetricCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {badge && (
          <Badge variant="neutral" styleVariant="outline" size="sm" className="text-[10px] font-mono">
            {badge}
          </Badge>
        )}
      </div>

      <div className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
        {value}
      </div>

      {(subtitle || change) && (
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs dark:border-slate-800/80">
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400 truncate">
              {subtitle}
            </span>
          )}
          {change && (
            <span
              className={cn(
                'font-semibold font-mono text-[11px]',
                trend === 'up'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : trend === 'down'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-500 dark:text-slate-400',
              )}
            >
              {change}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
