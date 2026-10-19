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
  brand: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/50 dark:text-brand-300 dark:border-brand-800',
  neutral: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/50 dark:text-brand-300 dark:border-brand-800',
  success: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/50 dark:text-brand-300 dark:border-brand-800',
  warning: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/50 dark:text-brand-300 dark:border-brand-800',
  danger: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/50 dark:text-brand-300 dark:border-brand-800',
  info: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/50 dark:text-brand-300 dark:border-brand-800',
};

const solidVariants: Record<BadgeVariant, string> = {
  brand: 'bg-brand-500 text-white border-transparent',
  neutral: 'bg-brand-500 text-white border-transparent',
  success: 'bg-brand-500 text-white border-transparent',
  warning: 'bg-brand-500 text-white border-transparent',
  danger: 'bg-brand-500 text-white border-transparent',
  info: 'bg-brand-500 text-white border-transparent',
};

const outlineVariants: Record<BadgeVariant, string> = {
  brand: 'bg-transparent text-brand-600 border-brand-500 dark:text-brand-400 dark:border-brand-500',
  neutral: 'bg-transparent text-brand-600 border-brand-500 dark:text-brand-400 dark:border-brand-500',
  success: 'bg-transparent text-brand-600 border-brand-500 dark:text-brand-400 dark:border-brand-500',
  warning: 'bg-transparent text-brand-600 border-brand-500 dark:text-brand-400 dark:border-brand-500',
  danger: 'bg-transparent text-brand-600 border-brand-500 dark:text-brand-400 dark:border-brand-500',
  info: 'bg-transparent text-brand-600 border-brand-500 dark:text-brand-400 dark:border-brand-500',
};

const dotColors: Record<BadgeVariant, string> = {
  brand: 'bg-brand-500',
  neutral: 'bg-brand-500',
  success: 'bg-brand-500',
  warning: 'bg-brand-500',
  danger: 'bg-brand-500',
  info: 'bg-brand-500',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[11px] gap-1',
  md: 'px-2.5 py-0.5 text-xs gap-1.5',
  lg: 'px-3 py-1 text-sm gap-2',
};

export function Badge({
  variant = 'brand',
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
      {children && <span>{children}</span>}
    </span>
  );
}
