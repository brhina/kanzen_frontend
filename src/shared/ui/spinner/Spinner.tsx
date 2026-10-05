import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white' | 'current';
}

const sizeClasses = {
  xs: 'w-3 h-3 border-[1.5px]',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
  xl: 'w-12 h-12 border-4',
};

const variantClasses = {
  primary: 'border-indigo-600 border-t-transparent dark:border-indigo-400 dark:border-t-transparent',
  secondary: 'border-slate-500 border-t-transparent dark:border-slate-400 dark:border-t-transparent',
  white: 'border-white border-t-transparent',
  current: 'border-current border-t-transparent',
};

export function Spinner({
  size = 'md',
  variant = 'primary',
  className,
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
