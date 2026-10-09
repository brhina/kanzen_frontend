import { useState, useMemo } from 'react';
import { Building2 } from 'lucide-react';
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
import { Skeleton } from '@/shared/ui/skeleton';
import {
  SearchFilterBar,
  FilterGroup,
  FilterPill,
  FilterSelect,
} from '@/shared/ui/filter';

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
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [impactMetric, setImpactMetric] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'impact' | 'title' | 'newest'>('impact');

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

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedIndustry !== 'all') count++;
    if (impactMetric !== 'all') count++;
    if (sortBy !== 'impact') count++;
    return count;
  }, [selectedIndustry, impactMetric, sortBy]);

  // Active filter chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (searchQuery) {
      chips.push({
        id: 'search',
        label: `Search: "${searchQuery}"`,
        onRemove: () => setSearchQuery(''),
      });
    }
    if (selectedIndustry !== 'all') {
      chips.push({
        id: 'industry',
        label: `Industry: ${selectedIndustry}`,
        onRemove: () => setSelectedIndustry('all'),
      });
    }
    if (impactMetric !== 'all') {
      chips.push({
        id: 'impact',
        label: `Metric Focus: ${impactMetric}`,
        onRemove: () => setImpactMetric('all'),
      });
    }
    if (sortBy !== 'impact') {
      chips.push({
        id: 'sort',
        label: `Sort: ${sortBy === 'title' ? 'Title (A-Z)' : 'Newest'}`,
        onRemove: () => setSortBy('impact'),
      });
    }
    return chips;
  }, [searchQuery, selectedIndustry, impactMetric, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('all');
    setImpactMetric('all');
    setSortBy('impact');
  };

  // Filtered and sorted case studies
  const displayedStudies = useMemo(() => {
    let list = [...studies];
    if (impactMetric !== 'all') {
      list = list.filter((s) =>
        s.metrics?.some((m) =>
          m.label.toLowerCase().includes(impactMetric.toLowerCase()) ||
          m.value.toLowerCase().includes(impactMetric.toLowerCase())
        ) ||
        s.challenge?.toLowerCase().includes(impactMetric.toLowerCase()) ||
        s.solution?.toLowerCase().includes(impactMetric.toLowerCase())
      );
    }
    if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [studies, impactMetric, sortBy]);

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
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
            <span>Empirical Engineering Verification</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
            Enterprise Case Studies
          </h1>

          <p className="text-sm text-slate-300 sm:text-base leading-relaxed max-w-2xl mx-auto">
            In-depth architectural breakdowns, migration playbooks, and verified quantitative benchmarks from Tier-1 deployments.
          </p>
        </div>
      </div>

      {/* Unified Search & Advanced Filters Bar */}
      <SearchFilterBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search case studies by client, problem, or outcomes..."
        isExpanded={isFilterExpanded}
        onToggleExpanded={setIsFilterExpanded}
        activeFilterCount={activeFilterCount}
        hasActiveFilters={activeFilterCount > 0 || Boolean(searchQuery)}
        onReset={handleResetFilters}
        totalCount={studies.length}
        filteredCount={displayedStudies.length}
        resultsLabel="enterprise case studies"
        activeChips={activeChips}
        actions={
          canWrite && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="shadow-sm"
            >
              Create Case Study
            </Button>
          )
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Industry Pills */}
          <FilterGroup label="Client Industry" count={availableIndustries.length + 1}>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <FilterPill
                label="All Industries"
                isSelected={selectedIndustry === 'all'}
                onClick={() => setSelectedIndustry('all')}
              />
              {availableIndustries.map((ind) => (
                <FilterPill
                  key={ind}
                  label={ind}
                  isSelected={selectedIndustry === ind}
                  onClick={() => setSelectedIndustry(ind)}
                />
              ))}
            </div>
          </FilterGroup>

          {/* Metric Focus */}
          <FilterGroup label="Outcome & Metric Focus">
            <FilterSelect
              value={impactMetric}
              onChange={(e) => setImpactMetric(e.target.value)}
              options={[
                { value: 'all', label: 'All Metric Outliers' },
                { value: 'latency', label: 'Latency & Throughput' },
                { value: 'cost', label: 'Cloud Cost Optimization' },
                { value: 'scale', label: 'Scale & Concurrency' },
                { value: 'uptime', label: 'High Availability & 99.99%' },
              ]}
            />
          </FilterGroup>

          {/* Sort By */}
          <FilterGroup label="Sort Case Studies">
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'impact' | 'title' | 'newest')}
              options={[
                { value: 'impact', label: 'Highest Benchmark Impact' },
                { value: 'title', label: 'Client / Case Title (A-Z)' },
                { value: 'newest', label: 'Recently Published' },
              ]}
            />
          </FilterGroup>
        </div>
      </SearchFilterBar>

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
      {!isLoading && displayedStudies.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
          <Building2 className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No enterprise case studies found
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try selecting a different industry or clearing filter parameters.
          </p>
          {canWrite && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="mt-4"
            >
              Create Case Study
            </Button>
          )}
        </div>
      )}

      {/* Grid of Studies */}
      {!isLoading && displayedStudies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedStudies.map((study) => (
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
