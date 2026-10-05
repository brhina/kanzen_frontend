import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type {
  BlogPostResponseDto,
  BlogCategoryResponseDto,
  CategoryWithBlogPostsResponseDto,
  CreateBlogPostDto,
  CreateBlogCategoryDto,
  FilterBlogPostsDto,
  PaginatedBlogPostsResponseDto,
  PublishBlogPostDto,
  UpdateBlogPostDto,
  UpdateBlogCategoryDto,
} from './blog.dto';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const blogApi = {
  /**
   * List published blog posts (Public)
   */
  async listPublic(filter: FilterBlogPostsDto = {}): Promise<PaginatedBlogPostsResponseDto> {
    const searchParams = new URLSearchParams();
    if (filter.status) searchParams.set('status', filter.status);
    if (filter.categoryId) searchParams.set('categoryId', filter.categoryId);
    if (filter.tag) searchParams.set('tag', filter.tag);
    if (filter.author) searchParams.set('author', filter.author);
    if (filter.isFeatured !== undefined) searchParams.set('isFeatured', String(filter.isFeatured));
    if (filter.search) searchParams.set('search', filter.search);
    if (filter.page) searchParams.set('page', String(filter.page));
    if (filter.limit) searchParams.set('limit', String(filter.limit));
    if (filter.sortBy) searchParams.set('sortBy', filter.sortBy);
    if (filter.sortOrder) searchParams.set('sortOrder', filter.sortOrder);

    return apiClient
      .get(API_ENDPOINTS.blog.list, { searchParams })
      .json<PaginatedBlogPostsResponseDto>();
  },

  /**
   * List featured blog articles (Public)
   */
  async listFeatured(): Promise<BlogPostResponseDto[]> {
    const res = await apiClient
      .get(API_ENDPOINTS.blog.featured)
      .json<ApiResponse<BlogPostResponseDto[]> | BlogPostResponseDto[]>();
    return unwrapResponse(res);
  },

  /**
   * List active blog categories (Public)
   */
  async listCategories(): Promise<BlogCategoryResponseDto[]> {
    const res = await apiClient
      .get(API_ENDPOINTS.blog.categories)
      .json<ApiResponse<BlogCategoryResponseDto[]> | BlogCategoryResponseDto[]>();
    return unwrapResponse(res);
  },

  /**
   * List blog articles by category slug (Public)
   */
  async getByCategorySlug(
    slug: string,
    filter: FilterBlogPostsDto = {},
  ): Promise<CategoryWithBlogPostsResponseDto> {
    const searchParams = new URLSearchParams();
    if (filter.search) searchParams.set('search', filter.search);
    if (filter.page) searchParams.set('page', String(filter.page));
    if (filter.limit) searchParams.set('limit', String(filter.limit));

    return apiClient
      .get(API_ENDPOINTS.blog.category(slug), { searchParams })
      .json<CategoryWithBlogPostsResponseDto>();
  },

  /**
   * Get single blog post by slug and increment view count (Public)
   */
  async getBySlug(slug: string): Promise<BlogPostResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.blog.detail(slug))
      .json<ApiResponse<BlogPostResponseDto> | BlogPostResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Like a blog post by slug (Public)
   */
  async like(slug: string): Promise<BlogPostResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.blog.like(slug))
      .json<ApiResponse<BlogPostResponseDto> | BlogPostResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * List all blog posts with admin filters (Admin)
   */
  async listAdmin(filter: FilterBlogPostsDto = {}): Promise<PaginatedBlogPostsResponseDto> {
    const searchParams = new URLSearchParams();
    if (filter.status) searchParams.set('status', filter.status);
    if (filter.categoryId) searchParams.set('categoryId', filter.categoryId);
    if (filter.search) searchParams.set('search', filter.search);
    if (filter.page) searchParams.set('page', String(filter.page));
    if (filter.limit) searchParams.set('limit', String(filter.limit));
    if (filter.sortBy) searchParams.set('sortBy', filter.sortBy);
    if (filter.sortOrder) searchParams.set('sortOrder', filter.sortOrder);

    return apiClient
      .get(API_ENDPOINTS.blog.adminList, { searchParams })
      .json<PaginatedBlogPostsResponseDto>();
  },

  /**
   * Get post details by ID (Admin)
   */
  async getAdminById(id: string): Promise<BlogPostResponseDto> {
    const res = await apiClient
      .get(API_ENDPOINTS.blog.adminDetail(id))
      .json<ApiResponse<BlogPostResponseDto> | BlogPostResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Create a new blog post (Admin)
   */
  async create(dto: CreateBlogPostDto): Promise<BlogPostResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.blog.adminCreate, { json: dto })
      .json<ApiResponse<BlogPostResponseDto> | BlogPostResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update existing blog post (Admin)
   */
  async update(id: string, dto: UpdateBlogPostDto): Promise<BlogPostResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.blog.adminUpdate(id), { json: dto })
      .json<ApiResponse<BlogPostResponseDto> | BlogPostResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Publish or schedule a blog post (Admin)
   */
  async publish(id: string, dto: PublishBlogPostDto): Promise<BlogPostResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.blog.adminPublish(id), { json: dto })
      .json<ApiResponse<BlogPostResponseDto> | BlogPostResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete a blog post (Admin)
   */
  async delete(id: string): Promise<{ success?: boolean }> {
    const res = await apiClient
      .delete(API_ENDPOINTS.blog.adminDelete(id))
      .json<ApiResponse<{ success?: boolean }> | { success?: boolean }>();
    return unwrapResponse(res);
  },

  /**
   * Create a blog category (Admin)
   */
  async createCategory(dto: CreateBlogCategoryDto): Promise<BlogCategoryResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.blog.adminCategoryCreate, { json: dto })
      .json<ApiResponse<BlogCategoryResponseDto> | BlogCategoryResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Update a blog category (Admin)
   */
  async updateCategory(id: string, dto: UpdateBlogCategoryDto): Promise<BlogCategoryResponseDto> {
    const res = await apiClient
      .patch(API_ENDPOINTS.blog.adminCategoryUpdate(id), { json: dto })
      .json<ApiResponse<BlogCategoryResponseDto> | BlogCategoryResponseDto>();
    return unwrapResponse(res);
  },

  /**
   * Delete a blog category (Admin)
   */
  async deleteCategory(id: string): Promise<{ success?: boolean }> {
    const res = await apiClient
      .delete(API_ENDPOINTS.blog.adminCategoryDelete(id))
      .json<ApiResponse<{ success?: boolean }> | { success?: boolean }>();
    return unwrapResponse(res);
  },
};
