import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit3, Tag } from 'lucide-react';
import { blogApi } from '../../infrastructure/blog.api';
import { blogMapper } from '../../infrastructure/blog.mapper';
import { useUpdateBlogCategory } from '../../application/use-cases/useCategoryMutations';
import { BlogCard } from '../components/BlogCard';
import { PermissionGate } from '@/core/auth/guards/PermissionGate';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

export function BlogCategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['blog', 'category', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Missing category slug');
      const res = await blogApi.getByCategorySlug(slug);
      return {
        category: blogMapper.toCategoryEntity(res.category),
        posts: (res.data || []).map((p) => blogMapper.toEntity(p)),
      };
    },
    enabled: Boolean(slug),
  });

  const updateCategoryMutation = useUpdateBlogCategory();

  // Category Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleOpenEdit = () => {
    if (data?.category) {
      setEditName(data.category.name);
      setEditDescription(data.category.description || '');
      setIsEditModalOpen(true);
    }
  };

  const handleSaveCategory = async () => {
    if (!data?.category?.id) return;
    await updateCategoryMutation.mutateAsync({
      id: data.category.id,
      dto: {
        name: editName,
        description: editDescription,
      },
    });
    setIsEditModalOpen(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-brand-500 border-t-transparent" />
        <p className="mt-3 text-sm text-slate-500">Loading category articles...</p>
      </div>
    );
  }

  if (error || !data?.category) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Category Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          We could not find the category "{slug}".
        </p>
        <div className="mt-6">
          <Link to="/blog">
            <Button variant="primary" size="sm" className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Articles</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { category, posts } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Articles</span>
        </Link>
      </div>

      {/* Category Header Hero */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-8 dark:border-slate-800 dark:bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
            <Tag className="h-3.5 w-3.5" />
            <span>Category Archive</span>
          </div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {category.description}
            </p>
          )}

          <div className="text-xs text-slate-400 font-mono">
            {posts.length} {posts.length === 1 ? 'article' : 'articles'} in this category
          </div>
        </div>

        {/* Staff Category Editor */}
        <PermissionGate permission="blog:write">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenEdit}
            className="self-start md:self-auto flex items-center gap-1.5"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Category Details</span>
          </Button>
        </PermissionGate>
      </div>

      {/* Post Grid */}
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No published articles in this category yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id || post.slug} post={post} showAdminActions={false} />
          ))}
        </div>
      )}

      {/* Category Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Category"
        description="Update category name and public description."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category Name
            </label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Category Name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Category description..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
              disabled={updateCategoryMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSaveCategory}
              isLoading={updateCategoryMutation.isPending}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BlogCategoryPage;
export { BlogCategoryPage as Component };
