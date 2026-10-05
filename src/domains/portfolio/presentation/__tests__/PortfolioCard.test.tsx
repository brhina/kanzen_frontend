import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { PortfolioCard } from '../components/PortfolioCard';
import { PortfolioCategory } from '../../domain/enums/portfolio-category.enum';
import { PortfolioItemStatus } from '../../domain/enums/portfolio-status.enum';
import type { PortfolioItemEntity } from '../../domain/entities/portfolio-item.entity';

describe('PortfolioCard', () => {
  const mockItem: PortfolioItemEntity = {
    id: 'port_1',
    title: 'Distributed Event Broker',
    slug: 'distributed-event-broker',
    subtitle: 'High-throughput Kafka streaming',
    client: 'Fintech Global',
    description: 'Processes 500,000 events/second with exactly-once delivery guarantees.',
    coverImage: 'https://images.unsplash.com/cover.jpg',
    images: [],
    category: PortfolioCategory.ENTERPRISE,
    services: ['Core Infrastructure'],
    technologies: ['Go', 'Kafka', 'Kubernetes'],
    isFeatured: true,
    isConfidential: false,
    order: 0,
    status: PortfolioItemStatus.PUBLISHED,
    metrics: [
      { label: 'Throughput', value: '500k eps', icon: 'zap' },
    ],
  };

  it('renders project title, client, and technology chips', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <PortfolioCard item={mockItem} />
      </MemoryRouter>,
    );

    expect(html).toContain('Distributed Event Broker');
    expect(html).toContain('Fintech Global');
    expect(html).toContain('Kafka');
    expect(html).toContain('Enterprise Core');
    expect(html).toContain('500k eps');
  });

  it('renders NDA badge when project is confidential', () => {
    const confidentialItem: PortfolioItemEntity = {
      ...mockItem,
      isConfidential: true,
    };

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <PortfolioCard item={confidentialItem} />
      </MemoryRouter>,
    );

    expect(html).toContain('NDA');
  });
});
