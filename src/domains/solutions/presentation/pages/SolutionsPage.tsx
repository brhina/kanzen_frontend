import { useState, useMemo } from 'react';
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
import {
  SearchFilterBar,
  FilterGroup,
  FilterPill,
  FilterSelect,
} from '@/shared/ui/filter';

export function SolutionsPage() {
  const { user } = useAuthStore();
  const isStaff = user?.isAdmin || (Array.isArray(user?.permissions) && user.permissions.includes('solutions:read'));
  const canWrite = user?.isAdmin || (Array.isArray(user?.permissions) && user.permissions.includes('solutions:write'));

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [architectureType, setArchitectureType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'newest'>('featured');

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

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedIndustry !== 'all') count++;
    if (architectureType !== 'all') count++;
    if (sortBy !== 'featured') count++;
    return count;
  }, [selectedIndustry, architectureType, sortBy]);

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
    if (architectureType !== 'all') {
      chips.push({
        id: 'arch',
        label: `Architecture: ${architectureType}`,
        onRemove: () => setArchitectureType('all'),
      });
    }
    if (sortBy !== 'featured') {
      chips.push({
        id: 'sort',
        label: `Sort: ${sortBy === 'name' ? 'Name (A-Z)' : 'Newest'}`,
        onRemove: () => setSortBy('featured'),
      });
    }
    return chips;
  }, [searchQuery, selectedIndustry, architectureType, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('all');
    setArchitectureType('all');
    setSortBy('featured');
  };

  // Filtered and sorted solutions
  const displayedSolutions = useMemo(() => {
    let list = [...solutions];
    if (architectureType !== 'all') {
      list = list.filter((s) =>
        s.description?.toLowerCase().includes(architectureType.toLowerCase()) ||
        s.tagline?.toLowerCase().includes(architectureType.toLowerCase()) ||
        s.name?.toLowerCase().includes(architectureType.toLowerCase()) ||
        s.features?.some((f) => f.toLowerCase().includes(architectureType.toLowerCase())),
      );
    }
    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [solutions, architectureType, sortBy]);

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
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
            <span>Pre-Engineered Architecture Blueprints</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
            Industry &amp; Enterprise Solutions
          </h1>

          <p className="text-sm text-slate-300 sm:text-base leading-relaxed max-w-2xl mx-auto">
            Turnkey architectural solutions designed for domain complexity — from high-compliance fintech pipelines to distributed IoT ingestion.
          </p>
        </div>
      </div>

      {/* Unified Search & Advanced Filters Bar */}
      <SearchFilterBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search solution blueprints, domain patterns..."
        isExpanded={isFilterExpanded}
        onToggleExpanded={setIsFilterExpanded}
        activeFilterCount={activeFilterCount}
        hasActiveFilters={activeFilterCount > 0 || Boolean(searchQuery)}
        onReset={handleResetFilters}
        totalCount={solutions.length}
        filteredCount={displayedSolutions.length}
        resultsLabel="solution architectures"
        activeChips={activeChips}
        actions={
          canWrite && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="shrink-0"
            >
              Add Solution
            </Button>
          )
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Industry Filter */}
          <FilterGroup label="Industry Domain" count={availableIndustries.length + 1}>
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

          {/* Architecture Type */}
          <FilterGroup label="System Architecture">
            <FilterSelect
              value={architectureType}
              onChange={(e) => setArchitectureType(e.target.value)}
              options={[
                { value: 'all', label: 'All Architectures' },
                { value: 'cloud', label: 'Cloud-Native & Serverless' },
                { value: 'distributed', label: 'Distributed Event-Driven' },
                { value: 'ai', label: 'AI & Inference Systems' },
                { value: 'fintech', label: 'High-Compliance & Security' },
              ]}
            />
          </FilterGroup>

          {/* Sort By */}
          <FilterGroup label="Sort Solutions">
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'name' | 'newest')}
              options={[
                { value: 'featured', label: 'Featured Blueprints' },
                { value: 'name', label: 'Blueprint Name (A-Z)' },
                { value: 'newest', label: 'Recently Architected' },
              ]}
            />
          </FilterGroup>
        </div>
      </SearchFilterBar>

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
      ) : displayedSolutions.length === 0 ? (
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
          {displayedSolutions.map((solution) => (
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
