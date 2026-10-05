import { ChevronRight, Home } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumb({
  items,
  showHome = true,
  className,
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs sm:text-sm text-slate-500 dark:text-slate-400', className)}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {showHome && (
          <li className="flex items-center">
            <a
              href="/"
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              aria-label="Home"
            >
              <Home className="h-3.5 w-3.5" />
            </a>
            <ChevronRight className="h-3 w-3 mx-1 text-slate-400 shrink-0" />
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    isLast
                      ? 'font-medium text-slate-900 dark:text-slate-100'
                      : 'text-slate-500 dark:text-slate-400',
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  {item.label}
                </a>
              )}

              {!isLast && (
                <ChevronRight className="h-3 w-3 mx-1 text-slate-400 shrink-0" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
