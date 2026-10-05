import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { TestimonialCard } from '../components/TestimonialCard';
import { TestimonialStatus } from '../../domain/enums/testimonial-status.enum';
import type { TestimonialEntity } from '../../domain/entities/testimonial.entity';

describe('TestimonialCard', () => {
  const mockTestimonial: TestimonialEntity = {
    id: 't_1',
    author: 'Sarah Connor',
    role: 'Head of Engineering',
    company: 'Skynet Security',
    content: 'Kanzen Tech engineered an infallible resilient mesh network.',
    rating: 5,
    isFeatured: true,
    isVerified: true,
    status: TestimonialStatus.APPROVED,
    order: 0,
  };

  it('renders author, role, company, quote, and verified badge', () => {
    const html = renderToStaticMarkup(<TestimonialCard testimonial={mockTestimonial} />);

    expect(html).toContain('Sarah Connor');
    expect(html).toContain('Head of Engineering');
    expect(html).toContain('Skynet Security');
    expect(html).toContain('Kanzen Tech engineered an infallible resilient mesh network.');
    expect(html).toContain('Verified Client');
  });

  it('renders moderation actions when canModerate is true and status is pending', () => {
    const pendingTestimonial: TestimonialEntity = {
      ...mockTestimonial,
      status: TestimonialStatus.PENDING,
      isVerified: false,
    };

    const html = renderToStaticMarkup(
      <TestimonialCard testimonial={pendingTestimonial} canModerate={true} />,
    );

    expect(html).toContain('Pending Review');
    expect(html).toContain('Approve');
    expect(html).toContain('Reject');
  });
});
