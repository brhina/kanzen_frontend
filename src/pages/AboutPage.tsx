import { Link } from 'react-router';
import { Target, Users, Shield, Award } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { HeaderBanner } from '@/layouts/components';
import { useCompanySettings } from '@/domains/settings/application/use-cases/usePublicSettings';

export function AboutPage() {
  const { company } = useCompanySettings();

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
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              Architectural Rigor
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We favor deterministic, type-safe, and formally verified patterns over fragile abstractions.
            </p>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              Zero-Trust Security
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Every API, data store, and network boundary is audited with end-to-end RBAC and encryption.
            </p>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              Senior Engineers Only
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Our engagements are executed exclusively by principal architects and staff software engineers.
            </p>
          </div>
        </div>

        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              Measured Outcomes
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We tie engineering deliverables directly to measurable business KPIs, SLA benchmarks, and ROI.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-100/60 p-8 sm:p-12 text-slate-900 text-center space-y-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-radial dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 dark:text-white dark:shadow-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Ready to elevate your engineering standard?</h2>
        <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Schedule an architectural deep dive with our principal engineering team.
        </p>
        <Link to="/contact">
          <Button variant="primary" size="lg" className="shadow-lg shadow-brand-500/25">
            <span>Consult With Us</span>
          </Button>
        </Link>
      </section>
    </div>
  );
}

export default AboutPage;
export { AboutPage as Component };
