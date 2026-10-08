import { Link } from 'react-router';
import { Target, Users, Shield, Award } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useCompanySettings } from '@/domains/settings/application/use-cases/usePublicSettings';

export function AboutPage() {
  const { company } = useCompanySettings();

  const companyName = company?.name || 'Kanzen Tech';
  const tagline = company?.tagline || 'Engineering Digital Mastery';

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16 border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
            <span>Our Principles &amp; Mission</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
            Engineering Perfection at Enterprise Scale
          </h1>

          <p className="text-sm text-slate-300 sm:text-base leading-relaxed">
            "{companyName}" stands for completeness, perfection, and wholeness. {tagline}. We approach digital systems engineering not as ad-hoc software development, but as enduring enterprise craft.
          </p>
        </div>
      </div>

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
      <section className="rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 p-8 sm:p-12 text-white text-center space-y-6 border border-slate-800 shadow-2xl">
        <h2 className="text-3xl font-bold tracking-tight">Ready to elevate your engineering standard?</h2>
        <p className="max-w-xl mx-auto text-slate-300 text-sm sm:text-base">
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
