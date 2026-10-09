import React from 'react';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import { Button } from '@/shared/ui/button';
import {
  FileText,
  Star,
  ExternalLink,
  Eye,
  Trash2,
  Mail,
  Loader2,
} from 'lucide-react';
import type { JobApplicationEntity } from '../../domain/entities/job-application.entity';
import type { ApplicationStatus } from '../../domain/enums/application-status.enum';

interface ApplicationTableProps {
  applications: JobApplicationEntity[];
  isLoading?: boolean;
  onViewDetail: (app: JobApplicationEntity) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onDelete?: (id: string) => void;
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  isLoading = false,
  onViewDetail,
  onUpdateStatus,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs text-slate-500">Loading candidate applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
        <FileText className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          No applications found
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          No candidate submissions match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold">
          <tr>
            <th className="px-4 py-3">Candidate</th>
            <th className="px-4 py-3">Experience</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Resume</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Move Stage</th>
            <th className="px-4 py-3">Applied</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {applications.map((app) => (
            <tr
              key={app.id}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
            >
              {/* Candidate Info */}
              <td className="px-4 py-3.5">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {app.fullName}
                </div>
                <div className="flex items-center gap-1.5 text-2xs text-slate-500 mt-0.5">
                  <Mail className="h-3 w-3 text-slate-400" />
                  <span>{app.email}</span>
                </div>
              </td>

              {/* Experience */}
              <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                <div className="font-medium">
                  {app.yearsOfExperience ?? 0} yrs exp
                </div>
                {app.currentCompany && (
                  <div className="text-2xs text-slate-400 truncate max-w-[140px]">
                    {app.currentCompany}
                  </div>
                )}
              </td>

              {/* Rating */}
              <td className="px-4 py-3.5">
                {app.rating ? (
                  <div className="flex items-center gap-1 font-bold text-amber-500 font-mono">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span>{app.rating}/5</span>
                  </div>
                ) : (
                  <span className="text-2xs text-slate-400 italic">Unrated</span>
                )}
              </td>

              {/* Resume */}
              <td className="px-4 py-3.5">
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                  title="View Resume PDF"
                >
                  <FileText className="h-3 w-3" />
                  <span className="text-2xs">PDF</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </td>

              {/* Status Badge */}
              <td className="px-4 py-3.5">
                <ApplicationStatusBadge status={app.status} />
              </td>

              {/* Stage Quick Move */}
              <td className="px-4 py-3.5">
                <select
                  value={app.status}
                  onChange={(e) =>
                    onUpdateStatus(
                      app.id!,
                      e.target.value as ApplicationStatus,
                    )
                  }
                  className="h-8 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-2xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="applied">Applied</option>
                  <option value="screening">Screening</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </td>

              {/* Applied Date */}
              <td className="px-4 py-3.5 text-slate-500 font-mono text-2xs whitespace-nowrap">
                {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
              </td>

              {/* Actions */}
              <td className="px-4 py-3.5 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetail(app)}
                    className="h-8 w-8 p-0"
                    title="View candidate scorecard"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  {onDelete && app.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(app.id!)}
                      className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Delete application"
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
  );
};
