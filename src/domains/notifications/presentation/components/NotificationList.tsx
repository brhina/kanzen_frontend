import type { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationItem } from './NotificationItem';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';

export interface NotificationListProps {
  notifications: NotificationEntity[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function NotificationList({
  notifications,
  onMarkRead,
  onMarkAllRead,
  isLoading = false,
  emptyMessage = 'No notifications found.',
  className = '',
}: NotificationListProps) {
  const unreadCount = notifications.filter((n) => n.status !== 'read').length;

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-800 mb-2" />
            <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800 mb-2" />
            <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center dark:border-slate-800">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {emptyMessage}
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          You're all caught up with your platform alerts.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {unreadCount > 0 && onMarkAllRead && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onMarkAllRead}
            className="h-6 px-2 text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Mark all as read
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkRead={onMarkRead}
          />
        ))}
      </div>
    </div>
  );
}
