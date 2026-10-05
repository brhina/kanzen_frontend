import { describe, it, expect } from 'vitest';
import { TestimonialMapper } from '../testimonials.mapper';
import { TestimonialStatus } from '../../domain/enums/testimonial-status.enum';
import type { TestimonialResponseDto } from '../testimonials.dto';

describe('TestimonialMapper', () => {
  const mockDto: TestimonialResponseDto = {
    _id: 'test_123',
    author: 'David Sterling',
    role: 'Chief Technology Officer',
    company: 'PaySwift Financial',
    companyLogo: 'https://cdn.kanzen.tech/payswift.svg',
    avatar: 'https://images.unsplash.com/david.jpg',
    content: 'Kanzen Tech transformed our payments engine into a competitive advantage.',
    rating: 5,
    videoUrl: 'https://youtube.com/watch?v=mock',
    isFeatured: true,
    isVerified: true,
    status: TestimonialStatus.APPROVED,
    order: 1,
    source: 'direct',
    publishedAt: '2026-09-01T00:00:00.000Z',
  };

  it('maps DTO to TestimonialEntity accurately', () => {
    const entity = TestimonialMapper.toEntity(mockDto);

    expect(entity.id).toBe('test_123');
    expect(entity.author).toBe('David Sterling');
    expect(entity.role).toBe('Chief Technology Officer');
    expect(entity.company).toBe('PaySwift Financial');
    expect(entity.rating).toBe(5);
    expect(entity.isVerified).toBe(true);
    expect(entity.isFeatured).toBe(true);
    expect(entity.status).toBe(TestimonialStatus.APPROVED);
    expect(entity.source).toBe('direct');
  });

  it('handles fallback defaults on empty DTO', () => {
    const entity = TestimonialMapper.toEntity({} as TestimonialResponseDto);

    expect(entity.id).toBe('');
    expect(entity.author).toBe('');
    expect(entity.rating).toBe(5);
    expect(entity.status).toBe(TestimonialStatus.PENDING);
    expect(entity.isFeatured).toBe(false);
    expect(entity.isVerified).toBe(false);
  });

  it('maps paginated testimonials list accurately', () => {
    const paginated = TestimonialMapper.toPaginated({
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
