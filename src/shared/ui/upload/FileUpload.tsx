import { useState, useRef, type ReactNode, type ChangeEvent, type DragEvent } from 'react';
import { UploadCloud, AlertCircle, Loader2 } from 'lucide-react';
import { Progress } from '@/shared/ui/progress';
import { cn } from '@/shared/utils/cn';

export interface FileUploadProps {
  label?: string;
  description?: string;
  accept?: string;
  maxSize?: number; // In bytes (default 10MB)
  multiple?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  onFileSelect?: (files: File[]) => void;
  uploadFn?: (file: File) => Promise<{ url: string; [key: string]: any }>;
  onUploadSuccess?: (result: any) => void;
  onUploadError?: (error: Error) => void;
  children?: ReactNode;
}

export function FileUpload({
  label,
  description,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  disabled = false,
  error,
  className = '',
  onFileSelect,
  uploadFn,
  onUploadSuccess,
  onUploadError,
  children,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File "${file.name}" exceeds maximum size of ${formatFileSize(maxSize)}.`;
    }

    if (accept) {
      const acceptedTypes = accept
        .split(',')
        .map((t) => t.trim().toLowerCase());
      const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const fileMime = file.type.toLowerCase();

      const isMatch = acceptedTypes.some((type) => {
        if (type.startsWith('.')) return fileExt === type;
        if (type.endsWith('/*')) {
          const prefix = type.slice(0, -2);
          return fileMime.startsWith(prefix);
        }
        return fileMime === type;
      });

      if (!isMatch) {
        return `File "${file.name}" is not an accepted format (${accept}).`;
      }
    }

    return null;
  };

  const handleFiles = async (filesList: FileList | File[]) => {
    const rawFiles = Array.from(filesList);
    if (rawFiles.length === 0) return;

    setLocalError(null);

    // Validate files
    for (const f of rawFiles) {
      const validationError = validateFile(f);
      if (validationError) {
        setLocalError(validationError);
        return;
      }
    }

    onFileSelect?.(rawFiles);

    // If uploadFn is provided, execute direct upload
    if (uploadFn) {
      setIsUploading(true);
      setUploadProgress(20);

      try {
        const fileToUpload = rawFiles[0];
        setUploadProgress(60);
        const result = await uploadFn(fileToUpload);
        setUploadProgress(100);
        onUploadSuccess?.(result);
      } catch (err: any) {
        const errObj =
          err instanceof Error ? err : new Error(err?.message || 'Upload failed');
        setLocalError(errObj.message);
        onUploadError?.(errObj);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const displayError = localError || error;

  return (
    <div className={cn('space-y-1.5 w-full', className)}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      {children ? (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        >
          {children}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition duration-200',
            disabled
              ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              : isDragging
                ? 'border-brand-500 bg-brand-50/50 dark:border-brand-400 dark:bg-brand-950/20 cursor-pointer'
                : 'border-slate-200 hover:border-brand-400 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-850/50 cursor-pointer',
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
              ) : (
                <UploadCloud className="h-5 w-5" />
              )}
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {isUploading
                  ? 'Uploading file...'
                  : 'Click to upload or drag and drop'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {description ||
                  `Maximum file size ${formatFileSize(maxSize)}`}
              </p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {isUploading && (
        <div className="space-y-1 pt-1">
          <Progress value={uploadProgress} className="h-1.5" />
        </div>
      )}

      {displayError && (
        <div className="flex items-center gap-1.5 text-xs text-red-500 pt-0.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
