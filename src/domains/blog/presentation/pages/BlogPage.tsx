import { useState, useMemo } from 'react';
import { Plus, LayoutGrid, Table as TableIcon, Filter } from 'lucide-react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';
import { useBlogPosts } from '../../application/use-cases/useBlogPosts';
import { useBlogCategories } from '../../application/use-cases/useBlogCategories';
import { useFeaturedPosts } from '../../application/use-cases/useFeaturedPosts';
import { useCreateBlogPost } from '../../application/use-cases/useCreateBlogPost';
import { useUpdateBlogPost } from '../../application/use-cases/useUpdateBlogPost';
import { usePublishBlogPost } from '../../application/use-cases/usePublishBlogPost';
import { useDeleteBlogPost } from '../../application/use-cases/useDeleteBlogPost';
import { BlogPostStatus } from '../../domain/enums/blog-post-status.enum';
import type { BlogPostEntity } from '../../domain/entities/blog-post.entity';
import type { CreateBlogPostDto, UpdateBlogPostDto } from '../../infrastructure/blog.dto';
import { BlogHero } from '../components/BlogHero';
import { BlogCategoryFilter } from '../components/BlogCategoryFilter';
import { BlogCard } from '../components/BlogCard';
import { BlogTable } from '../components/BlogTable';
import { BlogSidebar } from '../components/BlogSidebar';
import { BlogPostForm } from '../components/BlogPostForm';
import { Drawer } from '@/shared/ui/drawer';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';

export function BlogPage() {
  const { user } = useAuthStore();
  const { viewMode, setViewMode } = useUIStore();

  const isStaff = user?.isAdmin || (Array.isArray(user?.permissions) && user.permissions.includes('blog:read'));
  const canWrite = user?.isAdmin || (Array.isArray(user?.permissions) && user.permissions.includes('blog:write'));

  // Local state for search & filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Drawer & modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostEntity | null>(null);
  const [postToDelete, setPostToDelete] = useState<BlogPostEntity | null>(null);

  // Queries
  const { data: blogData, isLoading, refetch } = useBlogPosts({
    isAdminView: isStaff,
    categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchQuery || undefined,
  });

  const { data: categories = [] } = useBlogCategories();
  const { data: featuredPosts = [] } = useFeaturedPosts();

  // Mutations
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const publishMutation = usePublishBlogPost();
  const deleteMutation = useDeleteBlogPost();

  const posts = useMemo(() => blogData?.posts || [], [blogData?.posts]);

  // Open drawer for creating a new post
  const handleOpenCreate = () => {
    setEditingPost(null);
    setIsDrawerOpen(true);
  };

  // Open drawer for editing an existing post
  const handleOpenEdit = (post: BlogPostEntity) => {
    setEditingPost(post);
    setIsDrawerOpen(true);
  };

  // Close drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingPost(null);
  };

  // Handle form submission (Create or Update)
  const handleFormSubmit = async (dto: CreateBlogPostDto | UpdateBlogPostDto) => {
    if (editingPost?.id) {
      await updateMutation.mutateAsync({
        id: editingPost.id,
        dto: dto as UpdateBlogPostDto,
      });
    } else {
      await createMutation.mutateAsync(dto as CreateBlogPostDto);
    }
    handleCloseDrawer();
    refetch();
  };

  // Handle toggle publication status
  const handlePublishToggle = async (post: BlogPostEntity) => {
    if (!post.id) return;
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

  // Handle deletion confirmation
  const handleConfirmDelete = async () => {
    if (!postToDelete?.id) return;
    await deleteMutation.mutateAsync(postToDelete.id);
    setPostToDelete(null);
    refetch();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Section */}
      <BlogHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalArticles={blogData?.total ?? posts.length}
      />

      {/* Staff Inline Toolbar */}
      {isStaff && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-2">
              <Filter className="h-3.5 w-3.5" />
              <span>Status</span>
            </span>

            {['all', BlogPostStatus.PUBLISHED, BlogPostStatus.DRAFT, BlogPostStatus.REVIEW, BlogPostStatus.SCHEDULED].map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition ${
                    statusFilter === st
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {st}
                </button>
              ),
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle (Grid vs Table) */}
            <div className="flex items-center rounded-lg bg-slate-200/80 p-0.5 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Grid Showcase"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Management Table"
              >
                <TableIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>

            {/* Create Article Action */}
            {canWrite && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleOpenCreate}
                className="flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>New Article</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Category Pills Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <BlogCategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        {selectedCategory !== 'all' && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setSelectedCategory('all')}
            className="text-xs text-slate-500 self-start sm:self-auto"
          >
            Clear category filter
          </Button>
        )}
      </div>

      {/* Main Content Layout */}
      {viewMode === 'table' && isStaff ? (
        <BlogTable
          posts={posts}
          onEdit={handleOpenEdit}
          onDelete={(post) => setPostToDelete(post)}
          onPublishToggle={handlePublishToggle}
          isLoading={isLoading}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Post Grid (3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-96 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
                  />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  No articles found
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try adjusting your search query or selecting a different category filter.
                </p>
                {canWrite && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleOpenCreate}
                    className="mt-4"
                  >
                    Create the First Article
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <BlogCard
                    key={post.id || post.slug}
                    post={post}
                    onEdit={handleOpenEdit}
                    showAdminActions={canWrite}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar (1 Column) */}
          <div className="lg:col-span-1">
            <BlogSidebar featuredPosts={featuredPosts} categories={categories} />
          </div>
        </div>
      )}

      {/* Slide-out Drawer for Create/Edit Article */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={editingPost ? 'Edit Blog Article' : 'Compose New Article'}
        description={
          editingPost
            ? `Editing "${editingPost.title}"`
            : 'Author high-impact engineering articles with full rich-text formatting.'
        }
        size="xl"
      >
        <BlogPostForm
          initialData={editingPost}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseDrawer}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(postToDelete)}
        onClose={() => setPostToDelete(null)}
        title="Delete Blog Article"
        description="Are you sure you want to permanently delete this article? This action cannot be undone."
      >
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            "{postToDelete?.title}"
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPostToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
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

export default BlogPage;
export { BlogPage as Component };
