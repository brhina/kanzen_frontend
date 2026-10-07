export interface FilterMediaDto {
  folder?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface UpdateMediaMetaDto {
  alt?: string;
  caption?: string;
  folder?: string;
}

export interface MediaResponseDto {
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
  folder: string;
  uploadedBy?: string;
  storageDriver?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedMediaResponseDto {
  data: MediaResponseDto[];
  meta: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
