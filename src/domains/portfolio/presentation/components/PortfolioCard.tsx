import { Link } from 'react-router';
import { ExternalLink, ArrowRight, Lock, Edit3, Trash2, Code2 } from 'lucide-react';
import type { PortfolioItemEntity } from '../../domain/entities/portfolio-item.entity';
import { PORTFOLIO_CATEGORY_LABELS } from '../../domain/enums/portfolio-category.enum';
import { Badge } from '@/shared/ui/badge';
import { ProjectMetrics } from './ProjectMetrics';

export interface PortfolioCardProps {
  item: PortfolioItemEntity;
  canWrite?: boolean;
  onEdit?: (item: PortfolioItemEntity) => void;
  onDelete?: (item: PortfolioItemEntity) => void;
}

export function PortfolioCard({
  item,
  canWrite = false,
  onEdit,
  onDelete,
}: PortfolioCardProps) {
  const categoryLabel = PORTFOLIO_CATEGORY_LABELS[item.category] || item.category;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Cover Media Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={item.coverImage}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <Badge variant="brand" size="sm" className="backdrop-blur-md font-medium">
            {categoryLabel}
          </Badge>

          <div className="flex items-center gap-1.5">
            {item.isConfidential && (
              <Badge variant="warning" size="sm" className="flex items-center gap-1 font-mono text-[10px]">
                <Lock className="h-2.5 w-2.5" />
                <span>NDA</span>
              </Badge>
            )}
            {item.status !== 'published' && (
              <Badge variant="neutral" size="sm" className="capitalize text-[10px]">
                {item.status}
              </Badge>
            )}
          </div>
        </div>

        {/* Client & Subtitle on Image Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          {item.client && (
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {item.client}
            </p>
          )}
          <h3 className="text-lg font-bold tracking-tight text-white line-clamp-1">
            {item.title}
          </h3>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col p-5 space-y-4">
        {item.subtitle && (
          <p className="text-xs font-medium text-primary-600 dark:text-primary-400 line-clamp-1">
            {item.subtitle}
          </p>
        )}

        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Key Metrics Preview */}
        {item.metrics && item.metrics.length > 0 && (
          <div className="pt-1">
            <ProjectMetrics metrics={item.metrics.slice(0, 3)} variant="compact" />
          </div>
        )}

        {/* Technologies Stack Chips */}
        {item.technologies && item.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.technologies.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
            {item.technologies.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                +{item.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <Link
            to={`/portfolio/${item.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <span>Explore Architecture</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <div className="flex items-center gap-1.5">
            {item.liveUrl && (
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title="Live Application"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {item.githubUrl && (
              <a
                href={item.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title="Source Repository"
              >
                <Code2 className="h-4 w-4" />
              </a>
            )}

            {canWrite && (
              <div className="flex items-center gap-1 ml-2 border-l border-slate-200 dark:border-slate-800 pl-2">
                <button
                  type="button"
                  onClick={() => onEdit?.(item)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/40 transition-colors cursor-pointer"
                  title="Edit Project"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(item)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Delete Project"
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
