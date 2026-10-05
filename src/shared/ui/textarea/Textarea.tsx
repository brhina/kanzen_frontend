import {
  forwardRef,
  useId,
  type TextareaHTMLAttributes,
} from 'react';
import type { FieldError } from 'react-hook-form';
import { cn } from '../../utils/cn';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: FieldError | string;
  helperText?: string;
  wrapperClassName?: string;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      id: explicitId,
      disabled,
      required,
      className,
      wrapperClassName,
      rows = 4,
      maxLength,
      value,
      showCount = false,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = explicitId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const errorMessage = typeof error === 'string' ? error : error?.message;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={cn('w-full space-y-1.5', wrapperClassName)}>
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={id}
              className="block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              {label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </label>
          )}

          {showCount && maxLength && (
            <span className="text-xs text-slate-400">
              {currentLength} / {maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={id}
          rows={rows}
          maxLength={maxLength}
          value={value}
          disabled={disabled}
          required={required}
          aria-invalid={!!errorMessage}
          aria-describedby={
            errorMessage ? errorId : helperText ? helperId : undefined
          }
          className={cn(
            'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-0 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500',
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:disabled:bg-slate-950 dark:disabled:text-slate-600',
            errorMessage
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:focus:border-indigo-400',
            className,
          )}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
