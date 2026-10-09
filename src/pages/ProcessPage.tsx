import { Link } from 'react-router';
import { Search, Compass, Code2, Rocket } from 'lucide-react';
import { Button } from '@/shared/ui/button';

const STEPS = [
  {
    step: '01',
    title: 'Architectural Discovery',
    description: 'We audit domain constraints, concurrency bottlenecks, threat models, and latency requirements.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Domain Modeling & Blueprinting',
    description: 'We draft formal DDD models, bounded contexts, API contracts, and infrastructure topologies.',
    icon: Compass,
  },
  {
    step: '03',
    title: 'Precision Implementation',
    description: 'Iterative delivery in production-grade TypeScript/NestJS, clean architecture, and exhaustive test coverage.',
    icon: Code2,
  },
  {
    step: '04',
    title: 'Observability & Global Deployment',
    description: 'Zero-downtime rolling deploys, distributed tracing, telemetry alerts, and automated autoscaling.',
    icon: Rocket,
  },
];

export function ProcessPage() {
  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
            <span>Engineering Discipline</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
            The Kanzen Delivery Framework
          </h1>

          <p className="text-sm text-slate-300 sm:text-base leading-relaxed max-w-2xl mx-auto">
            A predictable, milestone-driven engineering cycle designed to eliminate architectural debt and deliver high-velocity stability.
          </p>
        </div>
      </div>

      {/* Steps List */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STEPS.map((s) => {
          const IconComp = s.icon;
          return (
            <div
              key={s.step}
              className="group relative flex gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono font-bold text-lg">
                {s.step}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <IconComp className="h-5 w-5 text-brand-500" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {s.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom CTA */}
      <section className="rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 p-8 sm:p-12 text-white text-center space-y-6 border border-slate-800 shadow-2xl">
        <h2 className="text-3xl font-bold tracking-tight">Ready to initiate your architecture cycle?</h2>
        <p className="max-w-xl mx-auto text-slate-300 text-sm sm:text-base">
          Our engineering leadership is ready to analyze your platform requirements and scope.
        </p>
        <Link to="/contact">
          <Button variant="primary" size="lg" className="shadow-lg shadow-brand-500/25">
            <span>Initiate Discovery Phase</span>
          </Button>
        </Link>
      </section>
    </div>
  );
}

export default ProcessPage;
export { ProcessPage as Component };
