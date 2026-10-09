import { useState, useMemo } from 'react';
import { Box } from 'lucide-react';
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
import { HeaderBanner } from '@/layouts/components';
import {
  SearchFilterBar,
  FilterGroup,
  FilterPill,
  FilterSelect,
} from '@/shared/ui/filter';

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
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [licenseFilter, setLicenseFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'stars' | 'name' | 'newest'>('stars');

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

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (licenseFilter !== 'all') count++;
    if (sortBy !== 'stars') count++;
    return count;
  }, [selectedCategory, licenseFilter, sortBy]);

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
    if (licenseFilter !== 'all') {
      chips.push({
        id: 'license',
        label: `License: ${licenseFilter}`,
        onRemove: () => setLicenseFilter('all'),
      });
    }
    if (sortBy !== 'stars') {
      chips.push({
        id: 'sort',
        label: `Sort: ${sortBy === 'name' ? 'Name (A-Z)' : 'Newest'}`,
        onRemove: () => setSortBy('stars'),
      });
    }
    return chips;
  }, [searchQuery, selectedCategory, licenseFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setLicenseFilter('all');
    setSortBy('stars');
  };

  // Filtered and sorted products
  const displayedProducts = useMemo(() => {
    let list = [...products];
    if (licenseFilter !== 'all') {
      list = list.filter((p) =>
        (p as any).license?.toLowerCase().includes(licenseFilter.toLowerCase()) ||
        p.techStack?.some((t) => t.toLowerCase().includes(licenseFilter.toLowerCase())),
      );
    }
    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [products, licenseFilter, sortBy]);

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
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Banner */}
      <HeaderBanner
        badge="Proprietary Software & Open Source"
        title="Developer Platforms & Software"
        description="Production tools, open-source libraries, and SaaS engines engineered internally by Kanzen to solve distributed data challenges and developer velocity bottlenecks."
      />

      {/* Unified Search & Advanced Filters Bar */}
      <SearchFilterBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search products, developer tools, libraries..."
        isExpanded={isFilterExpanded}
        onToggleExpanded={setIsFilterExpanded}
        activeFilterCount={activeFilterCount}
        hasActiveFilters={activeFilterCount > 0 || Boolean(searchQuery)}
        onReset={handleResetFilters}
        totalCount={products.length}
        filteredCount={displayedProducts.length}
        resultsLabel="software platforms"
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
              Add Product
            </Button>
          )
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Category Tabs */}
          <FilterGroup label="Product Type" count={categoryTabs.length}>
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

          {/* License Filter */}
          <FilterGroup label="License & Distribution">
            <FilterSelect
              value={licenseFilter}
              onChange={(e) => setLicenseFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Licenses' },
                { value: 'mit', label: 'MIT Open Source' },
                { value: 'apache', label: 'Apache 2.0' },
                { value: 'proprietary', label: 'Commercial Proprietary' },
              ]}
            />
          </FilterGroup>

          {/* Sort By */}
          <FilterGroup label="Sort Software">
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'stars' | 'name' | 'newest')}
              options={[
                { value: 'stars', label: 'Featured / Popular' },
                { value: 'name', label: 'Name (A-Z)' },
                { value: 'newest', label: 'Recently Published' },
              ]}
            />
          </FilterGroup>
        </div>
      </SearchFilterBar>

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
      ) : displayedProducts.length === 0 ? (
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
          {displayedProducts.map((product) => (
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
