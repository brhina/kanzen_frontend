import { useState, type FormEvent } from 'react';
import type { CaseStudyEntity, CaseStudyMetric } from '../../domain/entities/case-study.entity';
import type { CreateCaseStudyDto, UpdateCaseStudyDto } from '../../infrastructure/case-studies.dto';
import { CaseStudyStatus, CASE_STUDY_STATUS_LABELS } from '../../domain/enums/case-study-status.enum';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Select } from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';

export interface CaseStudyFormProps {
  initialData?: CaseStudyEntity | null;
  onSubmit: (dto: CreateCaseStudyDto | UpdateCaseStudyDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CaseStudyForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: CaseStudyFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [client, setClient] = useState(initialData?.client || '');
  const [clientIndustry, setClientIndustry] = useState(initialData?.clientIndustry || '');
  const [clientSize, setClientSize] = useState(initialData?.clientSize || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [challenge, setChallenge] = useState(initialData?.challenge || '');
  const [approach, setApproach] = useState(initialData?.approach || '');
  const [solution, setSolution] = useState(initialData?.solution || '');
  const [results, setResults] = useState(initialData?.results || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [imagesStr, setImagesStr] = useState((initialData?.images || []).join('\n'));
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
  const [technologiesStr, setTechnologiesStr] = useState(
    (initialData?.technologies || []).join(', '),
  );
  const [servicesUsedStr, setServicesUsedStr] = useState(
    (initialData?.servicesUsed || []).join(', '),
  );
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [teamSize, setTeamSize] = useState<string>(
    initialData?.teamSize !== undefined ? String(initialData.teamSize) : '',
  );
  const [downloadable, setDownloadable] = useState(initialData?.downloadable || false);
  const [pdfUrl, setPdfUrl] = useState(initialData?.pdfUrl || '');
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [status, setStatus] = useState<CaseStudyStatus>(
    (initialData?.status as CaseStudyStatus) || CaseStudyStatus.DRAFT,
  );

  // Dynamic metrics state
  const [metrics, setMetrics] = useState<CaseStudyMetric[]>(
    initialData?.metrics && initialData.metrics.length > 0
      ? initialData.metrics
      : [
          { label: 'Throughput', value: '12,000 TPS', description: 'Peak transaction volume' },
          { label: 'Latency', value: '< 40ms', description: 'p99 ledger settlement' },
        ],
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddMetric = () => {
    setMetrics([...metrics, { label: '', value: '', description: '' }]);
  };

  const handleUpdateMetric = (index: number, field: keyof CaseStudyMetric, val: string) => {
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

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!client.trim()) newErrors.client = 'Client name is required';
    if (!clientIndustry.trim()) newErrors.clientIndustry = 'Client industry is required';
    if (!summary.trim()) newErrors.summary = 'Summary is required';
    if (!challenge.trim()) newErrors.challenge = 'Challenge description is required';
    if (!approach.trim()) newErrors.approach = 'Approach description is required';
    if (!solution.trim()) newErrors.solution = 'Solution description is required';
    if (!results.trim()) newErrors.results = 'Results description is required';
    if (!coverImage.trim()) newErrors.coverImage = 'Cover image URL is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: CreateCaseStudyDto = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      client: client.trim(),
      clientIndustry: clientIndustry.trim(),
      clientSize: clientSize.trim() || undefined,
      summary: summary.trim(),
      challenge: challenge.trim(),
      approach: approach.trim(),
      solution: solution.trim(),
      results: results.trim(),
      coverImage: coverImage.trim(),
      images: imagesStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      videoUrl: videoUrl.trim() || undefined,
      technologies: technologiesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      servicesUsed: servicesUsedStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      duration: duration.trim() || undefined,
      teamSize: teamSize ? parseInt(teamSize, 10) : undefined,
      downloadable,
      pdfUrl: pdfUrl.trim() || undefined,
      isFeatured,
      status,
      metrics: metrics.filter((m) => m.label.trim() && m.value.trim()),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client & Scope */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Enterprise Client & Scope
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Case Study Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Instant-Settlement Banking Engine Transformation"
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Client Name *
            </label>
            <Input
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="e.g. PaySwift Financial"
              error={errors.client}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Client Industry *
            </label>
            <Input
              value={clientIndustry}
              onChange={(e) => setClientIndustry(e.target.value)}
              placeholder="e.g. FinTech, Healthcare, Logistics"
              error={errors.clientIndustry}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Client Scale / Size
            </label>
            <Input
              value={clientSize}
              onChange={(e) => setClientSize(e.target.value)}
              placeholder="e.g. Series B (180 employees)"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Executive Summary *
          </label>
          <Textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="High-level narrative of the client engagement and architectural victory..."
            error={errors.summary}
          />
        </div>
      </div>

      {/* Engineering Deep-Dive Narrative */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Technical Narrative
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            The Bottleneck & Challenge *
          </label>
          <Textarea
            rows={3}
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            placeholder="Explain the technical constraints, legacy architecture, or failure modes..."
            error={errors.challenge}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Strategic Approach & Methodology *
          </label>
          <Textarea
            rows={2}
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
            placeholder="How we structured sprints, automated integration testing, and migrated live data..."
            error={errors.approach}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            The Architectural Solution *
          </label>
          <Textarea
            rows={3}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Detailed distributed design, data pipelines, caching layers, and microservices..."
            error={errors.solution}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Verified Outcomes & Results *
          </label>
          <Textarea
            rows={3}
            value={results}
            onChange={(e) => setResults(e.target.value)}
            placeholder="Quantified business results, latency drops, throughput leaps..."
            error={errors.results}
          />
        </div>
      </div>

      {/* Dynamic Measurable Metrics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
            Outcome Metrics & Proof Points
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddMetric}
            className="flex items-center gap-1 text-xs"
          >
            <Plus className="h-3 w-3" />
            <span>Add Metric</span>
          </Button>
        </div>

        <div className="space-y-3">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
            >
              <div className="w-40">
                <Input
                  value={m.label}
                  onChange={(e) => handleUpdateMetric(idx, 'label', e.target.value)}
                  placeholder="Metric (e.g. Latency)"
                />
              </div>
              <div className="w-32">
                <Input
                  value={m.value}
                  onChange={(e) => handleUpdateMetric(idx, 'value', e.target.value)}
                  placeholder="Value (e.g. < 40ms)"
                />
              </div>
              <div className="flex-1">
                <Input
                  value={m.description || ''}
                  onChange={(e) => handleUpdateMetric(idx, 'description', e.target.value)}
                  placeholder="Short context (e.g. p99 settlement)"
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

      {/* Stack & Project Parameters */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Technologies & Deliverable Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Technologies (comma-separated)
            </label>
            <Input
              value={technologiesStr}
              onChange={(e) => setTechnologiesStr(e.target.value)}
              placeholder="Go, TypeScript, PostgreSQL, Redis, Docker"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Services Used (comma-separated)
            </label>
            <Input
              value={servicesUsedStr}
              onChange={(e) => setServicesUsedStr(e.target.value)}
              placeholder="Custom Software, Cloud Architecture, AI"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Duration
            </label>
            <Input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 8 months"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Team Size
            </label>
            <Input
              type="number"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              placeholder="e.g. 6"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Status *
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as CaseStudyStatus)}
              options={Object.values(CaseStudyStatus).map((st) => ({
                value: st,
                label: CASE_STUDY_STATUS_LABELS[st],
              }))}
            />
          </div>
        </div>
      </div>

      {/* Media & Whitepaper PDF */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Media & Whitepaper PDF
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Whitepaper PDF URL
            </label>
            <Input
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="https://downloads.kanzen.tech/case-studies/study.pdf"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Video Walkthrough URL
            </label>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Supporting Architecture Diagrams / Images (one per line)
          </label>
          <Textarea
            rows={2}
            value={imagesStr}
            onChange={(e) => setImagesStr(e.target.value)}
            placeholder="https://images.kanzen.tech/diagram1.png&#10;https://images.kanzen.tech/diagram2.png"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap items-center gap-6 pt-2">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          <Checkbox
            checked={downloadable}
            onChange={(e) => setDownloadable(e.target.checked)}
          />
          <span>Enable Whitepaper PDF Download</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          <Checkbox
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <span>Featured Spotlight on Homepage & Case Studies Feed</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Update Case Study' : 'Create Case Study'}
        </Button>
      </div>
    </form>
  );
}
