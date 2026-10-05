import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router';
import { useAuthStore } from '@/core/auth/auth.store';
import { useApplications } from '../../application/use-cases/useApplications';
import { useUpdateApplicationStatus } from '../../application/use-cases/useUpdateApplicationStatus';
import { useDeleteApplication } from '../../application/use-cases/useDeleteApplication';
import { ApplicationTable } from '../components/ApplicationTable';
import { ApplicationDetailPanel } from '../components/ApplicationDetailPanel';
import { ApplicationStatusBadge } from '../components/ApplicationStatusBadge';
import { Drawer } from '@/shared/ui/drawer';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import {
  Users,
  Search,
  Briefcase,
  FileCheck2,
} from 'lucide-react';
import type { JobApplicationEntity } from '../../domain/entities/job-application.entity';
import type { ApplicationStatus } from '../../domain/enums/application-status.enum';

export function ApplicationsPage() {
  const [searchParams] = useSearchParams();
  const urlJobId = searchParams.get('jobId') || '';

  const { user, hasPermission } = useAuthStore();
  const isRecruiter = Boolean(
    user?.isAdmin || hasPermission('applications:read'),
  );

  // Recruiter Filter State
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobIdFilter, setJobIdFilter] = useState(urlJobId);

  // Detail Drawer State
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplicationEntity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Candidate Public Status Check State
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupResult, setLookupResult] = useState<JobApplicationEntity | null>(
    null,
  );
  const [hasSearched, setHasSearched] = useState(false);

  // Queries & Mutations
  const { data, isLoading, refetch } = useApplications({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    jobId: jobIdFilter || undefined,
    search: searchQuery || undefined,
  });

  const updateStatusMutation = useUpdateApplicationStatus();
  const deleteMutation = useDeleteApplication();

  const applications = data?.items || [];

  // Pipeline metrics
  const metrics = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter((a) => a.status === 'applied').length;
    const screening = applications.filter(
      (a) => a.status === 'screening',
    ).length;
    const interview = applications.filter(
      (a) => a.status === 'interview',
    ).length;
    const offer = applications.filter((a) => a.status === 'offer').length;
    const hired = applications.filter((a) => a.status === 'hired').length;
    return { total, applied, screening, interview, offer, hired };
  }, [applications]);

  const handleOpenDetail = (app: JobApplicationEntity) => {
    setSelectedApplication(app);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedApplication(null);
  };

  const handleQuickStatusChange = async (
    id: string,
    status: ApplicationStatus,
  ) => {
    await updateStatusMutation.mutateAsync({ id, status });
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      await deleteMutation.mutateAsync(id);
      refetch();
    }
  };

  // Candidate public lookup handler
  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const found = applications.find(
      (app) => app.email.toLowerCase() === lookupEmail.trim().toLowerCase(),
    );
    setLookupResult(found || null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Recruitment & Candidate Pipeline
            </h1>
            <Badge variant="brand" size="sm">
              Talent Engine
            </Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Streamlined candidate evaluation, resume screening, and hiring stage progression.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/careers">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>Browse Open Positions</span>
            </Button>
          </Link>
        </div>
      </div>

      {isRecruiter ? (
        /* ================= RECRUITER PIPELINE BOARD ================= */
        <div className="space-y-6">
          {/* Pipeline Stage Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Pipeline
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {metrics.total}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
                New Applied
              </span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {metrics.applied}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
                Screening
              </span>
              <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
                {metrics.screening}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
                Interviewing
              </span>
              <p className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">
                {metrics.interview}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
                Offers Out
              </span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {metrics.offer}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs">
              <span className="text-2xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                Hired
              </span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {metrics.hired}
              </p>
            </div>
          </div>

          {/* Filtering Bar */}
          <div className="space-y-3">
            {/* Stage filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(
                [
                  'all',
                  'applied',
                  'screening',
                  'interview',
                  'offer',
                  'hired',
                  'rejected',
                  'withdrawn',
                ] as const
              ).map((stage) => {
                const isSelected = statusFilter === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setStatusFilter(stage)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors duration-150 border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {stage === 'all' ? 'All Applicants' : stage}
                  </button>
                );
              })}
            </div>

            {/* Keyword Search & Reset */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-8">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search applicants by name, email, or company..."
                  leftIcon={<Search className="h-4 w-4 text-slate-400" />}
                />
              </div>

              {jobIdFilter && (
                <div className="sm:col-span-4 flex items-center justify-between bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 text-xs">
                  <span className="text-indigo-700 dark:text-indigo-300 truncate">
                    Filtered by Job ID: {jobIdFilter}
                  </span>
                  <button
                    type="button"
                    onClick={() => setJobIdFilter('')}
                    className="text-indigo-600 hover:text-indigo-900 font-bold ml-2"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <ApplicationTable
            applications={applications}
            isLoading={isLoading}
            onViewDetail={handleOpenDetail}
            onUpdateStatus={handleQuickStatusChange}
            onDelete={handleDelete}
          />
        </div>
      ) : (
        /* ================= CANDIDATE PUBLIC PORTAL ================= */
        <div className="space-y-12">
          {/* Status Lookup Card */}
          <Card className="border-indigo-200 dark:border-indigo-900 shadow-md max-w-2xl mx-auto">
            <CardHeader className="text-center pb-2">
              <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 mb-2">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">
                Check Your Application Status
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter the email address you submitted with your application to view its current evaluation stage.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <form onSubmit={handleLookup} className="flex gap-2">
                <Input
                  type="email"
                  value={lookupEmail}
                  onChange={(e) => setLookupEmail(e.target.value)}
                  placeholder="ada@example.com"
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                >
                  <Search className="h-4 w-4 mr-1.5" />
                  <span>Lookup</span>
                </Button>
              </form>

              {hasSearched && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  {lookupResult ? (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {lookupResult.fullName}
                        </span>
                        <ApplicationStatusBadge status={lookupResult.status} />
                      </div>
                      <p className="text-xs text-slate-500">
                        Submitted on{' '}
                        {lookupResult.createdAt
                          ? new Date(lookupResult.createdAt).toLocaleDateString()
                          : 'Recent'}
                      </p>
                      {lookupResult.interviewDate && (
                        <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-200">
                          Scheduled Interview:{' '}
                          <strong>
                            {new Date(lookupResult.interviewDate).toLocaleString()}
                          </strong>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center text-xs text-amber-800 dark:text-amber-200">
                      No active submissions found for <strong>{lookupEmail}</strong>. If you recently applied, please allow up to 1 hour for system processing.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hiring Process Transparency */}
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Our Engineering Hiring Pipeline
              </h3>
              <p className="text-xs text-slate-500">
                Respecting candidate time with transparent evaluation criteria and zero algorithmic ghosting.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2">
                <span className="h-6 w-6 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-bold flex items-center justify-center">
                  1
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Resume & Work Review
                </h4>
                <p className="text-slate-500 leading-relaxed">
                  Screening of your code artifacts, GitHub repositories, and system design background.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2">
                <span className="h-6 w-6 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Technical Chat
                </h4>
                <p className="text-slate-500 leading-relaxed">
                  30-minute discussion on distributed systems trade-offs, architecture patterns, and team fit.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2">
                <span className="h-6 w-6 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 font-bold flex items-center justify-center">
                  3
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Real-World Pairing
                </h4>
                <p className="text-slate-500 leading-relaxed">
                  Hands-on pair programming solving an actual engineering issue or designing an API schema.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 text-xs space-y-2">
                <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                  4
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Offer & Onboarding
                </h4>
                <p className="text-slate-500 leading-relaxed">
                  Competitive USD compensation proposal, equity grant details, and equipment ordering.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recruiter Candidate Detail Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <span>Candidate Evaluation & Scorecard</span>
          </div>
        }
        description="Review candidate resume, update rating, schedule interviews, and progress hiring status."
        size="xl"
      >
        {selectedApplication && (
          <ApplicationDetailPanel
            application={selectedApplication}
            onClose={handleCloseDrawer}
            onRefresh={() => refetch()}
          />
        )}
      </Drawer>
    </div>
  );
}

export default ApplicationsPage;
export { ApplicationsPage as Component };
