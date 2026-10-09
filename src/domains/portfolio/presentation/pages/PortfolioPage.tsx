import { useState, useMemo } from 'react';
import { useAuthStore } from '@/core/auth/auth.store';
import { usePortfolioItems } from '../../application/use-cases/usePortfolioItems';
import { useCreatePortfolioItem } from '../../application/use-cases/useCreatePortfolioItem';
import { useUpdatePortfolioItem } from '../../application/use-cases/useUpdatePortfolioItem';
import { useDeletePortfolioItem } from '../../application/use-cases/useDeletePortfolioItem';
import type { PortfolioItemEntity } from '../../domain/entities/portfolio-item.entity';
import type { CreatePortfolioDto, UpdatePortfolioDto } from '../../infrastructure/portfolio.dto';
import { PortfolioGrid } from '../components/PortfolioGrid';
import { PortfolioForm } from '../components/PortfolioForm';
import { Drawer } from '@/shared/ui/drawer';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { HeaderBanner } from '@/layouts/components';
import {
  SearchFilterBar,
  FilterGroup,
  FilterPill,
  FilterSelect,
} from '@/shared/ui/filter';

export function PortfolioPage() {
  const { user } = useAuthStore();

  const isStaff =
    user?.isAdmin ||
    (Array.isArray(user?.permissions) && user.permissions.includes('portfolio:read'));
  const canWrite =
    user?.isAdmin ||
    (Array.isArray(user?.permissions) && user.permissions.includes('portfolio:write'));

  // Filtering state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [techFilter, setTechFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'title' | 'newest'>('featured');

  // Drawer & modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItemEntity | null>(null);
  const [itemToDelete, setItemToDelete] = useState<PortfolioItemEntity | null>(null);

  // Queries & Mutations
  const { data, isLoading } = usePortfolioItems({
    isAdminView: isStaff,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchQuery || undefined,
  });

  const createMutation = useCreatePortfolioItem();
  const updateMutation = useUpdatePortfolioItem();
  const deleteMutation = useDeletePortfolioItem();

  const items = useMemo(() => data?.items || [], [data?.items]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    for (const item of items) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [items]);

  // Extract unique tech tags
  const availableTechs = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      item.technologies?.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [items]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (techFilter !== 'all') count++;
    if (sortBy !== 'featured') count++;
    return count;
  }, [selectedCategory, techFilter, sortBy]);

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
    if (selectedCategory !== 'all') {
      chips.push({
        id: 'category',
        label: `Category: ${selectedCategory}`,
        onRemove: () => setSelectedCategory('all'),
      });
    }
    if (techFilter !== 'all') {
      chips.push({
        id: 'tech',
        label: `Tech: ${techFilter}`,
        onRemove: () => setTechFilter('all'),
      });
    }
    if (sortBy !== 'featured') {
      chips.push({
        id: 'sort',
        label: `Sort: ${sortBy === 'title' ? 'Title (A-Z)' : 'Newest'}`,
        onRemove: () => setSortBy('featured'),
      });
    }
    return chips;
  }, [searchQuery, selectedCategory, techFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setTechFilter('all');
    setSortBy('featured');
  };

  // Filtered and sorted portfolio items
  const displayedItems = useMemo(() => {
    let list = [...items];
    if (techFilter !== 'all') {
      list = list.filter((i) =>
        i.technologies?.some((t) => t.toLowerCase() === techFilter.toLowerCase()),
      );
    }
    if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [items, techFilter, sortBy]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (item: PortfolioItemEntity) => {
    setEditingItem(item);
    setIsDrawerOpen(true);
  };

  const handleDeletePrompt = (item: PortfolioItemEntity) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    await deleteMutation.mutateAsync(itemToDelete.id);
    setItemToDelete(null);
  };

  const handleFormSubmit = async (dto: CreatePortfolioDto | UpdatePortfolioDto) => {
    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, dto });
    } else {
      await createMutation.mutateAsync(dto as CreatePortfolioDto);
    }
    setIsDrawerOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <HeaderBanner
        badge="Proven Engineering Outcomes"
        title="Engineering Portfolio"
        description="A showcase of mission-critical systems, distributed architectures, and high-performance digital platforms engineered by Kanzen Tech."
      />

      {/* Unified Search & Advanced Filters Bar */}
      <SearchFilterBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search projects by client, architecture, or stack..."
        isExpanded={isFilterExpanded}
        onToggleExpanded={setIsFilterExpanded}
        activeFilterCount={activeFilterCount}
        hasActiveFilters={activeFilterCount > 0 || Boolean(searchQuery)}
        onReset={handleResetFilters}
        totalCount={items.length}
        filteredCount={displayedItems.length}
        resultsLabel="portfolio engagements"
        activeChips={activeChips}
        actions={
          canWrite && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
            >
              Add Project
            </Button>
          )
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Category Filter */}
          <FilterGroup label="Project Practice">
            <div className="flex flex-wrap gap-1.5 pt-1">
              <FilterPill
                label="All Categories"
                isSelected={selectedCategory === 'all'}
                count={categoryCounts['all']}
                onClick={() => setSelectedCategory('all')}
              />
              {Object.keys(categoryCounts)
                .filter((k) => k !== 'all')
                .map((catKey) => (
                  <FilterPill
                    key={catKey}
                    label={catKey}
                    isSelected={selectedCategory === catKey}
                    count={categoryCounts[catKey]}
                    onClick={() => setSelectedCategory(catKey)}
                  />
                ))}
            </div>
          </FilterGroup>

          {/* Tech Stack Filter */}
          <FilterGroup label="Core Technology">
            <FilterSelect
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Technologies' },
                ...availableTechs.slice(0, 15).map((t) => ({ value: t, label: t })),
              ]}
            />
          </FilterGroup>

          {/* Sort By */}
          <FilterGroup label="Sort Projects">
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'title' | 'newest')}
              options={[
                { value: 'featured', label: 'Featured Engagements' },
                { value: 'title', label: 'Project Name (A-Z)' },
                { value: 'newest', label: 'Recently Completed' },
              ]}
            />
          </FilterGroup>
        </div>
      </SearchFilterBar>

      {/* Portfolio Grid */}
      <PortfolioGrid
        items={displayedItems}
        isLoading={isLoading}
        canWrite={canWrite}
        onEdit={handleEdit}
        onDelete={handleDeletePrompt}
      />

      {/* Drawer: Add / Edit Project */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? `Edit: ${editingItem.title}` : 'Add New Portfolio Project'}
        size="lg"
      >
        <div className="p-6">
          <PortfolioForm
            initialData={editingItem}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDrawerOpen(false)}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </div>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        title="Delete Portfolio Project"
      >
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to permanently delete{' '}
            <strong className="text-slate-900 dark:text-white">"{itemToDelete?.title}"</strong>? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setItemToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PortfolioPage;
export { PortfolioPage as Component };
