import { NewsletterSignupForm } from './NewsletterSignupForm';
import { cn } from '@/shared/utils/cn';

interface NewsletterBannerProps {
  title?: string;
  subtitle?: string;
  source?: string;
  className?: string;
}

export function NewsletterBanner({
  title = 'Stay Ahead of Architectural Shifts',
  subtitle = 'Join 12,000+ engineering leaders receiving our weekly architectural breakdowns, production post-mortems, and scalable patterns.',
  source = 'newsletter_banner',
  className = '',
}: NewsletterBannerProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-100/60 p-8 sm:p-12 text-slate-900 dark:border-slate-800 dark:bg-radial dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 dark:text-white',
        className,
      )}
    >
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-brand-500/10 dark:bg-brand-600/15 blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-700 dark:text-brand-300">
          The Kanzen Architecture Dispatch
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          {subtitle}
        </p>

        <div className="pt-2 max-w-md">
          <NewsletterSignupForm source={source} compact />
        </div>
      </div>
    </div>
  );
}
