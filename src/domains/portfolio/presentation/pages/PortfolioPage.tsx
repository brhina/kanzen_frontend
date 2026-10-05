import { useState, useMemo } from 'react';
import { Plus, Search, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/core/auth/auth.store';
import { usePortfolioItems } from '../../application/use-cases/usePortfolioItems';
import { useCreatePortfolioItem } from '../../application/use-cases/useCreatePortfolioItem';
import { useUpdatePortfolioItem } from '../../application/use-cases/useUpdatePortfolioItem';
import { useDeletePortfolioItem } from '../../application/use-cases/useDeletePortfolioItem';
import type { PortfolioItemEntity } from '../../domain/entities/portfolio-item.entity';
import type { CreatePortfolioDto, UpdatePortfolioDto } from '../../infrastructure/portfolio.dto';
import { PortfolioCategoryFilter } from '../components/PortfolioCategoryFilter';
import { PortfolioGrid } from '../components/PortfolioGrid';
import { PortfolioForm } from '../components/PortfolioForm';
import { Drawer } from '@/shared/ui/drawer';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 mb-3 border border-primary-200/60 dark:border-primary-800/60">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Proven Engineering Outcomes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Engineering Portfolio
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            A showcase of mission-critical systems, distributed architectures, and high-performance digital platforms engineered by Kanzen Tech.
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
              <span>Add Project</span>
            </Button>
          </div>
        )}
      </div>

      {/* Controls Bar: Filters & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <PortfolioCategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={categoryCounts}
        />

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or stack..."
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Portfolio Grid */}
      <PortfolioGrid
        items={items}
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
