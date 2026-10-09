import { useState, useMemo } from 'react';
import { useNewsletterSubscribers } from '../../application/use-cases/useNewsletterSubscribers';
import { useUpdateSubscriber } from '../../application/use-cases/useUpdateSubscriber';
import { useDeleteSubscriber } from '../../application/use-cases/useDeleteSubscriber';
import { useExportSubscribers } from '../../application/use-cases/useExportSubscribers';
import { NewsletterSubscriberStatus } from '../../domain/enums/newsletter-status.enum';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import {
  SearchFilterBar,
  FilterGroup,
  FilterPill,
  FilterSelect,
} from '@/shared/ui/filter';
import {
  Download,
  Mail,
  CheckCircle,
  XCircle,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Inbox,
  UserCheck,
  UserX,
} from 'lucide-react';

const STATUS_TABS = [
  { id: 'all', label: 'All Subscribers' },
  { id: NewsletterSubscriberStatus.ACTIVE, label: 'Active' },
  { id: NewsletterSubscriberStatus.PENDING, label: 'Pending' },
  { id: NewsletterSubscriberStatus.UNSUBSCRIBED, label: 'Unsubscribed' },
];

export function SubscriberTable() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'email'>('newest');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const updateSubscriber = useUpdateSubscriber();
  const deleteSubscriber = useDeleteSubscriber();
  const { exportCsv, isExporting } = useExportSubscribers();

  const { data, isLoading } = useNewsletterSubscribers({
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    search: searchTerm || undefined,
    page: currentPage,
    limit: 15,
  });

  const subscribers = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleToggleStatus = async (id?: string, currentStatus?: NewsletterSubscriberStatus) => {
    if (!id) return;
    const nextStatus =
      currentStatus === NewsletterSubscriberStatus.ACTIVE
        ? NewsletterSubscriberStatus.UNSUBSCRIBED
        : NewsletterSubscriberStatus.ACTIVE;

    await updateSubscriber.mutateAsync({
      id,
      data: { status: nextStatus },
    });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to remove this subscriber permanently?')) {
      await deleteSubscriber.mutateAsync(id);
    }
  };

  const renderStatusBadge = (status: NewsletterSubscriberStatus) => {
    switch (status) {
      case NewsletterSubscriberStatus.ACTIVE:
        return <Badge variant="success" size="sm">Active</Badge>;
      case NewsletterSubscriberStatus.PENDING:
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case NewsletterSubscriberStatus.UNSUBSCRIBED:
        return <Badge variant="neutral" size="sm">Unsubscribed</Badge>;
      case NewsletterSubscriberStatus.BOUNCED:
        return <Badge variant="danger" size="sm">Bounced</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (sourceFilter !== 'all') count++;
    if (sortBy !== 'newest') count++;
    return count;
  }, [selectedStatus, sourceFilter, sortBy]);

  // Active filter chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (searchTerm) {
      chips.push({
        id: 'search',
        label: `Search: "${searchTerm}"`,
        onRemove: () => setSearchTerm(''),
      });
    }
    if (selectedStatus !== 'all') {
      const tab = STATUS_TABS.find((t) => t.id === selectedStatus);
      chips.push({
        id: 'status',
        label: `Status: ${tab?.label || selectedStatus}`,
        onRemove: () => setSelectedStatus('all'),
      });
    }
    if (sourceFilter !== 'all') {
      chips.push({
        id: 'source',
        label: `Source: ${sourceFilter.charAt(0).toUpperCase() + sourceFilter.slice(1)}`,
        onRemove: () => setSourceFilter('all'),
      });
    }
    if (sortBy !== 'newest') {
      chips.push({
        id: 'sort',
        label: 'Sort: Email (A-Z)',
        onRemove: () => setSortBy('newest'),
      });
    }
    return chips;
  }, [searchTerm, selectedStatus, sourceFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSourceFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const displayedSubscribers = useMemo(() => {
    let list = [...subscribers];
    if (sourceFilter !== 'all') {
      list = list.filter((s) => s.source?.toLowerCase() === sourceFilter.toLowerCase());
    }
    if (sortBy === 'email') {
      list.sort((a, b) => a.email.localeCompare(b.email));
    }
    return list;
  }, [subscribers, sourceFilter, sortBy]);

  return (
    <div className="space-y-4">
      {/* Search, Filter, and Export Controls */}
      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search subscriber email..."
        isFilterExpanded={isFilterExpanded}
        onToggleFilter={() => setIsFilterExpanded((prev) => !prev)}
        activeFilterCount={activeFilterCount}
        activeChips={activeChips}
        onClearAllFilters={handleResetFilters}
        resultsSummary={
          <span className="text-xs text-slate-500 font-medium">
            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{displayedSubscribers.length}</span> of {total} subscribers
          </span>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            isLoading={isExporting}
            className="flex items-center gap-1.5 h-10 px-3.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <FilterGroup label="Subscriber Status" count={selectedStatus !== 'all' ? 1 : undefined}>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_TABS.map((tab) => (
                <FilterPill
                  key={tab.id}
                  label={tab.label}
                  isActive={selectedStatus === tab.id}
                  onClick={() => {
                    setSelectedStatus(tab.id);
                    setCurrentPage(1);
                  }}
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Acquisition Source" count={sourceFilter !== 'all' ? 1 : undefined}>
            <FilterSelect
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Sources' },
                { value: 'homepage', label: 'Homepage Signup' },
                { value: 'blog', label: 'Blog Article Signup' },
                { value: 'footer', label: 'Footer Newsletter' },
                { value: 'modal', label: 'Interactive Modal' },
              ]}
            />
          </FilterGroup>

          <FilterGroup label="Sort Order" count={sortBy !== 'newest' ? 1 : undefined}>
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'email')}
              options={[
                { value: 'newest', label: 'Newest Subscribers First' },
                { value: 'email', label: 'Email (A to Z)' },
              ]}
            />
          </FilterGroup>
        </div>
      </SearchFilterBar>

      {/* Main Subscribers Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Subscriber</th>
                <th className="py-3 px-4">Acquisition Source</th>
                <th className="py-3 px-4">Interests / Tags</th>
                <th className="py-3 px-4">Opt-In Status</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Loading subscriber records...
                  </td>
                </tr>
              ) : displayedSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 space-y-2">
                    <Inbox className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      No subscribers found in this view.
                    </p>
                  </td>
                </tr>
              ) : (
                displayedSubscribers.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Subscriber */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {item.email}
                      </div>
                      {item.firstName && (
                        <div className="text-xs text-slate-500 mt-0.5">
                          {item.firstName}
                        </div>
                      )}
                    </td>

                    {/* Source */}
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-600 dark:text-slate-300 capitalize">
                      {item.source}
                    </td>

                    {/* Tags */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {item.tags.length > 0 ? (
                          item.tags.map((tag) => (
                            <Badge key={tag} variant="neutral" size="sm">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">None</span>
                        )}
                      </div>
                    </td>

                    {/* Opt-In */}
                    <td className="py-3.5 px-4 text-xs">
                      {item.isConfirmed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Unconfirmed
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(item.status)}
                    </td>

                    {/* Joined */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleStatus(item.id, item.status)}
                          isLoading={updateSubscriber.isPending}
                          title={item.status === NewsletterSubscriberStatus.ACTIVE ? 'Unsubscribe' : 'Reactivate'}
                          className="h-8 w-8 p-0"
                        >
                          {item.status === NewsletterSubscriberStatus.ACTIVE ? (
                            <UserX className="w-4 h-4 text-amber-600" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                          title="Remove subscriber"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {displayedSubscribers.length} of {total} subscribers
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 px-2"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 px-2"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
