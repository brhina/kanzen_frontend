import { Link } from 'react-router';
import { ExternalLink, Lock, Edit3, Trash2, Code2 } from 'lucide-react';
import type { PortfolioItemEntity } from '../../domain/entities/portfolio-item.entity';
import { PORTFOLIO_CATEGORY_LABELS } from '../../domain/enums/portfolio-category.enum';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
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
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
      {/* Cover Media Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {item.coverImage ? (
          <img
            src={item.coverImage}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-brand-900/20 via-slate-900/40 to-indigo-900/20 p-6 text-center text-slate-400">
            <span className="text-sm font-semibold tracking-wide uppercase text-brand-600 dark:text-brand-400">
              Kanzen Portfolio
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

        {/* Top Overlay Badges */}
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
            {canWrite && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs rounded-lg p-0.5">
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="p-1 rounded text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 transition-colors cursor-pointer"
                    title="Edit Project"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="p-1 rounded text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Project"
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
          {/* Client Subheading */}
          {item.client && (
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {item.client}
            </p>
          )}

          {/* Title & Subtitle */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
              <Link to={`/portfolio/${item.slug}`}>
                {item.title}
              </Link>
            </h3>
            {item.subtitle && (
              <p className="mt-1 text-xs font-medium text-brand-600 dark:text-brand-400 line-clamp-1">
                {item.subtitle}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Key Metrics Preview */}
          {item.metrics && item.metrics.length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <ProjectMetrics metrics={item.metrics.slice(0, 3)} variant="compact" />
            </div>
          )}

          {/* Technologies Stack Chips */}
          {item.technologies && item.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.technologies.slice(0, 4).map((tech, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {tech}
                </span>
              ))}
              {item.technologies.length > 4 && (
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-slate-500 dark:bg-slate-800">
                  +{item.technologies.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {item.liveUrl && (
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                title="Source Repository"
              >
                <Code2 className="h-4 w-4" />
              </a>
            )}
          </div>

          <Link to={`/portfolio/${item.slug}`}>
            <Button
              variant="outline"
              size="xs"
              className="group-hover:border-brand-500 group-hover:text-brand-600 dark:group-hover:text-brand-400"
            >
              <span>Explore Architecture</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PortfolioCard;
