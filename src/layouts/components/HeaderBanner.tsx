import type { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export interface HeaderBannerProps {
  badge?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
  badgeClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function HeaderBanner({
  badge,
  title,
  description,
  children,
  className = '',
  badgeClassName = '',
  titleClassName = '',
  descriptionClassName = '',
}: HeaderBannerProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-50 via-white to-slate-50/80 px-6 py-12 text-slate-900 sm:px-12 sm:py-16 dark:border-slate-800/80 dark:bg-radial dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 dark:text-white transition-colors',
        className,
      )}
    >
      {/* Ambient background glow orbs */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-500/10 dark:bg-brand-500/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-500/5 dark:bg-cyan-500/10 blur-3xl"
      /> */}

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
        {badge && (
          <div>
            <div
              className={cn(
                'inline-flex items-center rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/20 dark:ring-brand-500/30',
                badgeClassName,
              )}
            >
              {badge}
            </div>
          </div>
        )}

        <h1
          className={cn(
            'text-3xl font-black tracking-tight sm:text-5xl text-slate-900 dark:text-white',
            titleClassName,
          )}
        >
          {title}
        </h1>

        {description && (
          <p
            className={cn(
              'text-sm text-slate-600 dark:text-slate-300 sm:text-base leading-relaxed max-w-2xl mx-auto',
              descriptionClassName,
            )}
          >
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}

export default HeaderBanner;
