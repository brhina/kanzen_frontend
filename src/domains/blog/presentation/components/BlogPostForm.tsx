import { useState, type FormEvent } from 'react';
import type { BlogPostEntity } from '../../domain/entities/blog-post.entity';
import type { CreateBlogPostDto, UpdateBlogPostDto } from '../../infrastructure/blog.dto';
import { BlogPostStatus } from '../../domain/enums/blog-post-status.enum';
import { useBlogCategories } from '../../application/use-cases/useBlogCategories';
import { BlogEditor } from './BlogEditor';
import { SeoMetaForm } from './SeoMetaForm';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import { Select } from '@/shared/ui/select';
import { Checkbox } from '@/shared/ui/checkbox';
import type { SeoMeta } from '../../domain/value-objects/seo-meta.vo';

export interface BlogPostFormProps {
  initialData?: BlogPostEntity | null;
  onSubmit: (dto: CreateBlogPostDto | UpdateBlogPostDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BlogPostForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: BlogPostFormProps) {
  const { data: categories = [] } = useBlogCategories();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [authorName, setAuthorName] = useState(initialData?.authorName || '');
  const [authorAvatar, setAuthorAvatar] = useState(initialData?.authorAvatar || '');
  const [tagsString, setTagsString] = useState((initialData?.tags || []).join(', '));
  const [status, setStatus] = useState<BlogPostStatus>(
    (initialData?.status as BlogPostStatus) || BlogPostStatus.DRAFT,
  );
  const [scheduledAt, setScheduledAt] = useState(
    initialData?.scheduledAt ? initialData.scheduledAt.substring(0, 16) : '',
  );
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [allowComments, setAllowComments] = useState(initialData?.allowComments ?? true);
  const [seo, setSeo] = useState<SeoMeta>(initialData?.seo || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!content.trim()) newErrors.content = 'Article body content is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: CreateBlogPostDto = {
      title,
      slug: slug.trim() || undefined,
      excerpt,
      content,
      coverImage: coverImage.trim() || undefined,
      categoryId: categoryId || undefined,
      authorName: authorName.trim() || undefined,
      authorAvatar: authorAvatar.trim() || undefined,
      tags,
      status,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      isFeatured,
      allowComments,
      seo: Object.keys(seo).length > 0 ? seo : undefined,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title & Slug */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Article Title <span className="text-red-500">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!initialData && !slug) {
                // Auto slug preview
              }
            }}
            placeholder="e.g. Scaling Distributed Kafka Pipelines at Enterprise Scale"
            required
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Custom Slug (optional)
            </label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. scaling-distributed-kafka-pipelines"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={[
                { value: '', label: 'Select a Category' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Summary Excerpt <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A compelling 1-2 sentence overview shown in feeds, previews, and meta cards..."
            rows={2}
            required
          />
          {errors.excerpt && <p className="text-xs text-red-500 mt-1">{errors.excerpt}</p>}
        </div>
      </div>

      {/* Rich Article Content Editor */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          Article Body Content <span className="text-red-500">*</span>
        </label>
        <BlogEditor value={content} onChange={setContent} />
        {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
      </div>

      {/* Visual & Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Cover Image URL
          </label>
          <Input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Tags (comma separated)
          </label>
          <Input
            value={tagsString}
            onChange={(e) => setTagsString(e.target.value)}
            placeholder="Architecture, Distributed Systems, Cloud"
          />
        </div>
      </div>

      {/* Author info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Author Name
          </label>
          <Input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="e.g. Elena Rostova"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Author Avatar URL
          </label>
          <Input
            value={authorAvatar}
            onChange={(e) => setAuthorAvatar(e.target.value)}
            placeholder="https://cdn.kanzen.tech/avatars/..."
          />
        </div>
      </div>

      {/* Publication Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg bg-slate-50/60 p-4 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Lifecycle Status
          </label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as BlogPostStatus)}
            options={[
              { value: BlogPostStatus.DRAFT, label: 'Draft' },
              { value: BlogPostStatus.REVIEW, label: 'In Review' },
              { value: BlogPostStatus.SCHEDULED, label: 'Scheduled' },
              { value: BlogPostStatus.PUBLISHED, label: 'Published' },
              { value: BlogPostStatus.ARCHIVED, label: 'Archived' },
            ]}
          />
        </div>

        {status === BlogPostStatus.SCHEDULED && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Scheduled Date & Time
            </label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>
        )}

        <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-1">
          <Checkbox
            id="isFeatured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            label="Feature on Blog Hero / Homepage"
          />
          <Checkbox
            id="allowComments"
            checked={allowComments}
            onChange={(e) => setAllowComments(e.target.checked)}
            label="Enable Public Comments"
          />
        </div>
      </div>

      {/* SEO Drawer / Component */}
      <SeoMetaForm value={seo} onChange={setSeo} />

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Save Changes' : 'Create Article'}
        </Button>
      </div>
    </form>
  );
}

export default BlogPostForm;
