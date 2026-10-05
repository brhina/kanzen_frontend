import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../../infrastructure/blog.api';
import { blogMapper } from '../../infrastructure/blog.mapper';
import type { BlogPostEntity } from '../../domain/entities/blog-post.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export function useLikeBlogPost() {
  const queryClient = useQueryClient();

  return useMutation<BlogPostEntity, Error, string>({
    mutationFn: async (slug: string) => {
      const response = await blogApi.like(slug);
      return blogMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['blog-post', 'slug', data.slug], data);
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      toast.success('Thank you for liking this article!', 'Article Liked');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to like article', 'Error');
    },
  });
}
