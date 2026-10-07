import type { MediaFileEntity } from '../domain/entities/media-file.entity';
import type { MediaResponseDto } from './media.dto';

export class MediaMapper {
  static toDomain(dto: MediaResponseDto): MediaFileEntity {
    return {
      id: dto.id,
      filename: dto.filename,
      storedName: dto.storedName,
      mimeType: dto.mimeType,
      extension: dto.extension,
      size: dto.size,
      url: dto.url,
      thumbnailUrl: dto.thumbnailUrl,
      width: dto.width,
      height: dto.height,
      alt: dto.alt,
      caption: dto.caption,
      folder: dto.folder,
      uploadedBy: dto.uploadedBy,
      storageDriver: dto.storageDriver as any,
      status: dto.status as any,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  static toDomainList(dtos: MediaResponseDto[]): MediaFileEntity[] {
    return (dtos || []).map((d) => MediaMapper.toDomain(d));
  }
}
