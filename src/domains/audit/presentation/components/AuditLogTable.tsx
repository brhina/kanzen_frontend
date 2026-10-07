import { format } from 'date-fns';
import type { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import { AuditActionBadge } from './AuditActionBadge';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';

export interface AuditLogTableProps {
  logs: AuditLogEntity[];
  isLoading?: boolean;
  onInspectChanges?: (log: AuditLogEntity) => void;
  className?: string;
}

export function AuditLogTable({
  logs,
  isLoading = false,
  onInspectChanges,
  className = '',
}: AuditLogTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900">
        Loading audit trail log stream...
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center dark:border-slate-800">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No audit records found.
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Try expanding your date filter or clearing search keywords.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Operator</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">IP Address</th>
              <th className="px-4 py-3 text-right">Mutations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {logs.map((log) => {
              const formattedDate = log.createdAt
                ? format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')
                : '—';

              const hasDiff = Boolean(
                log.changes &&
                  (Boolean(log.changes.before) || Boolean(log.changes.after)),
              );

              return (
                <tr
                  key={log.id}
                  className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-850/50"
                >
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formattedDate}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[160px]">
                      {log.userEmail || log.userId || 'System'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <AuditActionBadge action={log.action} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase font-mono text-[11px]">
                      {log.resource}
                    </span>
                    {log.resourceId && (
                      <span className="block font-mono text-[10px] text-slate-400 truncate max-w-[120px]">
                        #{log.resourceId}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={log.status === 'success' ? 'success' : 'danger'}
                      size="sm"
                      className="text-[10px] uppercase font-bold"
                    >
                      {log.status || 'success'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500 truncate max-w-[120px]">
                    {log.ipAddress || '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {hasDiff && onInspectChanges ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onInspectChanges(log)}
                        className="h-7 px-2 text-[11px]"
                      >
                        Inspect Diff
                      </Button>
                    ) : (
                      <span className="text-slate-400 italic text-[11px] pr-2">None</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
