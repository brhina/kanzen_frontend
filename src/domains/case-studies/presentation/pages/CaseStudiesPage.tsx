import { useState, useMemo } from 'react';
import { Plus, Search, Sparkles, Building2 } from 'lucide-react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useCaseStudies } from '../../application/use-cases/useCaseStudies';
import { useCreateCaseStudy } from '../../application/use-cases/useCreateCaseStudy';
import { useUpdateCaseStudy } from '../../application/use-cases/useUpdateCaseStudy';
import { useDeleteCaseStudy } from '../../application/use-cases/useDeleteCaseStudy';
import type { CaseStudyEntity } from '../../domain/entities/case-study.entity';
import type { CreateCaseStudyDto, UpdateCaseStudyDto } from '../../infrastructure/case-studies.dto';
import { CaseStudyCard } from '../components/CaseStudyCard';
import { CaseStudyForm } from '../components/CaseStudyForm';
import { Drawer } from '@/shared/ui/drawer';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Skeleton } from '@/shared/ui/skeleton';

export function CaseStudiesPage() {
  const { user } = useAuthStore();

  const isStaff =
    user?.isAdmin ||
    (Array.isArray(user?.permissions) && user.permissions.includes('case-studies:read'));
  const canWrite =
    user?.isAdmin ||
    (Array.isArray(user?.permissions) && user.permissions.includes('case-studies:write'));

  // Filtering state
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer & modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<CaseStudyEntity | null>(null);
  const [studyToDelete, setStudyToDelete] = useState<CaseStudyEntity | null>(null);

  // Queries & Mutations
  const { data, isLoading } = useCaseStudies({
    isAdminView: isStaff,
    industry: selectedIndustry !== 'all' ? selectedIndustry : undefined,
    search: searchQuery || undefined,
  });

  const createMutation = useCreateCaseStudy();
  const updateMutation = useUpdateCaseStudy();
  const deleteMutation = useDeleteCaseStudy();

  const studies = useMemo(() => data?.items || [], [data?.items]);

  // Extract unique industries for filter pills
  const availableIndustries = useMemo(() => {
    const set = new Set<string>();
    for (const s of studies) {
      if (s.clientIndustry) set.add(s.clientIndustry.toLowerCase());
    }
    return Array.from(set);
  }, [studies]);

  const handleOpenCreate = () => {
    setEditingStudy(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (study: CaseStudyEntity) => {
    setEditingStudy(study);
    setIsDrawerOpen(true);
  };

  const handleDeletePrompt = (study: CaseStudyEntity) => {
    setStudyToDelete(study);
  };

  const handleConfirmDelete = async () => {
    if (!studyToDelete) return;
    await deleteMutation.mutateAsync(studyToDelete.id);
    setStudyToDelete(null);
  };

  const handleFormSubmit = async (dto: CreateCaseStudyDto | UpdateCaseStudyDto) => {
    if (editingStudy) {
      await updateMutation.mutateAsync({ id: editingStudy.id, dto });
    } else {
      await createMutation.mutateAsync(dto as CreateCaseStudyDto);
    }
    setIsDrawerOpen(false);
    setEditingStudy(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 mb-3 border border-primary-200/60 dark:border-primary-800/60">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Empirical Engineering Verification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Enterprise Case Studies
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            In-depth architectural breakdowns, migration playbooks, and verified quantitative benchmarks from Tier-1 deployments.
          </p>
        </div>

        {canWrite && (
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={handleOpenCreate}
              className="flex items-center gap-2 shadow-lg shadow-primary-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>Create Case Study</span>
            </Button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Industry Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedIndustry('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedIndustry === 'all'
                ? 'bg-primary-600 text-white shadow-sm ring-2 ring-primary-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Industries
          </button>
          {availableIndustries.map((ind) => (
            <button
              key={ind}
              type="button"
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-all cursor-pointer ${
                selectedIndustry === ind
                  ? 'bg-primary-600 text-white shadow-sm ring-2 ring-primary-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client or keyword..."
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4"
            >
              <Skeleton className="aspect-[16/9] w-full rounded-xl" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && studies.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-3">
          <Building2 className="h-10 w-10 text-slate-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Case Studies Found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            No enterprise case studies match your current filter criteria.
          </p>
        </div>
      )}

      {/* Grid of Studies */}
      {!isLoading && studies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studies.map((study) => (
            <CaseStudyCard
              key={study.id}
              study={study}
              canWrite={canWrite}
              onEdit={handleEdit}
              onDelete={handleDeletePrompt}
            />
          ))}
        </div>
      )}

      {/* Drawer: Add / Edit Case Study */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingStudy ? `Edit: ${editingStudy.title}` : 'Create Enterprise Case Study'}
        size="lg"
      >
        <div className="p-6">
          <CaseStudyForm
            initialData={editingStudy}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDrawerOpen(false)}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </div>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(studyToDelete)}
        onClose={() => setStudyToDelete(null)}
        title="Delete Case Study"
      >
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to permanently delete case study{' '}
            <strong className="text-slate-900 dark:text-white">"{studyToDelete?.title}"</strong>? This will remove all associated metrics and reports.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setStudyToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete Case Study
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CaseStudiesPage;
export { CaseStudiesPage as Component };
