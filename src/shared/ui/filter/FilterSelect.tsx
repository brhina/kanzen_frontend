import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface FilterSelectOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValueChange?: (value: string) => void;
  options: FilterSelectOption[];
  icon?: React.ReactNode;
  placeholder?: string;
  wrapperClassName?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  onChange,
  onValueChange,
  options,
  icon,
  placeholder,
  className,
  wrapperClassName,
  disabled,
  ...props
}) => {
  const id = useId();

  return (
    <div className={cn('space-y-1.5 w-full', wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {icon}
          </div>
        )}

        <select
          id={id}
          value={value}
          onChange={(e) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
          }}
          disabled={disabled}
          className={cn(
            'w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 transition-colors duration-150',
            'focus:border-brand-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 dark:focus:border-brand-400',
            'disabled:cursor-not-allowed disabled:opacity-60',
            icon ? 'pl-9 pr-9' : 'pl-3.5 pr-9',
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
              {opt.count !== undefined ? ` (${opt.count})` : ''}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};
