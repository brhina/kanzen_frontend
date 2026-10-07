import type { MediaFileEntity } from '../../domain/entities/media-file.entity';
import { MediaCard } from './MediaCard';
import { Skeleton } from '@/shared/ui/skeleton';
import { cn } from '@/shared/utils/cn';

export interface MediaGridProps {
  items: MediaFileEntity[];
  isLoading?: boolean;
  selectedId?: string;
  onSelect?: (media: MediaFileEntity) => void;
  onEdit?: (media: MediaFileEntity) => void;
  onDelete?: (media: MediaFileEntity) => void;
  emptyMessage?: string;
  className?: string;
}

export function MediaGrid({
  items,
  isLoading = false,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  emptyMessage = 'No media assets found in this folder.',
  className = '',
}: MediaGridProps) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4', className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded-sm" />
            <Skeleton className="h-3 w-1/2 rounded-sm" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center dark:border-slate-800">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {emptyMessage}
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Upload new media assets using the upload zone above.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        className,
      )}
    >
      {items.map((item) => (
        <MediaCard
          key={item.id}
          media={item}
          isSelected={selectedId === item.id}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
