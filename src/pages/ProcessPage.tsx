import { Link } from 'react-router';
import { Search, Compass, Code2, Rocket, ArrowRight } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="brand" size="md">Our Methodology</Badge>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          The Kanzen Delivery Framework
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          A predictable, milestone-driven engineering cycle designed to eliminate architectural debt and deliver high-velocity stability.
        </p>
      </section>

      {/* Steps List */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {STEPS.map((s) => {
          const IconComp = s.icon;
          return (
            <div
              key={s.step}
              className="flex gap-4 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono font-bold text-lg">
                {s.step}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <IconComp className="h-5 w-5 text-slate-500" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{s.title}</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom CTA */}
      <div className="text-center pt-8">
        <Link to="/contact">
          <Button variant="primary" size="lg">
            <span>Initiate Your Discovery Phase</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ProcessPage;
export { ProcessPage as Component };
