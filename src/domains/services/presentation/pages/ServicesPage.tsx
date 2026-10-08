import { useState, useMemo } from 'react';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';
import { useServices } from '../../application/use-cases/useServices';
import { useCreateService } from '../../application/use-cases/useCreateService';
import { useUpdateService } from '../../application/use-cases/useUpdateService';
import { useDeleteService } from '../../application/use-cases/useDeleteService';
import { ServiceCategory } from '../../domain/enums/service-category.enum';
import type { ServiceEntity } from '../../domain/entities/service.entity';
import type { CreateServiceDto, UpdateServiceDto } from '../../infrastructure/services.dto';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceTable } from '../components/ServiceTable';
import { ServiceForm } from '../components/ServiceForm';
import { Drawer } from '@/shared/ui/drawer';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import {
  SearchFilterBar,
  FilterGroup,
  FilterPill,
  FilterSelect,
} from '@/shared/ui/filter';

const categoryTabs = [
  { id: 'all', label: 'All Services' },
  { id: ServiceCategory.CUSTOM_SOFTWARE, label: 'Custom Software' },
  { id: ServiceCategory.SAAS, label: 'SaaS Engineering' },
  { id: ServiceCategory.CLOUD, label: 'Cloud & DevOps' },
  { id: ServiceCategory.AI, label: 'AI & Data Systems' },
  { id: ServiceCategory.CONSULTING, label: 'Advisory & Strategy' },
];

export function ServicesPage() {
  const { user } = useAuthStore();
  const { viewMode, setViewMode } = useUIStore();

  const isStaff = user?.isAdmin || (Array.isArray(user?.permissions) && user.permissions.includes('services:read'));
  const canWrite = user?.isAdmin || (Array.isArray(user?.permissions) && user.permissions.includes('services:write'));

  // Filtering state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [pricingTier, setPricingTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'newest'>('featured');

  // Drawer & modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceEntity | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceEntity | null>(null);

  // Queries & Mutations
  const { data, isLoading, refetch } = useServices({
    isAdminView: isStaff,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchQuery || undefined,
  });

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const services = useMemo(() => data?.services || [], [data?.services]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (pricingTier !== 'all') count++;
    if (sortBy !== 'featured') count++;
    return count;
  }, [selectedCategory, pricingTier, sortBy]);

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
      const tab = categoryTabs.find((t) => t.id === selectedCategory);
      chips.push({
        id: 'category',
        label: `Category: ${tab?.label || selectedCategory}`,
        onRemove: () => setSelectedCategory('all'),
      });
    }
    if (pricingTier !== 'all') {
      chips.push({
        id: 'tier',
        label: `Pricing: ${pricingTier}`,
        onRemove: () => setPricingTier('all'),
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
  }, [searchQuery, selectedCategory, pricingTier, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPricingTier('all');
    setSortBy('featured');
  };

  // Filtered and sorted services
  const displayedServices = useMemo(() => {
    let list = [...services];
    if (pricingTier !== 'all') {
      list = list.filter((s) => s.pricingModel?.toLowerCase() === pricingTier.toLowerCase());
    }
    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [services, pricingTier, sortBy]);

  const handleOpenCreate = () => {
    setEditingService(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (service: ServiceEntity) => {
    setEditingService(service);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingService(null);
  };

  const handleFormSubmit = async (dto: CreateServiceDto | UpdateServiceDto) => {
    if (editingService?.id) {
      await updateMutation.mutateAsync({
        id: editingService.id,
        dto: dto as UpdateServiceDto,
      });
    } else {
      await createMutation.mutateAsync(dto as CreateServiceDto);
    }
    handleCloseDrawer();
    refetch();
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete?.id) return;
    await deleteMutation.mutateAsync(serviceToDelete.id);
    setServiceToDelete(null);
    refetch();
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16 border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
            <span>Engineering Practices &amp; Offerings</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
            Enterprise Engineering &amp; Solutions
          </h1>

          <p className="text-sm text-slate-300 sm:text-base leading-relaxed">
            From architecture modernization to distributed systems and production AI implementations — bespoke engineering capabilities built to deliver measurable outcomes.
          </p>
        </div>
      </div>

      {/* Unified Search & Advanced Filters Bar */}
      <SearchFilterBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search services, deliverables, or capabilities..."
        isExpanded={isFilterExpanded}
        onToggleExpanded={setIsFilterExpanded}
        activeFilterCount={activeFilterCount}
        hasActiveFilters={activeFilterCount > 0 || Boolean(searchQuery)}
        onReset={handleResetFilters}
        totalCount={services.length}
        filteredCount={displayedServices.length}
        resultsLabel="service offerings"
        activeChips={activeChips}
        actions={
          <>
            {isStaff && (
              <div className="flex items-center rounded-xl bg-slate-100 p-0.5 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg p-1.5 text-xs cursor-pointer transition ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="Grid layout"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`rounded-lg p-1.5 text-xs cursor-pointer transition ${
                    viewMode === 'table'
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="Table layout"
                >
                  <TableIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            {canWrite && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleOpenCreate}
                className="shrink-0"
              >
                Add Service
              </Button>
            )}
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Category Filter */}
          <FilterGroup label="Service Practice" count={categoryTabs.length}>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {categoryTabs.map((tab) => (
                <FilterPill
                  key={tab.id}
                  label={tab.label}
                  isSelected={selectedCategory === tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                />
              ))}
            </div>
          </FilterGroup>

          {/* Pricing Model Filter */}
          <FilterGroup label="Engagement & Pricing">
            <FilterSelect
              value={pricingTier}
              onChange={(e) => setPricingTier(e.target.value)}
              options={[
                { value: 'all', label: 'All Pricing Models' },
                { value: 'fixed', label: 'Fixed Scope' },
                { value: 'dedicated', label: 'Dedicated Engineering Team' },
                { value: 'advisory', label: 'Advisory Retainer' },
              ]}
            />
          </FilterGroup>

          {/* Sort Order */}
          <FilterGroup label="Sort Offerings">
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'name' | 'newest')}
              options={[
                { value: 'featured', label: 'Featured Practices' },
                { value: 'name', label: 'Practice Name (A-Z)' },
                { value: 'newest', label: 'Recently Added' },
              ]}
            />
          </FilterGroup>
        </div>
      </SearchFilterBar>

      {/* Services Content Presentation */}
      {viewMode === 'table' && isStaff ? (
        <ServiceTable
          services={displayedServices}
          onEdit={handleOpenEdit}
          onDelete={(s) => setServiceToDelete(s)}
          isLoading={isLoading}
        />
      ) : (
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
                />
              ))}
            </div>
          ) : displayedServices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No service offerings found
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try selecting a different category or clearing search parameters.
              </p>
              {canWrite && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleOpenCreate}
                  className="mt-4"
                >
                  Create New Offering
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedServices.map((service) => (
                <ServiceCard
                  key={service.id || service.slug}
                  service={service}
                  onEdit={handleOpenEdit}
                  showAdminActions={canWrite}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Service Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={editingService ? 'Edit Service Offering' : 'Add Service Offering'}
        description={
          editingService
            ? `Editing "${editingService.name}"`
            : 'Configure deliverable specs, pricing model, and capabilities.'
        }
        size="lg"
      >
        <ServiceForm
          initialData={editingService}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseDrawer}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(serviceToDelete)}
        onClose={() => setServiceToDelete(null)}
        title="Delete Service Offering"
        description="Are you sure you want to delete this service offering? This cannot be undone."
      >
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            "{serviceToDelete?.name}"
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setServiceToDelete(null)}
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

export default ServicesPage;
export { ServicesPage as Component };
