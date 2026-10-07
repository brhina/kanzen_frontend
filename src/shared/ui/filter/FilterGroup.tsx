import React from 'react';
import { cn } from '../../utils/cn';

export interface FilterGroupProps {
  label: string;
  icon?: React.ReactNode;
  count?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  label,
  icon,
  count,
  action,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          <span>{label}</span>
          {count !== undefined && count > 0 && (
            <span className="ml-1 inline-flex items-center justify-center min-w-4.5 h-4.5 px-1.5 text-[10px] font-bold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              {count}
            </span>
          )}
        </label>
        {action}
      </div>
      <div>{children}</div>
    </div>
  );
};
