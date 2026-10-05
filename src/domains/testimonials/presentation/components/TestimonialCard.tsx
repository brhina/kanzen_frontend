import { useState } from 'react';
import {
  Quote,
  CheckCircle,
  Play,
  Check,
  X,
  Edit3,
  Trash2,
} from 'lucide-react';
import type { TestimonialEntity } from '../../domain/entities/testimonial.entity';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { StarRating } from './StarRating';
import { TestimonialVideoPlayer } from './TestimonialVideoPlayer';

export interface TestimonialCardProps {
  testimonial: TestimonialEntity;
  canModerate?: boolean;
  onApprove?: (testimonial: TestimonialEntity) => void;
  onReject?: (testimonial: TestimonialEntity) => void;
  onEdit?: (testimonial: TestimonialEntity) => void;
  onDelete?: (testimonial: TestimonialEntity) => void;
}

export function TestimonialCard({
  testimonial,
  canModerate = false,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: TestimonialCardProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const isPending = testimonial.status === 'pending';
  const isRejected = testimonial.status === 'rejected';

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isPending
          ? 'bg-amber-500/5 border-2 border-amber-500/30'
          : isRejected
            ? 'bg-rose-500/5 border border-rose-500/20 opacity-75'
            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
      }`}
    >
      {/* Top Header: Star Rating & Badges */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <StarRating rating={testimonial.rating} size="sm" />

        <div className="flex items-center gap-1.5">
          {testimonial.isVerified && (
            <Badge variant="brand" size="sm" className="flex items-center gap-1 text-[11px] font-semibold">
              <CheckCircle className="h-3 w-3" />
              <span>Verified Client</span>
            </Badge>
          )}

          {isPending && (
            <Badge variant="warning" size="sm" className="font-semibold text-[10px]">
              Pending Review
            </Badge>
          )}

          {isRejected && (
            <Badge variant="neutral" size="sm" className="font-semibold text-[10px] text-rose-500">
              Rejected
            </Badge>
          )}
        </div>
      </div>

      {/* Quote Body */}
      <div className="relative flex-1 mb-6">
        <Quote className="absolute -top-1 -left-1 h-6 w-6 text-primary-500/20 dark:text-primary-400/20 -z-0" />
        <p className="relative z-10 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic">
          "{testimonial.content}"
        </p>
      </div>

      {/* Video Testimonial Link if available */}
      {testimonial.videoUrl && (
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setIsVideoOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-900 dark:text-white transition-colors cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 fill-red-600 text-red-600" />
            <span>Watch Video Testimonial</span>
          </button>
        </div>
      )}

      {/* Author Details Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-auto">
        <div className="flex items-center gap-3">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.author}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase">
              {testimonial.author.slice(0, 2)}
            </div>
          )}

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {testimonial.author}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {testimonial.role ? `${testimonial.role}, ` : ''}
              <strong className="text-slate-700 dark:text-slate-300 font-medium">
                {testimonial.company}
              </strong>
            </p>
          </div>
        </div>

        {/* Company Logo if present */}
        {testimonial.companyLogo && (
          <img
            src={testimonial.companyLogo}
            alt={testimonial.company || 'Company'}
            className="h-6 max-w-[80px] object-contain opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all"
          />
        )}
      </div>

      {/* Moderation Controls when user has permission */}
      {canModerate && (
        <div className="mt-4 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {isPending && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onApprove?.(testimonial)}
                  className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Check className="h-3 w-3" />
                  <span>Approve</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject?.(testimonial)}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <X className="h-3 w-3" />
                  <span>Reject</span>
                </Button>
              </>
            )}

            {!isPending && testimonial.status === 'approved' && (
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="h-3 w-3" /> Live on Wall
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit?.(testimonial)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/40 transition-colors cursor-pointer"
              title="Edit Testimonial"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(testimonial)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Delete Testimonial"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      <TestimonialVideoPlayer
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={testimonial.videoUrl}
        author={testimonial.author}
        company={testimonial.company}
      />
    </div>
  );
}
