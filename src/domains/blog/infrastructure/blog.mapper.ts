import type { BlogPostEntity } from '../domain/entities/blog-post.entity';
import type { BlogCategoryEntity } from '../domain/entities/blog-category.entity';
import { BlogPostStatus } from '../domain/enums/blog-post-status.enum';
import { BlogCategoryStatus } from '../domain/enums/blog-category-status.enum';
import type {
  BlogPostResponseDto,
  BlogCategoryResponseDto,
  PaginatedBlogPostsResponseDto,
} from './blog.dto';

export const blogMapper = {
  toEntity(dto: BlogPostResponseDto | { data: BlogPostResponseDto }): BlogPostEntity {
    const raw = (dto && 'data' in dto && dto.data ? dto.data : dto) as BlogPostResponseDto;
    if (!raw) {
      return {
        id: '',
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: undefined,
        author: '',
        authorName: undefined,
        authorAvatar: undefined,
        categoryId: undefined,
        categoryName: undefined,
        tags: [],
        readingTime: 1,
        viewCount: 0,
        likeCount: 0,
        isFeatured: false,
        allowComments: true,
        status: BlogPostStatus.DRAFT,
        publishedAt: undefined,
        scheduledAt: undefined,
        seo: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
    }

    return {
      id: raw.id || '',
      title: raw.title || '',
      slug: raw.slug || '',
      excerpt: raw.excerpt || '',
      content: raw.content || '',
      coverImage: raw.coverImage,
      author: raw.author || '',
      authorName: raw.authorName || 'Kanzen Editorial',
      authorAvatar: raw.authorAvatar,
      categoryId: raw.categoryId,
      categoryName: raw.categoryName,
      tags: Array.isArray(raw.tags) ? raw.tags : [],
      readingTime: raw.readingTime ?? 1,
      viewCount: raw.viewCount ?? 0,
      likeCount: raw.likeCount ?? 0,
      isFeatured: Boolean(raw.isFeatured),
      allowComments: raw.allowComments ?? true,
      status: (raw.status as BlogPostStatus) || BlogPostStatus.DRAFT,
      publishedAt: raw.publishedAt,
      scheduledAt: raw.scheduledAt,
      seo: raw.seo,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  },

  toCategoryEntity(dto: BlogCategoryResponseDto | { data: BlogCategoryResponseDto }): BlogCategoryEntity {
    const raw = (dto && 'data' in dto && dto.data ? dto.data : dto) as BlogCategoryResponseDto;
    if (!raw) {
      return {
        id: '',
        name: '',
        slug: '',
        description: undefined,
        coverImage: undefined,
        order: 0,
        status: BlogCategoryStatus.ACTIVE,
        createdAt: undefined,
        updatedAt: undefined,
      };
    }

    return {
      id: raw.id || '',
      name: raw.name || '',
      slug: raw.slug || '',
      description: raw.description,
      coverImage: raw.coverImage,
      order: raw.order ?? 0,
      status: (raw.status as BlogCategoryStatus) || BlogCategoryStatus.ACTIVE,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  },

  toPaginated(dto: PaginatedBlogPostsResponseDto): {
    posts: BlogPostEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    const data = Array.isArray(dto?.data) ? dto.data : [];
    return {
      posts: data.map((post) => this.toEntity(post)),
      total: dto?.meta?.pagination?.total ?? data.length,
      page: dto?.meta?.pagination?.page ?? 1,
      limit: dto?.meta?.pagination?.limit ?? 20,
      totalPages: dto?.meta?.pagination?.totalPages ?? 1,
    };
  },
};
