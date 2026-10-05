import { useState, useMemo } from 'react';
import { Plus, LayoutGrid, Table as TableIcon, Search, Sparkles } from 'lucide-react';
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
import { Input } from '@/shared/ui/input';

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16 border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
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

      {/* Control Bar: Filter Tabs & Staff Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                selectedCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Search & Staff Controls */}
        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="h-9 pl-9 text-xs"
            />
          </div>

          {isStaff && (
            <div className="flex items-center rounded-lg bg-slate-200/80 p-0.5 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`rounded-md p-1.5 text-xs ${
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
                className={`rounded-md p-1.5 text-xs ${
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
              className="flex items-center gap-1.5 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add Service</span>
            </Button>
          )}
        </div>
      </div>

      {/* Services Content Presentation */}
      {viewMode === 'table' && isStaff ? (
        <ServiceTable
          services={services}
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
          ) : services.length === 0 ? (
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
              {services.map((service) => (
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
