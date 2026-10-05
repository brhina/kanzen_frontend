import { describe, it, expect } from 'vitest';
import { NewsletterMapper } from '../newsletter.mapper';
import { NewsletterSubscriberStatus } from '../../domain/enums/newsletter-status.enum';
import type { NewsletterSubscriberResponseDto } from '../newsletter.dto';

describe('NewsletterMapper', () => {
  const mockDto: NewsletterSubscriberResponseDto = {
    id: 'sub-100',
    email: 'architect@fintechflow.io',
    firstName: 'Julian',
    source: 'blog_post',
    tags: ['engineering', 'fintech'],
    isConfirmed: true,
    status: NewsletterSubscriberStatus.ACTIVE,
    createdAt: '2026-10-01T12:00:00Z',
  };

  it('maps DTO to NewsletterSubscriberEntity correctly', () => {
    const entity = NewsletterMapper.toEntity(mockDto);

    expect(entity.id).toBe('sub-100');
    expect(entity.email).toBe('architect@fintechflow.io');
    expect(entity.firstName).toBe('Julian');
    expect(entity.tags).toEqual(['engineering', 'fintech']);
    expect(entity.isConfirmed).toBe(true);
    expect(entity.status).toBe(NewsletterSubscriberStatus.ACTIVE);
  });

  it('maps paginated subscribers correctly', () => {
    const paginated = NewsletterMapper.toPaginated({
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

    expect(paginated.items.length).toBe(1);
    expect(paginated.total).toBe(1);
  });
});
