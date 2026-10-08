import type { MediaFolderType } from '../enums/media-folder.enum';
import type { MediaStatusType } from '../enums/media-status.enum';
import type { StorageDriverType } from '../enums/storage-driver.enum';

export interface MediaFileEntity {
  id: string;
  filename: string;
  originalName?: string;
  storedName?: string;
  mimeType: string;
  extension?: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  folder: MediaFolderType | string;
  uploadedBy?: string;
  driver?: StorageDriverType;
  storageDriver?: StorageDriverType;
  status?: MediaStatusType;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
