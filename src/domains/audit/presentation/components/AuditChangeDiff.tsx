import type { AuditChanges } from '../../domain/entities/audit-log.entity';
import { cn } from '@/shared/utils/cn';

export interface AuditChangeDiffProps {
  changes?: AuditChanges;
  className?: string;
}

export function AuditChangeDiff({ changes, className = '' }: AuditChangeDiffProps) {
  const before = changes?.before;
  const after = changes?.after;

  if (!before && !after) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400 dark:border-slate-800">
        No state mutation diff was recorded for this operation.
      </div>
    );
  }

  // Collect all unique keys from before and after
  const allKeys = Array.from(
    new Set([...Object.keys(before || {}), ...Object.keys(after || {})]),
  );

  return (
    <div className={cn('space-y-4 text-xs font-mono', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Before Column */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-3 dark:border-rose-900/40 dark:bg-rose-950/20">
          <div className="flex items-center justify-between pb-2 border-b border-rose-200/80 dark:border-rose-900/50 mb-2">
            <span className="font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 text-[11px]">
              Previous State (Before)
            </span>
            <span className="text-[10px] text-rose-500">
              {before ? `${Object.keys(before).length} fields` : 'None / New record'}
            </span>
          </div>
          {before ? (
            <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed">
              {JSON.stringify(before, null, 2)}
            </pre>
          ) : (
            <p className="text-slate-400 italic py-4 text-center">Record did not previously exist.</p>
          )}
        </div>

        {/* After Column */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80 dark:border-emerald-900/50 mb-2">
            <span className="font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 text-[11px]">
              Resulting State (After)
            </span>
            <span className="text-[10px] text-emerald-500">
              {after ? `${Object.keys(after).length} fields` : 'Deleted'}
            </span>
          </div>
          {after ? (
            <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed">
              {JSON.stringify(after, null, 2)}
            </pre>
          ) : (
            <p className="text-slate-400 italic py-4 text-center">Record was permanently deleted.</p>
          )}
        </div>
      </div>

      {/* Field Level Summary if both exist */}
      {before && after && allKeys.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="font-sans font-bold text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-800 mb-2 text-xs">
            Field-by-Field Delta Breakdown
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800">
            {allKeys.map((key) => {
              const valBefore = before[key];
              const valAfter = after[key];
              const isChanged = JSON.stringify(valBefore) !== JSON.stringify(valAfter);

              return (
                <div key={key} className="pt-1.5 flex items-start justify-between gap-2 text-[11px]">
                  <span className={cn('font-semibold', isChanged ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500')}>
                    {key}:
                  </span>
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-rose-600 dark:text-rose-400 line-through truncate max-w-[150px]">
                      {valBefore !== undefined ? JSON.stringify(valBefore) : '—'}
                    </span>
                    <span>→</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold truncate max-w-[150px]">
                      {valAfter !== undefined ? JSON.stringify(valAfter) : '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
