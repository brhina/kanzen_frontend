import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import type { ToastItem, ToastType } from './toast.store';

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const typeConfig: Record<
  ToastType,
  {
    icon: ReactNode;
    containerClass: string;
    iconClass: string;
  }
> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    containerClass:
      'border-emerald-200 bg-white dark:border-emerald-900/60 dark:bg-slate-900 text-slate-800 dark:text-slate-100',
    iconClass: 'text-emerald-500',
  },
  error: {
    icon: <AlertCircle className="h-5 w-5" />,
    containerClass:
      'border-red-200 bg-white dark:border-red-900/60 dark:bg-slate-900 text-slate-800 dark:text-slate-100',
    iconClass: 'text-red-500',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    containerClass:
      'border-amber-200 bg-white dark:border-amber-900/60 dark:bg-slate-900 text-slate-800 dark:text-slate-100',
    iconClass: 'text-amber-500',
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    containerClass:
      'border-sky-200 bg-white dark:border-sky-900/60 dark:bg-slate-900 text-slate-800 dark:text-slate-100',
    iconClass: 'text-sky-500',
  },
};

export function Toast({ toast: item, onDismiss }: ToastProps) {
  const config = typeConfig[item.type];

  return (
    <div
      role="alert"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-200',
        config.containerClass,
      )}
    >
      <div className={cn('shrink-0 pt-0.5', config.iconClass)}>{config.icon}</div>

      <div className="flex-1 text-sm">
        {item.title && (
          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
            {item.title}
          </h4>
        )}
        <p className="mt-0.5 text-slate-600 dark:text-slate-300">
          {item.message}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="shrink-0 rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
