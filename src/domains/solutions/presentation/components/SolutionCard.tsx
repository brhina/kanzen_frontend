import { Link } from 'react-router';
import { CheckCircle2, Edit3, Building2 } from 'lucide-react';
import type { SolutionEntity } from '../../domain/entities/solution.entity';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { PermissionGate } from '@/core/auth/guards/PermissionGate';

export interface SolutionCardProps {
  solution: SolutionEntity;
  onEdit?: (solution: SolutionEntity) => void;
  showAdminActions?: boolean;
}

export function SolutionCard({
  solution,
  onEdit,
  showAdminActions = true,
}: SolutionCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
      {/* Top Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          {/* Industry pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {solution.industries && solution.industries.length > 0 ? (
              solution.industries.slice(0, 2).map((ind) => (
                <Badge key={ind} variant="neutral" size="sm" className="text-[10px] uppercase">
                  {ind}
                </Badge>
              ))
            ) : (
              <Badge variant="neutral" size="sm" className="text-[10px] uppercase">
                Cross-Industry
              </Badge>
            )}
            {solution.status !== 'active' && (
              <Badge variant="warning" size="sm" className="capitalize text-[10px]">
                {solution.status}
              </Badge>
            )}
          </div>

          {/* Inline Edit Button */}
          {showAdminActions && onEdit && (
            <PermissionGate permission="solutions:write">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => onEdit(solution)}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                title="Edit Solution"
              >
                <Edit3 className="h-3 w-3" />
                <span className="text-xs">Edit</span>
              </Button>
            </PermissionGate>
          )}
        </div>

        {/* Title & Tagline */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            <Link to={`/solutions/${solution.slug}`}>
              {solution.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs font-medium text-brand-600 dark:text-brand-400">
            {solution.tagline}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
          {solution.description}
        </p>

        {/* Key Features / Architectural Highlights */}
        {solution.features && solution.features.length > 0 && (
          <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {solution.features.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{feat}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Building2 className="h-3.5 w-3.5" />
          <span>Proven Architecture</span>
        </div>

        <Link to={`/solutions/${solution.slug}`}>
          <Button variant="outline" size="xs" className="group-hover:border-brand-500 group-hover:text-brand-600 dark:group-hover:text-brand-400">
            <span>Explore Blueprint</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default SolutionCard;
