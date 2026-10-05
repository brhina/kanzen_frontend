import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import type { FieldError } from 'react-hook-form';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id: explicitId,
      disabled,
      required,
      className,
      wrapperClassName,
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

        <div className="relative rounded-lg shadow-xs">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
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
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              errorMessage
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:focus:border-indigo-400',
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input';
