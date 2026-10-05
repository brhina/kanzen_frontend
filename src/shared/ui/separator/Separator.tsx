import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: ReactNode;
}

export function Separator({
  orientation = 'horizontal',
  label,
  className,
  ...props
}: SeparatorProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('inline-block h-full min-h-[1em] w-[1px] bg-slate-200 dark:bg-slate-800 self-stretch', className)}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn('relative flex items-center py-2', className)}
        {...props}
      >
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
        <span className="shrink-0 px-3 text-xs uppercase font-medium text-slate-400 dark:text-slate-500">
          {label}
        </span>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('w-full border-t border-slate-200 dark:border-slate-800 my-2', className)}
      {...props}
    />
  );
}
