import { useState } from 'react';
import {
  FileCheck,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { FileUpload } from './FileUpload';
import { cn } from '@/shared/utils/cn';

export interface DocumentUploadProps {
  value?: string;
  fileName?: string;
  fileSize?: number;
  onChange: (url: string, meta?: { filename?: string; size?: number }) => void;
  onRemove?: () => void;
  label?: string;
  description?: string;
  error?: string;
  accept?: string;
  maxSize?: number; // In bytes (default 10MB)
  uploadFn?: (file: File) => Promise<{ url: string; filename?: string; size?: number; [key: string]: any }>;
  className?: string;
  disabled?: boolean;
}

export function DocumentUpload({
  value,
  fileName,
  fileSize,
  onChange,
  onRemove,
  label,
  description,
  error,
  accept = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  maxSize = 10 * 1024 * 1024,
  uploadFn,
  className = '',
  disabled = false,
}: DocumentUploadProps) {
  const [internalFileName, setInternalFileName] = useState<string | undefined>(fileName);
  const [internalSize, setInternalSize] = useState<number | undefined>(fileSize);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUploadSuccess = (result: any) => {
    if (result && typeof result === 'object' && result.url) {
      setInternalFileName(result.filename || result.originalname);
      setInternalSize(result.size);
      onChange(result.url, {
        filename: result.filename || result.originalname,
        size: result.size,
      });
    } else if (typeof result === 'string') {
      onChange(result);
    }
  };

  const handleRemove = () => {
    setInternalFileName(undefined);
    setInternalSize(undefined);
    onChange('');
    onRemove?.();
  };

  const hasDocument = Boolean(value && value.trim().length > 0);
  const displayName =
    internalFileName || fileName || (value ? value.split('/').pop() : 'Document');

  return (
    <div className={cn('space-y-1.5 w-full', className)}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      {hasDocument ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
              <FileCheck className="h-5 w-5" />
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                  {displayName}
                </p>
                <Badge variant="success" size="sm" className="font-mono text-[10px]">
                  Uploaded
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                {internalSize && <span>{formatFileSize(internalSize)} &bull; </span>}
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  <span>View Document</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FileUpload
              accept={accept}
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
                disabled={disabled}
                className="text-xs"
              >
                <span>Replace</span>
              </Button>
            </FileUpload>

            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleRemove}
              disabled={disabled}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs"
            >
              <span>Remove</span>
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <FileUpload
            accept={accept}
            maxSize={maxSize}
            uploadFn={uploadFn}
            onUploadSuccess={handleUploadSuccess}
            disabled={disabled}
            description={description || 'Upload PDF, DOC, or DOCX document up to 10MB'}
            error={error}
          />
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;
