import { Link } from 'react-router';
import {
  ArrowRight,
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-50/80 px-4 py-1.5 text-xs font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              <span>Next-Generation Digital Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
              High-Impact Engineering,{' '}
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
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
                  <ArrowRight className="h-4 w-4 ml-1.5" />
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
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>99.99% Guaranteed SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-500" />
                <span>Zero-Trust Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Sub-50ms Global Latency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offering Highlights Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
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
            <Card className="hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
                  <Layers className="h-5 w-5" />
                </div>
                <CardTitle>Enterprise Solutions</CardTitle>
                <CardDescription>
                  Custom domain platforms, scalable ERP/CRM backends, and multi-tenant architectures.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  to="/solutions"
                  className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  Learn more <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
                  <Cpu className="h-5 w-5" />
                </div>
                <CardTitle>AI & Deep Learning</CardTitle>
                <CardDescription>
                  Autonomous agents, LLM orchestration pipelines, vector embeddings, and on-prem inference.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  to="/services"
                  className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  Learn more <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2">
                  <Zap className="h-5 w-5" />
                </div>
                <CardTitle>High-Performance Cloud</CardTitle>
                <CardDescription>
                  Kubernetes cluster automation, microservice optimization, and sub-second edge computing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  Learn more <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
export { HomePage as Component };
