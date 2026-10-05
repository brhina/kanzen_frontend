import React from 'react';
import { Link } from 'react-router';
import { MapPin, DollarSign, Users, Flame, ArrowRight, Edit3, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';
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
    <Card className="hover:border-indigo-500/50 hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
      <CardContent className="p-6 space-y-4">
        {/* Top Badges & Status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800">
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
          </div>
        </div>

        {/* Role Title & Location */}
        <div>
          <Link
            to={`/careers/${job.slug}`}
            className="text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {job.title}
          </Link>
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex-wrap">
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
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Tech Stack Pills */}
        {job.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.technologies.slice(0, 5).map((tech, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono"
              >
                {tech}
              </span>
            ))}
            {job.technologies.length > 5 && (
              <span className="text-xs px-1.5 py-0.5 text-slate-400">
                +{job.technologies.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Actions Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          {isStaff && onEdit ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(job)}
                className="text-xs flex items-center gap-1"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit</span>
              </Button>
              {onDelete && job.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(job.id!)}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="sr-only sm:not-sr-only">Delete</span>
                </Button>
              )}
            </div>
          ) : (
            <div />
          )}

          <Link to={`/careers/${job.slug}`}>
            <Button
              variant="primary"
              size="sm"
              className="text-xs flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700"
            >
              <span>View Role & Apply</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
