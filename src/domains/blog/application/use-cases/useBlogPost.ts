import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../../infrastructure/blog.api';
import { blogMapper } from '../../infrastructure/blog.mapper';
import type { BlogPostEntity } from '../../domain/entities/blog-post.entity';

export function useBlogPost(slugOrId?: string, isId = false) {
  return useQuery<BlogPostEntity>({
    queryKey: ['blog-post', isId ? 'id' : 'slug', slugOrId],
    queryFn: async () => {
      if (!slugOrId) throw new Error('Missing post identifier');
      const dto = isId
        ? await blogApi.getAdminById(slugOrId)
        : await blogApi.getBySlug(slugOrId);
      return blogMapper.toEntity(dto);
    },
    enabled: Boolean(slugOrId),
    staleTime: 1000 * 60 * 2,
  });
}
