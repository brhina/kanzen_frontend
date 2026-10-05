import { useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  ArrowLeft,
  Building2,
  Users,
  Clock,
  Layers,
  Edit3,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Trophy,
} from 'lucide-react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useCaseStudy } from '../../application/use-cases/useCaseStudy';
import { useUpdateCaseStudy } from '../../application/use-cases/useUpdateCaseStudy';
import type { UpdateCaseStudyDto } from '../../infrastructure/case-studies.dto';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Drawer } from '@/shared/ui/drawer';
import { Skeleton } from '@/shared/ui/skeleton';
import { CaseStudyMetrics } from '../components/CaseStudyMetrics';
import { CaseStudyDownload } from '../components/CaseStudyDownload';
import { CaseStudyForm } from '../components/CaseStudyForm';

export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuthStore();

  const canWrite =
    user?.isAdmin ||
    (Array.isArray(user?.permissions) && user.permissions.includes('case-studies:write'));

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const { data: study, isLoading, isError } = useCaseStudy(slug);
  const updateMutation = useUpdateCaseStudy();

  const handleUpdate = async (dto: UpdateCaseStudyDto) => {
    if (!study) return;
    await updateMutation.mutateAsync({ id: study.id, dto });
    setIsEditDrawerOpen(false);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !study) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Case Study Not Found
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The requested enterprise case study could not be located or has been unpublished.
        </p>
        <div className="pt-4">
          <Link to="/case-studies">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Case Studies</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Top Navigation & Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Enterprise Case Studies</span>
          </Link>

          <div className="flex items-center gap-3">
            {study.pdfUrl && (
              <CaseStudyDownload pdfUrl={study.pdfUrl} title={study.title} variant="button" />
            )}

            {canWrite && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDrawerOpen(true)}
                className="flex items-center gap-1.5 text-xs"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Case Study</span>
              </Button>
            )}
          </div>
        </div>

        {/* Client Badges & Title */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" size="sm" className="font-semibold capitalize">
              {study.clientIndustry}
            </Badge>

            {study.isFeatured && (
              <Badge variant="info" size="sm">
                Featured Case Study
              </Badge>
            )}

            {study.status !== 'published' && (
              <Badge variant="neutral" size="sm" className="capitalize text-xs">
                {study.status}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {study.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
              <Building2 className="h-4 w-4 text-primary-500" />
              <span>{study.client}</span>
            </span>

            {study.clientSize && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span>{study.clientSize}</span>
              </>
            )}

            {study.duration && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{study.duration}</span>
                </span>
              </>
            )}

            {study.teamSize && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{study.teamSize} Engineers</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
        <img
          src={study.coverImage}
          alt={study.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Outcome Metrics Cards */}
      {study.metrics && study.metrics.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Measurable Outcome Benchmarks
          </h2>
          <CaseStudyMetrics metrics={study.metrics} variant="cards" />
        </div>
      )}

      {/* Executive Summary */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 sm:p-10 space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Executive Summary
        </h2>
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
          {study.summary}
        </p>
      </div>

      {/* Deep-Dive Narrative Sections */}
      <div className="space-y-10">
        {/* The Challenge */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              The Architecture Bottleneck & Challenge
            </h2>
          </div>
          <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-500/5 p-6 sm:p-8">
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {study.challenge}
            </p>
          </div>
        </section>

        {/* The Strategic Approach */}
        {study.approach && (
          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400">
              <Lightbulb className="h-5 w-5" />
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Strategic Engineering Approach
              </h2>
            </div>
            <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-500/5 p-6 sm:p-8">
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {study.approach}
              </p>
            </div>
          </section>
        )}

        {/* The Technical Solution */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 text-primary-600 dark:text-primary-400">
            <Cpu className="h-5 w-5" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              The Architectural Solution
            </h2>
          </div>
          <div className="rounded-2xl border border-primary-200 dark:border-primary-900/50 bg-primary-500/5 p-6 sm:p-8">
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {study.solution}
            </p>
          </div>
        </section>

        {/* Supporting Images / Architecture Diagrams */}
        {study.images && study.images.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Architecture Schematics & Telemetry Graphs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {study.images.map((img, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950"
                >
                  <img
                    src={img}
                    alt={`Architecture Diagram ${idx + 1}`}
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Results */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
            <Trophy className="h-5 w-5" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Verified Production Results
            </h2>
          </div>
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-500/5 p-6 sm:p-8">
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {study.results}
            </p>
          </div>
        </section>
      </div>

      {/* Tech Stack Chips */}
      {study.technologies && study.technologies.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Layers className="h-4 w-4" />
            <span>Technologies & Distributed Stack</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {study.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Downloadable PDF Banner */}
      <CaseStudyDownload
        pdfUrl={study.pdfUrl}
        title={study.title}
        variant="banner"
      />

      {/* Inline Drawer for Editing Case Study */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title={`Edit: ${study.title}`}
        size="lg"
      >
        <div className="p-6">
          <CaseStudyForm
            initialData={study}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditDrawerOpen(false)}
            isLoading={updateMutation.isPending}
          />
        </div>
      </Drawer>
    </div>
  );
}

export default CaseStudyPage;
export { CaseStudyPage as Component };
