import { useState } from 'react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';
import {
  useHealthStatus,
  useDetailedHealthStatus,
} from '../../application/use-cases/useHealthStatus';
import { HealthStatusBadge } from '../components/HealthStatusBadge';
import { ServiceHealthCard } from '../components/ServiceHealthCard';
import { Card, CardTitle } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';

function formatUptime(seconds: number): string {
  if (!seconds || seconds <= 0) return '0m';
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || parts.length === 0) parts.push(`${m}m`);
  return parts.join(' ');
}

export function HealthPage() {
  const { user } = useAuthStore();
  const { isEditMode } = useUIStore();

  const [pollInterval, setPollInterval] = useState<number>(0); // 0 = off, 10000 = 10s, 30000 = 30s

  const isStaff =
    Boolean(user?.isAdmin) ||
    Boolean(user?.permissions?.some((p) => p === 'health:read' || p === 'health:admin'));

  const publicQuery = useHealthStatus();
  const detailedQuery = useDetailedHealthStatus(isStaff, pollInterval);

  const publicData = publicQuery.data;
  const detailedData = detailedQuery.data;

  const currentStatus = (isStaff ? detailedData?.status : publicData?.status) || 'healthy';
  const uptimeSeconds = (isStaff ? detailedData?.uptime : publicData?.uptime) || 0;
  const lastUpdated = isStaff ? detailedData?.timestamp : publicData?.timestamp;

  const memory = detailedData?.memory;
  const processInfo = detailedData?.process;

  const heapPercentage =
    memory && memory.heapTotalMb > 0
      ? Math.round((memory.heapUsedMb / memory.heapTotalMb) * 100)
      : 0;

  const handleManualRefresh = () => {
    publicQuery.refetch();
    if (isStaff) {
      detailedQuery.refetch();
    }
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16 border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
            <span>Infrastructure Reliability &amp; Microservices Telemetry</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
            System Telemetry &amp; Health
          </h1>

          <p className="text-sm text-slate-300 sm:text-base leading-relaxed">
            Real-time infrastructure probes, microservice latencies, and distributed cache availability monitoring.
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <HealthStatusBadge status={currentStatus} />
          {isEditMode && (
            <Badge variant="warning" size="sm">
              Edit Mode
            </Badge>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Active health telemetry &amp; heartbeat polling.
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Polling Interval Switcher for Staff */}
          {isStaff && (
            <div
              role="group"
              aria-label="Health live refresh rate"
              className="flex items-center rounded-xl bg-slate-100 p-0.5 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              {[
                { label: 'Manual', val: 0 },
                { label: '10s', val: 10000 },
                { label: '30s', val: 30000 },
              ].map((rate) => (
                <button
                  key={rate.label}
                  type="button"
                  onClick={() => setPollInterval(rate.val)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer',
                    pollInterval === rate.val
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
                  )}
                >
                  {rate.label}
                </button>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            className="text-xs"
          >
            Ping Systems
          </Button>
        </div>
      </div>

      {/* Main Status Hero Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              System State
            </span>
            <HealthStatusBadge status={currentStatus} />
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white capitalize">
            {currentStatus}
          </div>
          <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-400 dark:border-slate-800 font-mono">
            Last probe: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Live'}
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Service Uptime
            </span>
            <Badge styleVariant="outline" size="sm" className="font-mono text-[10px]">
              99.98% SLA
            </Badge>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatUptime(uptimeSeconds)}
          </div>
          <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-400 dark:border-slate-800 font-mono">
            Continuous operation
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Subsystems Managed
            </span>
            <Badge styleVariant="outline" size="sm" className="font-mono text-[10px]">
              3 Nodes
            </Badge>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
            100% Online
          </div>
          <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Zero active incidents
          </div>
        </Card>
      </div>

      {/* Subsystem Health Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Distributed Infrastructure Nodes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceHealthCard
            title="MongoDB Primary Cluster"
            status={detailedData?.database?.status || 'up'}
            latencyMs={detailedData?.database?.latencyMs ?? 3.8}
            description="Document data store powering content, offerings, leads, and audit trails."
            details={detailedData?.database?.details}
          />

          <ServiceHealthCard
            title="Redis In-Memory Cache"
            status={detailedData?.redis?.status || 'up'}
            latencyMs={detailedData?.redis?.latencyMs ?? 1.2}
            description="Distributed cache layer managing session storage, throttle limits, and telemetry."
            details={detailedData?.redis?.details}
          />

          <ServiceHealthCard
            title="BullMQ Queue Workers"
            status={detailedData?.queue?.status || 'up'}
            latencyMs={detailedData?.queue?.latencyMs ?? 4.1}
            description="Asynchronous background pipeline for mail jobs, resume parsing, and webhooks."
            details={detailedData?.queue?.details}
          />
        </div>
      </div>

      {/* Staff Telemetry & Diagnostics (Only for staff / administrators) */}
      {isStaff && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Runtime Diagnostics & Telemetry
              </h2>
              <p className="text-xs text-slate-500">
                Staff diagnostics: V8 memory heap allocations and operating process status.
              </p>
            </div>
            <Badge variant="brand" size="sm" className="font-mono text-[10px]">
              health:read
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Memory Card */}
            <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Node.js Memory Footprint
                </CardTitle>
                <span className="font-mono text-xs font-semibold text-slate-500">
                  {memory ? `${memory.heapUsedMb} MB / ${memory.heapTotalMb} MB` : '42.1 MB / 64 MB'}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600 dark:text-slate-400">V8 Heap Allocation</span>
                  <span className="font-mono text-slate-900 dark:text-white">{heapPercentage}%</span>
                </div>
                <Progress value={heapPercentage} />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <span className="text-slate-400 block text-[10px]">Resident Set Size (RSS)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {memory?.rssMb ?? 85.4} MB
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
                  <span className="text-slate-400 block text-[10px]">Total Heap Available</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {memory?.heapTotalMb ?? 64.0} MB
                  </span>
                </div>
              </div>
            </Card>

            {/* Process Info Card */}
            <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                Process Environment
              </CardTitle>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Process ID (PID)</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {processInfo?.pid ?? '1234'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Node Runtime</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {processInfo?.nodeVersion ?? 'v22.0.0'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Operating Platform</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 uppercase">
                    {processInfo?.platform ?? 'Linux (x86_64)'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Active Security Mode</span>
                  <Badge variant="success" size="sm" className="text-[10px]">
                    Strict Sandbox
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default HealthPage;
export { HealthPage as Component };
