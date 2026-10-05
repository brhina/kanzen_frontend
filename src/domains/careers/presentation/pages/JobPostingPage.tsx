import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useAuthStore } from '@/core/auth/auth.store';
import { useJobPosting } from '../../application/use-cases/useJobPosting';
import { JobTypeBadge } from '../components/JobTypeBadge';
import { JobStatusBadge } from '../components/JobStatusBadge';
import { JobRequirementsList } from '../components/JobRequirementsList';
import { JobPostingForm } from '../components/JobPostingForm';
import { JobApplicationForm } from '@/domains/applications/presentation/components/JobApplicationForm';
import { Drawer } from '@/shared/ui/drawer';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  Edit3,
  Users,
  Flame,
  FileText,
  Loader2,
  Share2,
} from 'lucide-react';

export function JobPostingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, hasPermission } = useAuthStore();
  const canManage = Boolean(user?.isAdmin || hasPermission('careers:write'));
  const canViewApplications = Boolean(
    user?.isAdmin || hasPermission('applications:read'),
  );

  const { data: job, isLoading, refetch } = useJobPosting(slug);

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-500">Loading role specifications...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <Briefcase className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Role Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The career opportunity you are looking for may have been closed or removed.
        </p>
        <div className="pt-2">
          <Link to="/careers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Back to Open Careers</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/careers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Open Positions</span>
        </Link>

        {/* Staff Quick Actions */}
        <div className="flex items-center gap-2">
          {canManage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDrawerOpen(true)}
              className="text-xs flex items-center gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Role</span>
            </Button>
          )}

          {canViewApplications && job.id && (
            <Link to={`/applications?jobId=${job.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1.5"
              >
                <Users className="h-3.5 w-3.5" />
                <span>View Candidates ({job.applicationCount})</span>
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-xs flex items-center gap-1.5 text-slate-600 dark:text-slate-300"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{copiedLink ? 'Copied Link!' : 'Share'}</span>
          </Button>
        </div>
      </div>

      {/* Role Title Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800">
              {job.department}
            </span>
            <JobTypeBadge mode={job.mode} />
            <JobTypeBadge type={job.type} />
            <JobTypeBadge level={job.experienceLevel} />
          </div>

          <div className="flex items-center gap-2">
            {job.isUrgent && (
              <Badge variant="danger" size="sm" className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 fill-rose-500" />
                <span>Urgent Hiring</span>
              </Badge>
            )}
            <JobStatusBadge status={job.status} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {job.title}
          </h1>

          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex-wrap pt-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{job.locationDisplay}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-slate-400" />
              <span>{job.salaryRangeFormatted}</span>
            </div>
            {job.publishedAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>
                  Posted {new Date(job.publishedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Description & Details vs Sidebar / Application Wizard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Description, Requirements, Perks */}
        <div className="lg:col-span-7 space-y-8">
          {/* Overview */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Role Overview & Mission
            </h2>
            <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </section>

          {/* Structured Requirements, Nice to Haves, Tech Stack, Benefits */}
          <JobRequirementsList
            requirements={job.requirements}
            niceToHave={job.niceToHave}
            benefits={job.benefits}
            technologies={job.technologies}
          />
        </div>

        {/* Right Column (5 cols): Quick Apply Box & Role Metadata */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          {/* Quick Apply Card */}
          <Card className="border-indigo-200 dark:border-indigo-900 shadow-md bg-gradient-to-b from-white to-indigo-50/20 dark:from-slate-900 dark:to-indigo-950/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <FileText className="h-4 w-4" />
                <span>Candidate Application</span>
              </div>
              <CardTitle className="text-lg">Apply for this Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Submit your CV/Resume in PDF format. We typically evaluate candidate submissions within 48 business hours.
              </p>

              {job.id ? (
                <JobApplicationForm
                  jobId={job.id}
                  jobTitle={job.title}
                  onSuccess={() => refetch()}
                />
              ) : (
                <div className="text-xs text-slate-500">
                  Applications are currently unavailable for this role.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Overview Metadata */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-5 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-2xs text-slate-500">
                Position Snapshot
              </h4>
              <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Department</span>
                  <span className="font-semibold">{job.department}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Employment Type</span>
                  <span className="font-semibold capitalize">{job.type}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Work Setup</span>
                  <span className="font-semibold capitalize">{job.mode}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Level</span>
                  <span className="font-semibold capitalize">{job.experienceLevel}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Salary Band</span>
                  <span className="font-semibold">{job.salaryRangeFormatted}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Staff Edit Role Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-indigo-600" />
            <span>Edit Role: {job.title}</span>
          </div>
        }
        description="Modify role specifications, requirements, compensation, or publication status."
        size="xl"
      >
        <JobPostingForm
          initialData={job}
          onSuccess={() => {
            setIsEditDrawerOpen(false);
            refetch();
          }}
          onCancel={() => setIsEditDrawerOpen(false)}
        />
      </Drawer>
    </div>
  );
}

export default JobPostingPage;
export { JobPostingPage as Component };
