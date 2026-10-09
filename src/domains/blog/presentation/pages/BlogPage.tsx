import { useState, useMemo } from 'react';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';
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
import { BlogCard } from '../components/BlogCard';
import { BlogTable } from '../components/BlogTable';
import { BlogSidebar } from '../components/BlogSidebar';
import { BlogPostForm } from '../components/BlogPostForm';
import { Drawer } from '@/shared/ui/drawer';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import {
  SearchFilterBar,
  FilterGroup,
  FilterPill,
  FilterSelect,
} from '@/shared/ui/filter';

export function BlogPage() {
  const { user } = useAuthStore();
  const { viewMode, setViewMode } = useUIStore();

  const isStaff = user?.isAdmin || (Array.isArray(user?.permissions) && user.permissions.includes('blog:read'));
  const canWrite = user?.isAdmin || (Array.isArray(user?.permissions) && user.permissions.includes('blog:write'));

  // Local state for search & filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  // Advanced filter expanded state & active chips
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Queries
  const { data: categories = [] } = useBlogCategories();
  const { data: featuredPosts = [] } = useFeaturedPosts();
  const { data: blogData, isLoading, refetch } = useBlogPosts({
    isAdminView: isStaff,
    categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
    status: statusFilter !== 'all' ? (statusFilter as BlogPostStatus) : undefined,
    search: searchQuery || undefined,
  });

  const posts = useMemo(() => blogData?.posts || [], [blogData?.posts]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (statusFilter !== 'all') count++;
    if (sortBy !== 'newest') count++;
    return count;
  }, [selectedCategory, statusFilter, sortBy]);

  // Active filter chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (searchQuery) {
      chips.push({
        id: 'search',
        label: `Search: "${searchQuery}"`,
        onRemove: () => setSearchQuery(''),
      });
    }
    if (selectedCategory !== 'all') {
      const catObj = categories.find((c) => c.id === selectedCategory || c.slug === selectedCategory);
      chips.push({
        id: 'category',
        label: `Category: ${catObj?.name || selectedCategory}`,
        onRemove: () => setSelectedCategory('all'),
      });
    }
    if (statusFilter !== 'all') {
      chips.push({
        id: 'status',
        label: `Status: ${statusFilter}`,
        onRemove: () => setStatusFilter('all'),
      });
    }
    if (sortBy !== 'newest') {
      chips.push({
        id: 'sort',
        label: `Sort: ${sortBy === 'oldest' ? 'Oldest First' : 'Title A-Z'}`,
        onRemove: () => setSortBy('newest'),
      });
    }
    return chips;
  }, [searchQuery, selectedCategory, categories, statusFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setStatusFilter('all');
    setSortBy('newest');
  };

  // Sort posts if needed
  const sortedPosts = useMemo(() => {
    const list = [...posts];
    if (sortBy === 'oldest') {
      list.reverse();
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [posts, sortBy]);

  // Drawer & modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostEntity | null>(null);
  const [postToDelete, setPostToDelete] = useState<BlogPostEntity | null>(null);

  // Mutations
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const publishMutation = usePublishBlogPost();
  const deleteMutation = useDeleteBlogPost();

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
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Section */}
      <BlogHero
        totalArticles={blogData?.total ?? posts.length}
      />

      {/* Unified Search & Advanced Filters Bar */}
      <SearchFilterBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Filter articles by title, topic, or tags..."
        isExpanded={isFilterExpanded}
        onToggleExpanded={setIsFilterExpanded}
        activeFilterCount={activeFilterCount}
        hasActiveFilters={activeFilterCount > 0 || Boolean(searchQuery)}
        onReset={handleResetFilters}
        totalCount={blogData?.total ?? posts.length}
        filteredCount={sortedPosts.length}
        resultsLabel="articles"
        activeChips={activeChips}
        actions={
          <>
            {/* View Mode Toggle (Grid vs Table) */}
            {isStaff && (
              <div className="flex items-center rounded-xl bg-slate-100 p-0.5 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer transition ${
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
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer transition ${
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
            )}

            {/* Create Article Action */}
            {canWrite && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleOpenCreate}
              >
                New Article
              </Button>
            )}
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories */}
          <FilterGroup label="Categories" count={categories.length + 1}>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <FilterPill
                label="All Categories"
                isSelected={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
              />
              {categories.map((cat) => (
                <FilterPill
                  key={cat.id || cat.slug}
                  label={cat.name}
                  isSelected={selectedCategory === cat.id || selectedCategory === cat.slug}
                  onClick={() => setSelectedCategory(cat.id || cat.slug)}
                />
              ))}
            </div>
          </FilterGroup>

          {/* Status Filter (for staff) or Topic highlight */}
          {isStaff ? (
            <FilterGroup label="Publication Status" count={5}>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { id: 'all', label: 'All Statuses' },
                  { id: BlogPostStatus.PUBLISHED, label: 'Published' },
                  { id: BlogPostStatus.DRAFT, label: 'Draft' },
                  { id: BlogPostStatus.REVIEW, label: 'In Review' },
                  { id: BlogPostStatus.SCHEDULED, label: 'Scheduled' },
                ].map((st) => (
                  <FilterPill
                    key={st.id}
                    label={st.label}
                    isSelected={statusFilter === st.id}
                    onClick={() => setStatusFilter(st.id)}
                  />
                ))}
              </div>
            </FilterGroup>
          ) : (
            <FilterGroup label="Reading Experience">
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                Filter production insights across microservices, event streaming, and cloud platforms.
              </p>
            </FilterGroup>
          )}

          {/* Sort By */}
          <FilterGroup label="Sort Articles">
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
              options={[
                { value: 'newest', label: 'Newest First (Chronological)' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'title', label: 'Title Alphabetical (A-Z)' },
              ]}
            />
          </FilterGroup>
        </div>
      </SearchFilterBar>

      {/* Main Content Layout */}
      {viewMode === 'table' && isStaff ? (
        <BlogTable
          posts={sortedPosts}
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
            ) : sortedPosts.length === 0 ? (
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
                {sortedPosts.map((post) => (
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
