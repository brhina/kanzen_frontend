import type { CaseStudyMetric } from '../../domain/entities/case-study.entity';

export interface CaseStudyMetricsProps {
  metrics: CaseStudyMetric[];
  className?: string;
  variant?: 'compact' | 'cards';
}

export function CaseStudyMetrics({
  metrics,
  className = '',
  variant = 'cards',
}: CaseStudyMetricsProps) {
  if (!metrics || metrics.length === 0) return null;

  if (variant === 'compact') {
    return (
      <div className={`grid grid-cols-2 gap-2 sm:grid-cols-3 ${className}`}>
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-2.5 border border-slate-100 dark:border-slate-800"
          >
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
              {m.label}
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {m.value}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`}>
      {metrics.map((m, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-1">
            {m.label}
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {m.value}
          </div>
          {m.description && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {m.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
