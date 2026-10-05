import type { PortfolioItemEntity } from '../../domain/entities/portfolio-item.entity';
import { PortfolioCard } from './PortfolioCard';
import { Skeleton } from '@/shared/ui/skeleton';

export interface PortfolioGridProps {
  items: PortfolioItemEntity[];
  isLoading?: boolean;
  canWrite?: boolean;
  onEdit?: (item: PortfolioItemEntity) => void;
  onDelete?: (item: PortfolioItemEntity) => void;
  emptyMessage?: string;
}

export function PortfolioGrid({
  items,
  isLoading = false,
  canWrite = false,
  onEdit,
  onDelete,
  emptyMessage = 'No portfolio items found matching your criteria.',
}: PortfolioGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4"
          >
            <Skeleton className="aspect-[16/10] w-full rounded-xl" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-12 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <PortfolioCard
          key={item.id}
          item={item}
          canWrite={canWrite}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
