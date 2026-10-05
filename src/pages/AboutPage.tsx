import { Link } from 'react-router';
import { Target, Users, Shield, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';

export function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      {/* Intro */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="brand" size="md">Our Mission</Badge>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Engineering Perfection at Enterprise Scale
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          "Kanzen" stands for completeness, perfection, and wholeness. We approach digital systems
          engineering not as ad-hoc software development, but as enduring enterprise craft.
        </p>
      </section>

      {/* Values Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
              <Target className="h-5 w-5" />
            </div>
            <CardTitle>Architectural Rigor</CardTitle>
            <CardDescription>
              We favor deterministic, type-safe, and formally verified patterns over fragile abstractions.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
              <Shield className="h-5 w-5" />
            </div>
            <CardTitle>Zero-Trust Security</CardTitle>
            <CardDescription>
              Every API, data store, and network boundary is audited with end-to-end RBAC and encryption.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
              <Users className="h-5 w-5" />
            </div>
            <CardTitle>Senior Engineers Only</CardTitle>
            <CardDescription>
              Our engagements are executed exclusively by principal architects and staff software engineers.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
              <Award className="h-5 w-5" />
            </div>
            <CardTitle>Measured Outcomes</CardTitle>
            <CardDescription>
              We tie engineering deliverables directly to measurable business KPIs, SLA benchmarks, and ROI.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-gradient-to-r from-slate-950 via-brand-950 to-slate-900 p-8 sm:p-12 text-white text-center space-y-6 border border-brand-500/20">
        <h2 className="text-3xl font-bold tracking-tight">Ready to elevate your engineering standard?</h2>
        <p className="max-w-xl mx-auto text-slate-300 text-sm sm:text-base">
          Schedule an architectural deep dive with our principal engineering team.
        </p>
        <Link to="/contact">
          <Button variant="primary" size="lg" className="shadow-lg shadow-brand-500/25">
            <span>Consult With Us</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </Link>
      </section>
    </div>
  );
}

export default AboutPage;
export { AboutPage as Component };
