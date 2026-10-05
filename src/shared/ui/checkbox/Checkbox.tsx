import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import type { FieldError } from 'react-hook-form';
import { cn } from '../../utils/cn';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  description?: ReactNode;
  error?: FieldError | string;
  indeterminate?: boolean;
  wrapperClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      indeterminate = false,
      id: explicitId,
      disabled,
      className,
      wrapperClassName,
      checked,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = explicitId || generatedId;
    const internalRef = useRef<HTMLInputElement | null>(null);

    const errorMessage = typeof error === 'string' ? error : error?.message;

    // Handle indeterminate state on HTMLInputElement
    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <div className={cn('relative flex items-start gap-3', wrapperClassName)}>
        <div className="flex h-5 items-center">
          <input
            ref={(element) => {
              internalRef.current = element;
              if (typeof ref === 'function') ref(element);
              else if (ref) ref.current = element;
            }}
            id={id}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            aria-invalid={!!errorMessage}
            className={cn(
              'h-4 w-4 rounded border-slate-300 text-indigo-600 transition-colors',
              'focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-slate-700 dark:bg-slate-900',
              'disabled:cursor-not-allowed disabled:opacity-50',
              errorMessage && 'border-red-500 text-red-600 focus:ring-red-500',
              className,
            )}
            {...props}
          />
        </div>

        {(label || description) && (
          <div className="text-sm">
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  'font-medium text-slate-700 dark:text-slate-200 select-none cursor-pointer',
                  disabled && 'cursor-not-allowed opacity-60',
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
            {errorMessage && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errorMessage}
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
