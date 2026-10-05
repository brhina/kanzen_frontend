import { useState, type FormEvent } from 'react';
import type { ProductEntity } from '../../domain/entities/product.entity';
import type { CreateProductDto, UpdateProductDto } from '../../infrastructure/products.dto';
import { ProductCategory } from '../../domain/enums/product-category.enum';
import { ProductStatus } from '../../domain/enums/product-status.enum';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Select } from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';

export interface ProductFormProps {
  initialData?: ProductEntity | null;
  onSubmit: (dto: CreateProductDto | UpdateProductDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [tagline, setTagline] = useState(initialData?.tagline || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState<ProductCategory>(
    (initialData?.category as ProductCategory) || ProductCategory.SAAS,
  );
  const [status, setStatus] = useState<ProductStatus>(
    (initialData?.status as ProductStatus) || ProductStatus.BETA,
  );
  const [productUrl, setProductUrl] = useState(initialData?.productUrl || '');
  const [demoUrl, setDemoUrl] = useState(initialData?.demoUrl || '');
  const [pricingUrl, setPricingUrl] = useState(initialData?.pricingUrl || '');
  const [techStackStr, setTechStackStr] = useState(
    (initialData?.techStack || []).join(', '),
  );
  const [screenshotsStr, setScreenshotsStr] = useState(
    (initialData?.screenshots || []).join('\n'),
  );
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!tagline.trim()) newErrors.tagline = 'Tagline is required';
    if (!description.trim()) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const techStack = techStackStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const screenshots = screenshotsStr
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: CreateProductDto = {
      name,
      slug: slug.trim() || undefined,
      tagline,
      description,
      category,
      status,
      productUrl: productUrl.trim() || undefined,
      demoUrl: demoUrl.trim() || undefined,
      pricingUrl: pricingUrl.trim() || undefined,
      techStack,
      screenshots,
      isFeatured,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kanzen Radar CLI"
            required
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              options={[
                { value: ProductCategory.SAAS, label: 'SaaS Platform' },
                { value: ProductCategory.TOOL, label: 'Developer Tool / CLI' },
                { value: ProductCategory.LIBRARY, label: 'Open Source Library' },
                { value: ProductCategory.TEMPLATE, label: 'Production Template' },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Custom Slug (optional)
            </label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. kanzen-radar"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Tagline <span className="text-red-500">*</span>
          </label>
          <Input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Autonomous distributed performance profiler and tracing daemon"
            required
          />
          {errors.tagline && <p className="text-xs text-red-500 mt-1">{errors.tagline}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed overview of product capabilities, architecture, and value proposition..."
            rows={4}
            required
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Demo / Interactive URL
          </label>
          <Input
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://demo.kanzen.tech"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Live Product URL
          </label>
          <Input
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            placeholder="https://radar.kanzen.tech"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Pricing URL
          </label>
          <Input
            value={pricingUrl}
            onChange={(e) => setPricingUrl(e.target.value)}
            placeholder="https://radar.kanzen.tech/pricing"
          />
        </div>
      </div>

      {/* Tech stack & screenshots */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Tech Stack (comma separated)
          </label>
          <Input
            value={techStackStr}
            onChange={(e) => setTechStackStr(e.target.value)}
            placeholder="Rust, WebAssembly, React, ClickHouse"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Screenshot URLs (one per line)
          </label>
          <Textarea
            value={screenshotsStr}
            onChange={(e) => setScreenshotsStr(e.target.value)}
            placeholder="https://cdn.kanzen.tech/products/radar-1.png&#10;https://cdn.kanzen.tech/products/radar-2.png"
            rows={3}
          />
        </div>
      </div>

      {/* Lifecycle Status & Spotlight */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-slate-50/60 p-4 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Lifecycle Status
          </label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus)}
            options={[
              { value: ProductStatus.LIVE, label: 'Live in Production' },
              { value: ProductStatus.BETA, label: 'Public Beta' },
              { value: ProductStatus.COMING_SOON, label: 'Coming Soon' },
              { value: ProductStatus.RETIRED, label: 'Retired / Archived' },
            ]}
          />
        </div>

        <div className="pt-4">
          <Checkbox
            id="isFeaturedProduct"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            label="Spotlight on Homepage"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Save Product Changes' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
