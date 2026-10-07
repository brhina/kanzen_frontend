import React from 'react';
import { cn } from '../../utils/cn';

export interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isSelected?: boolean;
  isActive?: boolean;
  count?: number;
  icon?: React.ReactNode;
}

export const FilterPill: React.FC<FilterPillProps> = ({
  label,
  isSelected,
  isActive,
  count,
  icon,
  className,
  ...props
}) => {
  const selected = Boolean(isSelected ?? isActive);
  return (
    <button
      type="button"
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer select-none',
        selected
          ? 'bg-brand-600 text-white shadow-xs dark:bg-brand-500'
          : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700/80 dark:hover:text-white',
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            'inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold ml-0.5',
            isSelected
              ? 'bg-white/20 text-white'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export interface FilterPillsGroupProps {
  options: Array<{
    id: string;
    label: string;
    count?: number;
    icon?: React.ReactNode;
  }>;
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
  scrollable?: boolean;
}

export const FilterPillsGroup: React.FC<FilterPillsGroupProps> = ({
  options,
  selectedId,
  onSelect,
  className,
  scrollable = true,
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5',
        scrollable && 'overflow-x-auto pb-1.5 scrollbar-none max-w-full',
        className,
      )}
    >
      {options.map((opt) => (
        <FilterPill
          key={opt.id}
          label={opt.label}
          isSelected={selectedId === opt.id}
          count={opt.count}
          icon={opt.icon}
          onClick={() => onSelect(opt.id)}
        />
      ))}
    </div>
  );
};
