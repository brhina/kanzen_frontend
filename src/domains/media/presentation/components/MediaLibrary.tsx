import { useState } from 'react';
import { MediaFolder } from '../../domain/enums/media-folder.enum';
import type { MediaFileEntity } from '../../domain/entities/media-file.entity';
import { useMedia } from '../../application/use-cases/useMedia';
import { useDeleteMedia } from '../../application/use-cases/useDeleteMedia';
import { useUpdateMediaMeta } from '../../application/use-cases/useUpdateMediaMeta';
import { MediaGrid } from './MediaGrid';
import { MediaUploadZone } from './MediaUploadZone';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { Pagination } from '@/shared/ui/pagination';
import { cn } from '@/shared/utils/cn';

export interface MediaLibraryProps {
  onSelect?: (media: MediaFileEntity) => void;
  selectedId?: string;
  defaultFolder?: string;
  allowUpload?: boolean;
  className?: string;
}

const FOLDER_TABS = [
  { key: 'all', label: 'All Files' },
  { key: MediaFolder.BLOG, label: 'Blog' },
  { key: MediaFolder.PORTFOLIO, label: 'Portfolio' },
  { key: MediaFolder.TEAM, label: 'Team' },
  { key: MediaFolder.CLIENTS, label: 'Clients' },
  { key: MediaFolder.RESUMES, label: 'Resumes' },
  { key: MediaFolder.GENERAL, label: 'General' },
];

export function MediaLibrary({
  onSelect,
  selectedId,
  defaultFolder = 'all',
  allowUpload = true,
  className = '',
}: MediaLibraryProps) {
  const [activeFolder, setActiveFolder] = useState<string>(defaultFolder);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [showUploadZone, setShowUploadZone] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MediaFileEntity | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MediaFileEntity | null>(null);

  // Edit metadata form fields
  const [editAlt, setEditAlt] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editFolder, setEditFolder] = useState('');

  const { data, isLoading, refetch } = useMedia({
    folder: activeFolder === 'all' ? undefined : activeFolder,
    search: search.trim() || undefined,
    page,
    limit: 12,
  });

  const deleteMutation = useDeleteMedia();
  const updateMutation = useUpdateMediaMeta();

  const handleStartEdit = (media: MediaFileEntity) => {
    setEditingItem(media);
    setEditAlt(media.alt || '');
    setEditCaption(media.caption || '');
    setEditFolder(media.folder || MediaFolder.GENERAL);
  };

  const handleSaveMeta = async () => {
    if (!editingItem) return;
    await updateMutation.mutateAsync({
      id: editingItem.id,
      dto: {
        alt: editAlt,
        caption: editCaption,
        folder: editFolder,
      },
    });
    setEditingItem(null);
    refetch();
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    await deleteMutation.mutateAsync(itemToDelete.id);
    setItemToDelete(null);
    refetch();
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Top Filter & Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Folder filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {FOLDER_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveFolder(tab.key);
                setPage(1);
              }}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                activeFolder === tab.key
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input and upload button */}
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search filenames or alt..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />

          {allowUpload && (
            <Button
              type="button"
              variant={showUploadZone ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => setShowUploadZone((prev) => !prev)}
              className="text-xs"
            >
              {showUploadZone ? 'Close Uploader' : 'Upload Assets'}
            </Button>
          )}
        </div>
      </div>

      {/* Upload Zone (Expandable) */}
      {allowUpload && showUploadZone && (
        <MediaUploadZone
          defaultFolder={activeFolder === 'all' ? MediaFolder.GENERAL : activeFolder}
          onSuccess={() => {
            refetch();
          }}
        />
      )}

      {/* Assets Grid */}
      <MediaGrid
        items={data?.items || []}
        isLoading={isLoading}
        selectedId={selectedId}
        onSelect={onSelect}
        onEdit={handleStartEdit}
        onDelete={(media) => setItemToDelete(media)}
      />

      {/* Pagination Controls */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingItem && (
        <Modal
          isOpen={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          title="Edit Media Metadata"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label htmlFor="meta-filename-display" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Filename
              </label>
              <input
                id="meta-filename-display"
                type="text"
                disabled
                value={editingItem.filename}
                className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label htmlFor="meta-alt-input" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Alternative Text (Alt)
              </label>
              <input
                id="meta-alt-input"
                type="text"
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
                placeholder="Descriptive text for accessibility"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-800 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="meta-caption-input" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Caption
              </label>
              <input
                id="meta-caption-input"
                type="text"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Visible caption under the figure"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-800 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="meta-folder-select" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Folder Category
              </label>
              <select
                id="meta-folder-select"
                value={editFolder}
                onChange={(e) => setEditFolder(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-800 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {FOLDER_TABS.filter((f) => f.key !== 'all').map((folder) => (
                  <option key={folder.key} value={folder.key}>
                    {folder.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSaveMeta}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Metadata'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <Modal
          isOpen={Boolean(itemToDelete)}
          onClose={() => setItemToDelete(null)}
          title="Confirm Delete Asset"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white font-semibold">{itemToDelete.filename}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setItemToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
