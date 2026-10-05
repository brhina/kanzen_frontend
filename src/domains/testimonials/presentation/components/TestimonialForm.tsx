import { useState, type FormEvent } from 'react';
import type { TestimonialEntity } from '../../domain/entities/testimonial.entity';
import type { CreateTestimonialDto, UpdateTestimonialDto } from '../../infrastructure/testimonials.dto';
import { TestimonialStatus, TESTIMONIAL_STATUS_LABELS } from '../../domain/enums/testimonial-status.enum';
import { StarRating } from './StarRating';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Select } from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';

export interface TestimonialFormProps {
  initialData?: TestimonialEntity | null;
  onSubmit: (dto: CreateTestimonialDto | UpdateTestimonialDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isAdminMode?: boolean;
}

export function TestimonialForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isAdminMode = false,
}: TestimonialFormProps) {
  const [author, setAuthor] = useState(initialData?.author || '');
  const [role, setRole] = useState(initialData?.role || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [companyLogo, setCompanyLogo] = useState(initialData?.companyLogo || '');
  const [avatar, setAvatar] = useState(initialData?.avatar || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [rating, setRating] = useState<number>(initialData?.rating || 5);
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');

  // Admin-only fields
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [isVerified, setIsVerified] = useState(initialData?.isVerified ?? true);
  const [status, setStatus] = useState<TestimonialStatus>(
    (initialData?.status as TestimonialStatus) || TestimonialStatus.PENDING,
  );
  const [order, setOrder] = useState<string>(
    initialData?.order !== undefined ? String(initialData.order) : '0',
  );
  const [source, setSource] = useState(initialData?.source || 'direct');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!author.trim()) newErrors.author = 'Author name is required';
    if (!content.trim()) newErrors.content = 'Review content is required';
    if (rating < 1 || rating > 5) newErrors.rating = 'Please provide a rating between 1 and 5';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isAdminMode) {
      const payload: UpdateTestimonialDto = {
        author: author.trim(),
        role: role.trim() || undefined,
        company: company.trim() || undefined,
        companyLogo: companyLogo.trim() || undefined,
        avatar: avatar.trim() || undefined,
        content: content.trim(),
        rating,
        videoUrl: videoUrl.trim() || undefined,
        isFeatured,
        isVerified,
        status,
        order: parseInt(order, 10) || 0,
        source: source.trim() || undefined,
      };
      onSubmit(payload);
    } else {
      const payload: CreateTestimonialDto = {
        author: author.trim(),
        role: role.trim() || undefined,
        company: company.trim() || undefined,
        companyLogo: companyLogo.trim() || undefined,
        avatar: avatar.trim() || undefined,
        content: content.trim(),
        rating,
        videoUrl: videoUrl.trim() || undefined,
        source: 'direct',
      };
      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Interactive Rating */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Your Rating *
        </label>
        <div className="flex items-center gap-3">
          <StarRating
            rating={rating}
            interactive
            size="lg"
            onChange={(r) => setRating(r)}
          />
          <span className="text-sm font-bold text-amber-500">
            {rating} of 5 Stars
          </span>
        </div>
        {errors.rating && <p className="text-xs text-rose-500 mt-1">{errors.rating}</p>}
      </div>

      {/* Review Content */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Review / Endorsement *
        </label>
        <Textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience working with Kanzen Tech's engineering teams..."
          error={errors.content}
        />
      </div>

      {/* Author & Professional Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Your Full Name *
          </label>
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. David Sterling"
            error={errors.author}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Job Title / Role
          </label>
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Chief Technology Officer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Company / Organization
          </label>
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. PaySwift Financial"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Company Logo URL
          </label>
          <Input
            value={companyLogo}
            onChange={(e) => setCompanyLogo(e.target.value)}
            placeholder="https://.../logo.svg"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Avatar Image URL
          </label>
          <Input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Video Review Link (Optional)
        </label>
        <Input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      {/* Admin specific controls */}
      {isAdminMode && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Moderation & Placement Settings
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Moderation Status
              </label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as TestimonialStatus)}
                options={Object.values(TestimonialStatus).map((st) => ({
                  value: st,
                  label: TESTIMONIAL_STATUS_LABELS[st],
                }))}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Display Order
              </label>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Review Source
              </label>
              <Input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="direct, clutch, linkedin"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <Checkbox
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
              />
              <span>Mark as Verified Client</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <Checkbox
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              <span>Feature in Top Carousel</span>
            </label>
          </div>
        </div>
      )}

      {/* Feedback notice for public mode */}
      {!isAdminMode && (
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          Your review will be verified by our engineering leadership before appearing publicly on the Wall of Love. Thank you for your partnership!
        </div>
      )}

      {/* Form Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {isAdminMode
            ? initialData
              ? 'Update Testimonial'
              : 'Save Testimonial'
            : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}
