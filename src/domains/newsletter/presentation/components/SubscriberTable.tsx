import { useState } from 'react';
import { useNewsletterSubscribers } from '../../application/use-cases/useNewsletterSubscribers';
import { useUpdateSubscriber } from '../../application/use-cases/useUpdateSubscriber';
import { useDeleteSubscriber } from '../../application/use-cases/useDeleteSubscriber';
import { useExportSubscribers } from '../../application/use-cases/useExportSubscribers';
import { NewsletterSubscriberStatus } from '../../domain/enums/newsletter-status.enum';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import {
  Search,
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
  { id: NewsletterSubscriberStatus.PENDING, label: 'Pending Confirmation' },
  { id: NewsletterSubscriberStatus.UNSUBSCRIBED, label: 'Unsubscribed' },
];

export function SubscriberTable() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
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

  return (
    <div className="space-y-4">
      {/* Controls & Export Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedStatus(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Export Buttons */}
        <div className="flex items-center gap-2">
          <div className="w-full md:w-64">
            <Input
              placeholder="Search subscriber email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            isLoading={isExporting}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Main Subscribers Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
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
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 space-y-2">
                    <Inbox className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      No subscribers found in this view.
                    </p>
                  </td>
                </tr>
              ) : (
                subscribers.map((item) => (
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
            Showing {subscribers.length} of {total} subscribers
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
