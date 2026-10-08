import { useState, useMemo } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useTestimonials } from '../../application/use-cases/useTestimonials';
import { useAdminTestimonials } from '../../application/use-cases/useAdminTestimonials';
import { useFeaturedTestimonials } from '../../application/use-cases/useFeaturedTestimonials';
import { useSubmitTestimonial } from '../../application/use-cases/useSubmitTestimonial';
import { useApproveTestimonial } from '../../application/use-cases/useApproveTestimonial';
import { useRejectTestimonial } from '../../application/use-cases/useRejectTestimonial';
import { useUpdateTestimonial } from '../../application/use-cases/useUpdateTestimonial';
import { useDeleteTestimonial } from '../../application/use-cases/useDeleteTestimonial';
import type { TestimonialEntity } from '../../domain/entities/testimonial.entity';
import type { CreateTestimonialDto, UpdateTestimonialDto } from '../../infrastructure/testimonials.dto';
import { StarRating } from '../components/StarRating';
import { TestimonialCard } from '../components/TestimonialCard';
import { TestimonialCarousel } from '../components/TestimonialCarousel';
import { TestimonialForm } from '../components/TestimonialForm';
import { Button } from '@/shared/ui/button';
import {
  SearchFilterBar,
  FilterGroup,
  FilterPill,
  FilterSelect,
} from '@/shared/ui/filter';
import { Modal } from '@/shared/ui/modal';
import { Drawer } from '@/shared/ui/drawer';
import { Skeleton } from '@/shared/ui/skeleton';

