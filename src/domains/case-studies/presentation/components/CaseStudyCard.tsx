import { Link } from 'react-router';
import { Building2, Download, Edit3, Trash2 } from 'lucide-react';
import type { CaseStudyEntity } from '../../domain/entities/case-study.entity';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { CaseStudyMetrics } from './CaseStudyMetrics';
import { toast } from '@/shared/ui/toast/toast.store';

export interface CaseStudyCardProps {
  study: CaseStudyEntity;
  canWrite?: boolean;
  onEdit?: (study: CaseStudyEntity) => void;
  onDelete?: (study: CaseStudyEntity) => void;
}

export function CaseStudyCard({
  study,
  canWrite = false,
  onEdit,
  onDelete,
}: CaseStudyCardProps) {
  const handlePdfClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (study.pdfUrl) {
      window.open(study.pdfUrl, '_blank', 'noopener,noreferrer');
      toast.success(`Downloading whitepaper for "${study.title}"`, 'Download Started');
    } else {
      toast.info('Direct PDF download is being generated for this case study.', 'Case Study PDF');
    }
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
      {/* Cover Image & Badges */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={study.coverImage}
          alt={study.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <Badge variant="brand" size="sm" className="font-medium capitalize backdrop-blur-md">
            {study.clientIndustry}
          </Badge>

          <div className="flex items-center gap-1.5">
            {study.isFeatured && (
              <Badge variant="info" size="sm" className="text-[10px]">
                Featured
              </Badge>
            )}
            {study.status !== 'published' && (
              <Badge variant="neutral" size="sm" className="capitalize text-[10px]">
                {study.status}
              </Badge>
            )}
            {canWrite && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs rounded-lg p-0.5">
                {onEdit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(study);
                    }}
                    className="p-1 rounded text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 transition-colors cursor-pointer"
                    title="Edit Case Study"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(study);
                    }}
                    className="p-1 rounded text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Case Study"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-3">
          {/* Client Header */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Building2 className="h-3.5 w-3.5 text-brand-500" />
            <span>{study.client}</span>
            {study.clientSize && (
              <span className="text-slate-400 dark:text-slate-500 font-normal">({study.clientSize})</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
            <Link to={`/case-studies/${study.slug}`}>
              {study.title}
            </Link>
          </h3>

          {/* Summary */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {study.summary}
          </p>

          {/* Key Metrics Preview */}
          {study.metrics && study.metrics.length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <CaseStudyMetrics metrics={study.metrics.slice(0, 3)} variant="compact" />
            </div>
          )}

          {/* Tech Stack Chips */}
          {study.technologies && study.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {study.technologies.slice(0, 4).map((tech, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {tech}
                </span>
              ))}
              {study.technologies.length > 4 && (
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-slate-500 dark:bg-slate-800">
                  +{study.technologies.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          {(study.downloadable || study.pdfUrl) ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handlePdfClick}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              title="Download Whitepaper"
            >
              <Download className="h-3 w-3" />
              <span>PDF</span>
            </Button>
          ) : (
            <div />
          )}

          <Link to={`/case-studies/${study.slug}`}>
            <Button
              variant="outline"
              size="xs"
              className="group-hover:border-brand-500 group-hover:text-brand-600 dark:group-hover:text-brand-400"
            >
              <span>Read Deep Dive</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CaseStudyCard;
