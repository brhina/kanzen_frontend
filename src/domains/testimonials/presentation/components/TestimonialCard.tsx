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
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isPending
          ? 'bg-amber-50/30 border-2 border-amber-400/60 dark:bg-amber-950/20 dark:border-amber-500/50'
          : isRejected
            ? 'bg-rose-50/30 border border-rose-400/50 dark:bg-rose-950/20 dark:border-rose-500/40 opacity-80'
            : 'bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
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

          {canModerate && !isPending && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(testimonial)}
                  className="p-1 rounded text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors cursor-pointer"
                  title="Edit Testimonial"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(testimonial)}
                  className="p-1 rounded text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  title="Delete Testimonial"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quote Body */}
      <div className="relative flex-1 mb-6">
        <Quote className="h-5 w-5 text-brand-500/30 dark:text-brand-400/30 mb-2" />
        <p className="relative z-10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic line-clamp-4">
          "{testimonial.content}"
        </p>
      </div>

      {/* Video Testimonial Link if available */}
      {testimonial.videoUrl && (
        <div className="mb-4">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setIsVideoOpen(true)}
            className="inline-flex items-center gap-1.5"
          >
            <Play className="h-3 w-3 fill-rose-600 text-rose-600" />
            <span>Watch Video Testimonial</span>
          </Button>
        </div>
      )}

      {/* Author Details Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
        <div className="flex items-center gap-3">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.author}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase">
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

      {/* Moderation Controls when pending */}
      {canModerate && isPending && (
        <div className="mt-4 pt-3 border-t border-dashed border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
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
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit?.(testimonial)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors cursor-pointer"
                title="Edit Testimonial"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete?.(testimonial)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                title="Delete Testimonial"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
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
