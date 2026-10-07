import React from 'react';
import { Link } from 'react-router';
import { MapPin, DollarSign, Users, Flame, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { JobTypeBadge } from './JobTypeBadge';
import { JobStatusBadge } from './JobStatusBadge';
import type { JobPostingEntity } from '../../domain/entities/job-posting.entity';

interface JobCardProps {
  job: JobPostingEntity;
  isStaff?: boolean;
  onEdit?: (job: JobPostingEntity) => void;
  onDelete?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isStaff = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
      <div className="space-y-4">
        {/* Top Badges & Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
              {job.department}
            </span>
            <JobTypeBadge mode={job.mode} />
            <JobTypeBadge type={job.type} />
            <JobTypeBadge level={job.experienceLevel} />
          </div>

          <div className="flex items-center gap-2">
            {job.isUrgent && (
              <Badge variant="danger" size="sm" className="flex items-center gap-1">
                <Flame className="h-3 w-3 fill-rose-500" />
                <span>Urgent Hiring</span>
              </Badge>
            )}
            {isStaff && <JobStatusBadge status={job.status} />}

            {isStaff && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(job)}
                    className="p-1 rounded text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors cursor-pointer"
                    title="Edit Role"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                )}
                {onDelete && job.id && (
                  <button
                    type="button"
                    onClick={() => onDelete(job.id!)}
                    className="p-1 rounded text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Role"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Role Title & Location */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            <Link to={`/careers/${job.slug}`}>
              {job.title}
            </Link>
          </h3>
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{job.locationDisplay}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{job.salaryRangeFormatted}</span>
            </div>
            {isStaff && (
              <div className="flex items-center gap-1 font-mono">
                <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{job.applicationCount} applied</span>
              </div>
            )}
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Tech Stack Pills */}
        {job.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {job.technologies.slice(0, 5).map((tech, idx) => (
              <span
                key={idx}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
            {job.technologies.length > 5 && (
              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-slate-500 dark:bg-slate-800">
                +{job.technologies.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions Bar */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
        <Link to={`/careers/${job.slug}`}>
          <Button
            variant="outline"
            size="xs"
            className="group-hover:border-brand-500 group-hover:text-brand-600 dark:group-hover:text-brand-400"
          >
            <span>View Role &amp; Apply</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
