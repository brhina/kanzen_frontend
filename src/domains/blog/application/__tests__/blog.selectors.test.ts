import { describe, it, expect } from 'vitest';
import {
  filterPostsBySearch,
  filterPostsByCategory,
  getPostEstimatedReadingTime,
} from '../blog.selectors';
import type { BlogPostEntity } from '../../domain/entities/blog-post.entity';
import { BlogPostStatus } from '../../domain/enums/blog-post-status.enum';

const mockPosts: BlogPostEntity[] = [
  {
    id: '1',
    title: 'High-Throughput Kafka Pipelines',
    slug: 'high-throughput-kafka',
    excerpt: 'Stream processing patterns for massive concurrency.',
    content: 'Full body content',
    author: 'u1',
    categoryId: 'cat-data',
    tags: ['kafka', 'streaming'],
    readingTime: 5,
    viewCount: 100,
    likeCount: 10,
    isFeatured: true,
    allowComments: true,
    status: BlogPostStatus.PUBLISHED,
  },
  {
    id: '2',
    title: 'NextJS 15 React Server Architecture',
    slug: 'nextjs-15-architecture',
    excerpt: 'Deep dive into hydration and streaming render.',
    content: 'Full body content',
    author: 'u2',
    categoryId: 'cat-frontend',
    tags: ['react', 'nextjs'],
    readingTime: 4,
    viewCount: 200,
    likeCount: 20,
    isFeatured: false,
    allowComments: true,
    status: BlogPostStatus.PUBLISHED,
  },
];

describe('blog selectors', () => {
  it('filters posts by search query (title, excerpt, tag)', () => {
    const kafkaResult = filterPostsBySearch(mockPosts, 'kafka');
    expect(kafkaResult).toHaveLength(1);
    expect(kafkaResult[0].id).toBe('1');

    const renderResult = filterPostsBySearch(mockPosts, 'hydration');
    expect(renderResult).toHaveLength(1);
    expect(renderResult[0].id).toBe('2');

    const emptyResult = filterPostsBySearch(mockPosts, '');
    expect(emptyResult).toHaveLength(2);
  });

  it('filters posts by category', () => {
    const dataPosts = filterPostsByCategory(mockPosts, 'cat-data');
    expect(dataPosts).toHaveLength(1);
    expect(dataPosts[0].slug).toBe('high-throughput-kafka');

    const allPosts = filterPostsByCategory(mockPosts, 'all');
    expect(allPosts).toHaveLength(2);
  });

  it('calculates estimated reading time accurately', () => {
    const words400 = new Array(400).fill('word').join(' ');
    expect(getPostEstimatedReadingTime(words400)).toBe(2);

    const words100 = new Array(100).fill('word').join(' ');
    expect(getPostEstimatedReadingTime(words100)).toBe(1);
  });
});
