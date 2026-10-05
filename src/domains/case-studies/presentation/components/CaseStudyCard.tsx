import { Link } from 'react-router';
import { ArrowRight, Building2, Download, Edit3, Trash2 } from 'lucide-react';
import type { CaseStudyEntity } from '../../domain/entities/case-study.entity';
import { Badge } from '@/shared/ui/badge';
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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Cover Image & Badges */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={study.coverImage}
          alt={study.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
          </div>
        </div>

        {/* Client Tag */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            <Building2 className="h-3.5 w-3.5" />
            <span>{study.client}</span>
            {study.clientSize && (
              <span className="text-slate-400 font-normal">({study.clientSize})</span>
            )}
          </div>
          <h3 className="text-lg font-bold tracking-tight text-white line-clamp-1">
            {study.title}
          </h3>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col p-6 space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {study.summary}
        </p>

        {/* Key Metrics Preview */}
        {study.metrics && study.metrics.length > 0 && (
          <div className="pt-1">
            <CaseStudyMetrics metrics={study.metrics.slice(0, 3)} variant="compact" />
          </div>
        )}

        {/* Tech Stack Chips */}
        {study.technologies && study.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {study.technologies.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
            {study.technologies.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                +{study.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <Link
            to={`/case-studies/${study.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <span>Read Deep Dive</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <div className="flex items-center gap-2">
            {(study.downloadable || study.pdfUrl) && (
              <button
                type="button"
                onClick={handlePdfClick}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                title="Download Whitepaper"
              >
                <Download className="h-3 w-3" />
                <span>PDF</span>
              </button>
            )}

            {canWrite && (
              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
                <button
                  type="button"
                  onClick={() => onEdit?.(study)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/40 transition-colors cursor-pointer"
                  title="Edit Case Study"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(study)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Delete Case Study"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
