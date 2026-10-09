import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  ExternalLink,
  Code2,
  DollarSign,
  Play,
} from 'lucide-react';
import { useProduct } from '../../application/use-cases/useProduct';
import { useUpdateProduct } from '../../application/use-cases/useUpdateProduct';
import { useDeleteProduct } from '../../application/use-cases/useDeleteProduct';
import type { UpdateProductDto } from '../../infrastructure/products.dto';
import { ProductStatusBadge } from '../components/ProductStatusBadge';
import { ProductScreenshots } from '../components/ProductScreenshots';
import { ProductForm } from '../components/ProductForm';
import { PermissionGate } from '@/core/auth/guards/PermissionGate';
import { Drawer } from '@/shared/ui/drawer';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: product, isLoading, error, refetch } = useProduct(slug);
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdate = async (dto: UpdateProductDto) => {
    if (product?.id) {
      await updateMutation.mutateAsync({ id: product.id, dto });
      setIsEditDrawerOpen(false);
      refetch();
    }
  };

  const handleDelete = async () => {
    if (!product?.id) return;
    await deleteMutation.mutateAsync(product.id);
    setIsDeleteModalOpen(false);
    navigate('/products');
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-brand-500 border-t-transparent" />
        <p className="mt-3 text-sm text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Product Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The requested software product or template could not be located.
        </p>
        <div className="mt-6">
          <Link to="/products">
            <Button variant="primary" size="sm" className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Products</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Staff Control Header */}
      <PermissionGate permission="products:write">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Staff Controls:
            </span>
            <ProductStatusBadge status={product.status} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setIsEditDrawerOpen(true)}
              className="flex items-center gap-1"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Product</span>
            </Button>

            <PermissionGate permission="products:delete">
              <Button
                type="button"
                variant="danger"
                size="xs"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </Button>
            </PermissionGate>
          </div>
        </div>
      </PermissionGate>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="sm" className="uppercase font-mono text-[10px]">
            {product.category}
          </Badge>
          <ProductStatusBadge status={product.status} />
          {product.isFeatured && (
            <Badge variant="warning" size="sm">
              Spotlight Product
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-black text-slate-900 sm:text-5xl dark:text-white">
          {product.name}
        </h1>

        <p className="text-lg font-medium text-brand-600 dark:text-brand-400 max-w-3xl">
          {product.tagline}
        </p>
      </div>

      {/* Main Grid: Left Specs & Screenshots, Right Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Product Overview &amp; Capabilities
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </section>

          {/* Interactive Screenshots */}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Interface &amp; Visual Tour
            </h2>
            <ProductScreenshots
              screenshots={product.screenshots}
              productName={product.name}
            />
          </section>

          {/* Tech Stack */}
          {product.techStack && product.techStack.length > 0 && (
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="h-5 w-5 text-brand-500" />
                <span>Architecture &amp; Core Dependencies</span>
              </h2>
              <div className="flex flex-wrap gap-2 pt-2">
                {product.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Action Summary (1 Column) */}
        <div className="space-y-6">
          <Card className="sticky top-20 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Product Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Access live instances, sandboxed interactive demos, and pricing models.
              </p>

              <div className="space-y-2 pt-2">
                {product.demoUrl && (
                  <a
                    href={product.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block"
                  >
                    <Button variant="primary" size="md" className="w-full flex items-center justify-center gap-2">
                      <Play className="h-4 w-4 fill-current" />
                      <span>Launch Interactive Demo</span>
                    </Button>
                  </a>
                )}

                {product.productUrl && (
                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block"
                  >
                    <Button variant="outline" size="md" className="w-full flex items-center justify-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <span>Visit Live Platform</span>
                    </Button>
                  </a>
                )}

                {product.pricingUrl && (
                  <a
                    href={product.pricingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block"
                  >
                    <Button variant="ghost" size="sm" className="w-full flex items-center justify-center gap-1.5 text-xs">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>View Commercial Pricing</span>
                    </Button>
                  </a>
                )}
              </div>

              <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-500 dark:text-slate-400 dark:bg-slate-800/50">
                Maintained &amp; engineered with enterprise security adherence by Kanzen Tech.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Product Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title="Edit Product"
        description={`Updating "${product.name}"`}
        size="lg"
      >
        <ProductForm
          initialData={product}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditDrawerOpen(false)}
          isLoading={updateMutation.isPending}
        />
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
        description="Are you sure you want to permanently delete this product? This action cannot be reversed."
      >
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            "{product.name}"
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleDelete}
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

export default ProductDetailPage;
export { ProductDetailPage as Component };
