import { useState, type FormEvent } from 'react';
import type { ServiceEntity } from '../../domain/entities/service.entity';
import type { CreateServiceDto, UpdateServiceDto } from '../../infrastructure/services.dto';
import { ServiceCategory } from '../../domain/enums/service-category.enum';
import { PricingModel } from '../../domain/enums/pricing-model.enum';
import { ServiceItemStatus } from '../../domain/enums/service-status.enum';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Select } from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';

export interface ServiceFormProps {
  initialData?: ServiceEntity | null;
  onSubmit: (dto: CreateServiceDto | UpdateServiceDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ServiceForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ServiceFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [tagline, setTagline] = useState(initialData?.tagline || '');
  const [category, setCategory] = useState<ServiceCategory>(
    (initialData?.category as ServiceCategory) || ServiceCategory.CUSTOM_SOFTWARE,
  );
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || '',
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [featuresStr, setFeaturesStr] = useState(
    (initialData?.features || []).join('\n'),
  );
  const [deliverablesStr, setDeliverablesStr] = useState(
    (initialData?.deliverables || []).join('\n'),
  );
  const [technologiesStr, setTechnologiesStr] = useState(
    (initialData?.technologies || []).join(', '),
  );
  const [startingPrice, setStartingPrice] = useState<string>(
    initialData?.startingPrice !== undefined ? String(initialData.startingPrice) : '',
  );
  const [pricingModel, setPricingModel] = useState<PricingModel | ''>(
    (initialData?.pricingModel as PricingModel) || PricingModel.FIXED,
  );
  const [estimatedTimeline, setEstimatedTimeline] = useState(
    initialData?.estimatedTimeline || '',
  );
  const [status, setStatus] = useState<ServiceItemStatus>(
    (initialData?.status as ServiceItemStatus) || ServiceItemStatus.ACTIVE,
  );
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Service name is required';
    if (!tagline.trim()) newErrors.tagline = 'Tagline is required';
    if (!shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!description.trim()) newErrors.description = 'Detailed description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const features = featuresStr
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const deliverables = deliverablesStr
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    const technologies = technologiesStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: CreateServiceDto = {
      name,
      slug: slug.trim() || undefined,
      tagline,
      category,
      shortDescription,
      description,
      features,
      deliverables,
      technologies,
      startingPrice: startingPrice ? Number(startingPrice) : undefined,
      pricingModel: pricingModel || undefined,
      estimatedTimeline: estimatedTimeline.trim() || undefined,
      status,
      isFeatured,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Service Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Enterprise Cloud Migration & Architecture"
            required
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              options={[
                { value: ServiceCategory.CUSTOM_SOFTWARE, label: 'Custom Software' },
                { value: ServiceCategory.SAAS, label: 'SaaS Engineering' },
                { value: ServiceCategory.WEB_APP, label: 'Web Applications' },
                { value: ServiceCategory.MOBILE, label: 'Mobile Engineering' },
                { value: ServiceCategory.AI, label: 'AI & Machine Learning' },
                { value: ServiceCategory.CLOUD, label: 'Cloud & Infrastructure' },
                { value: ServiceCategory.DESIGN, label: 'UI/UX Design' },
                { value: ServiceCategory.CONSULTING, label: 'Technical Consulting' },
                { value: ServiceCategory.MAINTENANCE, label: 'Maintenance & SRE' },
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
              placeholder="e.g. enterprise-cloud-migration"
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
            placeholder="High-velocity cloud migrations with zero downtime guarantees"
            required
          />
          {errors.tagline && <p className="text-xs text-red-500 mt-1">{errors.tagline}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Short Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Concise 1-2 sentence overview shown in cards and summaries..."
            rows={2}
            required
          />
          {errors.shortDescription && (
            <p className="text-xs text-red-500 mt-1">{errors.shortDescription}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Full Detailed Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Comprehensive description of engineering capabilities, approach, and methodologies..."
            rows={4}
            required
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Scope: Features & Deliverables */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Scope &amp; Deliverables
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Key Features (one per line)
            </label>
            <Textarea
              value={featuresStr}
              onChange={(e) => setFeaturesStr(e.target.value)}
              placeholder="Microservices Deconstruction&#10;Kubernetes Deployment&#10;Zero Downtime Cutover"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deliverables (one per line)
            </label>
            <Textarea
              value={deliverablesStr}
              onChange={(e) => setDeliverablesStr(e.target.value)}
              placeholder="Production Infrastructure Code&#10;Architecture Blueprint&#10;Runbooks &amp; Observability Dashboards"
              rows={4}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Technologies &amp; Tools (comma separated)
          </label>
          <Input
            value={technologiesStr}
            onChange={(e) => setTechnologiesStr(e.target.value)}
            placeholder="AWS, Terraform, Docker, Kubernetes, Prometheus"
          />
        </div>
      </div>

      {/* Commercials & Pricing */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Starting Price ($)
          </label>
          <Input
            type="number"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            placeholder="5000"
            min={0}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Pricing Model
          </label>
          <Select
            value={pricingModel}
            onChange={(e) => setPricingModel(e.target.value as PricingModel)}
            options={[
              { value: PricingModel.FIXED, label: 'Fixed Price' },
              { value: PricingModel.HOURLY, label: 'Hourly Rate' },
              { value: PricingModel.RETAINER, label: 'Monthly Retainer' },
              { value: PricingModel.CUSTOM, label: 'Custom Quote' },
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Estimated Timeline
          </label>
          <Input
            value={estimatedTimeline}
            onChange={(e) => setEstimatedTimeline(e.target.value)}
            placeholder="e.g. 4-8 weeks"
          />
        </div>
      </div>

      {/* Lifecycle & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-slate-50/60 p-4 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Service Status
          </label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as ServiceItemStatus)}
            options={[
              { value: ServiceItemStatus.ACTIVE, label: 'Active (Live)' },
              { value: ServiceItemStatus.DRAFT, label: 'Draft' },
              { value: ServiceItemStatus.INACTIVE, label: 'Inactive' },
              { value: ServiceItemStatus.ARCHIVED, label: 'Archived' },
            ]}
          />
        </div>

        <div className="pt-4">
          <Checkbox
            id="isFeaturedService"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            label="Feature on Homepage / Offerings Spotlight"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Save Offering Changes' : 'Create Service Offering'}
        </Button>
      </div>
    </form>
  );
}

export default ServiceForm;
