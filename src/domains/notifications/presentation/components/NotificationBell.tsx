import { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router';
import { Bell } from 'lucide-react';
import { QueryClientContext } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/auth.store';
import {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkAllNotificationsRead,
} from '../../application/use-cases/useNotifications';
import { useMarkNotificationRead } from '../../application/use-cases/useMarkNotificationRead';
import { NotificationItem } from './NotificationItem';
import { NotificationBadge } from './NotificationBadge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';

export interface NotificationBellProps {
  className?: string;
}

function NotificationBellConnected({ className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount = 0 } = useUnreadNotificationsCount(true);
  const { data: recentData, isLoading } = useNotifications(
    { limit: 4 },
    false,
  );

  const markAllMutation = useMarkAllNotificationsRead();
  const markReadMutation = useMarkNotificationRead();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const notifications = recentData?.items || [];

  return (
    <div ref={dropdownRef} className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
        aria-label={`View notifications. ${unreadCount} unread.`}
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 origin-top-right rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 z-50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Notifications
              </span>
              <NotificationBadge count={unreadCount} />
            </div>

            {unreadCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => markAllMutation.mutate()}
                className="h-6 px-2 text-[11px] text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                Mark all read
              </Button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto py-3 space-y-2.5">
            {isLoading ? (
              <p className="text-center text-xs text-slate-400 py-6">
                Loading notifications...
              </p>
            ) : notifications.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  No notifications yet
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  You are all caught up!
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <NotificationItem
                  key={item.id}
                  notification={item}
                  onMarkRead={(id) => markReadMutation.mutate(id)}
                />
              ))
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function NotificationBell({ className = '' }: NotificationBellProps) {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useContext(QueryClientContext);

  if (!isAuthenticated) {
    return null;
  }

  if (!queryClient) {
    return (
      <div className={cn('relative inline-block text-left', className)}>
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return <NotificationBellConnected className={className} />;
}
