import { useState } from 'react';
import type { MediaFileEntity } from '../../domain/entities/media-file.entity';
import { MediaLibrary } from './MediaLibrary';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';

export interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaFileEntity) => void;
  title?: string;
  defaultFolder?: string;
}

export function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media Asset',
  defaultFolder = 'all',
}: MediaPickerProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaFileEntity | null>(null);

  const handleConfirm = () => {
    if (selectedMedia) {
      onSelect(selectedMedia);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-4xl w-full"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Choose an asset from your library or upload a new file to insert into your content.
        </p>

        <div className="max-h-[60vh] overflow-y-auto px-1 py-2">
          <MediaLibrary
            defaultFolder={defaultFolder}
            selectedId={selectedMedia?.id}
            onSelect={(media) => setSelectedMedia(media)}
            allowUpload={true}
          />
        </div>

        {/* Selected asset feedback & confirm footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            {selectedMedia ? (
              <span>
                Selected: <strong className="font-semibold">{selectedMedia.filename}</strong>
              </span>
            ) : (
              <span className="italic text-slate-400">No asset selected</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleConfirm}
              disabled={!selectedMedia}
            >
              Confirm Selection
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
