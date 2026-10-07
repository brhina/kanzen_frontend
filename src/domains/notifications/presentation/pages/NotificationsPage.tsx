import { useState } from 'react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';
import { NotificationType, NotificationChannel } from '../../domain/enums/notification-type.enum';
import {
  useNotifications,
  useMarkAllNotificationsRead,
  useBroadcastNotification,
} from '../../application/use-cases/useNotifications';
import { useMarkNotificationRead } from '../../application/use-cases/useMarkNotificationRead';
import { NotificationList } from '../components/NotificationList';
import { NotificationBadge } from '../components/NotificationBadge';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { Pagination } from '@/shared/ui/pagination';
import { cn } from '@/shared/utils/cn';

export function NotificationsPage() {
  const { user } = useAuthStore();
  const { isEditMode } = useUIStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'system'>('all');
  const [isAdminView, setIsAdminView] = useState(false);
  const [page, setPage] = useState(1);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Broadcast form states
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastChannel, setBroadcastChannel] = useState<string>(NotificationChannel.IN_APP);
  const [broadcastType, setBroadcastType] = useState<string>(NotificationType.IN_APP);

  const canBroadcast =
    Boolean(user?.isAdmin) ||
    Boolean(user?.permissions?.some((p) => p === 'notifications:write' || p === 'notifications:admin'));

  const { data, isLoading, refetch } = useNotifications(
    {
      isUnread: activeFilter === 'unread' ? true : undefined,
      type: activeFilter === 'system' ? 'system' : undefined,
      page,
      limit: 15,
    },
    isAdminView && canBroadcast,
  );

  const markAllMutation = useMarkAllNotificationsRead();
  const markReadMutation = useMarkNotificationRead();
  const broadcastMutation = useBroadcastNotification();

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastBody.trim()) return;

    await broadcastMutation.mutateAsync({
      subject: broadcastSubject.trim() || undefined,
      body: broadcastBody.trim(),
      channel: broadcastChannel,
      type: broadcastType,
    });

    setBroadcastSubject('');
    setBroadcastBody('');
    setIsBroadcastModalOpen(false);
    refetch();
  };

  const notifications = data?.items || [];
  const unreadCount = notifications.filter((n) => n.status !== 'read').length;

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Notifications & Alerts
            </h1>
            <NotificationBadge count={unreadCount} />
            {isEditMode && (
              <Badge variant="warning" size="sm">
                Edit Mode
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            System announcements, administrative security notices, and platform updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canBroadcast && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setIsBroadcastModalOpen(true)}
            >
              Broadcast Notice
            </Button>
          )}

          {unreadCount > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Admin Feed Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveFilter('all');
              setPage(1);
            }}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
              activeFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
            )}
          >
            All Alerts
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('unread');
              setPage(1);
            }}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
              activeFilter === 'unread'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
            )}
          >
            Unread Only
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('system');
              setPage(1);
            }}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
              activeFilter === 'system'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
            )}
          >
            System Notices
          </button>
        </div>

        {canBroadcast && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Stream Source:</span>
            <button
              type="button"
              onClick={() => {
                setIsAdminView((prev) => !prev);
                setPage(1);
              }}
              className={cn(
                'rounded-lg px-2.5 py-1 font-semibold transition-colors cursor-pointer',
                isAdminView
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 ring-1 ring-purple-500/30'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
              )}
            >
              {isAdminView ? 'System-Wide Feed (Admin)' : 'My Notifications'}
            </button>
          </div>
        )}
      </div>

      {/* Notifications List Stream */}
      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        onMarkRead={(id) => markReadMutation.mutate(id)}
        onMarkAllRead={() => markAllMutation.mutate()}
        emptyMessage={
          activeFilter === 'unread'
            ? 'No unread notifications right now.'
            : 'No notifications in this feed.'
        }
      />

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            page={page}
            limit={20}
            total={data.total}
            totalPages={data.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* Admin System Broadcast Modal */}
      {isBroadcastModalOpen && (
        <Modal
          isOpen={isBroadcastModalOpen}
          onClose={() => setIsBroadcastModalOpen(false)}
          title="System Notification Broadcast"
        >
          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <p className="text-slate-500 dark:text-slate-400">
              Broadcast an immediate notification or system announcement to all active users.
            </p>

            <div>
              <label htmlFor="broadcast-subject-input" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <input
                id="broadcast-subject-input"
                type="text"
                value={broadcastSubject}
                onChange={(e) => setBroadcastSubject(e.target.value)}
                placeholder="e.g. Scheduled Maintenance Notice"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-800 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="broadcast-channel-select" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Channel
              </label>
              <select
                id="broadcast-channel-select"
                value={broadcastChannel}
                onChange={(e) => setBroadcastChannel(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-800 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value={NotificationChannel.IN_APP}>In-App Notification</option>
                <option value={NotificationChannel.EMAIL}>Email Broadcast</option>
                <option value={NotificationChannel.PUSH}>Push Notification</option>
                <option value={NotificationChannel.SMS}>SMS Dispatch</option>
              </select>
            </div>

            <div>
              <label htmlFor="broadcast-type-select" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Notification Type
              </label>
              <select
                id="broadcast-type-select"
                value={broadcastType}
                onChange={(e) => setBroadcastType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-800 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value={NotificationType.IN_APP}>Standard Alert</option>
                <option value={NotificationType.SYSTEM}>System / Operational Notice</option>
                <option value={NotificationType.EMAIL}>Transactional Email</option>
              </select>
            </div>

            <div>
              <label htmlFor="broadcast-body-input" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Message Body *
              </label>
              <textarea
                id="broadcast-body-input"
                rows={4}
                required
                value={broadcastBody}
                onChange={(e) => setBroadcastBody(e.target.value)}
                placeholder="Compose the announcement details for all recipients..."
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-800 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsBroadcastModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={broadcastMutation.isPending || !broadcastBody.trim()}
              >
                {broadcastMutation.isPending ? 'Broadcasting...' : 'Broadcast Notification'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default NotificationsPage;
export { NotificationsPage as Component };
