import { useState, useMemo } from 'react';
import { Plus, Search, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useSolutions } from '../../application/use-cases/useSolutions';
import { useCreateSolution } from '../../application/use-cases/useCreateSolution';
import { useUpdateSolution } from '../../application/use-cases/useUpdateSolution';
import { useDeleteSolution } from '../../application/use-cases/useDeleteSolution';
import type { SolutionEntity } from '../../domain/entities/solution.entity';
import type { CreateSolutionDto, UpdateSolutionDto } from '../../infrastructure/solutions.dto';
import { SolutionCard } from '../components/SolutionCard';
import { SolutionForm } from '../components/SolutionForm';
import { Drawer } from '@/shared/ui/drawer';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export function SolutionsPage() {
  const { user } = useAuthStore();
  const isStaff = user?.isAdmin || (Array.isArray(user?.permissions) && user.permissions.includes('solutions:read'));
  const canWrite = user?.isAdmin || (Array.isArray(user?.permissions) && user.permissions.includes('solutions:write'));

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState<SolutionEntity | null>(null);
  const [solutionToDelete, setSolutionToDelete] = useState<SolutionEntity | null>(null);

  const { data, isLoading, refetch } = useSolutions({
    isAdminView: isStaff,
    industry: selectedIndustry !== 'all' ? selectedIndustry : undefined,
    search: searchQuery || undefined,
  });

  const createMutation = useCreateSolution();
  const updateMutation = useUpdateSolution();
  const deleteMutation = useDeleteSolution();

  const solutions = useMemo(() => data?.solutions || [], [data?.solutions]);

  // Extract unique industries for filter pills
  const availableIndustries = useMemo(() => {
    const set = new Set<string>();
    solutions.forEach((s) => {
      s.industries.forEach((ind) => set.add(ind));
    });
    return Array.from(set);
  }, [solutions]);

  const handleOpenCreate = () => {
    setEditingSolution(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (solution: SolutionEntity) => {
    setEditingSolution(solution);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingSolution(null);
  };

  const handleFormSubmit = async (dto: CreateSolutionDto | UpdateSolutionDto) => {
    if (editingSolution?.id) {
      await updateMutation.mutateAsync({
        id: editingSolution.id,
        dto: dto as UpdateSolutionDto,
      });
    } else {
      await createMutation.mutateAsync(dto as CreateSolutionDto);
    }
    handleCloseDrawer();
    refetch();
  };

  const handleConfirmDelete = async () => {
    if (!solutionToDelete?.id) return;
    await deleteMutation.mutateAsync(solutionToDelete.id);
    setSolutionToDelete(null);
    refetch();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16 border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            <span>Pre-Engineered Architecture Blueprints</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
            Industry &amp; Enterprise Solutions
          </h1>

          <p className="text-sm text-slate-300 sm:text-base leading-relaxed">
            Turnkey architectural solutions designed for domain complexity — from high-compliance fintech pipelines to distributed IoT ingestion.
          </p>
        </div>
      </div>

      {/* Control Row: Filter Pills, Search, and Staff Add Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Industry Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedIndustry('all')}
            className={`inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              selectedIndustry === 'all'
                ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            All Industries
          </button>
          {availableIndustries.map((ind) => (
            <button
              key={ind}
              type="button"
              onClick={() => setSelectedIndustry(ind)}
              className={`inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                selectedIndustry === ind
                  ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* Right Search & Action */}
        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search solutions..."
              className="h-9 pl-9 text-xs"
            />
          </div>

          {canWrite && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add Solution</span>
            </Button>
          )}
        </div>
      </div>

      {/* Solutions Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : solutions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No solutions found
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search criteria or industry filter.
          </p>
          {canWrite && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="mt-4"
            >
              Create First Solution
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution) => (
            <SolutionCard
              key={solution.id || solution.slug}
              solution={solution}
              onEdit={handleOpenEdit}
              showAdminActions={canWrite}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Solution Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={editingSolution ? 'Edit Solution Blueprint' : 'Add Solution Blueprint'}
        description={
          editingSolution
            ? `Editing "${editingSolution.name}"`
            : 'Configure architectural specifications, features, and targeted industries.'
        }
        size="lg"
      >
        <SolutionForm
          initialData={editingSolution}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseDrawer}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(solutionToDelete)}
        onClose={() => setSolutionToDelete(null)}
        title="Delete Solution Blueprint"
        description="Are you sure you want to permanently delete this solution blueprint? This cannot be undone."
      >
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            "{solutionToDelete?.name}"
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSolutionToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
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

export default SolutionsPage;
export { SolutionsPage as Component };
