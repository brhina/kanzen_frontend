import { useState } from 'react';
import type { MediaFileEntity } from '../../domain/entities/media-file.entity';
import { ImageWithFallback } from './ImageWithFallback';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';

export interface MediaCardProps {
  media: MediaFileEntity;
  isSelected?: boolean;
  onSelect?: (media: MediaFileEntity) => void;
  onEdit?: (media: MediaFileEntity) => void;
  onDelete?: (media: MediaFileEntity) => void;
  className?: string;
}

function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function MediaCard({
  media,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  className = '',
}: MediaCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (media.url) {
      await navigator.clipboard.writeText(media.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isImage = media.mimeType?.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(media.filename);

  return (
    <div
      onClick={() => onSelect?.(media)}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-xs transition-all duration-200 dark:bg-slate-900',
        isSelected
          ? 'border-brand-500 ring-2 ring-brand-500/30 dark:border-brand-400'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:hover:border-slate-700',
        onSelect ? 'cursor-pointer' : '',
        className,
      )}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800/60">
        {isImage ? (
          <ImageWithFallback
            src={media.thumbnailUrl || media.url}
            alt={media.alt || media.filename}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            fallbackText={media.extension || 'Image'}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
            <span className="font-mono text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
              {media.extension?.replace('.', '') || 'DOC'}
            </span>
            <span className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              {formatBytes(media.size)}
            </span>
          </div>
        )}

        {/* Folder tag */}
        <div className="absolute top-2 left-2">
          <Badge styleVariant="outline" size="sm" className="bg-slate-900/80 text-[10px] text-white border-0 backdrop-blur-xs font-mono">
            {media.folder || 'general'}
          </Badge>
        </div>

        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2">
            <Badge variant="success" size="sm" className="text-[10px] font-bold">
              Selected
            </Badge>
          </div>
        )}
      </div>

      {/* Details area */}
      <div className="flex flex-1 flex-col justify-between p-3">
        <div>
          <h4
            className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100"
            title={media.filename}
          >
            {media.filename}
          </h4>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>{formatBytes(media.size)}</span>
            {media.width && media.height ? (
              <span>{media.width}x{media.height}</span>
            ) : null}
          </div>
          {media.alt && (
            <p className="mt-1 truncate text-[11px] text-slate-400 dark:text-slate-500 italic">
              "{media.alt}"
            </p>
          )}
        </div>

        {/* Action buttons cluster */}
        <div className="mt-3 flex items-center justify-between gap-1 border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyUrl}
            className="h-7 px-2 text-[11px]"
            title="Copy Public URL"
          >
            {copied ? 'Copied!' : 'Copy URL'}
          </Button>

          <div className="flex items-center gap-1">
            {onEdit && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(media);
                }}
                className="h-7 px-2 text-[11px]"
                title="Edit Metadata"
              >
                Edit
              </Button>
            )}

            {onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(media);
                }}
                className="h-7 px-2 text-[11px] text-rose-600 hover:text-rose-700 dark:text-rose-400"
                title="Delete Media File"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
