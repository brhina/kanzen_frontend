import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface FilterChip {
  id: string;
  label: string;
  value?: string;
  onRemove: () => void;
}

export interface ActiveFilterChipsProps {
  chips: FilterChip[];
  onClearAll?: () => void;
  className?: string;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  chips,
  onClearAll,
  className,
}) => {
  if (chips.length === 0) return null;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 pt-2.5 pb-1 text-xs animate-fadeIn',
        className,
      )}
      role="region"
      aria-label="Active filters"
    >
      <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px] uppercase tracking-wider mr-1 shrink-0">
        Active Filters:
      </span>

      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-500/10 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/20 dark:border-brand-500/30 transition-all hover:bg-brand-500/20"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="rounded-full p-0.5 hover:bg-brand-500/30 text-brand-600 dark:text-brand-300 transition-colors focus:outline-hidden"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {onClearAll && chips.length > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 underline underline-offset-2 ml-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Clear all</span>
        </button>
      )}
    </div>
  );
};
