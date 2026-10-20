import { NewsletterSignupForm } from './NewsletterSignupForm';
import { cn } from '@/shared/utils/cn';
import { useNewsletterContent } from '@/domains/settings/application/use-cases/usePageContent';

interface NewsletterBannerProps {
  title?: string;
  subtitle?: string;
  source?: string;
  className?: string;
}

export function NewsletterBanner({
  title,
  subtitle,
  source = 'newsletter_banner',
  className = '',
}: NewsletterBannerProps) {
  const { content, isLoading } = useNewsletterContent();

  const resolvedTitle = title ?? content.title;
  const resolvedSubtitle = subtitle ?? content.description;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-100/60 p-8 sm:p-12 text-slate-900 dark:border-slate-800 dark:bg-radial dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 dark:text-white',
        className,
      )}
    >
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-brand-500/10 dark:bg-brand-600/15 blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-3xl space-y-4">
        {content.badge && (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-700 dark:text-brand-300">
            {content.badge}
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {isLoading && !title ? (
            <span className="block h-8 w-64 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800" />
          ) : (
            resolvedTitle
          )}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          {isLoading && !subtitle ? (
            <span className="block h-5 w-full max-w-lg animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800" />
          ) : (
            resolvedSubtitle
          )}
        </p>

        <div className="pt-2 max-w-md">
          <NewsletterSignupForm source={source} compact />
        </div>
      </div>
    </div>
  );
}
