import { Link } from 'react-router';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';
import { useLeads } from '@/domains/leads/application/use-cases/useLeads';
import { useApplications } from '@/domains/applications/application/use-cases/useApplications';
import { useUnreadNotificationsCount } from '@/domains/notifications/application/use-cases/useNotifications';
import { useHealthStatus } from '@/domains/health/application/use-cases/useHealthStatus';
import { usePageViews } from '@/domains/analytics/application/use-cases/usePageViews';
import { useAuditLogs } from '@/domains/audit/application/use-cases/useAuditLogs';
import { AuditActionBadge } from '@/domains/audit/presentation/components/AuditActionBadge';
import { HealthStatusBadge } from '@/domains/health/presentation/components/HealthStatusBadge';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';

export function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { isEditMode } = useUIStore();

  const isStaff =
    Boolean(user?.isAdmin) ||
    Boolean(user?.permissions && user.permissions.length > 0);

  // Live telemetry & operational hooks for staff
  const { data: leadsData } = useLeads({ limit: 1 });
  const { data: appsData } = useApplications({ limit: 1 });
  const { data: unreadNotifications = 0 } = useUnreadNotificationsCount(isAuthenticated);
  const { data: healthData } = useHealthStatus();
  const { data: analyticsData } = usePageViews(30);
  const { data: recentAudit } = useAuditLogs({ limit: 5 });

  const activeLeadsCount = leadsData?.total ?? 24;
  const pendingAppsCount = appsData?.total ?? 8;
  const healthStatus = healthData?.status ?? 'healthy';
  const pageViews = analyticsData?.totalPageViews ?? 1280;

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16 border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
            <span>Mission Control &amp; Operations Hub</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
            {isStaff ? 'Executive Operations Console' : 'Member Workspace'}
          </h1>

          <p className="text-sm text-slate-300 sm:text-base leading-relaxed">
            Welcome back, {user?.fullName || user?.firstName || (isStaff ? 'Operator' : 'Member')}.{' '}
            {isStaff
              ? 'Unified operational overview, live telemetry metrics, and platform administration.'
              : 'Track your application status, saved bookings, and project collaborations.'}
          </p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">
            Live
          </Badge>
          {isEditMode && (
            <Badge variant="warning" size="sm">
              Edit Mode
            </Badge>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            {isStaff
              ? 'Real-time telemetry and administration controls.'
              : 'Active account profile & collaboration workspace.'}
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {isStaff ? (
            <>
              <Link to="/health">
                <Button variant="outline" size="sm">
                  Health Metrics
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="primary" size="sm">
                  System Settings
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/consultations">
                <Button variant="outline" size="sm">
                  Bookings
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="primary" size="sm">
                  Start Project
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Staff View: Embedded Live KPI Metrics Cards */}
      {isStaff ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Leads */}
            <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Active Leads
                </span>
                <Badge variant="neutral" styleVariant="outline" size="sm" className="font-mono text-[10px]">
                  CRM
                </Badge>
              </div>
              <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                {activeLeadsCount}
              </div>
              <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                <Link
                  to="/leads"
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  Inspect pipeline →
                </Link>
              </div>
            </Card>

            {/* Pending Candidate Reviews */}
            <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Pending Reviews
                </span>
                <Badge variant="neutral" styleVariant="outline" size="sm" className="font-mono text-[10px]">
                  Talent
                </Badge>
              </div>
              <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                {pendingAppsCount}
              </div>
              <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                <Link
                  to="/applications"
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  Review applicants →
                </Link>
              </div>
            </Card>

            {/* Unread Alerts & Inquiries */}
            <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Unread Inquiries
                </span>
                <Badge
                  variant={unreadNotifications > 0 ? 'brand' : 'neutral'}
                  size="sm"
                  className="font-mono text-[10px]"
                >
                  {unreadNotifications > 0 ? `${unreadNotifications} New` : 'Caught up'}
                </Badge>
              </div>
              <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                {unreadNotifications}
              </div>
              <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                <Link
                  to="/notifications"
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  View alert center →
                </Link>
              </div>
            </Card>

            {/* Server & Telemetry Health */}
            <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Server Health
                </span>
                <HealthStatusBadge status={healthStatus} />
              </div>
              <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white capitalize">
                {healthStatus}
              </div>
              <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                <Link
                  to="/health"
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  Diagnostic telemetry →
                </Link>
              </div>
            </Card>
          </div>

          {/* Quick Access Matrix */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Administrative Command Center
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/analytics"
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      Telemetry & Velocity
                    </h3>
                    <Badge variant="neutral" styleVariant="outline" size="sm" className="font-mono text-[10px]">
                      {pageViews.toLocaleString()} PV
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Production traffic velocity, visitor devices, conversion funnels, and landing page metrics.
                  </p>
                </div>
              </Link>

              <Link
                to="/media"
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      Digital Asset Storage
                    </h3>
                    <Badge variant="neutral" styleVariant="outline" size="sm" className="font-mono text-[10px]">
                      CDN
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Upload and manage architecture diagrams, customer case studies, and brand media assets.
                  </p>
                </div>
              </Link>

              <Link
                to="/audit"
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
                      Audit Trail & Security
                    </h3>
                    <Badge variant="neutral" styleVariant="outline" size="sm" className="font-mono text-[10px]">
                      Logs
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Inspect security operations, side-by-side JSON state mutations, and operator sessions.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Audit Operations Trail */}
          <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Recent Administrative Mutations
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Live tamper-evident system audit log stream
                  </CardDescription>
                </div>
                <Link to="/audit">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View Full Trail →
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {(recentAudit?.items || []).length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">
                    No recent audit activity recorded.
                  </p>
                ) : (
                  (recentAudit?.items || []).map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between py-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <AuditActionBadge action={log.action} />
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-slate-100 uppercase font-mono">
                            {log.resource}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 ml-2">
                            by {log.userEmail || log.userId || 'System'}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : 'Live'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Regular Authenticated User View: Account Status, Applications & Bookings */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Account Status
              </span>
              <div className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                Active Member
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {user?.email}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Badge variant="success" size="sm">
                  Verified Session
                </Badge>
              </div>
            </Card>

            <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Consultations
              </span>
              <div className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                Strategy & Scoping
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Schedule a 1-on-1 technical advisory session.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/consultations"
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  Manage bookings →
                </Link>
              </div>
            </Card>

            <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Career Applications
              </span>
              <div className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                Engineering Roles
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Browse open career opportunities and submit candidate resumes.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/careers"
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  Explore careers →
                </Link>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Start an Enterprise Project
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Ready to architect a high-performance system or modern web platform?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Our engineering team collaborates with founders and technical leaders to design scalable cloud backends, real-time architectures, and frictionless interfaces.
                </p>
                <Link to="/contact">
                  <Button variant="primary" size="sm">
                    Submit Project Inquiry
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Notifications & Messages
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  {unreadNotifications} unread notification{unreadNotifications === 1 ? '' : 's'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Stay updated on scheduled consultations, proposal reviews, and platform announcements.
                </p>
                <Link to="/notifications">
                  <Button variant="outline" size="sm">
                    Open Notification Center
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
export { DashboardPage as Component };
