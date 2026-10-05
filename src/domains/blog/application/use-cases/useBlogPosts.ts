import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../../infrastructure/blog.api';
import { blogMapper } from '../../infrastructure/blog.mapper';
import type { FilterBlogPostsDto } from '../../infrastructure/blog.dto';
import type { BlogPostEntity } from '../../domain/entities/blog-post.entity';

export interface UseBlogPostsOptions extends FilterBlogPostsDto {
  isAdminView?: boolean;
  enabled?: boolean;
}

export interface UseBlogPostsResult {
  posts: BlogPostEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useBlogPosts({
  isAdminView = false,
  enabled = true,
  ...filter
}: UseBlogPostsOptions = {}) {
  return useQuery<UseBlogPostsResult>({
    queryKey: ['blog', isAdminView ? 'admin' : 'public', filter],
    queryFn: async () => {
      const response = isAdminView
        ? await blogApi.listAdmin(filter)
        : await blogApi.listPublic(filter);
      return blogMapper.toPaginated(response);
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
