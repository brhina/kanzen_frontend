import type { BlogPostStatus } from '../domain/enums/blog-post-status.enum';
import type { BlogCategoryStatus } from '../domain/enums/blog-category-status.enum';
import type { SeoMeta } from '../domain/value-objects/seo-meta.vo';

export interface BlogPostResponseDto {
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
  tags?: string[];
  readingTime?: number;
  viewCount?: number;
  likeCount?: number;
  isFeatured?: boolean;
  allowComments?: boolean;
  status: BlogPostStatus;
  publishedAt?: string;
  scheduledAt?: string;
  seo?: SeoMeta;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogCategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  order?: number;
  status: BlogCategoryStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBlogPostDto {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  authorName?: string;
  authorAvatar?: string;
  categoryId?: string;
  tags?: string[];
  isFeatured?: boolean;
  allowComments?: boolean;
  status?: BlogPostStatus;
  scheduledAt?: string;
  seo?: SeoMeta;
}

export type UpdateBlogPostDto = Partial<CreateBlogPostDto>;

export interface PublishBlogPostDto {
  status?: BlogPostStatus;
  scheduledAt?: string;
}

export interface CreateBlogCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  coverImage?: string;
  order?: number;
  status?: BlogCategoryStatus;
}

export type UpdateBlogCategoryDto = Partial<CreateBlogCategoryDto>;

export interface FilterBlogPostsDto {
  status?: BlogPostStatus | string;
  categoryId?: string;
  tag?: string;
  author?: string;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedBlogPostsResponseDto {
  data: BlogPostResponseDto[];
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface CategoryWithBlogPostsResponseDto {
  category: BlogCategoryResponseDto;
  data: BlogPostResponseDto[];
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
