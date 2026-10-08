import { useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  ArrowLeft,
  ExternalLink,
  Code2,
  Calendar,
  Users,
  Clock,
  Layers,
  Edit3,
  Lock,
  CheckCircle,
} from 'lucide-react';
import { useAuthStore } from '@/core/auth/auth.store';
import { usePortfolioItem } from '../../application/use-cases/usePortfolioItem';
import { useUpdatePortfolioItem } from '../../application/use-cases/useUpdatePortfolioItem';
import type { UpdatePortfolioDto } from '../../infrastructure/portfolio.dto';
import { PORTFOLIO_CATEGORY_LABELS } from '../../domain/enums/portfolio-category.enum';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Drawer } from '@/shared/ui/drawer';
import { Skeleton } from '@/shared/ui/skeleton';
import { PortfolioGallery } from '../components/PortfolioGallery';
import { ProjectMetrics } from '../components/ProjectMetrics';
import { PortfolioForm } from '../components/PortfolioForm';

export function PortfolioItemPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuthStore();

  const canWrite =
    user?.isAdmin ||
    (Array.isArray(user?.permissions) && user.permissions.includes('portfolio:write'));

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const { data: item, isLoading, isError } = usePortfolioItem(slug);
  const updateMutation = useUpdatePortfolioItem();

  const handleUpdate = async (dto: UpdatePortfolioDto) => {
    if (!item) return;
    await updateMutation.mutateAsync({ id: item.id, dto });
    setIsEditDrawerOpen(false);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="aspect-video w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Portfolio Project Not Found
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The requested engineering project could not be found or has been archived.
        </p>
        <div className="pt-4">
          <Link to="/portfolio">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Portfolio</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel = PORTFOLIO_CATEGORY_LABELS[item.category] || item.category;

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Staff Inline Control Header */}
      {canWrite && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Staff Controls:
            </span>
            <Badge
              variant={item.status === 'published' ? 'success' : 'neutral'}
              size="sm"
              className="capitalize font-mono text-xs"
            >
              Status: {item.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setIsEditDrawerOpen(true)}
              className="flex items-center gap-1"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Project</span>
            </Button>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand" size="sm" className="font-medium">
            {categoryLabel}
          </Badge>

          {item.isConfidential && (
            <Badge variant="warning" size="sm" className="flex items-center gap-1 font-mono text-xs">
              <Lock className="h-3 w-3" />
              <span>Confidential Client (NDA)</span>
            </Badge>
          )}

          {item.isFeatured && (
            <Badge variant="warning" size="sm">
              Featured Project
            </Badge>
          )}

          {item.status !== 'published' && (
            <Badge variant="neutral" size="sm" className="capitalize text-xs">
              {item.status}
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-black text-slate-900 sm:text-5xl dark:text-white">
          {item.title}
        </h1>

        {item.subtitle && (
          <p className="text-lg font-medium text-brand-600 dark:text-brand-400 max-w-3xl">
            {item.subtitle}
          </p>
        )}

        {item.client && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Client Partner: <strong className="text-slate-800 dark:text-slate-200">{item.client}</strong>
          </p>
        )}
      </div>

      {/* Gallery & Media Showcase */}
      <PortfolioGallery
        coverImage={item.coverImage}
        images={item.images}
        videoUrl={item.videoUrl}
        title={item.title}
      />

      {/* Outcome Metrics Section */}
      {item.metrics && item.metrics.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Quantifiable Impact & Benchmarks
          </h2>
          <ProjectMetrics metrics={item.metrics} variant="featured" />
        </div>
      )}

      {/* Main Grid: Narrative & Parameters Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4">
        {/* Narrative Columns (2 spans) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Executive Overview */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Executive Overview
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* The Challenge */}
          {item.challenge && (
            <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-6 space-y-3">
              <h3 className="text-base font-bold text-amber-900 dark:text-amber-400">
                The Engineering Challenge
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {item.challenge}
              </p>
            </div>
          )}

          {/* The Solution */}
          {item.solution && (
            <div className="rounded-2xl bg-primary-500/5 border border-primary-500/20 p-6 space-y-3">
              <h3 className="text-base font-bold text-primary-900 dark:text-primary-400">
                The Architectural Solution
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {item.solution}
              </p>
            </div>
          )}

          {/* Results & Business Outcomes */}
          {item.results && (
            <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-6 space-y-3">
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-400">
                Verified Business Outcomes
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {item.results}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Parameters (1 span) */}
        <div className="space-y-6 lg:sticky lg:top-20">
          {/* External Links Card */}
          {(item.liveUrl || item.githubUrl) && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-900/60 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Deployment & Source
              </h3>
              <div className="space-y-2">
                {item.liveUrl && (
                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white hover:text-primary-600 transition-colors"
                  >
                    <span>View Live Deployment</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {item.githubUrl && (
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white hover:text-primary-600 transition-colors"
                  >
                    <span>Inspect GitHub Repository</span>
                    <Code2 className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {item.technologies && item.technologies.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Layers className="h-4 w-4" />
                <span>Technologies & Frameworks</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {item.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Project Parameters */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Project Parameters
            </h3>

            <div className="space-y-3 text-xs">
              {item.duration && (
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Duration</span>
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.duration}
                  </span>
                </div>
              )}

              {item.teamSize && (
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <span>Engineers Assigned</span>
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.teamSize} Engineers
                  </span>
                </div>
              )}

              {item.completedAt && (
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Delivered</span>
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {new Date(item.completedAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              {item.services && item.services.length > 0 && (
                <div className="pt-2">
                  <span className="text-slate-500 block mb-2">Scope of Services:</span>
                  <div className="space-y-1.5">
                    {item.services.map((srv, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <CheckCircle className="h-3.5 w-3.5 text-primary-500" />
                        <span>{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Drawer for Editing */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title={`Edit: ${item.title}`}
        size="lg"
      >
        <div className="p-6">
          <PortfolioForm
            initialData={item}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditDrawerOpen(false)}
            isLoading={updateMutation.isPending}
          />
        </div>
      </Drawer>
    </div>
  );
}

export default PortfolioItemPage;
export { PortfolioItemPage as Component };
