import { describe, it, expect } from 'vitest';
import { blogMapper } from '../blog.mapper';
import { BlogPostStatus } from '../../domain/enums/blog-post-status.enum';
import { BlogCategoryStatus } from '../../domain/enums/blog-category-status.enum';
import type { BlogPostResponseDto, BlogCategoryResponseDto } from '../blog.dto';

describe('blogMapper', () => {
  it('maps BlogPostResponseDto to domain BlogPostEntity', () => {
    const dto: BlogPostResponseDto = {
      id: 'blog-1',
      title: 'Architecting Event-Driven Systems',
      slug: 'architecting-event-driven-systems',
      excerpt: 'Guide to scaling Kafka and RabbitMQ pipelines.',
      content: '<h1>Deep dive</h1><p>Event sourcing content</p>',
      coverImage: 'https://cdn.kanzen.tech/img.jpg',
      author: 'user-1',
      authorName: 'Alex Mercer',
      authorAvatar: 'https://cdn.kanzen.tech/alex.jpg',
      categoryId: 'cat-1',
      categoryName: 'Architecture',
      tags: ['kafka', 'microservices'],
      readingTime: 6,
      viewCount: 1420,
      likeCount: 88,
      isFeatured: true,
      allowComments: true,
      status: BlogPostStatus.PUBLISHED,
      publishedAt: '2026-10-01T12:00:00.000Z',
    };

    const entity = blogMapper.toEntity(dto);
    expect(entity.id).toBe('blog-1');
    expect(entity.title).toBe('Architecting Event-Driven Systems');
    expect(entity.slug).toBe('architecting-event-driven-systems');
    expect(entity.authorName).toBe('Alex Mercer');
    expect(entity.tags).toEqual(['kafka', 'microservices']);
    expect(entity.status).toBe(BlogPostStatus.PUBLISHED);
    expect(entity.readingTime).toBe(6);
    expect(entity.isFeatured).toBe(true);
  });

  it('handles null/fallback dto gracefully', () => {
    const entity = blogMapper.toEntity(null as any);
    expect(entity.id).toBe('');
    expect(entity.title).toBe('');
    expect(entity.status).toBe(BlogPostStatus.DRAFT);
    expect(entity.tags).toEqual([]);
  });

  it('maps BlogCategoryResponseDto to domain BlogCategoryEntity', () => {
    const catDto: BlogCategoryResponseDto = {
      id: 'cat-1',
      name: 'Cloud & Infrastructure',
      slug: 'cloud-infrastructure',
      description: 'Distributed Kubernetes and cloud engineering patterns.',
      order: 1,
      status: BlogCategoryStatus.ACTIVE,
    };

    const entity = blogMapper.toCategoryEntity(catDto);
    expect(entity.id).toBe('cat-1');
    expect(entity.name).toBe('Cloud & Infrastructure');
    expect(entity.slug).toBe('cloud-infrastructure');
    expect(entity.status).toBe(BlogCategoryStatus.ACTIVE);
  });

  it('maps PaginatedBlogPostsResponseDto to paginated result', () => {
    const paginated = blogMapper.toPaginated({
      data: [
        {
          id: 'p-1',
          title: 'Article 1',
          slug: 'article-1',
          excerpt: 'Short excerpt',
          content: 'Content here',
          author: 'u-1',
          status: BlogPostStatus.PUBLISHED,
        },
      ],
      meta: {
        pagination: {
          total: 10,
          page: 1,
          limit: 1,
          totalPages: 10,
        },
      },
    });

    expect(paginated.posts).toHaveLength(1);
    expect(paginated.posts[0].title).toBe('Article 1');
    expect(paginated.total).toBe(10);
    expect(paginated.totalPages).toBe(10);
  });
});
