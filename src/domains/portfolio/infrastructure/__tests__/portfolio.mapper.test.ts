import { describe, it, expect } from 'vitest';
import { PortfolioMapper } from '../portfolio.mapper';
import { PortfolioCategory } from '../../domain/enums/portfolio-category.enum';
import { PortfolioItemStatus } from '../../domain/enums/portfolio-status.enum';
import type { PortfolioItemResponseDto } from '../portfolio.dto';

describe('PortfolioMapper', () => {
  const mockDto: PortfolioItemResponseDto = {
    _id: 'port_123',
    title: 'Apex Capital Analytics',
    slug: 'apex-capital-analytics',
    subtitle: 'Wealth management dashboard',
    client: 'Apex Capital',
    description: 'Real-time performance attribution and portfolio analytics platform.',
    challenge: 'Legacy system was too slow for high-frequency updates.',
    solution: 'Designed WebSocket streaming and Redis cached projections.',
    results: 'Cut latency from 4s to 45ms.',
    coverImage: 'https://images.unsplash.com/cover.jpg',
    images: ['https://images.unsplash.com/screen1.jpg'],
    videoUrl: 'https://youtube.com/watch?v=mock',
    liveUrl: 'https://apex.io',
    githubUrl: 'https://github.com/kanzen/apex',
    category: PortfolioCategory.SAAS,
    services: ['Cloud Architecture', 'Frontend Engineering'],
    technologies: ['React', 'TypeScript', 'NestJS', 'Redis'],
    teamSize: 6,
    duration: '5 months',
    completedAt: '2026-08-01T00:00:00.000Z',
    isFeatured: true,
    isConfidential: false,
    order: 1,
    status: PortfolioItemStatus.PUBLISHED,
    metrics: [
      { label: 'Latency Reduction', value: '98%', icon: 'bolt' },
    ],
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-02T00:00:00.000Z',
  };

  it('maps DTO to PortfolioItemEntity correctly', () => {
    const entity = PortfolioMapper.toEntity(mockDto);

    expect(entity.id).toBe('port_123');
    expect(entity.title).toBe('Apex Capital Analytics');
    expect(entity.slug).toBe('apex-capital-analytics');
    expect(entity.client).toBe('Apex Capital');
    expect(entity.category).toBe(PortfolioCategory.SAAS);
    expect(entity.status).toBe(PortfolioItemStatus.PUBLISHED);
    expect(entity.isFeatured).toBe(true);
    expect(entity.isConfidential).toBe(false);
    expect(entity.technologies).toEqual(['React', 'TypeScript', 'NestJS', 'Redis']);
    expect(entity.metrics).toHaveLength(1);
    expect(entity.metrics[0].label).toBe('Latency Reduction');
  });

  it('handles fallback defaults on empty DTO', () => {
    const entity = PortfolioMapper.toEntity({} as PortfolioItemResponseDto);

    expect(entity.id).toBe('');
    expect(entity.title).toBe('');
    expect(entity.category).toBe(PortfolioCategory.WEB);
    expect(entity.status).toBe(PortfolioItemStatus.DRAFT);
    expect(entity.images).toEqual([]);
    expect(entity.services).toEqual([]);
    expect(entity.technologies).toEqual([]);
    expect(entity.metrics).toEqual([]);
  });

  it('maps paginated response accurately', () => {
    const paginated = PortfolioMapper.toPaginated({
      data: [mockDto],
      meta: {
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    });

    expect(paginated.items).toHaveLength(1);
    expect(paginated.total).toBe(1);
    expect(paginated.page).toBe(1);
    expect(paginated.limit).toBe(10);
  });
});
