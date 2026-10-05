import { useState } from 'react';
import { useUpdateApplication } from '../../application/use-cases/useUpdateApplication';
import { useUpdateApplicationStatus } from '../../application/use-cases/useUpdateApplicationStatus';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import {
  FileText,
  Mail,
  Phone,
  Globe,
  Code2,
  Calendar,
  Star,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Clock,
  DollarSign,
  Building2,
  UserCheck,
} from 'lucide-react';
import type { JobApplicationEntity } from '../../domain/entities/job-application.entity';
import type { ApplicationStatus } from '../../domain/enums/application-status.enum';

interface ApplicationDetailPanelProps {
  application: JobApplicationEntity;
  onClose?: () => void;
  onRefresh?: () => void;
}

export const ApplicationDetailPanel: React.FC<ApplicationDetailPanelProps> = ({
  application,
  onRefresh,
}) => {
  const updateMutation = useUpdateApplication();
  const updateStatusMutation = useUpdateApplicationStatus();

  // Local editing states
  const [notes, setNotes] = useState(application.notes || '');
  const [rating, setRating] = useState(application.rating || 0);
  const [interviewDate, setInterviewDate] = useState(
    application.interviewDate
      ? new Date(application.interviewDate).toISOString().slice(0, 16)
      : '',
  );
  const [statusNote, setStatusNote] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if application changes
  const [prevId, setPrevId] = useState(application.id);
  if (application.id !== prevId) {
    setPrevId(application.id);
    setNotes(application.notes || '');
    setRating(application.rating || 0);
    setInterviewDate(
      application.interviewDate
        ? new Date(application.interviewDate).toISOString().slice(0, 16)
        : '',
    );
  }

  const handleSaveEvaluation = async () => {
    if (!application.id) return;
    await updateMutation.mutateAsync({
      id: application.id,
      data: {
        notes,
        rating,
        interviewDate: interviewDate ? new Date(interviewDate).toISOString() : null,
      },
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    onRefresh?.();
  };

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!application.id) return;
    await updateStatusMutation.mutateAsync({
      id: application.id,
      status: newStatus,
      notes: statusNote || undefined,
    });
    setStatusNote('');
    onRefresh?.();
  };

  const isPending =
    updateMutation.isPending || updateStatusMutation.isPending;

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      {/* Header Info */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {application.fullName}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Applicant ID: {application.id}
            </p>
          </div>
          <ApplicationStatusBadge status={application.status} />
        </div>

        {/* Contacts */}
        <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-300 pt-1">
          <a
            href={`mailto:${application.email}`}
            className="flex items-center gap-1.5 hover:text-indigo-600"
          >
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <span>{application.email}</span>
          </a>
          {application.phone && (
            <a
              href={`tel:${application.phone}`}
              className="flex items-center gap-1.5 hover:text-indigo-600"
            >
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span>{application.phone}</span>
            </a>
          )}
        </div>

        {/* External Links */}
        <div className="flex flex-wrap gap-2 pt-1">
          {application.linkedinUrl && (
            <a
              href={application.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:text-indigo-600"
            >
              <Globe className="h-3.5 w-3.5 text-blue-600" />
              <span>LinkedIn</span>
              <ExternalLink className="h-3 w-3 text-slate-400 ml-0.5" />
            </a>
          )}
          {application.githubUrl && (
            <a
              href={application.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:text-indigo-600"
            >
              <Code2 className="h-3.5 w-3.5 text-slate-800 dark:text-slate-200" />
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3 text-slate-400 ml-0.5" />
            </a>
          )}
          {application.portfolioUrl && (
            <a
              href={application.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:text-indigo-600"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-600" />
              <span>Portfolio</span>
              <ExternalLink className="h-3 w-3 text-slate-400 ml-0.5" />
            </a>
          )}
        </div>
      </div>

      {/* Resume Access Card */}
      <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">
              Candidate Resume Document
            </h4>
            <p className="text-2xs text-slate-500 font-mono truncate max-w-xs">
              {application.resumeUrl}
            </p>
          </div>
        </div>
        <a
          href={application.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="primary"
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex items-center gap-1.5 shrink-0"
          >
            <span>Open Resume PDF</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </a>
      </div>

      {/* Key Candidate Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-slate-500 flex items-center gap-1 text-2xs">
            <Clock className="h-3 w-3" /> Experience
          </span>
          <p className="font-bold text-slate-900 dark:text-white">
            {application.yearsOfExperience ?? 0} Years
          </p>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-slate-500 flex items-center gap-1 text-2xs">
            <Building2 className="h-3 w-3" /> Company
          </span>
          <p className="font-bold text-slate-900 dark:text-white truncate">
            {application.currentCompany || 'Not specified'}
          </p>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-slate-500 flex items-center gap-1 text-2xs">
            <DollarSign className="h-3 w-3" /> Expected
          </span>
          <p className="font-bold text-slate-900 dark:text-white">
            {application.expectedSalary
              ? `$${application.expectedSalary.toLocaleString()}/mo`
              : 'Flexible'}
          </p>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-slate-500 flex items-center gap-1 text-2xs">
            <Calendar className="h-3 w-3" /> Notice Period
          </span>
          <p className="font-bold text-slate-900 dark:text-white truncate">
            {application.noticePeriod || 'Immediate'}
          </p>
        </div>
      </div>

      {/* Cover Letter */}
      {application.coverLetter && (
        <div className="space-y-1.5">
          <h4 className="font-bold text-slate-900 dark:text-white text-xs">
            Cover Letter / Personal Statement
          </h4>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
            {application.coverLetter}
          </div>
        </div>
      )}

      {/* Candidate Pipeline Advance Controls */}
      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <h4 className="font-bold text-slate-900 dark:text-white text-xs">
          Move Candidate Through Hiring Stages
        </h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={application.status === 'screening' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('screening')}
            disabled={isPending || application.status === 'screening'}
            className="text-xs"
          >
            Screening
          </Button>

          <Button
            variant={application.status === 'interview' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('interview')}
            disabled={isPending || application.status === 'interview'}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Interview
          </Button>

          <Button
            variant={application.status === 'offer' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('offer')}
            disabled={isPending || application.status === 'offer'}
            className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
          >
            Make Offer
          </Button>

          <Button
            variant={application.status === 'hired' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('hired')}
            disabled={isPending || application.status === 'hired'}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Hire</span>
          </Button>

          <Button
            variant={application.status === 'rejected' ? 'danger' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('rejected')}
            disabled={isPending || application.status === 'rejected'}
            className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            Reject
          </Button>
        </div>
      </div>

      {/* Recruiter Evaluation (Rating, Notes, Interview Date) */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 dark:text-white text-xs">
            Recruiter Scorecard & Internal Notes
          </h4>
          {saveSuccess && (
            <span className="text-2xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Saved evaluation!
            </span>
          )}
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Evaluation Rating:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 hover:scale-110 transition-transform"
                title={`${star} Star`}
              >
                <Star
                  className={`h-5 w-5 ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
            {rating}/5
          </span>
        </div>

        {/* Interview Date Picker */}
        <div>
          <label className="block text-2xs text-slate-500 dark:text-slate-400 mb-1">
            Scheduled Interview Date & Time
          </label>
          <Input
            type="datetime-local"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
          />
        </div>

        {/* Internal Notes */}
        <div>
          <label className="block text-2xs text-slate-500 dark:text-slate-400 mb-1">
            Candidate Notes & Interview Feedback
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add technical screening feedback, strengths, architecture depth notes..."
            rows={3}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSaveEvaluation}
            disabled={isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-xs"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Evaluation</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
