import { cn } from '@/shared/utils/cn';

export interface AnalyticsDateRangePickerProps {
  value: number; // e.g. 7, 30, 90
  onChange: (days: number) => void;
  className?: string;
}

const RANGES = [
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 30 Days', value: 30 },
  { label: 'Last 90 Days', value: 90 },
];

export function AnalyticsDateRangePicker({
  value,
  onChange,
  className = '',
}: AnalyticsDateRangePickerProps) {
  return (
    <div
      role="group"
      aria-label="Analytics date range filter"
      className={cn(
        'inline-flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800',
        className,
      )}
    >
      {RANGES.map((range) => {
        const isSelected = value === range.value;
        return (
          <button
            key={range.value}
            type="button"
            onClick={() => onChange(range.value)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer',
              isSelected
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
            )}
            aria-pressed={isSelected}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
