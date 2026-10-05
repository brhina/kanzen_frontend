import type { BlogPostEntity } from '../domain/entities/blog-post.entity';

export function filterPostsBySearch(posts: BlogPostEntity[], query: string): BlogPostEntity[] {
  if (!query.trim()) return posts;
  const q = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q)),
  );
}

export function filterPostsByCategory(
  posts: BlogPostEntity[],
  categoryId?: string,
): BlogPostEntity[] {
  if (!categoryId || categoryId === 'all') return posts;
  return posts.filter((post) => post.categoryId === categoryId);
}

export function getPostEstimatedReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
