import { describe, it, expect } from 'vitest';
import { MediaMapper } from '../media.mapper';

describe('MediaMapper', () => {
  it('maps MediaResponseDto to domain MediaFileEntity', () => {
    const dto = {
      id: 'media-123',
      filename: 'architecture-diagram.png',
      storedName: 'uuid-123.png',
      mimeType: 'image/png',
      extension: '.png',
      size: 1048576,
      url: 'https://cdn.kanzen.tech/uuid-123.png',
      thumbnailUrl: 'https://cdn.kanzen.tech/uuid-123-thumb.png',
      width: 1920,
      height: 1080,
      alt: 'Architecture Diagram',
      caption: 'System Flowchart',
      folder: 'blog',
      uploadedBy: 'user-1',
      storageDriver: 's3',
      status: 'active',
      createdAt: '2026-10-04T12:00:00Z',
      updatedAt: '2026-10-04T12:00:00Z',
    };

    const entity = MediaMapper.toDomain(dto);

    expect(entity.id).toBe('media-123');
    expect(entity.filename).toBe('architecture-diagram.png');
    expect(entity.mimeType).toBe('image/png');
    expect(entity.size).toBe(1048576);
    expect(entity.url).toBe('https://cdn.kanzen.tech/uuid-123.png');
    expect(entity.folder).toBe('blog');
    expect(entity.width).toBe(1920);
    expect(entity.height).toBe(1080);
  });

  it('maps list of MediaResponseDto to domain entity list', () => {
    const dtos = [
      {
        id: 'm-1',
        filename: 'file1.jpg',
        storedName: 'f1.jpg',
        mimeType: 'image/jpeg',
        extension: '.jpg',
        size: 50000,
        url: 'https://cdn.kanzen.tech/f1.jpg',
        folder: 'portfolio',
      },
      {
        id: 'm-2',
        filename: 'file2.pdf',
        storedName: 'f2.pdf',
        mimeType: 'application/pdf',
        extension: '.pdf',
        size: 80000,
        url: 'https://cdn.kanzen.tech/f2.pdf',
        folder: 'resumes',
      },
    ];

    const entities = MediaMapper.toDomainList(dtos);

    expect(entities).toHaveLength(2);
    expect(entities[0].id).toBe('m-1');
    expect(entities[1].id).toBe('m-2');
  });
});
