import { MediaFolderType } from '../enums/media-folder.enum';
import { MediaStatusType } from '../enums/media-status.enum';
import { StorageDriverType } from '../enums/storage-driver.enum';

export interface MediaFileEntity {
  id: string;
  filename: string;
  storedName: string;
  mimeType: string;
  extension: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  folder: MediaFolderType | string;
  uploadedBy?: string;
  storageDriver?: StorageDriverType;
  status?: MediaStatusType;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
