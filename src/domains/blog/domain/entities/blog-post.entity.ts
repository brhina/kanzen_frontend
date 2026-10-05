import type { BlogPostStatus } from '../enums/blog-post-status.enum';
import type { SeoMeta } from '../value-objects/seo-meta.vo';

export interface BlogPostEntity {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  authorName?: string;
  authorAvatar?: string;
  categoryId?: string;
  categoryName?: string;
  tags: string[];
  readingTime: number;
  viewCount: number;
  likeCount: number;
  isFeatured: boolean;
  allowComments: boolean;
  status: BlogPostStatus;
  publishedAt?: string;
  scheduledAt?: string;
  seo?: SeoMeta;
  createdAt?: string;
  updatedAt?: string;
}
