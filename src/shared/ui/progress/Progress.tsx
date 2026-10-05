import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type ProgressVariant = 'brand' | 'success' | 'warning' | 'danger';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
}

const variantClasses: Record<ProgressVariant, string> = {
  brand: 'bg-indigo-600 dark:bg-indigo-500',
  success: 'bg-emerald-600 dark:bg-emerald-500',
  warning: 'bg-amber-500 dark:bg-amber-400',
  danger: 'bg-red-600 dark:bg-red-500',
};

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function Progress({
  value,
  max = 100,
  variant = 'brand',
  size = 'md',
  showLabel = false,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full space-y-1', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          'w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800',
          sizeClasses[size],
        )}
      >
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out rounded-full',
            variantClasses[variant],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
