import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MediaCard } from '../components/MediaCard';
import type { MediaFileEntity } from '../../domain/entities/media-file.entity';
import { MediaFolder } from '../../domain/enums/media-folder.enum';
import { StorageDriver } from '../../domain/enums/storage-driver.enum';

describe('MediaCard', () => {
  const sampleImage: MediaFileEntity = {
    id: 'media-1',
    filename: 'hero-banner.png',
    originalName: 'hero.png',
    mimeType: 'image/png',
    size: 204800,
    folder: MediaFolder.PORTFOLIO,
    driver: StorageDriver.LOCAL,
    url: '/uploads/hero-banner.png',
    thumbnailUrl: '/uploads/thumb-hero-banner.png',
    width: 1920,
    height: 1080,
    alt: 'Hero architecture graphic',
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  };

  it('renders image thumbnail and formatted dimensions', () => {
    const html = renderToStaticMarkup(
      <MediaCard media={sampleImage} />
    );

    expect(html).toContain('hero-banner.png');
    expect(html).toContain('1920x1080');
    expect(html).toContain('200 KB');
    expect(html).toContain('portfolio');
    expect(html).toContain('&quot;Hero architecture graphic&quot;');
  });

  it('renders non-image documents with file extension placeholder', () => {
    const sampleDoc: MediaFileEntity = {
      id: 'media-2',
      filename: 'resume-jane-doe.pdf',
      originalName: 'resume.pdf',
      mimeType: 'application/pdf',
      size: 1048576,
      folder: MediaFolder.RESUMES,
      driver: StorageDriver.LOCAL,
      url: '/uploads/resume.pdf',
      extension: '.pdf',
      createdAt: '2026-10-01T00:00:00Z',
      updatedAt: '2026-10-01T00:00:00Z',
    };

    const html = renderToStaticMarkup(
      <MediaCard media={sampleDoc} />
    );

    expect(html).toContain('resume-jane-doe.pdf');
    expect(html).toContain('pdf');
    expect(html).toContain('1 MB');
    expect(html).toContain('resumes');
  });

  it('renders selected indicator when isSelected is true', () => {
    const html = renderToStaticMarkup(
      <MediaCard media={sampleImage} isSelected={true} />
    );

    expect(html).toContain('Selected');
    expect(html).toContain('ring-2');
  });

  it('renders Edit and Delete buttons when callbacks are provided', () => {
    const html = renderToStaticMarkup(
      <MediaCard
        media={sampleImage}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );

    expect(html).toContain('Edit');
    expect(html).toContain('Delete');
    expect(html).toContain('Copy URL');
  });
});
