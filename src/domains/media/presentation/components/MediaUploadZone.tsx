import { useState, useRef } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { MediaFolder } from '../../domain/enums/media-folder.enum';
import { useUploadMedia } from '../../application/use-cases/useUploadMedia';
import type { MediaFileEntity } from '../../domain/entities/media-file.entity';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/utils/cn';

export interface MediaUploadZoneProps {
  defaultFolder?: string;
  onSuccess?: (uploaded: MediaFileEntity[]) => void;
  className?: string;
}

interface QueuedFile {
  id: string;
  file: File;
  folder: string;
  alt: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  errorMessage?: string;
  result?: MediaFileEntity;
}

const FOLDERS = [
  MediaFolder.PORTFOLIO,
  MediaFolder.BLOG,
  MediaFolder.TEAM,
  MediaFolder.CLIENTS,
  MediaFolder.RESUMES,
  MediaFolder.GENERAL,
];

export function MediaUploadZone({
  defaultFolder = MediaFolder.GENERAL,
  onSuccess,
  className = '',
}: MediaUploadZoneProps) {
  const [selectedFolder, setSelectedFolder] = useState<string>(defaultFolder);
  const [altText, setAltText] = useState<string>('');
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadMedia();

  const addFilesToQueue = (files: FileList | File[]) => {
    const newItems: QueuedFile[] = Array.from(files).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      folder: selectedFolder,
      alt: altText,
      progress: 0,
      status: 'pending',
    }));
    setQueue((prev) => [...prev, ...newItems]);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
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
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(e.target.files);
      e.target.value = '';
    }
  };

  const removeQueueItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const uploadAll = async () => {
    const pendingItems = queue.filter((item) => item.status === 'pending');
    if (pendingItems.length === 0) return;

    setIsProcessing(true);
    const successfullyUploaded: MediaFileEntity[] = [];

    for (const item of pendingItems) {
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id ? { ...q, status: 'uploading', progress: 30 } : q,
        ),
      );

      try {
        const uploaded = await uploadMutation.mutateAsync({
          file: item.file,
          meta: {
            folder: item.folder,
            alt: item.alt || undefined,
          },
        });

        successfullyUploaded.push(uploaded);

        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: 'completed', progress: 100, result: uploaded }
              : q,
          ),
        );
      } catch (err: any) {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  status: 'error',
                  progress: 0,
                  errorMessage: err?.message || 'Upload failed',
                }
              : q,
          ),
        );
      }
    }

    setIsProcessing(false);
    if (successfullyUploaded.length > 0) {
      onSuccess?.(successfullyUploaded);
    }
  };

  const completedCount = queue.filter((i) => i.status === 'completed').length;
  const overallProgress =
    queue.length > 0 ? Math.round((completedCount / queue.length) * 100) : 0;

  return (
    <div className={cn('space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900', className)}>
      {/* Top Configuration Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <label htmlFor="upload-folder-select" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Target Folder:
          </label>
          <select
            id="upload-folder-select"
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {FOLDERS.map((folder) => (
              <option key={folder} value={folder}>
                {folder.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 items-center gap-2 sm:max-w-xs">
          <input
            type="text"
            placeholder="Default Alt Text (optional)"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800 placeholder-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-brand-500 bg-brand-50/50 dark:border-brand-400 dark:bg-brand-950/20'
            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-850/50',
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          accept="image/*,application/pdf"
        />

        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Drag & drop media files here, or click to browse
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supports PNG, JPEG, WebP, GIF, SVG, and PDF documents up to 25MB each
          </p>
        </div>
      </div>

      {/* Upload Queue Stream */}
      {queue.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <span>
              Upload Queue ({completedCount}/{queue.length} completed)
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setQueue([])}
                disabled={isProcessing}
                className="text-xs"
              >
                Clear Queue
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={uploadAll}
                disabled={isProcessing || completedCount === queue.length}
                className="text-xs"
              >
                {isProcessing ? 'Uploading...' : 'Start Upload'}
              </Button>
            </div>
          </div>

          {/* Overall progress indicator */}
          <div className="space-y-1">
            <Progress value={overallProgress} />
            <div className="flex justify-end text-[10px] font-mono text-slate-400">
              {overallProgress}%
            </div>
          </div>

          <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
            {queue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-2 text-xs dark:border-slate-800 dark:bg-slate-850"
              >
                <div className="flex min-w-0 flex-1 flex-col pr-3">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                      {item.file.name}
                    </span>
                    <Badge variant="neutral" styleVariant="outline" size="sm" className="text-[10px] font-mono">
                      {item.folder}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {(item.file.size / 1024).toFixed(1)} KB
                  </span>
                  {item.errorMessage && (
                    <span className="text-[11px] text-rose-500 font-medium">
                      {item.errorMessage}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      item.status === 'completed'
                        ? 'success'
                        : item.status === 'uploading'
                          ? 'brand'
                          : item.status === 'error'
                            ? 'danger'
                            : 'neutral'
                    }
                    size="sm"
                    className="capitalize text-[10px]"
                  >
                    {item.status}
                  </Badge>

                  {item.status !== 'uploading' && (
                    <button
                      type="button"
                      onClick={() => removeQueueItem(item.id)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1 cursor-pointer"
                      title="Remove from queue"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