export function TestimonialsPage() {
  const { user } = useAuthStore();

  const isStaff =
    user?.isAdmin ||
    (Array.isArray(user?.permissions) &&
      (user.permissions.includes('testimonials:read') ||
        user.permissions.includes('testimonials:approve')));

  const canModerate =
    user?.isAdmin ||
    (Array.isArray(user?.permissions) &&
      (user.permissions.includes('testimonials:write') ||
        user.permissions.includes('testimonials:approve')));

  // State
  const [activeTab, setActiveTab] = useState<'wall' | 'pending' | 'rejected'>('wall');
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'author'>('rating');

  // Modals & Drawers
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialEntity | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<TestimonialEntity | null>(null);

  // Queries
  const { data: publicList = [], isLoading: isLoadingPublic } = useTestimonials({
    search: searchQuery || undefined,
  });

  const { data: featuredList = [] } = useFeaturedTestimonials();

  // Admin query for all / moderation queue
  const { data: adminData, isLoading: isLoadingAdmin } = useAdminTestimonials(
    { search: searchQuery || undefined },
    isStaff,
  );

  const adminList = useMemo(() => adminData?.items || [], [adminData?.items]);

  // Mutations
  const submitMutation = useSubmitTestimonial();
  const approveMutation = useApproveTestimonial();
  const rejectMutation = useRejectTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  // Moderation counts
  const pendingCount = useMemo(() => {
    return adminList.filter((t) => t.status === 'pending').length;
  }, [adminList]);

  const rejectedCount = useMemo(() => {
    return adminList.filter((t) => t.status === 'rejected').length;
  }, [adminList]);

  // Display list depending on activeTab
  const displayItems = useMemo(() => {
    let sourceList: TestimonialEntity[] = [];

    if (isStaff && activeTab === 'pending') {
      sourceList = adminList.filter((t) => t.status === 'pending');
    } else if (isStaff && activeTab === 'rejected') {
      sourceList = adminList.filter((t) => t.status === 'rejected');
    } else {
      sourceList = isStaff ? adminList.filter((t) => t.status === 'approved') : publicList;
    }

    if (selectedRating !== 'all') {
      sourceList = sourceList.filter((t) => t.rating === selectedRating);
    }

    return sourceList;
  }, [activeTab, isStaff, adminList, publicList, selectedRating]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedRating !== 'all') count++;
    if (activeTab !== 'wall') count++;
    if (sortBy !== 'rating') count++;
    return count;
  }, [selectedRating, activeTab, sortBy]);

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
    if (selectedRating !== 'all') {
      chips.push({
        id: 'rating',
        label: `${selectedRating} Stars`,
        onRemove: () => setSelectedRating('all'),
      });
    }
    if (activeTab !== 'wall') {
      chips.push({
        id: 'tab',
        label: `Queue: ${activeTab === 'pending' ? 'Pending Review' : 'Rejected'}`,
        onRemove: () => setActiveTab('wall'),
      });
    }
    if (sortBy !== 'rating') {
      chips.push({
        id: 'sort',
        label: `Sort: ${sortBy === 'newest' ? 'Most Recent' : 'Author (A-Z)'}`,
        onRemove: () => setSortBy('rating'),
      });
    }
    return chips;
  }, [searchQuery, selectedRating, activeTab, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRating('all');
    setActiveTab('wall');
    setSortBy('rating');
  };

  // Sorted display items
  const sortedDisplayItems = useMemo(() => {
    const list = [...displayItems];
    if (sortBy === 'author') {
      list.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
    } else {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [displayItems, sortBy]);

  // Average rating
  const avgRating = useMemo(() => {
    const list = publicList.length > 0 ? publicList : adminList;
    if (list.length === 0) return 5.0;
    const sum = list.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / list.length).toFixed(1);
  }, [publicList, adminList]);

  // Handlers
  const handlePublicSubmit = async (dto: CreateTestimonialDto | UpdateTestimonialDto) => {
    await submitMutation.mutateAsync(dto as CreateTestimonialDto);
    setIsSubmitModalOpen(false);
  };

  const handleAdminSubmit = async (dto: CreateTestimonialDto | UpdateTestimonialDto) => {
    if (editingTestimonial) {
      await updateMutation.mutateAsync({ id: editingTestimonial.id, dto });
    }
    setIsEditDrawerOpen(false);
    setEditingTestimonial(null);
  };

  const handleApprove = async (t: TestimonialEntity) => {
    await approveMutation.mutateAsync(t.id);
  };

  const handleReject = async (t: TestimonialEntity) => {
    await rejectMutation.mutateAsync(t.id);
  };

  const handleEdit = (t: TestimonialEntity) => {
    setEditingTestimonial(t);
    setIsEditDrawerOpen(true);
  };

  const handleDeletePrompt = (t: TestimonialEntity) => {
    setTestimonialToDelete(t);
  };

  const handleConfirmDelete = async () => {
    if (!testimonialToDelete) return;
    await deleteMutation.mutateAsync(testimonialToDelete.id);
    setTestimonialToDelete(null);
  };

  const isLoading = isStaff ? isLoadingAdmin : isLoadingPublic;

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16 border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
              <span>Client Endorsements &amp; Proof</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
              Wall of Verified Client Love
            </h1>

            <p className="text-sm text-slate-300 sm:text-base leading-relaxed">
              Honest assessments, technical feedback, and engineering endorsements from leadership teams across the globe.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700">
              <StarRating rating={5} size="sm" />
              <span className="text-sm font-bold text-white">
                {avgRating} / 5.0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Testimonials Carousel */}
      {featuredList.length > 0 && activeTab === 'wall' && (
        <TestimonialCarousel testimonials={featuredList} />
      )}

      {/* Moderation / View Tabs (For Staff) */}
      {isStaff && (
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('wall')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'wall'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Public Wall of Love</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Pending Moderation Queue</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-amber-700">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rejected')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Rejected ({rejectedCount})</span>
          </button>
        </div>
      )}

      {/* Unified Search & Advanced Filters Bar */}
      <SearchFilterBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search reviews by client, endorsement, or company..."
        isExpanded={isFilterExpanded}
        onToggleExpanded={setIsFilterExpanded}
        activeFilterCount={activeFilterCount}
        hasActiveFilters={activeFilterCount > 0 || Boolean(searchQuery)}
        onReset={handleResetFilters}
        totalCount={publicList.length || adminList.length}
        filteredCount={sortedDisplayItems.length}
        resultsLabel="verified reviews"
        activeChips={activeChips}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-2 shadow-xs"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Submit Review</span>
          </Button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Star Rating Pills */}
          <FilterGroup label="Client Rating">
            <div className="flex flex-wrap gap-1.5 pt-1">
              <FilterPill
                label="All Ratings"
                isSelected={selectedRating === 'all'}
                onClick={() => setSelectedRating('all')}
              />
              {[5, 4, 3].map((r) => (
                <FilterPill
                  key={r}
                  label={`${r} Stars Only`}
                  isSelected={selectedRating === r}
                  onClick={() => setSelectedRating(r)}
                />
              ))}
            </div>
          </FilterGroup>

          {/* Moderation Stage (for Staff) */}
          {isStaff ? (
            <FilterGroup label="Review Moderation Queue">
              <FilterSelect
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as 'wall' | 'pending' | 'rejected')}
                options={[
                  { value: 'wall', label: 'Public Wall of Love' },
                  { value: 'pending', label: `Pending Queue (${pendingCount})` },
                  { value: 'rejected', label: `Rejected (${rejectedCount})` },
                ]}
              />
            </FilterGroup>
          ) : (
            <FilterGroup label="Verification Status">
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
                100% verified enterprise engineering feedback audited by leadership.
              </p>
            </FilterGroup>
          )}

          {/* Sort By */}
          <FilterGroup label="Sort Endorsements">
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'newest' | 'author')}
              options={[
                { value: 'rating', label: 'Highest Rated (5.0 First)' },
                { value: 'newest', label: 'Most Recent Submission' },
                { value: 'author', label: 'Author Name (A-Z)' },
              ]}
            />
          </FilterGroup>
        </div>
      </SearchFilterBar>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
            >
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-16 w-full" />
              <div className="flex items-center gap-3 pt-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sortedDisplayItems.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
          <MessageSquare className="mx-auto h-10 w-10 text-slate-400 mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {activeTab === 'pending'
              ? 'Moderation Queue Clear'
              : 'No Testimonials Found'}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {activeTab === 'pending'
              ? 'All submitted client reviews have been processed and verified.'
              : 'No testimonials currently match your filter criteria.'}
          </p>
        </div>
      )}

      {/* Grid of Testimonials */}
      {!isLoading && sortedDisplayItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDisplayItems.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              canModerate={canModerate}
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={handleEdit}
              onDelete={handleDeletePrompt}
            />
          ))}
        </div>
      )}

      {/* Public Review Submission Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Your Client Review"
      >
        <div className="p-6">
          <TestimonialForm
            onSubmit={handlePublicSubmit}
            onCancel={() => setIsSubmitModalOpen(false)}
            isLoading={submitMutation.isPending}
            isAdminMode={false}
          />
        </div>
      </Modal>

      {/* Staff Edit Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title={`Edit Review: ${editingTestimonial?.author || 'Testimonial'}`}
        size="md"
      >
        <div className="p-6">
          <TestimonialForm
            initialData={editingTestimonial}
            onSubmit={handleAdminSubmit}
            onCancel={() => setIsEditDrawerOpen(false)}
            isLoading={updateMutation.isPending}
            isAdminMode={true}
          />
        </div>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(testimonialToDelete)}
        onClose={() => setTestimonialToDelete(null)}
        title="Delete Testimonial"
      >
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to permanently delete the review by{' '}
            <strong className="text-slate-900 dark:text-white">
              "{testimonialToDelete?.author}"
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setTestimonialToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete Review
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TestimonialsPage;
export { TestimonialsPage as Component };
