import { formatDistanceToNow } from 'date-fns';
import type { NotificationEntity } from '../../domain/entities/notification.entity';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';

export interface NotificationItemProps {
  notification: NotificationEntity;
  onMarkRead?: (id: string) => void;
  className?: string;
}

export function NotificationItem({
  notification,
  onMarkRead,
  className = '',
}: NotificationItemProps) {
  const isUnread = notification.status !== 'read';

  const timeLabel = notification.createdAt
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : 'Recently';

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-2 rounded-xl border p-4 transition-all duration-200',
        isUnread
          ? 'border-brand-200 bg-brand-50/20 dark:border-brand-900/40 dark:bg-brand-950/20'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {isUnread && (
            <span
              className="h-2 w-2 rounded-full bg-brand-500 animate-pulse"
              title="Unread notification"
            />
          )}
          <Badge
            variant={
              notification.type === 'system'
                ? 'warning'
                : notification.type === 'email'
                  ? 'info'
                  : 'neutral'
            }
            size="sm"
            className="text-[10px] font-mono uppercase"
          >
            {notification.type || 'in-app'}
          </Badge>
          <span className="text-[11px] text-slate-400 font-mono">
            {timeLabel}
          </span>
        </div>

        {isUnread && onMarkRead && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onMarkRead(notification.id)}
            className="h-6 px-2 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            Mark read
          </Button>
        )}
      </div>

      {notification.subject && (
        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
          {notification.subject}
        </h4>
      )}

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
        {notification.body}
      </p>
    </div>
  );
}
