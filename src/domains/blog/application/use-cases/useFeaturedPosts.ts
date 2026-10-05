import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../../infrastructure/blog.api';
import { blogMapper } from '../../infrastructure/blog.mapper';
import type { BlogPostEntity } from '../../domain/entities/blog-post.entity';

export function useFeaturedPosts() {
  return useQuery<BlogPostEntity[]>({
    queryKey: ['blog', 'featured'],
    queryFn: async () => {
      const dtos = await blogApi.listFeatured();
      return dtos.map((dto) => blogMapper.toEntity(dto));
    },
    staleTime: 1000 * 60 * 5,
  });
}
