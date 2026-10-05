import { describe, it, expect } from 'vitest';
import { CaseStudyMapper } from '../case-studies.mapper';
import { CaseStudyStatus } from '../../domain/enums/case-study-status.enum';
import type { CaseStudyResponseDto } from '../case-studies.dto';

describe('CaseStudyMapper', () => {
  const mockDto: CaseStudyResponseDto = {
    _id: 'cs_100',
    title: 'PaySwift Core Banking Transformation',
    slug: 'payswift-core-banking',
    client: 'PaySwift Financial',
    clientIndustry: 'FinTech',
    clientSize: 'Series B (180 employees)',
    summary: 'Engineered high-throughput transactional ledger.',
    challenge: 'Database locks during peak pay-day spikes.',
    approach: 'Partitioned write queues using Redis and MongoDB transactions.',
    solution: 'Event-driven double-entry bookkeeping engine.',
    results: 'Throughput increased by 350% with zero financial drift.',
    coverImage: 'https://images.unsplash.com/cover.jpg',
    images: ['https://images.unsplash.com/arch.png'],
    technologies: ['TypeScript', 'Redis', 'MongoDB', 'Docker'],
    servicesUsed: ['Custom Software Engineering'],
    duration: '8 months',
    teamSize: 5,
    downloadable: true,
    pdfUrl: 'https://downloads.kanzen.tech/payswift.pdf',
    isFeatured: true,
    status: CaseStudyStatus.PUBLISHED,
    metrics: [
      { label: 'Throughput', value: '12,000 TPS', description: 'Peak volume' },
    ],
  };

  it('maps DTO to CaseStudyEntity correctly', () => {
    const entity = CaseStudyMapper.toEntity(mockDto);

    expect(entity.id).toBe('cs_100');
    expect(entity.title).toBe('PaySwift Core Banking Transformation');
    expect(entity.client).toBe('PaySwift Financial');
    expect(entity.clientIndustry).toBe('FinTech');
    expect(entity.status).toBe(CaseStudyStatus.PUBLISHED);
    expect(entity.downloadable).toBe(true);
    expect(entity.pdfUrl).toBe('https://downloads.kanzen.tech/payswift.pdf');
    expect(entity.metrics).toHaveLength(1);
    expect(entity.metrics[0].value).toBe('12,000 TPS');
  });

  it('handles fallback defaults on empty DTO', () => {
    const entity = CaseStudyMapper.toEntity({} as CaseStudyResponseDto);

    expect(entity.id).toBe('');
    expect(entity.title).toBe('');
    expect(entity.clientIndustry).toBe('');
    expect(entity.status).toBe(CaseStudyStatus.DRAFT);
    expect(entity.downloadable).toBe(false);
    expect(entity.metrics).toEqual([]);
  });

  it('maps paginated list accurately', () => {
    const paginated = CaseStudyMapper.toPaginated({
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
  });
});
