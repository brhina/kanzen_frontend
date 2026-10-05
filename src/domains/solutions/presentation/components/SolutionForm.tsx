import { useState, type FormEvent } from 'react';
import type { SolutionEntity } from '../../domain/entities/solution.entity';
import type { CreateSolutionDto, UpdateSolutionDto } from '../../infrastructure/solutions.dto';
import { SolutionStatus } from '../../domain/enums/solution-status.enum';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Select } from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';

export interface SolutionFormProps {
  initialData?: SolutionEntity | null;
  onSubmit: (dto: CreateSolutionDto | UpdateSolutionDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SolutionForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: SolutionFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [tagline, setTagline] = useState(initialData?.tagline || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [industriesStr, setIndustriesStr] = useState(
    (initialData?.industries || []).join(', '),
  );
  const [featuresStr, setFeaturesStr] = useState(
    (initialData?.features || []).join('\n'),
  );
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [status, setStatus] = useState<SolutionStatus>(
    (initialData?.status as SolutionStatus) || SolutionStatus.ACTIVE,
  );
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Solution name is required';
    if (!tagline.trim()) newErrors.tagline = 'Tagline is required';
    if (!description.trim()) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const industries = industriesStr
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const features = featuresStr
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const payload: CreateSolutionDto = {
      name,
      slug: slug.trim() || undefined,
      tagline,
      description,
      industries,
      features,
      coverImage: coverImage.trim() || undefined,
      status,
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
            Solution Blueprint Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Distributed Real-Time Financial Ledger"
            required
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Custom Slug (optional)
            </label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. financial-ledger-solution"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Industries (comma separated)
            </label>
            <Input
              value={industriesStr}
              onChange={(e) => setIndustriesStr(e.target.value)}
              placeholder="Fintech, Banking, Enterprise"
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
            placeholder="Ultra-low latency, double-entry immutable transaction system"
            required
          />
          {errors.tagline && <p className="text-xs text-red-500 mt-1">{errors.tagline}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Solution Overview &amp; Architecture Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed architectural breakdown, business challenges solved, and technical specifications..."
            rows={4}
            required
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Features & Architecture Elements */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Architectural Features &amp; Components (one per line)
        </label>
        <Textarea
          value={featuresStr}
          onChange={(e) => setFeaturesStr(e.target.value)}
          placeholder="Zero Data Loss Raft Consensus&#10;Sub-millisecond Transaction Ingestion&#10;Automated Regulatory Audit Trail"
          rows={4}
        />
      </div>

      {/* Visual & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Cover Diagram URL
          </label>
          <Input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://cdn.kanzen.tech/architecture/ledger.png"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Lifecycle Status
          </label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as SolutionStatus)}
            options={[
              { value: SolutionStatus.ACTIVE, label: 'Active (Showcased)' },
              { value: SolutionStatus.DRAFT, label: 'Draft' },
              { value: SolutionStatus.INACTIVE, label: 'Inactive' },
              { value: SolutionStatus.ARCHIVED, label: 'Archived' },
            ]}
          />
        </div>
      </div>

      <div className="pt-2">
        <Checkbox
          id="isFeaturedSolution"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          label="Feature in Solutions Spotlight"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Save Solution Changes' : 'Create Solution Blueprint'}
        </Button>
      </div>
    </form>
  );
}

export default SolutionForm;
