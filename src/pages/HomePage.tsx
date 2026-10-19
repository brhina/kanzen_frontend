import { Link } from 'react-router';
import { Edit3 } from 'lucide-react';
import { useUIStore } from '@/core/stores/ui.store';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { NewsletterBanner } from '@/domains/newsletter';
import { useTestimonials } from '@/domains/testimonials/application/use-cases/useTestimonials';
import { useFeaturedTestimonials } from '@/domains/testimonials/application/use-cases/useFeaturedTestimonials';
import { useFeaturedSolutions } from '@/domains/solutions/application/use-cases/useFeaturedSolutions';
import {
  useProofPoints,
  useProcessSteps,
} from '@/domains/settings/application/use-cases/usePublicSettings';
import { TestimonialCarousel } from '@/domains/testimonials/presentation/components/TestimonialCarousel';
import { DynamicIcon } from '@/shared/ui/icon/DynamicIcon';
import { HeroLatestUpdates } from './components/HeroLatestUpdates';

export function HomePage() {
  const { isEditMode } = useUIStore();
  const { data: featuredTestimonials, isLoading: isLoadingFeatured } = useFeaturedTestimonials();
  const { data: publicTestimonials, isLoading: isLoadingPublic } = useTestimonials();
  const { data: featuredSolutions } = useFeaturedSolutions();
  const proofPoints = useProofPoints();
  const processSteps = useProcessSteps();

  const testimonials =
    featuredTestimonials && featuredTestimonials.length > 0
      ? featuredTestimonials
      : publicTestimonials && publicTestimonials.length > 0
        ? publicTestimonials
        : [];

  const competencies =
    featuredSolutions && featuredSolutions.length > 0
      ? featuredSolutions.slice(0, 3).map((sol) => ({
          title: sol.name,
          description: sol.tagline || sol.description,
          icon: sol.icon || 'Layers',
          href: `/solutions/${sol.slug || sol.id}`,
        }))
      : [
          {
            title: 'Enterprise Solutions',
            description: 'Custom domain platforms, scalable ERP/CRM backends, and multi-tenant architectures.',
            icon: 'Layers',
            href: '/solutions',
          },
          {
            title: 'AI & Deep Learning',
            description: 'Autonomous agents, LLM orchestration pipelines, vector embeddings, and on-prem inference.',
            icon: 'Cpu',
            href: '/services',
          },
          {
            title: 'High-Performance Cloud',
            description: 'Kubernetes cluster automation, microservice optimization, and sub-second edge computing.',
            icon: 'Zap',
            href: '/portfolio',
          },
        ];

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
      <section className="relative overflow-hidden w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <HeroLatestUpdates proofPoints={proofPoints} />
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
            {competencies.map((comp, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
              >
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <DynamicIcon name={comp.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {comp.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {comp.description}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                  <Link to={comp.href}>
                    <Button variant="outline" size="xs" className="group-hover:border-brand-500 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      <span>Learn more</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Process Section */}
      <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="brand" size="md">
              Engineering Discipline
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              The Veyroo Delivery Framework
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              A predictable, milestone-driven engineering cycle designed to eliminate architectural debt and deliver high-velocity stability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((s) => (
              <div
                key={s.step}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono font-bold text-sm">
                      {s.step}
                    </span>
                    <DynamicIcon name={s.icon || 'Rocket'} className="h-5 w-5 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <Link to="/process">
              <Button variant="outline" size="sm" className="group">
                <span>Explore Full Delivery Process</span>
                <span
                  aria-hidden="true"
                  className="ml-1.5 transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Client Testimonials Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="brand" size="md">
              Client Endorsements
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Trusted by High-Velocity Engineering Teams
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              Read how engineering leadership and architectural teams partner with Veyroo Tech to design, modernize, and scale mission-critical systems.
            </p>
          </div>

          {/* Full-width Single Testimonial Carousel or Empty State */}
          <div className="w-full">
            {testimonials.length > 0 ? (
              <TestimonialCarousel testimonials={testimonials} autoPlayInterval={5000} />
            ) : isLoadingFeatured || isLoadingPublic ? (
              <div className="w-full h-48 rounded-3xl border border-slate-200/80 bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/60 animate-pulse flex items-center justify-center">
                <span className="text-xs text-slate-400">Loading client endorsements...</span>
              </div>
            ) : (
              <div className="text-center py-12 px-4 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Client endorsements and partner reviews will appear here once published.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center pt-2">
            <Link to="/testimonials">
              <Button variant="outline" size="sm" className="group">
                <span>View All Client Endorsements</span>
                <span
                  aria-hidden="true"
                  className="ml-1.5 transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <NewsletterBanner source="home_page" />
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-100/60 p-8 sm:p-16 text-slate-900 text-center space-y-6 dark:border-slate-800 dark:bg-radial dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 dark:text-white">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Ready to Build Scalable, Resilient Software?
            </h2>
            <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Schedule an architecture consultation with our principal engineering team to evaluate your roadmap and system bottlenecks.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/consultations">
                <Button variant="primary" size="lg">
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
