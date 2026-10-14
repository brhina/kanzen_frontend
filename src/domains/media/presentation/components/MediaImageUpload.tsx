import { useState } from 'react';
import { ImageUpload } from '@/shared/ui/upload';
import { MediaPicker } from './MediaPicker';
import { mediaApi } from '../../infrastructure/media.api';
import type { MediaFileEntity } from '../../domain/entities/media-file.entity';
import { MediaFolder } from '../../domain/enums/media-folder.enum';

export interface MediaImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  error?: string;
  folder?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  className?: string;
  disabled?: boolean;
}

export function MediaImageUpload({
  value,
  onChange,
  label = 'Cover Image',
  description,
  error,
  folder = MediaFolder.GENERAL,
  aspectRatio = 'video',
  className = '',
  disabled = false,
}: MediaImageUploadProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleUpload = async (file: File) => {
    const uploaded = await mediaApi.upload(file, { folder });
    return uploaded;
  };

  const handleSelectMedia = (selected: MediaFileEntity) => {
    if (selected && selected.url) {
      onChange(selected.url);
    }
  };

  return (
    <>
      <ImageUpload
        value={value}
        onChange={onChange}
        label={label}
        description={description}
        error={error}
        aspectRatio={aspectRatio}
        uploadFn={handleUpload}
        onBrowseLibrary={() => setIsPickerOpen(true)}
        className={className}
        disabled={disabled}
      />

      <MediaPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleSelectMedia}
        defaultFolder={folder}
        title={`Select ${label} from Media Library`}
      />
    </>
  );
}

export default MediaImageUpload;
