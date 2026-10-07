import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Edit3, Trash2, Send, Clock, ArrowLeft } from 'lucide-react';
import { useBlogPost } from '../../application/use-cases/useBlogPost';
import { useLikeBlogPost } from '../../application/use-cases/useLikeBlogPost';
import { useUpdateBlogPost } from '../../application/use-cases/useUpdateBlogPost';
import { usePublishBlogPost } from '../../application/use-cases/usePublishBlogPost';
import { useDeleteBlogPost } from '../../application/use-cases/useDeleteBlogPost';
import { BlogPostStatus } from '../../domain/enums/blog-post-status.enum';
import type { UpdateBlogPostDto } from '../../infrastructure/blog.dto';
import { BlogPostContent } from '../components/BlogPostContent';
import { BlogPostForm } from '../components/BlogPostForm';
import { PermissionGate } from '@/core/auth/guards/PermissionGate';
import { Drawer } from '@/shared/ui/drawer';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: post, isLoading, error, refetch } = useBlogPost(slug);
  const likeMutation = useLikeBlogPost();
  const updateMutation = useUpdateBlogPost();
  const publishMutation = usePublishBlogPost();
  const deleteMutation = useDeleteBlogPost();

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleLike = () => {
    if (slug) {
      likeMutation.mutate(slug);
    }
  };

  const handleUpdate = async (dto: UpdateBlogPostDto) => {
    if (post?.id) {
      await updateMutation.mutateAsync({ id: post.id, dto });
      setIsEditDrawerOpen(false);
      refetch();
    }
  };

  const handlePublishToggle = async () => {
    if (!post?.id) return;
    const nextStatus =
      post.status === BlogPostStatus.PUBLISHED
        ? BlogPostStatus.DRAFT
        : BlogPostStatus.PUBLISHED;

    await publishMutation.mutateAsync({
      id: post.id,
      dto: { status: nextStatus },
    });
    refetch();
  };

  const handleDelete = async () => {
    if (!post?.id) return;
    await deleteMutation.mutateAsync(post.id);
    setIsDeleteModalOpen(false);
    navigate('/blog');
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-brand-500 border-t-transparent" />
        <p className="mt-3 text-sm text-slate-500">Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Article Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The requested engineering article may have been unpublished or removed.
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

  const isPublished = post.status === BlogPostStatus.PUBLISHED;

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Inline Staff Control Header */}
      <PermissionGate permission="blog:write">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Staff Controls:
            </span>
            <Badge
              variant={isPublished ? 'success' : 'neutral'}
              size="sm"
              className="capitalize font-mono text-xs"
            >
              Status: {post.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <PermissionGate permission="blog:publish">
              <Button
                type="button"
                variant={isPublished ? 'outline' : 'primary'}
                size="xs"
                onClick={handlePublishToggle}
                isLoading={publishMutation.isPending}
                className="flex items-center gap-1"
              >
                {isPublished ? (
                  <>
                    <Clock className="h-3.5 w-3.5" />
                    <span>Unpublish to Draft</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Publish Immediately</span>
                  </>
                )}
              </Button>
            </PermissionGate>

            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setIsEditDrawerOpen(true)}
              className="flex items-center gap-1"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Article</span>
            </Button>

            <PermissionGate permission="blog:delete">
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

      {/* Main Article Content */}
      <BlogPostContent
        post={post}
        onLike={handleLike}
        isLiking={likeMutation.isPending}
      />

      {/* Edit Post Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title="Edit Article"
        description={`Updating "${post.title}"`}
        size="xl"
      >
        <BlogPostForm
          initialData={post}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditDrawerOpen(false)}
          isLoading={updateMutation.isPending}
        />
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Article"
        description="Are you sure you want to permanently delete this article? This action cannot be reversed."
      >
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            "{post.title}"
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

export default BlogPostPage;
export { BlogPostPage as Component };
