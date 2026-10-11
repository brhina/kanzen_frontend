import { Link } from 'react-router';
import { Button } from '@/shared/ui/button';
import { HeaderBanner } from '@/layouts/components';
import {
  useCompanySettings,
  useCompanyValues,
} from '@/domains/settings/application/use-cases/usePublicSettings';
import { DynamicIcon } from '@/shared/ui/icon/DynamicIcon';

export function AboutPage() {
  const { company } = useCompanySettings();
  const values = useCompanyValues();

  const companyName = company?.name || 'Kanzen Tech';
  const tagline = company?.tagline || 'Engineering Digital Mastery';

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Banner */}
      <HeaderBanner
        badge="Our Principles & Mission"
        title="Engineering Perfection at Enterprise Scale"
        description={`"${companyName}" stands for completeness, perfection, and wholeness. ${tagline}. We approach digital systems engineering not as ad-hoc software development, but as enduring enterprise craft.`}
      />

      {/* Values Grid */}
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

      {/* CTA */}
      <section className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-100/60 p-8 sm:p-12 text-slate-900 text-center space-y-6 dark:border-slate-800 dark:bg-radial dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 dark:text-white">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Ready to elevate your engineering standard?</h2>
        <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Schedule an architectural deep dive with our principal engineering team.
        </p>
        <Link to="/contact">
          <Button variant="primary" size="lg">
            <span>Consult With Us</span>
          </Button>
        </Link>
      </section>
    </div>
  );
}

export default AboutPage;
export { AboutPage as Component };
