import { useState } from 'react';
import { useUIStore } from '@/core/stores/ui.store';
import type { AuditLogEntity } from '../../domain/entities/audit-log.entity';
import { useAuditLogs } from '../../application/use-cases/useAuditLogs';
import { AuditLogTable } from '../components/AuditLogTable';
import { AuditChangeDiff } from '../components/AuditChangeDiff';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { Pagination } from '@/shared/ui/pagination';
import { HeaderBanner } from '@/layouts/components';

const RESOURCE_OPTIONS = [
  'all',
  'user',
  'blog',
  'service',
  'product',
  'lead',
  'consultation',
  'setting',
  'media',
  'auth',
];

const ACTION_OPTIONS = [
  'all',
  'create',
  'update',
  'delete',
  'publish',
  'login',
];

export function AuditPage() {
  const { isEditMode } = useUIStore();

  const [resource, setResource] = useState('all');
  const [action, setAction] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntity | null>(null);

  const { data, isLoading, refetch } = useAuditLogs({
    resource: resource === 'all' ? undefined : resource,
    action: action === 'all' ? undefined : action,
    status: status === 'all' ? undefined : status,
    page,
    limit: 25,
  });

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <HeaderBanner
        badge="Compliance Trail & Operational Governance"
        title="System Audit Inspector"
        description="Tamper-evident record of administrative operations, authorization attempts, and database entity mutations."
      />

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="brand" size="sm">
              Compliance Trail
            </Badge>
            {isEditMode && (
              <Badge variant="warning" size="sm">
                Edit Mode
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="audit-resource-select" className="font-semibold text-slate-700 dark:text-slate-300">
              Resource:
            </label>
            <select
              id="audit-resource-select"
              value={resource}
              onChange={(e) => {
                setResource(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-800 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {RESOURCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="audit-action-select" className="font-semibold text-slate-700 dark:text-slate-300">
              Action:
            </label>
            <select
              id="audit-action-select"
              value={action}
              onChange={(e) => {
                setAction(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-800 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {ACTION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="audit-status-select" className="font-semibold text-slate-700 dark:text-slate-300">
              Status:
            </label>
            <select
              id="audit-status-select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-800 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="all">ALL</option>
              <option value="success">SUCCESS</option>
              <option value="failure">FAILURE</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {data?.total ?? 0} total events
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="text-xs"
          >
            Refresh Logs
          </Button>
        </div>
      </div>

      {/* Audit Log Stream Table */}
      <AuditLogTable
        logs={data?.items || []}
        isLoading={isLoading}
        onInspectChanges={(log) => setSelectedLog(log)}
      />

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            page={page}
            limit={25}
            total={data.total}
            totalPages={data.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* Side-by-Side Change Diff Modal */}
      {selectedLog && (
        <Modal
          isOpen={Boolean(selectedLog)}
          onClose={() => setSelectedLog(null)}
          title={`Mutation Diff: ${selectedLog.action.toUpperCase()} ${selectedLog.resource.toUpperCase()}`}
          className="max-w-4xl w-full"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs text-slate-500 dark:border-slate-800">
              <div>
                Operator: <strong className="text-slate-800 dark:text-slate-200">{selectedLog.userEmail || selectedLog.userId || 'System'}</strong>
              </div>
              <div>
                IP: <strong className="font-mono text-slate-800 dark:text-slate-200">{selectedLog.ipAddress || 'Internal'}</strong>
              </div>
              <div>
                Resource ID: <strong className="font-mono text-slate-800 dark:text-slate-200">{selectedLog.resourceId || 'N/A'}</strong>
              </div>
            </div>

            <AuditChangeDiff changes={selectedLog.changes} />

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLog(null)}
              >
                Close Diff
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AuditPage;
export { AuditPage as Component };
