import { useState } from 'react';
import {
  Trash2,
  RefreshCw,
  FolderOpen,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { FileUpload } from './FileUpload';
import { cn } from '@/shared/utils/cn';

export interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  error?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  onBrowseLibrary?: () => void;
  uploadFn?: (file: File) => Promise<{ url: string; [key: string]: any }>;
  maxSize?: number; // In bytes (default 10MB)
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  label,
  description,
  error,
  aspectRatio = 'video',
  onBrowseLibrary,
  uploadFn,
  maxSize = 10 * 1024 * 1024,
  className = '',
  disabled = false,
}: ImageUploadProps) {
  const [imgLoadError, setImgLoadError] = useState(false);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square max-w-[200px]';
      case 'banner':
        return 'aspect-[3/1] w-full';
      case 'video':
        return 'aspect-video w-full';
      case 'auto':
      default:
        return 'min-h-[160px] w-full';
    }
  };

  const handleUploadSuccess = (result: any) => {
    if (result && typeof result === 'object' && result.url) {
      setImgLoadError(false);
      onChange(result.url);
    } else if (typeof result === 'string') {
      setImgLoadError(false);
      onChange(result);
    }
  };

  const handleRemove = () => {
    setImgLoadError(false);
    onChange('');
  };

  const hasImage = Boolean(value && value.trim().length > 0 && !imgLoadError);

  return (
    <div className={cn('space-y-2 w-full', className)}>
      <div className="flex items-center justify-between gap-2">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}

        {onBrowseLibrary && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onBrowseLibrary}
            disabled={disabled}
            className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            <span>Choose from Media Library</span>
          </Button>
        )}
      </div>

      {hasImage ? (
        <div className="relative group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-hidden">
          <div className={cn('relative flex items-center justify-center overflow-hidden', getAspectClass())}>
            <img
              src={value}
              alt={label || 'Uploaded preview'}
              onError={() => setImgLoadError(true)}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />

            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <FileUpload
                accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                maxSize={maxSize}
                uploadFn={uploadFn}
                onUploadSuccess={handleUploadSuccess}
                disabled={disabled}
                className="w-auto"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="bg-white/90 text-slate-800 hover:bg-white border-none shadow-sm flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Replace</span>
                </Button>
              </FileUpload>

              <Button
                type="button"
                variant="danger"
                size="xs"
                onClick={handleRemove}
                disabled={disabled}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                <span>Remove</span>
              </Button>
            </div>
          </div>

          {/* Bottom URL info pill */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
            <span className="truncate max-w-xs">{value}</span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleRemove}
              className="h-auto p-0 text-[11px] text-red-500 hover:text-red-600 hover:bg-transparent"
            >
              Clear
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <FileUpload
            accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
            maxSize={maxSize}
            uploadFn={uploadFn}
            onUploadSuccess={handleUploadSuccess}
            disabled={disabled}
            description={description || 'Supports JPEG, PNG, WebP, SVG, and GIF up to 10MB'}
            error={error}
          />
        </div>
      )}

      {imgLoadError && (
        <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Image failed to load from provided URL.</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleRemove}
            className="text-amber-700 hover:text-amber-800"
          >
            Clear URL
          </Button>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
