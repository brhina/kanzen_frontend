import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { CaseStudyCard } from '../components/CaseStudyCard';
import { CaseStudyStatus } from '../../domain/enums/case-study-status.enum';
import type { CaseStudyEntity } from '../../domain/entities/case-study.entity';

describe('CaseStudyCard', () => {
  const mockStudy: CaseStudyEntity = {
    id: 'cs_1',
    title: 'Instant-Settlement Core Banking Engine',
    slug: 'instant-settlement-core-banking',
    client: 'PaySwift Financial',
    clientIndustry: 'FinTech',
    clientSize: 'Series B',
    summary: 'Architected high-throughput transactional ledger.',
    challenge: 'Transaction timeouts during pay-day spikes.',
    approach: 'Event-driven partitioning.',
    solution: 'Redis & Mongo sessions.',
    results: 'Throughput increased by 350%.',
    coverImage: 'https://images.unsplash.com/cover.jpg',
    images: [],
    technologies: ['TypeScript', 'Redis', 'Docker'],
    servicesUsed: ['Custom Software'],
    downloadable: true,
    pdfUrl: 'https://downloads.kanzen.tech/study.pdf',
    isFeatured: true,
    status: CaseStudyStatus.PUBLISHED,
    metrics: [
      { label: 'Throughput', value: '12,000 TPS' },
    ],
  };

  it('renders title, client name, industry, and metrics preview', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <CaseStudyCard study={mockStudy} />
      </MemoryRouter>,
    );

    expect(html).toContain('Instant-Settlement Core Banking Engine');
    expect(html).toContain('PaySwift Financial');
    expect(html).toContain('FinTech');
    expect(html).toContain('12,000 TPS');
    expect(html).toContain('PDF');
  });

  it('renders read deep dive link', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <CaseStudyCard study={mockStudy} />
      </MemoryRouter>,
    );

    expect(html).toContain('Read Deep Dive');
    expect(html).toContain('/case-studies/instant-settlement-core-banking');
  });
});
