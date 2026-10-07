import { useState, type FormEvent } from 'react';
import type { PortfolioItemEntity, ProjectMetric } from '../../domain/entities/portfolio-item.entity';
import type { CreatePortfolioDto, UpdatePortfolioDto } from '../../infrastructure/portfolio.dto';
import { PortfolioCategory, PORTFOLIO_CATEGORY_LABELS } from '../../domain/enums/portfolio-category.enum';
import { PortfolioItemStatus, PORTFOLIO_STATUS_LABELS } from '../../domain/enums/portfolio-status.enum';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Select } from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Trash2 } from 'lucide-react';

export interface PortfolioFormProps {
  initialData?: PortfolioItemEntity | null;
  onSubmit: (dto: CreatePortfolioDto | UpdatePortfolioDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PortfolioForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: PortfolioFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [client, setClient] = useState(initialData?.client || '');
  const [clientLogo, setClientLogo] = useState(initialData?.clientLogo || '');
  const [category, setCategory] = useState<PortfolioCategory>(
    (initialData?.category as PortfolioCategory) || PortfolioCategory.WEB,
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [challenge, setChallenge] = useState(initialData?.challenge || '');
  const [solution, setSolution] = useState(initialData?.solution || '');
  const [results, setResults] = useState(initialData?.results || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [imagesStr, setImagesStr] = useState((initialData?.images || []).join('\n'));
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
  const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || '');
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || '');
  const [technologiesStr, setTechnologiesStr] = useState(
    (initialData?.technologies || []).join(', '),
  );
  const [servicesStr, setServicesStr] = useState(
    (initialData?.services || []).join(', '),
  );
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [teamSize, setTeamSize] = useState<string>(
    initialData?.teamSize !== undefined ? String(initialData.teamSize) : '',
  );
  const [status, setStatus] = useState<PortfolioItemStatus>(
    (initialData?.status as PortfolioItemStatus) || PortfolioItemStatus.DRAFT,
  );
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [isConfidential, setIsConfidential] = useState(initialData?.isConfidential || false);

  // Dynamic metrics state
  const [metrics, setMetrics] = useState<ProjectMetric[]>(
    initialData?.metrics && initialData.metrics.length > 0
      ? initialData.metrics
      : [
          { label: 'Throughput Increase', value: '350%', icon: 'zap' },
          { label: 'Latency Reduction', value: '92%', icon: 'bolt' },
        ],
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddMetric = () => {
    setMetrics([...metrics, { label: '', value: '', icon: 'bolt' }]);
  };

  const handleUpdateMetric = (index: number, field: keyof ProjectMetric, val: string) => {
    const updated = [...metrics];
    updated[index] = { ...updated[index], [field]: val };
    setMetrics(updated);
  };

  const handleRemoveMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Project title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!coverImage.trim()) newErrors.coverImage = 'Cover image URL is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: CreatePortfolioDto = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      subtitle: subtitle.trim() || undefined,
      client: client.trim() || undefined,
      clientLogo: clientLogo.trim() || undefined,
      category,
      description: description.trim(),
      challenge: challenge.trim() || undefined,
      solution: solution.trim() || undefined,
      results: results.trim() || undefined,
      coverImage: coverImage.trim(),
      images: imagesStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      videoUrl: videoUrl.trim() || undefined,
      liveUrl: liveUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      technologies: technologiesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      services: servicesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      duration: duration.trim() || undefined,
      teamSize: teamSize ? parseInt(teamSize, 10) : undefined,
      status,
      isFeatured,
      isConfidential,
      metrics: metrics.filter((m) => m.label.trim() && m.value.trim()),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Project Identity & Scope
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Project Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Core Banking Engine"
              error={errors.title}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              URL Slug (Optional)
            </label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="leave blank to auto-generate"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category *
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as PortfolioCategory)}
              options={Object.values(PortfolioCategory).map((cat) => ({
                value: cat,
                label: PORTFOLIO_CATEGORY_LABELS[cat],
              }))}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Status *
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as PortfolioItemStatus)}
              options={Object.values(PortfolioItemStatus).map((st) => ({
                value: st,
                label: PORTFOLIO_STATUS_LABELS[st],
              }))}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Client Name
            </label>
            <Input
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="e.g. Apex Financial Corp"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Client Logo URL
            </label>
            <Input
              value={clientLogo}
              onChange={(e) => setClientLogo(e.target.value)}
              placeholder="https://.../logo.svg"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Subtitle / Tagline
          </label>
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Real-time multi-asset wealth management dashboard"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Executive Summary / Overview *
          </label>
          <Textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="High-level engineering overview of what was built..."
            error={errors.description}
          />
        </div>
      </div>

      {/* Engineering Narrative (Challenge, Solution, Results) */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Engineering Narrative
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            The Architectural Challenge
          </label>
          <Textarea
            rows={2}
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            placeholder="Existing bottlenecks, latency issues, or scale constraints..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            The Engineering Solution
          </label>
          <Textarea
            rows={2}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Distributed architecture, consensus mechanisms, caching tiers..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Measurable Results
          </label>
          <Textarea
            rows={2}
            value={results}
            onChange={(e) => setResults(e.target.value)}
            placeholder="Operational throughput gains, latency drops, cost reductions..."
          />
        </div>
      </div>

      {/* Dynamic Key Outcome Metrics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
            Key Outcome Metrics
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddMetric}
            className="text-xs"
          >
            Add Metric
          </Button>
        </div>

        <div className="space-y-3">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex-1">
                <Input
                  value={metric.label}
                  onChange={(e) => handleUpdateMetric(idx, 'label', e.target.value)}
                  placeholder="Metric Label (e.g. Throughput)"
                />
              </div>
              <div className="w-32">
                <Input
                  value={metric.value}
                  onChange={(e) => handleUpdateMetric(idx, 'value', e.target.value)}
                  placeholder="Value (e.g. 350%)"
                />
              </div>
              <div className="w-28">
                <Select
                  value={metric.icon || 'bolt'}
                  onChange={(e) => handleUpdateMetric(idx, 'icon', e.target.value)}
                  options={[
                    { value: 'bolt', label: 'Bolt / Zap' },
                    { value: 'speed', label: 'Trending' },
                    { value: 'clock', label: 'Clock' },
                    { value: 'shield', label: 'Shield' },
                    { value: 'database', label: 'Database' },
                    { value: 'cpu', label: 'CPU' },
                  ]}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMetric(idx)}
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Remove Metric"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack & Team Scope */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Tech Stack & Project Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Technologies (comma-separated)
            </label>
            <Input
              value={technologiesStr}
              onChange={(e) => setTechnologiesStr(e.target.value)}
              placeholder="React, TypeScript, NestJS, Kafka, Redis"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Services Provided (comma-separated)
            </label>
            <Input
              value={servicesStr}
              onChange={(e) => setServicesStr(e.target.value)}
              placeholder="Cloud Architecture, Backend Engineering"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Project Duration
            </label>
            <Input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 6 months"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Engineering Team Size
            </label>
            <Input
              type="number"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              placeholder="e.g. 8"
            />
          </div>
        </div>
      </div>

      {/* Media & External Links */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Media & External Links
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Cover Image URL *
          </label>
          <Input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            error={errors.coverImage}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Gallery Images (one URL per line)
          </label>
          <Textarea
            rows={2}
            value={imagesStr}
            onChange={(e) => setImagesStr(e.target.value)}
            placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Live Application URL
            </label>
            <Input
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://apexpay.io"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Source Repository URL
            </label>
            <Input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Video Showcase URL
            </label>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        </div>
      </div>

      {/* Badges / Flags */}
      <div className="flex flex-wrap items-center gap-6 pt-2">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          <Checkbox
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <span>Featured in Homepage & Spotlights</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          <Checkbox
            checked={isConfidential}
            onChange={(e) => setIsConfidential(e.target.checked)}
          />
          <span>Confidential Project (Redacts client identity in public views)</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
