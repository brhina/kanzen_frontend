import { Link } from 'react-router';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { HeaderBanner } from '@/layouts/components';
import { useAboutPageContent } from '@/domains/settings/application/use-cases/usePageContent';
import { DynamicIcon } from '@/shared/ui/icon/DynamicIcon';

export function AboutPage() {
  const { content, isLoading } = useAboutPageContent();
  const { banner, story, mission, vision, stats, values, cta } = content;

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Banner */}
      <HeaderBanner
        isLoading={isLoading}
        badge={banner.badge}
        title={banner.title}
        description={banner.description}
      />

      {!isLoading && (
        <>
          {/* Company Story */}
          {(story.badge || story.title) && (
            <section className="text-center max-w-3xl mx-auto space-y-4">
              {story.badge && <Badge variant="brand" size="md">{story.badge}</Badge>}
              {story.title && (
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  {story.title}
                </h2>
              )}
              {story.description && (
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {story.description}
                </p>
              )}
            </section>
          )}

          {/* Mission & Vision */}
          {(mission.title || vision.title) && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mission.title && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-3 dark:border-slate-800 dark:bg-slate-900/90">
                  <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <DynamicIcon name="Target" className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {mission.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {mission.text}
                  </p>
                </div>
              )}
              {vision.title && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-3 dark:border-slate-800 dark:bg-slate-900/90">
                  <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <DynamicIcon name="Sparkles" className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {vision.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {vision.text}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Key Stats */}
          {stats.length > 0 && (
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-center space-y-2 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
                >
                  <div className="mx-auto h-9 w-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <DynamicIcon name={stat.icon || 'Activity'} className="h-4.5 w-4.5" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Values Grid */}
          {values.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((val, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
                >
                  <div className="space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                      <DynamicIcon name={val.icon || 'Award'} className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {val.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* CTA */}
          {cta.title && (
            <section className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-100/60 p-8 sm:p-12 text-slate-900 text-center space-y-6 dark:border-slate-800 dark:bg-radial dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 dark:text-white">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {cta.title}
              </h2>
              {cta.description && (
                <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                  {cta.description}
                </p>
              )}
              <Link to={cta.buttonHref || '/contact'}>
                <Button variant="primary" size="lg">
                  <span>{cta.buttonLabel}</span>
                </Button>
              </Link>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default AboutPage;
export { AboutPage as Component };
