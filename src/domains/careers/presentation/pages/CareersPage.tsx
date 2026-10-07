import { useState, useMemo } from 'react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useJobPostings } from '../../application/use-cases/useJobPostings';
import { useDeleteJobPosting } from '../../application/use-cases/useDeleteJobPosting';
import { JobCard } from '../components/JobCard';
import { JobFilterBar } from '../components/JobFilterBar';
import { JobStatusBadge } from '../components/JobStatusBadge';
import { JobTypeBadge } from '../components/JobTypeBadge';
import { JobPostingForm } from '../components/JobPostingForm';
import { Drawer } from '@/shared/ui/drawer';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import {
  Briefcase,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
  Zap,
  Globe2,
  Code2,
  Edit3,
  Trash2,
  Loader2,
  Search,
} from 'lucide-react';
import type { JobPostingEntity } from '../../domain/entities/job-posting.entity';
import type {
  ExperienceLevel,
  WorkMode,
} from '../../domain/enums/job-posting.enums';

export function CareersPage() {
  const { user, hasPermission } = useAuthStore();
  const canManage = Boolean(user?.isAdmin || hasPermission('careers:write'));

  // Filtering states
  const [selectedDept, setSelectedDept] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedMode, setSelectedMode] = useState<WorkMode | ''>('');
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | ''>('');
  const [viewFormat, setViewFormat] = useState<'grid' | 'table'>('grid');

  // Drawer / Form state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPostingEntity | null>(null);

  // Queries & Mutations
  const { data, isLoading, refetch } = useJobPostings(
    {
      department: selectedDept !== 'All' ? selectedDept : undefined,
      mode: selectedMode || undefined,
      experienceLevel: selectedLevel || undefined,
      search: search || undefined,
    },
    { admin: canManage },
  );

  const deleteMutation = useDeleteJobPosting();

  const openCreateDrawer = () => {
    setEditingJob(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (job: JobPostingEntity) => {
    setEditingJob(job);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingJob(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      await deleteMutation.mutateAsync(id);
      refetch();
    }
  };

  const resetFilters = () => {
    setSelectedDept('All');
    setSearch('');
    setSelectedMode('');
    setSelectedLevel('');
  };

  const jobs = data?.items || [];

  // Distinct departments
  const availableDepts = useMemo(() => {
    const defaultDepts = [
      'All',
      'Engineering',
      'Design',
      'DevOps',
      'Product',
      'Operations',
    ];
    return defaultDepts;
  }, []);

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16 border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            <span>Autonomous Engineering &amp; High Agency</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
            Engineering Careers at Kanzen
          </h1>

          <p className="text-sm text-slate-300 sm:text-base leading-relaxed">
            Join a global team designing, architecting, and scaling high-throughput distributed systems. We prioritize async autonomy, clean code, and zero legacy bloat.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <JobFilterBar
        departments={availableDepts}
        selectedDepartment={selectedDept}
        onSelectDepartment={setSelectedDept}
        search={search}
        onSearchChange={setSearch}
        selectedMode={selectedMode}
        onSelectMode={setSelectedMode}
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
        onReset={resetFilters}
        totalResults={jobs.length}
        actions={
          canManage && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewFormat('grid')}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewFormat === 'grid'
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewFormat('table')}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewFormat === 'table'
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Recruiter Table View"
                >
                  <TableIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Table</span>
                </button>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={openCreateDrawer}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
              >
                Post New Role
              </Button>
            </div>
          )
        }
      />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">Loading open positions...</p>
        </div>
      ) : jobs.length === 0 ? (
        <Card className="border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <CardContent className="space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No open roles found matching your criteria
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Try loosening your filters, selecting a different department, or clear search queries to see all available roles.
              </p>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : viewFormat === 'table' && canManage ? (
        /* Recruiter / Management Table View */
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Role Title</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Mode & Type</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Salary Range</th>
                <th className="px-4 py-3">Applicants</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {jobs.map((job) => (
                <tr
                  key={job.id || job.slug}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                    <div className="font-semibold">{job.title}</div>
                    <div className="text-slate-400 text-2xs font-mono">
                      /{job.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                    {job.department}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <JobTypeBadge mode={job.mode} />
                      <JobTypeBadge type={job.type} />
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <JobTypeBadge level={job.experienceLevel} />
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                    {job.salaryRangeFormatted}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                    {job.applicationCount}
                  </td>
                  <td className="px-4 py-3.5">
                    <JobStatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDrawer(job)}
                        className="h-8 w-8 p-0"
                        title="Edit Role"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      {job.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(job.id!)}
                          className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete Role"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Visitor & Public Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id || job.slug}
              job={job}
              isStaff={canManage}
              onEdit={openEditDrawer}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Engineering Culture & Benefits Showcase */}
      <div className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Why Engineer at Kanzen Tech?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            We operate like an elite open-source core team: minimal meetings, high agency, continuous automated verification, and deep respect for developer time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Globe2 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Global & Async Autonomy
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Work from anywhere in the world. Asynchronous written RFCs and GitHub PRs drive our architecture decisions, not recurring status calls.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Top of Market Pay
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Transparent salary bands in USD or local currency, regular inflation reviews, and equity participation for high impact.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Modern Cloud Stack
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Clean TypeScript 6, NestJS, Go, Redis, Docker, and Kubernetes. We continuously refactor and maintain 100% test coverage.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Equipment & Learning Stipend
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Comprehensive setup budget for your home lab / workspace, plus an annual allowance for books, conferences, and certifications.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Inline Drawer for Creating or Editing Job Posting */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            <span>{editingJob ? 'Edit Career Role' : 'Publish New Career Opportunity'}</span>
          </div>
        }
        description={
          editingJob
            ? `Updating role details for ${editingJob.title}`
            : 'Fill in the position requirements, salary bands, and tech stack.'
        }
        size="xl"
      >
        <JobPostingForm
          initialData={editingJob}
          onSuccess={() => {
            closeDrawer();
            refetch();
          }}
          onCancel={closeDrawer}
        />
      </Drawer>
    </div>
  );
}

export default CareersPage;
export { CareersPage as Component };
