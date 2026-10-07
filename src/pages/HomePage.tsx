import { Link } from 'react-router';
import {
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  Edit3,
} from 'lucide-react';
import { useUIStore } from '@/core/stores/ui.store';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';

export function HomePage() {
  const { isEditMode } = useUIStore();

  return (
    <div className="flex flex-col w-full">
      {/* Inline Edit Mode Notice if enabled */}
      {isEditMode && (
        <aside
          aria-label="Inline authoring active"
          className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center text-xs font-medium text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2"
        >
          <Edit3 className="h-3.5 w-3.5 text-amber-500" />
          <span>
            Inline Editing Mode Active: Administrative controls and inline content editors are unlocked.
          </span>
        </aside>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-50/80 px-4 py-1.5 text-xs font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              <span>Next-Generation Digital Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
              High-Impact Engineering,{' '}
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 bg-clip-text text-transparent">
                Architecture & AI
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Kanzen Tech designs and scales mission-critical distributed systems,
              enterprise cloud microservices, and specialized AI infrastructure built for maximum concurrency.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link to="/contact">
                <Button variant="primary" size="lg" className="shadow-lg shadow-brand-500/25">
                  <span>Start an Engagement</span>
                </Button>
              </Link>
              <Link to="/solutions">
                <Button variant="outline" size="lg">
                  Explore Solutions
                </Button>
              </Link>
            </div>

            {/* Technical Proof Points */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-500" />
                <span>99.99% Guaranteed SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-500" />
                <span>Zero-Trust Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand-500" />
                <span>Sub-50ms Global Latency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offering Highlights Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="brand" size="md">Core Competencies</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Architectural Rigor Meets High Performance
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              From resilient cloud microservices to fine-tuned neural models, we deliver full-lifecycle engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    Enterprise Solutions
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Custom domain platforms, scalable ERP/CRM backends, and multi-tenant architectures.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <Link to="/solutions">
                  <Button variant="outline" size="xs" className="group-hover:border-brand-500 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    <span>Learn more</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    AI & Deep Learning
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Autonomous agents, LLM orchestration pipelines, vector embeddings, and on-prem inference.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <Link to="/services">
                  <Button variant="outline" size="xs" className="group-hover:border-brand-500 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    <span>Learn more</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    High-Performance Cloud
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Kubernetes cluster automation, microservice optimization, and sub-second edge computing.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <Link to="/portfolio">
                  <Button variant="outline" size="xs" className="group-hover:border-brand-500 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    <span>Learn more</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 p-8 sm:p-16 text-white text-center space-y-6 border border-slate-800 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Build Scalable, Resilient Software?
            </h2>
            <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
              Schedule an architecture consultation with our principal engineering team to evaluate your roadmap and system bottlenecks.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/consultations">
                <Button variant="primary" size="lg" className="shadow-lg shadow-brand-500/25">
                  <span>Book Consultation</span>
                </Button>
              </Link>
              <Link to="/case-studies">
                <Button variant="outline" size="lg">
                  <span>View Case Studies</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
export { HomePage as Component };
