import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant =
  | 'brand'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type BadgeStyle = 'subtle' | 'solid' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  styleVariant?: BadgeStyle;
  size?: BadgeSize;
  dot?: boolean;
  icon?: ReactNode;
}

const subtleVariants: Record<BadgeVariant, string> = {
  brand: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
  danger: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800',
  info: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800',
};

const solidVariants: Record<BadgeVariant, string> = {
  brand: 'bg-indigo-600 text-white border-transparent',
  neutral: 'bg-slate-600 text-white border-transparent',
  success: 'bg-emerald-600 text-white border-transparent',
  warning: 'bg-amber-600 text-white border-transparent',
  danger: 'bg-red-600 text-white border-transparent',
  info: 'bg-sky-600 text-white border-transparent',
};

const outlineVariants: Record<BadgeVariant, string> = {
  brand: 'bg-transparent text-indigo-600 border-indigo-300 dark:text-indigo-400 dark:border-indigo-700',
  neutral: 'bg-transparent text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700',
  success: 'bg-transparent text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-700',
  warning: 'bg-transparent text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700',
  danger: 'bg-transparent text-red-600 border-red-300 dark:text-red-400 dark:border-red-700',
  info: 'bg-transparent text-sky-600 border-sky-300 dark:text-sky-400 dark:border-sky-700',
};

const dotColors: Record<BadgeVariant, string> = {
  brand: 'bg-indigo-500',
  neutral: 'bg-slate-400',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[11px] gap-1',
  md: 'px-2.5 py-0.5 text-xs gap-1.5',
  lg: 'px-3 py-1 text-sm gap-2',
};

export function Badge({
  variant = 'neutral',
  styleVariant = 'subtle',
  size = 'md',
  dot = false,
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  const styleClass =
    styleVariant === 'solid'
      ? solidVariants[variant]
      : styleVariant === 'outline'
        ? outlineVariants[variant]
        : subtleVariants[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        sizeClasses[size],
        styleClass,
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </span>
  );
}
