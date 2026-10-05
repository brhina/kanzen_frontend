import { useState, useMemo } from 'react';
import { Plus, Search, Sparkles, Box } from 'lucide-react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useProducts } from '../../application/use-cases/useProducts';
import { useCreateProduct } from '../../application/use-cases/useCreateProduct';
import { useUpdateProduct } from '../../application/use-cases/useUpdateProduct';
import { useDeleteProduct } from '../../application/use-cases/useDeleteProduct';
import { ProductCategory } from '../../domain/enums/product-category.enum';
import type { ProductEntity } from '../../domain/entities/product.entity';
import type { CreateProductDto, UpdateProductDto } from '../../infrastructure/products.dto';
import { ProductCard } from '../components/ProductCard';
import { ProductForm } from '../components/ProductForm';
import { Drawer } from '@/shared/ui/drawer';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

const categoryTabs = [
  { id: 'all', label: 'All Products' },
  { id: ProductCategory.SAAS, label: 'SaaS Platforms' },
  { id: ProductCategory.TOOL, label: 'Developer Tools & CLIs' },
  { id: ProductCategory.LIBRARY, label: 'Open Source Libraries' },
  { id: ProductCategory.TEMPLATE, label: 'Production Templates' },
];

export function ProductsPage() {
  const { user } = useAuthStore();
  const isStaff = user?.isAdmin || (Array.isArray(user?.permissions) && user.permissions.includes('products:read'));
  const canWrite = user?.isAdmin || (Array.isArray(user?.permissions) && user.permissions.includes('products:write'));

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductEntity | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductEntity | null>(null);

  const { data, isLoading, refetch } = useProducts({
    isAdminView: isStaff,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchQuery || undefined,
  });

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const products = useMemo(() => data?.products || [], [data?.products]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (product: ProductEntity) => {
    setEditingProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async (dto: CreateProductDto | UpdateProductDto) => {
    if (editingProduct?.id) {
      await updateMutation.mutateAsync({
        id: editingProduct.id,
        dto: dto as UpdateProductDto,
      });
    } else {
      await createMutation.mutateAsync(dto as CreateProductDto);
    }
    handleCloseDrawer();
    refetch();
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete?.id) return;
    await deleteMutation.mutateAsync(productToDelete.id);
    setProductToDelete(null);
    refetch();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16 border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            <span>Proprietary Software &amp; Open Source</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
            Developer Platforms &amp; Software
          </h1>

          <p className="text-sm text-slate-300 sm:text-base leading-relaxed">
            Production tools, open-source libraries, and SaaS engines engineered internally by Kanzen to solve distributed data challenges and developer velocity bottlenecks.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
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

        {/* Right Search & Add Action */}
        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
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
              <span>Add Product</span>
            </Button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
          <Box className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600 mb-2" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No products found
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Check back soon or adjust the selected product category.
          </p>
          {canWrite && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="mt-4"
            >
              Add First Product
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id || product.slug}
              product={product}
              onEdit={handleOpenEdit}
              showAdminActions={canWrite}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Product Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        description={
          editingProduct
            ? `Editing "${editingProduct.name}"`
            : 'Configure proprietary software specifications, lifecycle status, and repositories.'
        }
        size="lg"
      >
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseDrawer}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        title="Delete Product"
        description="Are you sure you want to permanently delete this product? This action cannot be reversed."
      >
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            "{productToDelete?.name}"
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setProductToDelete(null)}
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

export default ProductsPage;
export { ProductsPage as Component };
