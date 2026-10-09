import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useSolution } from '../../application/use-cases/useSolution';
import { useUpdateSolution } from '../../application/use-cases/useUpdateSolution';
import { useDeleteSolution } from '../../application/use-cases/useDeleteSolution';
import type { UpdateSolutionDto } from '../../infrastructure/solutions.dto';
import { SolutionForm } from '../components/SolutionForm';
import { PermissionGate } from '@/core/auth/guards/PermissionGate';
import { Drawer } from '@/shared/ui/drawer';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';

export function SolutionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: solution, isLoading, error, refetch } = useSolution(slug);
  const updateMutation = useUpdateSolution();
  const deleteMutation = useDeleteSolution();

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdate = async (dto: UpdateSolutionDto) => {
    if (solution?.id) {
      await updateMutation.mutateAsync({ id: solution.id, dto });
      setIsEditDrawerOpen(false);
      refetch();
    }
  };

  const handleDelete = async () => {
    if (!solution?.id) return;
    await deleteMutation.mutateAsync(solution.id);
    setIsDeleteModalOpen(false);
    navigate('/solutions');
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-brand-500 border-t-transparent" />
        <p className="mt-3 text-sm text-slate-500">Loading solution architecture...</p>
      </div>
    );
  }

  if (error || !solution) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Solution Blueprint Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The requested architecture solution may have been renamed or removed.
        </p>
        <div className="mt-6">
          <Link to="/solutions">
            <Button variant="primary" size="sm" className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Solutions</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Staff Inline Control Header */}
      <PermissionGate permission="solutions:write">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Staff Controls:
            </span>
            <Badge
              variant={solution.status === 'active' ? 'success' : 'neutral'}
              size="sm"
              className="capitalize font-mono text-xs"
            >
              Status: {solution.status}
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
              <span>Edit Blueprint</span>
            </Button>

            <PermissionGate permission="solutions:delete">
              <Button
                type="button"
                variant="danger"
                size="xs"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </Button>
            </PermissionGate>
          </div>
        </div>
      </PermissionGate>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {solution.industries?.map((ind) => (
            <Badge key={ind} variant="neutral" size="sm" className="uppercase font-mono text-[10px]">
              {ind}
            </Badge>
          ))}
          {solution.isFeatured && (
            <Badge variant="warning" size="sm">
              Spotlight Architecture
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-black text-slate-900 sm:text-5xl dark:text-white">
          {solution.name}
        </h1>

        <p className="text-lg font-medium text-brand-600 dark:text-brand-400 max-w-3xl">
          {solution.tagline}
        </p>
      </div>

      {/* Main Grid: Left Spec Details & Right Consultation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Architectural Diagram if present */}
          {solution.coverImage && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <img
                src={solution.coverImage}
                alt={solution.name}
                className="w-full max-h-[460px] object-cover"
              />
            </div>
          )}

          {/* Overview */}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Architectural Breakdown &amp; System Design
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {solution.description}
            </div>
          </section>

          {/* Key Components & Features */}
          {solution.features && solution.features.length > 0 && (
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Components &amp; Architectural Guarantees</span>
              </h2>
              <div className="space-y-2.5 pt-2">
                {solution.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs font-medium text-slate-800 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                      {idx + 1}
                    </span>
                    <span className="mt-0.5">{feat}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right CTA */}
        <div className="space-y-6">
          <Card className="sticky top-20 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-500" />
                <span>Implement This Architecture</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Work with Kanzen's principal systems architects to adapt, customize, and deploy this blueprint inside your cloud environment.
              </p>

              <div className="space-y-2 pt-2">
                <Link to="/consultations" className="w-full block">
                  <Button variant="primary" size="md" className="w-full flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Schedule Architecture Review</span>
                  </Button>
                </Link>

                <Link to="/leads" className="w-full block">
                  <Button variant="outline" size="md" className="w-full flex items-center justify-center gap-2">
                    <span>Contact Enterprise Sales</span>
                  </Button>
                </Link>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-500 dark:text-slate-400 dark:bg-slate-800/50">
                Typical implementation: 6 - 12 weeks with zero legacy regression guarantees.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Solution Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title="Edit Solution Blueprint"
        description={`Updating "${solution.name}"`}
        size="lg"
      >
        <SolutionForm
          initialData={solution}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditDrawerOpen(false)}
          isLoading={updateMutation.isPending}
        />
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Solution Blueprint"
        description="Are you sure you want to permanently delete this solution blueprint? This action cannot be reversed."
      >
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            "{solution.name}"
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SolutionDetailPage;
export { SolutionDetailPage as Component };
