import { useState } from 'react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUIStore } from '@/core/stores/ui.store';
import { MediaFolder } from '../../domain/enums/media-folder.enum';
import type { MediaFileEntity } from '../../domain/entities/media-file.entity';
import { useMedia } from '../../application/use-cases/useMedia';
import { useDeleteMedia } from '../../application/use-cases/useDeleteMedia';
import { useUpdateMediaMeta } from '../../application/use-cases/useUpdateMediaMeta';
import { MediaGrid } from '../components/MediaGrid';
import { MediaUploadZone } from '../components/MediaUploadZone';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { Pagination } from '@/shared/ui/pagination';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

const FOLDER_TABS = [
  { key: 'all', label: 'All Files' },
  { key: MediaFolder.BLOG, label: 'Blog' },
  { key: MediaFolder.PORTFOLIO, label: 'Portfolio' },
  { key: MediaFolder.TEAM, label: 'Team' },
  { key: MediaFolder.CLIENTS, label: 'Clients' },
  { key: MediaFolder.RESUMES, label: 'Resumes' },
  { key: MediaFolder.GENERAL, label: 'General' },
];

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function MediaPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { isEditMode, viewMode, setViewMode } = useUIStore();

  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [showUploadZone, setShowUploadZone] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MediaFileEntity | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MediaFileEntity | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit metadata fields
  const [editAlt, setEditAlt] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editFolder, setEditFolder] = useState('');

  const canWrite =
    Boolean(user?.isAdmin) ||
    Boolean(user?.permissions?.some((p) => p === 'media:write' || p === 'media:admin'));

  const { data, isLoading, refetch } = useMedia({
    folder: activeFolder === 'all' ? undefined : activeFolder,
    search: search.trim() || undefined,
    page,
    limit: viewMode === 'table' ? 20 : 12,
  });

  const deleteMutation = useDeleteMedia();
  const updateMutation = useUpdateMediaMeta();

  const handleCopyUrl = async (item: MediaFileEntity) => {
    if (item.url) {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

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
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16 border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
            <span>Digital Asset Management &amp; Global CDN</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
            Digital Media Library
          </h1>

          <p className="text-sm text-slate-300 sm:text-base leading-relaxed">
            Centralized digital asset repository for client case studies, engineering blogs, team profiles, and brand imagery.
          </p>
        </div>
      </div>

      {/* Media Toolbar & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {/* Folder Navigation */}
        <div className="flex flex-wrap items-center gap-1.5">
          {FOLDER_TABS.map((tab) => {
            const isActive = activeFolder === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveFolder(tab.key);
                  setPage(1);
                }}
                className={cn(
                  'rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer',
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* View mode toggle (Showcase vs Table) */}
          <div
            role="group"
            aria-label="Media layout switcher"
            className="flex items-center rounded-xl bg-slate-100 p-0.5 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer',
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
              )}
              title="Grid layout"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Showcase</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer',
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
              )}
              title="Table layout"
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>Manage</span>
            </button>
          </div>

          {isEditMode && (
            <Badge variant="warning" size="sm">
              Edit Mode
            </Badge>
          )}

          {(canWrite || isAuthenticated) && (
            <Button
              type="button"
              variant={showUploadZone ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => setShowUploadZone((prev) => !prev)}
              className="shrink-0"
            >
              {showUploadZone ? 'Close Uploader' : 'Upload Assets'}
            </Button>
          )}
        </div>
      </div>

      {/* Multi-file drag and drop upload zone */}
      {(canWrite || isAuthenticated) && showUploadZone && (
        <MediaUploadZone
          defaultFolder={activeFolder === 'all' ? MediaFolder.GENERAL : activeFolder}
          onSuccess={() => {
            refetch();
          }}
        />
      )}

      {/* Filter and search toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            {data?.total ?? 0} assets
          </span>
        </div>
      </div>

      {/* Showcase Grid Mode */}
      {viewMode === 'grid' && (
        <MediaGrid
          items={data?.items || []}
          isLoading={isLoading}
          onEdit={canWrite ? handleStartEdit : undefined}
          onDelete={canWrite ? (item) => setItemToDelete(item) : undefined}
        />
      )}

      {/* Management Table Mode */}
      {viewMode === 'table' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3">Folder</th>
                  <th className="px-4 py-3">Format / Size</th>
                  <th className="px-4 py-3">Dimensions</th>
                  <th className="px-4 py-3">Alt Text</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      Loading media files...
                    </td>
                  </tr>
                ) : (data?.items || []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                      No media files match your filter.
                    </td>
                  </tr>
                ) : (
                  (data?.items || []).map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-850/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                            <ImageWithFallback
                              src={item.thumbnailUrl || item.url}
                              alt={item.alt || item.filename}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900 dark:text-slate-100 max-w-xs">
                              {item.filename}
                            </p>
                            <p className="text-[11px] font-mono text-slate-400 truncate max-w-xs">
                              {item.url}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="neutral" styleVariant="outline" size="sm" className="font-mono text-[10px]">
                          {item.folder}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                        <div>{item.mimeType}</div>
                        <div className="text-[10px] text-slate-400">{formatBytes(item.size)}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500">
                        {item.width && item.height ? `${item.width} × ${item.height}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {item.alt ? `"${item.alt}"` : <span className="text-slate-400 italic">None</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyUrl(item)}
                            className="h-7 px-2 text-[11px]"
                          >
                            {copiedId === item.id ? 'Copied' : 'Copy'}
                          </Button>
                          {canWrite && (
                            <>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStartEdit(item)}
                                className="h-7 px-2 text-[11px]"
                              >
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setItemToDelete(item)}
                                className="h-7 px-2 text-[11px] text-rose-600 hover:text-rose-700"
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            page={page}
            limit={viewMode === 'table' ? 20 : 12}
            total={data.total}
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
              <label htmlFor="modal-filename-display" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Filename
              </label>
              <input
                id="modal-filename-display"
                type="text"
                disabled
                value={editingItem.filename}
                className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-slate-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </div>

            <div>
              <label htmlFor="modal-alt-input" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Alternative Text (Alt)
              </label>
              <input
                id="modal-alt-input"
                type="text"
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
                placeholder="Descriptive text for accessibility"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-800 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="modal-caption-input" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Caption
              </label>
              <input
                id="modal-caption-input"
                type="text"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Visible caption"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-800 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label htmlFor="modal-folder-select" className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Folder Category
              </label>
              <select
                id="modal-folder-select"
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
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white font-semibold">{itemToDelete.filename}</strong>? This action will remove the asset from disk and CDN.
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

export default MediaPage;
export { MediaPage as Component };
