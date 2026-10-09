import {
  forwardRef,
  useId,
  type SelectHTMLAttributes,
} from 'react';
import type { FieldError } from 'react-hook-form';
import type { Option } from '../../types/common.types';
import { cn } from '../../utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: FieldError | string;
  helperText?: string;
  options?: Option[];
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      id: explicitId,
      disabled,
      required,
      className,
      wrapperClassName,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = explicitId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const errorMessage = typeof error === 'string' ? error : error?.message;

    return (
      <div className={cn('w-full space-y-1.5', wrapperClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative rounded-lg">
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            required={required}
            aria-invalid={!!errorMessage}
            aria-describedby={
              errorMessage ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              'block w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-slate-900 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-offset-0 dark:bg-slate-900 dark:text-slate-100',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:disabled:bg-slate-950 dark:disabled:text-slate-600',
              errorMessage
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500'
                : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500/20 dark:border-slate-700 dark:focus:border-brand-400',
              className,
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={String(opt.value)}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {errorMessage ? (
          <p id={errorId} className="text-xs text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = 'Select';
