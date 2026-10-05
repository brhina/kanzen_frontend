import { TrendingUp, Zap, Clock, ShieldCheck, Cpu, Database, BarChart2 } from 'lucide-react';
import type { ProjectMetric } from '../../domain/entities/portfolio-item.entity';

export interface ProjectMetricsProps {
  metrics: ProjectMetric[];
  className?: string;
  variant?: 'compact' | 'featured';
}

function getMetricIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case 'bolt':
    case 'zap':
      return <Zap className="h-4 w-4 text-amber-500" />;
    case 'speed':
    case 'trending':
    case 'chart':
      return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    case 'clock':
    case 'time':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'shield':
    case 'security':
      return <ShieldCheck className="h-4 w-4 text-indigo-500" />;
    case 'cpu':
    case 'compute':
      return <Cpu className="h-4 w-4 text-purple-500" />;
    case 'database':
    case 'storage':
      return <Database className="h-4 w-4 text-cyan-500" />;
    default:
      return <BarChart2 className="h-4 w-4 text-primary-500" />;
  }
}

export function ProjectMetrics({
  metrics,
  className = '',
  variant = 'compact',
}: ProjectMetricsProps) {
  if (!metrics || metrics.length === 0) return null;

  if (variant === 'compact') {
    return (
      <div className={`grid grid-cols-2 gap-2 sm:grid-cols-3 ${className}`}>
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-2.5 border border-slate-100 dark:border-slate-800 flex flex-col"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              {getMetricIcon(metric.icon)}
              <span className="truncate">{metric.label}</span>
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/80 p-5 border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {metric.label}
            </span>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
              {getMetricIcon(metric.icon)}
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {metric.value}
          </div>
        </div>
      ))}
    </div>
  );
}
